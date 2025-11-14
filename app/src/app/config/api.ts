import axios from "axios";

import { useAuthStore } from "@/modules/auth/infrastructure/store/useAuthStore";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL?.toString().trim() || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().userAuth?.accessToken;
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
      return Promise.reject(new Error("Session expired. Please sign in again."));
    }

    if (error?.response?.data?.detail) {
      return Promise.reject(new Error(error.response.data.detail));
    }

    return Promise.reject(error);
  }
);
