import type { ScenarioResult } from "@/lib/types";
import Card from "./internal/Card";

export default function AgentResponse({
  result,
}: {
  result?: ScenarioResult;
}) {
  return (
    <Card title="Final agent response" subtitle="What the customer ultimately sees">
      {!result ? (
        <p className="text-sm text-slate-500">
          No response yet — run a scenario to see what the agent sends back after the firewall acts.
        </p>
      ) : (
        <div className="rounded-md bg-emerald-500/10 p-3 text-sm text-emerald-100">
          {result.finalAgentResponse}
        </div>
      )}
    </Card>
  );
}
