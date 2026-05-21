import type { AuditEvent, ScenarioResult } from "@/lib/types";
import Card from "./ui/Card";
import {
  BanIcon,
  CheckCircleIcon,
  ClockIcon,
  EditIcon,
  ShieldIcon,
} from "./ui/Icons";

type Category = "neutral" | "info" | "success" | "warning" | "danger";

function categoryFor(message: string): Category {
  switch (message) {
    case "firewall_decision":
      return "info";
    case "mcp_call_executed":
      return "success";
    case "mcp_call_skipped":
      return "danger";
    case "tool_call_rewritten":
      return "warning";
    default:
      return "neutral";
  }
}

function IconFor({ message, className }: { message: string; className?: string }) {
  switch (message) {
    case "firewall_decision":
      return <ShieldIcon className={className} />;
    case "mcp_call_executed":
      return <CheckCircleIcon className={className} />;
    case "mcp_call_skipped":
      return <BanIcon className={className} />;
    case "tool_call_rewritten":
      return <EditIcon className={className} />;
    default:
      return <ClockIcon className={className} />;
  }
}

const DOT_STYLE: Record<Category, string> = {
  neutral: "bg-slate-100 text-slate-500 ring-slate-200",
  info: "bg-indigo-50 text-indigo-600 ring-indigo-200",
  success: "bg-emerald-50 text-emerald-600 ring-emerald-200",
  warning: "bg-amber-50 text-amber-700 ring-amber-200",
  danger: "bg-rose-50 text-rose-600 ring-rose-200",
};

function relativeMs(current: string, base: string): string {
  const diff = new Date(current).getTime() - new Date(base).getTime();
  if (diff < 1000) return `+${diff}ms`;
  return `+${(diff / 1000).toFixed(2)}s`;
}

function detailFor(event: AuditEvent): string {
  if (!event.metadata) return "";
  if (
    event.message === "firewall_decision" &&
    typeof event.metadata.decision === "object" &&
    event.metadata.decision
  ) {
    const d = event.metadata.decision as { decision?: string; reason?: string };
    return [d.decision, d.reason].filter(Boolean).join(" · ");
  }
  if (
    event.message === "mcp_call_executed" &&
    typeof event.metadata.gatewayResult === "object" &&
    event.metadata.gatewayResult
  ) {
    const g = event.metadata.gatewayResult as {
      status?: string;
      traceId?: string;
    };
    return [g.status, g.traceId].filter(Boolean).join(" · ");
  }
  if (
    event.message === "mcp_call_skipped" &&
    typeof event.metadata.reason === "string"
  ) {
    return event.metadata.reason;
  }
  if (
    event.message === "agent_proposed_tool_call" &&
    typeof event.metadata.toolCall === "object" &&
    event.metadata.toolCall
  ) {
    const t = event.metadata.toolCall as { server?: string; tool?: string };
    return [t.server, t.tool].filter(Boolean).join(" · ");
  }
  if (
    event.message === "customer_message_received" &&
    typeof event.metadata.message === "string"
  ) {
    return event.metadata.message;
  }
  return "";
}

function Row({
  event,
  base,
  isLast,
}: {
  event: AuditEvent;
  base: string;
  isLast: boolean;
}) {
  const cat = categoryFor(event.message);
  const detail = detailFor(event);

  return (
    <li className="relative flex gap-3 pl-2">
      {!isLast ? (
        <span
          aria-hidden
          className="absolute left-[18px] top-7 h-[calc(100%-1rem)] w-px bg-slate-200"
        />
      ) : null}
      <span
        className={
          "z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ring-1 " +
          DOT_STYLE[cat]
        }
      >
        <IconFor message={event.message} className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0 flex-1 pb-4">
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-mono text-xs font-medium text-slate-800">
            {event.message}
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            {relativeMs(event.timestamp, base)}
          </span>
        </div>
        {detail ? (
          <p className="mt-0.5 truncate text-xs text-slate-500">{detail}</p>
        ) : null}
      </div>
    </li>
  );
}

export default function AuditLog({ result }: { result?: ScenarioResult }) {
  if (!result) {
    return (
      <Card
        eyebrow="Observability"
        title="Audit timeline"
        subtitle="Append-only trail of every firewall decision"
        icon={<ClockIcon className="h-5 w-5" />}
      >
        <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 py-8 text-center">
          <p className="text-sm text-slate-500">
            Event timeline will appear here after a scenario runs.
          </p>
        </div>
      </Card>
    );
  }

  const base =
    result.auditLog[0]?.timestamp ?? new Date().toISOString();

  return (
    <Card
      eyebrow="Observability"
      title="Audit timeline"
      subtitle={`Append-only trail · ${result.auditLog.length} events recorded`}
      icon={<ClockIcon className="h-5 w-5" />}
    >
      <ol className="space-y-0">
        {result.auditLog.map((event, i) => (
          <Row
            key={i}
            event={event}
            base={base}
            isLast={i === result.auditLog.length - 1}
          />
        ))}
      </ol>
    </Card>
  );
}
