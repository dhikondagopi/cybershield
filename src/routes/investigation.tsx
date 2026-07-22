import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, PanelHeader, SevBadge } from "@/components/ui/panel";
import { incidents, liveEvents, alertsBySeverity } from "@/lib/mock-data";
import { Brain, FileText, Target, Activity, Zap, Cpu, Network, Briefcase, Shield, RefreshCcw, BookOpen, Fingerprint, Server } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/investigation")({
  component: AIInvestigationPage,
});

const GENERATION_STAGES = [
  { id: "exec", label: "Executive Summary", icon: FileText },
  { id: "tech", label: "Technical Summary", icon: Cpu },
  { id: "mitre", label: "MITRE ATT&CK Mapping", icon: Target },
  { id: "chain", label: "Attack Chain", icon: Activity },
  { id: "root", label: "Root Cause", icon: Zap },
  { id: "evidence", label: "Evidence", icon: Fingerprint },
  { id: "ioc", label: "IOC Extraction", icon: Network },
  { id: "assets", label: "Affected Assets", icon: Server },
  { id: "impact", label: "Business Impact", icon: Briefcase },
  { id: "contain", label: "Containment Plan", icon: Shield },
  { id: "recovery", label: "Recovery Plan", icon: RefreshCcw },
  { id: "lessons", label: "Lessons Learned", icon: BookOpen },
];

