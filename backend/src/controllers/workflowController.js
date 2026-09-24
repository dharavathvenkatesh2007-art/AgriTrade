import {
  Inventory,
  InventoryMovement,
  LotAllocation,
  Notification,
  ProduceLot,
  PurchaseOrder,
  QualityInspection,
  Settlement,
  Shipment,
  Vehicle
} from "../models/index.js";
import { roles } from "../utils/constants.js";
import { ApiError, asyncHandler, sendSuccess } from "../utils/errors.js";
import { audit } from "../services/audit.js";
import { assertTransition, calculateSettlement, lotTransitions, shipmentTransitions } from "../services/workflows.js";

function pushHistory(doc, req, nextStatus, reason, operation) {
  doc.statusHistory ||= [];
  doc.statusHistory.push({ previousStatus: doc.status, newStatus: nextStatus, changedBy: req.user._id, reason, operation });
  doc.status = nextStatus;
}

export const receiveLot = asyncHandler(async (req, res) => {
  const lot = await ProduceLot.findById(req.params.id);
  if (!lot) throw new ApiError(404, "Lot not found", "LOT_NOT_FOUND");
  assertTransition(lotTransitions, lot.status, "RECEIVED");
  pushHistory(lot, req, "RECEIVED", req.body.remarks, "RECEIVE_LOT");
  lot.referenceCode = lot.referenceCode || `QR-${lot.lotNumber}`;
  await lot.save();
  await audit(req, "RECEIVE_LOT", "lots", "ProduceLot", lot._id, "CREATED", "RECEIVED");
  await Notification.create({ user: lot.farmer, title: "Produce received", message: `${lot.lotNumber} has been received at the collection center.`, type: "SUCCESS" });
  sendSuccess(res, lot, "Lot received");
});

export const sendToInspection = asyncHandler(async (req, res) => {
  const lot = await ProduceLot.findById(req.params.id);
  if (!lot) throw new ApiError(404, "Lot not found", "LOT_NOT_FOUND");
  assertTransition(lotTransitions, lot.status, "INSPECTION_PENDING");
  pushHistory(lot, req, "INSPECTION_PENDING", req.body.remarks, "SEND_TO_INSPECTION");
  await lot.save();
  sendSuccess(res, lot, "Lot moved to inspection");
});

export const inspectLot = asyncHandler(async (req, res) => {
  const lot = await ProduceLot.findById(req.params.id);
  if (!lot) throw new ApiError(404, "Lot not found", "LOT_NOT_FOUND");
  if (![roles.INSPECTOR, roles.ADMIN].includes(req.user.role)) throw new ApiError(403, "Only inspectors can record quality results", "FORBIDDEN");
  if (!["INSPECTION_PENDING", "INSPECTED"].includes(lot.status)) throw new ApiError(409, "Lot is not awaiting inspection", "INVALID_LOT_STATUS");
  const inspection = await QualityInspection.create({ ...req.body, lot: lot._id, inspector: req.user._id, organization: lot.organization, region: lot.region });
  if (lot.status === "INSPECTION_PENDING") pushHistory(lot, req, "INSPECTED", req.body.remarks, "INSPECT_LOT");
  lot.grade = inspection.grade;
  await lot.save();
  await audit(req, "INSPECT_LOT", "inspections", "QualityInspection", inspection._id, null, inspection.toObject());
  sendSuccess(res, { lot, inspection }, "Inspection recorded", 201);
});

export const acceptLot = asyncHandler(async (req, res) => {
  const lot = await ProduceLot.findById(req.params.id);
  if (!lot) throw new ApiError(404, "Lot not found", "LOT_NOT_FOUND");
  assertTransition(lotTransitions, lot.status, "ACCEPTED");
  const acceptedQuantity = Number(req.body.acceptedQuantity || lot.submittedQuantity);
  if (acceptedQuantity > lot.submittedQuantity) throw new ApiError(422, "Accepted quantity cannot exceed submitted quantity", "INVALID_QUANTITY");
  pushHistory(lot, req, "ACCEPTED", req.body.remarks, "ACCEPT_LOT");
  lot.acceptedQuantity = acceptedQuantity;
  lot.availableQuantity = acceptedQuantity;
  await lot.save();
  await audit(req, "ACCEPT_LOT", "lots", "ProduceLot", lot._id, "INSPECTED", "ACCEPTED");
  sendSuccess(res, lot, "Lot accepted");
});

export const rejectLot = asyncHandler(async (req, res) => {
  const lot = await ProduceLot.findById(req.params.id);
  if (!lot) throw new ApiError(404, "Lot not found", "LOT_NOT_FOUND");
  if (!["INSPECTION_PENDING", "INSPECTED"].includes(lot.status)) throw new ApiError(409, "Only inspection lots can be rejected", "INVALID_LOT_STATUS");
  pushHistory(lot, req, "REJECTED", req.body.reason, "REJECT_LOT");
  lot.acceptedQuantity = 0;
  lot.availableQuantity = 0;
  lot.grade = "Rejected";
  await lot.save();
  await audit(req, "REJECT_LOT", "lots", "ProduceLot", lot._id, null, "REJECTED");
  sendSuccess(res, lot, "Lot rejected");
});

