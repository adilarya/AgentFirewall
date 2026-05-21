import type { FirewallDecision, Purchase, ToolCall } from "./types";

const POLICY_NAME = "support_refund_policy_v0";

function parseDollarAmounts(text: string): number[] {
  const matches = text.matchAll(/\$(\d+(?:,\d{3})*(?:\.\d+)?)/g);
  return Array.from(matches).map((m) => parseFloat(m[1].replace(/,/g, "")));
}

export function evaluatePolicy(
  toolCall: ToolCall,
  purchase: Purchase,
): FirewallDecision {
  const body = String(toolCall.args?.body ?? "").toLowerCase();
  const channel = String(toolCall.args?.channel ?? "#support-escalations");
  const { maxAllowedRefund, purchaseAmount, maxRefundPercent, orderId } = purchase;

  // Rewrite check must come before "full compensation" / "full refund" blocks —
  // "We guarantee full compensation" is a rewrite, not a hard block.
  if (body.includes("guarantee") || body.includes("guaranteed")) {
    return {
      decision: "rewrite",
      reason: `Agent attempted an unauthorized written guarantee. Rewritten to a safe escalation note (policy cap: $${maxAllowedRefund} on a $${purchaseAmount} purchase).`,
      policy: POLICY_NAME,
      maxAllowed: maxAllowedRefund,
      rewrittenArgs: {
        channel,
        body: `Order ${orderId} is requesting compensation beyond the automated policy cap of $${maxAllowedRefund}. Please review manually.`,
      },
    };
  }

  if (body.includes("manager approved")) {
    return {
      decision: "block",
      reason: `Unverifiable manager approval claim for order ${orderId}. No out-of-band confirmation exists.`,
      policy: POLICY_NAME,
      maxAllowed: maxAllowedRefund,
    };
  }

  // Amount-aware block: catches $400, $500, any figure above the cap —
  // not just hardcoded keywords.
  const amounts = parseDollarAmounts(body);
  const violating = amounts.find((a) => a > maxAllowedRefund);
  if (violating !== undefined) {
    return {
      decision: "block",
      reason: `Message references $${violating}, which exceeds the $${maxAllowedRefund} policy cap (${maxRefundPercent}% of $${purchaseAmount} purchase).`,
      policy: POLICY_NAME,
      maxAllowed: maxAllowedRefund,
    };
  }

  if (body.includes("full refund")) {
    return {
      decision: "block",
      reason: `Full refund promise exceeds the $${maxAllowedRefund} policy cap on a $${purchaseAmount} purchase.`,
      policy: POLICY_NAME,
      maxAllowed: maxAllowedRefund,
    };
  }

  if (body.includes("full compensation")) {
    return {
      decision: "block",
      reason: `Full compensation promise exceeds the $${maxAllowedRefund} policy cap on a $${purchaseAmount} purchase.`,
      policy: POLICY_NAME,
      maxAllowed: maxAllowedRefund,
    };
  }

  if (body.includes("$5 voucher")) {
    return {
      decision: "allow",
      reason: `$5 voucher is within the ${maxRefundPercent}% policy cap ($${maxAllowedRefund}) on a $${purchaseAmount} purchase.`,
      policy: POLICY_NAME,
      maxAllowed: maxAllowedRefund,
    };
  }

  if (body.includes("human review")) {
    return {
      decision: "allow",
      reason: "Routing to human reviewer is always permitted.",
      policy: POLICY_NAME,
      maxAllowed: maxAllowedRefund,
    };
  }

  return {
    decision: "escalate",
    reason: "Tool call did not match any known safe or unsafe pattern. Escalating for human review.",
    policy: POLICY_NAME,
    maxAllowed: maxAllowedRefund,
  };
}
