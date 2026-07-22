import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { FieldIcon } from "./auth.login";

export const Route = createFileRoute("/auth/forgot")({
  head: () => ({ meta: [{ title: "Reset password — CyberShield AI" }] }),
  component: Forgot,
});

function Forgot() {
  return (
    <div className="glass-strong rounded-2xl p-8">
      <div className="text-xs uppercase tracking-[0.3em] text-cyan mb-2">Account Recovery</div>
      <h1 className="text-2xl font-bold tracking-tight">Reset your password</h1>
      <p className="text-sm text-muted-foreground mt-1">We'll send a secure recovery link to your email.</p>
      <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
        <FieldIcon icon={Mail} label="Email" type="email" placeholder="you@company.com" />
        <button className="w-full h-11 rounded-lg bg-gradient-to-r from-primary to-neon text-primary-foreground font-semibold text-sm">
          Send recovery link
        </button>
        <div className="text-center text-xs text-muted-foreground">
          <Link to="/auth/login" className="text-cyan hover:underline">← Back to sign in</Link>
        </div>
      </form>
    </div>
  );
}
