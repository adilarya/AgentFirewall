import type { ReactNode } from "react";

interface Props {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  eyebrow?: string;
  accent?: "default" | "emerald" | "rose" | "amber" | "sky" | "indigo";
  emphasized?: boolean;
  className?: string;
  children: ReactNode;
}

const ACCENT_RING: Record<NonNullable<Props["accent"]>, string> = {
  default: "ring-slate-200",
  emerald: "ring-emerald-200",
  rose: "ring-rose-200",
  amber: "ring-amber-200",
  sky: "ring-sky-200",
  indigo: "ring-indigo-200",
};

const ACCENT_ICON_BG: Record<NonNullable<Props["accent"]>, string> = {
  default: "bg-slate-100 text-slate-600",
  emerald: "bg-emerald-50 text-emerald-600",
  rose: "bg-rose-50 text-rose-600",
  amber: "bg-amber-50 text-amber-700",
  sky: "bg-sky-50 text-sky-600",
  indigo: "bg-indigo-50 text-indigo-600",
};

export default function Card({
  title,
  subtitle,
  icon,
  eyebrow,
  accent = "default",
  emphasized = false,
  className = "",
  children,
}: Props) {
  return (
    <section
      className={
        "flex h-full flex-col rounded-2xl bg-white p-5 ring-1 transition " +
        (emphasized
          ? "shadow-lg shadow-indigo-500/5 ring-2 "
          : "shadow-sm ring-1 ") +
        ACCENT_RING[accent] +
        " " +
        className
      }
    >
      {(title || icon || eyebrow) && (
        <header className="mb-4 flex items-start gap-3">
          {icon ? (
            <div
              className={
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl " +
                ACCENT_ICON_BG[accent]
              }
            >
              {icon}
            </div>
          ) : null}
          <div className="min-w-0 flex-1">
            {eyebrow ? (
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {eyebrow}
              </div>
            ) : null}
            {title ? (
              <h3 className="text-base font-semibold text-slate-900">
                {title}
              </h3>
            ) : null}
            {subtitle ? (
              <p className="text-sm text-slate-500">{subtitle}</p>
            ) : null}
          </div>
        </header>
      )}
      <div className="flex-1">{children}</div>
    </section>
  );
}