export const storeLot = asyncHandler(async (req, res) => {
  const lot = await ProduceLot.findById(req.params.id);
  if (!lot) throw new ApiError(404, "Lot not found", "LOT_NOT_FOUND");
  assertTransition(lotTransitions, lot.status, "STORED");
  pushHistory(lot, req, "STORED", req.body.remarks, "STORE_LOT");
  lot.warehouse = req.body.warehouse;
  lot.storageLocation = req.body.storageLocation;
  await lot.save();
  const inventory = await Inventory.create({
    lot: lot._id,
    produceCategory: lot.produceCategory,
    warehouse: req.body.warehouse,
    storageLocation: req.body.storageLocation,
    quantity: lot.acceptedQuantity,
    unit: lot.unit,
    organization: lot.organization,
    region: lot.region
  });
  await InventoryMovement.create({ inventory: inventory._id, lot: lot._id, type: "STORAGE", quantity: lot.acceptedQuantity, actor: req.user._id, organization: lot.organization, region: lot.region });
  sendSuccess(res, { lot, inventory }, "Lot stored");
});

export const allocatePo = asyncHandler(async (req, res) => {
  const po = await PurchaseOrder.findById(req.params.id);
  if (!po) throw new ApiError(404, "Purchase order not found", "PO_NOT_FOUND");
  const { lotId, lineItemId, quantity } = req.body;
  const lot = await ProduceLot.findById(lotId);
  if (!lot) throw new ApiError(404, "Lot not found", "LOT_NOT_FOUND");
  if (!["ACCEPTED", "STORED"].includes(lot.status)) throw new ApiError(409, "Only accepted or stored lots can be allocated", "INVALID_LOT_STATUS");
  if (lot.availableQuantity < quantity) throw new ApiError(422, "Allocation exceeds available accepted quantity", "INSUFFICIENT_INVENTORY");
  const line = po.lineItems.id(lineItemId) || po.lineItems[0];
  if (!line) throw new ApiError(422, "Purchase order line item is required", "LINE_ITEM_REQUIRED");
  if (line.allocatedQuantity + quantity > line.requiredQuantity) throw new ApiError(422, "Allocation exceeds purchase order quantity", "PO_QUANTITY_EXCEEDED");
  lot.availableQuantity -= quantity;
  if (lot.status === "STORED") pushHistory(lot, req, "ALLOCATED", "Allocated to purchase order", "ALLOCATE_LOT");
  line.allocatedQuantity += quantity;
  po.status = line.allocatedQuantity >= line.requiredQuantity ? "FULLY_ALLOCATED" : "PARTIALLY_ALLOCATED";
  po.orderHistory.push({ previousStatus: "APPROVED", newStatus: po.status, changedBy: req.user._id, operation: "ALLOCATE_PO" });
  const allocation = await LotAllocation.create({
    purchaseOrder: po._id,
    lineItemId: line._id,
    lot: lot._id,
    farmer: lot.farmer,
    quantity,
    unitPrice: line.unitPrice,
    organization: lot.organization,
    region: lot.region
  });
  await Promise.all([lot.save(), po.save()]);
  await audit(req, "ALLOCATE_PO", "allocations", "LotAllocation", allocation._id, null, allocation.toObject());
  sendSuccess(res, { po, lot, allocation }, "Lot allocated");
});

export const cancelPo = asyncHandler(async (req, res) => {
  const po = await PurchaseOrder.findById(req.params.id);
  if (!po) throw new ApiError(404, "Purchase order not found", "PO_NOT_FOUND");
  po.status = "CANCELLED";
  po.orderHistory.push({ previousStatus: po.status, newStatus: "CANCELLED", changedBy: req.user._id, reason: req.body.reason, operation: "CANCEL_PO" });
  await po.save();
  sendSuccess(res, po, "Purchase order cancelled");
});

export const assignVehicle = asyncHandler(async (req, res) => {
  const shipment = await Shipment.findById(req.params.id);
  if (!shipment) throw new ApiError(404, "Shipment not found", "SHIPMENT_NOT_FOUND");
  const vehicle = await Vehicle.findById(req.body.vehicle);
  if (!vehicle) throw new ApiError(404, "Vehicle not found", "VEHICLE_NOT_FOUND");
  if (vehicle.capacityKg && shipment.quantity > vehicle.capacityKg) throw new ApiError(422, "Shipment exceeds vehicle capacity", "VEHICLE_CAPACITY_EXCEEDED");
  assertTransition(shipmentTransitions, shipment.status, "VEHICLE_ASSIGNED");
  pushHistory(shipment, req, "VEHICLE_ASSIGNED", req.body.remarks, "ASSIGN_VEHICLE");
  shipment.vehicle = vehicle._id;
  shipment.driver = req.body.driver || vehicle.driver;
  vehicle.status = "ASSIGNED";
  await Promise.all([shipment.save(), vehicle.save()]);
  sendSuccess(res, shipment, "Vehicle assigned");
});

