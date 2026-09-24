import { create } from "zustand";
import { demoUsers } from "../data/demoData.js";

const savedUser = localStorage.getItem("agritrade_user");
const savedToken = localStorage.getItem("agritrade_token");

export const useAppStore = create((set, get) => ({
  user: savedUser ? JSON.parse(savedUser) : demoUsers[0],
  token: savedToken || null,
  search: "",
  toast: null,
  loading: false,
  apiOnline: true,
  
  // Active filters
  regionFilter: "",
  categoryFilter: "",
  statusFilter: "",
  
  setUser: (user, token = null) => {
    localStorage.setItem("agritrade_user", JSON.stringify(user));
    if (token) localStorage.setItem("agritrade_token", token);
    set({
      user,
      token: token || get().token,
      toast: { type: "SUCCESS", message: `Welcome back, ${user.name}` }
    });
  },
  
  logout: () => {
    localStorage.removeItem("agritrade_user");
    localStorage.removeItem("agritrade_token");
    set({
      user: null,
      token: null,
      toast: { type: "INFO", message: "Signed out successfully" }
    });
  },
  
  switchRoleUser: (roleEmail) => {
    const found = demoUsers.find((u) => u.email === roleEmail) || demoUsers[0];
    localStorage.setItem("agritrade_user", JSON.stringify(found));
    set({
      user: found,
      toast: { type: "SUCCESS", message: `Switched role to ${found.name} (${found.role})` }
    });
  },

  setSearch: (search) => set({ search }),
  setRegionFilter: (regionFilter) => set({ regionFilter }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  
  showToast: (message, type = "SUCCESS") => set({ toast: { message, type } }),
  clearToast: () => set({ toast: null }),
  setLoading: (loading) => set({ loading }),
  setApiOnline: (apiOnline) => set({ apiOnline })
}));
