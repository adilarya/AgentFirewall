import type { ReactNode } from "react";

export default function Card({
  title,
  subtitle,
  step,
  accent,
  children,
}: {
  title: string;
  subtitle?: string;
  step?: number;
  accent?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      className={
        "flex h-full flex-col rounded-lg border bg-slate-900/40 p-4 " +
        (accent
          ? "border-indigo-500/60 ring-1 ring-indigo-500/20"
          : "border-slate-800")
      }
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
            {title}
          </h2>
          {subtitle ? (
            <p className="text-xs text-slate-500">{subtitle}</p>
          ) : null}
        </div>
        {typeof step === "number" ? (
          <span className="shrink-0 rounded-md border border-slate-700 bg-slate-800/60 px-2 py-0.5 font-mono text-[10px] text-slate-400">
            {step} / 4
          </span>
        ) : null}
      </div>
      <div className="flex-1">{children}</div>
    </section>
  );
}
