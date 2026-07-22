export const kpis = [
  { label: "Total Assets", value: "12,847", delta: "+3.2%", tone: "cyan" },
  { label: "Active Threats", value: "47", delta: "+12", tone: "critical" },
  { label: "Critical Alerts", value: "9", delta: "-2", tone: "warn" },
  { label: "MTTD", value: "3.4m", delta: "-18%", tone: "success" },
  { label: "MTTR", value: "27m", delta: "-9%", tone: "success" },
  { label: "Blocked Attacks", value: "18,204", delta: "+621", tone: "primary" },
  { label: "High Risk Devices", value: "132", delta: "+8", tone: "warn" },
  { label: "Network Health", value: "98.6%", delta: "+0.4%", tone: "success" },
] as const;

export const threatTimeline = Array.from({ length: 24 }).map((_, i) => ({
  time: `${String(i).padStart(2, "0")}:00`,
  threats: Math.round(20 + Math.sin(i / 2) * 15 + Math.random() * 12),
  blocked: Math.round(80 + Math.cos(i / 3) * 20 + Math.random() * 10),
}));

export const alertsBySeverity = [
  { name: "Critical", value: 12, color: "oklch(0.65 0.26 20)" },
  { name: "High", value: 34, color: "oklch(0.80 0.17 45)" },
  { name: "Medium", value: 78, color: "oklch(0.80 0.17 75)" },
  { name: "Low", value: 143, color: "oklch(0.75 0.18 155)" },
];

export const assetsByCategory = [
  { name: "Endpoints", value: 6420 },
  { name: "Servers", value: 1240 },
  { name: "Cloud", value: 2180 },
  { name: "Network", value: 512 },
  { name: "IoT/OT", value: 2495 },
];

export const liveEvents = [
  { t: "12:04:22", sev: "critical", src: "10.42.1.18", msg: "Suspicious PowerShell encoded command executed" },
  { t: "12:04:15", sev: "high", src: "AWS/eu-west-1", msg: "IAM privilege escalation attempt detected" },
  { t: "12:04:02", sev: "medium", src: "fw-edge-01", msg: "Port scan from 194.31.55.12 blocked" },
  { t: "12:03:41", sev: "high", src: "grid-scada-07", msg: "Modbus write from unauthorized host" },
  { t: "12:03:19", sev: "low", src: "user:jsmith", msg: "Impossible travel: London → Lagos" },
  { t: "12:03:02", sev: "critical", src: "srv-db-prod-3", msg: "Ransomware behavior: mass file encryption" },
  { t: "12:02:44", sev: "medium", src: "endpoint-2183", msg: "Beaconing to known C2 domain" },
];

export const recentAlerts = [
  { id: "ALT-8842", title: "Cobalt Strike Beacon Detected", sev: "Critical", asset: "srv-app-04", tech: "T1071", time: "2m ago", status: "Open" },
  { id: "ALT-8841", title: "Kerberoasting Attempt", sev: "High", asset: "dc-01", tech: "T1558.003", time: "6m ago", status: "Investigating" },
  { id: "ALT-8840", title: "Suspicious PSExec Lateral Movement", sev: "High", asset: "wks-ops-19", tech: "T1021.002", time: "12m ago", status: "Contained" },
  { id: "ALT-8839", title: "Impossible Travel", sev: "Medium", asset: "user:kchen", tech: "T1078", time: "18m ago", status: "Open" },
  { id: "ALT-8838", title: "SCADA Modbus Anomaly", sev: "Critical", asset: "plc-grid-07", tech: "T0836", time: "22m ago", status: "Open" },
  { id: "ALT-8837", title: "DNS Tunneling", sev: "High", asset: "endpoint-2183", tech: "T1071.004", time: "31m ago", status: "Investigating" },
];

export const mitreTactics = [
  "Reconnaissance","Initial Access","Execution","Persistence","Privilege Escalation",
  "Credential Access","Lateral Movement","Exfiltration","Impact",
];

export const anomalies = [
  { type: "Network", title: "Unusual outbound to 45.61.187.9", conf: 96, risk: 88, when: "3m ago", action: "Block IP + isolate host" },
  { type: "User", title: "kchen accessed 214 files in 60s", conf: 91, risk: 76, when: "8m ago", action: "Force MFA re-auth" },
  { type: "Device", title: "srv-db-3 CPU 300% baseline", conf: 87, risk: 71, when: "14m ago", action: "Snapshot + forensic capture" },
  { type: "Login", title: "10 failed logins from TOR exit", conf: 99, risk: 92, when: "17m ago", action: "Lock account + geo-block" },
  { type: "Process", title: "cmd.exe spawned by winword.exe", conf: 94, risk: 84, when: "22m ago", action: "Kill process tree" },
];

