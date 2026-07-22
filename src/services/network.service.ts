import { apiClient } from "@/api/client";
import type { NetworkGraph } from "@/types";

export const networkService = {
  graph: () => apiClient.get<NetworkGraph>("/network/graph").then((r) => r.data),
};
