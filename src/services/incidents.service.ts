import { apiClient } from "@/api/client";
import type { CreateIncidentPayload, Incident, IncidentComment, IncidentEvidence, UpdateIncidentPayload } from "@/types";

export const incidentsService = {
  list: () => apiClient.get<Incident[]>("/incidents").then((r) => r.data),
  get: (id: string) => apiClient.get<Incident>(`/incidents/${id}`).then((r) => r.data),
  create: (payload: CreateIncidentPayload) => apiClient.post<Incident>("/incidents", payload).then((r) => r.data),
  update: (id: string, payload: UpdateIncidentPayload) => apiClient.patch<Incident>(`/incidents/${id}`, payload).then((r) => r.data),
  close: (id: string) => apiClient.post<Incident>(`/incidents/${id}/close`).then((r) => r.data),
  assign: (id: string, assignee: string) => apiClient.post<Incident>(`/incidents/${id}/assign`, { assignee }).then((r) => r.data),
  addComment: (id: string, body: string, author = "You") =>
    apiClient.post<IncidentComment>(`/incidents/${id}/comments`, { body, author }).then((r) => r.data),
  addEvidence: (id: string, evidence: Partial<IncidentEvidence>) =>
    apiClient.post<IncidentEvidence>(`/incidents/${id}/evidence`, evidence).then((r) => r.data),
};
