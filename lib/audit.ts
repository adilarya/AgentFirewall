import type { AuditEvent } from "./types";

export function createAuditEvent(
  message: string,
  metadata?: Record<string, unknown>,
): AuditEvent {
  return {
    timestamp: new Date().toISOString(),
    message,
    metadata,
  };
}

export function buildAuditLog(...events: AuditEvent[]): AuditEvent[] {
  return events;
}
