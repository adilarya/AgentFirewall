import type { ChatResponse } from "@/lib/types";

function extractIssueUrl(message?: string): string | undefined {
  if (!message) return undefined;
  const match = message.match(/https?:\/\/github\.com\/[^\s]+/);
  return match?.[0];
}

// Shield SVG — used in header and as the main state indicator
function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08z" clipRule="evenodd" />
    </svg>
  );
}

// Checkmark — "clear" guardrail, GitHub issue created
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
    </svg>
  );
}

// X mark — "triggered" guardrail (blocked)
function XIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
    </svg>
  );
}

// Warning triangle — "mutated" guardrail (rewritten)
function WarnIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  );
}

// External link arrow
function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
      <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
    </svg>
  );
}

function GuardrailRow({
  label,
  status,
}: {
  label: string;
  status: "clear" | "triggered" | "mutated";
}) {
  const text =
    status === "clear" ? "Clear" : status === "triggered" ? "Triggered" : "Mutated";

  return (
    <div className="flex items-center justify-between text-xs py-1.5">
      <span className="text-[#94a3b8]">{label}</span>
      <span className="flex items-center gap-1 font-medium">
        {status === "clear" && (
          <><CheckIcon className="w-3.5 h-3.5 text-green-400" /><span className="text-green-400">{text}</span></>
        )}
        {status === "triggered" && (
          <><XIcon className="w-3.5 h-3.5 text-red-400" /><span className="text-red-400">{text}</span></>
        )}
        {status === "mutated" && (
          <><WarnIcon className="w-3.5 h-3.5 text-yellow-400" /><span className="text-yellow-400">{text}</span></>
        )}
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
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
            <ShieldIcon className="w-4 h-4 text-slate-400" />
            AgentFirewall
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center flex-1 gap-4 text-center">
          <ShieldIcon className="w-16 h-16 text-slate-600 opacity-40" />
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

  const shieldColor = isBlock
    ? "text-red-400"
    : isRewrite
    ? "text-yellow-400"
    : isAllow
    ? "text-green-400"
    : "text-sky-400";

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
        <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
          <ShieldIcon className="w-4 h-4 text-slate-400" />
          AgentFirewall
        </h2>
      </div>

      <div className="flex-1 px-4 py-4 space-y-4">
        {/* Colored shield + badge */}
        <div className="flex flex-col items-center gap-2 py-2">
          <ShieldIcon className={`w-14 h-14 ${shieldColor}`} />
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
              className="inline-flex items-center gap-1 text-xs text-green-400 hover:text-green-300 hover:underline break-all"
            >
              <CheckIcon className="w-3.5 h-3.5 flex-shrink-0" />
              Issue created
              <ExternalLinkIcon className="w-3 h-3 flex-shrink-0" />
            </a>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs text-green-400">
              <CheckIcon className="w-3.5 h-3.5" />
              {isRewrite ? "Safe escalation created" : "Issue created"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
