import Badge from "./ui/Badge";
import { ShieldIcon } from "./ui/Icons";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/75 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
            <ShieldIcon className="h-4 w-4" />
          </span>
          <span className="flex items-baseline gap-1.5">
            <span className="text-base font-semibold tracking-tight text-slate-900">
              AgentFirewall
            </span>
            <span className="hidden text-xs text-slate-400 sm:inline">
              by TrueFoundry
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          <a
            href="#demo"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Demo
          </a>
          <a
            href="#policy"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Policy Engine
          </a>
          <a
            href="#replay"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Replay Suite
          </a>
          <a
            href="#audit"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Audit
          </a>
        </nav>

        <Badge tone="emerald" size="sm">
          <span className="relative mr-0.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Simulated Gateway
        </Badge>
      </div>
    </header>
  );
}
