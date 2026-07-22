// Central type definitions for CyberShield AI backend integration.

export type UserRole = "soc_analyst" | "soc_manager" | "administrator";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

export type Severity = "Critical" | "High" | "Medium" | "Low" | "Info";
export type IncidentStatus = "Open" | "Investigating" | "Contained" | "Eradicated" | "Recovered" | "Closed";

export interface DashboardKpi {
  label: string;
  value: string;
  delta: string;
  tone: string;
}

export interface DashboardSummary {
  kpis: DashboardKpi[];
  networkHealth: number;
  activeThreats: number;
  openIncidents: number;
  meanTimeToDetect: string;
  meanTimeToRespond: string;
}

export interface DashboardCharts {
  timeline: Array<{ time: string; threats: number; blocked: number }>;
  alertsBySeverity: Array<{ name: string; value: number; color?: string }>;
  assetsByCategory: Array<{ name: string; value: number }>;
}

export interface Alert {
  id: string;
  title: string;
  sev: Severity | string;
  asset: string;
  tech: string;
  time: string;
  status: string;
}

export interface ThreatEvent {
  t: string;
  sev: string;
  src: string;
  msg: string;
}

export interface Incident {
  id: string;
  title: string;
  sev: string;
  stage: string;
  status?: IncidentStatus;
  assignee: string;
  opened: string;
  description?: string;
  timeline?: IncidentTimelineEntry[];
  evidence?: IncidentEvidence[];
  comments?: IncidentComment[];
}

export interface IncidentTimelineEntry {
  id: string;
  at: string;
  actor: string;
  action: string;
  detail?: string;
}

export interface IncidentEvidence {
  id: string;
  name: string;
  type: string;
  size?: string;
  uploadedBy: string;
  uploadedAt: string;
  url?: string;
}

export interface IncidentComment {
  id: string;
  author: string;
  role: UserRole | string;
  body: string;
  at: string;
}

export interface CreateIncidentPayload {
  title: string;
  sev: string;
  description?: string;
  assignee?: string;
}

export interface UpdateIncidentPayload {
  title?: string;
  sev?: string;
  stage?: string;
  status?: IncidentStatus;
  assignee?: string;
  description?: string;
}

export interface CVE {
  id: string;
  cvss: number;
  sev: string;
  asset: string;
  exploit: string;
  vendor: string;
}

export interface IOC {
  type: string;
  value: string;
  conf: number;
  tag: string;
}

export interface ThreatActor {
  name: string;
  origin: string;
  targets: string;
  ttps: number;
}

export interface MitreTechnique {
  id: string;
  name: string;
  tactic: string;
  description?: string;
}

export interface Anomaly {
  type: string;
  title: string;
  conf: number;
  risk: number;
  when: string;
  action: string;
}

export interface Asset {
  name: string;
  type: string;
  os: string;
  risk: number;
  status: string;
  owner: string;
  loc: string;
}

export interface NetworkNode {
  id: string;
  label: string;
  type: string;
  risk: number;
}

export interface NetworkEdge {
  source: string;
  target: string;
  traffic: number;
  risky?: boolean;
}

export interface NetworkGraph {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  riskPaths: string[][];
}

export interface CopilotMessage {
  role: "user" | "assistant" | "system";
  content: string;
  at?: string;
}

export interface CopilotChatPayload {
  messages: CopilotMessage[];
  context?: Record<string, unknown>;
}

export interface ReportRequest {
  type: "executive" | "compliance" | "incident";
  from?: string;
  to?: string;
  incidentId?: string;
  format?: "pdf" | "html";
}

export interface ReportResponse {
  id: string;
  type: string;
  url: string;
  generatedAt: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}