import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAppStore } from "./store/useAppStore.js";
import { Sidebar } from "./components/Sidebar.jsx";
import { Header } from "./components/Header.jsx";
import { Toast } from "./components/Toast.jsx";
import { LandingPage } from "./pages/LandingPage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { ProduceLotsPage } from "./pages/ProduceLotsPage.jsx";
import { InspectionsPage } from "./pages/InspectionsPage.jsx";
import { WarehouseInventoryPage } from "./pages/WarehouseInventoryPage.jsx";
import { PurchaseOrdersPage } from "./pages/PurchaseOrdersPage.jsx";
import { LogisticsShipmentsPage } from "./pages/LogisticsShipmentsPage.jsx";
import { SettlementsPage } from "./pages/SettlementsPage.jsx";
import { DisputesPage } from "./pages/DisputesPage.jsx";
import { FarmersPage } from "./pages/FarmersPage.jsx";
import { ReportsPage } from "./pages/ReportsPage.jsx";
import { NotificationsPage } from "./pages/NotificationsPage.jsx";
import { AuditLogsPage } from "./pages/AuditLogsPage.jsx";
import { AdminSettingsPage } from "./pages/AdminSettingsPage.jsx";

export default function App() {
  const { user, toast, clearToast } = useAppStore();

  return (
    <div className="min-h-screen bg-[#f4f8f3] text-slate-900">
      {toast && <Toast toast={toast} onClose={clearToast} />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/app/*" element={user ? <AppShell /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col min-w-0">
        <Header onOpenSidebar={() => setSidebarOpen(true)} />

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/farmers" element={<FarmersPage />} />
            <Route path="/lots" element={<ProduceLotsPage />} />
            <Route path="/inspections" element={<InspectionsPage />} />
            <Route path="/inventory" element={<WarehouseInventoryPage />} />
            <Route path="/orders" element={<PurchaseOrdersPage />} />
            <Route path="/shipments" element={<LogisticsShipmentsPage />} />
            <Route path="/settlements" element={<SettlementsPage />} />
            <Route path="/disputes" element={<DisputesPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/audit" element={<AuditLogsPage />} />
            <Route path="/settings" element={<AdminSettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
