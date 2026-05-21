import type { GatewayResult, ToolCall } from "./types";

const GATEWAY_URL = process.env.TRUEFOUNDRY_MCP_GATEWAY_URL;
const API_KEY = process.env.TRUEFOUNDRY_API_KEY;
const SERVER_NAME = process.env.MCP_SERVER_NAME ?? "slack";

function shortId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function mockResponse(toolCall: ToolCall): GatewayResult {
  return {
    executed: true,
    server: toolCall.server,
    tool: toolCall.tool,
    status: "simulated_truefoundry_mcp_gateway_route",
    traceId: "tfy_" + shortId(),
    output: {
      message: `Mock execution of ${toolCall.tool} on ${toolCall.server} — TrueFoundry MCP Gateway not configured`,
    },
  };
}

export async function callMcpGateway(toolCall: ToolCall): Promise<GatewayResult> {
  if (GATEWAY_URL && API_KEY) {
    try {
      const res = await fetch(`${GATEWAY_URL}/invoke`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          server: SERVER_NAME,
          tool: toolCall.tool,
          args: toolCall.args,
        }),
      });

      if (!res.ok) {
        throw new Error(`Gateway returned ${res.status}`);
      }

      const data = (await res.json()) as Record<string, unknown>;

      return {
        executed: true,
        server: SERVER_NAME,
        tool: toolCall.tool,
        status: "truefoundry_mcp_gateway_route",
        traceId: (data.traceId as string | undefined) ?? "tfy_" + shortId(),
        output: {
          message: (data.message as string | undefined) ?? JSON.stringify(data),
        },
      };
    } catch {
      return {
        executed: true,
        server: SERVER_NAME,
        tool: toolCall.tool,
        status: "simulated_truefoundry_mcp_gateway_route",
        traceId: "tfy_" + shortId(),
        output: {
          message: `Gateway unreachable — falling back to mock`,
        },
      };
    }
  }

  return mockResponse(toolCall);
}
