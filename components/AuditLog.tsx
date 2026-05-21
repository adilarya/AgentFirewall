import type { AuditEvent, ScenarioResult } from "@/lib/types";
import Card from "./internal/Card";
import EmptyState from "./internal/EmptyState";

function categoryStyle(message: string): string {
  switch (message) {
    case "firewall_decision":
      return "bg-indigo-500/15 text-indigo-300";
    case "mcp_call_executed":
      return "bg-emerald-500/15 text-emerald-300";
    case "mcp_call_skipped":
      return "bg-rose-500/15 text-rose-300";
    case "tool_call_rewritten":
      return "bg-amber-500/15 text-amber-300";
    case "scenario_started":
      return "bg-slate-700/40 text-slate-300";
    default:
      return "bg-slate-800/60 text-slate-400";
  }
}

function relativeMs(current: string, base: string): string {
  const diff = new Date(current).getTime() - new Date(base).getTime();
  if (diff < 1000) return `+${diff}ms`;
  return `+${(diff / 1000).toFixed(2)}s`;
}

function EventRow({ event, base }: { event: AuditEvent; base: string }) {
  const tag = (
    <span
      className={
        "rounded-md px-2 py-0.5 font-mono text-[11px] " +
        categoryStyle(event.message)
      }
    >
      {event.message}
    </span>
  );
  const time = (
    <span className="font-mono text-[11px] text-slate-500">
      {relativeMs(event.timestamp, base)}
    </span>
  );

  if (!event.metadata) {
    return (
      <li className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950/40 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-3" />
          {tag}
        </div>
        {time}
      </li>
    );
  }

  return (
    <li>
      <details className="group rounded-md border border-slate-800 bg-slate-950/40 open:bg-slate-950/70">
        <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 [&::-webkit-details-marker]:hidden">
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 text-slate-600 transition-transform group-open:rotate-90">
              ›
            </span>
            {tag}
          </div>
          {time}
        </summary>
        <pre className="overflow-x-auto border-t border-slate-800 px-3 py-2 text-[11px] text-slate-400">
          {JSON.stringify(event.metadata, null, 2)}
        </pre>
      </details>
    </li>
  );
}

export default function AuditLog({ result }: { result?: ScenarioResult }) {
  if (!result) {
    return (
      <Card title="Audit log" subtitle="Append-only trail">
        <EmptyState glyph="≡">Event timeline will appear here.</EmptyState>
      </Card>
    );
  }

  const base =
    result.auditLog[0]?.timestamp ?? new Date().toISOString();

  return (
    <Card
      title="Audit log"
      subtitle={`Append-only trail · ${result.auditLog.length} events`}
    >
      <ul className="space-y-1.5">
        {result.auditLog.map((event, i) => (
          <EventRow key={i} event={event} base={base} />
        ))}
      </ul>
    </Card>
  );
}
