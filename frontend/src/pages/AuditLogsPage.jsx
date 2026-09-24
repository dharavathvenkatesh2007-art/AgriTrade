import React from "react";
import { Settings, ShieldCheck } from "lucide-react";
import { PageHeader } from "../components/PageHeader.jsx";
import { DataTable } from "../components/DataTable.jsx";

const auditLogsData = [
  { action: "CREATE_LOT", module: "Produce Lots", user: "Anita Reddy", role: "FARMER", entity: "LOT-2026-00021", status: "CREATED", timestamp: "2026-09-24 10:15:00" },
  { action: "RECEIVE_LOT", module: "Collection Center", user: "Collection Manager", role: "COLLECTION_MANAGER", entity: "LOT-2026-00021", status: "RECEIVED", timestamp: "2026-09-24 10:45:00" },
  { action: "INSPECT_LOT", module: "Quality Inspection", user: "Quality Inspector", role: "INSPECTOR", entity: "LOT-2026-00021", status: "ACCEPTED", timestamp: "2026-09-24 11:00:00" },
  { action: "ALLOCATE_PO", module: "Purchase Orders", user: "Buyer Manager", role: "BUYER", entity: "PO-2026-0001", status: "ALLOCATED", timestamp: "2026-09-24 11:20:00" },
  { action: "DISPATCH_SHIPMENT", module: "Logistics", user: "Logistics Coordinator", role: "LOGISTICS", entity: "SHP-2026-0001", status: "DISPATCHED", timestamp: "2026-09-24 11:40:00" }
];

export function AuditLogsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs & Compliance Trail"
        subtitle="Every state transition, user action, quality grading approval, purchase allocation, and financial payout records user ID, role, module, entity, and timestamp."
      />

      <DataTable
        title="System Audit Trail"
        rows={auditLogsData}
        columns={["action", "module", "user", "role", "entity", "status"]}
      />
    </div>
  );
}
