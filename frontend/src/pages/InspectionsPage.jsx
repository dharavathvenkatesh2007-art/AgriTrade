import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ClipboardCheck, CheckCircle2, XCircle, Upload, AlertCircle } from "lucide-react";
import { useAppStore } from "../store/useAppStore.js";
import { PageHeader } from "../components/PageHeader.jsx";
import { DataTable } from "../components/DataTable.jsx";
import { Modal } from "../components/Modal.jsx";
import { StatusBadge } from "../components/StatusBadge.jsx";
import { lots as demoLots } from "../data/demoData.js";
import { recordInspectionApi, acceptLotApi, rejectLotApi } from "../services/api.js";

export function InspectionsPage() {
  const { showToast } = useAppStore();
  const [lots, setLots] = useState(demoLots);
  const [inspectingLot, setInspectingLot] = useState(null);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      moisturePercent: 8.5,
      foreignMatterPercent: 1.2,
      damagedQuantity: 12,
      pestIndicators: "None",
      appearanceScore: 9,
      grade: "Grade A",
      remarks: "Sample meets quality procurement guidelines."
    }
  });

  const pendingInspection = lots.filter((l) =>
    ["RECEIVED", "INSPECTION_PENDING", "INSPECTED"].includes(l.status)
  );

  async function onSubmitInspection(data) {
    if (!inspectingLot) return;
    try {
      await recordInspectionApi(inspectingLot._id || inspectingLot.id, data);
    } catch (e) {}

    const isRejected = data.grade === "Rejected";

    setLots(
      lots.map((l) => {
        if (l.lotNumber === inspectingLot.lotNumber) {
          return {
            ...l,
            status: isRejected ? "REJECTED" : "ACCEPTED",
            grade: data.grade,
            acceptedQuantity: isRejected ? 0 : Math.round(l.quantity * 0.96)
          };
        }
        return l;
      })
    );

    showToast(
      isRejected
        ? `Lot ${inspectingLot.lotNumber} REJECTED`
        : `Lot ${inspectingLot.lotNumber} ACCEPTED with Grade ${data.grade}`,
      isRejected ? "ERROR" : "SUCCESS"
    );

    setInspectingLot(null);
    reset();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quality Inspection Workbench"
        subtitle="Record moisture percentage, foreign matter, defect rates, appearance score, assign grades (Grade A, B, C, Rejected), and upload inspection evidence."
      />

      <DataTable
        title="Lots Awaiting Inspection"
        rows={pendingInspection}
        columns={["lotNumber", "produce", "farmer", "quantity", "status"]}
        actions={(row) => (
          <button
            onClick={() => setInspectingLot(row)}
            className="flex items-center gap-1.5 rounded-xl bg-leaf-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-leaf-700"
          >
            <ClipboardCheck className="h-4 w-4" /> Inspect Lot
          </button>
        )}
      />

      {/* Structured Inspection Modal Form */}
      {inspectingLot && (
        <Modal
          isOpen={!!inspectingLot}
          onClose={() => setInspectingLot(null)}
          title={`Quality Inspection: ${inspectingLot.lotNumber}`}
          subtitle={`Produce: ${inspectingLot.produce} · Submitted Qty: ${inspectingLot.quantity} ${inspectingLot.unit}`}
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSubmit(onSubmitInspection)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Moisture Percentage (%)
                </label>
                <input
                  {...register("moisturePercent", { required: true })}
                  type="number"
                  step="0.1"
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold dark:border-white/15 dark:bg-white/5 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Foreign Matter (%)
                </label>
                <input
                  {...register("foreignMatterPercent", { required: true })}
                  type="number"
                  step="0.1"
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold dark:border-white/15 dark:bg-white/5 dark:text-white"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Damaged Quantity ({inspectingLot.unit})
                </label>
                <input
                  {...register("damagedQuantity")}
                  type="number"
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold dark:border-white/15 dark:bg-white/5 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Appearance Score (1 to 10)
                </label>
                <input
                  {...register("appearanceScore")}
                  type="number"
                  min="1"
                  max="10"
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold dark:border-white/15 dark:bg-white/5 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Quality Grade
              </label>
              <select
                {...register("grade")}
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold dark:border-white/15 dark:bg-white/5 dark:text-white"
              >
                <option value="Grade A">Grade A (+8% Price Premium)</option>
                <option value="Grade B">Grade B (Standard Price)</option>
                <option value="Grade C">Grade C (-5% Price Deduction)</option>
                <option value="Rejected">Rejected (Unusable Lot)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Pest / Infection Indicators
              </label>
              <input
                {...register("pestIndicators")}
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold dark:border-white/15 dark:bg-white/5 dark:text-white"
                placeholder="e.g. Minor leaf spot, none, etc."
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Inspector Remarks
              </label>
              <textarea
                {...register("remarks")}
                rows="3"
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold dark:border-white/15 dark:bg-white/5 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-leaf-600 py-3.5 text-xs font-black text-white hover:bg-leaf-700 shadow-soft"
            >
              Submit Quality Inspection Results
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
