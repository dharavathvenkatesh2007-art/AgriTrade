import React, { useState } from "react";
import { Settings, Building2, MapPin, Layers, Award, Plus } from "lucide-react";
import { PageHeader } from "../components/PageHeader.jsx";
import { DataTable } from "../components/DataTable.jsx";
import { Modal } from "../components/Modal.jsx";
import { useAppStore } from "../store/useAppStore.js";

const orgs = [
  { name: "AgriTrade Platform", type: "PLATFORM", email: "ops@agritrade.com", status: "ACTIVE" },
  { name: "Deccan Collection Network", type: "COLLECTION_CENTER", email: "center@agritrade.com", status: "ACTIVE" },
  { name: "FreshKart Wholesale", type: "BUYER", email: "buyer@agritrade.com", status: "ACTIVE" },
  { name: "GreenLine Logistics", type: "LOGISTICS", email: "logistics@agritrade.com", status: "ACTIVE" }
];

const regions = [
  { name: "North Maharashtra", code: "MH-N", state: "Maharashtra", status: "ACTIVE" },
  { name: "Western Maharashtra", code: "MH-W", state: "Maharashtra", status: "ACTIVE" },
  { name: "North Karnataka", code: "KA-N", state: "Karnataka", status: "ACTIVE" }
];

const categories = [
  { name: "Tomato", defaultUnit: "Kg", shelfLifeDays: 12, status: "ACTIVE" },
  { name: "Onion", defaultUnit: "Kg", shelfLifeDays: 45, status: "ACTIVE" },
  { name: "Chilli", defaultUnit: "Kg", shelfLifeDays: 14, status: "ACTIVE" },
  { name: "Wheat", defaultUnit: "Quintal", shelfLifeDays: 180, status: "ACTIVE" },
  { name: "Turmeric", defaultUnit: "Kg", shelfLifeDays: 120, status: "ACTIVE" }
];

export function AdminSettingsPage() {
  const { showToast } = useAppStore();
  const [activeTab, setActiveTab] = useState("categories");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings & Master Data Management"
        subtitle="Manage platform organizations, geographical regions, produce categories, quality grading parameters, and system configuration."
      />

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
        {[
          ["categories", "Produce Categories", Layers],
          ["orgs", "Organizations", Building2],
          ["regions", "Regions & Scopes", MapPin]
        ].map(([key, label, Icon]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === key
                ? "bg-leaf-600 text-white shadow-soft"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      {activeTab === "categories" && (
        <DataTable
          title="Produce Categories & Shelf Life Rules"
          rows={categories}
          columns={["name", "defaultUnit", "shelfLifeDays", "status"]}
        />
      )}

      {activeTab === "orgs" && (
        <DataTable
          title="Platform Organizations"
          rows={orgs}
          columns={["name", "type", "email", "status"]}
        />
      )}

      {activeTab === "regions" && (
        <DataTable
          title="Regional Operating Scopes"
          rows={regions}
          columns={["name", "code", "state", "status"]}
        />
      )}
    </div>
  );
}
