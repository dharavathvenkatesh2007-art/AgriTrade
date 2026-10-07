import React from "react";
import { Link } from "react-router-dom";
import {
  Sprout,
  PlusCircle,
  ShoppingBag,
  ClipboardCheck,
  Warehouse,
  Truck,
  WalletCards,
  ShieldCheck,
  Users,
  FileText,
  ArrowRight,
  CheckCircle2,
  Clock,
  ChevronRight,
  Sparkles,
  BarChart3
} from "lucide-react";
import { useAppStore } from "../store/useAppStore.js";
import { PageHeader } from "../components/PageHeader.jsx";
import { KpiCard } from "../components/KpiCard.jsx";
import { StatusBadge } from "../components/StatusBadge.jsx";
import { lots as demoLots, purchaseOrders as demoPOs, shipments as demoShipments, produceImages } from "../data/demoData.js";
import { humanStatus } from "../utils/status.js";

export function HomePage() {
  const { user } = useAppStore();

  const isFarmer = user?.role === "FARMER";
  const isBuyer = user?.role === "BUYER";
  const isInspector = user?.role === "INSPECTOR";
  const isCollection = user?.role === "COLLECTION_MANAGER";
  const isLogistics = user?.role === "LOGISTICS";
  const isAdmin = user?.role === "ADMIN";

  const userRoleText = humanStatus(user?.role || "FARMER");

  return (
    <div className="space-y-8 text-slate-950">
      {/* Clean Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-slate-300 bg-gradient-to-br from-leaf-700 via-leaf-800 to-slate-900 p-8 text-white shadow-md">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-xs font-black text-white backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>AgriTrade Platform · {userRoleText} Workspace</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            {isFarmer
              ? `Namaste, ${user?.name || "Farmer"}! 🌾`
              : isBuyer
              ? `Welcome back, ${user?.name || "Buyer"}! 🛒`
              : `Hello, ${user?.name || "Team Member"}! 👋`}
          </h1>
          <p className="text-sm font-medium text-leaf-100 leading-relaxed">
            {isFarmer
              ? "List your fresh crop harvest with photos, track quality inspection clearances, and receive direct bank payouts."
              : isBuyer
              ? "Access 100% verified, quality-inspected farm produce directly from procurement collection centers."
              : "Manage agricultural supply chain workflows, intake lot weigh-ins, quality grading, warehouse storage, and logistics."}
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            {isFarmer && (
              <Link
                to="/app/lots"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-black text-leaf-900 hover:bg-leaf-50 transition-all shadow-md"
              >
                <PlusCircle className="h-4.5 w-4.5 text-leaf-700" /> + Sell Crop Produce
              </Link>
            )}
            {isBuyer && (
              <Link
                to="/app/orders"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-black text-leaf-900 hover:bg-leaf-50 transition-all shadow-md"
              >
                <ShoppingBag className="h-4.5 w-4.5 text-leaf-700" /> Browse Cleared Marketplace
              </Link>
            )}
            <Link
              to="/app/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 text-xs font-black text-white hover:bg-white/20 transition-all border border-white/30"
            >
              <BarChart3 className="h-4.5 w-4.5" /> Full Analytics Control Room →
            </Link>
          </div>
        </div>
        <div className="absolute right-6 bottom-0 hidden lg:block opacity-20 pointer-events-none">
          <Sprout className="h-64 w-64 text-white" />
        </div>
      </div>

      {/* Primary KPI Metrics Summary */}
      <div className="space-y-3">
        <h2 className="text-base font-black text-slate-950 uppercase tracking-wider">Key Metrics Overview</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {isFarmer ? (
            <>
              <KpiCard label="My Listed Crops" value="24 Lots" icon={Sprout} trend="+2 this harvest" color="leaf" />
              <KpiCard label="Cleared Produce Weight" value="8.4 Tons" icon={CheckCircle2} trend="Grade A & B" color="leaf" />
              <KpiCard label="In-Inspection Clearance" value="3 Lots" icon={Clock} trend="Intake stage" color="harvest" />
              <KpiCard label="Total Received Payout" value="₹83,460" icon={WalletCards} trend="Direct Bank" color="soil" />
            </>
          ) : isBuyer ? (
            <>
              <KpiCard label="My Active Orders" value={`${demoPOs.length} Orders`} icon={FileText} trend="Fulfillment 88%" color="harvest" />
              <KpiCard label="Verified Categories" value="4 Products" icon={ShoppingBag} trend="100% Inspected" color="leaf" />
              <KpiCard label="Shipments In-Transit" value="1 Shipment" icon={Truck} trend="ETA Sep 25" color="sky" />
              <KpiCard label="Total Procurement" value="₹2,54,800" icon={WalletCards} trend="Cleared POs" color="soil" />
            </>
          ) : (
            <>
              <KpiCard label="Registered Farmers" value="20 Farmers" icon={Users} trend="Active Network" color="leaf" />
              <KpiCard label="Warehouse Stock" value="42.8 Tons" icon={Warehouse} trend="3 Facilities" color="sky" />
              <KpiCard label="Active Purchase Orders" value={`${demoPOs.length} Orders`} icon={FileText} trend="Procurement Active" color="harvest" />
              <KpiCard label="Pending Settlements" value="₹1,07,450" icon={WalletCards} trend="12 Ready" color="soil" />
            </>
          )}
        </div>
      </div>

      {/* Quick Role Actions Navigation Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-black text-slate-950 uppercase tracking-wider">Quick Operational Shortcuts</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isFarmer && (
            <>
              <Link
                to="/app/lots"
                className="group flex flex-col justify-between rounded-2xl border-2 border-slate-300 bg-white p-5 shadow-xs transition-all hover:border-leaf-600 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-leaf-100 text-leaf-700">
                    <PlusCircle className="h-6 w-6" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-leaf-700 transition-colors" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-950 group-hover:text-leaf-800">Sell Produce Lot</h3>
                  <p className="text-xs font-bold text-slate-700 mt-1">Upload new harvest lot with photos & price</p>
                </div>
              </Link>

              <Link
                to="/app/lots"
                className="group flex flex-col justify-between rounded-2xl border-2 border-slate-300 bg-white p-5 shadow-xs transition-all hover:border-leaf-600 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <ClipboardCheck className="h-6 w-6" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-emerald-700 transition-colors" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-950 group-hover:text-emerald-800">Check Lot Clearance</h3>
                  <p className="text-xs font-bold text-slate-700 mt-1">Track inspection moisture % & quality grade</p>
                </div>
              </Link>

              <Link
                to="/app/settlements"
                className="group flex flex-col justify-between rounded-2xl border-2 border-slate-300 bg-white p-5 shadow-xs transition-all hover:border-amber-600 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                    <WalletCards className="h-6 w-6" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-amber-800 transition-colors" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-950 group-hover:text-amber-900">My Settlements</h3>
                  <p className="text-xs font-bold text-slate-700 mt-1">View payment calculation & bank transfer status</p>
                </div>
              </Link>

              <Link
                to="/app/disputes"
                className="group flex flex-col justify-between rounded-2xl border-2 border-slate-300 bg-white p-5 shadow-xs transition-all hover:border-rose-600 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-rose-700 transition-colors" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-950 group-hover:text-rose-800">Dispute Desk</h3>
                  <p className="text-xs font-bold text-slate-700 mt-1">Raise concern regarding grade or weight deduction</p>
                </div>
              </Link>
            </>
          )}

          {isBuyer && (
            <>
              <Link
                to="/app/orders"
                className="group flex flex-col justify-between rounded-2xl border-2 border-slate-300 bg-white p-5 shadow-xs transition-all hover:border-leaf-600 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-leaf-100 text-leaf-700">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-leaf-700 transition-colors" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-950 group-hover:text-leaf-800">Cleared Produce Marketplace</h3>
                  <p className="text-xs font-bold text-slate-700 mt-1">Order Grade A/B inspected crops direct from stock</p>
                </div>
              </Link>

              <Link
                to="/app/orders"
                className="group flex flex-col justify-between rounded-2xl border-2 border-slate-300 bg-white p-5 shadow-xs transition-all hover:border-emerald-600 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <FileText className="h-6 w-6" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-emerald-700 transition-colors" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-950 group-hover:text-emerald-800">Purchase Orders</h3>
                  <p className="text-xs font-bold text-slate-700 mt-1">Track PO status, allocations, & lot assignments</p>
                </div>
              </Link>

              <Link
                to="/app/shipments"
                className="group flex flex-col justify-between rounded-2xl border-2 border-slate-300 bg-white p-5 shadow-xs transition-all hover:border-sky-600 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                    <Truck className="h-6 w-6" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-sky-700 transition-colors" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-950 group-hover:text-sky-800">Delivery Logistics</h3>
                  <p className="text-xs font-bold text-slate-700 mt-1">Track driver dispatch & live shipment delivery ETA</p>
                </div>
              </Link>

              <Link
                to="/app/disputes"
                className="group flex flex-col justify-between rounded-2xl border-2 border-slate-300 bg-white p-5 shadow-xs transition-all hover:border-rose-600 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-rose-700 transition-colors" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-950 group-hover:text-rose-800">Buyer Support & Disputes</h3>
                  <p className="text-xs font-bold text-slate-700 mt-1">Report delivery mismatch or quantity variance</p>
                </div>
              </Link>
            </>
          )}

          {(isAdmin || isCollection || isInspector || isLogistics) && (
            <>
              <Link
                to="/app/lots"
                className="group flex flex-col justify-between rounded-2xl border-2 border-slate-300 bg-white p-5 shadow-xs transition-all hover:border-leaf-600 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-leaf-100 text-leaf-700">
                    <Sprout className="h-6 w-6" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-leaf-700 transition-colors" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-950 group-hover:text-leaf-800">Produce Lot Intake</h3>
                  <p className="text-xs font-bold text-slate-700 mt-1">Receive farmer lots & record gross weigh-ins</p>
                </div>
              </Link>

              <Link
                to="/app/inspections"
                className="group flex flex-col justify-between rounded-2xl border-2 border-slate-300 bg-white p-5 shadow-xs transition-all hover:border-emerald-600 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <ClipboardCheck className="h-6 w-6" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-emerald-700 transition-colors" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-950 group-hover:text-emerald-800">Quality Inspection</h3>
                  <p className="text-xs font-bold text-slate-700 mt-1">Test moisture %, defects & assign Grade A/B/C</p>
                </div>
              </Link>

              <Link
                to="/app/inventory"
                className="group flex flex-col justify-between rounded-2xl border-2 border-slate-300 bg-white p-5 shadow-xs transition-all hover:border-sky-600 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                    <Warehouse className="h-6 w-6" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-sky-700 transition-colors" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-950 group-hover:text-sky-800">Warehouse Stock</h3>
                  <p className="text-xs font-bold text-slate-700 mt-1">Manage accepted stock & bin allocation</p>
                </div>
              </Link>

              <Link
                to="/app/shipments"
                className="group flex flex-col justify-between rounded-2xl border-2 border-slate-300 bg-white p-5 shadow-xs transition-all hover:border-amber-600 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                    <Truck className="h-6 w-6" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-amber-800 transition-colors" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-950 group-hover:text-amber-900">Logistics Dispatch</h3>
                  <p className="text-xs font-bold text-slate-700 mt-1">Assign drivers, vehicles & track deliveries</p>
                </div>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Clean Highlights & Preview Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: Cleared Marketplace / Active Lots Preview */}
        <div className="rounded-3xl border-2 border-slate-300 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-lg font-black text-slate-950">
                {isBuyer ? "Top Cleared Produce Available" : "Recent Produce Lot Status"}
              </h3>
              <p className="text-xs font-bold text-slate-700">
                {isBuyer ? "Verified & cleared by Quality Inspection" : "Track latest crop clearance stages"}
              </p>
            </div>
            <Link
              to={isBuyer ? "/app/orders" : "/app/lots"}
              className="text-xs font-black text-leaf-700 hover:text-leaf-800 flex items-center gap-1"
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {demoLots.slice(0, 3).map((lot) => (
              <div
                key={lot.lotNumber}
                className="flex items-center gap-4 rounded-2xl border-2 border-slate-200 bg-slate-50 p-3 hover:border-slate-300 transition-all"
              >
                <img
                  src={lot.imageUrl || produceImages[lot.produce]}
                  alt={lot.produce}
                  className="h-14 w-14 rounded-xl object-cover border border-slate-300 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-black text-slate-950 truncate">{lot.produce}</p>
                    <StatusBadge status={lot.status} />
                  </div>
                  <p className="text-xs font-bold text-slate-700">
                    {lot.lotNumber} · {lot.quantity} {lot.unit}
                  </p>
                  <p className="text-xs font-black text-leaf-700">
                    Expected Price: ₹{lot.expectedPrice || 30}/{lot.unit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live Shipments / PO Activity */}
        <div className="rounded-3xl border-2 border-slate-300 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-lg font-black text-slate-950">Active Orders & Deliveries</h3>
              <p className="text-xs font-bold text-slate-700">Live logistics dispatch & shipment tracking</p>
            </div>
            <Link
              to={isBuyer ? "/app/orders" : "/app/shipments"}
              className="text-xs font-black text-leaf-700 hover:text-leaf-800 flex items-center gap-1"
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {demoShipments.map((s) => (
              <div
                key={s.shipmentNumber}
                className="flex items-center justify-between rounded-2xl border-2 border-slate-200 bg-slate-50 p-4"
              >
                <div>
                  <p className="text-sm font-black text-slate-950">{s.shipmentNumber}</p>
                  <p className="text-xs font-bold text-slate-700">
                    Destination: {s.destination} · Vehicle: {s.vehicle}
                  </p>
                </div>
                <StatusBadge status={s.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
