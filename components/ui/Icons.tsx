import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & { className?: string };

function Base({ children, className, ...rest }: Props & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ?? "h-4 w-4"}
      aria-hidden
      {...rest}
    >
      {children}
    </svg>
  );
}

export const ShieldIcon = (p: Props) => (
  <Base {...p}>
    <path d="M12 3 5 6v6c0 4.5 3 8 7 9 4-1 7-4.5 7-9V6l-7-3Z" />
    <path d="M9 12l2 2 4-4" />
  </Base>
);

export const CheckIcon = (p: Props) => (
  <Base {...p}>
    <path d="M5 12.5l4 4 10-10" />
  </Base>
);

export const CheckCircleIcon = (p: Props) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12l3 3 5-6" />
  </Base>
);

export const XIcon = (p: Props) => (
  <Base {...p}>
    <path d="M6 6l12 12 M6 18L18 6" />
  </Base>
);

export const XCircleIcon = (p: Props) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9 9l6 6 M9 15l6-6" />
  </Base>
);

export const BanIcon = (p: Props) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M5.6 5.6l12.8 12.8" />
  </Base>
);

export const EditIcon = (p: Props) => (
  <Base {...p}>
    <path d="M14 4l6 6L10 20H4v-6L14 4Z" />
    <path d="M13 5l6 6" />
  </Base>
);

export const AlertIcon = (p: Props) => (
  <Base {...p}>
    <path d="M12 3l10 17H2L12 3Z" />
    <path d="M12 10v5 M12 18v0.5" />
  </Base>
);

export const ArrowRightIcon = (p: Props) => (
  <Base {...p}>
    <path d="M5 12h14 M13 6l6 6-6 6" />
  </Base>
);

export const ChevronRightIcon = (p: Props) => (
  <Base {...p}>
    <path d="M9 6l6 6-6 6" />
  </Base>
);

export const UserIcon = (p: Props) => (
  <Base {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
  </Base>
);

export const UserCheckIcon = (p: Props) => (
  <Base {...p}>
    <circle cx="10" cy="8" r="4" />
    <path d="M2 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 4.5 2" />
    <path d="M16 18l2 2 4-4" />
  </Base>
);

export const CodeIcon = (p: Props) => (
  <Base {...p}>
    <path d="M9 7l-5 5 5 5 M15 7l5 5-5 5" />
  </Base>
);

export const CloudIcon = (p: Props) => (
  <Base {...p}>
    <path d="M7 18h10a4 4 0 0 0 0.5-7.97A6 6 0 0 0 5.6 11 4 4 0 0 0 7 18Z" />
  </Base>
);

export const ServerIcon = (p: Props) => (
  <Base {...p}>
    <rect x="3" y="4" width="18" height="7" rx="2" />
    <rect x="3" y="13" width="18" height="7" rx="2" />
    <path d="M7 7.5v0 M7 16.5v0" />
  </Base>
);

export const ClockIcon = (p: Props) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Base>
);

export const PlayIcon = (p: Props) => (
  <Base {...p}>
    <path d="M7 5l12 7-12 7V5Z" />
  </Base>
);

export const RepeatIcon = (p: Props) => (
  <Base {...p}>
    <path d="M4 11V9a4 4 0 0 1 4-4h12 M16 1l4 4-4 4" />
    <path d="M20 13v2a4 4 0 0 1-4 4H4 M8 23l-4-4 4-4" />
  </Base>
);

export const SparkleIcon = (p: Props) => (
  <Base {...p}>
    <path d="M12 4v4 M12 16v4 M4 12h4 M16 12h4 M6 6l3 3 M15 15l3 3 M6 18l3-3 M15 9l3-3" />
  </Base>
);

export const LockIcon = (p: Props) => (
  <Base {...p}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Base>
);

export const ArrowUpRightIcon = (p: Props) => (
  <Base {...p}>
    <path d="M7 17L17 7 M8 7h9v9" />
  </Base>
);
