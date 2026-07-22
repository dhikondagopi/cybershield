import { apiClient } from "@/api/client";
import type { CVE, IOC, MitreTechnique, ThreatActor, ThreatEvent } from "@/types";

export const threatIntelService = {
  feed: () => apiClient.get<ThreatEvent[]>("/threat-intel/feed").then((r) => r.data),
  cves: () => apiClient.get<CVE[]>("/threat-intel/cves").then((r) => r.data),
  iocs: () => apiClient.get<IOC[]>("/threat-intel/iocs").then((r) => r.data),
  actors: () => apiClient.get<ThreatActor[]>("/threat-intel/actors").then((r) => r.data),
  mitre: () => apiClient.get<MitreTechnique[]>("/threat-intel/mitre").then((r) => r.data),
};
