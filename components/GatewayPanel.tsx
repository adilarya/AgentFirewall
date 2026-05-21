import type { ScenarioResult } from "@/lib/types";
import Card from "./internal/Card";
import EmptyState from "./internal/EmptyState";

export default function GatewayPanel({
  result,
}: {
  result?: ScenarioResult;
}) {
  return (
    <Card title="MCP Gateway" subtitle="TrueFoundry routing (simulated)" step={4}>
      {!result ? (
        <EmptyState glyph="↗">
          Gateway routing status will appear here.
        </EmptyState>
      ) : (
        <div className="space-y-2 text-sm">
          <div className="flex gap-4">
            <span className="text-slate-500">executed</span>
            <span
              className={
                "font-mono " +
                (result.gatewayResult.executed
                  ? "text-emerald-300"
                  : "text-rose-300")
              }
            >
              {String(result.gatewayResult.executed)}
            </span>
          </div>
          {result.gatewayResult.server ? (
            <div className="flex gap-4">
              <span className="text-slate-500">server</span>
              <span className="font-mono text-slate-200">
                {result.gatewayResult.server}
              </span>
            </div>
          ) : null}
          {result.gatewayResult.tool ? (
            <div className="flex gap-4">
              <span className="text-slate-500">tool</span>
              <span className="font-mono text-slate-200">
                {result.gatewayResult.tool}
              </span>
            </div>
          ) : null}
          <div className="flex gap-4">
            <span className="text-slate-500">status</span>
            <span className="font-mono text-slate-200">
              {result.gatewayResult.status}
            </span>
          </div>
          {result.gatewayResult.traceId ? (
            <div className="flex gap-4">
              <span className="text-slate-500">traceId</span>
              <span className="font-mono text-slate-200">
                {result.gatewayResult.traceId}
              </span>
            </div>
          ) : null}
        </div>
      )}
    </Card>
  );
}
