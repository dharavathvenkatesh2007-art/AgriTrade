import "dotenv/config";
import { connectDB } from "../config/db.js";
import {
  AuditLog,
  Dispute,
  Driver,
  Farm,
  Farmer,
  GradingCriteria,
  Inventory,
  InventoryMovement,
  LotAllocation,
  Notification,
  Organization,
  ProduceCategory,
  ProduceLot,
  PurchaseOrder,
  QualityInspection,
  Region,
  Settlement,
  Shipment,
  StorageLocation,
  User,
  Vehicle,
  Warehouse
} from "../models/index.js";
import { roles } from "../utils/constants.js";

const demoPassword = process.env.DEMO_PASSWORD || "Password123!";

const produceNames = ["Rice", "Wheat", "Tomato", "Onion", "Cotton", "Chilli", "Maize", "Turmeric", "Groundnut", "Pulses"];
const farmerNames = [
  "Anita Reddy", "Ramesh Patil", "Kiran Pawar", "Sunita Jadhav", "Mahesh Gowda",
  "Pooja Naik", "Harish Kumar", "Lakshmi Devi", "Sameer Shaikh", "Meena Rathod",
  "Prakash Yadav", "Geeta Mali", "Suresh Bhosale", "Asha Kale", "Nitin More",
  "Vijay Chavan", "Farida Khan", "Arjun Desai", "Nandini Rao", "Omkar Shinde"
];

async function clear() {
  await Promise.all([
    AuditLog.deleteMany({}),
    Dispute.deleteMany({}),
    Driver.deleteMany({}),
    Farm.deleteMany({}),
    Farmer.deleteMany({}),
    GradingCriteria.deleteMany({}),
    Inventory.deleteMany({}),
    InventoryMovement.deleteMany({}),
    LotAllocation.deleteMany({}),
    Notification.deleteMany({}),
    Organization.deleteMany({}),
    ProduceCategory.deleteMany({}),
    ProduceLot.deleteMany({}),
    PurchaseOrder.deleteMany({}),
    QualityInspection.deleteMany({}),
    Region.deleteMany({}),
    Settlement.deleteMany({}),
    Shipment.deleteMany({}),
    StorageLocation.deleteMany({}),
    User.deleteMany({}),
    Vehicle.deleteMany({}),
    Warehouse.deleteMany({})
  ]);
}

