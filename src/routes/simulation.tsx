import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Square, FastForward, RotateCcw, Bug, Server, User, Key, ArrowRight, ShieldAlert, Cpu, FileLock, Network, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/simulation")({
  component: AttackSimulationPage,
});

type SimStage = { id: string; label: string; desc: string; icon: any; color: string; duration: number };
type SimScenario = { id: string; name: string; icon: any; stages: SimStage[] };

const SCENARIOS: SimScenario[] = [
  {
    id: "apt",
    name: "Advanced Persistent Threat (APT)",
    icon: Bug,
    stages: [
      { id: "recon", label: "Reconnaissance", desc: "Attacker enumerates public-facing assets and employee LinkedIn profiles.", icon: Network, color: "text-cyan", duration: 2000 },
      { id: "phish", label: "Spear Phishing", desc: "Highly targeted email sent to HR manager with malicious PDF attached.", icon: User, color: "text-warn", duration: 3000 },
      { id: "exploit", label: "Exploitation", desc: "PDF triggers zero-day vulnerability (CVE-2024-XXXX) bypassing EDR.", icon: ShieldAlert, color: "text-critical", duration: 2500 },
      { id: "c2", label: "C2 Beacon", desc: "Malware establishes reverse shell to attacker infrastructure over HTTPS.", icon: Network, color: "text-orange-400", duration: 2000 },
      { id: "privesc", label: "Privilege Escalation", desc: "Attacker exploits local misconfiguration to gain SYSTEM privileges.", icon: Key, color: "text-critical", duration: 3000 },
      { id: "lateral", label: "Lateral Movement", desc: "Attacker moves to Domain Controller using harvested credentials.", icon: Server, color: "text-primary", duration: 2500 },
    ]
  },
  {
    id: "ransomware",
    name: "Ransomware (LockBit)",
    icon: FileLock,
    stages: [
      { id: "initial", label: "Initial Access", desc: "Compromised RDP credentials bought from initial access broker.", icon: Key, color: "text-warn", duration: 2000 },
      { id: "disable", label: "Disable Defenses", desc: "Script executed to disable local antivirus and delete shadow copies.", icon: ShieldAlert, color: "text-critical", duration: 3000 },
      { id: "exfil", label: "Data Exfiltration", desc: "150GB of sensitive IP uploaded to MEGA cloud storage.", icon: ArrowRight, color: "text-orange-400", duration: 3500 },
      { id: "encrypt", label: "Encryption", desc: "High-speed multi-threaded encryption locks thousands of files.", icon: FileLock, color: "text-critical", duration: 4000 },
      { id: "note", label: "Ransom Note", desc: "Desktop wallpaper changed, text file dropped demanding 50 BTC.", icon: AlertTriangle, color: "text-neon", duration: 2000 },
    ]
  },
  {
    id: "insider",
    name: "Insider Threat",
    icon: User,
    stages: [
      { id: "auth", label: "Valid Access", desc: "Disgruntled employee authenticates normally via VPN.", icon: Key, color: "text-success", duration: 2000 },
      { id: "hoard", label: "Data Hoarding", desc: "Employee downloads customer databases far beyond normal baseline.", icon: Database, color: "text-warn", duration: 3500 },
      { id: "usb", label: "USB Transfer", desc: "DLP detects transfer of encrypted zip file to unauthorized USB drive.", icon: Cpu, color: "text-critical", duration: 3000 },
    ]
  }
];

function Database(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>; }

