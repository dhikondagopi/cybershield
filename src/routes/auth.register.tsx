import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Lock, Mail, User } from "lucide-react";
import { FieldIcon } from "./auth.login";

export const Route = createFileRoute("/auth/register")({
  head: () => ({ meta: [{ title: "Create account — CyberShield AI" }] }),
  component: Register,
});

function Register() {
  return (
    <div className="glass-strong rounded-2xl p-8">
      <div className="text-xs uppercase tracking-[0.3em] text-cyan mb-2">Get Started</div>
      <h1 className="text-2xl font-bold tracking-tight">Create your CyberShield tenant</h1>
      <p className="text-sm text-muted-foreground mt-1">Free 14-day evaluation · no credit card</p>

      <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-2 gap-3">
          <FieldIcon icon={User} label="First name" type="text" placeholder="Sarah" />
          <FieldIcon icon={User} label="Last name" type="text" placeholder="Adeyemi" />
        </div>
        <FieldIcon icon={Mail} label="Work Email" type="email" placeholder="you@company.com" />
        <FieldIcon icon={Building2} label="Organization" type="text" placeholder="GridCorp Energy" />
        <FieldIcon icon={Lock} label="Password" type="password" placeholder="At least 12 characters" />

        <label className="flex items-start gap-2 text-xs text-muted-foreground">
          <input type="checkbox" className="mt-0.5 accent-[oklch(0.72_0.19_275)]" />
          I agree to the <a className="text-cyan hover:underline">Terms</a> and <a className="text-cyan hover:underline">Privacy Policy</a>, and consent to CNI data processing under NIS2.
        </label>

        <button className="w-full h-11 rounded-lg bg-gradient-to-r from-primary to-neon text-primary-foreground font-semibold text-sm shadow-[0_0_25px_oklch(0.72_0.19_275/0.5)]">
          Create secure tenant
        </button>

        <div className="text-center text-xs text-muted-foreground">
          Already have an account? <Link to="/auth/login" className="text-cyan hover:underline">Sign in</Link>
        </div>
      </form>
    </div>
  );
}
