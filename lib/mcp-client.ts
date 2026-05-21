import type { GatewayResult, ToolCall } from "./types";

// Future real integration will read these env vars:
//   process.env.TRUEFOUNDRY_MCP_GATEWAY_URL
//   process.env.TRUEFOUNDRY_API_KEY
//   process.env.MCP_SERVER_NAME
//
// Real call shape (planned):
//   POST `${TRUEFOUNDRY_MCP_GATEWAY_URL}/invoke`
//     headers: { Authorization: `Bearer ${TRUEFOUNDRY_API_KEY}` }
//     body: { server: toolCall.server, tool: toolCall.tool, args: toolCall.args }

function shortId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export async function callMcpGateway(toolCall: ToolCall): Promise<GatewayResult> {
  // Simulated TrueFoundry MCP Gateway routing. No network call yet.
  return {
    executed: true,
    server: toolCall.server,
    tool: toolCall.tool,
    status: "simulated_truefoundry_mcp_gateway_route",
    traceId: "tfy_" + shortId(),
    output: {
      message: "Simulated MCP tool execution successful",
    },
  };
}
