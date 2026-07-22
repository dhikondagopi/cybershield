import { apiClient } from "@/api/client";
import type { Asset } from "@/types";

export const assetsService = {
  all: () => apiClient.get<Asset[]>("/assets").then((r) => r.data),
  servers: () => apiClient.get<Asset[]>("/assets/servers").then((r) => r.data),
  endpoints: () => apiClient.get<Asset[]>("/assets/endpoints").then((r) => r.data),
  cloud: () => apiClient.get<Asset[]>("/assets/cloud").then((r) => r.data),
  iot: () => apiClient.get<Asset[]>("/assets/iot").then((r) => r.data),
  firewalls: () => apiClient.get<Asset[]>("/assets/firewalls").then((r) => r.data),
};
