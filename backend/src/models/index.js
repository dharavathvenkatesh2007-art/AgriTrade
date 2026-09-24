import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { disputeStatuses, lotStatuses, poStatuses, roles, settlementStatuses, shipmentStatuses } from "../utils/constants.js";

const { Schema, model } = mongoose;
const ref = (name, required = false) => ({ type: Schema.Types.ObjectId, ref: name, required });

const historySchema = new Schema({
  previousStatus: String,
  newStatus: String,
  changedBy: ref("User"),
  reason: String,
  operation: String
}, { timestamps: true, _id: false });

const orgScoped = {
  organization: ref("Organization"),
  region: ref("Region")
};

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: Object.values(roles), required: true },
  phone: String,
  avatarUrl: String,
  language: { type: String, default: "en-IN" },
  isActive: { type: Boolean, default: true },
  ...orgScoped
}, { timestamps: true });

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

const organizationSchema = new Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, enum: ["PLATFORM", "FARMER_GROUP", "COLLECTION_CENTER", "BUYER", "LOGISTICS", "WAREHOUSE"], required: true },
  contactEmail: String,
  phone: String,
  address: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const regionSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  state: String,
  country: { type: String, default: "India" },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const farmerSchema = new Schema({
  user: ref("User", true),
  farmerCode: { type: String, required: true, unique: true },
  village: String,
  district: String,
  bankAccountLast4: String,
  kycStatus: { type: String, enum: ["PENDING", "VERIFIED", "REJECTED"], default: "VERIFIED" },
  ...orgScoped
}, { timestamps: true });

const farmSchema = new Schema({
  farmer: ref("Farmer", true),
  name: { type: String, required: true },
  acreage: Number,
  soilType: String,
  irrigationType: String,
  geoLocation: { lat: Number, lng: Number },
  ...orgScoped
}, { timestamps: true });

const produceCategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  defaultUnit: { type: String, enum: ["Kg", "Quintal", "Ton"], default: "Kg" },
  shelfLifeDays: Number,
  description: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const gradingCriteriaSchema = new Schema({
  produceCategory: ref("ProduceCategory", true),
  grade: { type: String, enum: ["Grade A", "Grade B", "Grade C", "Rejected"], required: true },
  maxMoisture: Number,
  maxForeignMatter: Number,
  maxDamagedPercent: Number,
  minAppearanceScore: Number,
  priceAdjustmentPercent: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  ...orgScoped
}, { timestamps: true });

const produceLotSchema = new Schema({
  lotNumber: { type: String, required: true, unique: true },
  farmer: ref("Farmer", true),
  farm: ref("Farm"),
  produceCategory: ref("ProduceCategory", true),
  submittedQuantity: { type: Number, required: true, min: 0 },
  acceptedQuantity: { type: Number, default: 0, min: 0 },
  availableQuantity: { type: Number, default: 0, min: 0 },
  unit: { type: String, enum: ["Kg", "Quintal", "Ton"], default: "Kg" },
  status: { type: String, enum: lotStatuses, default: "CREATED", index: true },
  grade: { type: String, enum: ["Grade A", "Grade B", "Grade C", "Rejected"] },
  imageUrl: String,
  expectedPrice: Number,
  collectionCenter: ref("Organization"),
  warehouse: ref("Warehouse"),
  storageLocation: ref("StorageLocation"),
  referenceCode: String,
  remarks: String,
  statusHistory: [historySchema],
  ...orgScoped
}, { timestamps: true });
produceLotSchema.index({ lotNumber: "text", status: 1 });

const qualityInspectionSchema = new Schema({
  lot: ref("ProduceLot", true),
  inspector: ref("User", true),
  moisturePercent: Number,
  foreignMatterPercent: Number,
  damagedQuantity: Number,
  pestIndicators: String,
  appearanceScore: Number,
  grade: { type: String, enum: ["Grade A", "Grade B", "Grade C", "Rejected"], required: true },
  remarks: String,
  evidence: [String],
  inspectedAt: { type: Date, default: Date.now },
  ...orgScoped
}, { timestamps: true });

const warehouseSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  address: String,
  capacityKg: Number,
  manager: ref("User"),
  ...orgScoped
}, { timestamps: true });

