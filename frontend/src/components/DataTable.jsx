import React, { useState, useMemo } from "react";
import { Download, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { StatusBadge } from "./StatusBadge.jsx";
import { humanStatus } from "../utils/status.js";

export function DataTable({
  title,
  rows = [],
  columns = [],
  actions,
  searchPlaceholder = "Search records...",
  onRowClick
}) {
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState(columns[0] || "");
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      return !search || JSON.stringify(row).toLowerCase().includes(search.toLowerCase());
    });
  }, [rows, search]);

  const sorted = useMemo(() => {
    if (!sortCol) return filtered;
    return [...filtered].sort((a, b) => {
      let valA = a[sortCol] ?? "";
      let valB = b[sortCol] ?? "";
      if (typeof valA === "object") valA = valA.name || valA.lotNumber || "";
      if (typeof valB === "object") valB = valB.name || valB.lotNumber || "";
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filtered, sortCol, sortAsc]);

  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page]);

  function exportCSV() {
    if (!rows.length) return;
    const headers = columns.join(",");
    const csvRows = rows.map((r) =>
      columns
        .map((col) => {
          let val = r[col];
          if (typeof val === "object" && val !== null) val = val.name || val.lotNumber || JSON.stringify(val);
          return `"${String(val ?? "").replace(/"/g, '""')}"`;
        })
        .join(",")
    );
    const blob = new Blob([[headers, ...csvRows].join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(title || "data").toLowerCase().replace(/\s+/g, "_")}_export.csv`;
    a.click();
  }

  function handleSort(col) {
    if (sortCol === col) {
      setSortAsc(!sortAsc);
    } else {
      setSortCol(col);
      setSortAsc(true);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-300 bg-white p-6 shadow-soft dark:border-white/15 dark:bg-[#122419]">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {title && <h3 className="text-lg font-black text-slate-900 dark:text-white">{title}</h3>}

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-3 text-xs font-bold text-slate-900 focus:border-leaf-600 focus:outline-none dark:border-white/20 dark:bg-white/5 dark:text-white"
            />
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-black text-slate-800 shadow-sm hover:bg-slate-50 dark:border-white/20 dark:bg-white/10 dark:text-white"
          >
            <Download className="h-4 w-4" /> CSV Export
          </button>
        </div>
      </div>

      {/* Table container */}
      <div className="overflow-hidden rounded-2xl border border-slate-300 dark:border-white/15">
        <div className="hidden bg-slate-100 px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-800 dark:bg-white/10 dark:text-slate-200 md:grid md:grid-cols-12 gap-2">
          {columns.map((col, idx) => (
            <div
              key={col}
              onClick={() => handleSort(col)}
              className={`cursor-pointer hover:text-leaf-600 ${
                idx === 0 ? "col-span-3" : idx === columns.length - 1 ? "col-span-2" : "col-span-2"
              }`}
            >
              {humanStatus(col)} {sortCol === col ? (sortAsc ? "▲" : "▼") : ""}
            </div>
          ))}
          {actions && <div className="col-span-1 text-right">Action</div>}
        </div>

        {paginated.length === 0 ? (
          <div className="p-8 text-center text-xs font-bold text-slate-600 dark:text-slate-300">
            No matching records found.
          </div>
        ) : (
          paginated.map((row, idx) => (
            <div
              key={row._id || row.id || row.lotNumber || row.poNumber || idx}
              onClick={() => onRowClick && onRowClick(row)}
              className={`flex flex-col border-t border-slate-200 bg-white p-4 text-xs font-bold transition-colors dark:border-white/10 dark:bg-transparent md:grid md:grid-cols-12 md:items-center gap-2 ${
                onRowClick ? "cursor-pointer hover:bg-leaf-50/70 dark:hover:bg-white/5" : ""
              }`}
            >
              {columns.map((col, colIdx) => {
                const cellVal = renderCellValue(row, col);
                const colSpan = colIdx === 0 ? "col-span-3" : colIdx === columns.length - 1 ? "col-span-2" : "col-span-2";
                return (
                  <div key={col} className={`${colSpan} flex items-center justify-between md:block`}>
                    <span className="text-[11px] font-black uppercase text-slate-500 md:hidden">
                      {humanStatus(col)}
                    </span>
                    {col === "status" ? (
                      <StatusBadge status={row[col]} />
                    ) : (
                      <span className="font-extrabold text-slate-900 dark:text-slate-100">
                        {cellVal}
                      </span>
                    )}
                  </div>
                );
              })}
              {actions && (
                <div className="col-span-1 mt-2 flex justify-end md:mt-0">
                  {actions(row)}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex flex-col items-center justify-between gap-3 text-xs font-black text-slate-700 dark:text-slate-300 sm:flex-row">
        <span>
          Showing {Math.min((page - 1) * pageSize + 1, sorted.length)} to{" "}
          {Math.min(page * pageSize, sorted.length)} of {sorted.length} entries
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="flex items-center rounded-lg border border-slate-300 px-3 py-1.5 disabled:opacity-40 dark:border-white/20"
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center rounded-lg border border-slate-300 px-3 py-1.5 disabled:opacity-40 dark:border-white/20"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function renderCellValue(row, col) {
  const val = row[col];
  if (val === undefined || val === null) return "-";
  if (typeof val === "object") {
    return val.name || val.lotNumber || val.poNumber || val.farmerCode || val.registrationNumber || JSON.stringify(val);
  }
  if (["value", "grossAmount", "netPayableAmount", "totalValue", "net"].includes(col)) {
    return `₹${Number(val).toLocaleString("en-IN")}`;
  }
  if (typeof val === "number") {
    return val.toLocaleString("en-IN");
  }
  return String(val);
}
