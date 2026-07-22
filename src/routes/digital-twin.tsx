import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, PanelHeader, SevBadge } from "@/components/ui/panel";
import { Network, Server, Monitor, HardDrive, Filter, Activity, Zap, Shield, Search, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/digital-twin")({
  component: DigitalTwinPage,
});

type Node = { id: string; type: "server" | "endpoint" | "iot" | "gateway"; name: string; ip: string; status: "healthy" | "warning" | "critical"; os: string };

const NODES: Node[] = [
  { id: "fw-01", type: "gateway", name: "Edge Firewall", ip: "192.168.1.1", status: "healthy", os: "Palo Alto PAN-OS" },
  { id: "dc-01", type: "server", name: "Domain Controller", ip: "10.0.1.10", status: "warning", os: "Windows Server 2022" },
  { id: "srv-db", type: "server", name: "Prod Database", ip: "10.0.1.50", status: "critical", os: "Ubuntu 22.04" },
  { id: "srv-app", type: "server", name: "App Server", ip: "10.0.1.51", status: "healthy", os: "Ubuntu 22.04" },
  { id: "wks-01", type: "endpoint", name: "Dev Workstation", ip: "10.0.2.100", status: "warning", os: "Windows 11" },
  { id: "wks-02", type: "endpoint", name: "HR Laptop", ip: "10.0.2.101", status: "healthy", os: "macOS Sonoma" },
  { id: "iot-cam", type: "iot", name: "Lobby Camera", ip: "10.0.3.50", status: "critical", os: "Embedded Linux" },
];

const EDGES = [
  { from: "fw-01", to: "dc-01" },
  { from: "fw-01", to: "srv-app" },
  { from: "dc-01", to: "srv-db" },
  { from: "srv-app", to: "srv-db" },
  { from: "dc-01", to: "wks-01" },
  { from: "dc-01", to: "wks-02" },
  { from: "fw-01", to: "iot-cam" },
];

