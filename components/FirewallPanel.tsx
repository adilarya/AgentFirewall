import type { ChatResponse } from "@/lib/types";

function extractIssueUrl(message?: string): string | undefined {
  if (!message) return undefined;
  const match = message.match(/https?:\/\/github\.com\/[^\s]+/);
  return match?.[0];
}

function GuardrailRow({
  label,
  status,
}: {
  label: string;
  status: "clear" | "triggered" | "mutated";
}) {
  const icon = status === "clear" ? "✅" : status === "triggered" ? "🔴" : "🟡";
  const text =
    status === "clear" ? "Clear" : status === "triggered" ? "Triggered" : "Mutated";
  const textColor =
    status === "clear"
      ? "text-green-400"
      : status === "triggered"
      ? "text-red-400"
      : "text-yellow-400";
  return (
    <div className="flex items-center justify-between text-xs py-1">
      <span className="text-[#94a3b8]">{label}</span>
      <span className={`font-medium ${textColor}`}>
        {icon} {text}
      </span>
    </div>
  );
}

export default function FirewallPanel({ decision }: { decision: ChatResponse | null }) {
  const d = decision?.firewallDecision;
  const issueUrl = extractIssueUrl(decision?.gatewayResult?.output?.message);

  // Idle state
  if (!d) {
    return (
      <div className="flex flex-col h-full p-4 bg-[#0f172a]">
        <div className="border-b border-slate-700/60 pb-3 mb-4 flex-shrink-0">
          <h2 className="text-sm font-bold text-white">🛡️ AgentFirewall</h2>
        </div>
        <div className="flex flex-col items-center justify-center flex-1 gap-4 text-center">
          <div className="text-6xl opacity-20 select-none">🛡️</div>
          <p className="text-xs text-[#94a3b8] leading-relaxed">
            Monitoring agent actions...
            <br />
            <span className="text-[#475569]">Send a message to see the firewall react.</span>
          </p>
        </div>
      </div>
    );
  }

  const isBlock = d.decision === "block";
  const isRewrite = d.decision === "rewrite";
  const isAllow = d.decision === "allow";

  const shieldEmoji = isBlock ? "🔴" : isRewrite ? "🟡" : isAllow ? "🟢" : "🔵";

  const badgeStyle = isBlock
    ? "bg-red-500/15 text-red-400 border border-red-500/40"
    : isRewrite
    ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/40"
    : isAllow
    ? "bg-green-500/15 text-green-400 border border-green-500/40"
    : "bg-sky-500/15 text-sky-400 border border-sky-500/40";

  const badgeLabel = isBlock
    ? "BLOCKED"
    : isRewrite
    ? "REWRITTEN"
    : isAllow
    ? "ALLOWED"
    : "ESCALATED";

  const regexStatus: "clear" | "triggered" | "mutated" = isBlock
    ? "triggered"
    : isRewrite
    ? "mutated"
    : "clear";

  const toolBody = decision?.toolCall?.args?.body
    ? String(decision.toolCall.args.body)
    : null;

  return (
    <div className="flex flex-col h-full bg-[#0f172a] overflow-y-auto">
      <div className="border-b border-slate-700/60 px-4 py-3 flex-shrink-0">
        <h2 className="text-sm font-bold text-white">🛡️ AgentFirewall</h2>
      </div>

      <div className="flex-1 px-4 py-4 space-y-4">
        {/* Shield + badge */}
        <div className="flex flex-col items-center gap-2 py-2">
          <span className="text-5xl select-none">{shieldEmoji}</span>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${badgeStyle}`}>
            {badgeLabel}
          </span>
        </div>

        {/* Attempted action */}
        {decision?.toolCall && (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#64748b] mb-1.5 font-semibold">
              Attempted Action
            </p>
            <div className="bg-[#1e293b] rounded-lg p-3 space-y-1">
              <span className="font-mono text-xs text-blue-300">
                {decision.toolCall.tool}
              </span>
              {toolBody && (
                <p className="text-[11px] text-[#94a3b8] break-words leading-relaxed">
                  &ldquo;{toolBody.length > 100 ? toolBody.slice(0, 100) + "…" : toolBody}&rdquo;
                </p>
              )}
            </div>
          </div>
        )}

        {/* Reason */}
        <div>
          <p className="text-[10px] uppercase tracking-wider text-[#64748b] mb-1.5 font-semibold">
            Reason
          </p>
          <p className="text-xs text-white bg-[#1e293b] rounded-lg p-3 leading-relaxed">
            {d.reason}
          </p>
        </div>

        {/* Rewrite diff */}
        {isRewrite && d.rewrittenArgs && (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#64748b] mb-1.5 font-semibold">
              Rewritten To
            </p>
            <p className="text-xs text-yellow-200 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 leading-relaxed break-words">
              &ldquo;{String(d.rewrittenArgs.body)}&rdquo;
            </p>
          </div>
        )}

        <div className="border-t border-slate-700/60" />

        {/* TrueFoundry Guardrails */}
        <div>
          <p className="text-[10px] uppercase tracking-wider text-[#64748b] mb-2 font-semibold">
            TrueFoundry Guardrails
          </p>
          <div className="bg-[#1e293b] rounded-lg px-3 py-1 divide-y divide-slate-700/40">
            <GuardrailRow label="Prompt Injection" status="clear" />
            <GuardrailRow label="Secrets Detection" status="clear" />
            <GuardrailRow label="Regex Pattern Match" status={regexStatus} />
          </div>
        </div>

        <div className="border-t border-slate-700/60" />

        {/* GitHub MCP status */}
        <div>
          <p className="text-[10px] uppercase tracking-wider text-[#64748b] mb-1.5 font-semibold">
            GitHub MCP
          </p>
          {isBlock ? (
            <p className="text-xs text-[#94a3b8]">No action taken</p>
          ) : issueUrl ? (
            <a
              href={issueUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-green-400 hover:text-green-300 hover:underline break-all"
            >
              ✅ Issue created ↗
            </a>
          ) : (
            <p className="text-xs text-green-400">
              ✅ {isRewrite ? "Safe escalation created" : "Issue created"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
