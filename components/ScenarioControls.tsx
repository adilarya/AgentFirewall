"use client";

import { EXPECTED_DECISIONS, SCENARIOS } from "@/lib/scenarios";
import type { DecisionType, Scenario, ScenarioId } from "@/lib/types";

const GROUP_ORDER: DecisionType[] = ["allow", "block", "rewrite", "escalate"];

const GROUP_STYLES: Record<
  DecisionType,
  { label: string; header: string; base: string; active: string }
> = {
  allow: {
    label: "Expected · allow",
    header: "text-emerald-400",
    base: "border-emerald-900/60 bg-emerald-500/5 text-emerald-100 hover:border-emerald-500/70",
    active:
      "border-emerald-400 bg-emerald-500/15 text-emerald-50 ring-1 ring-emerald-500/40",
  },
  block: {
    label: "Expected · block",
    header: "text-rose-400",
    base: "border-rose-900/60 bg-rose-500/5 text-rose-100 hover:border-rose-500/70",
    active:
      "border-rose-400 bg-rose-500/15 text-rose-50 ring-1 ring-rose-500/40",
  },
  rewrite: {
    label: "Expected · rewrite",
    header: "text-amber-400",
    base: "border-amber-900/60 bg-amber-500/5 text-amber-100 hover:border-amber-500/70",
    active:
      "border-amber-400 bg-amber-500/15 text-amber-50 ring-1 ring-amber-500/40",
  },
  escalate: {
    label: "Expected · escalate",
    header: "text-sky-400",
    base: "border-sky-900/60 bg-sky-500/5 text-sky-100 hover:border-sky-500/70",
    active:
      "border-sky-400 bg-sky-500/15 text-sky-50 ring-1 ring-sky-500/40",
  },
};

interface Props {
  onRunScenario: (id: string) => void;
  onRunReplay: () => void;
  loading: boolean;
  activeScenarioId?: string;
}

export default function ScenarioControls({
  onRunScenario,
  onRunReplay,
  loading,
  activeScenarioId,
}: Props) {
  const groups = new Map<DecisionType, Scenario[]>();
  for (const s of SCENARIOS) {
    const expected = EXPECTED_DECISIONS[s.id as ScenarioId];
    const list = groups.get(expected) ?? [];
    list.push(s);
    groups.set(expected, list);
  }

  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-300">
        Scenarios
      </h2>

      <div className="space-y-3">
        {GROUP_ORDER.filter((v) => groups.has(v)).map((verdict) => {
          const style = GROUP_STYLES[verdict];
          const scenarios = groups.get(verdict) ?? [];
          return (
            <div key={verdict}>
              <div
                className={
                  "mb-1.5 text-[10px] font-semibold uppercase tracking-wider " +
                  style.header
                }
              >
                {style.label}
              </div>
              <div className="flex flex-wrap gap-2">
                {scenarios.map((s) => {
                  const active = s.id === activeScenarioId;
                  return (
                    <button
                      key={s.id}
                      disabled={loading}
                      onClick={() => onRunScenario(s.id)}
                      className={
                        "rounded-md border px-3 py-2 text-sm transition disabled:opacity-50 " +
                        (active ? style.active : style.base)
                      }
                    >
                      {s.name}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 border-t border-slate-800 pt-3">
        <button
          disabled={loading}
          onClick={onRunReplay}
          className="rounded-md border border-indigo-500 bg-indigo-500/10 px-3 py-2 text-sm text-indigo-200 transition hover:border-indigo-300 disabled:opacity-50"
        >
          Run replay suite
        </button>
        <span className="ml-3 text-xs text-slate-500">
          Runs all scenarios, checks expected vs actual
        </span>
      </div>
    </section>
  );
}
