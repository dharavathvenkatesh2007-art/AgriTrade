import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { Inventory, LotAllocation, ProduceLot, PurchaseOrder, Settlement, Shipment } from "../models/index.js";
import { scopedQuery } from "../middleware/auth.js";
import { asyncHandler, sendSuccess } from "../utils/errors.js";

const router = Router();

router.get("/summary", authenticate, asyncHandler(async (req, res) => {
  const scope = scopedQuery(req);
  const [lots, inventory, purchaseOrders, shipments, settlements, allocations] = await Promise.all([
    ProduceLot.find(scope).populate("produceCategory").lean(),
    Inventory.find(scope).lean(),
    PurchaseOrder.find(scope).lean(),
    Shipment.find(scope).lean(),
    Settlement.find(scope).lean(),
    LotAllocation.find(scope).lean()
  ]);

  const byStatus = lots.reduce((acc, lot) => ({ ...acc, [lot.status]: (acc[lot.status] || 0) + 1 }), {});
  const inventoryQty = inventory.reduce((sum, item) => sum + item.quantity - item.reservedQuantity - item.dispatchedQuantity, 0);
  const settlementTotal = settlements.reduce((sum, item) => sum + (item.netPayableAmount || 0), 0);
  const procurementValue = allocations.reduce((sum, item) => sum + item.quantity * (item.unitPrice || 0), 0);

  sendSuccess(res, {
    kpis: {
      totalLots: lots.length,
      acceptedLots: byStatus.ACCEPTED || 0,
      rejectedLots: byStatus.REJECTED || 0,
      inventoryQty,
      activePurchaseOrders: purchaseOrders.filter((po) => !["FULFILLED", "CANCELLED"].includes(po.status)).length,
      shipmentsInTransit: shipments.filter((s) => ["DISPATCHED", "IN_TRANSIT", "OUT_FOR_DELIVERY"].includes(s.status)).length,
      deliveredShipments: shipments.filter((s) => s.status === "DELIVERED").length,
      settlementTotal,
      procurementValue
    },
    lotsByStatus: Object.entries(byStatus).map(([name, value]) => ({ name, value })),
    shipmentsByStatus: Object.entries(shipments.reduce((acc, s) => ({ ...acc, [s.status]: (acc[s.status] || 0) + 1 }), {})).map(([name, value]) => ({ name, value })),
    settlementsByStatus: Object.entries(settlements.reduce((acc, s) => ({ ...acc, [s.status]: (acc[s.status] || 0) + 1 }), {})).map(([name, value]) => ({ name, value }))
  }, "Report summary");
}));

export default router;
