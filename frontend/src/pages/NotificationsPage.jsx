import React, { useState } from "react";
import { Bell, CheckCircle2, Info, Check } from "lucide-react";
import { PageHeader } from "../components/PageHeader.jsx";
import { notifications as initialNotifications } from "../data/demoData.js";

export function NotificationsPage() {
  const [list, setList] = useState(initialNotifications);

  function markAllRead() {
    setList(list.map((n) => ({ ...n, unread: false })));
  }

  return (
    <div className="space-y-6 text-slate-900 dark:text-white">
      <PageHeader
        title="In-App Notification Center"
        subtitle="Role-specific alert triggers for lot intake, inspection results, purchase order allocations, transit dispatches, and settlement payouts."
        action={
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 rounded-xl bg-leaf-600 px-5 py-3 text-xs font-black text-white shadow-md hover:bg-leaf-700 transition-all"
          >
            <Check className="h-4 w-4 text-white" /> Mark All as Read
          </button>
        }
      />

      <div className="space-y-4">
        {list.map((item, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-4 rounded-3xl border-2 p-6 shadow-md transition-all ${
              item.unread
                ? "border-leaf-400 bg-leaf-100/90 dark:border-leaf-600 dark:bg-[#102d1d]"
                : "border-slate-300 bg-white dark:border-white/20 dark:bg-[#122419]"
            }`}
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-black shadow-md text-white ${
                item.type === "SUCCESS"
                  ? "bg-leaf-600"
                  : item.type === "WARNING"
                  ? "bg-amber-600"
                  : "bg-sky-600"
              }`}
            >
              <Bell className="h-6 w-6" />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-black text-slate-950 dark:text-white">{item.title}</h4>
                <span className="text-xs font-black text-slate-700 dark:text-slate-300">{item.time}</span>
              </div>
              <p className="mt-2 text-xs font-bold leading-relaxed text-slate-900 dark:text-slate-100">
                {item.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
