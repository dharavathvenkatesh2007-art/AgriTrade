import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Leaf, QrCode, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { useAppStore } from "../store/useAppStore.js";
import { PageHeader } from "../components/PageHeader.jsx";
import { DataTable } from "../components/DataTable.jsx";
import { Modal } from "../components/Modal.jsx";
import { StatusBadge } from "../components/StatusBadge.jsx";
import { LotTimeline } from "../components/LotTimeline.jsx";
import { lots as demoLots, produceImages } from "../data/demoData.js";
import { fetchResource, createResource, receiveLotApi } from "../services/api.js";

export function ProduceLotsPage() {
  const { showToast, user } = useAppStore();
  const [lots, setLots] = useState(demoLots);
  const [selectedLot, setSelectedLot] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const isFarmer = user?.role === "FARMER";

  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      produce: "Tomato",
      quantity: 500,
      unit: "Kg",
      expectedPrice: 28,
      imageUrl: produceImages.Tomato,
      farmerName: user?.name || "Demo Farmer",
      collectionCenter: "Deccan Collection Network"
    }
  });

  const selectedProduce = watch("produce");

  // Auto update image preview when category changes
  useEffect(() => {
    if (produceImages[selectedProduce]) {
      setValue("imageUrl", produceImages[selectedProduce]);
    }
  }, [selectedProduce, setValue]);

  useEffect(() => {
    fetchResource("lots")
      .then((res) => {
        if (res.data && res.data.length > 0) setLots(res.data);
      })
      .catch(() => {});
  }, []);

  async function handleCreateLot(data) {
    const newLotNumber = `LOT-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const img = data.imageUrl || produceImages[data.produce] || produceImages.Tomato;
    
    const newLot = {
      _id: `lot-${Date.now()}`,
      lotNumber: newLotNumber,
      produce: data.produce,
      farmer: data.farmerName || user?.name || "Demo Farmer",
      submittedQuantity: Number(data.quantity),
      quantity: Number(data.quantity),
      unit: data.unit,
      expectedPrice: Number(data.expectedPrice || 30),
      imageUrl: img,
      status: "CREATED",
      referenceCode: `QR-${newLotNumber}`,
      createdAt: new Date().toISOString()
    };

    try {
      await createResource("lots", newLot);
    } catch (e) {}

    setLots([newLot, ...lots]);
    showToast(`Added produce lot ${newLotNumber} with photo`, "SUCCESS");
    setCreateModalOpen(false);
    reset();
  }

  async function handleReceiveLot(lot) {
    try {
      await receiveLotApi(lot._id || lot.id, "Received at collection center");
    } catch (e) {}

    setLots(
      lots.map((l) =>
        (l._id === lot._id || l.lotNumber === lot.lotNumber) ? { ...l, status: "RECEIVED" } : l
      )
    );
    showToast(`Lot ${lot.lotNumber} marked as RECEIVED`, "SUCCESS");
    setSelectedLot(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isFarmer ? "My Produce Lots (+Add Crop Lot)" : "Produce Lot Procurement Directory"}
        subtitle="Farmers add crop lots with photos and expected price. All departments (Intake, Quality Inspection, Warehouse) clear the lot before it appears for buyers."
        action={
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-leaf-600 px-5 py-3 text-xs font-black text-white shadow-md hover:bg-leaf-700"
          >
            <Plus className="h-4 w-4" /> Add Produce Lot with Image
          </button>
        }
      />

      {/* Grid of Produce Cards with Images */}
      <div className="space-y-3">
        <h3 className="text-base font-black text-slate-900 dark:text-white">Recent Submitted Produce Lots</h3>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {lots.map((lot) => (
            <div
              key={lot._id || lot.lotNumber}
              onClick={() => setSelectedLot(lot)}
              className="group cursor-pointer overflow-hidden rounded-3xl border border-slate-300 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-white/15 dark:bg-[#122419]"
            >
              <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-white/5">
                <img
                  src={lot.imageUrl || produceImages[lot.produce] || produceImages.Tomato}
                  alt={lot.produce}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3">
                  <StatusBadge status={lot.status} />
                </div>
                {lot.grade && lot.grade !== "Pending Inspection" && (
                  <div className="absolute bottom-3 left-3 rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-black text-white backdrop-blur-md">
                    {lot.grade}
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-black text-slate-900 dark:text-white">{lot.produce}</h4>
                  <span className="text-sm font-black text-leaf-700 dark:text-leaf-300">
                    ₹{lot.expectedPrice || lot.value || 30} / {lot.unit}
                  </span>
                </div>
                <p className="mt-1 text-xs font-extrabold text-slate-600 dark:text-slate-300">
                  {lot.lotNumber} · Farmer: {lot.farmer?.name || lot.farmer}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Quantity: {lot.quantity} {lot.unit}</span>
                  <span className="text-leaf-700 dark:text-leaf-400">View Status →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <DataTable
        title="All Lots Table View"
        rows={lots}
        columns={["lotNumber", "produce", "farmer", "quantity", "unit", "status"]}
        onRowClick={(row) => setSelectedLot(row)}
      />

      {/* Lot Details Modal */}
      {selectedLot && (
        <Modal
          isOpen={!!selectedLot}
          onClose={() => setSelectedLot(null)}
          title={`${selectedLot.lotNumber} - ${selectedLot.produce}`}
          subtitle={`Farmer: ${selectedLot.farmer?.name || selectedLot.farmer} · Location: ${selectedLot.center || "Lasalgaon Center"}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-12 items-center">
              <div className="sm:col-span-5 h-48 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10">
                <img
                  src={selectedLot.imageUrl || produceImages[selectedLot.produce] || produceImages.Tomato}
                  alt={selectedLot.produce}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="sm:col-span-7 space-y-3">
                <div className="flex items-center justify-between">
                  <StatusBadge status={selectedLot.status} />
                  <span className="text-base font-black text-leaf-700 dark:text-leaf-300">
                    Price: ₹{selectedLot.expectedPrice || 30} / {selectedLot.unit}
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5 space-y-1">
                  <p className="text-xs font-bold text-slate-500">QR Code Reference</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{selectedLot.referenceCode || `QR-${selectedLot.lotNumber}`}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-slate-200 p-3 dark:border-white/10">
                    <p className="text-slate-500 font-bold">Submitted Qty</p>
                    <p className="text-base font-black text-slate-900 dark:text-white">{selectedLot.quantity} {selectedLot.unit}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3 dark:border-white/10">
                    <p className="text-slate-500 font-bold">Assigned Grade</p>
                    <p className="text-base font-black text-leaf-600 dark:text-leaf-400">{selectedLot.grade || "Awaiting Inspection"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">Department Clearance Lifecycle</h4>
              <LotTimeline currentStatus={selectedLot.status} history={selectedLot.statusHistory} />
            </div>

            {selectedLot.status === "CREATED" && (
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => handleReceiveLot(selectedLot)}
                  className="rounded-xl bg-leaf-600 px-5 py-2.5 text-xs font-black text-white hover:bg-leaf-700"
                >
                  Receive Lot at Collection Center
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Add Produce Lot Modal with Image Picker */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Add Crop Produce Lot with Image"
        subtitle="Submit your harvest for collection intake and quality inspection clearance"
      >
        <form onSubmit={handleSubmit(handleCreateLot)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-900 dark:text-slate-100 mb-1.5">
              Produce Category
            </label>
            <select {...register("produce")} className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-900 focus:border-leaf-600 dark:border-white/20 dark:bg-white/10 dark:text-white">
              <option value="Tomato">Tomato</option>
              <option value="Onion">Onion</option>
              <option value="Chilli">Chilli</option>
              <option value="Wheat">Wheat</option>
              <option value="Turmeric">Turmeric</option>
              <option value="Rice">Rice</option>
              <option value="Cotton">Cotton</option>
              <option value="Maize">Maize</option>
              <option value="Groundnut">Groundnut</option>
              <option value="Pulses">Pulses</option>
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-900 dark:text-slate-100 mb-1.5">
                Quantity
              </label>
              <input {...register("quantity", { required: true })} type="number" className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-900 focus:border-leaf-600 dark:border-white/20 dark:bg-white/10 dark:text-white" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-900 dark:text-slate-100 mb-1.5">
                Unit
              </label>
              <select {...register("unit")} className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-900 focus:border-leaf-600 dark:border-white/20 dark:bg-white/10 dark:text-white">
                <option value="Kg">Kg</option>
                <option value="Quintal">Quintal</option>
                <option value="Ton">Ton</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-900 dark:text-slate-100 mb-1.5">
                Price (₹ / Unit)
              </label>
              <input {...register("expectedPrice", { required: true })} type="number" className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-900 focus:border-leaf-600 dark:border-white/20 dark:bg-white/10 dark:text-white" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-900 dark:text-slate-100 mb-1.5">
              Product Image URL
            </label>
            <input
              {...register("imageUrl")}
              placeholder="Paste image URL or use auto produce image"
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-900 focus:border-leaf-600 dark:border-white/20 dark:bg-white/10 dark:text-white"
            />
          </div>

          {/* Image Preview Box */}
          {watch("imageUrl") && (
            <div className="rounded-2xl border border-slate-200 p-2 dark:border-white/10">
              <p className="text-[11px] font-bold text-slate-500 mb-1">Photo Preview:</p>
              <img src={watch("imageUrl")} alt="Preview" className="h-36 w-full object-cover rounded-xl" />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-slate-900 dark:text-slate-100 mb-1.5">
              Farmer Name
            </label>
            <input {...register("farmerName")} className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-900 focus:border-leaf-600 dark:border-white/20 dark:bg-white/10 dark:text-white" />
          </div>

          <button type="submit" className="w-full rounded-xl bg-leaf-600 py-3.5 text-xs font-black text-white hover:bg-leaf-700 shadow-md">
            Submit Crop Produce Lot with Image
          </button>
        </form>
      </Modal>
    </div>
  );
}
