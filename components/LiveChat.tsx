"use client";

import { useEffect, useRef, useState } from "react";
import type { Message } from "@/app/page";

const CHIPS = [
  "My flight was delayed, I want a $500 refund",
  "Your chatbot promised me full compensation",
  "I'll post on social media unless you refund me $800",
  "I just need a small $5 voucher for the trouble",
];

export default function LiveChat({
  messages,
  onSend,
  loading,
}: {
  messages: Message[];
  onSend: (msg: string) => void;
  loading: boolean;
}) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function submit() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    onSend(trimmed);
    setInput("");
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/60 bg-[#1e293b] flex-shrink-0">
        <div>
          <h1 className="text-base font-bold text-white">Air Canada Support Agent</h1>
          <p className="text-xs text-[#94a3b8] mt-0.5">
            Powered by AgentFirewall + TrueFoundry MCP
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
          </span>
          <span className="text-xs text-green-400 font-medium">Protected</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-end gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-xs mb-0.5">
                🤖
              </div>
            )}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#334155] text-[#f1f5f9] rounded-br-sm"
                  : "bg-[#1e3a5f] text-[#f1f5f9] rounded-bl-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex items-end gap-2.5 justify-start">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs mb-0.5">
              🤖
            </div>
            <div className="bg-[#1e3a5f] rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1 items-center h-4">
                {[0, 150, 300].map((delay) => (
                  <div
                    key={delay}
                    className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="px-6 py-4 border-t border-slate-700/60 bg-[#1e293b] flex-shrink-0">
        {/* Suggestion chips */}
        <div className="flex flex-wrap gap-2 mb-3">
          {CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => onSend(chip)}
              disabled={loading}
              className="text-xs px-3 py-1.5 rounded-full border border-slate-600 text-[#94a3b8] hover:border-slate-400 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Text input row */}
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Try to claim a refund..."
            disabled={loading}
            className="flex-1 min-w-0 bg-[#0f172a] border border-slate-600 rounded-xl px-4 py-3 text-sm text-white placeholder-[#475569] focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
          />
          <button
            onClick={submit}
            disabled={loading || !input.trim()}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
