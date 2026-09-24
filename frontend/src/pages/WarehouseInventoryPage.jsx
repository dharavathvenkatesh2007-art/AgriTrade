import React, { useState } from "react";
import { Warehouse, Boxes, Layers, Clock, ArrowRight } from "lucide-react";
import { PageHeader } from "../components/PageHeader.jsx";
import { DataTable } from "../components/DataTable.jsx";
import { KpiCard } from "../components/KpiCard.jsx";
import { StatusBadge } from "../components/StatusBadge.jsx";
import { lots as demoLots } from "../data/demoData.js";

export function WarehouseInventoryPage() {
  const storedLots = demoLots.filter((l) =>
    ["STORED", "ALLOCATED", "DISPATCHED", "DELIVERED"].includes(l.status)
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Warehouse & Storage Inventory"
        subtitle="Lot-level inventory across storage zones with reserved, dispatched, and available quantity breakdown, shelf-life indicators, and movement history."
      />

      <div className="grid gap-5 sm:grid-cols-3">
        <KpiCard label="Available Stock" value="42.8 Tons" icon={Warehouse} color="leaf" />
        <KpiCard label="Reserved For Orders" value="8.1 Tons" icon={Boxes} color="harvest" />
        <KpiCard label="In-Transit / Dispatched" value="3.4 Tons" icon={Layers} color="sky" />
      </div>

      {/* Storage Zones Overview */}
      <div className="grid gap-5 md:grid-cols-3">
        {[
          ["Zone A-01 (Fresh Produce)", 40000, 28500, "9 days avg shelf life"],
          ["Zone B-12 (Dry Grains)", 90000, 64000, "110 days avg shelf life"],
          ["Zone C-07 (Cold Storage)", 25000, 18200, "18 days avg shelf life"]
        ].map(([name, capacity, used, info]) => {
          const pct = Math.round((used / capacity) * 100);
          return (
            <div key={name} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-[#14281d]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-black text-slate-900 dark:text-white">{name}</h4>
                <span className="text-xs font-bold text-leaf-700 dark:text-leaf-300">{pct}% Occupied</span>
              </div>
              <div className="h-3.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                <div className="h-full bg-leaf-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{(used / 1000).toFixed(1)} / {(capacity / 1000).toFixed(1)} Tons</span>
                <span>{info}</span>
              </div>
            </div>
          );
        })}
      </div>

      <DataTable
        title="Lot-Level Inventory Listing"
        rows={storedLots}
        columns={["lotNumber", "produce", "quantity", "grade", "status"]}
      />
    </div>
  );
}
