import type { ScenarioResult } from "@/lib/types";
import Card from "./internal/Card";

export default function ToolCallPanel({
  result,
}: {
  result?: ScenarioResult;
}) {
  return (
    <Card title="Proposed tool call" subtitle="What the agent wanted to do">
      {!result ? (
        <p className="text-sm text-slate-500">No tool call yet.</p>
      ) : (
        <div className="space-y-2 text-sm">
          <div className="flex gap-4">
            <span className="text-slate-500">server</span>
            <span className="font-mono text-slate-100">
              {result.toolCall.server}
            </span>
          </div>
          <div className="flex gap-4">
            <span className="text-slate-500">tool</span>
            <span className="font-mono text-slate-100">
              {result.toolCall.tool}
            </span>
          </div>
          <div>
            <div className="mb-1 text-slate-500">args</div>
            <pre className="overflow-x-auto rounded-md bg-slate-950/60 p-3 text-xs text-slate-200">
              {JSON.stringify(result.toolCall.args, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </Card>
  );
}