export const dispatchShipment = asyncHandler(async (req, res) => transitionShipment(req, res, "DISPATCHED", "DISPATCH_SHIPMENT"));
export const inTransitShipment = asyncHandler(async (req, res) => transitionShipment(req, res, "IN_TRANSIT", "SHIPMENT_IN_TRANSIT"));

export const deliverShipment = asyncHandler(async (req, res) => {
  const shipment = await Shipment.findById(req.params.id).populate("allocations");
  if (!shipment) throw new ApiError(404, "Shipment not found", "SHIPMENT_NOT_FOUND");
  if (!["IN_TRANSIT", "OUT_FOR_DELIVERY"].includes(shipment.status)) throw new ApiError(409, "Shipment is not in delivery state", "INVALID_SHIPMENT_STATUS");
  pushHistory(shipment, req, "DELIVERED", req.body.remarks, "DELIVER_SHIPMENT");
  shipment.actualDeliveryDate = new Date();
  for (const allocation of shipment.allocations) {
    allocation.status = "DELIVERED";
    await allocation.save();
    const lot = await ProduceLot.findById(allocation.lot);
    if (lot && lot.status === "DISPATCHED") {
      pushHistory(lot, req, "DELIVERED", "Shipment delivered", "DELIVER_LOT");
      await lot.save();
    }
    await createSettlementForAllocation(allocation, shipment.purchaseOrder, req);
  }
  await shipment.save();
  sendSuccess(res, shipment, "Shipment delivered and settlements calculated");
});

async function transitionShipment(req, res, status, operation) {
  const shipment = await Shipment.findById(req.params.id).populate("allocations");
  if (!shipment) throw new ApiError(404, "Shipment not found", "SHIPMENT_NOT_FOUND");
  assertTransition(shipmentTransitions, shipment.status, status);
  pushHistory(shipment, req, status, req.body.remarks, operation);
  if (status === "DISPATCHED") {
    shipment.dispatchDate = new Date();
    for (const allocation of shipment.allocations) {
      allocation.status = "DISPATCHED";
      await allocation.save();
      const lot = await ProduceLot.findById(allocation.lot);
      if (lot && lot.status === "ALLOCATED") {
        pushHistory(lot, req, "DISPATCHED", "Shipment dispatched", "DISPATCH_LOT");
        await lot.save();
      }
    }
  }
  await shipment.save();
  sendSuccess(res, shipment, "Shipment updated");
}

async function createSettlementForAllocation(allocation, purchaseOrderId, req) {
  const exists = await Settlement.findOne({ lot: allocation.lot, purchaseOrder: purchaseOrderId });
  if (exists) return exists;
  const lot = await ProduceLot.findById(allocation.lot);
  const qualityAdjustment = lot?.grade === "Grade A" ? 8 : lot?.grade === "Grade B" ? 0 : -5;
  const amounts = calculateSettlement({
    acceptedQuantity: allocation.quantity,
    basePrice: allocation.unitPrice,
    qualityAdjustment,
    deductions: 0,
    transportCharges: 0,
    otherAdjustments: 0
  });
  return Settlement.create({
    settlementNumber: `SET-${Date.now()}-${String(allocation._id).slice(-4)}`,
    farmer: allocation.farmer,
    lot: allocation.lot,
    purchaseOrder: purchaseOrderId,
    acceptedQuantity: allocation.quantity,
    basePrice: allocation.unitPrice,
    qualityAdjustment,
    deductions: 0,
    transportCharges: 0,
    otherAdjustments: 0,
    ...amounts,
    status: "CALCULATED",
    organization: req.user.organization,
    region: req.user.region
  });
}

export const approveSettlement = asyncHandler(async (req, res) => {
  const settlement = await Settlement.findById(req.params.id);
  if (!settlement) throw new ApiError(404, "Settlement not found", "SETTLEMENT_NOT_FOUND");
  settlement.status = "APPROVED";
  await settlement.save();
  sendSuccess(res, settlement, "Settlement approved");
});

export const paySettlement = asyncHandler(async (req, res) => {
  const settlement = await Settlement.findById(req.params.id);
  if (!settlement) throw new ApiError(404, "Settlement not found", "SETTLEMENT_NOT_FOUND");
  settlement.status = "PAID";
  settlement.paymentReference = req.body.paymentReference || `PAY-${Date.now()}`;
  settlement.settlementDate = new Date();
  await settlement.save();
  sendSuccess(res, settlement, "Settlement paid");
});
