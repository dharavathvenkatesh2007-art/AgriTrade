import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Leaf,
  ClipboardCheck,
  Warehouse,
  FileText,
  Truck,
  WalletCards,
  ShieldCheck,
  ChartNoAxesCombined,
  Bell,
  Settings,
  Sprout,
  X,
  ShoppingBag
} from "lucide-react";
import { useAppStore } from "../store/useAppStore.js";
import { humanStatus } from "../utils/status.js";

// Role-based navigation item rules
const allNavItems = [
  {
    to: "/app",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN", "FARMER", "BUYER", "COLLECTION_MANAGER", "INSPECTOR", "LOGISTICS"]
  },
  {
    to: "/app/lots",
    label: "Produce Lots",
    farmerLabel: "My Produce Lots (+Sell)",
    icon: Leaf,
    roles: ["ADMIN", "FARMER", "COLLECTION_MANAGER", "INSPECTOR"]
  },
  {
    to: "/app/orders",
    label: "Purchase Orders",
    buyerLabel: "E-Commerce Produce Store",
    icon: FileText,
    buyerIcon: ShoppingBag,
    roles: ["ADMIN", "BUYER"]
  },
  {
    to: "/app/inspections",
    label: "Quality Inspections",
    icon: ClipboardCheck,
    roles: ["ADMIN", "INSPECTOR"]
  },
  {
    to: "/app/inventory",
    label: "Warehouse & Inventory",
    icon: Warehouse,
    roles: ["ADMIN", "COLLECTION_MANAGER", "LOGISTICS"]
  },
  {
    to: "/app/shipments",
    label: "Shipments & Logistics",
    icon: Truck,
    roles: ["ADMIN", "LOGISTICS", "BUYER"]
  },
  {
    to: "/app/settlements",
    label: "Farmer Settlements",
    farmerLabel: "My Payout Settlements",
    icon: WalletCards,
    roles: ["ADMIN", "FARMER"]
  },
  {
    to: "/app/disputes",
    label: "Disputes",
    farmerLabel: "My Disputes",
    buyerLabel: "My Disputes",
    icon: ShieldCheck,
    roles: ["ADMIN", "FARMER", "BUYER"]
  },
  {
    to: "/app/farmers",
    label: "Farmers Directory",
    icon: Users,
    roles: ["ADMIN"]
  },
  {
    to: "/app/reports",
    label: "Reports & Analytics",
    icon: ChartNoAxesCombined,
    roles: ["ADMIN"]
  },
  {
    to: "/app/notifications",
    label: "Notifications",
    icon: Bell,
    roles: ["ADMIN", "FARMER", "BUYER", "COLLECTION_MANAGER", "INSPECTOR", "LOGISTICS"]
  },
  {
    to: "/app/audit",
    label: "Audit Logs",
    icon: Settings,
    roles: ["ADMIN"]
  },
  {
    to: "/app/settings",
    label: "Settings & Master Data",
    icon: Settings,
    roles: ["ADMIN"]
  }
];

export function Sidebar({ isOpen, onClose }) {
  const { user } = useAppStore();
  const userRole = user?.role || "FARMER";

  const roleNavItems = allNavItems.filter((item) => item.roles.includes(userRole));

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-slate-300 bg-white p-5 transition-transform duration-200 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
        isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 text-2xl font-black text-leaf-700">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf-600 text-white shadow-md">
            <Sprout className="h-6 w-6" />
          </div>
          <span className="text-slate-900">AgriTrade</span>
        </Link>
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Role Badge Box */}
      <div className="mt-5 rounded-2xl bg-leaf-950 p-4 text-white shadow-md border border-leaf-800">
        <p className="text-[11px] font-black uppercase tracking-wider text-leaf-300">Active User Role</p>
        <p className="mt-0.5 text-base font-black text-white">
          {humanStatus(userRole)}
        </p>
        <p className="mt-0.5 text-xs font-bold text-slate-200">{user?.name || "Demo User"}</p>
      </div>

      {/* Role Navigation Items */}
      <nav className="mt-5 space-y-1.5 overflow-y-auto max-h-[calc(100vh-230px)] pr-1">
        {roleNavItems.map((item) => {
          let label = item.label;
          if (userRole === "FARMER" && item.farmerLabel) label = item.farmerLabel;
          if (userRole === "BUYER" && item.buyerLabel) label = item.buyerLabel;

          const Icon = (userRole === "BUYER" && item.buyerIcon) ? item.buyerIcon : item.icon;

          return (
            <NavLink
              key={item.to}
              end={item.to === "/app"}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-black transition-all ${
                  isActive
                    ? "bg-leaf-600 text-white shadow-md"
                    : "text-slate-900 hover:bg-leaf-50 hover:text-leaf-900"
                }`
              }
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              <span>{label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
