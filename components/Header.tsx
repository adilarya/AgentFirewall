export default function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/60 px-6 py-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-slate-100">
              AgentFirewall
            </h1>
            <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-indigo-300">
              demo
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Runtime policy enforcement for AI agents · TrueFoundry MCP Gateway
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Adil Arya · Eshwar Rajasekar
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start rounded-md border border-emerald-700/40 bg-emerald-500/5 px-2.5 py-1 text-xs md:self-auto">
          <span aria-hidden className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="font-mono text-emerald-300">policy v0</span>
          <span className="text-slate-600">·</span>
          <span className="font-mono text-slate-400">5 scenarios</span>
        </div>
      </div>
    </header>
  );
}
