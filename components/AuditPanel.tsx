import type { AuditEntry } from "@/app/page";

const BADGE: Record<string, { label: string; style: string }> = {
  block: { label: "BLOCK", style: "bg-red-500/15 text-red-400" },
  rewrite: { label: "REWRITE", style: "bg-yellow-500/15 text-yellow-400" },
  allow: { label: "ALLOW", style: "bg-green-500/15 text-green-400" },
  escalate: { label: "ESCALATE", style: "bg-sky-500/15 text-sky-400" },
};

function DecisionBadge({ decision }: { decision: string }) {
  const cfg = BADGE[decision] ?? { label: decision.toUpperCase(), style: "bg-slate-500/15 text-slate-400" };
  return (
    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${cfg.style}`}>
      {cfg.label}
    </span>
  );
}

export default function AuditPanel({ entries }: { entries: AuditEntry[] }) {
  return (
    <div className="flex flex-col h-full bg-[#0f172a]">
      <div className="border-b border-slate-700/60 px-4 py-3 flex-shrink-0">
        <h2 className="text-sm font-bold text-white">Audit Log</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <p className="text-xs text-[#94a3b8]">No entries yet.</p>
            <p className="text-[10px] text-[#475569]">Decisions will appear here as you chat.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, i) => (
              <div
                key={i}
                className="bg-[#1e293b] rounded-lg p-3 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] text-[#475569] flex-shrink-0">
                    {entry.time}
                  </span>
                  <DecisionBadge decision={entry.decision} />
                </div>
                <p className="text-[#94a3b8] truncate">{entry.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-slate-700/60 px-4 py-3 flex-shrink-0">
        <p className="text-[10px] text-[#475569]">Powered by TrueFoundry MCP Gateway</p>
        <p className="text-[10px] text-[#475569] break-all mt-0.5">
          gateway.truefoundry.ai/eshwar/mcp/github/server
        </p>
      </div>
    </div>
  );
}
