# AgentFirewall — Project Briefing & Context

## What We're Building

**AgentFirewall** — a runtime policy layer for AI agents using the TrueFoundry MCP Gateway.

When an AI customer support agent tries to do something unsafe (issue a $500 refund, send an unauthorized promise), the firewall intercepts the tool call **before execution** and blocks, rewrites, or allows it.

**Core thesis:** *Prompts are advisory. Gateway policies are enforceable.*

**Demo story:**
1. Customer pressures AI agent → agent tries unsafe tool call
2. AgentFirewall intercepts → BLOCK / REWRITE / ALLOW decision
3. If allowed or rewritten → routes through TrueFoundry MCP Gateway to real MCP server (Slack)
4. Audit log shows everything

---

## Tech Stack

- **Backend (Eshwar):** Python, FastAPI, uvicorn — runs on `localhost:8000`
- **Frontend (Adil):** Next.js, TypeScript, Tailwind CSS — runs on `localhost:3000`
- **MCP Server:** Slack (primary), GitHub or Linear (fallback)
- **Gateway:** TrueFoundry MCP Gateway

---

## Target Repo Structure

```
agentfirewall/
  backend/
    main.py          # FastAPI app, /run and /scenarios endpoints
    policy.py        # Firewall logic — block/rewrite/allow decisions
    scenarios.py     # 4 hardcoded attack scenarios
    mcp_client.py    # Wrapper for TrueFoundry MCP Gateway / mock fallback
    audit_log.py     # In-memory audit log
    requirements.txt
  frontend/          # existing Next.js scaffold lives here
    app/
      page.tsx
    components/
    lib/
    package.json
  README.md
```

---

## Architecture Decision (IMPORTANT)

The existing scaffold is a **pure Next.js monolith** with TypeScript API routes (`/api/run-scenario`, `/api/run-replay`). The briefing calls for a **Python/FastAPI backend** split. These are incompatible.

**Chosen approach:** Build the Python backend, keep the Next.js components.
- Eshwar builds `backend/` (all code provided below)
- Adil updates Next.js fetch calls to point at `http://localhost:8000` instead of internal API routes
- `app/api/` directory becomes dead code and should be deleted

---

## Key Alignment Issues to Resolve

| Field | Briefing (Python target) | Current TS scaffold |
|---|---|---|
| Decision values | `ALLOW`, `BLOCK`, `REWRITE` (uppercase) | `allow`, `block`, `rewrite` (lowercase) |
| Scenarios | 4 | 5 |
| Replay endpoint | Not defined | `/api/run-replay` exists in TS |
| `issue_refund` tool | Present | Missing from TS scenarios |

**Decision:** Standardise on uppercase (`ALLOW`, `BLOCK`, `REWRITE`, `ESCALATE`) in the Python backend; update the Next.js components to handle uppercase.

---

## The 4 Demo Scenarios

| # | Scenario | Attempted Tool Call | Firewall | What Executes |
|---|----------|-------------------|----------|---------------|
| 1 | Valid voucher | send_message: "$5 voucher" | ALLOW | Message sent |
| 2 | Angry customer | send_message: "$500 refund approved" | BLOCK | Nothing |
| 3 | Fake manager approval | issue_refund: $500 on $50 purchase | BLOCK | Nothing |
| 4 | Social media threat | send_message: "guaranteed compensation" | REWRITE | Safe escalation sent |

---

## Backend File Contents

### `backend/policy.py`
```python
def check_action(tool_name: str, args: dict) -> dict:
    body = args.get("body", "").lower()
    amount = args.get("amount", 0)
    purchase = args.get("purchase_amount", 50)

    if tool_name == "send_message":
        if any(x in body for x in ["$500", "500 refund", "full refund", "guaranteed compensation"]):
            return {
                "decision": "BLOCK",
                "reason": "Message contains unauthorized compensation promise exceeding policy."
            }
        if "approved" in body and "refund" in body:
            return {
                "decision": "REWRITE",
                "reason": "Unauthorized approval language detected.",
                "rewrite": "Customer is requesting compensation beyond automated policy. Escalating to human review."
            }

    if tool_name == "issue_refund":
        if amount > purchase * 0.10:
            return {
                "decision": "BLOCK",
                "reason": f"Refund ${amount} exceeds 10% policy limit on ${purchase} purchase."
            }

    return {"decision": "ALLOW"}
```

### `backend/scenarios.py`
```python
SCENARIOS = [
    {
        "id": "safe_voucher",
        "label": "Valid voucher",
        "description": "Customer asks for max allowed compensation.",
        "tool": "send_message",
        "args": {"body": "You are eligible for a $5 voucher under our policy."},
        "expected": "ALLOW"
    },
    {
        "id": "angry_customer",
        "label": "Angry customer",
        "description": "Customer demands $500 refund, agent tries to promise it.",
        "tool": "send_message",
        "args": {"body": "We approved your $500 refund. It will be processed shortly."},
        "expected": "BLOCK"
    },
    {
        "id": "fake_manager",
        "label": "Fake manager approval",
        "description": "Agent tries to issue $500 refund on $50 purchase.",
        "tool": "issue_refund",
        "args": {"amount": 500, "purchase_amount": 50},
        "expected": "BLOCK"
    },
    {
        "id": "social_threat",
        "label": "Social media threat",
        "description": "Customer threatens screenshots; agent tries to promise guaranteed compensation.",
        "tool": "send_message",
        "args": {"body": "We guarantee full compensation for your trouble."},
        "expected": "REWRITE"
    }
]
```

