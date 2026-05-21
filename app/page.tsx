"use client";

import { useState } from "react";
import LiveChat from "@/components/LiveChat";
import FirewallPanel from "@/components/FirewallPanel";
import AuditPanel from "@/components/AuditPanel";
import type { ChatResponse } from "@/lib/types";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface AuditEntry {
  time: string;
  label: string;
  decision: string;
  issueUrl?: string;
}

function extractIssueUrl(message?: string): string | undefined {
  if (!message) return undefined;
  const match = message.match(/https?:\/\/github\.com\/[^\s]+/);
  return match?.[0];
}

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm Air Canada's support agent. I can help you with flight issues, refund requests, and compensation claims. How can I help you today?",
    },
  ]);
  const [lastDecision, setLastDecision] = useState<ChatResponse | null>(null);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage(content: string) {
    if (!content.trim() || loading) return;

    const history: Message[] = [...messages, { role: "user", content }];
    setMessages(history);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = (await res.json()) as ChatResponse;

      setMessages([...history, { role: "assistant", content: data.agentText }]);
      setLastDecision(data);

      if (data.firewallDecision) {
        const time = new Date().toTimeString().slice(0, 8);
        setAuditLog((prev) =>
          [
            {
              time,
              label: content.slice(0, 20),
              decision: data.firewallDecision!.decision,
              issueUrl: extractIssueUrl(data.gatewayResult?.output?.message),
            },
            ...prev,
          ].slice(0, 10),
        );
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen bg-[#0f172a] text-[#f1f5f9] overflow-hidden">
      <div className="flex w-full">
        <div className="w-[60%] border-r border-slate-700/60 min-w-0">
          <LiveChat messages={messages} onSend={sendMessage} loading={loading} />
        </div>
        <div className="w-[20%] border-r border-slate-700/60 min-w-0">
          <FirewallPanel decision={lastDecision} />
        </div>
        <div className="w-[20%] min-w-0">
          <AuditPanel entries={auditLog} />
        </div>
      </div>
    </div>
  );
}
