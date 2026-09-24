import React from "react";
import { Leaf } from "lucide-react";

export function KpiCard({ label, value, icon: Icon = Leaf, trend, color = "leaf" }) {
  const colors = {
    leaf: "text-leaf-700 bg-leaf-100 dark:bg-leaf-950 dark:text-leaf-300 border-leaf-300 dark:border-leaf-700",
    soil: "text-amber-800 bg-amber-100 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-700",
    harvest: "text-harvest-700 bg-harvest-100 dark:bg-harvest-950 dark:text-harvest-300 border-harvest-300 dark:border-harvest-700",
    sky: "text-sky-800 bg-sky-100 dark:bg-sky-950 dark:text-sky-300 border-sky-300 dark:border-sky-700"
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-300 bg-white p-6 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl dark:border-white/15 dark:bg-[#122419] text-slate-900 dark:text-white">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">{label}</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white">{value}</p>
        </div>
        <div className={`rounded-2xl border p-3.5 shadow-sm ${colors[color] || colors.leaf}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-1.5 text-xs font-black text-leaf-800 dark:text-leaf-300">
          <span className="rounded-full bg-leaf-100 border border-leaf-300 px-2.5 py-0.5 dark:bg-leaf-950 dark:border-leaf-700">{trend}</span>
          <span className="text-slate-600 dark:text-slate-400">vs last month</span>
        </div>
      )}
    </div>
  );
}
