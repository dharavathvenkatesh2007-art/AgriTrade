import React from "react";
import { ShieldCheck } from "lucide-react";

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5 dark:border-white/10">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {title}
          </h1>
          <span className="hidden items-center gap-1 rounded-full bg-leaf-100 border border-leaf-300 px-3 py-1 text-xs font-black text-leaf-900 dark:bg-leaf-950 dark:border-leaf-700 dark:text-leaf-200 md:inline-flex">
            <ShieldCheck className="h-3.5 w-3.5 text-leaf-700 dark:text-leaf-400" /> Scoped & Verified
          </span>
        </div>
        {subtitle && (
          <p className="mt-2 max-w-3xl text-sm font-bold leading-relaxed text-slate-700 dark:text-slate-300">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
