import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
const baseURL = rawBaseUrl.replace(/\/+$/, "");

export const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function submitContactMessage(payload) {
  const response = await apiClient.post("/api/contact/", payload);
  return response.data;
}
