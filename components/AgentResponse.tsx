import type { ScenarioResult } from "@/lib/types";
import Card from "./internal/Card";
import EmptyState from "./internal/EmptyState";

export default function AgentResponse({
  result,
}: {
  result?: ScenarioResult;
}) {
  return (
    <Card title="Final agent response" subtitle="What the customer ultimately sees">
      {!result ? (
        <EmptyState glyph="→">
          What the customer ultimately sees will appear here.
        </EmptyState>
      ) : (
        <div className="rounded-md bg-emerald-500/10 p-3 text-sm text-emerald-100">
          {result.finalAgentResponse}
        </div>
      )}
    </Card>
  );
}
