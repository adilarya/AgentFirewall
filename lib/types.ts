export type DecisionType = "allow" | "block" | "rewrite" | "escalate";

export type ScenarioId =
  | "safe_policy_action"
  | "angry_customer_attack"
  | "fake_manager_approval"
  | "unauthorized_promise"
  | "valid_escalation";

export interface Purchase {
  orderId: string;
  customerName: string;
  purchaseAmount: number;
  maxRefundPercent: number;
  maxAllowedRefund: number;
}

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
  output?: {
    message: string;
  };
}

export interface AuditEvent {
  timestamp: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface Scenario {
  id: ScenarioId;
  name: string;
  customerMessage: string;
  agentIntent: string;
  toolCall: ToolCall;
}

export interface ScenarioResult {
  scenarioId: string;
  scenarioName: string;
  customerMessage: string;
  agentIntent: string;
  toolCall: ToolCall;
  firewallDecision: FirewallDecision;
  gatewayResult: GatewayResult;
  finalAgentResponse: string;
  auditLog: AuditEvent[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  agentText: string;
  toolCall: ToolCall | null;
  firewallDecision: FirewallDecision | null;
  gatewayResult: GatewayResult | null;
  auditLog: AuditEvent[];
}

export interface ReplayResult {
  scenarioId: string;
  scenarioName: string;
  expectedDecision: DecisionType;
  actualDecision: DecisionType;
  pass: boolean;
  result: ScenarioResult;
}
