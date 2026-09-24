import React from "react";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { workflow } from "../data/demoData.js";
import { humanStatus } from "../utils/status.js";

export function LotTimeline({ currentStatus = "CREATED", history = [] }) {
  const isRejected = currentStatus === "REJECTED";
  const currentIndex = workflow.indexOf(currentStatus);

  return (
    <div className="w-full space-y-4">
      <div className="relative flex flex-col justify-between gap-4 md:flex-row md:items-center">
        {workflow.map((step, index) => {
          const isDone = !isRejected && index <= currentIndex;
          const isCurrent = step === currentStatus;
          const stepFailed = isRejected && step === "ACCEPTED";

          return (
            <div key={step} className="relative flex flex-1 flex-col items-center text-center">
              {/* Connector line */}
              {index > 0 && (
                <div
                  className={`absolute left-[-50%] top-5 hidden h-0.5 w-full -translate-y-1/2 md:block ${
                    index <= currentIndex && !isRejected ? "bg-leaf-500" : "bg-slate-200 dark:bg-white/10"
                  }`}
                />
              )}

              <div
                className={`z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-all shadow-sm ${
                  stepFailed
                    ? "border-rose-500 bg-rose-50 text-rose-600 dark:bg-rose-950/40"
                    : isCurrent
                    ? "border-leaf-600 bg-leaf-600 text-white ring-4 ring-leaf-100 dark:ring-leaf-900/50"
                    : isDone
                    ? "border-leaf-600 bg-leaf-50 text-leaf-700 dark:bg-leaf-950/30"
                    : "border-slate-300 bg-white text-slate-400 dark:border-white/15 dark:bg-white/5"
                }`}
              >
                {stepFailed ? (
                  <XCircle className="h-5 w-5 text-rose-500" />
                ) : isDone ? (
                  <CheckCircle2 className="h-5 w-5 text-leaf-600" />
                ) : (
                  <Clock className="h-4 w-4" />
                )}
              </div>

              <p className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                {humanStatus(step)}
              </p>
            </div>
          );
        })}
      </div>

      {history && history.length > 0 && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Transition History</h4>
          <div className="space-y-2">
            {history.map((h, idx) => (
              <div key={idx} className="flex flex-wrap items-center justify-between text-xs text-slate-600 dark:text-slate-300 border-b border-slate-200/50 dark:border-white/5 pb-1 last:border-0">
                <span>
                  <strong>{humanStatus(h.previousStatus || "START")}</strong> → <strong>{humanStatus(h.newStatus)}</strong> {h.reason ? `(${h.reason})` : ""}
                </span>
                <span className="text-slate-400">{new Date(h.createdAt || Date.now()).toLocaleDateString("en-IN")}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
