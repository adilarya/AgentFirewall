import type { ScenarioResult } from "@/lib/types";
import {
  ChevronRightIcon,
  CloudIcon,
  CodeIcon,
  ServerIcon,
  ShieldIcon,
  UserIcon,
} from "./ui/Icons";

type StepKey = "customer" | "tool" | "firewall" | "gateway" | "server";

const STEPS: { key: StepKey; label: string; Icon: typeof UserIcon }[] = [
  { key: "customer", label: "Customer request", Icon: UserIcon },
  { key: "tool", label: "Agent tool call", Icon: CodeIcon },
  { key: "firewall", label: "AgentFirewall policy", Icon: ShieldIcon },
  { key: "gateway", label: "TrueFoundry MCP Gateway", Icon: CloudIcon },
  { key: "server", label: "MCP server result", Icon: ServerIcon },
];

function activeSteps(result?: ScenarioResult): Set<StepKey> {
  if (!result) return new Set();
  const set = new Set<StepKey>(["customer", "tool", "firewall"]);
  const decision = result.firewallDecision.decision;
  if (decision === "allow" || decision === "rewrite") {
    set.add("gateway");
    set.add("server");
  }
  return set;
}

export default function FlowStrip({ result }: { result?: ScenarioResult }) {
  const active = activeSteps(result);
  const stopped =
    result &&
    (result.firewallDecision.decision === "block" ||
      result.firewallDecision.decision === "escalate");

  return (
    <div className="mx-auto w-full max-w-7xl px-6">
      <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-slate-200 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-y-3">
          {STEPS.map(({ key, label, Icon }, i) => {
            const isActive = active.has(key);
            const isStop = stopped && key === "firewall";
            return (
              <div key={key} className="flex flex-1 items-center gap-2">
                <div
                  className={
                    "flex min-w-0 flex-1 items-center gap-2.5 rounded-xl px-3 py-2 transition " +
                    (isStop
                      ? "bg-rose-50 ring-1 ring-rose-200"
                      : isActive
                        ? "bg-indigo-50/70 ring-1 ring-indigo-200"
                        : "bg-slate-50 ring-1 ring-slate-200/70")
                  }
                >
                  <span
                    className={
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg " +
                      (isStop
                        ? "bg-rose-100 text-rose-600"
                        : isActive
                          ? "bg-indigo-100 text-indigo-600"
                          : "bg-white text-slate-400")
                    }
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0">
                    <div
                      className={
                        "truncate text-xs font-medium " +
                        (isStop
                          ? "text-rose-700"
                          : isActive
                            ? "text-slate-900"
                            : "text-slate-500")
                      }
                    >
                      {label}
                    </div>
                    {isStop ? (
                      <div className="truncate text-[10px] font-semibold uppercase tracking-wider text-rose-600">
                        Stopped here
                      </div>
                    ) : null}
                  </div>
                </div>
                {i < STEPS.length - 1 ? (
                  <ChevronRightIcon
                    className={
                      "h-4 w-4 shrink-0 " +
                      (active.has(STEPS[i + 1]?.key as StepKey)
                        ? "text-indigo-400"
                        : "text-slate-300")
                    }
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
