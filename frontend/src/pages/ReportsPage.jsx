import React from "react";
import { Download, ChartNoAxesCombined, FileText } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { PageHeader } from "../components/PageHeader.jsx";
import { monthlyProcurement, gradeDistribution } from "../data/demoData.js";

const palette = ["#2f9e44", "#0f766e", "#f59f00", "#e11d48", "#4f46e5"];

const regionData = [
  { region: "North Maharashtra", tons: 48.2 },
  { region: "Western Maharashtra", tons: 32.6 },
  { region: "North Karnataka", tons: 15.6 }
];

export function ReportsPage() {
  function handleExport() {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Month,Procurement_Tons,Value_Lakhs\n" +
      monthlyProcurement.map((e) => `${e.month},${e.quantity},${e.value}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "agritrade_procurement_report.csv");
    document.body.appendChild(link);
    link.click();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Reports & Supply Chain Analytics"
        subtitle="Comprehensive procurement trends, quality grade split, regional procurement metrics, financial settlements, and export options."
        action={
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-xl bg-leaf-600 px-5 py-3 text-xs font-black text-white hover:bg-leaf-700 shadow-soft"
          >
            <Download className="h-4 w-4" /> Download Analytics CSV
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border-2 border-slate-300 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-black text-slate-950 mb-2">Monthly Procurement Volume (Tons)</h3>
          <p className="text-xs font-bold text-slate-700 mb-6">Quantity of produce lots accepted across centers</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyProcurement}>
              <XAxis dataKey="month" stroke="#334155" />
              <YAxis stroke="#334155" />
              <Tooltip />
              <Bar dataKey="quantity" fill="#2f9e44" radius={[6, 6, 0, 0]} name="Tons" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-3xl border-2 border-slate-300 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-black text-slate-950 mb-2">Procurement Financial Value (₹ Lakhs)</h3>
          <p className="text-xs font-bold text-slate-700 mb-6">Total procurement transaction value</p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyProcurement}>
              <XAxis dataKey="month" stroke="#334155" />
              <YAxis stroke="#334155" />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#f59f00" fill="#fff3cc" strokeWidth={3} name="₹ Lakhs" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border-2 border-slate-300 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-black text-slate-950 mb-2">Region-Wise Procurement Volume</h3>
          <p className="text-xs font-bold text-slate-700 mb-6">Tons collected by geographic region</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={regionData} layout="vertical">
              <XAxis type="number" stroke="#334155" />
              <YAxis dataKey="region" type="category" stroke="#334155" width={140} />
              <Tooltip />
              <Bar dataKey="tons" fill="#0f766e" radius={[0, 6, 6, 0]} name="Tons" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-3xl border-2 border-slate-300 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-black text-slate-950 mb-2">Quality Inspection Grade Split</h3>
          <p className="text-xs font-bold text-slate-700 mb-4">Grade A vs Grade B vs Grade C vs Rejected</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={gradeDistribution} dataKey="value" nameKey="name" outerRadius={85} paddingAngle={4}>
                {gradeDistribution.map((entry, index) => (
                  <Cell key={entry.name} fill={palette[index % palette.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
