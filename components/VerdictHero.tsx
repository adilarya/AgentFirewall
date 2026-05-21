import type { DecisionType, ScenarioResult } from "@/lib/types";

const DECISION_STYLES: Record<
  DecisionType,
  { ring: string; text: string; bg: string; label: string; dot: string }
> = {
  allow: {
    ring: "ring-emerald-500/40",
    text: "text-emerald-300",
    bg: "bg-emerald-500/10",
    label: "ALLOWED",
    dot: "bg-emerald-400",
  },
  block: {
    ring: "ring-rose-500/40",
    text: "text-rose-300",
    bg: "bg-rose-500/10",
    label: "BLOCKED",
    dot: "bg-rose-400",
  },
  rewrite: {
    ring: "ring-amber-500/40",
    text: "text-amber-300",
    bg: "bg-amber-500/10",
    label: "REWRITTEN",
    dot: "bg-amber-400",
  },
  escalate: {
    ring: "ring-sky-500/40",
    text: "text-sky-300",
    bg: "bg-sky-500/10",
    label: "ESCALATED",
    dot: "bg-sky-400",
  },
};

export default function VerdictHero({
  result,
}: {
  result?: ScenarioResult;
}) {
  if (!result) {
    return (
      <section className="rounded-lg border border-dashed border-slate-800 bg-slate-900/30 p-6 text-center">
        <div className="text-xs uppercase tracking-wide text-slate-500">
          Awaiting scenario
        </div>
        <div className="mt-1 text-sm text-slate-400">
          Pick a scenario above to see the firewall in action.
        </div>
      </section>
    );
  }

  const style = DECISION_STYLES[result.firewallDecision.decision];

  return (
    <section
      className={
        "rounded-lg border border-slate-800 p-5 ring-1 " +
        style.bg +
        " " +
        style.ring
      }
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div
            className={
              "rounded-md bg-slate-950/50 px-4 py-2 font-mono text-2xl font-bold tracking-wider " +
              style.text
            }
          >
            {style.label}
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Scenario
            </div>
            <div className="text-base font-semibold text-slate-100">
              {result.scenarioName}
            </div>
          </div>
        </div>
        <div className="text-sm text-slate-300 md:max-w-xl md:text-right">
          {result.firewallDecision.reason}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <span className={"h-1.5 w-1.5 rounded-full " + style.dot} />
          policy
          <span className="font-mono text-slate-300">
            {result.firewallDecision.policy}
          </span>
        </span>
        <span>
          gateway{" "}
          <span
            className={
              "font-mono " +
              (result.gatewayResult.executed
                ? "text-emerald-300"
                : "text-rose-300")
            }
          >
            {result.gatewayResult.status}
          </span>
        </span>
        {result.gatewayResult.traceId ? (
          <span>
            trace{" "}
            <span className="font-mono text-slate-300">
              {result.gatewayResult.traceId}
            </span>
          </span>
        ) : null}
        {typeof result.firewallDecision.maxAllowed === "number" ? (
          <span>
            max{" "}
            <span className="font-mono text-slate-300">
              ${result.firewallDecision.maxAllowed}
            </span>
          </span>
        ) : null}
      </div>
    </section>
  );
}
