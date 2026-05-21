import type { DecisionType, ScenarioResult } from "@/lib/types";
import Card from "./internal/Card";

const COLORS: Record<DecisionType, string> = {
  allow: "border-emerald-500 bg-emerald-500/10 text-emerald-200",
  block: "border-rose-500 bg-rose-500/10 text-rose-200",
  rewrite: "border-amber-500 bg-amber-500/10 text-amber-200",
  escalate: "border-sky-500 bg-sky-500/10 text-sky-200",
};

export default function FirewallDecisionPanel({
  result,
}: {
  result?: ScenarioResult;
}) {
  return (
    <Card title="Firewall decision" subtitle="Runtime policy enforcement" step={3} accent>
      {!result ? (
        <p className="text-sm text-slate-500">No decision yet.</p>
      ) : (
        <div className="space-y-3 text-sm">
          <div
            className={
              "inline-block rounded-md border px-3 py-1 text-xs font-semibold uppercase " +
              COLORS[result.firewallDecision.decision]
            }
          >
            {result.firewallDecision.decision}
          </div>
          <div>
            <div className="text-slate-500">reason</div>
            <div className="text-slate-100">
              {result.firewallDecision.reason}
            </div>
          </div>
          <div className="flex gap-4">
            <span className="text-slate-500">policy</span>
            <span className="font-mono text-slate-200">
              {result.firewallDecision.policy}
            </span>
          </div>
          {typeof result.firewallDecision.maxAllowed === "number" ? (
            <div className="flex gap-4">
              <span className="text-slate-500">maxAllowed</span>
              <span className="font-mono text-slate-200">
                ${result.firewallDecision.maxAllowed}
              </span>
            </div>
          ) : null}
          {result.firewallDecision.decision === "rewrite" &&
          result.firewallDecision.rewrittenArgs ? (
            <div className="space-y-2">
              <div className="text-slate-500">Body rewrite</div>
              <div className="rounded-md border border-rose-900/60 bg-rose-500/5 p-3">
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-rose-400">
                  ⚠ Agent attempted
                </div>
                <div className="text-xs leading-relaxed text-rose-200 line-through decoration-rose-500/70">
                  {String(result.toolCall.args.body ?? "")}
                </div>
              </div>
              <div className="text-center font-mono text-xs text-slate-600">
                ↓ firewall
              </div>
              <div className="rounded-md border border-amber-900/60 bg-amber-500/5 p-3">
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-amber-400">
                  ✓ Firewall sent
                </div>
                <div className="text-xs leading-relaxed text-amber-100">
                  {String(
                    (result.firewallDecision.rewrittenArgs as { body?: unknown })
                      .body ?? "",
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </Card>
  );
}
