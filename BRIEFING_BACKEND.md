# AgentFirewall — Backend / Policy Brief (for Eshwar's Claude)

> **Architecture:** Single Next.js + TypeScript app. The policy + MCP integration lives in `lib/policy.ts` and `lib/mcp-client.ts` inside the Next.js project — no Python, no separate process.

---

## Your scope

You (Eshwar) own exactly two files:

- `lib/policy.ts` — the `evaluatePolicy(toolCall, purchase)` function
- `lib/mcp-client.ts` — the `callMcpGateway(toolCall)` function

Everything else is either Adil's (UI) or shared contract that requires coordination before changing.

---

## Current state

**`lib/policy.ts`** is a keyword-matching placeholder operating on `toolCall.args.body`:

| Pattern in body | Decision |
|---|---|
| `$500`, `full compensation`, `full refund`, `manager approved` | **block** |
| `guarantee` / `guaranteed` | **rewrite** (replaces body with safe escalation text) |
| `$5 voucher`, `human review` | **allow** |
| anything else | **escalate** |

**`lib/mcp-client.ts`** returns a simulated gateway response with a random trace ID. No network call. Env vars are documented inline but unused.

This is enough for the demo to "work end-to-end" but it's brittle (a `$400` refund passes through as escalate, not block). Your job is to harden it.

---

## Contract — DO NOT BREAK

Both functions are called by `app/api/run-scenario/route.ts` and `app/api/run-replay/route.ts`. The signatures and return shapes are:

```ts
// from lib/types.ts
export type DecisionType = "allow" | "block" | "rewrite" | "escalate";

export interface ToolCall {
  server: string;
  tool: string;
  args: Record<string, unknown>;
}

export interface FirewallDecision {
  decision: DecisionType;
  reason: string;
  policy: string;
  maxAllowed?: number;
  rewrittenArgs?: Record<string, unknown>;
}

export interface GatewayResult {
  executed: boolean;
  server?: string;
  tool?: string;
  status: string;
  traceId?: string;
  output?: { message: string };
}

// in lib/policy.ts
export function evaluatePolicy(toolCall: ToolCall, purchase: Purchase): FirewallDecision;

// in lib/mcp-client.ts
export async function callMcpGateway(toolCall: ToolCall): Promise<GatewayResult>;
```

UI panels read every one of these fields. **`lib/types.ts` is the contract — do not modify it without pinging Adil first.** If you need a new field, add it as optional (`field?: T`) so the UI keeps working until panels are updated.

---

## Files you must NOT touch

- `components/**` — UI, owned by Adil
- `app/page.tsx` — UI state wiring
- `app/api/**` — orchestration. Touching this changes the contract between front-end and back-end.
- `lib/types.ts` — coordinate first (see above)
- `lib/mock-db.ts` — fixed demo data: one purchase, `$50`, 10% cap, `$5` max refund
- `lib/scenarios.ts` — fixed demo scenarios and replay expectations
- `lib/audit.ts` — helpers only, no logic
- `next.config.js`, `tsconfig.json`, `tailwind.config.ts`, `package.json` — coordinate before adding deps

---

## What to build (prioritized)

### `lib/policy.ts` — high impact first

1. **Amount-aware blocking.** Parse dollar amounts out of `body` (regex like `/\$(\d+)/`) and compare to `purchase.maxAllowedRefund`. A `$400` promise should block even though "$400" isn't a hardcoded keyword. Same for `issue_refund`-style tools if/when they exist.
2. **Better rewrite text.** Today the rewrite body is hardcoded. Template it from the original `body` + purchase context so the rewritten message references the actual order id and policy cap.
3. **Reason strings that explain themselves.** The UI shows `reason` verbatim. Make every reason a sentence a non-engineer can read — include the dollar math when relevant ("$500 > $5 policy cap on $50 purchase").
4. *(stretch)* **LLM-as-judge fallback** for the `escalate` default branch. Call Claude/OpenAI to classify intent, gated by an env var so the demo never depends on it.

### `lib/mcp-client.ts` — when env vars are set

1. **Real TrueFoundry call.** Replace the simulated response with a real `fetch`:
   ```ts
   POST `${process.env.TRUEFOUNDRY_MCP_GATEWAY_URL}/invoke`
   headers: { Authorization: `Bearer ${process.env.TRUEFOUNDRY_API_KEY}` }
   body: { server: process.env.MCP_SERVER_NAME, tool, args }
   ```
2. **Keep the simulated path as fallback.** If the env vars are unset OR the fetch throws, fall back to the current simulated response with `status: "simulated_truefoundry_mcp_gateway_route"`. The UI demo must never break because env vars are missing or the network is flaky.
3. **Preserve `traceId`.** Whatever the real gateway returns, surface it in `GatewayResult.traceId` so the UI can show it.

---

## Env vars

In `.env.local` (gitignored):

```
TRUEFOUNDRY_MCP_GATEWAY_URL=https://...
TRUEFOUNDRY_API_KEY=...
MCP_SERVER_NAME=slack
```

Template lives at `.env.example`. Real values come from the TrueFoundry dashboard. Until they're set, simulation must still work.

---

## Replay suite — your regression check

Expected decisions per scenario (defined in `lib/scenarios.ts`):

| Scenario ID | Expected |
|---|---|
| `safe_policy_action` | `allow` |
| `angry_customer_attack` | `block` |
| `fake_manager_approval` | `block` |
| `unauthorized_promise` | `rewrite` |
| `valid_escalation` | `allow` |

After every change, open the app, click **Run replay suite** — every row must say PASS. 5/5 is the bar.

---

## How to run / test

```powershell
npm install            # if you haven't
npm run dev            # http://localhost:3000
```

Click any scenario in the UI, or hit the API directly:

```powershell
# single scenario
curl -X POST http://localhost:3000/api/run-scenario `
  -H "Content-Type: application/json" `
  -d '{\"scenarioId\":\"angry_customer_attack\"}'

# full replay
curl -X POST http://localhost:3000/api/run-replay
```

Typecheck:
```powershell
npx tsc --noEmit
```

---

## Coordination protocol with Adil

- Need a new field on `FirewallDecision` or `GatewayResult`? → add it as **optional**, mention it, Adil wires the UI in a follow-up.
- Changing a function signature? → don't. Wrap, don't break.
- Changing what `app/api/**` does? → don't without pinging.
- Adding a dep? → mention first; the scaffold has only `next`, `react`, `tailwind`, types.

---

## Quality bar

- TypeScript strict — no `any`, no `// @ts-ignore`
- Simulated path always works when env vars are unset
- 5/5 replay suite passing on every commit
- No secrets in git (`.env.local`, never `.env.example`)
- No new files outside `lib/policy.ts` and `lib/mcp-client.ts` without coordinating

---

## Team

- Adil Arya — UI (`app/page.tsx`, `components/**`)
- Eshwar Rajasekar — Policy + MCP integration (`lib/policy.ts`, `lib/mcp-client.ts`)
