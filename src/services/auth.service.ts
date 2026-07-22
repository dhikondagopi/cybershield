import { apiClient, setTokens } from "@/api/client";
import type { AuthResponse, LoginPayload, RegisterPayload, User } from "@/types";

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>("/auth/login", payload);
    setTokens(data.tokens.accessToken, data.tokens.refreshToken);
    return data;
  },
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>("/auth/register", payload);
    setTokens(data.tokens.accessToken, data.tokens.refreshToken);
    return data;
  },
  async logout(): Promise<void> {
    try { await apiClient.post("/auth/logout"); } finally { setTokens(null, null); }
  },
  async profile(): Promise<User> {
    const { data } = await apiClient.get<User>("/auth/profile");
    return data;
  },
};
