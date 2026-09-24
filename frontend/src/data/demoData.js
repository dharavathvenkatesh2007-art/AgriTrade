export const demoUsers = [
  { name: "Platform Admin", email: "admin@agritrade.com", role: "ADMIN", organization: "AgriTrade Platform", region: "All Regions" },
  { name: "Demo Farmer", email: "farmer@agritrade.com", role: "FARMER", organization: "Deccan Collection Network", region: "North Maharashtra" },
  { name: "Collection Manager", email: "center@agritrade.com", role: "COLLECTION_MANAGER", organization: "Deccan Collection Network", region: "North Maharashtra" },
  { name: "Quality Inspector", email: "inspector@agritrade.com", role: "INSPECTOR", organization: "Deccan Collection Network", region: "North Maharashtra" },
  { name: "Buyer Manager", email: "buyer@agritrade.com", role: "BUYER", organization: "FreshKart Wholesale", region: "Western Maharashtra" },
  { name: "Logistics Coordinator", email: "logistics@agritrade.com", role: "LOGISTICS", organization: "GreenLine Logistics", region: "Western Maharashtra" }
];

export const produceImages = {
  Tomato: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
  Onion: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80",
  Chilli: "https://images.unsplash.com/photo-1588252303782-7ee95847e3be?auto=format&fit=crop&w=800&q=80",
  Wheat: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
  Turmeric: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
  Rice: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
  Cotton: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=800&q=80",
  Maize: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80",
  Groundnut: "https://images.unsplash.com/photo-1567016546367-c27a0d564820?auto=format&fit=crop&w=800&q=80",
  Pulses: "https://images.unsplash.com/photo-1515543904379-3d757afe72e3?auto=format&fit=crop&w=800&q=80"
};

export const lots = [
  {
    id: "1",
    lotNumber: "LOT-2026-00021",
    produce: "Tomato",
    farmer: "Demo Farmer",
    quantity: 1250,
    acceptedQuantity: 1200,
    unit: "Kg",
    status: "ACCEPTED",
    grade: "Grade A",
    expectedPrice: 28,
    region: "North Maharashtra",
    center: "Lasalgaon Center",
    value: 35000,
    imageUrl: produceImages.Tomato,
    warehouse: "Ahmednagar Central Warehouse"
  },
  {
    id: "2",
    lotNumber: "LOT-2026-00022",
    produce: "Chilli",
    farmer: "Anita Reddy",
    quantity: 840,
    acceptedQuantity: 0,
    unit: "Kg",
    status: "INSPECTION_PENDING",
    grade: "Pending Inspection",
    expectedPrice: 65,
    region: "North Maharashtra",
    center: "Lasalgaon Center",
    value: 0,
    imageUrl: produceImages.Chilli,
    warehouse: "Unassigned"
  },
  {
    id: "3",
    lotNumber: "LOT-2026-00023",
    produce: "Onion",
    farmer: "Ramesh Patil",
    quantity: 2200,
    acceptedQuantity: 2100,
    unit: "Kg",
    status: "STORED",
    grade: "Grade B",
    expectedPrice: 22,
    region: "Western Maharashtra",
    center: "Baramati Center",
    value: 48400,
    imageUrl: produceImages.Onion,
    warehouse: "Ahmednagar Central Warehouse"
  },
  {
    id: "4",
    lotNumber: "LOT-2026-00024",
    produce: "Turmeric",
    farmer: "Lakshmi Devi",
    quantity: 600,
    acceptedQuantity: 580,
    unit: "Kg",
    status: "ACCEPTED",
    grade: "Grade A",
    expectedPrice: 90,
    region: "North Karnataka",
    center: "Belagavi Center",
    value: 52200,
    imageUrl: produceImages.Turmeric,
    warehouse: "Belagavi Central Storage"
  },
  {
    id: "5",
    lotNumber: "LOT-2026-00025",
    produce: "Groundnut",
    farmer: "Prakash Yadav",
    quantity: 1800,
    acceptedQuantity: 1750,
    unit: "Kg",
    status: "STORED",
    grade: "Grade B",
    expectedPrice: 52,
    region: "North Maharashtra",
    center: "Nashik Center",
    value: 91800,
    imageUrl: produceImages.Groundnut,
    warehouse: "Ahmednagar Central Warehouse"
  },
  {
    id: "6",
    lotNumber: "LOT-2026-00026",
    produce: "Wheat",
    farmer: "Geeta Mali",
    quantity: 36,
    acceptedQuantity: 0,
    unit: "Quintal",
    status: "REJECTED",
    grade: "Rejected",
    expectedPrice: 2400,
    region: "Western Maharashtra",
    center: "Pune Center",
    value: 0,
    imageUrl: produceImages.Wheat,
    warehouse: "None"
  }
];

