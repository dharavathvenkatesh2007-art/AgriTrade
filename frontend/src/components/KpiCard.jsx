import React from "react";
import { Leaf } from "lucide-react";

export function KpiCard({ label, value, icon: Icon = Leaf, trend, color = "leaf" }) {
  const colors = {
    leaf: "text-leaf-800 bg-leaf-100 border-leaf-400",
    soil: "text-amber-900 bg-amber-100 border-amber-400",
    harvest: "text-harvest-700 bg-harvest-100 border-harvest-400",
    sky: "text-sky-900 bg-sky-100 border-sky-400"
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-slate-300 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg text-slate-900">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-slate-700">{label}</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">{value}</p>
        </div>
        <div className={`rounded-2xl border-2 p-3.5 shadow-xs ${colors[color] || colors.leaf}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-1.5 text-xs font-black text-leaf-900">
          <span className="rounded-full bg-leaf-100 border border-leaf-400 px-2.5 py-0.5">{trend}</span>
          <span className="text-slate-700 font-bold">vs last month</span>
        </div>
      )}
    </div>
  );
}
