import { NextResponse } from "next/server";
import { EXPECTED_DECISIONS, SCENARIOS } from "@/lib/scenarios";
import { getPurchase } from "@/lib/mock-db";
import { evaluatePolicy } from "@/lib/policy";
import { callMcpGateway } from "@/lib/mcp-client";
import { buildAuditLog, createAuditEvent } from "@/lib/audit";
import type {
  GatewayResult,
  ReplayResult,
  ScenarioId,
  ScenarioResult,
  ToolCall,
} from "@/lib/types";

export async function POST() {
  const purchase = getPurchase();
  const results: ReplayResult[] = [];

  for (const scenario of SCENARIOS) {
    const decision = evaluatePolicy(scenario.toolCall, purchase);

    const audit = [
      createAuditEvent("scenario_started", { scenarioId: scenario.id }),
      createAuditEvent("firewall_decision", { decision }),
    ];

    let gatewayResult: GatewayResult;
    let finalAgentResponse: string;

    if (decision.decision === "block") {
      gatewayResult = {
        executed: false,
        status: "blocked_before_mcp_execution",
      };
      finalAgentResponse =
        "I'm not able to do that under our policy. Max allowed is $" +
        purchase.maxAllowedRefund +
        ".";
    } else if (decision.decision === "rewrite") {
      const rewritten: ToolCall = {
        server: scenario.toolCall.server,
        tool: scenario.toolCall.tool,
        args: decision.rewrittenArgs ?? scenario.toolCall.args,
      };
      gatewayResult = await callMcpGateway(rewritten);
      finalAgentResponse =
        "Flagged for human review instead of guaranteeing compensation.";
    } else if (decision.decision === "allow") {
      gatewayResult = await callMcpGateway(scenario.toolCall);
      finalAgentResponse = "Policy-safe action executed.";
    } else {
      gatewayResult = {
        executed: false,
        status: "requires_human_approval",
      };
      finalAgentResponse = "Escalated to human reviewer.";
    }

    const result: ScenarioResult = {
      scenarioId: scenario.id,
      scenarioName: scenario.name,
      customerMessage: scenario.customerMessage,
      agentIntent: scenario.agentIntent,
      toolCall: scenario.toolCall,
      firewallDecision: decision,
      gatewayResult,
      finalAgentResponse,
      auditLog: buildAuditLog(...audit),
    };

    const expected = EXPECTED_DECISIONS[scenario.id as ScenarioId];
    results.push({
      scenarioId: scenario.id,
      scenarioName: scenario.name,
      expectedDecision: expected,
      actualDecision: decision.decision,
      pass: expected === decision.decision,
      result,
    });
  }

  return NextResponse.json(results);
}