const storageLocationSchema = new Schema({
  warehouse: ref("Warehouse", true),
  code: { type: String, required: true },
  zone: String,
  capacityKg: Number,
  status: { type: String, enum: ["AVAILABLE", "FULL", "MAINTENANCE"], default: "AVAILABLE" }
}, { timestamps: true });

const inventorySchema = new Schema({
  lot: ref("ProduceLot", true),
  produceCategory: ref("ProduceCategory", true),
  warehouse: ref("Warehouse", true),
  storageLocation: ref("StorageLocation"),
  quantity: { type: Number, required: true, min: 0 },
  reservedQuantity: { type: Number, default: 0, min: 0 },
  dispatchedQuantity: { type: Number, default: 0, min: 0 },
  deliveredQuantity: { type: Number, default: 0, min: 0 },
  unit: { type: String, default: "Kg" },
  status: { type: String, enum: ["AVAILABLE", "RESERVED", "DISPATCHED", "DELIVERED", "AGED"], default: "AVAILABLE" },
  expiryDate: Date,
  ...orgScoped
}, { timestamps: true });

const inventoryMovementSchema = new Schema({
  inventory: ref("Inventory", true),
  lot: ref("ProduceLot", true),
  type: { type: String, enum: ["RECEIPT", "STORAGE", "TRANSFER", "ALLOCATION", "DISPATCH", "DELIVERY"], required: true },
  quantity: Number,
  fromLocation: String,
  toLocation: String,
  actor: ref("User"),
  remarks: String,
  ...orgScoped
}, { timestamps: true });

const poLineSchema = new Schema({
  produceCategory: ref("ProduceCategory", true),
  requiredQuantity: { type: Number, required: true, min: 0 },
  allocatedQuantity: { type: Number, default: 0, min: 0 },
  deliveredQuantity: { type: Number, default: 0, min: 0 },
  unitPrice: { type: Number, required: true, min: 0 },
  targetGrade: String,
  deliveryLocation: String,
  deliveryDate: Date
}, { _id: true });

const purchaseOrderSchema = new Schema({
  poNumber: { type: String, required: true, unique: true },
  buyer: ref("User", true),
  status: { type: String, enum: poStatuses, default: "DRAFT", index: true },
  lineItems: [poLineSchema],
  orderHistory: [historySchema],
  totalValue: { type: Number, default: 0 },
  ...orgScoped
}, { timestamps: true });

const lotAllocationSchema = new Schema({
  purchaseOrder: ref("PurchaseOrder", true),
  lineItemId: Schema.Types.ObjectId,
  lot: ref("ProduceLot", true),
  farmer: ref("Farmer"),
  quantity: { type: Number, required: true, min: 0 },
  unitPrice: Number,
  status: { type: String, enum: ["RESERVED", "DISPATCHED", "DELIVERED", "CANCELLED"], default: "RESERVED" },
  ...orgScoped
}, { timestamps: true });

const vehicleSchema = new Schema({
  registrationNumber: { type: String, required: true, unique: true },
  vehicleType: String,
  capacityKg: Number,
  status: { type: String, enum: ["AVAILABLE", "ASSIGNED", "IN_TRANSIT", "MAINTENANCE"], default: "AVAILABLE" },
  driver: ref("Driver"),
  ...orgScoped
}, { timestamps: true });

const driverSchema = new Schema({
  name: { type: String, required: true },
  phone: String,
  licenseNumber: String,
  availability: { type: String, enum: ["AVAILABLE", "ASSIGNED", "OFF_DUTY"], default: "AVAILABLE" },
  ...orgScoped
}, { timestamps: true });

const shipmentSchema = new Schema({
  shipmentNumber: { type: String, required: true, unique: true },
  purchaseOrder: ref("PurchaseOrder", true),
  allocations: [{ type: Schema.Types.ObjectId, ref: "LotAllocation" }],
  quantity: Number,
  pickupLocation: String,
  destination: String,
  vehicle: ref("Vehicle"),
  driver: ref("Driver"),
  dispatchDate: Date,
  expectedDeliveryDate: Date,
  actualDeliveryDate: Date,
  status: { type: String, enum: shipmentStatuses, default: "PLANNED" },
  remarks: String,
  statusHistory: [historySchema],
  ...orgScoped
}, { timestamps: true });

