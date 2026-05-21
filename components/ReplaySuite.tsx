import type { DecisionType, ReplayResult } from "@/lib/types";
import Card from "./internal/Card";

const COLORS: Record<DecisionType, string> = {
  allow: "text-emerald-300",
  block: "text-rose-300",
  rewrite: "text-amber-300",
  escalate: "text-sky-300",
};

function Summary({ results }: { results: ReplayResult[] }) {
  const passing = results.filter((r) => r.pass).length;
  const total = results.length;
  const allPass = passing === total;
  const failing = total - passing;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1">
      <span
        className={
          "h-2.5 w-2.5 rounded-full " +
          (allPass ? "bg-emerald-400" : "bg-rose-400")
        }
      />
      <span className="font-mono text-3xl font-bold text-slate-100">
        {passing}
        <span className="text-slate-500">/{total}</span>
      </span>
      <span className="text-sm text-slate-400">passing</span>
      {allPass ? (
        <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-300">
          policy matches expectations
        </span>
      ) : (
        <span className="rounded-md bg-rose-500/10 px-2 py-0.5 text-xs text-rose-300">
          {failing} failing
        </span>
      )}
    </div>
  );
}

export default function ReplaySuite({
  results,
}: {
  results?: ReplayResult[];
}) {
  return (
    <Card title="Replay suite" subtitle="Regression check across all scenarios">
      {!results || results.length === 0 ? (
        <p className="text-sm text-slate-500">
          Run the replay suite to see results.
        </p>
      ) : (
        <>
          <Summary results={results} />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-2 py-1">Scenario</th>
                  <th className="px-2 py-1">Expected</th>
                  <th className="px-2 py-1">Actual</th>
                  <th className="px-2 py-1">Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.scenarioId} className="border-t border-slate-800">
                    <td className="px-2 py-2 text-slate-200">{r.scenarioName}</td>
                    <td
                      className={
                        "px-2 py-2 font-mono " + COLORS[r.expectedDecision]
                      }
                    >
                      {r.expectedDecision}
                    </td>
                    <td
                      className={
                        "px-2 py-2 font-mono " + COLORS[r.actualDecision]
                      }
                    >
                      {r.actualDecision}
                    </td>
                    <td className="px-2 py-2">
                      <span
                        className={
                          "rounded-md px-2 py-0.5 text-xs font-semibold " +
                          (r.pass
                            ? "bg-emerald-500/10 text-emerald-300"
                            : "bg-rose-500/10 text-rose-300")
                        }
                      >
                        {r.pass ? "PASS" : "FAIL"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Card>
  );
}