export const purchaseOrders = [
  { poNumber: "PO-2026-0001", buyer: "FreshKart Wholesale", status: "PARTIALLY_ALLOCATED", required: 4200, allocated: 2100, value: 106800, due: "2026-10-05" },
  { poNumber: "PO-2026-0002", buyer: "Urban Fresh Markets", status: "SUBMITTED", required: 3000, allocated: 0, value: 84000, due: "2026-10-12" },
  { poNumber: "PO-2026-0003", buyer: "HotelSupply Co", status: "FULLY_ALLOCATED", required: 1600, allocated: 1600, value: 64000, due: "2026-09-29" }
];

export const shipments = [
  { shipmentNumber: "SHP-2026-0001", po: "PO-2026-0001", vehicle: "MH-12-AG-2045", driver: "Rohit Kadam", status: "IN_TRANSIT", quantity: 1200, destination: "Mumbai APMC", eta: "2026-09-25" },
  { shipmentNumber: "SHP-2026-0002", po: "PO-2026-0001", vehicle: "Unassigned", driver: "Pending", status: "PLANNED", quantity: 900, destination: "Mumbai APMC", eta: "2026-09-28" },
  { shipmentNumber: "SHP-2026-0003", po: "PO-2026-0003", vehicle: "MH-14-FR-9081", driver: "Santosh Mane", status: "DELIVERED", quantity: 1600, destination: "Pune Wholesale", eta: "2026-09-22" }
];

export const settlements = [
  { settlementNumber: "SET-2026-0001", farmer: "Demo Farmer", lot: "LOT-2026-00021", status: "PAID", gross: 37800, net: 37680 },
  { settlementNumber: "SET-2026-0002", farmer: "Ramesh Patil", lot: "LOT-2026-00023", status: "APPROVED", gross: 24200, net: 24080 },
  { settlementNumber: "SET-2026-0003", farmer: "Prakash Yadav", lot: "LOT-2026-00025", status: "CALCULATED", gross: 45900, net: 45780 }
];

export const disputes = [
  { disputeNumber: "DSP-2026-0001", raisedBy: "Demo Farmer", category: "QUALITY", status: "UNDER_REVIEW", priority: "MEDIUM", description: "Requesting review of moisture result." },
  { disputeNumber: "DSP-2026-0002", raisedBy: "FreshKart Wholesale", category: "DELIVERY", status: "OPEN", priority: "LOW", description: "Delivery slot confirmation needed." }
];

export const notifications = [
  { title: "Lot accepted", message: "LOT-2026-00021 passed quality inspection.", time: "10 minutes ago", type: "SUCCESS", unread: true },
  { title: "Shipment dispatched", message: "SHP-2026-0001 has left Ahmednagar warehouse.", time: "1 hour ago", type: "INFO", unread: true },
  { title: "Settlement approved", message: "SET-2026-0002 is ready for payment.", time: "Today", type: "SUCCESS", unread: false }
];

export const monthlyProcurement = [
  { month: "Apr", quantity: 42, value: 12.8 },
  { month: "May", quantity: 55, value: 16.2 },
  { month: "Jun", quantity: 61, value: 18.9 },
  { month: "Jul", quantity: 74, value: 21.4 },
  { month: "Aug", quantity: 88, value: 26.1 },
  { month: "Sep", quantity: 96, value: 29.7 }
];

export const gradeDistribution = [
  { name: "Grade A", value: 42 },
  { name: "Grade B", value: 35 },
  { name: "Grade C", value: 14 },
  { name: "Rejected", value: 9 }
];

export const workflow = ["CREATED", "RECEIVED", "INSPECTION_PENDING", "INSPECTED", "ACCEPTED", "STORED", "ALLOCATED", "DISPATCHED", "DELIVERED"];
