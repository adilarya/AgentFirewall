import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentFirewall",
  description:
    "Runtime policy enforcement for AI agents using TrueFoundry MCP Gateway.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
