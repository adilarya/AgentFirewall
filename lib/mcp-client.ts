import type { GatewayResult, ToolCall } from "./types";

const TFY_TOKEN = process.env.TFY_TOKEN ?? "";
const GITHUB_MCP_URL = "https://gateway.truefoundry.ai/eshwar/mcp/github/server";
const GITHUB_OWNER = process.env.GITHUB_OWNER ?? "";
const GITHUB_REPO = process.env.GITHUB_REPO ?? "";

function shortId(): string {
  return Math.random().toString(36).slice(2, 10);
}

async function mcpCall(
  method: string,
  params: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const res = await fetch(GITHUB_MCP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TFY_TOKEN}`,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method,
      params,
      id: Date.now(),
    }),
  });
  return res.json() as Promise<Record<string, unknown>>;
}

export async function listTools(): Promise<unknown[]> {
  try {
    const data = await mcpCall("tools/list", {});
    const result = data?.result as Record<string, unknown> | undefined;
    return (result?.tools as unknown[]) ?? [];
  } catch {
    return [];
  }
}

async function createGitHubIssue(
  title: string,
  body: string,
): Promise<GatewayResult> {
  if (!TFY_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    return {
      executed: true,
      server: "github",
      tool: "create_issue",
      status: "simulated_truefoundry_mcp_gateway_route",
      traceId: "tfy_" + shortId(),
      output: { message: "Mock: GitHub env vars not configured" },
    };
  }

  try {
    const data = await mcpCall("tools/call", {
      name: "create_issue",
      arguments: { owner: GITHUB_OWNER, repo: GITHUB_REPO, title, body },
    });

    const result = data?.result as Record<string, unknown> | undefined;
    const content = result?.content as Array<{ text?: string }> | undefined;
    const rawText = content?.[0]?.text;
    let issueUrl: string | undefined;
    try {
      issueUrl = rawText ? (JSON.parse(rawText) as { html_url?: string }).html_url : undefined;
    } catch {
      issueUrl = undefined;
    }

    return {
      executed: true,
      server: "github",
      tool: "create_issue",
      status: "truefoundry_mcp_gateway_route",
      traceId: "tfy_" + shortId(),
      output: {
        message: issueUrl
          ? `GitHub issue created: ${issueUrl}`
          : "GitHub issue created (URL unavailable)",
      },
    };
  } catch (e) {
    return {
      executed: true,
      server: "github",
      tool: "create_issue",
      status: "simulated_truefoundry_mcp_gateway_route",
      traceId: "tfy_" + shortId(),
      output: { message: `Gateway error — mock fallback: ${String(e)}` },
    };
  }
}

export async function callMcpGateway(toolCall: ToolCall): Promise<GatewayResult> {
  if (toolCall.tool === "send_message") {
    const body = String(toolCall.args?.body ?? "");
    return createGitHubIssue("Customer Support Escalation", body);
  }

  if (toolCall.tool === "issue_refund") {
    const amount = toolCall.args?.amount;
    const purchase = toolCall.args?.purchase_amount;
    return createGitHubIssue(
      `Refund Request: $${amount}`,
      `Customer requested a $${amount} refund on a $${purchase} purchase. Routed through AgentFirewall.`,
    );
  }

  // Unknown tool — mock fallback
  return {
    executed: true,
    server: toolCall.server,
    tool: toolCall.tool,
    status: "simulated_truefoundry_mcp_gateway_route",
    traceId: "tfy_" + shortId(),
    output: { message: `Mock: tool "${toolCall.tool}" not mapped to a GitHub action` },
  };
}
