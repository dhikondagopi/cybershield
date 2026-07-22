import type { HTMLAttributes, ReactNode } from "react";

export function Panel({ className = "", children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={`glass rounded-2xl p-5 relative overflow-hidden min-w-0 ${className}`}
    >
      {children}
    </div>
  );
}

export function PanelHeader({
  title, subtitle, right,
}: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div className="min-w-0">
        <h3 className="font-semibold tracking-tight">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

export function SevBadge({ sev }: { sev: string }) {
  const map: Record<string, string> = {
    Critical: "bg-critical/20 text-critical border-critical/30",
    High: "bg-orange-500/15 text-orange-300 border-orange-400/30",
    Medium: "bg-warn/15 text-warn border-warn/30",
    Low: "bg-success/15 text-success border-success/30",
    Open: "bg-primary/20 text-primary border-primary/30",
    Investigating: "bg-cyan/15 text-cyan border-cyan/30",
    Contained: "bg-success/15 text-success border-success/30",
    Healthy: "bg-success/15 text-success border-success/30",
    Warning: "bg-warn/15 text-warn border-warn/30",
    "At Risk": "bg-orange-500/15 text-orange-300 border-orange-400/30",
  };
  const cls = map[sev] ?? "bg-white/10 text-foreground border-border";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-bold border ${cls}`}>
      {sev}
    </span>
  );
}
