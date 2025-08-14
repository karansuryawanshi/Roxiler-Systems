import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// attach token if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default {
  // Auth
  login: (payload) => api.post("/auth/login", payload),
  register: (payload) => api.post("/auth/signup", payload),

  // Admin
  adminDashboard: () => api.get("/admin/dashboard"),
  getUsers: (params) => api.get("/admin/users", { params }),
  createUser: (payload) => api.post("/users", payload),
  getStoresAdmin: (params) => api.get("admin/stores", { params }),

  // Stores
  getStores: (params) => api.get("/stores", { params }),
  getStore: (id) => api.get(`/stores/${id}`),
  createStore: (payload) => api.post("/admin/stores", payload),

  // Ratings
  submitRating: (storeId, payload) => api.post(`/ratings/${storeId}`, payload),
  updateRating: (storeId, payload) => api.put(`/ratings/${storeId}`, payload),

  // User
  updatePassword: (userId, payload) =>
    api.put(`/users/${userId}/password`, payload),
};
