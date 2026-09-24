import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  Search,
  Sun,
  Moon,
  Bell,
  LogOut,
  UserCheck,
  ChevronDown
} from "lucide-react";
import { useAppStore } from "../store/useAppStore.js";
import { demoUsers } from "../data/demoData.js";
import { humanStatus } from "../utils/status.js";

export function Header({ onOpenSidebar }) {
  const { user, darkMode, toggleTheme, logout, search, setSearch, switchRoleUser } = useAppStore();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3.5 backdrop-blur dark:border-white/10 dark:bg-[#0c1811]/95 sm:px-6 text-slate-900 dark:text-white">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="rounded-xl border border-slate-300 p-2.5 text-slate-800 hover:bg-slate-100 dark:border-white/20 dark:text-slate-100 dark:hover:bg-white/10 lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Global search (Lots, POs, Shipments, Farmers)..."
            className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-3 text-xs font-bold text-slate-900 focus:border-leaf-600 focus:outline-none dark:border-white/20 dark:bg-white/10 dark:text-white"
          />
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {/* Quick Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 rounded-xl border border-leaf-400 bg-leaf-100 px-3.5 py-2 text-xs font-black text-leaf-950 hover:bg-leaf-200 dark:border-leaf-700 dark:bg-leaf-950 dark:text-leaf-200"
            >
              <UserCheck className="h-4 w-4 text-leaf-700 dark:text-leaf-300" />
              <span className="hidden sm:inline">{humanStatus(user?.role || "ROLE")}</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-300 bg-white p-2 shadow-2xl dark:border-white/20 dark:bg-[#122419] z-50 text-slate-900 dark:text-white">
                <p className="px-3 py-2 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Switch Role Demo
                </p>
                {demoUsers.map((u) => (
                  <button
                    key={u.email}
                    onClick={() => {
                      switchRoleUser(u.email);
                      setRoleMenuOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-black transition-colors ${
                      user?.email === u.email
                        ? "bg-leaf-600 text-white"
                        : "text-slate-900 hover:bg-leaf-50 dark:text-slate-100 dark:hover:bg-white/10"
                    }`}
                  >
                    <div>
                      <p className="font-extrabold">{u.name}</p>
                      <p className={`text-[10px] ${user?.email === u.email ? "text-leaf-100" : "text-slate-500 dark:text-slate-400"}`}>
                        {humanStatus(u.role)}
                      </p>
                    </div>
                    {user?.email === u.email && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-xl border border-slate-300 p-2.5 text-slate-800 hover:bg-slate-100 dark:border-white/20 dark:text-slate-100 dark:hover:bg-white/10"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Notifications */}
          <Link
            to="/app/notifications"
            className="relative rounded-xl border border-slate-300 p-2.5 text-slate-800 hover:bg-slate-100 dark:border-white/20 dark:text-slate-100 dark:hover:bg-white/10"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
          </Link>

          {/* Logout */}
          <button
            onClick={logout}
            className="rounded-xl border border-slate-300 p-2.5 text-slate-800 hover:bg-rose-50 hover:text-rose-600 dark:border-white/20 dark:text-slate-100 dark:hover:bg-rose-950/40"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
