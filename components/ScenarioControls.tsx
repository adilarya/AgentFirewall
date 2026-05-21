"use client";

import { SCENARIOS } from "@/lib/scenarios";

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
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-300">
        Scenarios
      </h2>
      <div className="flex flex-wrap gap-2">
        {SCENARIOS.map((s) => {
          const active = s.id === activeScenarioId;
          return (
            <button
              key={s.id}
              disabled={loading}
              onClick={() => onRunScenario(s.id)}
              className={
                "rounded-md border px-3 py-2 text-sm transition disabled:opacity-50 " +
                (active
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-200"
                  : "border-slate-700 bg-slate-800/40 text-slate-200 hover:border-slate-500")
              }
            >
              {s.name}
            </button>
          );
        })}
        <button
          disabled={loading}
          onClick={onRunReplay}
          className="rounded-md border border-indigo-500 bg-indigo-500/10 px-3 py-2 text-sm text-indigo-200 hover:border-indigo-300 disabled:opacity-50"
        >
          Run replay suite
        </button>
      </div>
    </section>
  );
}