const settlementSchema = new Schema({
  settlementNumber: { type: String, required: true, unique: true },
  farmer: ref("Farmer", true),
  lot: ref("ProduceLot", true),
  purchaseOrder: ref("PurchaseOrder"),
  acceptedQuantity: Number,
  basePrice: Number,
  qualityAdjustment: Number,
  deductions: Number,
  transportCharges: Number,
  otherAdjustments: Number,
  grossAmount: Number,
  netPayableAmount: Number,
  status: { type: String, enum: settlementStatuses, default: "PENDING" },
  paymentReference: String,
  settlementDate: Date,
  ...orgScoped
}, { timestamps: true });

const disputeSchema = new Schema({
  disputeNumber: { type: String, required: true, unique: true },
  raisedBy: ref("User", true),
  relatedLot: ref("ProduceLot"),
  relatedOrder: ref("PurchaseOrder"),
  relatedShipment: ref("Shipment"),
  relatedSettlement: ref("Settlement"),
  category: { type: String, enum: ["QUALITY", "QUANTITY", "PAYMENT", "DELIVERY", "PRICING", "REJECTION", "OTHER"], required: true },
  description: String,
  evidenceAttachment: String,
  priority: { type: String, enum: ["LOW", "MEDIUM", "HIGH", "URGENT"], default: "MEDIUM" },
  status: { type: String, enum: disputeStatuses, default: "OPEN" },
  assignedAdmin: ref("User"),
  resolution: String,
  resolutionDate: Date,
  history: [historySchema],
  ...orgScoped
}, { timestamps: true });

const notificationSchema = new Schema({
  user: ref("User"),
  role: String,
  title: { type: String, required: true },
  message: String,
  type: { type: String, enum: ["INFO", "SUCCESS", "WARNING", "ERROR"], default: "INFO" },
  entityType: String,
  entityId: Schema.Types.ObjectId,
  readAt: Date,
  ...orgScoped
}, { timestamps: true });

const auditLogSchema = new Schema({
  user: ref("User"),
  role: String,
  action: { type: String, required: true },
  module: String,
  entity: String,
  entityId: Schema.Types.ObjectId,
  previousValue: Schema.Types.Mixed,
  newValue: Schema.Types.Mixed,
  ip: String,
  device: String,
  ...orgScoped
}, { timestamps: true });

export const User = model("User", userSchema);
export const Organization = model("Organization", organizationSchema);
export const Region = model("Region", regionSchema);
export const Farmer = model("Farmer", farmerSchema);
export const Farm = model("Farm", farmSchema);
export const ProduceCategory = model("ProduceCategory", produceCategorySchema);
export const ProduceLot = model("ProduceLot", produceLotSchema);
export const QualityInspection = model("QualityInspection", qualityInspectionSchema);
export const GradingCriteria = model("GradingCriteria", gradingCriteriaSchema);
export const Warehouse = model("Warehouse", warehouseSchema);
export const StorageLocation = model("StorageLocation", storageLocationSchema);
export const Inventory = model("Inventory", inventorySchema);
export const InventoryMovement = model("InventoryMovement", inventoryMovementSchema);
export const PurchaseOrder = model("PurchaseOrder", purchaseOrderSchema);
export const LotAllocation = model("LotAllocation", lotAllocationSchema);
export const Vehicle = model("Vehicle", vehicleSchema);
export const Driver = model("Driver", driverSchema);
export const Shipment = model("Shipment", shipmentSchema);
export const Settlement = model("Settlement", settlementSchema);
export const Dispute = model("Dispute", disputeSchema);
export const Notification = model("Notification", notificationSchema);
export const AuditLog = model("AuditLog", auditLogSchema);

export const models = {
  users: User,
  organizations: Organization,
  regions: Region,
  farmers: Farmer,
  farms: Farm,
  "produce-categories": ProduceCategory,
  lots: ProduceLot,
  inspections: QualityInspection,
  "grading-criteria": GradingCriteria,
  warehouses: Warehouse,
  inventory: Inventory,
  "inventory-movements": InventoryMovement,
  "purchase-orders": PurchaseOrder,
  allocations: LotAllocation,
  vehicles: Vehicle,
  drivers: Driver,
  shipments: Shipment,
  settlements: Settlement,
  disputes: Dispute,
  notifications: Notification,
  "audit-logs": AuditLog
};
