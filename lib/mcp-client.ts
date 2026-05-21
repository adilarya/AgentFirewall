import type { GatewayResult, ToolCall } from "./types";

const TFY_TOKEN = process.env.TFY_TOKEN ?? "";
const GITHUB_MCP_URL = "https://gateway.truefoundry.ai/eshwar/mcp/github/server";
const GITHUB_OWNER = process.env.GITHUB_OWNER ?? "Eshwar-R-97";
const GITHUB_REPO = process.env.GITHUB_REPO ?? "trialrepo4mcphack";

function shortId(): string {
  return Math.random().toString(36).slice(2, 10);
}

// TrueFoundry uses MCP Streamable HTTP transport — responses come back as SSE.
// Parse the first `data:` line from the SSE stream.
async function parseSseResponse(res: Response): Promise<Record<string, unknown>> {
  const text = await res.text();
  const match = text.match(/^data:\s*(.+)$/m);
  if (!match) throw new Error("No SSE data line in response");
  return JSON.parse(match[1]) as Record<string, unknown>;
}

async function mcpCall(
  method: string,
  params: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const res = await fetch(GITHUB_MCP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json, text/event-stream",
      "Authorization": `Bearer ${TFY_TOKEN}`,
    },
    body: JSON.stringify({ jsonrpc: "2.0", method, params, id: Date.now() }),
  });
  return parseSseResponse(res);
}

async function createGitHubIssue(
  title: string,
  body: string,
): Promise<GatewayResult> {
  if (!TFY_TOKEN) {
    return {
      executed: true,
      server: "github",
      tool: "issue_write",
      status: "simulated_truefoundry_mcp_gateway_route",
      traceId: "tfy_" + shortId(),
      output: { message: "Mock: TFY_TOKEN not configured" },
    };
  }

  try {
    const data = await mcpCall("tools/call", {
      name: "issue_write",
      arguments: {
        method: "create",
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        title,
        body,
      },
    });

    const result = data?.result as Record<string, unknown> | undefined;
    const content = result?.content as Array<{ text?: string }> | undefined;
    const rawText = content?.[0]?.text ?? "";

    let issueUrl: string | undefined;
    try {
      const parsed = JSON.parse(rawText) as { url?: string };
      issueUrl = parsed.url;
    } catch {
      issueUrl = undefined;
    }

    return {
      executed: true,
      server: "github",
      tool: "issue_write",
      status: "truefoundry_mcp_gateway_route",
      traceId: "tfy_" + shortId(),
      output: {
        message: issueUrl
          ? `GitHub issue created: ${issueUrl}`
          : "GitHub issue created",
      },
    };
  } catch (e) {
    return {
      executed: true,
      server: "github",
      tool: "issue_write",
      status: "simulated_truefoundry_mcp_gateway_route",
      traceId: "tfy_" + shortId(),
      output: { message: `Gateway error — mock fallback: ${String(e)}` },
    };
  }
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

  return {
    executed: true,
    server: toolCall.server,
    tool: toolCall.tool,
    status: "simulated_truefoundry_mcp_gateway_route",
    traceId: "tfy_" + shortId(),
    output: { message: `Mock: tool "${toolCall.tool}" not mapped to a GitHub action` },
  };
}
