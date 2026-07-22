import { apiClient } from "@/api/client";
import type { ReportRequest, ReportResponse } from "@/types";

export const reportsService = {
  list: () => apiClient.get<ReportResponse[]>("/reports").then((r) => r.data),
  generate: (payload: ReportRequest) =>
    apiClient.post<ReportResponse>("/reports/generate", payload).then((r) => r.data),
};
