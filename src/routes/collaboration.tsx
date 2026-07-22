import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { Users, MessageSquare, CheckSquare, Search, Send, FileText, CheckCircle2, ShieldCheck, Clock, Check, X, Bell } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/collaboration")({
  component: LiveCollaborationPage,
});

const CHAT_MESSAGES = [
  { id: 1, sender: "SOC Alert Bot", text: "🚨 Multiple failed logins detected for user 'svc-db-admin'.", time: "10:14 AM", isBot: true },
  { id: 2, sender: "Alex R. (L1)", text: "I'm looking into this now. IPs are coming from known Tor exit nodes.", time: "10:15 AM", isBot: false },
  { id: 3, sender: "Sarah J. (L2)", text: "Lock the account immediately. I'll check the DB audit logs for any successful connections.", time: "10:16 AM", isBot: false },
  { id: 4, sender: "Alex R. (L1)", text: "Account locked. Requesting approval to block the IPs at the edge.", time: "10:17 AM", isBot: false },
  { id: 5, sender: "SOC Alert Bot", text: "✅ Action approved by Sarah J. Edge firewall updated.", time: "10:20 AM", isBot: true },
];

const BOARD_TASKS = [
  { id: "TSK-401", title: "Investigate svc-db-admin anomalous auth", assignee: "Alex R.", status: "In Progress", priority: "High" },
  { id: "TSK-402", title: "Review DB Audit Logs for Q3", assignee: "Sarah J.", status: "To Do", priority: "Medium" },
  { id: "TSK-403", title: "Update playbook for Tor node blocking", assignee: "Unassigned", status: "To Do", priority: "Low" },
  { id: "TSK-399", title: "Patch CVE-2024-XXXX on Edge Routers", assignee: "Network Team", status: "Done", priority: "Critical" },
];

const APPROVALS = [
  { id: "APP-91", requestor: "Alex R.", action: "Block 45 IPs at Edge Firewall", incident: "INC-1099", status: "Pending", time: "10m ago" },
  { id: "APP-92", requestor: "Automated SOAR", action: "Isolate WKS-HR-04 (Ransomware behavior)", incident: "INC-1100", status: "Pending", time: "2m ago" },
];