async function seed() {
  await connectDB();
  await clear();

  const [platform, collectionOrg, buyerOrg, logisticsOrg, warehouseOrg] = await Organization.create([
    { name: "AgriTrade Platform", type: "PLATFORM", contactEmail: "ops@agritrade.com", phone: "+91 90000 10000", address: "Pune, Maharashtra" },
    { name: "Deccan Collection Network", type: "COLLECTION_CENTER", contactEmail: "center@agritrade.com", phone: "+91 90000 20000", address: "Nashik, Maharashtra" },
    { name: "FreshKart Wholesale", type: "BUYER", contactEmail: "buyer@agritrade.com", phone: "+91 90000 30000", address: "Mumbai, Maharashtra" },
    { name: "GreenLine Logistics", type: "LOGISTICS", contactEmail: "logistics@agritrade.com", phone: "+91 90000 40000", address: "Pune, Maharashtra" },
    { name: "Western Agri Warehousing", type: "WAREHOUSE", contactEmail: "warehouse@agritrade.com", phone: "+91 90000 50000", address: "Ahmednagar, Maharashtra" }
  ]);

  const [mhNorth, mhWest, kaNorth] = await Region.create([
    { name: "North Maharashtra", code: "MH-N", state: "Maharashtra" },
    { name: "Western Maharashtra", code: "MH-W", state: "Maharashtra" },
    { name: "North Karnataka", code: "KA-N", state: "Karnataka" }
  ]);

  const [admin, farmerUser, centerUser, inspectorUser, buyerUser, logisticsUser] = await User.create([
    { name: "Platform Admin", email: "admin@agritrade.com", password: demoPassword, role: roles.ADMIN, organization: platform._id, region: mhNorth._id },
    { name: "Demo Farmer", email: "farmer@agritrade.com", password: demoPassword, role: roles.FARMER, phone: "+91 98765 00001", organization: collectionOrg._id, region: mhNorth._id },
    { name: "Collection Manager", email: "center@agritrade.com", password: demoPassword, role: roles.COLLECTION_MANAGER, organization: collectionOrg._id, region: mhNorth._id },
    { name: "Quality Inspector", email: "inspector@agritrade.com", password: demoPassword, role: roles.INSPECTOR, organization: collectionOrg._id, region: mhNorth._id },
    { name: "Buyer Manager", email: "buyer@agritrade.com", password: demoPassword, role: roles.BUYER, organization: buyerOrg._id, region: mhWest._id },
    { name: "Logistics Coordinator", email: "logistics@agritrade.com", password: demoPassword, role: roles.LOGISTICS, organization: logisticsOrg._id, region: mhWest._id }
  ]);

  const categories = await ProduceCategory.create(produceNames.map((name, index) => ({
    name,
    defaultUnit: index < 2 ? "Quintal" : "Kg",
    shelfLifeDays: ["Tomato", "Onion", "Chilli"].includes(name) ? 12 : 120,
    description: `${name} procurement category`
  })));

  const criteria = [];
  for (const category of categories) {
    criteria.push(
      { produceCategory: category._id, grade: "Grade A", maxMoisture: 8, maxForeignMatter: 1, maxDamagedPercent: 2, minAppearanceScore: 8, priceAdjustmentPercent: 8, organization: platform._id, region: mhNorth._id },
      { produceCategory: category._id, grade: "Grade B", maxMoisture: 12, maxForeignMatter: 3, maxDamagedPercent: 5, minAppearanceScore: 6, priceAdjustmentPercent: 0, organization: platform._id, region: mhNorth._id },
      { produceCategory: category._id, grade: "Grade C", maxMoisture: 16, maxForeignMatter: 5, maxDamagedPercent: 10, minAppearanceScore: 4, priceAdjustmentPercent: -5, organization: platform._id, region: mhNorth._id },
      { produceCategory: category._id, grade: "Rejected", maxMoisture: 100, maxForeignMatter: 100, maxDamagedPercent: 100, minAppearanceScore: 0, priceAdjustmentPercent: -100, organization: platform._id, region: mhNorth._id }
    );
  }
  await GradingCriteria.create(criteria);

  const farmerDocs = [];
  const farmDocs = [];
  for (let index = 0; index < farmerNames.length; index += 1) {
    const user = index === 0 ? farmerUser : await User.create({
      name: farmerNames[index],
      email: `farmer${index + 1}@agritrade.com`,
      password: demoPassword,
      role: roles.FARMER,
      phone: `+91 98765 ${String(index + 1).padStart(5, "0")}`,
      organization: collectionOrg._id,
      region: index % 3 === 0 ? mhNorth._id : index % 3 === 1 ? mhWest._id : kaNorth._id
    });
    const farmer = await Farmer.create({
      user: user._id,
      farmerCode: `FMR-${String(index + 1).padStart(4, "0")}`,
      village: ["Lasalgaon", "Baramati", "Belagavi"][index % 3],
      district: ["Nashik", "Pune", "Belagavi"][index % 3],
      bankAccountLast4: String(3300 + index),
      organization: collectionOrg._id,
      region: user.region
    });
    const farm = await Farm.create({
      farmer: farmer._id,
      name: `${farmerNames[index].split(" ")[0]} Farm`,
      acreage: 2 + (index % 7),
      soilType: ["Black cotton", "Alluvial", "Red loam"][index % 3],
      irrigationType: ["Drip", "Canal", "Rain-fed"][index % 3],
      organization: collectionOrg._id,
      region: user.region
    });
    farmerDocs.push(farmer);
    farmDocs.push(farm);
  }

  const warehouse = await Warehouse.create({ name: "Ahmednagar Central Warehouse", code: "WH-AGN-01", address: "MIDC Ahmednagar", capacityKg: 500000, manager: centerUser._id, organization: warehouseOrg._id, region: mhNorth._id });
  const locations = await StorageLocation.create([
    { warehouse: warehouse._id, code: "A-01", zone: "Fresh", capacityKg: 40000 },
    { warehouse: warehouse._id, code: "B-12", zone: "Dry", capacityKg: 90000 },
    { warehouse: warehouse._id, code: "C-07", zone: "Cold", capacityKg: 25000 }
  ]);

  const lots = [];
  for (let index = 0; index < 34; index += 1) {
    const farmer = farmerDocs[index % farmerDocs.length];
    const category = categories[index % categories.length];
    const qty = 700 + index * 45;
    const statuses = ["CREATED", "RECEIVED", "INSPECTION_PENDING", "INSPECTED", "ACCEPTED", "STORED", "ALLOCATED", "DISPATCHED", "DELIVERED", "REJECTED"];
    const status = statuses[index % statuses.length];
    const acceptedQuantity = status === "REJECTED" ? 0 : ["ACCEPTED", "STORED", "ALLOCATED", "DISPATCHED", "DELIVERED"].includes(status) ? Math.round(qty * 0.94) : 0;
    lots.push(await ProduceLot.create({
      lotNumber: `LOT-2026-${String(index + 1).padStart(5, "0")}`,
      farmer: farmer._id,
      farm: farmDocs[index % farmDocs.length]._id,
      produceCategory: category._id,
      submittedQuantity: qty,
      acceptedQuantity,
      availableQuantity: ["ACCEPTED", "STORED"].includes(status) ? acceptedQuantity : 0,
      unit: category.defaultUnit,
      status,
      grade: status === "REJECTED" ? "Rejected" : ["Grade A", "Grade B", "Grade C"][index % 3],
      collectionCenter: collectionOrg._id,
      warehouse: ["STORED", "ALLOCATED", "DISPATCHED", "DELIVERED"].includes(status) ? warehouse._id : undefined,
      storageLocation: ["STORED", "ALLOCATED", "DISPATCHED", "DELIVERED"].includes(status) ? locations[index % locations.length]._id : undefined,
      referenceCode: `QR-LOT-${String(index + 1).padStart(5, "0")}`,
      remarks: "Seeded procurement lot",
      organization: collectionOrg._id,
      region: farmer.region,
      statusHistory: [{ previousStatus: "CREATED", newStatus: status, changedBy: centerUser._id, operation: "SEED", reason: "Demo lifecycle state" }]
    }));
  }

  await QualityInspection.create(lots.filter((lot) => !["CREATED", "RECEIVED"].includes(lot.status)).map((lot, index) => ({
    lot: lot._id,
    inspector: inspectorUser._id,
    moisturePercent: 7 + (index % 8),
    foreignMatterPercent: index % 4,
    damagedQuantity: 5 + index,
    pestIndicators: index % 5 === 0 ? "Minor leaf marks" : "None",
    appearanceScore: 5 + (index % 5),
    grade: lot.grade,
    remarks: lot.status === "REJECTED" ? "Rejected due to damage and moisture." : "Meets procurement criteria.",
    organization: collectionOrg._id,
    region: lot.region
  })));

  const inventoryDocs = [];
  for (const lot of lots.filter((item) => ["STORED", "ALLOCATED", "DISPATCHED", "DELIVERED"].includes(item.status))) {
    const inventory = await Inventory.create({
      lot: lot._id,
      produceCategory: lot.produceCategory,
      warehouse: warehouse._id,
      storageLocation: lot.storageLocation,
      quantity: lot.acceptedQuantity,
      reservedQuantity: lot.status === "ALLOCATED" ? Math.round(lot.acceptedQuantity * 0.5) : 0,
      dispatchedQuantity: lot.status === "DISPATCHED" ? lot.acceptedQuantity : 0,
      deliveredQuantity: lot.status === "DELIVERED" ? lot.acceptedQuantity : 0,
      unit: lot.unit,
      status: lot.status === "DELIVERED" ? "DELIVERED" : lot.status === "DISPATCHED" ? "DISPATCHED" : "AVAILABLE",
      organization: collectionOrg._id,
      region: lot.region
    });
    inventoryDocs.push(inventory);
    await InventoryMovement.create({ inventory: inventory._id, lot: lot._id, type: "STORAGE", quantity: lot.acceptedQuantity, toLocation: "Ahmednagar Central Warehouse", actor: centerUser._id, organization: collectionOrg._id, region: lot.region });
  }

  const po = await PurchaseOrder.create({
    poNumber: "PO-2026-0001",
    buyer: buyerUser._id,
    status: "APPROVED",
    lineItems: [
      { produceCategory: categories[2]._id, requiredQuantity: 2400, allocatedQuantity: 1200, unitPrice: 28, targetGrade: "Grade A", deliveryLocation: "Mumbai APMC", deliveryDate: new Date("2026-10-05") },
      { produceCategory: categories[3]._id, requiredQuantity: 1800, allocatedQuantity: 900, unitPrice: 22, targetGrade: "Grade B", deliveryLocation: "Mumbai APMC", deliveryDate: new Date("2026-10-06") }
    ],
    totalValue: 106800,
    organization: buyerOrg._id,
    region: mhWest._id
  });

  const allocatedLots = lots.filter((lot) => ["ALLOCATED", "DISPATCHED", "DELIVERED"].includes(lot.status)).slice(0, 4);
  const allocations = await LotAllocation.create(allocatedLots.map((lot, index) => ({
    purchaseOrder: po._id,
    lineItemId: po.lineItems[index % po.lineItems.length]._id,
    lot: lot._id,
    farmer: lot.farmer,
    quantity: Math.min(600, lot.acceptedQuantity || 600),
    unitPrice: po.lineItems[index % po.lineItems.length].unitPrice,
    status: lot.status === "DELIVERED" ? "DELIVERED" : lot.status === "DISPATCHED" ? "DISPATCHED" : "RESERVED",
    organization: collectionOrg._id,
    region: lot.region
  })));

  const drivers = await Driver.create([
    { name: "Rohit Kadam", phone: "+91 95555 11111", licenseNumber: "MH12-7788", organization: logisticsOrg._id, region: mhWest._id },
    { name: "Santosh Mane", phone: "+91 95555 22222", licenseNumber: "MH14-8899", organization: logisticsOrg._id, region: mhWest._id }
  ]);
  const vehicles = await Vehicle.create([
    { registrationNumber: "MH-12-AG-2045", vehicleType: "Refrigerated Truck", capacityKg: 6000, driver: drivers[0]._id, status: "IN_TRANSIT", organization: logisticsOrg._id, region: mhWest._id },
    { registrationNumber: "MH-14-FR-9081", vehicleType: "Open Truck", capacityKg: 9000, driver: drivers[1]._id, status: "AVAILABLE", organization: logisticsOrg._id, region: mhWest._id }
  ]);

  await Shipment.create([
    {
      shipmentNumber: "SHP-2026-0001",
      purchaseOrder: po._id,
      allocations: allocations.slice(0, 2).map((item) => item._id),
      quantity: 1200,
      pickupLocation: "Ahmednagar Central Warehouse",
      destination: "Mumbai APMC",
      vehicle: vehicles[0]._id,
      driver: drivers[0]._id,
      dispatchDate: new Date("2026-09-23"),
      expectedDeliveryDate: new Date("2026-09-25"),
      status: "IN_TRANSIT",
      remarks: "Temperature monitored shipment",
      organization: logisticsOrg._id,
      region: mhWest._id
    },
    {
      shipmentNumber: "SHP-2026-0002",
      purchaseOrder: po._id,
      allocations: allocations.slice(2).map((item) => item._id),
      quantity: 900,
      pickupLocation: "Ahmednagar Central Warehouse",
      destination: "Mumbai APMC",
      expectedDeliveryDate: new Date("2026-09-28"),
      status: "PLANNED",
      organization: logisticsOrg._id,
      region: mhWest._id
    }
  ]);

  await Settlement.create(allocations.map((allocation, index) => {
    const grossAmount = allocation.quantity * allocation.unitPrice * (index % 2 === 0 ? 1.08 : 1);
    return {
      settlementNumber: `SET-2026-${String(index + 1).padStart(4, "0")}`,
      farmer: allocation.farmer,
      lot: allocation.lot,
      purchaseOrder: po._id,
      acceptedQuantity: allocation.quantity,
      basePrice: allocation.unitPrice,
      qualityAdjustment: index % 2 === 0 ? 8 : 0,
      deductions: 120,
      transportCharges: 0,
      otherAdjustments: 0,
      grossAmount,
      netPayableAmount: grossAmount - 120,
      status: index === 0 ? "PAID" : index === 1 ? "APPROVED" : "CALCULATED",
      paymentReference: index === 0 ? "UPI-AGR-9001" : undefined,
      settlementDate: index === 0 ? new Date("2026-09-22") : undefined,
      organization: collectionOrg._id,
      region: mhNorth._id
    };
  }));

  await Dispute.create([
    { disputeNumber: "DSP-2026-0001", raisedBy: farmerUser._id, relatedLot: lots[3]._id, category: "QUALITY", description: "Requesting review of moisture result.", priority: "MEDIUM", status: "UNDER_REVIEW", assignedAdmin: admin._id, organization: collectionOrg._id, region: mhNorth._id },
    { disputeNumber: "DSP-2026-0002", raisedBy: buyerUser._id, relatedOrder: po._id, category: "DELIVERY", description: "Delivery slot confirmation needed.", priority: "LOW", status: "OPEN", assignedAdmin: admin._id, organization: buyerOrg._id, region: mhWest._id }
  ]);

  await Notification.create([
    { user: farmerUser._id, title: "Lot accepted", message: "LOT-2026-00005 passed inspection and entered inventory.", type: "SUCCESS", organization: collectionOrg._id, region: mhNorth._id },
    { user: buyerUser._id, title: "Inventory available", message: "Fresh tomato inventory is ready for allocation.", type: "INFO", organization: buyerOrg._id, region: mhWest._id },
    { user: logisticsUser._id, title: "Shipment in transit", message: "SHP-2026-0001 is on the way to Mumbai APMC.", type: "INFO", organization: logisticsOrg._id, region: mhWest._id }
  ]);

  await AuditLog.create([
    { user: admin._id, role: roles.ADMIN, action: "SEED_DATABASE", module: "seed", entity: "System", newValue: { lots: lots.length, farmers: farmerDocs.length }, organization: platform._id, region: mhNorth._id },
    { user: inspectorUser._id, role: roles.INSPECTOR, action: "APPROVE_QUALITY", module: "inspections", entity: "ProduceLot", entityId: lots[4]._id, previousValue: "INSPECTED", newValue: "ACCEPTED", organization: collectionOrg._id, region: mhNorth._id }
  ]);

  console.log("Seed complete");
  console.log(`Demo password: ${demoPassword}`);
  await process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