function AIInvestigationPage() {
  const [selectedIncident, setSelectedIncident] = useState(incidents[0]);
  const [generating, setGenerating] = useState(false);
  const [activeStage, setActiveStage] = useState(-1);
  const [completedStages, setCompletedStages] = useState<string[]>([]);

  const runInvestigation = () => {
    setGenerating(true);
    setActiveStage(0);
    setCompletedStages([]);
  };

  useEffect(() => {
    if (generating && activeStage < GENERATION_STAGES.length) {
      const timer = setTimeout(() => {
        setCompletedStages(prev => [...prev, GENERATION_STAGES[activeStage].id]);
        setActiveStage(activeStage + 1);
      }, 1500); // 1.5s per stage
      return () => clearTimeout(timer);
    } else if (activeStage >= GENERATION_STAGES.length) {
      setGenerating(false);
    }
  }, [generating, activeStage]);

  return (
    <AppShell>
      <div className="flex flex-col gap-6 h-full">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gradient">AI Threat Investigation</h1>
            <p className="text-muted-foreground mt-1 text-sm max-w-2xl">Autonomous deep-dive analysis, IOC extraction, and remediation planning.</p>
          </div>
          <button 
            onClick={runInvestigation}
            disabled={generating}
            className="h-10 px-6 rounded-lg bg-gradient-to-r from-primary to-neon text-primary-foreground font-semibold flex items-center gap-2 disabled:opacity-50 transition hover:opacity-90 shadow-[0_0_20px_oklch(0.72_0.19_275/0.4)]"
          >
            {generating ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
            {generating ? "AI is Analyzing..." : "Run AI Investigation"}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          <div className="space-y-4">
            <Panel>
              <PanelHeader title="Select Incident" />
              <div className="space-y-2 p-1">
                {incidents.map(inc => (
                  <button
                    key={inc.id}
                    onClick={() => { setSelectedIncident(inc); setCompletedStages([]); setActiveStage(-1); }}
                    className={`w-full text-left p-3 rounded-lg border transition ${selectedIncident.id === inc.id ? 'bg-primary/10 border-primary/40' : 'glass border-transparent hover:border-white/10'}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-cyan text-xs">{inc.id}</span>
                      <SevBadge sev={inc.sev} />
                    </div>
                    <div className="text-sm font-medium truncate">{inc.title}</div>
                  </button>
                ))}
              </div>
            </Panel>
            
            <Panel>
              <PanelHeader title="Investigation Progress" />
              <div className="space-y-3 mt-2 pr-2 h-[500px] overflow-y-auto custom-scrollbar">
                {GENERATION_STAGES.map((stage, idx) => {
                  const isCompleted = completedStages.includes(stage.id);
                  const isActive = idx === activeStage;
                  const isPending = !isCompleted && !isActive;
                  
                  return (
                    <div key={stage.id} className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${isActive ? 'bg-white/5 border border-white/10' : ''}`}>
                      <div className={`h-8 w-8 rounded-full grid place-items-center shrink-0 ${isCompleted ? 'bg-success/20 text-success' : isActive ? 'bg-primary/20 text-primary' : 'bg-white/5 text-muted-foreground'}`}>
                        {isCompleted ? <Shield className="h-4 w-4" /> : isActive ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <stage.icon className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium ${isCompleted ? 'text-success' : isActive ? 'text-primary' : 'text-muted-foreground'}`}>{stage.label}</div>
                        <div className="text-[10px] text-muted-foreground uppercase">{isCompleted ? 'Completed' : isActive ? 'Generating...' : 'Pending'}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Panel>
          </div>

          <Panel className="flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
            <PanelHeader 
              title="AI Output Report" 
              subtitle={selectedIncident.title}
              right={<div className="text-xs font-mono text-cyan border border-cyan/30 bg-cyan/10 px-2 py-1 rounded">CONFIDENCE: {Math.floor(Math.random() * 15 + 85)}%</div>} 
            />
            
            <div className="flex-1 p-6 overflow-y-auto relative space-y-8 custom-scrollbar h-[700px]">
              {activeStage === -1 && completedStages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                  <Brain className="h-16 w-16 mb-4" />
                  <p>Click "Run AI Investigation" to begin deep-dive analysis.</p>
                </div>
              )}

              <AnimatePresence>
                {completedStages.includes("exec") && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-primary"><FileText className="h-5 w-5" /> Executive Summary</h3>
                    <div className="glass p-4 rounded-lg text-sm text-muted-foreground leading-relaxed">
                      AI Copilot has identified a highly coordinated {selectedIncident.title} targeting critical infrastructure. The attack originated from an external threat actor utilizing advanced evasion techniques. Immediate containment is required to prevent widespread data exfiltration and operational downtime. Estimated risk exposure is CRITICAL.
                    </div>
                  </motion.div>
                )}

                {completedStages.includes("tech") && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-cyan"><Cpu className="h-5 w-5" /> Technical Summary</h3>
                    <div className="glass p-4 rounded-lg text-sm text-muted-foreground font-mono">
                      Initial access vector: Spearphishing payload (SHA256: 8a9b...21f). Payload executed living-off-the-land binaries (certutil.exe, powershell.exe) to bypass EDR. C2 beacon established via DNS tunneling. Privilege escalation achieved via CVE-2024-XXXX exploit on unpatched internal segment.
                    </div>
                  </motion.div>
                )}

                {completedStages.includes("mitre") && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-warn"><Target className="h-5 w-5" /> MITRE ATT&CK Mapping</h3>
                    <div className="flex flex-wrap gap-2">
                      {["T1566 - Phishing", "T1059 - Command & Scripting", "T1068 - Exploitation for PrivEsc", "T1071 - Application Layer Protocol", "T1486 - Data Encrypted"].map(t => (
                        <span key={t} className="px-3 py-1.5 glass rounded-md text-xs font-mono border border-warn/30">{t}</span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {completedStages.includes("chain") && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-orange-400"><Activity className="h-5 w-5" /> Attack Chain</h3>
                    <div className="glass p-4 rounded-lg border-l-2 border-orange-400">
                       <ul className="space-y-3 text-sm">
                         <li className="flex gap-4"><span className="text-orange-400 font-mono">08:00</span> Reconnaissance and Payload Delivery</li>
                         <li className="flex gap-4"><span className="text-orange-400 font-mono">08:15</span> Execution via malicious macro</li>
                         <li className="flex gap-4"><span className="text-orange-400 font-mono">09:30</span> Credential Dumping (LSASS)</li>
                         <li className="flex gap-4"><span className="text-orange-400 font-mono">10:45</span> Lateral Movement to DC</li>
                       </ul>
                    </div>
                  </motion.div>
                )}

                {completedStages.includes("root") && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-critical"><Zap className="h-5 w-5" /> Root Cause</h3>
                    <div className="glass p-4 rounded-lg text-sm">
                      Lack of MFA on legacy VPN gateway allowed compromised credentials to be reused. Flat network topology enabled unrestricted lateral movement to domain controllers.
                    </div>
                  </motion.div>
                )}

                {completedStages.includes("ioc") && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-neon"><Network className="h-5 w-5" /> Extracted IOCs</h3>
                    <div className="grid grid-cols-2 gap-2">
                       {["IP: 185.12.4.92", "IP: 45.33.22.1", "Domain: bad-actor-c2.net", "Hash: f3a1...89bc", "Registry: HKLM\\Run\\Update"].map(ioc => (
                         <div key={ioc} className="glass p-2 rounded text-xs font-mono border border-neon/20">{ioc}</div>
                       ))}
                    </div>
                  </motion.div>
                )}

                {completedStages.includes("contain") && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2 mt-8">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-success"><Shield className="h-5 w-5" /> Containment & Recovery Plan</h3>
                    <div className="glass p-4 rounded-lg space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground"><div className="h-1.5 w-1.5 rounded-full bg-success" /> Isolate compromised hosts (14 endpoints).</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground"><div className="h-1.5 w-1.5 rounded-full bg-success" /> Force global password reset for privileged accounts.</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground"><div className="h-1.5 w-1.5 rounded-full bg-success" /> Block extracted IOCs at perimeter firewall.</div>
                      <button className="mt-4 px-4 py-2 bg-success/20 text-success rounded-md text-sm font-semibold hover:bg-success/30 transition">Execute SOAR Playbook</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {generating && (
                <div className="flex items-center gap-3 text-cyan p-4 rounded-lg bg-cyan/5 border border-cyan/20 animate-pulse">
                  <RefreshCcw className="h-5 w-5 animate-spin" />
                  <span>AI Neural Engine is synthesizing data ({activeStage + 1}/{GENERATION_STAGES.length})...</span>
                </div>
              )}
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
