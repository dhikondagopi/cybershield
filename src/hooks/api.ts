import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  anomaliesService,
  assetsService,
  copilotService,
  dashboardService,
  incidentsService,
  networkService,
  reportsService,
  threatIntelService,
} from "@/services";
import type {
  CopilotChatPayload,
  CreateIncidentPayload,
  ReportRequest,
  UpdateIncidentPayload,
} from "@/types";

const RETRY = 2;
const STALE = 30_000;

// Dashboard
export const useDashboardSummary = () =>
  useQuery({ queryKey: ["dashboard", "summary"], queryFn: dashboardService.summary, retry: RETRY, staleTime: STALE });
export const useDashboardCharts = () =>
  useQuery({ queryKey: ["dashboard", "charts"], queryFn: dashboardService.charts, retry: RETRY, staleTime: STALE });
export const useDashboardAlerts = () =>
  useQuery({ queryKey: ["dashboard", "alerts"], queryFn: dashboardService.alerts, retry: RETRY, staleTime: STALE });
export const useDashboardThreats = () =>
  useQuery({ queryKey: ["dashboard", "threats"], queryFn: dashboardService.threats, retry: RETRY, staleTime: STALE });

// Incidents
export const useIncidents = () =>
  useQuery({ queryKey: ["incidents"], queryFn: incidentsService.list, retry: RETRY, placeholderData: keepPreviousData });
export const useIncident = (id: string | undefined) =>
  useQuery({ queryKey: ["incidents", id], queryFn: () => incidentsService.get(id!), enabled: !!id, retry: RETRY });

function invalidateIncidents(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: ["incidents"] });
}

export function useCreateIncident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: CreateIncidentPayload) => incidentsService.create(p),
    onSuccess: () => { invalidateIncidents(qc); toast.success("Incident created"); },
    onError: (e: any) => toast.error(e?.message || "Failed to create incident"),
  });
}
export function useUpdateIncident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateIncidentPayload }) =>
      incidentsService.update(id, payload),
    onSuccess: (_d, v) => { qc.invalidateQueries({ queryKey: ["incidents", v.id] }); invalidateIncidents(qc); toast.success("Incident updated"); },
    onError: (e: any) => toast.error(e?.message || "Update failed"),
  });
}
export function useCloseIncident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => incidentsService.close(id),
    onSuccess: (_d, id) => { qc.invalidateQueries({ queryKey: ["incidents", id] }); invalidateIncidents(qc); toast.success("Incident closed"); },
    onError: (e: any) => toast.error(e?.message || "Close failed"),
  });
}
export function useAssignIncident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, assignee }: { id: string; assignee: string }) => incidentsService.assign(id, assignee),
    onSuccess: (_d, v) => { qc.invalidateQueries({ queryKey: ["incidents", v.id] }); invalidateIncidents(qc); toast.success("Assigned"); },
    onError: (e: any) => toast.error(e?.message || "Assign failed"),
  });
}
export function useAddIncidentComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body, author }: { id: string; body: string; author?: string }) =>
      incidentsService.addComment(id, body, author),
    onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ["incidents", v.id] }),
  });
}

// Threat intel
export const useThreatFeed = () => useQuery({ queryKey: ["ti", "feed"], queryFn: threatIntelService.feed, retry: RETRY, staleTime: STALE });
export const useCves = () => useQuery({ queryKey: ["ti", "cves"], queryFn: threatIntelService.cves, retry: RETRY, staleTime: STALE });
export const useIocs = () => useQuery({ queryKey: ["ti", "iocs"], queryFn: threatIntelService.iocs, retry: RETRY, staleTime: STALE });
export const useThreatActors = () => useQuery({ queryKey: ["ti", "actors"], queryFn: threatIntelService.actors, retry: RETRY, staleTime: STALE });
export const useMitreTechniques = () => useQuery({ queryKey: ["ti", "mitre"], queryFn: threatIntelService.mitre, retry: RETRY, staleTime: STALE });

// Copilot
export function useCopilotChat() {
  return useMutation({
    mutationFn: (p: CopilotChatPayload) => copilotService.chat(p),
    onError: (e: any) => toast.error(e?.message || "Copilot request failed"),
  });
}
export function useLogAnalysis() {
  return useMutation({
    mutationFn: (logs: string) => copilotService.analyzeLogs(logs),
    onError: (e: any) => toast.error(e?.message || "Log analysis failed"),
  });
}
export function useCopilotReport() {
  return useMutation({
    mutationFn: (p: ReportRequest) => copilotService.generateReport(p),
    onSuccess: () => toast.success("Report generated"),
    onError: (e: any) => toast.error(e?.message || "Report generation failed"),
  });
}
export function useThreatAnalysis() {
  return useMutation({
    mutationFn: (input: Record<string, unknown>) => copilotService.threatAnalysis(input),
  });
}

// Anomalies
export const useNetworkAnomalies = () => useQuery({ queryKey: ["anom", "network"], queryFn: anomaliesService.network, retry: RETRY });
export const useUserAnomalies = () => useQuery({ queryKey: ["anom", "user"], queryFn: anomaliesService.user, retry: RETRY });
export const useDeviceAnomalies = () => useQuery({ queryKey: ["anom", "device"], queryFn: anomaliesService.device, retry: RETRY });
export const useRiskScore = () => useQuery({ queryKey: ["anom", "risk"], queryFn: anomaliesService.riskScore, retry: RETRY });

// Assets & network
export const useAssets = () => useQuery({ queryKey: ["assets"], queryFn: assetsService.all, retry: RETRY });
export const useServers = () => useQuery({ queryKey: ["assets", "servers"], queryFn: assetsService.servers, retry: RETRY });
export const useEndpoints = () => useQuery({ queryKey: ["assets", "endpoints"], queryFn: assetsService.endpoints, retry: RETRY });
export const useCloudAssets = () => useQuery({ queryKey: ["assets", "cloud"], queryFn: assetsService.cloud, retry: RETRY });
export const useIoTAssets = () => useQuery({ queryKey: ["assets", "iot"], queryFn: assetsService.iot, retry: RETRY });
export const useFirewalls = () => useQuery({ queryKey: ["assets", "firewalls"], queryFn: assetsService.firewalls, retry: RETRY });
export const useNetworkGraph = () => useQuery({ queryKey: ["network", "graph"], queryFn: networkService.graph, retry: RETRY });

// Reports
export const useReports = () => useQuery({ queryKey: ["reports"], queryFn: reportsService.list, retry: RETRY });
export function useGenerateReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: ReportRequest) => reportsService.generate(p),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["reports"] }); toast.success("Report ready"); },
    onError: (e: any) => toast.error(e?.message || "Failed to generate report"),
  });
}