function AttackSimulationPage() {
  const [activeScenario, setActiveScenario] = useState<SimScenario>(SCENARIOS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStageIdx, setCurrentStageIdx] = useState(-1);

  useEffect(() => {
    let timer: any;
    if (isPlaying && currentStageIdx < activeScenario.stages.length - 1) {
      const nextIdx = currentStageIdx + 1;
      const stage = activeScenario.stages[nextIdx];
      timer = setTimeout(() => {
        setCurrentStageIdx(nextIdx);
      }, currentStageIdx === -1 ? 500 : activeScenario.stages[currentStageIdx].duration);
    } else if (isPlaying && currentStageIdx >= activeScenario.stages.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStageIdx, activeScenario]);

  const handlePlay = () => {
    if (currentStageIdx >= activeScenario.stages.length - 1) setCurrentStageIdx(-1);
    setIsPlaying(true);
  };
  const handleStop = () => setIsPlaying(false);
  const handleReset = () => { setIsPlaying(false); setCurrentStageIdx(-1); };

  return (
    <AppShell>
      <div className="flex flex-col gap-6 h-full">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gradient">Attack Simulation Lab</h1>
            <p className="text-muted-foreground mt-1 text-sm max-w-2xl">Animated simulations of cyber attack vectors and kill chains.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">
          <Panel>
            <PanelHeader title="Scenarios" />
            <div className="p-2 space-y-2">
              {SCENARIOS.map(sc => (
                <button
                  key={sc.id}
                  onClick={() => { setActiveScenario(sc); handleReset(); }}
                  className={`w-full text-left p-3 rounded-lg border transition flex items-center gap-3 ${activeScenario.id === sc.id ? 'bg-primary/10 border-primary/40 text-primary' : 'glass border-transparent hover:border-white/10 text-muted-foreground hover:text-foreground'}`}
                >
                  <sc.icon className="h-5 w-5 shrink-0" />
                  <span className="text-sm font-medium">{sc.name}</span>
                </button>
              ))}
            </div>
          </Panel>

          <Panel className="relative overflow-hidden min-h-[600px] flex flex-col">
            <PanelHeader 
              title={activeScenario.name} 
              subtitle={`${activeScenario.stages.length} Stages`}
              right={
                <div className="flex items-center gap-2">
                  <button onClick={handleReset} className="h-8 w-8 grid place-items-center rounded bg-white/5 hover:bg-white/10"><RotateCcw className="h-4 w-4 text-muted-foreground" /></button>
                  {isPlaying ? (
                    <button onClick={handleStop} className="h-8 w-8 grid place-items-center rounded bg-warn/20 hover:bg-warn/30"><Square className="h-4 w-4 text-warn" fill="currentColor" /></button>
                  ) : (
                    <button onClick={handlePlay} className="h-8 px-3 flex items-center gap-1 rounded bg-success/20 hover:bg-success/30 text-success text-xs font-bold"><Play className="h-4 w-4" fill="currentColor" /> START</button>
                  )}
                </div>
              }
            />
            
            <div className="flex-1 p-8 relative flex items-center justify-center">
              {/* Background Network map visualization */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, oklch(var(--primary)) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
              
              <div className="w-full max-w-4xl relative z-10">
                <div className="flex flex-col space-y-6">
                  {activeScenario.stages.map((stage, idx) => {
                    const isActive = idx === currentStageIdx;
                    const isPast = idx < currentStageIdx;
                    const isFuture = idx > currentStageIdx;

                    return (
                      <div key={stage.id} className="relative">
                        {/* Connecting line */}
                        {idx !== activeScenario.stages.length - 1 && (
                          <div className={`absolute left-6 top-12 bottom-[-24px] w-0.5 ${isPast ? 'bg-primary' : 'bg-white/10'}`}>
                            {isActive && <motion.div initial={{ height: 0 }} animate={{ height: '100%' }} transition={{ duration: stage.duration / 1000, ease: 'linear' }} className="w-full bg-primary shadow-[0_0_10px_oklch(var(--primary))]" />}
                          </div>
                        )}
                        
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: isFuture ? 0.3 : 1, x: 0 }}
                          className={`flex items-start gap-6 p-4 rounded-xl border transition-all ${isActive ? 'bg-primary/5 border-primary/40 scale-105 shadow-[0_0_30px_oklch(var(--primary)/0.15)] z-10 relative' : isPast ? 'bg-white/5 border-white/10' : 'border-transparent'}`}
                        >
                          <div className={`h-12 w-12 shrink-0 rounded-full grid place-items-center relative ${isActive ? 'bg-primary/20 text-primary' : isPast ? 'bg-white/10 text-muted-foreground' : 'bg-white/5 text-muted-foreground/30'}`}>
                            <stage.icon className={`h-5 w-5 ${isActive ? stage.color : ''}`} />
                            {isActive && <span className="absolute inset-0 rounded-full border border-primary animate-ping" />}
                          </div>
                          
                          <div className="flex-1">
                            <h3 className={`text-lg font-bold ${isActive ? stage.color : isPast ? 'text-foreground' : 'text-muted-foreground/50'}`}>{stage.label}</h3>
                            <AnimatePresence>
                              {(isActive || isPast) && (
                                <motion.p 
                                  initial={{ opacity: 0, height: 0 }} 
                                  animate={{ opacity: 1, height: 'auto' }} 
                                  className="text-muted-foreground text-sm mt-2"
                                >
                                  {stage.desc}
                                </motion.p>
                              )}
                            </AnimatePresence>
                            
                            {isActive && (
                              <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: stage.duration / 1000, ease: 'linear' }} className="h-1 mt-4 bg-gradient-to-r from-transparent via-primary to-transparent" />
                            )}
                          </div>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
