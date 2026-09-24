import React, { useState } from "react";
import { WalletCards, CheckCircle2, DollarSign, FileText } from "lucide-react";
import { useAppStore } from "../store/useAppStore.js";
import { PageHeader } from "../components/PageHeader.jsx";
import { DataTable } from "../components/DataTable.jsx";
import { Modal } from "../components/Modal.jsx";
import { StatusBadge } from "../components/StatusBadge.jsx";
import { settlements as demoSettlements } from "../data/demoData.js";
import { approveSettlementApi, paySettlementApi } from "../services/api.js";

export function SettlementsPage() {
  const { showToast, user } = useAppStore();
  const [settlements, setSettlements] = useState(demoSettlements);
  const [payingSettlement, setPayingSettlement] = useState(null);
  const [payRef, setPayRef] = useState("UPI-AGR-9088");

  async function handleApprove(settlement) {
    try {
      await approveSettlementApi(settlement._id || settlement.id);
    } catch (e) {}

    setSettlements(
      settlements.map((s) =>
        s.settlementNumber === settlement.settlementNumber ? { ...s, status: "APPROVED" } : s
      )
    );
    showToast(`Settlement ${settlement.settlementNumber} APPROVED`, "SUCCESS");
  }

  async function handlePaySubmit(e) {
    e.preventDefault();
    if (!payingSettlement) return;

    try {
      await paySettlementApi(payingSettlement._id || payingSettlement.id, payRef);
    } catch (e) {}

    setSettlements(
      settlements.map((s) =>
        s.settlementNumber === payingSettlement.settlementNumber
          ? { ...s, status: "PAID", paymentReference: payRef }
          : s
      )
    );

    showToast(`Payment recorded for ${payingSettlement.settlementNumber} (Ref: ${payRef})`, "SUCCESS");
    setPayingSettlement(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Farmer Settlement Calculations"
        subtitle="Transparent settlement formula: Accepted Quantity × Agreed Price × Quality Adjustment − Deductions + Adjustments = Net Payable Amount."
      />

      <div className="rounded-2xl border border-leaf-200 bg-leaf-50/70 p-5 dark:border-leaf-900/50 dark:bg-leaf-950/30">
        <h4 className="text-sm font-black text-leaf-900 dark:text-leaf-200">Settlement Formula Engine</h4>
        <p className="mt-1 text-xs font-semibold text-leaf-800 dark:text-leaf-300">
          Gross Amount = Accepted Quantity × Base Price × (1 + Quality Adjustment %)
        </p>
        <p className="text-xs font-semibold text-leaf-800 dark:text-leaf-300 mt-0.5">
          Net Payable Amount = Gross Amount − Deductions − Transport Charges + Adjustments
        </p>
      </div>

      <DataTable
        title="All Farmer Settlements"
        rows={settlements}
        columns={["settlementNumber", "farmer", "lot", "net", "status"]}
        actions={(row) => (
          <div className="flex items-center gap-2">
            {row.status === "CALCULATED" && (
              <button
                onClick={() => handleApprove(row)}
                className="rounded-lg bg-leaf-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-leaf-700"
              >
                Approve
              </button>
            )}
            {row.status === "APPROVED" && (
              <button
                onClick={() => setPayingSettlement(row)}
                className="rounded-lg bg-soil-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-soil-700"
              >
                Record Payment
              </button>
            )}
          </div>
        )}
      />

      {/* Payment Reference Modal */}
      {payingSettlement && (
        <Modal
          isOpen={!!payingSettlement}
          onClose={() => setPayingSettlement(null)}
          title={`Execute Payment: ${payingSettlement.settlementNumber}`}
          subtitle={`Farmer: ${payingSettlement.farmer} · Payable Net Amount: ₹${Number(payingSettlement.net).toLocaleString("en-IN")}`}
        >
          <form onSubmit={handlePaySubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1.5">
                Bank / UPI Payment Reference ID
              </label>
              <input
                value={payRef}
                onChange={(e) => setPayRef(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold dark:border-white/15 dark:bg-white/5 dark:text-white"
              />
            </div>

            <button type="submit" className="w-full rounded-xl bg-leaf-600 py-3.5 text-xs font-black text-white hover:bg-leaf-700">
              Confirm & Mark Paid
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
