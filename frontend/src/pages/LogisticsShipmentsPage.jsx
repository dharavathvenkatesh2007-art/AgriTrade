import React, { useState } from "react";
import { Truck, User, CheckCircle2, MapPin, Clock, ArrowRight } from "lucide-react";
import { useAppStore } from "../store/useAppStore.js";
import { PageHeader } from "../components/PageHeader.jsx";
import { DataTable } from "../components/DataTable.jsx";
import { Modal } from "../components/Modal.jsx";
import { StatusBadge } from "../components/StatusBadge.jsx";
import { shipments as demoShipments } from "../data/demoData.js";
import { dispatchShipmentApi, deliverShipmentApi } from "../services/api.js";

export function LogisticsShipmentsPage() {
  const { showToast } = useAppStore();
  const [shipments, setShipments] = useState(demoShipments);

  async function handleDispatch(shipment) {
    try {
      await dispatchShipmentApi(shipment._id || shipment.id, "Dispatched from warehouse");
    } catch (e) {}

    setShipments(
      shipments.map((s) =>
        s.shipmentNumber === shipment.shipmentNumber ? { ...s, status: "IN_TRANSIT" } : s
      )
    );
    showToast(`Shipment ${shipment.shipmentNumber} DISPATCHED into transit`, "SUCCESS");
  }

  async function handleDeliver(shipment) {
    try {
      await deliverShipmentApi(shipment._id || shipment.id, "Delivered and signed at APMC");
    } catch (e) {}

    setShipments(
      shipments.map((s) =>
        s.shipmentNumber === shipment.shipmentNumber ? { ...s, status: "DELIVERED" } : s
      )
    );
    showToast(`Shipment ${shipment.shipmentNumber} DELIVERED! Settlements calculated automatically.`, "SUCCESS");
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Logistics & Shipment Lifecycle"
        subtitle="Manage transport fleet, vehicle capacity rules, driver assignments, live transit updates, and automated delivery settlement triggers."
      />

      {/* Vehicles Fleet Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-[#14281d]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400">Refrigerated Truck</p>
              <h4 className="text-lg font-black text-slate-900 dark:text-white">MH-12-AG-2045</h4>
            </div>
            <span className="rounded-full bg-harvest-100 px-3 py-1 text-xs font-bold text-harvest-700">IN TRANSIT</span>
          </div>
          <p className="mt-3 text-xs text-slate-500">Capacity: 6,000 Kg · Driver: Rohit Kadam (+91 95555 11111)</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-[#14281d]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400">Open Heavy Truck</p>
              <h4 className="text-lg font-black text-slate-900 dark:text-white">MH-14-FR-9081</h4>
            </div>
            <span className="rounded-full bg-leaf-100 px-3 py-1 text-xs font-bold text-leaf-800">AVAILABLE</span>
          </div>
          <p className="mt-3 text-xs text-slate-500">Capacity: 9,000 Kg · Driver: Santosh Mane (+91 95555 22222)</p>
        </div>
      </div>

      <DataTable
        title="Active Transport Shipments"
        rows={shipments}
        columns={["shipmentNumber", "po", "vehicle", "destination", "status"]}
        actions={(row) => (
          <div className="flex items-center gap-2">
            {row.status === "PLANNED" && (
              <button
                onClick={() => handleDispatch(row)}
                className="rounded-lg bg-leaf-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-leaf-700"
              >
                Dispatch
              </button>
            )}
            {row.status === "IN_TRANSIT" && (
              <button
                onClick={() => handleDeliver(row)}
                className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-sky-700"
              >
                Confirm Delivery
              </button>
            )}
          </div>
        )}
      />
    </div>
  );
}
