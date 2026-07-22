import { apiClient } from "@/api/client";
import type { Alert, DashboardCharts, DashboardSummary, ThreatEvent } from "@/types";

export const dashboardService = {
  summary: () => apiClient.get<DashboardSummary>("/dashboard/summary").then((r) => r.data),
  charts: () => apiClient.get<DashboardCharts>("/dashboard/charts").then((r) => r.data),
  alerts: () => apiClient.get<Alert[]>("/dashboard/alerts").then((r) => r.data),
  threats: () => apiClient.get<ThreatEvent[]>("/dashboard/threats").then((r) => r.data),
};
