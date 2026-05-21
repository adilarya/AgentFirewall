import type { ReactNode } from "react";
import type { DecisionType } from "@/lib/types";

type Tone =
  | "neutral"
  | "emerald"
  | "rose"
  | "amber"
  | "sky"
  | "indigo"
  | "slate";

interface Props {
  tone?: Tone;
  size?: "sm" | "md";
  leadingIcon?: ReactNode;
  children: ReactNode;
  className?: string;
}

const TONES: Record<Tone, string> = {
  neutral: "bg-slate-100 text-slate-700 ring-slate-200",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rose: "bg-rose-50 text-rose-700 ring-rose-200",
  amber: "bg-amber-50 text-amber-800 ring-amber-200",
  sky: "bg-sky-50 text-sky-700 ring-sky-200",
  indigo: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  slate: "bg-slate-900/5 text-slate-700 ring-slate-900/10",
};

const SIZES: Record<NonNullable<Props["size"]>, string> = {
  sm: "px-2 py-0.5 text-[11px]",
  md: "px-2.5 py-1 text-xs",
};

export default function Badge({
  tone = "neutral",
  size = "md",
  leadingIcon,
  children,
  className = "",
}: Props) {
  return (
    <span
      className={
        "inline-flex items-center gap-1 rounded-full font-medium ring-1 ring-inset " +
        TONES[tone] +
        " " +
        SIZES[size] +
        " " +
        className
      }
    >
      {leadingIcon ? (
        <span className="inline-flex">{leadingIcon}</span>
      ) : null}
      {children}
    </span>
  );
}

export const DECISION_TONE: Record<DecisionType, Tone> = {
  allow: "emerald",
  block: "rose",
  rewrite: "amber",
  escalate: "sky",
};

export const DECISION_LABEL: Record<DecisionType, string> = {
  allow: "Allowed",
  block: "Blocked",
  rewrite: "Rewritten",
  escalate: "Escalated",
};
