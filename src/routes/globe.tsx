import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { useEffect, useState, useRef } from "react";
import Globe from "react-globe.gl";

export const Route = createFileRoute("/globe")({
  component: CyberGlobe,
});

function CyberGlobe() {
  const globeEl = useRef<any>();
  const [arcsData, setArcsData] = useState<any[]>([]);

  useEffect(() => {
    const N = 30;
    const arcs = [...Array(N).keys()].map(() => ({
      startLat: (Math.random() - 0.5) * 160,
      startLng: (Math.random() - 0.5) * 360,
      endLat: (Math.random() - 0.5) * 160,
      endLng: (Math.random() - 0.5) * 360,
      color: ['#ff3333', '#ff8800', '#00ffcc', '#0088ff'][Math.floor(Math.random() * 4)],
      name: `APT-${Math.floor(Math.random() * 50)}`,
      risk: Math.floor(Math.random() * 100)
    }));
    setArcsData(arcs);

    const interval = setInterval(() => {
      setArcsData(prev => {
        const newArcs = [...prev.slice(1)];
        newArcs.push({
          startLat: (Math.random() - 0.5) * 160,
          startLng: (Math.random() - 0.5) * 360,
          endLat: (Math.random() - 0.5) * 160,
          endLng: (Math.random() - 0.5) * 360,
          color: ['#ff3333', '#ff8800', '#00ffcc', '#0088ff'][Math.floor(Math.random() * 4)],
          name: `APT-${Math.floor(Math.random() * 50)}`,
          risk: Math.floor(Math.random() * 100)
        });
        return newArcs;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 1.5;
      globeEl.current.pointOfView({ altitude: 2 });
    }
  }, []);

  return (
    <AppShell>
      <div className="flex flex-col h-full gap-4 relative">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-gradient">Interactive Cyber Attack Globe</h1>
          <p className="text-muted-foreground mt-1 text-sm">Real-time visualization of global cyber threats and origins.</p>
        </header>
        
        <div className="flex-1 min-h-[600px] rounded-xl overflow-hidden glass border border-border relative">
          <Globe
            ref={globeEl}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
            arcsData={arcsData}
            arcColor="color"
            arcDashLength={0.4}
            arcDashGap={4}
            arcDashInitialGap={() => Math.random() * 5}
            arcDashAnimateTime={2000}
            backgroundColor="#00000000"
            arcLabel={(d: any) => `Actor: ${d.name} <br/> Risk: ${d.risk}`}
          />
          <div className="absolute top-4 left-4 w-80 pointer-events-none">
             <Panel className="bg-black/60 backdrop-blur-md border border-white/10 shadow-2xl pointer-events-auto">
                <PanelHeader title="Live Global Telemetry" subtitle="Tracking active campaigns" right={<span className="h-2 w-2 rounded-full bg-critical animate-pulse-ring" />} />
                <div className="p-4 text-sm space-y-4">
                   <div className="flex justify-between items-center border-b border-white/5 pb-2">
                     <span className="text-muted-foreground">Attack Origin</span>
                     <span className="text-critical font-mono">185.12.x.x (RU)</span>
                   </div>
                   <div className="flex justify-between items-center border-b border-white/5 pb-2">
                     <span className="text-muted-foreground">Target Country</span>
                     <span className="text-cyan font-mono">srv-app-04 (US)</span>
                   </div>
                   <div className="flex justify-between items-center border-b border-white/5 pb-2">
                     <span className="text-muted-foreground">Threat Actor</span>
                     <span className="text-warn font-semibold">APT-29</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-muted-foreground">Risk Score</span>
                     <span className="text-critical font-bold text-lg">92</span>
                   </div>
                </div>
             </Panel>
             <Panel className="bg-black/60 backdrop-blur-md border border-white/10 shadow-2xl mt-4 pointer-events-auto">
               <PanelHeader title="Global Stats" />
               <div className="p-4 grid grid-cols-2 gap-4 text-center">
                 <div>
                   <div className="text-2xl font-bold text-primary">12K</div>
                   <div className="text-[10px] text-muted-foreground uppercase mt-1">Attacks / Hour</div>
                 </div>
                 <div>
                   <div className="text-2xl font-bold text-warn">45</div>
                   <div className="text-[10px] text-muted-foreground uppercase mt-1">Targeted Countries</div>
                 </div>
               </div>
             </Panel>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