export const incidents = [
  { id: "INC-2041", title: "Ransomware Outbreak — Finance Segment", sev: "Critical", stage: "Containment", assignee: "SOC L2", opened: "42m" },
  { id: "INC-2040", title: "APT-29 Style Credential Access", sev: "High", stage: "Investigation", assignee: "T. Okafor", opened: "1h" },
  { id: "INC-2039", title: "OT Network Modbus Injection", sev: "Critical", stage: "Eradication", assignee: "ICS Team", opened: "2h" },
  { id: "INC-2038", title: "Phishing Campaign — Executives", sev: "Medium", stage: "Recovery", assignee: "SOC L1", opened: "5h" },
];

export const cves = [
  { id: "CVE-2025-31200", cvss: 9.8, sev: "Critical", asset: "srv-web-12", exploit: "Public PoC", vendor: "Apache HTTPD" },
  { id: "CVE-2025-29841", cvss: 9.1, sev: "Critical", asset: "vpn-gw-02", exploit: "Weaponized", vendor: "Ivanti Connect Secure" },
  { id: "CVE-2025-27523", cvss: 8.4, sev: "High", asset: "endpoint-*", exploit: "Public PoC", vendor: "Microsoft Windows" },
  { id: "CVE-2025-22016", cvss: 7.5, sev: "High", asset: "srv-db-prod-3", exploit: "None", vendor: "PostgreSQL" },
  { id: "CVE-2024-9911", cvss: 6.4, sev: "Medium", asset: "fw-edge-01", exploit: "Theoretical", vendor: "PAN-OS" },
  { id: "CVE-2024-8710", cvss: 4.2, sev: "Low", asset: "print-fleet", exploit: "None", vendor: "HP LaserJet" },
];

export const iocs = [
  { type: "Domain", value: "cdn-update-microsft.co", conf: 98, tag: "C2 / APT-29" },
  { type: "IP", value: "45.61.187.9", conf: 96, tag: "Cobalt Strike" },
  { type: "Hash", value: "a3f5…d7c1 (SHA256)", conf: 92, tag: "LockBit 4.0" },
  { type: "Domain", value: "invoice-secure-portal.top", conf: 88, tag: "Phishing" },
  { type: "IP", value: "185.220.101.44", conf: 90, tag: "TOR Exit" },
];

export const actors = [
  { name: "APT-29 / Cozy Bear", origin: "RU", targets: "Government, Energy", ttps: 42 },
  { name: "Lazarus Group", origin: "KP", targets: "Finance, Crypto", ttps: 61 },
  { name: "Volt Typhoon", origin: "CN", targets: "Critical Infrastructure", ttps: 38 },
  { name: "Scattered Spider", origin: "US/UK", targets: "Telecom, SaaS", ttps: 27 },
];

export const assets = [
  { name: "srv-app-04", type: "Server", os: "Ubuntu 22.04", risk: 82, status: "At Risk", owner: "Platform", loc: "eu-west-1" },
  { name: "plc-grid-07", type: "IoT/OT", os: "Siemens S7", risk: 91, status: "Critical", owner: "Grid Ops", loc: "Substation-3" },
  { name: "wks-ops-19", type: "Endpoint", os: "Windows 11", risk: 64, status: "Warning", owner: "Ops", loc: "HQ-2F" },
  { name: "fw-edge-01", type: "Firewall", os: "PAN-OS 11", risk: 22, status: "Healthy", owner: "NetSec", loc: "DC-A" },
  { name: "s3://backup-vault", type: "Cloud", os: "AWS S3", risk: 41, status: "Warning", owner: "Cloud", loc: "us-east-1" },
  { name: "rt-core-02", type: "Router", os: "IOS-XE 17", risk: 18, status: "Healthy", owner: "NetOps", loc: "DC-B" },
];

export const killChain = [
  { phase: "Reconnaissance", t: "T-96h", detail: "Port scan from 194.31.55.12 across DMZ", status: "logged" },
  { phase: "Initial Access", t: "T-72h", detail: "Spear-phish delivered to finance@corp", status: "blocked-partial" },
  { phase: "Execution", t: "T-48h", detail: "Encoded PowerShell on wks-ops-19", status: "detected" },
  { phase: "Persistence", t: "T-46h", detail: "Scheduled task 'WinUpd' created", status: "detected" },
  { phase: "Privilege Escalation", t: "T-24h", detail: "Token impersonation via SeDebugPrivilege", status: "detected" },
  { phase: "Credential Access", t: "T-18h", detail: "LSASS dump via comsvcs.dll", status: "contained" },
  { phase: "Lateral Movement", t: "T-6h", detail: "PSExec to srv-app-04", status: "contained" },
  { phase: "Exfiltration", t: "T-2h", detail: "DNS tunneling to cdn-update-microsft.co", status: "blocked" },
  { phase: "Impact", t: "Now", detail: "Encryption attempt on srv-db-prod-3", status: "prevented" },
];
