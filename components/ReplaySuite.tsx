import type { DecisionType, ReplayResult } from "@/lib/types";
import Badge, { DECISION_TONE } from "./ui/Badge";
import Card from "./ui/Card";
import { CheckCircleIcon, RepeatIcon, XCircleIcon } from "./ui/Icons";

function Summary({ results }: { results: ReplayResult[] }) {
  const passing = results.filter((r) => r.pass).length;
  const total = results.length;
  const allPass = passing === total;
  const failing = total - passing;
  const blockedUnsafe = results.filter(
    (r) => r.expectedDecision === "block" && r.pass,
  ).length;
  const routedSafe = results.filter(
    (r) =>
      (r.expectedDecision === "allow" || r.expectedDecision === "rewrite") &&
      r.pass,
  ).length;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <Stat
        label="Scenarios tested"
        value={String(total)}
        tone="indigo"
      />
      <Stat
        label="Passed"
        value={`${passing}/${total}`}
        tone={allPass ? "emerald" : "rose"}
        sub={allPass ? "all green" : `${failing} failing`}
      />
      <Stat
        label="Unsafe blocked"
        value={String(blockedUnsafe)}
        tone="rose"
      />
      <Stat
        label="Safe routed"
        value={String(routedSafe)}
        tone="emerald"
      />
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
  sub,
}: {
  label: string;
  value: string;
  tone: "indigo" | "emerald" | "rose";
  sub?: string;
}) {
  const accent =
    tone === "emerald"
      ? "from-emerald-50"
      : tone === "rose"
        ? "from-rose-50"
        : "from-indigo-50";
  return (
    <div
      className={
        "rounded-xl bg-gradient-to-b to-white p-4 ring-1 ring-slate-200 " +
        accent
      }
    >
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </div>
      <div className="mt-1 font-mono text-2xl font-semibold text-slate-900">
        {value}
      </div>
      {sub ? <div className="text-[11px] text-slate-500">{sub}</div> : null}
    </div>
  );
}

const DECISION_LABEL_LOWER: Record<DecisionType, string> = {
  allow: "allow",
  block: "block",
  rewrite: "rewrite",
  escalate: "escalate",
};

export default function ReplaySuite({
  results,
}: {
  results?: ReplayResult[];
}) {
  return (
    <Card
      eyebrow="Compliance"
      title="Replay suite report"
      subtitle="Regression check across every scenario in the policy"
      icon={<RepeatIcon className="h-5 w-5" />}
    >
      {!results || results.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 py-10 text-center">
          <p className="max-w-sm text-sm text-slate-500">
            Run the replay suite to evaluate every scenario and produce a
            pass/fail compliance report.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <Summary results={results} />

          <div className="overflow-hidden rounded-xl ring-1 ring-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Scenario</th>
                  <th className="px-4 py-2.5 font-semibold">Expected</th>
                  <th className="px-4 py-2.5 font-semibold">Actual</th>
                  <th className="px-4 py-2.5 font-semibold">MCP executed</th>
                  <th className="px-4 py-2.5 font-semibold">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {results.map((r) => {
                  const mcpExecuted = r.result.gatewayResult.executed;
                  return (
                    <tr key={r.scenarioId}>
                      <td className="px-4 py-3 text-slate-900">
                        {r.scenarioName}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          tone={DECISION_TONE[r.expectedDecision]}
                          size="sm"
                        >
                          {DECISION_LABEL_LOWER[r.expectedDecision]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          tone={DECISION_TONE[r.actualDecision]}
                          size="sm"
                        >
                          {DECISION_LABEL_LOWER[r.actualDecision]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">
                        {mcpExecuted ? "yes" : "no"}
                      </td>
                      <td className="px-4 py-3">
                        {r.pass ? (
                          <Badge
                            tone="emerald"
                            size="sm"
                            leadingIcon={
                              <CheckCircleIcon className="h-3.5 w-3.5" />
                            }
                          >
                            PASS
                          </Badge>
                        ) : (
                          <Badge
                            tone="rose"
                            size="sm"
                            leadingIcon={
                              <XCircleIcon className="h-3.5 w-3.5" />
                            }
                          >
                            FAIL
                          </Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Card>
  );
}
