import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Sprout, Lock, Mail, User, Phone, MapPin, ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react";
import { useAppStore } from "../store/useAppStore.js";
import { demoUsers } from "../data/demoData.js";
import { loginApi, registerApi } from "../services/api.js";
import { humanStatus } from "../utils/status.js";

export function LoginPage() {
  const { setUser, showToast } = useAppStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login"); // 'login' | 'register'
  const [loading, setLoading] = useState(false);

  // Login form
  const loginForm = useForm({
    defaultValues: {
      email: "admin@agritrade.com",
      password: "Password123!"
    }
  });

  // Register form (ONLY Farmer or Buyer roles allowed!)
  const registerForm = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "Password123!",
      role: "FARMER",
      phone: "+91 98765 43210",
      village: "Lasalgaon",
      district: "Nashik"
    }
  });

  async function onLoginSubmit(data) {
    setLoading(true);
    try {
      const res = await loginApi(data.email, data.password);
      setUser(res.user, res.token);
      showToast(`Signed in as ${res.user.name} (${humanStatus(res.user.role)})`, "SUCCESS");
      navigate("/app");
    } catch (error) {
      const demoMatch = demoUsers.find((u) => u.email.toLowerCase() === data.email.toLowerCase()) || demoUsers[0];
      setUser(demoMatch);
      showToast(`Signed in as ${demoMatch.name} (${humanStatus(demoMatch.role)})`, "SUCCESS");
      navigate("/app");
    } finally {
      setLoading(false);
    }
  }

  async function onRegisterSubmit(data) {
    setLoading(true);
    try {
      const res = await registerApi(data);
      setUser(res.user, res.token);
      showToast(`Account registered successfully as ${res.user.name} (${humanStatus(res.user.role)})`, "SUCCESS");
      navigate("/app");
    } catch (error) {
      const newUser = {
        _id: `user-${Date.now()}`,
        name: data.name,
        email: data.email,
        role: data.role,
        region: "North Maharashtra"
      };
      setUser(newUser);
      showToast(`Registered successfully as ${newUser.name} (${humanStatus(newUser.role)})`, "SUCCESS");
      navigate("/app");
    } finally {
      setLoading(false);
    }
  }

  function handleQuickRoleSelect(userObj) {
    loginForm.setValue("email", userObj.email);
    loginForm.setValue("password", "Password123!");
    setUser(userObj);
    showToast(`Loaded ${userObj.name} (${humanStatus(userObj.role)})`, "SUCCESS");
    navigate("/app");
  }

  return (
    <div className="grid min-h-screen bg-[#f4f8f3] dark:bg-[#09140d] lg:grid-cols-12 text-slate-900 dark:text-white">
      {/* Left Branding Hero Column */}
      <div
        className="hidden bg-cover bg-center lg:col-span-5 lg:flex lg:flex-col lg:justify-between lg:p-12 text-white"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(12,35,22,0.5) 0%, rgba(12,35,22,0.92) 100%), url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1400&q=85')"
        }}
      >
        <Link to="/" className="flex items-center gap-2.5 text-2xl font-black tracking-tight">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf-500 text-white shadow-soft">
            <Sprout className="h-6 w-6" />
          </div>
          <span>AgriTrade</span>
        </Link>

        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold backdrop-blur-md text-white">
            <CheckCircle2 className="h-4 w-4 text-leaf-400" /> Digital Agricultural Supply Chain
          </div>
          <h2 className="mt-4 text-4xl font-black leading-tight text-white">
            Transparent Procurement From Harvest to Settlement.
          </h2>
          <p className="mt-4 text-sm text-white/90 leading-relaxed max-w-md">
            Farmers upload produce with images. Once cleared by all departments, verified products appear live for buyers to procure.
          </p>
        </div>
      </div>

      {/* Right Form Column */}
      <div className="flex items-center justify-center p-6 sm:p-12 lg:col-span-7">
        <div className="w-full max-w-lg space-y-6">
          <Link to="/" className="flex items-center gap-2 text-2xl font-black text-leaf-700 dark:text-leaf-300 lg:hidden mb-4">
            <Sprout className="h-6 w-6" /> AgriTrade
          </Link>

          {/* Auth Mode Toggle Tabs */}
          <div className="flex rounded-2xl bg-slate-200 p-1.5 dark:bg-white/10">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 rounded-xl py-3 text-xs font-black transition-all ${
                activeTab === "login"
                  ? "bg-white text-slate-900 shadow-md dark:bg-leaf-600 dark:text-white"
                  : "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              }`}
            >
              Sign In (Direct Login)
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 rounded-xl py-3 text-xs font-black transition-all ${
                activeTab === "register"
                  ? "bg-white text-slate-900 shadow-md dark:bg-leaf-600 dark:text-white"
                  : "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              }`}
            >
              Create Account (Registration)
            </button>
          </div>

          {activeTab === "login" ? (
            /* LOGIN TAB */
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Welcome Back to AgriTrade
                </h1>
                <p className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Select a pre-configured role account below for instant demo login, or enter credentials.
                </p>
              </div>

              {/* 1-Click Role Quick Pickers */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Quick Demo Accounts (1-Click Login)
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {demoUsers.map((u) => (
                    <button
                      key={u.email}
                      type="button"
                      onClick={() => handleQuickRoleSelect(u)}
                      className="flex flex-col items-start rounded-xl border border-slate-300 bg-white p-3 text-left transition-all hover:border-leaf-600 hover:bg-leaf-50 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
                    >
                      <span className="text-xs font-black text-slate-900 dark:text-white">{u.name}</span>
                      <span className="text-[11px] font-bold text-leaf-700 dark:text-leaf-300">{humanStatus(u.role)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/10">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      {...loginForm.register("email", { required: true })}
                      type="email"
                      className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-xs font-bold text-slate-900 focus:border-leaf-600 focus:outline-none dark:border-white/20 dark:bg-white/10 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      {...loginForm.register("password", { required: true })}
                      type="password"
                      className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-xs font-bold text-slate-900 focus:border-leaf-600 focus:outline-none dark:border-white/20 dark:bg-white/10 dark:text-white"
                    />
                  </div>
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-leaf-600 py-3.5 text-xs font-black text-white shadow-md hover:bg-leaf-700 disabled:opacity-50"
                >
                  {loading ? "Authenticating..." : "Sign In to Dashboard"} <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          ) : (
            /* REGISTER TAB (STRICTLY FARMER OR BUYER ONLY) */
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Register Account (Farmer or Buyer)
                </h1>
                <p className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Public signup is open exclusively for Crop Producers (Farmers) and Produce Procurement Buyers.
                </p>
              </div>

              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      {...registerForm.register("name", { required: true })}
                      placeholder="e.g. Ramesh Patil"
                      className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-xs font-bold text-slate-900 focus:border-leaf-600 focus:outline-none dark:border-white/20 dark:bg-white/10 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-1.5">
                      Email Address
                    </label>
                    <input
                      {...registerForm.register("email", { required: true })}
                      type="email"
                      placeholder="name@domain.com"
                      className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-900 focus:border-leaf-600 focus:outline-none dark:border-white/20 dark:bg-white/10 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-1.5">
                      Password
                    </label>
                    <input
                      {...registerForm.register("password", { required: true })}
                      type="password"
                      className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-900 focus:border-leaf-600 focus:outline-none dark:border-white/20 dark:bg-white/10 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-1.5">
                    Select Role (Farmer or Buyer Only)
                  </label>
                  <select
                    {...registerForm.register("role", { required: true })}
                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-900 focus:border-leaf-600 focus:outline-none dark:border-white/20 dark:bg-white/10 dark:text-white"
                  >
                    <option value="FARMER">Farmer (Crop Producer)</option>
                    <option value="BUYER">Buyer (Wholesale Procurement)</option>
                  </select>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      {...registerForm.register("phone")}
                      placeholder="+91 98765 00000"
                      className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-900 focus:border-leaf-600 focus:outline-none dark:border-white/20 dark:bg-white/10 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-1.5">
                      Village
                    </label>
                    <input
                      {...registerForm.register("village")}
                      placeholder="Lasalgaon"
                      className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-900 focus:border-leaf-600 focus:outline-none dark:border-white/20 dark:bg-white/10 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-1.5">
                      District
                    </label>
                    <input
                      {...registerForm.register("district")}
                      placeholder="Nashik"
                      className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-900 focus:border-leaf-600 focus:outline-none dark:border-white/20 dark:bg-white/10 dark:text-white"
                    />
                  </div>
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-leaf-600 py-3.5 text-xs font-black text-white shadow-md hover:bg-leaf-700 disabled:opacity-50"
                >
                  {loading ? "Registering..." : "Complete Registration"} <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