function DigitalTwinPage() {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [filter, setFilter] = useState("all");

  return (
    <AppShell>
      <div className="flex flex-col gap-6 h-[calc(100vh-5.5rem)] lg:h-[calc(100vh-7rem)]">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gradient">Digital Twin Network</h1>
            <p className="text-muted-foreground mt-1 text-sm max-w-2xl">Interactive simulation of enterprise architecture for lateral movement analysis.</p>
          </div>
          <div className="flex gap-2">
             <button className="h-10 px-4 rounded-lg bg-gradient-to-r from-primary to-neon text-primary-foreground font-semibold flex items-center gap-2 hover:opacity-90 transition">
               <Zap className="h-4 w-4" /> Simulate Attack Path
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6 flex-1 min-h-0">
          <Panel className="flex flex-col overflow-hidden relative">
            <PanelHeader title="Topology View" />
            <div className="flex gap-2 p-2 px-4 border-b border-border/50 bg-black/20">
               <button onClick={() => setFilter('all')} className={`text-xs px-3 py-1 rounded-md transition ${filter === 'all' ? 'bg-primary/20 text-primary' : 'hover:bg-white/5 text-muted-foreground'}`}>All Assets</button>
               <button onClick={() => setFilter('server')} className={`text-xs px-3 py-1 rounded-md transition ${filter === 'server' ? 'bg-primary/20 text-primary' : 'hover:bg-white/5 text-muted-foreground'}`}>Servers</button>
               <button onClick={() => setFilter('critical')} className={`text-xs px-3 py-1 rounded-md transition ${filter === 'critical' ? 'bg-critical/20 text-critical' : 'hover:bg-white/5 text-muted-foreground'}`}>Critical</button>
            </div>
            
            <div className="flex-1 relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background min-h-0">
               {/* Grid Background */}
               <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

               {/* Mock SVG Graph rendering */}
               <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8">
                  <div className="relative w-full h-full">
                     {/* Static positioning for demonstration purposes */}
                     <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
                        <defs>
                          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="oklch(var(--primary))" stopOpacity="0.1" />
                            <stop offset="50%" stopColor="oklch(var(--primary))" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="oklch(var(--primary))" stopOpacity="0.1" />
                          </linearGradient>
                        </defs>
                        {/* Static drawn lines connecting hardcoded percentage positions */}
                        <path d="M 50% 10% L 30% 40%" stroke="url(#lineGrad)" strokeWidth="2" fill="none" className="animate-pulse" />
                        <path d="M 50% 10% L 70% 40%" stroke="url(#lineGrad)" strokeWidth="2" fill="none" />
                        <path d="M 30% 40% L 50% 70%" stroke="url(#lineGrad)" strokeWidth="2" fill="none" />
                        <path d="M 70% 40% L 50% 70%" stroke="url(#lineGrad)" strokeWidth="2" fill="none" className="animate-pulse" />
                        <path d="M 30% 40% L 10% 80%" stroke="url(#lineGrad)" strokeWidth="2" fill="none" />
                        <path d="M 30% 40% L 30% 80%" stroke="url(#lineGrad)" strokeWidth="2" fill="none" />
                        <path d="M 50% 10% L 90% 40%" stroke="url(#lineGrad)" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                        
                        {/* Attack path animation overlay */}
                        <circle cx="0" cy="0" r="3" fill="oklch(var(--critical))" filter="blur(1px)">
                          <animateMotion path="M 50% 10% L 70% 40% L 50% 70%" dur="3s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="0" cy="0" r="3" fill="oklch(var(--warn))" filter="blur(1px)">
                          <animateMotion path="M 50% 10% L 90% 40%" dur="4s" repeatCount="indefinite" />
                        </circle>
                     </svg>
                     
                     {/* Nodes */}
                     {NODES.map((node, i) => {
                       const pos = [
                         { top: "10%", left: "50%" }, // fw-01
                         { top: "40%", left: "30%" }, // dc-01
                         { top: "70%", left: "50%" }, // srv-db
                         { top: "40%", left: "70%" }, // srv-app
                         { top: "80%", left: "10%" }, // wks-01
                         { top: "80%", left: "30%" }, // wks-02
                         { top: "40%", left: "90%" }, // iot-cam
                       ][i];
                       const isMatch = filter === "all" || (filter === "server" && node.type === "server") || (filter === "critical" && node.status === "critical");
                       
                       return (
                         <NodeBtn 
                           key={node.id} 
                           node={node} 
                           top={pos.top} 
                           left={pos.left} 
                           selected={selectedNode?.id === node.id} 
                           onClick={() => setSelectedNode(node)} 
                           faded={!isMatch} 
                         />
                       );
                     })}
                  </div>
               </div>
            </div>
          </Panel>

          <Panel className="flex flex-col">
            <PanelHeader title="Asset Inspector" />
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <AnimatePresence mode="wait">
                {selectedNode ? (
                  <motion.div
                    key={selectedNode.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`h-16 w-16 rounded-xl grid place-items-center bg-${selectedNode.status === 'healthy' ? 'success' : selectedNode.status === 'critical' ? 'critical' : 'warn'}/10 border border-${selectedNode.status === 'healthy' ? 'success' : selectedNode.status === 'critical' ? 'critical' : 'warn'}/30`}>
                        {selectedNode.type === 'server' ? <Server className="h-8 w-8 text-foreground" /> : selectedNode.type === 'endpoint' ? <Monitor className="h-8 w-8 text-foreground" /> : selectedNode.type === 'gateway' ? <Shield className="h-8 w-8 text-foreground" /> : <HardDrive className="h-8 w-8 text-foreground" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold truncate">{selectedNode.name}</h3>
                        <div className="text-sm font-mono text-cyan mt-1">{selectedNode.ip}</div>
                        <div className="mt-2"><SevBadge sev={selectedNode.status === 'healthy' ? 'Low' : selectedNode.status === 'critical' ? 'Critical' : 'High'} /></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="glass p-3 rounded-lg">
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Type</div>
                        <div className="text-sm font-medium mt-1 capitalize">{selectedNode.type}</div>
                      </div>
                      <div className="glass p-3 rounded-lg">
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">OS</div>
                        <div className="text-sm font-medium mt-1 truncate">{selectedNode.os}</div>
                      </div>
                    </div>

                    <div>
                       <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><Activity className="h-4 w-4 text-cyan" /> Telemetry</h4>
                       <div className="space-y-2">
                         <div className="flex justify-between text-xs">
                           <span className="text-muted-foreground">CPU Usage</span>
                           <span className="font-mono">{Math.floor(Math.random()*60 + 20)}%</span>
                         </div>
                         <div className="flex justify-between text-xs">
                           <span className="text-muted-foreground">Memory</span>
                           <span className="font-mono">{Math.floor(Math.random()*80 + 10)}%</span>
                         </div>
                         <div className="flex justify-between text-xs">
                           <span className="text-muted-foreground">Active Connections</span>
                           <span className="font-mono">{Math.floor(Math.random()*1200 + 10)}</span>
                         </div>
                       </div>
                    </div>

                    {selectedNode.status !== 'healthy' && (
                      <div className={`p-4 rounded-xl border ${selectedNode.status === 'critical' ? 'bg-critical/10 border-critical/30 text-critical' : 'bg-warn/10 border-warn/30 text-warn'}`}>
                        <h4 className="font-bold flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Active Threats</h4>
                        <ul className="mt-2 space-y-2 text-sm list-disc pl-4 text-foreground/80">
                          {selectedNode.status === 'critical' ? (
                            <>
                              <li>Detected Cobalt Strike Beacon (PID 4892)</li>
                              <li>Lateral movement attempt to Domain Controller</li>
                            </>
                          ) : (
                            <li>Unusual outbound traffic volume</li>
                          )}
                        </ul>
                        <button className={`mt-4 w-full h-10 rounded-lg text-xs font-bold uppercase tracking-wider transition ${selectedNode.status === 'critical' ? 'bg-critical text-critical-foreground hover:bg-critical/90' : 'bg-warn text-warn-foreground hover:bg-warn/90'}`}>
                          Isolate Asset
                        </button>
                      </div>
                    )}

                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                    <Network className="h-16 w-16 mb-4" />
                    <p>Select a node to inspect its twin.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}

function NodeBtn({ node, top, left, selected, faded, onClick }: { node: Node; top: string; left: string; selected: boolean; faded?: boolean; onClick: () => void }) {
  const Icon = node.type === 'server' ? Server : node.type === 'endpoint' ? Monitor : node.type === 'gateway' ? Shield : HardDrive;
  const colorClass = node.status === 'healthy' ? 'text-success' : node.status === 'critical' ? 'text-critical' : 'text-warn';
  const glowClass = node.status === 'healthy' ? 'shadow-success/20' : node.status === 'critical' ? 'shadow-critical/40' : 'shadow-warn/30';
  
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-20 transition-opacity duration-300 ${faded ? 'opacity-30 grayscale hover:opacity-100 hover:grayscale-0' : 'opacity-100'}`}
      style={{ top, left }}
    >
      <div className={`h-12 w-12 rounded-full grid place-items-center glass transition-all duration-300 ${selected ? `border-2 border-primary bg-primary/20 scale-110 shadow-[0_0_20px_oklch(var(--primary)/0.5)]` : `border-border/50 hover:border-white/30 shadow-lg ${glowClass}`}`}>
         <Icon className={`h-5 w-5 ${colorClass}`} />
         {node.status === 'critical' && <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-critical animate-ping" />}
         {node.status === 'critical' && <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-critical" />}
      </div>
      <div className={`mt-2 px-2 py-0.5 rounded text-[10px] font-medium whitespace-nowrap backdrop-blur-md transition-all ${selected ? 'bg-primary text-primary-foreground' : 'bg-black/50 text-muted-foreground group-hover:text-foreground'}`}>
        {node.name}
      </div>
    </motion.button>
  );
}
