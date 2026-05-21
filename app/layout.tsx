import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentFirewall — Runtime guardrails for AI agents",
  description:
    "AgentFirewall inspects every agent tool call before execution — blocking unauthorized actions, rewriting unsafe promises, and routing safe actions through the TrueFoundry MCP Gateway.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
