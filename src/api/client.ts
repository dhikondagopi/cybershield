import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { installMockAdapter } from "./mock-adapter";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const USE_MOCK = (import.meta.env.VITE_USE_MOCK_API ?? "true") !== "false";

export const ACCESS_TOKEN_KEY = "cybershield.accessToken";
export const REFRESH_TOKEN_KEY = "cybershield.refreshToken";

function readToken(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setTokens(access: string | null, refresh?: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (access) window.localStorage.setItem(ACCESS_TOKEN_KEY, access);
    else window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    if (refresh !== undefined) {
      if (refresh) window.localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
      else window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  } catch {
    /* ignore */
  }
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 20_000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = readToken(ACCESS_TOKEN_KEY);
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshing: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refresh = readToken(REFRESH_TOKEN_KEY);
  if (!refresh) return null;
  try {
    const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken: refresh });
    const newToken = data?.tokens?.accessToken as string | undefined;
    const newRefresh = data?.tokens?.refreshToken as string | undefined;
    if (newToken) setTokens(newToken, newRefresh ?? refresh);
    return newToken ?? null;
  } catch {
    setTokens(null, null);
    return null;
  }
}

apiClient.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      refreshing = refreshing || refreshAccessToken();
      const token = await refreshing;
      refreshing = null;
      if (token) {
        original.headers = { ...(original.headers || {}), Authorization: `Bearer ${token}` };
        return apiClient.request(original);
      }
    }
    return Promise.reject(normalizeError(error));
  },
);

export function normalizeError(error: unknown) {
  if (axios.isAxiosError(error)) {
    return {
      message:
        (error.response?.data as { message?: string } | undefined)?.message ||
        error.message ||
        "Request failed",
      code: error.code,
      status: error.response?.status,
      details: error.response?.data,
    };
  }
  return { message: (error as Error)?.message || "Unknown error" };
}

if (USE_MOCK) {
  installMockAdapter(apiClient);
}

export const apiConfig = { baseURL: BASE_URL, mock: USE_MOCK };