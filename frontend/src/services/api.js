import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("agritrade_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error.response?.data?.message || error.message || "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);

// Auth
export async function loginApi(email, password) {
  const { data } = await api.post("/auth/login", { email, password });
  return data.data;
}

export async function registerApi(formData) {
  const { data } = await api.post("/auth/register", formData);
  return data.data;
}

export async function getMeApi() {
  const { data } = await api.get("/auth/me");
  return data.data;
}

// Resource Generic API
export async function fetchResource(resource, params = {}) {
  const { data } = await api.get(`/${resource}`, { params });
  return data;
}

export async function fetchResourceById(resource, id) {
  const { data } = await api.get(`/${resource}/${id}`);
  return data.data;
}

export async function createResource(resource, payload) {
  const { data } = await api.post(`/${resource}`, payload);
  return data.data;
}

export async function updateResource(resource, id, payload) {
  const { data } = await api.patch(`/${resource}/${id}`, payload);
  return data.data;
}

export async function deleteResource(resource, id) {
  const { data } = await api.delete(`/${resource}/${id}`);
  return data.data;
}

// Workflows
export async function receiveLotApi(id, remarks) {
  const { data } = await api.post(`/lots/${id}/receive`, { remarks });
  return data.data;
}

export async function sendToInspectionApi(id, remarks) {
  const { data } = await api.post(`/lots/${id}/inspection-pending`, { remarks });
  return data.data;
}

export async function recordInspectionApi(id, payload) {
  const { data } = await api.post(`/lots/${id}/inspect`, payload);
  return data.data;
}

export async function acceptLotApi(id, acceptedQuantity, remarks) {
  const { data } = await api.post(`/lots/${id}/accept`, { acceptedQuantity, remarks });
  return data.data;
}

export async function rejectLotApi(id, reason) {
  const { data } = await api.post(`/lots/${id}/reject`, { reason });
  return data.data;
}

export async function storeLotApi(id, warehouse, storageLocation, remarks) {
  const { data } = await api.post(`/lots/${id}/store`, { warehouse, storageLocation, remarks });
  return data.data;
}

export async function allocatePoApi(id, lotId, lineItemId, quantity) {
  const { data } = await api.post(`/purchase-orders/${id}/allocate`, { lotId, lineItemId, quantity });
  return data.data;
}

export async function cancelPoApi(id, reason) {
  const { data } = await api.post(`/purchase-orders/${id}/cancel`, { reason });
  return data.data;
}

export async function assignVehicleApi(id, vehicle, driver, remarks) {
  const { data } = await api.post(`/shipments/${id}/assign-vehicle`, { vehicle, driver, remarks });
  return data.data;
}

export async function dispatchShipmentApi(id, remarks) {
  const { data } = await api.post(`/shipments/${id}/dispatch`, { remarks });
  return data.data;
}

export async function inTransitShipmentApi(id, remarks) {
  const { data } = await api.post(`/shipments/${id}/in-transit`, { remarks });
  return data.data;
}

export async function deliverShipmentApi(id, remarks) {
  const { data } = await api.post(`/shipments/${id}/deliver`, { remarks });
  return data.data;
}

export async function approveSettlementApi(id) {
  const { data } = await api.post(`/settlements/${id}/approve`);
  return data.data;
}

export async function paySettlementApi(id, paymentReference) {
  const { data } = await api.post(`/settlements/${id}/pay`, { paymentReference });
  return data.data;
}

// Reports
export async function getReportSummaryApi() {
  const { data } = await api.get("/reports/summary");
  return data.data;
}
