import React from "react";
import { Leaf } from "lucide-react";

export function EmptyState({ title = "No data found", description, action, icon: Icon = Leaf }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-white/15 dark:bg-white/5">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-leaf-50 text-leaf-600 dark:bg-leaf-950/40 dark:text-leaf-300">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="mt-4 text-lg font-black text-slate-900 dark:text-white">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-xs font-medium text-slate-500 dark:text-slate-400">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
