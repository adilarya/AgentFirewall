export default function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/60 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">AgentFirewall</h1>
          <p className="text-sm text-slate-400">
            Runtime policy enforcement for AI agents · TrueFoundry MCP Gateway
          </p>
        </div>
        <span className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-400">
          hackathon scaffold
        </span>
      </div>
    </header>
  );
}
