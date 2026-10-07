import React from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  Search,
  Bell,
  LogOut,
  UserCheck
} from "lucide-react";
import { useAppStore } from "../store/useAppStore.js";
import { humanStatus } from "../utils/status.js";

export function Header({ onOpenSidebar }) {
  const { user, logout, search, setSearch } = useAppStore();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-300 bg-white/95 px-4 py-3.5 backdrop-blur sm:px-6 text-slate-900 shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="rounded-xl border border-slate-300 p-2.5 text-slate-800 hover:bg-slate-100 lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products, orders, farmers..."
            className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-3 text-xs font-black text-slate-900 focus:border-leaf-600 focus:outline-none"
          />
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {/* Active User Role Badge */}
          <div className="flex items-center gap-2 rounded-xl border border-leaf-400 bg-leaf-100 px-3.5 py-2 text-xs font-black text-leaf-950">
            <UserCheck className="h-4 w-4 text-leaf-700" />
            <span className="hidden sm:inline">{humanStatus(user?.role || "ROLE")}</span>
          </div>

          {/* Notifications */}
          <Link
            to="/app/notifications"
            className="relative rounded-xl border border-slate-300 p-2.5 text-slate-800 hover:bg-slate-100"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
          </Link>

          {/* Logout */}
          <button
            onClick={logout}
            className="rounded-xl border border-slate-300 p-2.5 text-slate-800 hover:bg-rose-50 hover:text-rose-600"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
