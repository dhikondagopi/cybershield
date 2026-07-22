import { apiClient } from "@/api/client";
import type { Anomaly } from "@/types";

export const anomaliesService = {
  network: () => apiClient.get<Anomaly[]>("/anomalies/network").then((r) => r.data),
  user: () => apiClient.get<Anomaly[]>("/anomalies/user").then((r) => r.data),
  device: () => apiClient.get<Anomaly[]>("/anomalies/device").then((r) => r.data),
  riskScore: () =>
    apiClient
      .get<{ overall: number; breakdown: Array<{ dimension: string; score: number }> }>(
        "/anomalies/risk-score",
      )
      .then((r) => r.data),
};
