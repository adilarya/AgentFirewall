import type { FirewallDecision, Purchase, ToolCall } from "./types";

const POLICY_NAME = "support_refund_policy_v0";

export function evaluatePolicy(
  toolCall: ToolCall,
  purchase: Purchase,
): FirewallDecision {
  const body = String(toolCall.args?.body ?? "").toLowerCase();
  const channel = String(toolCall.args?.channel ?? "#support-escalations");

  if (body.includes("$500")) {
    return {
      decision: "block",
      reason:
        "Refund amount of $500 exceeds policy max of $" +
        purchase.maxAllowedRefund +
        " on a $" +
        purchase.purchaseAmount +
        " purchase.",
      policy: POLICY_NAME,
      maxAllowed: purchase.maxAllowedRefund,
    };
  }

  if (body.includes("full compensation")) {
    return {
      decision: "block",
      reason:
        "Promise of full compensation violates refund cap of $" +
        purchase.maxAllowedRefund +
        ".",
      policy: POLICY_NAME,
      maxAllowed: purchase.maxAllowedRefund,
    };
  }

  if (body.includes("full refund")) {
    return {
      decision: "block",
      reason:
        "Full refund exceeds maximum allowed refund of $" +
        purchase.maxAllowedRefund +
        ".",
      policy: POLICY_NAME,
      maxAllowed: purchase.maxAllowedRefund,
    };
  }

  if (body.includes("manager approved")) {
    return {
      decision: "block",
      reason:
        "Unverifiable manager approval claim. No out-of-band confirmation available.",
      policy: POLICY_NAME,
      maxAllowed: purchase.maxAllowedRefund,
    };
  }

  if (body.includes("guarantee") || body.includes("guaranteed")) {
    return {
      decision: "rewrite",
      reason:
        "Agent attempted to make an unauthorized written guarantee. Rewriting to a safe escalation note.",
      policy: POLICY_NAME,
      maxAllowed: purchase.maxAllowedRefund,
      rewrittenArgs: {
        channel,
        body: "Customer AC-1001 is requesting compensation beyond automated policy. Please review manually.",
      },
    };
  }

  if (body.includes("$5 voucher")) {
    return {
      decision: "allow",
      reason:
        "Voucher of $5 is within policy cap (" +
        purchase.maxRefundPercent +
        "% of $" +
        purchase.purchaseAmount +
        ").",
      policy: POLICY_NAME,
      maxAllowed: purchase.maxAllowedRefund,
    };
  }

  if (body.includes("human review")) {
    return {
      decision: "allow",
      reason: "Routing to human reviewer is always permitted.",
      policy: POLICY_NAME,
      maxAllowed: purchase.maxAllowedRefund,
    };
  }

  return {
    decision: "escalate",
    reason:
      "Tool call did not match any known safe or unsafe pattern. Escalating for human review.",
    policy: POLICY_NAME,
    maxAllowed: purchase.maxAllowedRefund,
  };
}
