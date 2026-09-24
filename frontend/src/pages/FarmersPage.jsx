import React from "react";
import { UserRound, MapPin, CheckCircle2, Sprout } from "lucide-react";
import { PageHeader } from "../components/PageHeader.jsx";
import { DataTable } from "../components/DataTable.jsx";

const demoFarmersList = [
  { farmerCode: "FMR-0001", name: "Anita Reddy", region: "North Maharashtra", village: "Lasalgaon", kycStatus: "VERIFIED", acreage: 6.5, crops: "Tomato, Onion", totalPaid: 124500 },
  { farmerCode: "FMR-0002", name: "Ramesh Patil", region: "Western Maharashtra", village: "Baramati", kycStatus: "VERIFIED", acreage: 8.0, crops: "Wheat, Chilli", totalPaid: 198000 },
  { farmerCode: "FMR-0003", name: "Kiran Pawar", region: "North Karnataka", village: "Belagavi", kycStatus: "VERIFIED", acreage: 4.2, crops: "Cotton, Maize", totalPaid: 87600 },
  { farmerCode: "FMR-0004", name: "Sunita Jadhav", region: "North Maharashtra", village: "Nashik", kycStatus: "VERIFIED", acreage: 5.0, crops: "Tomato, Turmeric", totalPaid: 112000 },
  { farmerCode: "FMR-0005", name: "Mahesh Gowda", region: "North Karnataka", village: "Hubballi", kycStatus: "VERIFIED", acreage: 12.0, crops: "Groundnut, Pulses", totalPaid: 245000 }
];

export function FarmersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Farmer Directory & Farm Records"
        subtitle="Manage registered farmers, KYC status verification, farm acreage, soil & irrigation methods, and historical procurement payouts."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {demoFarmersList.slice(0, 3).map((f) => (
          <div key={f.farmerCode} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-[#14281d]">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf-50 text-leaf-600 dark:bg-leaf-950/40">
                <UserRound className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-leaf-100 px-3 py-1 text-xs font-bold text-leaf-800">
                {f.kycStatus}
              </span>
            </div>
            <h3 className="mt-4 text-base font-black text-slate-900 dark:text-white">{f.name}</h3>
            <p className="text-xs text-slate-500">{f.farmerCode} · {f.village}, {f.region}</p>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600 dark:text-slate-300">Acreage: {f.acreage} Acres</span>
              <span className="font-bold text-leaf-700 dark:text-leaf-300">Payouts: ₹{f.totalPaid.toLocaleString("en-IN")}</span>
            </div>
          </div>
        ))}
      </div>

      <DataTable
        title="All Registered Farmers"
        rows={demoFarmersList}
        columns={["farmerCode", "name", "village", "region", "kycStatus"]}
      />
    </div>
  );
}
