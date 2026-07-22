import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { FileText, Download, CheckCircle2, Bot, Calendar, Building, FileCode, Search, FileBadge, Lock, RefreshCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/report-gen")({
  component: ReportGeneratorPage,
});

const REPORT_TYPES = [
  { id: "exec", name: "Executive Board Summary", icon: Building, desc: "High-level risk, ROI, and major incidents for C-suite.", color: "text-primary" },
  { id: "tech", name: "Technical Incident Report", icon: FileCode, desc: "Deep dive forensic timeline, IOCs, and remediation steps.", color: "text-cyan" },
  { id: "comp", name: "Compliance Audit Proof", icon: FileBadge, desc: "Control mapping for NIST, ISO, or SOC2.", color: "text-success" },
  { id: "vuln", name: "Vulnerability Assessment", icon: Search, desc: "Prioritized patch list and exploitability metrics.", color: "text-warn" },
  { id: "threat", name: "Threat Intelligence Brief", icon: Lock, desc: "Emerging APT actors, zero-days, and sector trends.", color: "text-critical" },
];

function ReportGeneratorPage() {
  const [selectedType, setSelectedType] = useState(REPORT_TYPES[0]);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setProgress(0);
    setIsDone(false);
  };

  useEffect(() => {
    if (generating && progress < 100) {
      const timer = setTimeout(() => {
        setProgress(p => Math.min(p + (Math.random() * 15 + 5), 100));
      }, 300);
      return () => clearTimeout(timer);
    } else if (progress >= 100 && generating) {
      setTimeout(() => {
        setGenerating(false);
        setIsDone(true);
      }, 500);
    }
  }, [generating, progress]);

  return (
    <AppShell>
      <div className="flex flex-col gap-6 h-full">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gradient">AI Report Generator</h1>
            <p className="text-muted-foreground mt-1 text-sm max-w-2xl">Instantly synthesize telemetry into stakeholder-ready PDFs and briefings using generative AI.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Panel>
              <PanelHeader title="1. Select Report Type" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                {REPORT_TYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => { setSelectedType(type); setIsDone(false); }}
                    className={`text-left p-4 rounded-xl border transition-all ${selectedType.id === type.id ? 'bg-white/10 border-primary/50' : 'glass border-transparent hover:border-white/10'}`}
                  >
                    <type.icon className={`h-6 w-6 mb-3 ${type.color}`} />
                    <div className="font-semibold text-sm">{type.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{type.desc}</div>
                  </button>
                ))}
              </div>
            </Panel>

            <Panel>
              <PanelHeader title="2. Configuration" />
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-2">Timeframe</label>
                  <select className="w-full h-10 px-3 rounded-lg bg-white/5 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 appearance-none">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>Quarter to Date (QTD)</option>
                    <option>Year to Date (YTD)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-2">Audience Persona</label>
                  <select className="w-full h-10 px-3 rounded-lg bg-white/5 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 appearance-none">
                    <option>C-Suite (Non-technical)</option>
                    <option>Board of Directors</option>
                    <option>Security Operations Center (Technical)</option>
                    <option>External Auditor</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-2">Include Sections</label>
                  <div className="space-y-2">
                    {["Executive Summary", "Financial Impact Analysis", "MITRE ATT&CK Heatmap", "Incident Timeline", "Remediation Status"].map((sec) => (
                      <label key={sec} className="flex items-center gap-3 text-sm cursor-pointer hover:bg-white/5 p-2 rounded transition">
                        <input type="checkbox" defaultChecked className="accent-primary" />
                        {sec}
                      </label>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={handleGenerate}
                  disabled={generating}
                  className="w-full h-12 rounded-lg bg-gradient-to-r from-primary to-neon text-primary-foreground font-semibold flex items-center justify-center gap-2 mt-4 disabled:opacity-50 transition shadow-[0_0_20px_oklch(0.72_0.19_275/0.4)]"
                >
                  {generating ? <RefreshCcw className="h-5 w-5 animate-spin" /> : <Bot className="h-5 w-5" />}
                  {generating ? "AI is Synthesizing Data..." : "Generate AI Report"}
                </button>
              </div>
            </Panel>
          </div>

          <Panel className="flex flex-col">
            <PanelHeader title="Preview & Output" />
            <div className="flex-1 bg-white/5 rounded-lg border border-border mt-4 flex flex-col items-center justify-center p-8 relative overflow-hidden text-center min-h-[500px]">
              
              {!generating && !isDone && (
                <div className="opacity-50">
                  <FileText className="h-16 w-16 mx-auto mb-4" />
                  <p>Configure options and click "Generate AI Report"</p>
                </div>
              )}

              {generating && (
                <div className="w-full max-w-sm space-y-6">
                  <Bot className="h-12 w-12 text-primary mx-auto animate-bounce" />
                  <h3 className="text-lg font-semibold text-gradient">Synthesizing {selectedType.name}...</h3>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-gradient-to-r from-primary to-cyan" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="text-sm text-muted-foreground animate-pulse">
                    {progress < 30 ? "Querying SIEM & EDR telemetry..." : progress < 60 ? "Drafting executive narrative..." : progress < 90 ? "Rendering charts and graphs..." : "Finalizing PDF layout..."}
                  </p>
                </div>
              )}

              <AnimatePresence>
                {isDone && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 w-full max-w-sm">
                    <div className="h-20 w-20 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_oklch(var(--success)/0.3)]">
                      <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-bold">Report Ready</h3>
                    <p className="text-sm text-muted-foreground">The AI has finished generating your customized {selectedType.name.toLowerCase()}.</p>
                    
                    <div className="glass p-4 rounded-xl text-left space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">File Name</span>
                        <span className="font-mono text-cyan">CS-Report-{new Date().toISOString().split('T')[0]}.pdf</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Size</span>
                        <span className="font-mono text-cyan">2.4 MB</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Pages</span>
                        <span className="font-mono text-cyan">14</span>
                      </div>
                    </div>

                    <button className="w-full h-12 rounded-lg bg-success text-success-foreground font-semibold flex items-center justify-center gap-2 hover:bg-success/90 transition shadow-[0_0_20px_oklch(var(--success)/0.4)]">
                      <Download className="h-5 w-5" /> Download PDF
                    </button>
                    <button className="w-full h-10 rounded-lg glass border border-border text-sm font-semibold hover:bg-white/10 transition">
                      View in Browser
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