function LiveCollaborationPage() {
  const [msgInput, setMsgInput] = useState("");
  const [chat, setChat] = useState(CHAT_MESSAGES);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgInput.trim()) return;
    setChat([...chat, { id: Date.now(), sender: "You", text: msgInput, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), isBot: false }]);
    setMsgInput("");
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6 h-[calc(100vh-5.5rem)] lg:h-[calc(100vh-7rem)]">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gradient">Live SOC Collaboration</h1>
            <p className="text-muted-foreground mt-1 text-sm max-w-2xl">Real-time analyst chat, shift task boards, and SOAR approval workflows.</p>
          </div>
          <div className="flex gap-2">
            <button className="h-10 px-4 rounded-lg bg-gradient-to-r from-primary to-neon text-primary-foreground font-semibold flex items-center gap-2 hover:opacity-90 transition">
              <Users className="h-4 w-4" /> Shift Handover
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 flex-1 min-h-0">
          <div className="grid grid-rows-2 gap-6 min-h-0">
            {/* Task Board */}
            <Panel className="flex flex-col min-h-0">
              <PanelHeader title="Shift Task Board" subtitle="Active investigations and duties" right={
                <button className="text-xs bg-white/10 px-2 py-1 rounded hover:bg-white/20 transition">+ New Task</button>
              } />
              <div className="flex-1 p-4 grid grid-cols-3 gap-4 overflow-x-auto min-h-0">
                {["To Do", "In Progress", "Done"].map(status => (
                  <div key={status} className="bg-black/20 rounded-xl p-3 flex flex-col gap-3 min-w-[250px] min-h-0 overflow-y-auto custom-scrollbar">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">{status} <span className="float-right text-xs bg-white/10 px-1.5 rounded">{BOARD_TASKS.filter(t => t.status === status).length}</span></h3>
                    {BOARD_TASKS.filter(t => t.status === status).map(task => (
                      <div key={task.id} className="glass p-3 rounded-lg cursor-grab hover:border-primary/40 border border-transparent transition shrink-0">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-mono text-cyan">{task.id}</span>
                          <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${task.priority === 'Critical' ? 'bg-critical/20 text-critical' : task.priority === 'High' ? 'bg-warn/20 text-warn' : 'bg-white/10 text-muted-foreground'}`}>{task.priority}</span>
                        </div>
                        <p className="text-sm font-medium mb-3">{task.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="h-5 w-5 rounded-full bg-primary/20 text-primary grid place-items-center font-bold text-[9px]">{task.assignee.charAt(0)}</div>
                          {task.assignee}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </Panel>

            {/* Chat */}
            <Panel className="flex flex-col min-h-0">
              <PanelHeader title="Incident War Room: INC-1099" subtitle="5 active participants" />
              <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
                {chat.map(msg => (
                  <div key={msg.id} className={`flex gap-3 ${msg.sender === 'You' ? 'flex-row-reverse' : ''}`}>
                    <div className={`h-8 w-8 rounded-full grid place-items-center shrink-0 ${msg.isBot ? 'bg-critical/20 text-critical' : msg.sender === 'You' ? 'bg-primary/20 text-primary' : 'bg-white/10 text-muted-foreground'}`}>
                      {msg.isBot ? <Bell className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                    </div>
                    <div className={`max-w-[75%] ${msg.sender === 'You' ? 'text-right' : ''}`}>
                      <div className="flex items-baseline gap-2 mb-1 justify-start">
                        <span className="text-xs font-semibold">{msg.sender}</span>
                        <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                      </div>
                      <div className={`p-3 rounded-xl text-sm ${msg.sender === 'You' ? 'bg-primary text-primary-foreground rounded-tr-sm' : msg.isBot ? 'bg-critical/10 border border-critical/30 rounded-tl-sm' : 'bg-white/5 border border-white/10 rounded-tl-sm'}`}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSend} className="p-3 border-t border-border flex gap-2">
                <input
                  type="text"
                  value={msgInput}
                  onChange={(e) => setMsgInput(e.target.value)}
                  placeholder="Type a message or use /cmd to trigger SOAR..."
                  className="flex-1 h-10 px-3 rounded-lg bg-white/5 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
                />
                <button type="submit" className="h-10 w-10 rounded-lg bg-primary text-primary-foreground grid place-items-center hover:opacity-90 transition">
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </Panel>
          </div>

          <aside className="space-y-6">
            <Panel className="flex flex-col min-h-0">
              <PanelHeader title="Pending Approvals" subtitle="Require L2+ sign-off" />
              <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                {APPROVALS.map(app => (
                  <div key={app.id} className="glass p-3 rounded-xl border-l-2 border-warn">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-mono text-cyan">{app.incident}</span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {app.time}</span>
                    </div>
                    <div className="text-sm font-semibold mb-1">{app.action}</div>
                    <div className="text-xs text-muted-foreground mb-3">Requested by: {app.requestor}</div>
                    <div className="flex gap-2">
                      <button className="flex-1 py-1.5 rounded bg-success/20 hover:bg-success/30 text-success text-xs font-bold flex items-center justify-center gap-1 transition">
                        <Check className="h-3 w-3" /> Approve
                      </button>
                      <button className="flex-1 py-1.5 rounded bg-white/5 hover:bg-white/10 text-muted-foreground text-xs font-bold flex items-center justify-center gap-1 transition">
                        <X className="h-3 w-3" /> Deny
                      </button>
                    </div>
                  </div>
                ))}
                {APPROVALS.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm py-4">No pending approvals.</div>
                )}
              </div>
            </Panel>
            
            <Panel>
              <PanelHeader title="Online Analysts" />
              <div className="p-3 space-y-3">
                {["Sarah J. (L2)", "Alex R. (L1)", "Mike T. (L3)", "SOC Alert Bot"].map((user, i) => (
                  <div key={user} className="flex items-center gap-3">
                    <div className="relative">
                      <div className={`h-8 w-8 rounded-full grid place-items-center text-xs font-bold ${i === 3 ? 'bg-critical/20 text-critical' : 'bg-primary/20 text-primary'}`}>
                        {user.charAt(0)}
                      </div>
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success border-2 border-background" />
                    </div>
                    <div className="text-sm font-medium">{user}</div>
                  </div>
                ))}
              </div>
            </Panel>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
