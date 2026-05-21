"use client";

import { useState } from "react";
import Header from "@/components/Header";
import ScenarioControls from "@/components/ScenarioControls";
import CustomerChat from "@/components/CustomerChat";
import ToolCallPanel from "@/components/ToolCallPanel";
import FirewallDecisionPanel from "@/components/FirewallDecisionPanel";
import GatewayPanel from "@/components/GatewayPanel";
import AgentResponse from "@/components/AgentResponse";
import AuditLog from "@/components/AuditLog";
import ReplaySuite from "@/components/ReplaySuite";
import VerdictHero from "@/components/VerdictHero";
import type { ReplayResult, ScenarioResult } from "@/lib/types";

function PipelineArrow() {
  return (
    <div
      aria-hidden
      className="hidden select-none items-center justify-center text-2xl text-slate-600 xl:flex"
    >
      →
    </div>
  );
}

export default function Page() {
  const [result, setResult] = useState<ScenarioResult | undefined>();
  const [replay, setReplay] = useState<ReplayResult[] | undefined>();
  const [loadingId, setLoadingId] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const loading = loadingId !== undefined;

  async function runScenario(scenarioId: string) {
    setLoadingId(scenarioId);
    setError(undefined);
    try {
      const res = await fetch("/api/run-scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioId }),
      });
      if (!res.ok) throw new Error(`run-scenario failed: ${res.status}`);
      const data = (await res.json()) as ScenarioResult;
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoadingId(undefined);
    }
  }

  async function runReplay() {
    setLoadingId("__replay__");
    setError(undefined);
    try {
      const res = await fetch("/api/run-replay", { method: "POST" });
      if (!res.ok) throw new Error(`run-replay failed: ${res.status}`);
      const data = (await res.json()) as ReplayResult[];
      setReplay(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoadingId(undefined);
    }
  }

  return (
    <div>
      <Header />
      <main className="mx-auto max-w-6xl space-y-4 px-6 py-6">
        <ScenarioControls
          onRunScenario={runScenario}
          onRunReplay={runReplay}
          loading={loading}
          loadingId={loadingId}
          activeScenarioId={result?.scenarioId}
        />

        {error ? (
          <div className="rounded-md border border-rose-700 bg-rose-500/10 p-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        <VerdictHero result={result} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] xl:items-stretch xl:gap-2">
          <CustomerChat result={result} />
          <PipelineArrow />
          <ToolCallPanel result={result} />
          <PipelineArrow />
          <FirewallDecisionPanel result={result} />
          <PipelineArrow />
          <GatewayPanel result={result} />
        </div>

        <AgentResponse result={result} />

        <AuditLog result={result} />
        <ReplaySuite results={replay} />
      </main>
    </div>
  );
}
