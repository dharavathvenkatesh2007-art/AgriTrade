import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  CheckCircle2,
  Warehouse,
  WalletCards,
  Leaf,
  Boxes,
  Truck,
  ShieldCheck,
  PlusCircle,
  ClipboardCheck,
  FileText,
  ShoppingBag
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { useAppStore } from "../store/useAppStore.js";
import { PageHeader } from "../components/PageHeader.jsx";
import { KpiCard } from "../components/KpiCard.jsx";
import { StatusBadge } from "../components/StatusBadge.jsx";
import { LotTimeline } from "../components/LotTimeline.jsx";
import {
  monthlyProcurement,
  gradeDistribution,
  lots as demoLots,
  purchaseOrders as demoPOs,
  shipments as demoShipments,
  produceImages
} from "../data/demoData.js";
import { humanStatus } from "../utils/status.js";
import { getReportSummaryApi } from "../services/api.js";

const palette = ["#2f9e44", "#0f766e", "#f59f00", "#e11d48", "#4f46e5"];

export function DashboardPage() {
  const { user } = useAppStore();
  const [summaryData, setSummaryData] = useState(null);

  useEffect(() => {
    getReportSummaryApi()
      .then((data) => setSummaryData(data))
      .catch(() => setSummaryData(null));
  }, []);

  const isFarmer = user?.role === "FARMER";
  const isBuyer = user?.role === "BUYER";
  const isInspector = user?.role === "INSPECTOR";
  const isCollection = user?.role === "COLLECTION_MANAGER";
  const isLogistics = user?.role === "LOGISTICS";
  const isAdmin = user?.role === "ADMIN";

  const activeLot = demoLots[0];

  return (
    <div className="space-y-8 text-slate-900">
      <PageHeader
        title={isFarmer ? `Namaste, ${user.name} 👋` : isBuyer ? `Welcome, ${user.name} (Buyer)` : `${humanStatus(user.role)} Control Room`}
        subtitle={
          isFarmer
            ? "List your crops with images, track department clearance approvals, payouts, and settlements."
            : isBuyer
            ? "Browse cleared produce marketplace, procure approved products, and track order deliveries."
            : "Centralized mediator operations, quality inspection clearances, warehouse storage, and buyer allocations."
        }
      />

      {/* Role KPI Metrics Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {isFarmer ? (
          <>
            <KpiCard label="My Listed Produce Lots" value="24 Lots" icon={Leaf} trend="+2 this month" color="leaf" />
            <KpiCard label="Accepted Weight" value="8.4 Tons" icon={CheckCircle2} trend="Grade A & B" color="leaf" />
            <KpiCard label="Pending Department Clearance" value="3 Lots" icon={ClipboardCheck} trend="Inspection/Intake" color="harvest" />
            <KpiCard label="Total Received Settlement" value="₹83,460" icon={WalletCards} trend="Direct Bank" color="soil" />
          </>
        ) : isBuyer ? (
          <>
            <KpiCard label="Active Purchase Orders" value={`${demoPOs.length} Orders`} icon={FileText} trend="Fulfillment 88%" color="harvest" />
            <KpiCard label="Verified Cleared Products" value="4 Categories" icon={ShoppingBag} trend="100% Inspected" color="leaf" />
            <KpiCard label="Shipments In-Transit" value="1 Shipment" icon={Truck} trend="ETA Sep 25" color="sky" />
            <KpiCard label="Total Procurement Value" value="₹2,54,800" icon={WalletCards} trend="Cleared Payouts" color="soil" />
          </>
        ) : (
          <>
            <KpiCard label="Total Registered Farmers" value="20 Farmers" icon={Users} trend="+15% YTD" color="leaf" />
            <KpiCard label="Available Warehouse Stock" value="42.8 Tons" icon={Warehouse} trend="Healthy Stock" color="sky" />
            <KpiCard label="Active Purchase Orders" value={`${demoPOs.length} Orders`} icon={FileText} trend="Fulfillment 88%" color="harvest" />
            <KpiCard label="Pending Farmer Settlements" value="₹1,07,450" icon={WalletCards} trend="12 Ready" color="soil" />
          </>
        )}
      </div>

      {/* FARMER DASHBOARD */}
      {isFarmer && (
        <div className="space-y-6">
          <div className="rounded-3xl border-2 border-slate-300 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-950 mb-4">Quick Farmer Actions</h3>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              <Link
                to="/app/lots"
                className="flex items-center gap-4 rounded-2xl bg-leaf-600 p-5 text-white shadow-md transition-transform hover:-translate-y-0.5 hover:bg-leaf-700"
              >
                <PlusCircle className="h-8 w-8 shrink-0" />
                <div>
                  <p className="text-base font-black">+ Sell Crop Produce</p>
                  <p className="text-xs text-leaf-100">Upload harvest with photo</p>
                </div>
              </Link>
              <Link
                to="/app/lots"
                className="flex items-center gap-4 rounded-2xl bg-slate-50 border-2 border-slate-300 p-5 text-slate-900 shadow-xs transition-transform hover:-translate-y-0.5"
              >
                <ClipboardCheck className="h-8 w-8 text-leaf-700 shrink-0" />
                <div>
                  <p className="text-base font-black">Inspection Status</p>
                  <p className="text-xs text-slate-700">View grade & moisture %</p>
                </div>
              </Link>
              <Link
                to="/app/settlements"
                className="flex items-center gap-4 rounded-2xl bg-slate-50 border-2 border-slate-300 p-5 text-slate-900 shadow-xs transition-transform hover:-translate-y-0.5"
              >
                <WalletCards className="h-8 w-8 text-amber-700 shrink-0" />
                <div>
                  <p className="text-base font-black">My Settlements</p>
                  <p className="text-xs text-slate-700">Check payout calculation</p>
                </div>
              </Link>
              <Link
                to="/app/disputes"
                className="flex items-center gap-4 rounded-2xl bg-slate-50 border-2 border-slate-300 p-5 text-slate-900 shadow-xs transition-transform hover:-translate-y-0.5"
              >
                <ShieldCheck className="h-8 w-8 text-rose-700 shrink-0" />
                <div>
                  <p className="text-base font-black">Raise Dispute</p>
                  <p className="text-xs text-slate-700">Report quality/payment issue</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border-2 border-slate-300 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-950">Active Lot Clearance Tracking</h3>
                <p className="text-xs font-bold text-slate-700">{activeLot.lotNumber} · {activeLot.produce}</p>
              </div>
              <StatusBadge status={activeLot.status} />
            </div>
            <LotTimeline currentStatus={activeLot.status} />
          </div>
        </div>
      )}

      {/* BUYER E-COMMERCE DASHBOARD */}
      {isBuyer && (
        <div className="space-y-6">
          <div className="rounded-3xl border-2 border-slate-300 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-950">Verified Cleared Products Marketplace</h3>
                <p className="text-xs font-bold text-slate-700">Only products approved by Quality Inspection & Collection intake appear here</p>
              </div>
              <Link
                to="/app/orders"
                className="flex items-center gap-2 rounded-xl bg-leaf-600 px-5 py-2.5 text-xs font-black text-white hover:bg-leaf-700 shadow-md"
              >
                <ShoppingBag className="h-4 w-4" /> Open Full E-Commerce Store →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {demoLots.slice(0, 3).map((l) => (
                <div key={l.lotNumber} className="overflow-hidden rounded-2xl border-2 border-slate-300 bg-white shadow-xs">
                  <div className="h-32 w-full overflow-hidden bg-slate-100">
                    <img src={l.imageUrl || produceImages[l.produce]} alt={l.produce} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-black text-slate-950">{l.produce}</p>
                      <span className="rounded-full bg-emerald-100 border border-emerald-400 px-2 py-0.5 text-[10px] font-black text-emerald-950">
                        ✓ {l.grade || "Grade A"}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-700">{l.quantity} {l.unit} Stock</p>
                    <p className="text-xs font-black text-leaf-700">₹{l.expectedPrice || 30} / {l.unit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ADMIN & INTERNAL MEDIATORS DASHBOARD */}
      {(isAdmin || isCollection || isInspector || isLogistics) && (
        <>
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="rounded-3xl border-2 border-slate-300 bg-white p-6 shadow-sm lg:col-span-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-black text-slate-950">Monthly Procurement Volume (Tons)</h3>
                  <p className="text-xs font-bold text-slate-700">Accepted produce cleared by Quality Inspection</p>
                </div>
                <span className="rounded-full bg-leaf-100 border border-leaf-400 px-3 py-1 text-xs font-black text-leaf-950">
                  Live Trend
                </span>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={monthlyProcurement}>
                  <XAxis dataKey="month" stroke="#334155" />
                  <YAxis stroke="#334155" />
                  <Tooltip />
                  <Area type="monotone" dataKey="quantity" stroke="#2f9e44" fill="#d8f4dd" strokeWidth={3} name="Tons" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-3xl border-2 border-slate-300 bg-white p-6 shadow-sm lg:col-span-4">
              <h3 className="text-lg font-black text-slate-950 mb-2">Quality Grade Split</h3>
              <p className="text-xs font-bold text-slate-700 mb-4">Inspected produce lot grades</p>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={gradeDistribution} dataKey="value" nameKey="name" outerRadius={85} innerRadius={50} paddingAngle={4}>
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

          <div className="grid gap-6 lg:grid-cols-12">
            <div className="rounded-3xl border-2 border-slate-300 bg-white p-6 shadow-sm lg:col-span-7">
              <h3 className="text-lg font-black text-slate-950 mb-4">Lot Clearance Lifecycle Visualizer</h3>
              <LotTimeline currentStatus={activeLot.status} />
            </div>

            <div className="rounded-3xl border-2 border-slate-300 bg-white p-6 shadow-sm lg:col-span-5">
              <h3 className="text-lg font-black text-slate-950 mb-4">Recent Shipments in Transit</h3>
              <div className="space-y-3">
                {demoShipments.map((s) => (
                  <div key={s.shipmentNumber} className="flex items-center justify-between rounded-2xl border-2 border-slate-300 bg-slate-50 p-4">
                    <div>
                      <p className="text-sm font-black text-slate-950">{s.shipmentNumber}</p>
                      <p className="text-xs font-bold text-slate-700">{s.destination} · {s.vehicle}</p>
                    </div>
                    <StatusBadge status={s.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
