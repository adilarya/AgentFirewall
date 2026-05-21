# AgentFirewall

Runtime policy enforcement for AI agents, designed to sit in front of the TrueFoundry MCP Gateway.

## Problem

Customer-support agents powered by LLMs are easy to manipulate. A frustrated customer can pressure an agent into promising a $500 refund on a $50 purchase, fabricating manager approval, or issuing written guarantees the business never authorized. Once the agent invokes a tool — Slack, Stripe, PayPal, GitHub, Linear — the damage is done.

## Solution

AgentFirewall is a runtime policy layer that intercepts tool calls *before* they hit the gateway. For each proposed tool call it returns one of four decisions:

- **allow** — within policy, forward to the gateway as-is.
- **block** — refuse to execute; agent must respond within policy.
- **rewrite** — neutralize the unsafe payload (e.g. replace a guarantee with an escalation note) and forward the safe version.
- **escalate** — hand off to a human reviewer; do not execute.

Every decision, rewrite, and gateway call lands in an append-only audit log.

## How TrueFoundry MCP Gateway fits in

The gateway is the single egress point for all MCP tool calls. AgentFirewall's `lib/mcp-client.ts` is the integration seam: today it returns a simulated result; in production it will POST to `TRUEFOUNDRY_MCP_GATEWAY_URL` with `TRUEFOUNDRY_API_KEY`, targeting prebuilt MCP servers (Slack, Stripe, PayPal, GitHub, Linear). Because every tool call flows through the gateway, the firewall has one place to enforce policy across every downstream system.

## How to run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. Click any scenario button to see the firewall decision, or **Run replay suite** to evaluate all five at once.

The API is exposed at:

- `POST /api/run-scenario` — body: `{ "scenarioId": "..." }`
- `POST /api/run-replay` — no body; returns expected vs. actual decisions.

## Project layout

```
app/            Next.js App Router + API routes
components/     UI panels (Header, ScenarioControls, panels, AuditLog, ReplaySuite)
lib/            Types, mock data, scenarios, policy, simulated MCP client, audit helpers
```

## Where future real MCP integration will go

- `lib/mcp-client.ts` — replace the simulated response with a real `fetch` to the TrueFoundry MCP Gateway. Env vars are already documented inline.
- `lib/policy.ts` — the current keyword rules are placeholders. Real policy will combine purchase-aware checks with an LLM-as-judge sanity pass.
- `.env.example` lists the env vars the gateway client expects.

## Team

- Adil Arya
- Eshwar Rajasekar
