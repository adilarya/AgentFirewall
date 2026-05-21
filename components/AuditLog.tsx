import type { ScenarioResult } from "@/lib/types";
import Card from "./internal/Card";

export default function AuditLog({ result }: { result?: ScenarioResult }) {
  return (
    <Card title="Audit log" subtitle="Append-only trail">
      {!result ? (
        <p className="text-sm text-slate-500">No events yet.</p>
      ) : (
        <ul className="space-y-2 text-xs">
          {result.auditLog.map((event, i) => (
            <li
              key={i}
              className="rounded-md border border-slate-800 bg-slate-950/40 p-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-slate-300">{event.message}</span>
                <span className="text-slate-500">{event.timestamp}</span>
              </div>
              {event.metadata ? (
                <pre className="mt-1 overflow-x-auto text-[11px] text-slate-400">
                  {JSON.stringify(event.metadata, null, 2)}
                </pre>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
