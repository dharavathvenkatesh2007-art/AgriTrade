import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ShieldCheck, Plus, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAppStore } from "../store/useAppStore.js";
import { PageHeader } from "../components/PageHeader.jsx";
import { DataTable } from "../components/DataTable.jsx";
import { Modal } from "../components/Modal.jsx";
import { StatusBadge } from "../components/StatusBadge.jsx";
import { disputes as demoDisputes } from "../data/demoData.js";
import { createResource } from "../services/api.js";

export function DisputesPage() {
  const { showToast, user } = useAppStore();
  const [disputesList, setDisputesList] = useState(demoDisputes);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [resolvingDispute, setResolvingDispute] = useState(null);
  const [resolutionText, setResolutionText] = useState("Issue investigated and resolved with agreed settlement adjustment.");

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      category: "QUALITY",
      priority: "MEDIUM",
      description: "Requesting review of moisture test result at collection center."
    }
  });

  async function handleRaiseDispute(data) {
    const num = `DSP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newDispute = {
      _id: `dsp-${Date.now()}`,
      disputeNumber: num,
      raisedBy: user?.name || "Demo Farmer",
      category: data.category,
      priority: data.priority,
      description: data.description,
      status: "OPEN",
      createdAt: new Date().toISOString()
    };

    try {
      await createResource("disputes", newDispute);
    } catch (e) {}

    setDisputesList([newDispute, ...disputesList]);
    showToast(`Raised Dispute ${num}`, "SUCCESS");
    setCreateModalOpen(false);
    reset();
  }

  function handleResolveSubmit(e) {
    e.preventDefault();
    if (!resolvingDispute) return;

    setDisputesList(
      disputesList.map((d) =>
        d.disputeNumber === resolvingDispute.disputeNumber
          ? { ...d, status: "RESOLVED", resolution: resolutionText }
          : d
      )
    );

    showToast(`Dispute ${resolvingDispute.disputeNumber} RESOLVED`, "SUCCESS");
    setResolvingDispute(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dispute Management"
        subtitle="Submit and track disputes regarding quality inspection grades, weight differences, pricing, delivery slots, or farmer payments."
        action={
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-xs font-black text-white hover:bg-rose-700 shadow-soft"
          >
            <Plus className="h-4 w-4" /> Raise Dispute
          </button>
        }
      />

      <DataTable
        title="All System Disputes"
        rows={disputesList}
        columns={["disputeNumber", "raisedBy", "category", "priority", "status"]}
        actions={(row) => (
          <div className="flex items-center gap-2">
            {row.status !== "RESOLVED" && user?.role === "ADMIN" && (
              <button
                onClick={() => setResolvingDispute(row)}
                className="rounded-lg bg-leaf-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-leaf-700"
              >
                Resolve
              </button>
            )}
          </div>
        )}
      />

      {/* Raise Dispute Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Raise Supply Chain Dispute"
        subtitle="Submit formal grievance for admin review"
      >
        <form onSubmit={handleSubmit(handleRaiseDispute)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1.5">
                Category
              </label>
              <select {...register("category")} className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold dark:border-white/15 dark:bg-white/5 dark:text-white">
                <option value="QUALITY">Quality Inspection</option>
                <option value="QUANTITY">Quantity / Weight Discrepancy</option>
                <option value="PAYMENT">Payment / Settlement Delay</option>
                <option value="DELIVERY">Delivery Exception</option>
                <option value="PRICING">Pricing Rate</option>
                <option value="REJECTION">Lot Rejection Appeal</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1.5">
                Priority
              </label>
              <select {...register("priority")} className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold dark:border-white/15 dark:bg-white/5 dark:text-white">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1.5">
              Description & Evidence Details
            </label>
            <textarea
              {...register("description", { required: true })}
              rows="4"
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold dark:border-white/15 dark:bg-white/5 dark:text-white"
            />
          </div>

          <button type="submit" className="w-full rounded-xl bg-rose-600 py-3.5 text-xs font-black text-white hover:bg-rose-700">
            Submit Dispute
          </button>
        </form>
      </Modal>

      {/* Resolve Dispute Modal */}
      {resolvingDispute && (
        <Modal
          isOpen={!!resolvingDispute}
          onClose={() => setResolvingDispute(null)}
          title={`Resolve Dispute: ${resolvingDispute.disputeNumber}`}
          subtitle={`Raised by: ${resolvingDispute.raisedBy} · Category: ${resolvingDispute.category}`}
        >
          <form onSubmit={handleResolveSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1.5">
                Admin Resolution Summary
              </label>
              <textarea
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
                rows="4"
                required
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold dark:border-white/15 dark:bg-white/5 dark:text-white"
              />
            </div>

            <button type="submit" className="w-full rounded-xl bg-leaf-600 py-3.5 text-xs font-black text-white hover:bg-leaf-700">
              Confirm Resolution
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
