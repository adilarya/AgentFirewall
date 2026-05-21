import type { DecisionType, ScenarioResult } from "@/lib/types";
import Badge from "./ui/Badge";
import {
  AlertIcon,
  BanIcon,
  CheckCircleIcon,
  EditIcon,
  ShieldIcon,
  UserCheckIcon,
} from "./ui/Icons";

const DECISION_THEME: Record<
  DecisionType,
  {
    label: string;
    tagline: string;
    tone: "emerald" | "rose" | "amber" | "sky";
    gradient: string;
    ring: string;
    iconBg: string;
    iconColor: string;
    Icon: typeof CheckCircleIcon;
  }
> = {
  allow: {
    label: "Allowed",
    tagline: "Action is within policy — routed to MCP gateway.",
    tone: "emerald",
    gradient: "from-emerald-50 via-white to-white",
    ring: "ring-emerald-200",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700",
    Icon: CheckCircleIcon,
  },
  block: {
    label: "Blocked before MCP execution",
    tagline: "Unauthorized action stopped at the firewall.",
    tone: "rose",
    gradient: "from-rose-50 via-white to-white",
    ring: "ring-rose-200",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-700",
    Icon: BanIcon,
  },
  rewrite: {
    label: "Rewritten then routed",
    tagline: "Unsafe payload was rewritten before reaching MCP.",
    tone: "amber",
    gradient: "from-amber-50 via-white to-white",
    ring: "ring-amber-200",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
    Icon: EditIcon,
  },
  escalate: {
    label: "Requires human approval",
    tagline: "Held for a human reviewer — never reached MCP.",
    tone: "sky",
    gradient: "from-sky-50 via-white to-white",
    ring: "ring-sky-200",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-700",
    Icon: UserCheckIcon,
  },
};

export default function FirewallDecisionPanel({
  result,
}: {
  result?: ScenarioResult;
}) {
  if (!result) {
    return (
      <section className="flex h-full flex-col rounded-2xl bg-gradient-to-b from-indigo-50 via-white to-white p-5 shadow-md ring-2 ring-indigo-200">
        <header className="mb-4 flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
            <ShieldIcon className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-700">
              Step 3 · Product hero
            </div>
            <h3 className="text-base font-semibold text-slate-900">
              AgentFirewall decision
            </h3>
            <p className="text-sm text-slate-500">
              Runtime policy enforcement
            </p>
          </div>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-indigo-200 bg-white/60 py-10 text-center">
          <ShieldIcon className="mb-2 h-8 w-8 text-indigo-300" />
          <p className="max-w-xs text-sm text-slate-500">
            Every agent tool call is inspected here before MCP execution.
          </p>
        </div>
      </section>
    );
  }

  const theme = DECISION_THEME[result.firewallDecision.decision];
  const Icon = theme.Icon;

  return (
    <section
      className={
        "flex h-full flex-col rounded-2xl bg-gradient-to-b p-5 shadow-md ring-2 " +
        theme.gradient +
        " " +
        theme.ring
      }
    >
      <header className="mb-4 flex items-start gap-3">
        <div
          className={
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl " +
            theme.iconBg +
            " " +
            theme.iconColor
          }
        >
          <ShieldIcon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Step 3 · AgentFirewall decision
          </div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900">
              {theme.label}
            </h3>
          </div>
          <p className="text-sm text-slate-600">{theme.tagline}</p>
        </div>
        <Badge tone={theme.tone} size="md" leadingIcon={<Icon className="h-3.5 w-3.5" />}>
          {result.firewallDecision.decision.toUpperCase()}
        </Badge>
      </header>

      <div className="space-y-3">
        <div className="rounded-xl bg-white/70 p-3 ring-1 ring-slate-200/70">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Reason
          </div>
          <p className="mt-0.5 text-sm text-slate-800">
            {result.firewallDecision.reason}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <Badge tone="slate" size="sm">
            policy ·{" "}
            <span className="font-mono">{result.firewallDecision.policy}</span>
          </Badge>
          {typeof result.firewallDecision.maxAllowed === "number" ? (
            <Badge tone="slate" size="sm">
              max allowed ·{" "}
              <span className="font-mono">
                ${result.firewallDecision.maxAllowed}
              </span>
            </Badge>
          ) : null}
        </div>

        {result.firewallDecision.decision === "rewrite" &&
        result.firewallDecision.rewrittenArgs ? (
          <div className="space-y-2">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Body rewrite
            </div>
            <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3">
              <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-rose-700">
                <AlertIcon className="h-3 w-3" />
                Agent attempted
              </div>
              <p className="text-xs leading-relaxed text-rose-800 line-through decoration-rose-400">
                {String(result.toolCall.args.body ?? "")}
              </p>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              ↓ firewall rewrite
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3">
              <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-amber-800">
                <EditIcon className="h-3 w-3" />
                Firewall sent
              </div>
              <p className="text-xs leading-relaxed text-amber-900">
                {String(
                  (
                    result.firewallDecision.rewrittenArgs as {
                      body?: unknown;
                    }
                  ).body ?? "",
                )}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
