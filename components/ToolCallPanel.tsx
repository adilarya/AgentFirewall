import type { ScenarioResult } from "@/lib/types";
import Card from "./ui/Card";
import { CodeIcon } from "./ui/Icons";

export default function ToolCallPanel({
  result,
}: {
  result?: ScenarioResult;
}) {
  return (
    <Card
      eyebrow="Step 2"
      title="Proposed tool call"
      subtitle="What the agent wanted to do"
      icon={<CodeIcon className="h-5 w-5" />}
      accent="sky"
    >
      {!result ? (
        <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 py-8 text-center">
          <p className="text-sm text-slate-500">
            The agent&apos;s proposed tool call will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                server
              </div>
              <div className="font-mono text-sm text-slate-900">
                {result.toolCall.server}
              </div>
            </div>
            <div className="rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                tool
              </div>
              <div className="font-mono text-sm text-slate-900">
                {result.toolCall.tool}
              </div>
            </div>
          </div>
          <div>
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              args
            </div>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 p-3 text-[11px] leading-relaxed text-slate-100">
              {JSON.stringify(result.toolCall.args, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </Card>
  );
}
