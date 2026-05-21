"use client";

import { useRef, useState } from "react";
import AgentResponse from "@/components/AgentResponse";
import AuditLog from "@/components/AuditLog";
import CustomerChat from "@/components/CustomerChat";
import FirewallDecisionPanel from "@/components/FirewallDecisionPanel";
import FlowStrip from "@/components/FlowStrip";
import GatewayPanel from "@/components/GatewayPanel";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ReplaySuite from "@/components/ReplaySuite";
import ScenarioControls from "@/components/ScenarioControls";
import ToolCallPanel from "@/components/ToolCallPanel";
import Section from "@/components/ui/Section";
import { SCENARIOS } from "@/lib/scenarios";
import type { ReplayResult, ScenarioResult } from "@/lib/types";

export default function Page() {
  const [result, setResult] = useState<ScenarioResult | undefined>();
  const [replay, setReplay] = useState<ReplayResult[] | undefined>();
  const [loadingId, setLoadingId] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const loading = loadingId !== undefined;
  const demoRef = useRef<HTMLDivElement>(null);
  const replayRef = useRef<HTMLDivElement>(null);

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
      demoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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
      replayRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoadingId(undefined);
    }
  }

  function runFirstScenario() {
    runScenario(SCENARIOS[0]!.id);
  }

  return (
    <div className="min-h-screen">
      <Header />

      <Hero onRunDemo={runFirstScenario} onRunReplay={runReplay} />

      <div className="pb-6">
        <FlowStrip result={result} />
      </div>

      <Section
        id="policy"
        eyebrow="Choose a scenario"
        title="See AgentFirewall react in real time"
        subtitle="Each scenario reproduces a real customer-support failure mode. Click one to send a tool call through the policy engine."
      >
        {error ? (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}
        <ScenarioControls
          onRunScenario={runScenario}
          loading={loading}
          loadingId={loadingId}
          activeScenarioId={result?.scenarioId}
        />
      </Section>

      <div ref={demoRef} className="scroll-mt-20">
        <Section
          id="demo"
          eyebrow="Live demo workspace"
          title={
            result
              ? `Scenario: ${result.scenarioName}`
              : "Watch the firewall stop unsafe actions"
          }
          subtitle="We don’t just stop unauthorized actions. We stop unauthorized promises."
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <CustomerChat result={result} />
            <ToolCallPanel result={result} />
            <FirewallDecisionPanel result={result} />
            <GatewayPanel result={result} />
          </div>

          <div className="mt-6">
            <AgentResponse result={result} />
          </div>
        </Section>
      </div>

      <Section
        id="audit"
        eyebrow="Compliance"
        title="Every decision is auditable"
        subtitle="An append-only event timeline captures every customer message, tool call, firewall decision, and gateway routing event."
      >
        <AuditLog result={result} />
      </Section>

      <div ref={replayRef} className="scroll-mt-20">
        <Section
          id="replay"
          eyebrow="Regression testing"
          title="Replay suite"
          subtitle="Run the full policy against every scenario and produce a compliance report."
        >
          <ReplaySuite results={replay} />
        </Section>
      </div>

      <footer className="border-t border-slate-200/70 bg-white/60 py-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-2 px-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <div>
            AgentFirewall · Hackathon demo · Adil Arya · Eshwar Rajasekar
          </div>
          <div>
            Safe or rewritten actions route through TrueFoundry MCP Gateway.
            Blocked actions never reach MCP execution.
          </div>
        </div>
      </footer>
    </div>
  );
}
