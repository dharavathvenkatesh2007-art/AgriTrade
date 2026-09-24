import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export function Toast({ toast, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === "SUCCESS";
  const isError = toast.type === "ERROR";

  return (
    <div className="fixed right-5 top-5 z-50 flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xl backdrop-blur transition-all dark:border-white/10 dark:bg-[#14281d] sm:max-w-md">
      {isSuccess ? (
        <CheckCircle2 className="h-5 w-5 shrink-0 text-leaf-600" />
      ) : isError ? (
        <AlertCircle className="h-5 w-5 shrink-0 text-rose-500" />
      ) : (
        <Info className="h-5 w-5 shrink-0 text-sky-500" />
      )}

      <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{toast.message}</p>

      <button
        onClick={onClose}
        className="ml-auto rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
