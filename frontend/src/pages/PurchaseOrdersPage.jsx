import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, ShoppingBag, CheckCircle2, Layers, ShieldCheck, ArrowRight } from "lucide-react";
import { useAppStore } from "../store/useAppStore.js";
import { PageHeader } from "../components/PageHeader.jsx";
import { DataTable } from "../components/DataTable.jsx";
import { Modal } from "../components/Modal.jsx";
import { StatusBadge } from "../components/StatusBadge.jsx";
import { purchaseOrders as demoPOs, lots as demoLots, produceImages } from "../data/demoData.js";
import { createResource, allocatePoApi } from "../services/api.js";

export function PurchaseOrdersPage() {
  const { showToast, user } = useAppStore();
  const [orders, setOrders] = useState(demoPOs);
  const [lots, setLots] = useState(demoLots);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [allocatingPO, setAllocatingPO] = useState(null);
  const [selectedClearedLot, setSelectedClearedLot] = useState(null);

  // FILTER: Only show 100% Cleared / Verified lots to Buyers!
  const clearedProducts = lots.filter((l) =>
    ["ACCEPTED", "STORED", "ALLOCATED"].includes(l.status) && l.grade !== "Rejected"
  );

  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      buyerName: user?.name || "FreshKart Wholesale",
      produceCategory: "Tomato",
      requiredQuantity: 1000,
      unitPrice: 28,
      targetGrade: "Grade A",
      deliveryLocation: "Mumbai APMC Market"
    }
  });

  function handleOrderFromClearedProduct(product) {
    setValue("produceCategory", product.produce);
    setValue("targetGrade", product.grade || "Grade A");
    setValue("requiredQuantity", product.acceptedQuantity || product.quantity);
    setValue("unitPrice", product.expectedPrice || 30);
    setSelectedClearedLot(product);
    setCreateModalOpen(true);
  }

  async function handleCreatePO(data) {
    const poNum = `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPO = {
      _id: `po-${Date.now()}`,
      poNumber: poNum,
      buyer: data.buyerName || user?.name || "FreshKart Wholesale",
      required: Number(data.requiredQuantity),
      allocated: selectedClearedLot ? Number(data.requiredQuantity) : 0,
      unitPrice: Number(data.unitPrice),
      totalValue: Number(data.requiredQuantity) * Number(data.unitPrice),
      status: selectedClearedLot ? "FULLY_ALLOCATED" : "SUBMITTED",
      due: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0]
    };

    try {
      await createResource("purchase-orders", newPO);
    } catch (e) {}

    setOrders([newPO, ...orders]);
    showToast(`Submitted Purchase Order ${poNum}`, "SUCCESS");
    setCreateModalOpen(false);
    setSelectedClearedLot(null);
    reset();
  }

  async function handleAllocate(lotId, qty) {
    if (!allocatingPO) return;
    try {
      await allocatePoApi(allocatingPO._id || allocatingPO.id, lotId, null, qty);
    } catch (e) {}

    setOrders(
      orders.map((o) => {
        if (o.poNumber === allocatingPO.poNumber) {
          const newAllocated = Math.min(o.required, o.allocated + Number(qty));
          return {
            ...o,
            allocated: newAllocated,
            status: newAllocated >= o.required ? "FULLY_ALLOCATED" : "PARTIALLY_ALLOCATED"
          };
        }
        return o;
      })
    );

    showToast(`Allocated ${qty} Kg to ${allocatingPO.poNumber}`, "SUCCESS");
    setAllocatingPO(null);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Buyer Marketplace & Purchase Orders"
        subtitle="Browse verified produce cleared by Intake, Quality Inspection, and Warehouse departments. View high-res crop images, quality grades, and initiate instant purchase orders."
        action={
          <button
            onClick={() => {
              setSelectedClearedLot(null);
              setCreateModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-leaf-600 px-5 py-3 text-xs font-black text-white hover:bg-leaf-700 shadow-md"
          >
            <Plus className="h-4 w-4" /> Create Custom Purchase Order
          </button>
        }
      />

      {/* CLEARED PRODUCTS BUYER MARKETPLACE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Cleared & Verified Products Marketplace</h3>
            <span className="rounded-full bg-leaf-100 border border-leaf-300 px-3 py-1 text-xs font-black text-leaf-900 dark:bg-leaf-950 dark:border-leaf-700 dark:text-leaf-200">
              100% Quality Inspected
            </span>
          </div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            {clearedProducts.length} Verified Products Available
          </span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {clearedProducts.map((item) => (
            <div
              key={item._id || item.lotNumber}
              className="overflow-hidden rounded-3xl border border-slate-300 bg-white shadow-soft transition-all hover:border-leaf-500 hover:shadow-xl dark:border-white/15 dark:bg-[#122419]"
            >
              <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-white/5">
                <img
                  src={item.imageUrl || produceImages[item.produce] || produceImages.Tomato}
                  alt={item.produce}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-3 left-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-black text-white shadow-md">
                  ✓ {item.grade || "Grade A"} Cleared
                </div>
                <div className="absolute bottom-3 right-3 rounded-2xl bg-slate-900/80 px-3.5 py-1.5 text-xs font-black text-white backdrop-blur-md">
                  ₹{item.expectedPrice || 28} / {item.unit}
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-black text-slate-900 dark:text-white">{item.produce}</h4>
                  <StatusBadge status={item.status} />
                </div>

                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {item.lotNumber} · Farmer: {item.farmer?.name || item.farmer}
                </p>

                <div className="rounded-2xl bg-slate-50 p-3 text-xs font-bold text-slate-700 dark:bg-white/5 dark:text-slate-200 space-y-1">
                  <div className="flex justify-between">
                    <span>Accepted Available:</span>
                    <span className="font-black text-slate-900 dark:text-white">{item.acceptedQuantity || item.quantity} {item.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Warehouse Storage:</span>
                    <span>{item.warehouse || "Ahmednagar Central"}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleOrderFromClearedProduct(item)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-leaf-600 py-3 text-xs font-black text-white shadow-md transition-all hover:bg-leaf-700"
                >
                  <ShoppingBag className="h-4 w-4" /> Procure Cleared Stock
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PURCHASE ORDERS TABLE */}
      <DataTable
        title="Active Purchase Orders List"
        rows={orders}
        columns={["poNumber", "buyer", "required", "allocated", "status"]}
        actions={(row) => (
          <button
            onClick={() => setAllocatingPO(row)}
            className="rounded-lg border border-leaf-300 bg-leaf-50 px-3 py-1.5 text-xs font-black text-leaf-900 hover:bg-leaf-100 dark:border-leaf-700 dark:bg-leaf-950 dark:text-leaf-200"
          >
            Allocate Stock
          </button>
        )}
      />

      {/* Create Purchase Order Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title={selectedClearedLot ? `Procure ${selectedClearedLot.produce} (${selectedClearedLot.lotNumber})` : "Create Purchase Order"}
        subtitle="Submit buyer procurement order for cleared produce"
      >
        <form onSubmit={handleSubmit(handleCreatePO)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-900 dark:text-slate-100 mb-1.5">
              Buyer Organization / Name
            </label>
            <input {...register("buyerName")} className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-900 dark:border-white/20 dark:bg-white/10 dark:text-white" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-900 dark:text-slate-100 mb-1.5">
                Produce Category
              </label>
              <input {...register("produceCategory")} readOnly={!!selectedClearedLot} className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-900 dark:border-white/20 dark:bg-white/10 dark:text-white" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-900 dark:text-slate-100 mb-1.5">
                Target Quality Grade
              </label>
              <input {...register("targetGrade")} readOnly={!!selectedClearedLot} className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-900 dark:border-white/20 dark:bg-white/10 dark:text-white" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-900 dark:text-slate-100 mb-1.5">
                Required Quantity (Kg)
              </label>
              <input {...register("requiredQuantity", { required: true })} type="number" className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-900 dark:border-white/20 dark:bg-white/10 dark:text-white" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-900 dark:text-slate-100 mb-1.5">
                Agreed Unit Price (₹ / Kg)
              </label>
              <input {...register("unitPrice", { required: true })} type="number" className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-900 dark:border-white/20 dark:bg-white/10 dark:text-white" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-900 dark:text-slate-100 mb-1.5">
              Delivery Destination
            </label>
            <input {...register("deliveryLocation")} className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-900 dark:border-white/20 dark:bg-white/10 dark:text-white" />
          </div>

          <button type="submit" className="w-full rounded-xl bg-leaf-600 py-3.5 text-xs font-black text-white hover:bg-leaf-700 shadow-md">
            Confirm & Create Purchase Order
          </button>
        </form>
      </Modal>

      {/* Allocate Stock Modal */}
      {allocatingPO && (
        <Modal
          isOpen={!!allocatingPO}
          onClose={() => setAllocatingPO(null)}
          title={`Allocate Stock to ${allocatingPO.poNumber}`}
          subtitle={`Required: ${allocatingPO.required} Kg · Currently Allocated: ${allocatingPO.allocated} Kg`}
        >
          <div className="space-y-4">
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Available Cleared Lots for Allocation:</p>
            {clearedProducts.map((lot) => (
              <div key={lot.lotNumber} className="flex items-center justify-between rounded-xl border border-slate-300 p-4 dark:border-white/15">
                <div>
                  <p className="text-xs font-black text-slate-900 dark:text-white">{lot.lotNumber} · {lot.produce}</p>
                  <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Available: {lot.acceptedQuantity || lot.quantity} {lot.unit} · Grade: {lot.grade}</p>
                </div>
                <button
                  onClick={() => handleAllocate(lot._id || lot.id, Math.min(lot.quantity, allocatingPO.required - allocatingPO.allocated))}
                  className="rounded-lg bg-leaf-600 px-3 py-1.5 text-xs font-black text-white hover:bg-leaf-700"
                >
                  Allocate Qty
                </button>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
