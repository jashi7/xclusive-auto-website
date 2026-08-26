import axios from "axios";

const BASE = (process.env.REACT_APP_BACKEND_URL || "") + "/api";

const api = axios.create({ baseURL: BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("xa_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

export const AuthAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }).then((r) => r.data),
  me: () => api.get("/auth/me").then((r) => r.data),
};

export const VehiclesAPI = {
  list: () => api.get("/vehicles").then((r) => r.data),
  get: (id) => api.get(`/vehicles/${id}`).then((r) => r.data),
  create: (data) => api.post("/vehicles", data).then((r) => r.data),
  update: (id, data) => api.put(`/vehicles/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/vehicles/${id}`).then((r) => r.data),
};

export const LeadsAPI = {
  create: (data) => api.post("/leads", data).then((r) => r.data),
  list: () => api.get("/leads").then((r) => r.data),
  markRead: (id) => api.patch(`/leads/${id}/read`).then((r) => r.data),
  remove: (id) => api.delete(`/leads/${id}`).then((r) => r.data),
};

export const SettingsAPI = {
  get: () => api.get("/settings").then((r) => r.data),
  update: (data) => api.put("/settings", data).then((r) => r.data),
};