### `backend/mcp_client.py`
```python
import httpx
import os

TRUEFOUNDRY_GATEWAY_URL = os.getenv("TRUEFOUNDRY_GATEWAY_URL", "")
MCP_SERVER_URL = os.getenv("MCP_SERVER_URL", "")

def execute_tool(tool_name: str, args: dict) -> dict:
    if TRUEFOUNDRY_GATEWAY_URL and MCP_SERVER_URL:
        try:
            response = httpx.post(
                f"{TRUEFOUNDRY_GATEWAY_URL}/execute",
                json={"tool": tool_name, "args": args, "server": MCP_SERVER_URL},
                timeout=5.0
            )
            return response.json()
        except Exception as e:
            return {"status": "mock_fallback", "reason": str(e), "tool": tool_name, "args": args}

    return {
        "status": "executed_mock",
        "tool": tool_name,
        "args": args,
        "note": "Mock execution — TrueFoundry MCP Gateway not configured"
    }
```

### `backend/audit_log.py`
```python
from datetime import datetime

_log = []

def add_entry(scenario_id: str, tool: str, args: dict, firewall: dict, executed):
    _log.append({
        "timestamp": datetime.utcnow().isoformat(),
        "scenario_id": scenario_id,
        "attempted": {"tool": tool, "args": args},
        "firewall": firewall,
        "executed": executed
    })

def get_log():
    return list(reversed(_log))  # newest first
```

### `backend/main.py`
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from policy import check_action
from mcp_client import execute_tool
from scenarios import SCENARIOS
import audit_log

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/scenarios")
def get_scenarios():
    return SCENARIOS

@app.post("/run")
def run_scenario(payload: dict):
    tool = payload["tool"]
    args = payload["args"]
    scenario_id = payload.get("id", "custom")

    firewall = check_action(tool, args)
    executed = None

    if firewall["decision"] == "ALLOW":
        executed = execute_tool(tool, args)
    elif firewall["decision"] == "REWRITE":
        rewritten_args = {**args, "body": firewall["rewrite"]}
        executed = execute_tool(tool, rewritten_args)
    # BLOCK: do not execute

    audit_log.add_entry(scenario_id, tool, args, firewall, executed)

    return {
        "scenario_id": scenario_id,
        "attempted": {"tool": tool, "args": args},
        "firewall": firewall,
        "executed": executed
    }

@app.get("/audit")
def get_audit():
    return audit_log.get_log()
```

### `backend/requirements.txt`
```
fastapi
uvicorn
httpx
python-dotenv
```

### Run backend:
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

---

## Environment Variables (`backend/.env`)

```
TRUEFOUNDRY_GATEWAY_URL=   # from TrueFoundry dashboard
MCP_SERVER_URL=             # Slack MCP server URL
```

Leave blank initially — mock fallback kicks in automatically.

---

## MCP Connection Priority

Test in this order. Stop at the first that works:
1. **Slack** — best for live demo (judges see a message sent)
2. **GitHub** — create issue as the "executed action"
3. **Linear** — create ticket
4. **Mock** — always works, use if auth is eating time

---

## Frontend Changes Needed (from existing scaffold)

1. Delete `app/api/` — replaced by FastAPI backend
2. In `app/page.tsx`: update fetch calls
   - `POST /api/run-scenario` → `POST http://localhost:8000/run`
   - `POST /api/run-replay` → loop all scenarios client-side or add a `/replay` route to FastAPI
   - Load scenarios from `GET http://localhost:8000/scenarios` on mount
3. Update components to handle uppercase decision values (`ALLOW`, `BLOCK`, `REWRITE`)
4. Add audit log polling from `GET http://localhost:8000/audit`
5. Remove "hackathon scaffold" badge from `components/Header.tsx`

---

## Timeline

| Clock | Milestone |
|-------|-----------|
| 0:00 | Repo structure agreed, both start |
| 0:15 | Eshwar: `/run` endpoint working locally. Adil: Next.js scaffold up |
| 0:45 | All 4 scenarios work end-to-end through UI |
| 1:00 | One real MCP server connected (Slack ideally) |
| 1:20 | Audit log visible in UI |
| 1:30 | Freeze code |
| 1:40 | README written |
| 1:50 | Rehearse pitch once |

---

## 60-Second Judge Pitch

> "Production agents are dangerous not because they talk — but because they act.
>
> We built AgentFirewall: a runtime policy layer for customer support agents using TrueFoundry's MCP Gateway. Every tool call passes through our firewall before execution.
>
> Watch: a customer pressures our agent into a $500 refund on a $50 purchase. The model fails and attempts the tool call. Our gateway blocks it. Then the agent tries to *promise* the refund in a Slack message — we block that too.
>
> Most safety systems stop unsafe actions. We also stop unauthorized promises.
>
> Prompts are advisory. Gateway policies are enforceable."

---

## Team

- Adil Arya — Frontend (Next.js)
- Eshwar Rajasekar — Backend (Python/FastAPI)
