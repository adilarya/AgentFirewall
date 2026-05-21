import type { ReactNode } from "react";

export default function EmptyState({
  glyph,
  children,
}: {
  glyph: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-4 text-center">
      <div
        aria-hidden
        className="select-none text-3xl leading-none text-slate-700"
      >
        {glyph}
      </div>
      <p className="text-sm text-slate-500">{children}</p>
    </div>
  );
}
