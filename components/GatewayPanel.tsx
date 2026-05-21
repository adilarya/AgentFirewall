import type { ScenarioResult } from "@/lib/types";
import Badge from "./ui/Badge";
import Card from "./ui/Card";
import { CheckCircleIcon, CloudIcon, XCircleIcon } from "./ui/Icons";

export default function GatewayPanel({
  result,
}: {
  result?: ScenarioResult;
}) {
  return (
    <Card
      eyebrow="Step 4"
      title="TrueFoundry MCP Gateway"
      subtitle="Simulated routing"
      icon={<CloudIcon className="h-5 w-5" />}
      accent="indigo"
    >
      {!result ? (
        <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 py-8 text-center">
          <p className="text-sm text-slate-500">
            Gateway routing status will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            {result.gatewayResult.executed ? (
              <Badge
                tone="emerald"
                leadingIcon={<CheckCircleIcon className="h-3.5 w-3.5" />}
              >
                Executed via gateway
              </Badge>
            ) : (
              <Badge
                tone="rose"
                leadingIcon={<XCircleIcon className="h-3.5 w-3.5" />}
              >
                Did not reach MCP
              </Badge>
            )}
          </div>

          <div className="space-y-2 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
            {result.gatewayResult.server ? (
              <Row label="server" value={result.gatewayResult.server} />
            ) : null}
            {result.gatewayResult.tool ? (
              <Row label="tool" value={result.gatewayResult.tool} />
            ) : null}
            <Row label="status" value={result.gatewayResult.status} mono />
            {result.gatewayResult.traceId ? (
              <Row label="trace id" value={result.gatewayResult.traceId} mono />
            ) : null}
          </div>

          <p className="text-[11px] text-slate-500">
            Safe or rewritten actions are routed through the TrueFoundry MCP
            Gateway. Blocked actions never reach MCP execution.
          </p>
        </div>
      )}
    </Card>
  );
}

function Row({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </span>
      <span
        className={
          "truncate text-right text-xs " +
          (mono ? "font-mono text-slate-800" : "text-slate-900")
        }
      >
        {value}
      </span>
    </div>
  );
}
