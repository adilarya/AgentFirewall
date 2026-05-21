import { NextResponse } from "next/server";
import { getScenarioById } from "@/lib/scenarios";
import { getPurchase } from "@/lib/mock-db";
import { evaluatePolicy } from "@/lib/policy";
import { callMcpGateway } from "@/lib/mcp-client";
import { buildAuditLog, createAuditEvent } from "@/lib/audit";
import type {
  GatewayResult,
  ScenarioResult,
  ToolCall,
} from "@/lib/types";

export async function POST(req: Request) {
  const { scenarioId } = (await req.json()) as { scenarioId?: string };

  if (!scenarioId) {
    return NextResponse.json(
      { error: "scenarioId is required" },
      { status: 400 },
    );
  }

  const scenario = getScenarioById(scenarioId);
  if (!scenario) {
    return NextResponse.json(
      { error: `Unknown scenario: ${scenarioId}` },
      { status: 404 },
    );
  }

  const purchase = getPurchase();
  const decision = evaluatePolicy(scenario.toolCall, purchase);

  const audit = [
    createAuditEvent("scenario_started", { scenarioId: scenario.id }),
    createAuditEvent("customer_message_received", {
      message: scenario.customerMessage,
    }),
    createAuditEvent("agent_proposed_tool_call", { toolCall: scenario.toolCall }),
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
      "I'm not able to do that under our policy. The maximum I can offer is a $" +
      purchase.maxAllowedRefund +
      " voucher.";
    audit.push(
      createAuditEvent("mcp_call_skipped", { reason: "blocked_by_firewall" }),
    );
  } else if (decision.decision === "rewrite") {
    const rewritten: ToolCall = {
      server: scenario.toolCall.server,
      tool: scenario.toolCall.tool,
      args: decision.rewrittenArgs ?? scenario.toolCall.args,
    };
    audit.push(
      createAuditEvent("tool_call_rewritten", { rewrittenToolCall: rewritten }),
    );
    gatewayResult = await callMcpGateway(rewritten);
    audit.push(
      createAuditEvent("mcp_call_executed", { gatewayResult }),
    );
    finalAgentResponse =
      "I can't guarantee compensation, but I've flagged your case for a human reviewer.";
  } else if (decision.decision === "allow") {
    gatewayResult = await callMcpGateway(scenario.toolCall);
    audit.push(
      createAuditEvent("mcp_call_executed", { gatewayResult }),
    );
    finalAgentResponse =
      "Done. I've taken the policy-safe action you asked for.";
  } else {
    gatewayResult = {
      executed: false,
      status: "requires_human_approval",
    };
    finalAgentResponse =
      "I'm escalating this to a human reviewer. Someone will follow up shortly.";
    audit.push(
      createAuditEvent("mcp_call_skipped", { reason: "awaiting_human_approval" }),
    );
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

  return NextResponse.json(result);
}
