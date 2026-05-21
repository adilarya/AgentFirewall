import type { ScenarioResult } from "@/lib/types";
import Card from "./internal/Card";
import EmptyState from "./internal/EmptyState";

export default function CustomerChat({
  result,
}: {
  result?: ScenarioResult;
}) {
  return (
    <Card title="Customer chat" subtitle="Input to the agent" step={1}>
      {!result ? (
        <EmptyState glyph="❝">
          Customer message and agent intent will appear here.
        </EmptyState>
      ) : (
        <div className="space-y-3">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Customer
            </div>
            <div className="rounded-md bg-slate-800/60 p-3 text-sm text-slate-100">
              {result.customerMessage}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Agent intent
            </div>
            <div className="rounded-md bg-slate-800/30 p-3 text-sm text-slate-200">
              {result.agentIntent}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
