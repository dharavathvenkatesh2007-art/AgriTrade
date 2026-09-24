export const statusMap = {
  CREATED: "bg-slate-100 text-slate-900 border-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600",
  RECEIVED: "bg-sky-100 text-sky-950 border-sky-300 dark:bg-sky-950 dark:text-sky-200 dark:border-sky-700",
  INSPECTION_PENDING: "bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-700",
  INSPECTED: "bg-indigo-100 text-indigo-950 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-200 dark:border-indigo-700",
  ACCEPTED: "bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-700",
  REJECTED: "bg-rose-100 text-rose-950 border-rose-300 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-700",
  STORED: "bg-teal-100 text-teal-950 border-teal-300 dark:bg-teal-950 dark:text-teal-200 dark:border-teal-700",
  ALLOCATED: "bg-violet-100 text-violet-950 border-violet-300 dark:bg-violet-950 dark:text-violet-200 dark:border-violet-700",
  DISPATCHED: "bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-700",
  DELIVERED: "bg-green-100 text-green-950 border-green-300 dark:bg-green-950 dark:text-green-200 dark:border-green-700",
  PAID: "bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-700",
  OPEN: "bg-rose-100 text-rose-950 border-rose-300 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-700",
  RESOLVED: "bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-700",
  CANCELLED: "bg-slate-200 text-slate-900 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
  IN_TRANSIT: "bg-blue-100 text-blue-950 border-blue-300 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-700"
};

export function humanStatus(status = "") {
  if (!status) return "";
  return String(status).replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

export function statusClass(status) {
  return statusMap[status] || "bg-slate-100 text-slate-900 border-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600";
}
