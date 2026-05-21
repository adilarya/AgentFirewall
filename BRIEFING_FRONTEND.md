# AgentFirewall — Frontend / UI Brief (for Adil's Claude)

> **Architecture:** Single Next.js + TypeScript app. The firewall logic lives in `lib/policy.ts` and `lib/mcp-client.ts` in this same project, called by `app/api/**` routes — no separate backend process.

---

## Your scope

You (Adil) own:

- `app/page.tsx` — page-level state, fetch calls, layout
- `app/layout.tsx`, `app/globals.css` — shell + styling
- `components/**` — every panel
- `tailwind.config.ts` — styling extensions

Eshwar owns `lib/policy.ts` and `lib/mcp-client.ts`. Everything else is shared contract.

---

## Current state

**Layout** is a 4-step horizontal pipeline at xl breakpoint (2-col at md, stacked at mobile):

```
[ Customer chat ] → [ Tool call ] → [ Firewall decision ] → [ MCP Gateway ]
                          (AgentResponse below)
                          (AuditLog below)
                          (ReplaySuite below)
```

**Panels (all in `components/`):**
- `Header.tsx` — title + "hackathon scaffold" badge
- `ScenarioControls.tsx` — 5 scenario buttons + "Run replay suite"
- `CustomerChat.tsx` (step 1) — customer message + agent intent
- `ToolCallPanel.tsx` (step 2) — server / tool / args JSON
- `FirewallDecisionPanel.tsx` (step 3, accented) — color-coded decision, reason, policy, maxAllowed, rewrittenArgs
- `GatewayPanel.tsx` (step 4) — executed flag, server, tool, status, traceId
- `AgentResponse.tsx` — final customer-facing reply
- `AuditLog.tsx` — append-only event list
- `ReplaySuite.tsx` — PASS/FAIL table across all 5 scenarios
- `internal/Card.tsx` — shared shell: title/subtitle/step badge/accent

Page wiring lives in `app/page.tsx`: two fetch helpers (`runScenario`, `runReplay`), `useState` for `result` / `replay` / `loading` / `error`.

---

## Contract — what you consume

From `lib/types.ts` (do not modify without pinging Eshwar — UI panels are wired to these field names):

```ts
ScenarioResult {
  scenarioId, scenarioName, customerMessage, agentIntent
  toolCall:        { server, tool, args }
  firewallDecision: { decision, reason, policy, maxAllowed?, rewrittenArgs? }
  gatewayResult:    { executed, server?, tool?, status, traceId?, output? }
  finalAgentResponse
  auditLog:        AuditEvent[]
}

ReplayResult {
  scenarioId, scenarioName, expectedDecision, actualDecision, pass, result
}

DecisionType = "allow" | "block" | "rewrite" | "escalate"
```

Decision colors used consistently across `FirewallDecisionPanel` and `ReplaySuite`:
- `allow` → emerald
- `block` → rose
- `rewrite` → amber
- `escalate` → sky

---

## Files you must NOT touch

- `lib/policy.ts`, `lib/mcp-client.ts` — Eshwar's
- `lib/types.ts` — coordinate before any change; add new fields as optional from his side
- `lib/scenarios.ts`, `lib/mock-db.ts`, `lib/audit.ts` — shared, fixed
- `app/api/**` — orchestration; only change if the contract genuinely needs to
- `next.config.js`, `tsconfig.json` — config
- `package.json` — no new deps without coordinating

---

## UI plan — 8 steps, in order

Ordered for max demo impact per minute. Stopping points: after 3 = solid demo, after 5 = polished, after 8 = fully buttoned-up.

| # | Step | Status |
|---|------|--------|
| 1 | **Pipeline reflow** — 4-col horizontal flow with chevrons; AgentResponse split below | ✅ done |
| 2 | **Verdict hero strip** — big colored banner above the pipeline showing current decision | ✅ done |
| 3 | **Rewrite diff view** — in `FirewallDecisionPanel`, render original vs `rewrittenArgs.body` (stacked, strike-through on the dangerous version) | ✅ done |
| 4 | **ScenarioControls polish** — group buttons by expected verdict with color-tinted clusters, replay button on its own row | ✅ done |
| 5 | **Replay summary header** — `X/Y passing` headline with colored dot above the replay table | ✅ done |
| 6 | **Audit log polish** — relative timestamps, color-coded event tags by category, collapsible metadata via native `<details>` | ✅ done |
| 7 | **Loading + empty states** — spinner in active button, friendlier placeholder copy across panels | ⏳ next |
| 8 | **Header polish** — team names, "DEMO" tag, status dot for `policy v0 · 5 scenarios` | |

Each step lands as a discrete diff for review before moving to the next.

---

## Constraints (from the original scaffold spec)

- No animation libraries, no chart libraries, no toasts
- No auth UI, no settings panel, no localStorage
- No new dependencies beyond `next` / `react` / `tailwind` / types
- Tailwind only — no styled-components, no CSS modules
- Keep panel APIs uniform: each takes `result?: ScenarioResult` (or `results?: ReplayResult[]`) and renders an empty state when undefined

---

## Coordination protocol with Eshwar

- Need a new field on `FirewallDecision` or `GatewayResult` to render? → ask Eshwar to add it **optional** first, then wire the UI in a follow-up.
- See an unexpected decision in the replay suite? → that's a policy bug, not a UI bug. Ping Eshwar.
- Spotted the contract drifting (e.g. a panel rendering `undefined`)? → check `lib/types.ts` first, then the API route, then ping.

---

## How to run / test

```powershell
npm install
npm run dev            # http://localhost:3000
```

Click each scenario in turn. The interesting ones for UI work:
- `unauthorized_promise` → triggers `rewrite` → exercises the rewrite-diff path
- `valid_escalation` → triggers `allow` → simplest happy path
- `angry_customer_attack` → triggers `block` → exercises the "MCP not called" path

Typecheck before committing:
```powershell
npx tsc --noEmit
```

---

## Quality bar

- TypeScript strict — no `any`, no `// @ts-ignore`
- Every panel handles the `result === undefined` empty state
- No layout regressions on mobile / md / xl
- Decision color palette stays consistent (emerald / rose / amber / sky)
- 5/5 replay suite still passing after UI changes (it shouldn't be affected, but verify)

---

## Team

- Adil Arya — UI (`app/page.tsx`, `components/**`)
- Eshwar Rajasekar — Policy + MCP integration (`lib/policy.ts`, `lib/mcp-client.ts`)
