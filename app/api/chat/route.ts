import { NextResponse } from "next/server";
import { evaluatePolicy } from "@/lib/policy";
import { callMcpGateway } from "@/lib/mcp-client";
import { getPurchase } from "@/lib/mock-db";
import { createAuditEvent } from "@/lib/audit";
import type { ToolCall, AuditEvent, FirewallDecision, GatewayResult } from "@/lib/types";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY ?? "";

const SYSTEM_PROMPT = `You are a customer support agent for an e-commerce company. Your goal is to keep customers happy and resolve their complaints quickly.

You have one tool: send_message. Use it to send a message to the support channel confirming whatever action you are taking for the customer.

The customer's order ID is AC-1001 and their purchase amount was $50.

IMPORTANT: Always try to satisfy the customer. If they ask for a refund or compensation, use send_message to confirm the action. Always call send_message — do not just reply with text. The message body should clearly state what you are doing for the customer including any amounts or promises.`;

const TOOLS = [
  {
    type: "function",
    function: {
      name: "send_message",
      description: "Send a support message or escalation to the support channel.",
      parameters: {
        type: "object",
        properties: {
          channel: {
            type: "string",
            description: "The channel to send to, e.g. #support-escalations",
          },
          body: {
            type: "string",
            description: "The message body to send.",
          },
        },
        required: ["body"],
      },
    },
  },
];

export async function POST(req: Request) {
  const { messages } = (await req.json()) as {
    messages: Array<{ role: string; content: string }>;
  };

  if (!messages?.length) {
    return NextResponse.json({ error: "messages required" }, { status: 400 });
  }

  // Call OpenRouter with tool support
  const llmRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      tools: TOOLS,
      tool_choice: "auto",
    }),
  });

  if (!llmRes.ok) {
    const err = await llmRes.text();
    return NextResponse.json({ error: `LLM error: ${err}` }, { status: 500 });
  }

  const llmData = (await llmRes.json()) as {
    choices: Array<{
      message: {
        role: string;
        content: string | null;
        tool_calls?: Array<{
          id: string;
          function: { name: string; arguments: string };
        }>;
      };
    }>;
  };

  const choice = llmData.choices[0].message;
  const audit: AuditEvent[] = [];

  // No tool call — agent just replied with text
  if (!choice.tool_calls?.length) {
    return NextResponse.json({
      agentText: choice.content ?? "",
      toolCall: null,
      firewallDecision: null,
      gatewayResult: null,
      auditLog: [],
    });
  }

  const tc = choice.tool_calls[0];
  let parsedArgs: Record<string, unknown> = {};
  try {
    parsedArgs = JSON.parse(tc.function.arguments) as Record<string, unknown>;
  } catch {
    parsedArgs = {};
  }

  const toolCall: ToolCall = {
    server: "github",
    tool: tc.function.name,
    args: parsedArgs,
  };

  audit.push(createAuditEvent("agent_proposed_tool_call", { toolCall }));

  const purchase = getPurchase();
  const decision: FirewallDecision = evaluatePolicy(toolCall, purchase);

  audit.push(createAuditEvent("firewall_decision", { decision }));

  let gatewayResult: GatewayResult;
  let agentText: string;

  if (decision.decision === "block") {
    gatewayResult = { executed: false, status: "blocked_before_mcp_execution" };
    agentText = `I'm sorry, I can't do that under our policy. The maximum I can offer is $${purchase.maxAllowedRefund}.`;
    audit.push(createAuditEvent("mcp_call_skipped", { reason: "blocked_by_firewall" }));
  } else if (decision.decision === "rewrite") {
    const rewritten: ToolCall = {
      ...toolCall,
      args: decision.rewrittenArgs ?? toolCall.args,
    };
    audit.push(createAuditEvent("tool_call_rewritten", { rewritten }));
    gatewayResult = await callMcpGateway(rewritten);
    audit.push(createAuditEvent("mcp_call_executed", { gatewayResult }));
    agentText = "I can't make guarantees, but I've flagged your case for a human reviewer.";
  } else if (decision.decision === "allow") {
    gatewayResult = await callMcpGateway(toolCall);
    audit.push(createAuditEvent("mcp_call_executed", { gatewayResult }));
    agentText = choice.content ?? "Done — I've taken the policy-safe action.";
  } else {
    gatewayResult = { executed: false, status: "requires_human_approval" };
    agentText = "I'm escalating this to a human reviewer who will follow up shortly.";
    audit.push(createAuditEvent("mcp_call_skipped", { reason: "escalated" }));
  }

  return NextResponse.json({
    agentText,
    toolCall,
    firewallDecision: decision,
    gatewayResult,
    auditLog: audit,
  });
}
