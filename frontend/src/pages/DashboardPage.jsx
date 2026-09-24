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
  shipments as demoShipments
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
    <div className="space-y-8 text-slate-900 dark:text-white">
      <PageHeader
        title={isFarmer ? `Namaste, ${user.name} 👋` : isBuyer ? `Welcome, ${user.name} (Buyer)` : `${humanStatus(user.role)} Control Room`}
        subtitle={
          isFarmer
            ? "Track your submitted crops, inspect results, payments, and settlements easily."
            : isBuyer
            ? "Browse cleared produce catalog, submit purchase orders, and track deliveries."
            : "Centralized supply chain operations, live inventory tracking, purchase orders, and settlements."
        }
      />

      {/* Role KPI Metrics Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {isFarmer ? (
          <>
            <KpiCard label="My Produce Lots" value="24 Lots" icon={Leaf} trend="+2 this month" color="leaf" />
            <KpiCard label="Accepted Weight" value="8.4 Tons" icon={CheckCircle2} trend="Grade A & B" color="leaf" />
            <KpiCard label="Pending Inspection" value="3 Lots" icon={ClipboardCheck} trend="Collection Center" color="harvest" />
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
            <KpiCard label="Available Warehouse Qty" value="42.8 Tons" icon={Warehouse} trend="Healthy Stock" color="sky" />
            <KpiCard label="Active Purchase Orders" value={`${demoPOs.length} Orders`} icon={FileText} trend="Fulfillment 88%" color="harvest" />
            <KpiCard label="Pending Farmer Settlements" value="₹1,07,450" icon={WalletCards} trend="12 Ready" color="soil" />
          </>
        )}
      </div>

      {/* FARMER SPECIFIC DASHBOARD */}
      {isFarmer && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-300 bg-white p-6 shadow-soft dark:border-white/15 dark:bg-[#122419]">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">Quick Farmer Actions</h3>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              <Link
                to="/app/lots"
                className="flex items-center gap-4 rounded-2xl bg-leaf-600 p-5 text-white shadow-md transition-transform hover:-translate-y-0.5 hover:bg-leaf-700"
              >
                <PlusCircle className="h-8 w-8 shrink-0" />
                <div>
                  <p className="text-base font-black">+ Add Crop Produce Lot</p>
                  <p className="text-xs text-leaf-100">Upload harvest with photos</p>
                </div>
              </Link>
              <Link
                to="/app/lots"
                className="flex items-center gap-4 rounded-2xl bg-white border border-slate-300 p-5 text-slate-900 shadow-sm transition-transform hover:-translate-y-0.5 dark:border-white/15 dark:bg-white/5 dark:text-white"
              >
                <ClipboardCheck className="h-8 w-8 text-leaf-600 shrink-0 dark:text-leaf-400" />
                <div>
                  <p className="text-base font-black">Inspection Results</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">View grade & moisture %</p>
                </div>
              </Link>
              <Link
                to="/app/settlements"
                className="flex items-center gap-4 rounded-2xl bg-white border border-slate-300 p-5 text-slate-900 shadow-sm transition-transform hover:-translate-y-0.5 dark:border-white/15 dark:bg-white/5 dark:text-white"
              >
                <WalletCards className="h-8 w-8 text-amber-600 shrink-0 dark:text-amber-400" />
                <div>
                  <p className="text-base font-black">My Settlements</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">Check payment payout state</p>
                </div>
              </Link>
              <Link
                to="/app/disputes"
                className="flex items-center gap-4 rounded-2xl bg-white border border-slate-300 p-5 text-slate-900 shadow-sm transition-transform hover:-translate-y-0.5 dark:border-white/15 dark:bg-white/5 dark:text-white"
              >
                <ShieldCheck className="h-8 w-8 text-rose-600 shrink-0 dark:text-rose-400" />
                <div>
                  <p className="text-base font-black">Raise Dispute</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">Report quality/payment issue</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-300 bg-white p-6 shadow-soft dark:border-white/15 dark:bg-[#122419]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Active Produce Lot Tracking</h3>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{activeLot.lotNumber} · {activeLot.produce}</p>
              </div>
              <StatusBadge status={activeLot.status} />
            </div>
            <LotTimeline currentStatus={activeLot.status} />
          </div>
        </div>
      )}

      {/* BUYER SPECIFIC DASHBOARD */}
      {isBuyer && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-300 bg-white p-6 shadow-soft dark:border-white/15 dark:bg-[#122419]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Quick Buyer Procurement</h3>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Browse cleared products or issue new purchase orders</p>
              </div>
              <Link
                to="/app/orders"
                className="flex items-center gap-2 rounded-xl bg-leaf-600 px-5 py-2.5 text-xs font-black text-white hover:bg-leaf-700"
              >
                <ShoppingBag className="h-4 w-4" /> Open Cleared Marketplace →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {demoLots.slice(0, 3).map((l) => (
                <div key={l.lotNumber} className="rounded-2xl border border-slate-300 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-black text-slate-900 dark:text-white">{l.produce}</p>
                    <span className="rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 text-[11px] font-black text-emerald-950 dark:bg-emerald-950 dark:border-emerald-700 dark:text-emerald-200">
                      {l.grade || "Grade A"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-bold text-slate-600 dark:text-slate-300">{l.quantity} {l.unit} Available</p>
                  <p className="mt-2 text-xs font-black text-leaf-700 dark:text-leaf-300">₹{l.expectedPrice || 30} / {l.unit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ADMIN / STAFF DASHBOARD (CHARTS & OVERALL OPERATIONS) */}
      {(isAdmin || isCollection || isInspector || isLogistics) && (
        <>
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="rounded-3xl border border-slate-300 bg-white p-6 shadow-soft dark:border-white/15 dark:bg-[#122419] lg:col-span-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Monthly Produce Procurement Volume</h3>
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Tons of accepted produce received at collection centers</p>
                </div>
                <span className="rounded-full bg-leaf-100 border border-leaf-300 px-3 py-1 text-xs font-black text-leaf-900 dark:bg-leaf-950 dark:border-leaf-700 dark:text-leaf-200">
                  Live Trend
                </span>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={monthlyProcurement}>
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Area type="monotone" dataKey="quantity" stroke="#2f9e44" fill="#d8f4dd" strokeWidth={3} name="Tons" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-3xl border border-slate-300 bg-white p-6 shadow-soft dark:border-white/15 dark:bg-[#122419] lg:col-span-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Quality Grade Split</h3>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-4">Breakdown of inspected produce lots</p>
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
            <div className="rounded-3xl border border-slate-300 bg-white p-6 shadow-soft dark:border-white/15 dark:bg-[#122419] lg:col-span-7">
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">Lot Lifecycle Visualizer</h3>
              <LotTimeline currentStatus={activeLot.status} />
            </div>

            <div className="rounded-3xl border border-slate-300 bg-white p-6 shadow-soft dark:border-white/15 dark:bg-[#122419] lg:col-span-5">
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">Recent Shipments in Transit</h3>
              <div className="space-y-3">
                {demoShipments.map((s) => (
                  <div key={s.shipmentNumber} className="flex items-center justify-between rounded-2xl border border-slate-300 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-white">{s.shipmentNumber}</p>
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{s.destination} · {s.vehicle}</p>
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
