import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-slate-900 text-white shadow-sm hover:bg-slate-800 disabled:bg-slate-400",
  secondary:
    "bg-white text-slate-900 ring-1 ring-slate-200 shadow-sm hover:bg-slate-50 disabled:text-slate-400",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 disabled:text-slate-400",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
};

export default function Button({
  variant = "primary",
  size = "md",
  leadingIcon,
  trailingIcon,
  className = "",
  children,
  ...rest
}: Props) {
  return (
    <button
      className={
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition disabled:cursor-not-allowed " +
        VARIANTS[variant] +
        " " +
        SIZES[size] +
        " " +
        className
      }
      {...rest}
    >
      {leadingIcon ? <span className="inline-flex">{leadingIcon}</span> : null}
      {children}
      {trailingIcon ? (
        <span className="inline-flex">{trailingIcon}</span>
      ) : null}
    </button>
  );
}
