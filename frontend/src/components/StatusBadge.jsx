import React from "react";
import { humanStatus, statusClass } from "../utils/status.js";

export function StatusBadge({ status, className = "" }) {
  if (!status) return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold transition-colors ${statusClass(
        status
      )} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {humanStatus(status)}
    </span>
  );
}
