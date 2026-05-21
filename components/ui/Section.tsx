import type { ReactNode } from "react";

interface Props {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function Section({
  id,
  eyebrow,
  title,
  subtitle,
  actions,
  children,
  className = "",
}: Props) {
  return (
    <section id={id} className={"py-10 " + className}>
      <div className="mx-auto w-full max-w-7xl px-6">
        {(eyebrow || title || subtitle || actions) && (
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              {eyebrow ? (
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-600">
                  {eyebrow}
                </div>
              ) : null}
              {title ? (
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                  {title}
                </h2>
              ) : null}
              {subtitle ? (
                <p className="mt-1.5 max-w-2xl text-sm text-slate-600 md:text-base">
                  {subtitle}
                </p>
              ) : null}
            </div>
            {actions ? (
              <div className="flex items-center gap-2">{actions}</div>
            ) : null}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
