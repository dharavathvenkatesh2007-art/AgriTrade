import React from "react";
import { Link } from "react-router-dom";
import {
  Sprout,
  PackageCheck,
  ClipboardCheck,
  Boxes,
  Truck,
  WalletCards,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  UserCheck,
  Sparkles
} from "lucide-react";
import { workflow } from "../data/demoData.js";
import { humanStatus } from "../utils/status.js";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f7faf4] text-slate-900 dark:bg-[#0c1811] dark:text-slate-100">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden bg-cover bg-center text-white"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(12,35,22,0.85) 0%, rgba(12,35,22,0.95) 100%), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=85')"
        }}
      >
        <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Link to="/" className="flex items-center gap-2 text-2xl font-black tracking-tight">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf-500 text-white shadow-soft">
              <Sprout className="h-6 w-6" />
            </div>
            <span>AgriTrade</span>
          </Link>
          <div className="flex items-center gap-4">
            <a href="#features" className="hidden text-sm font-bold text-white/90 hover:text-white sm:block">
              Features
            </a>
            <a href="#workflow" className="hidden text-sm font-bold text-white/90 hover:text-white sm:block">
              Workflow
            </a>
            <Link
              to="/login"
              className="rounded-xl bg-leaf-500 px-5 py-2.5 text-xs font-black tracking-wide text-white shadow-soft hover:bg-leaf-600"
            >
              Sign In / Demo
            </Link>
          </div>
        </header>

        <div className="mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-center px-6 py-16">
          <div className="inline-flex max-w-fit items-center gap-2 rounded-full border border-leaf-400/40 bg-leaf-950/60 px-4 py-2 text-xs font-extrabold text-leaf-300 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-harvest-500" /> Complete MERN Farm Produce Supply Chain Platform
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-6xl md:text-7xl">
            From Farm to Market, <span className="text-leaf-400">Simplified.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            AgriTrade connects farmers, collection centers, quality inspectors, buyers, logistics teams, warehouses, and administrators in one secure digital operating system with live traceability and automated settlement calculations.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-2xl bg-leaf-500 px-7 py-4 text-sm font-black text-white shadow-2xl transition-all hover:bg-leaf-600 hover:-translate-y-0.5"
            >
              Open Interactive Platform <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#roles"
              className="rounded-2xl border border-white/25 bg-white/10 px-7 py-4 text-sm font-black text-white backdrop-blur-md hover:bg-white/20"
            >
              Explore Role Portals
            </a>
          </div>

          <div className="mt-14 grid max-w-4xl grid-cols-2 gap-4 border-t border-white/15 pt-8 sm:grid-cols-4">
            <div>
              <p className="text-2xl font-black text-leaf-400">20+ Seeded</p>
              <p className="text-xs font-bold text-white/70">Farmers & Crop Profiles</p>
            </div>
            <div>
              <p className="text-2xl font-black text-leaf-400">100% Traceable</p>
              <p className="text-xs font-bold text-white/70">Lot State Transition History</p>
            </div>
            <div>
              <p className="text-2xl font-black text-leaf-400">Automated</p>
              <p className="text-xs font-bold text-white/70">Quality-Based Settlements</p>
            </div>
            <div>
              <p className="text-2xl font-black text-leaf-400">₹ INR</p>
              <p className="text-xs font-bold text-white/70">Multi-Line Purchase Orders</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Built For Modern Agri Procurement</h2>
          <p className="mt-3 text-sm font-semibold text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Replace manual logbooks with secure RBAC workflows, region scoping, quality inspections, and real-time inventory visibility.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Digital Lot Intake", PackageCheck, "Receive produce lots with farmer details, gross & net weight capture, storage assignment, and QR reference generation."],
            ["Structured Quality Inspection", ClipboardCheck, "Record moisture %, foreign matter %, damaged quantity, pest indicators, appearance score, grade (Grade A/B/C/Rejected), and remarks."],
            ["Warehouse Inventory", Boxes, "Track lot-level inventory with available, reserved, dispatched, and delivered quantities, shelf-life indicators, and movement history."],
            ["Purchase Order Fulfillment", Truck, "Buyers create orders with multi-line items. Allocate accepted warehouse inventory without exceeding target stock or PO limits."],
            ["Logistics & Fleet Tracking", Truck, "Schedule shipments, assign vehicles and drivers with capacity validations, track transit stages, and confirm delivery."],
            ["Automated Farmer Settlements", WalletCards, "Calculate final payable amounts: Accepted Qty × Base Price × Quality Adjustment − Deductions + Adjustments."]
          ].map(([title, Icon, desc]) => (
            <div
              key={title}
              className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-[#14281d]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-leaf-50 text-leaf-600 dark:bg-leaf-950/40 dark:text-leaf-300">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-black text-slate-900 dark:text-white">{title}</h3>
              <p className="mt-2 text-xs font-medium leading-relaxed text-slate-600 dark:text-slate-300">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="bg-white py-24 dark:bg-[#0f1f16]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Traceable End-to-End Workflow</h2>
            <p className="mt-3 text-sm font-semibold text-slate-600 dark:text-slate-400">
              Strict state-transition rules ensure produce lots cannot bypass required verification steps.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-9">
            {workflow.map((step, idx) => (
              <div
                key={step}
                className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-white/10 dark:bg-white/5"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-leaf-600 text-xs font-black text-white">
                  {idx + 1}
                </div>
                <p className="mt-3 text-xs font-extrabold text-slate-800 dark:text-slate-200">{humanStatus(step)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Section */}
      <section id="roles" className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Tailored Experiences For Every Role</h2>
          <p className="mt-3 text-sm font-semibold text-slate-600 dark:text-slate-400">
            Log in with pre-configured role profiles to test exact permissions and workflows.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            ["Farmer", "Simple mobile-first dashboard with large buttons, clear status cards, inspection updates, settlement details, and dispute creation."],
            ["Collection Manager & Inspector", "Receive produce, weigh lots, record moisture & quality metrics, assign storage locations, and approve/reject lots."],
            ["Buyer & Logistics Coordinator", "Browse accepted inventory, submit purchase orders, allocate lots, assign transport vehicles, and confirm deliveries."],
            ["Platform Administrator", "System oversight with user management, region scoping, grading rules, financial reports, disputes, and full audit logs."]
          ].map(([roleTitle, desc]) => (
            <div key={roleTitle} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-[#14281d]">
              <UserCheck className="h-8 w-8 text-leaf-600" />
              <h3 className="mt-4 text-lg font-black text-slate-900 dark:text-white">{roleTitle}</h3>
              <p className="mt-2 text-xs font-medium leading-relaxed text-slate-600 dark:text-slate-300">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-2xl bg-leaf-600 px-8 py-4 text-sm font-black text-white shadow-xl hover:bg-leaf-700"
          >
            Launch AgriTrade Demo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
