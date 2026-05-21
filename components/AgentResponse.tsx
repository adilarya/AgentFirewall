import type { ScenarioResult } from "@/lib/types";
import { SparkleIcon } from "./ui/Icons";

export default function AgentResponse({
  result,
}: {
  result?: ScenarioResult;
}) {
  if (!result) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-6 text-center">
        <p className="text-sm text-slate-500">
          The final customer-facing reply will appear here after a scenario
          runs.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-900 p-[1px] shadow-lg">
      <div className="rounded-[15px] bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-indigo-300">
            <SparkleIcon className="h-4 w-4" />
          </span>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-300">
              Final agent response
            </div>
            <div className="text-sm text-slate-300">
              What the customer ultimately sees
            </div>
          </div>
        </div>
        <p className="text-lg font-medium leading-relaxed text-white">
          “{result.finalAgentResponse}”
        </p>
      </div>
    </div>
  );
}
