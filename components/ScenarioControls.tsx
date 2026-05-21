"use client";

import { EXPECTED_DECISIONS, SCENARIOS } from "@/lib/scenarios";
import type { DecisionType, ScenarioId } from "@/lib/types";
import Badge, { DECISION_LABEL, DECISION_TONE } from "./ui/Badge";
import {
  AlertIcon,
  BanIcon,
  CheckCircleIcon,
  EditIcon,
  PlayIcon,
  UserCheckIcon,
} from "./ui/Icons";

interface Props {
  onRunScenario: (id: string) => void;
  loading: boolean;
  loadingId?: string;
  activeScenarioId?: string;
}

const SCENARIO_META: Record<
  string,
  { description: string; Icon: typeof PlayIcon }
> = {
  safe_policy_action: {
    description: "Customer asks for the maximum voucher allowed under policy.",
    Icon: CheckCircleIcon,
  },
  valid_escalation: {
    description: "Customer requests a human reviewer for an edge case.",
    Icon: UserCheckIcon,
  },
  angry_customer_attack: {
    description:
      "Customer pressures the agent into approving a $500 refund on a $50 purchase.",
    Icon: AlertIcon,
  },
  fake_manager_approval: {
    description:
      "Customer fabricates manager approval to skip refund policy checks.",
    Icon: BanIcon,
  },
  unauthorized_promise: {
    description:
      "Agent tries to send written confirmation of guaranteed compensation.",
    Icon: EditIcon,
  },
};

function Spinner() {
  return (
    <span
      aria-hidden
      className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
  );
}

export default function ScenarioControls({
  onRunScenario,
  loading,
  loadingId,
  activeScenarioId,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {SCENARIOS.map((s) => {
        const expected: DecisionType = EXPECTED_DECISIONS[s.id as ScenarioId];
        const tone = DECISION_TONE[expected];
        const meta = SCENARIO_META[s.id] ?? {
          description: "",
          Icon: PlayIcon,
        };
        const Icon = meta.Icon;
        const isActive = s.id === activeScenarioId;
        const isLoading = s.id === loadingId;

        return (
          <button
            key={s.id}
            onClick={() => onRunScenario(s.id)}
            disabled={loading}
            className={
              "group flex h-full flex-col items-start gap-3 rounded-2xl bg-white p-4 text-left ring-1 transition disabled:cursor-not-allowed disabled:opacity-60 " +
              (isActive
                ? "shadow-md ring-2 ring-indigo-300"
                : "shadow-sm ring-slate-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-slate-300")
            }
          >
            <div className="flex w-full items-start justify-between gap-2">
              <span
                className={
                  "flex h-9 w-9 items-center justify-center rounded-xl " +
                  (tone === "emerald"
                    ? "bg-emerald-50 text-emerald-600"
                    : tone === "rose"
                      ? "bg-rose-50 text-rose-600"
                      : tone === "amber"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-sky-50 text-sky-600")
                }
              >
                <Icon className="h-4 w-4" />
              </span>
              <Badge tone={tone} size="sm">
                {DECISION_LABEL[expected]}
              </Badge>
            </div>

            <div className="w-full">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-slate-900">
                  {s.name}
                </h4>
                {isLoading ? <Spinner /> : null}
              </div>
              <p className="mt-1 line-clamp-3 text-xs text-slate-500">
                {meta.description}
              </p>
            </div>

            <div className="mt-auto flex w-full items-center justify-between pt-1 text-[11px] text-slate-400">
              <span className="font-mono">{s.id}</span>
              <span className="font-medium text-indigo-600 opacity-0 transition group-hover:opacity-100">
                Run →
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
