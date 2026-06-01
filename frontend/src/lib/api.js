import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

// Attach admin token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("bb_admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const Concierge = {
  phone: "+1 (415) 555-0188",
  phoneRaw: "+14155550188",
  whatsapp: "14155550188",
  email: "concierge@bbchauffeur.com",
};

export const fmtUSD = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0);
