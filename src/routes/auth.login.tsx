import { createFileRoute, Link } from "@tanstack/react-router";
import { Fingerprint, Lock, Mail } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/auth/login")({
  head: () => ({ meta: [{ title: "Sign in — CyberShield AI" }] }),
  component: Login,
});

function Login() {
  const [role, setRole] = useState("SOC Manager");
  return (
    <div className="glass-strong rounded-2xl p-8 shadow-[0_30px_80px_-20px_oklch(0_0_0/0.7)]">
      <div className="text-xs uppercase tracking-[0.3em] text-cyan mb-2">Secure Access</div>
      <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
      <p className="text-sm text-muted-foreground mt-1">Sign in to your CyberShield tenant</p>

      <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
        <FieldIcon icon={Mail} label="Email" type="email" placeholder="you@company.com" />
        <FieldIcon icon={Lock} label="Password" type="password" placeholder="••••••••" />

        <div>
          <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Role</label>
          <div className="mt-1 grid grid-cols-3 gap-2">
            {["Security Analyst", "SOC Manager", "Administrator"].map((r) => (
              <button key={r} type="button" onClick={() => setRole(r)}
                className={`text-[11px] px-2 py-2 rounded-lg border transition ${
                  role === r ? "bg-gradient-to-r from-primary/25 to-cyan/15 border-primary/50 neon-border" : "glass border-border hover:bg-white/5"
                }`}>{r}</button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="accent-[oklch(0.72_0.19_275)]" />Remember for 30 days</label>
          <Link to="/auth/forgot" className="text-cyan hover:underline">Forgot password?</Link>
        </div>

        <button className="w-full h-11 rounded-lg bg-gradient-to-r from-primary to-neon text-primary-foreground font-semibold text-sm shadow-[0_0_25px_oklch(0.72_0.19_275/0.5)] hover:opacity-90">
          Sign in securely
        </button>

        <Link to="/" className="block text-center text-xs text-muted-foreground hover:text-foreground">← Continue as demo user</Link>

        <div className="flex items-center gap-2 my-2">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <button type="button" className="w-full h-10 rounded-lg glass border border-border text-sm font-medium flex items-center justify-center gap-2 hover:bg-white/10">
          <Fingerprint className="h-4 w-4 text-cyan" /> Continue with SSO / Passkey
        </button>

        <div className="text-center text-xs text-muted-foreground">
          New to CyberShield? <Link to="/auth/register" className="text-cyan hover:underline">Create an account</Link>
        </div>
      </form>
    </div>
  );
}

export function FieldIcon({ icon: Icon, label, type, placeholder }: { icon: typeof Mail; label: string; type: string; placeholder: string }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</label>
      <div className="relative mt-1">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input type={type} placeholder={placeholder}
          className="w-full h-11 pl-10 pr-3 rounded-lg glass border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/60" />
      </div>
    </div>
  );
}
