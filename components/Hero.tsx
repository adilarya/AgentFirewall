"use client";

import Badge from "./ui/Badge";
import Button from "./ui/Button";
import {
  BanIcon,
  EditIcon,
  PlayIcon,
  RepeatIcon,
  ShieldIcon,
} from "./ui/Icons";

interface Props {
  onRunDemo: () => void;
  onRunReplay: () => void;
}

export default function Hero({ onRunDemo, onRunReplay }: Props) {
  return (
    <section id="top" className="relative overflow-hidden pt-12 pb-6">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <Badge tone="indigo" size="sm" className="mb-5">
            <ShieldIcon className="h-3.5 w-3.5" />
            Runtime AI Guardrails
          </Badge>

          <h1 className="text-balance text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Runtime guardrails for AI agents using MCP tools
          </h1>

          <p className="mt-5 text-pretty text-base text-slate-600 md:text-lg">
            AgentFirewall inspects every agent tool call before execution —
            blocking unauthorized actions, rewriting unsafe promises, and
            routing safe actions through the TrueFoundry MCP Gateway.
          </p>

          <p className="mt-4 text-sm font-medium text-indigo-700">
            Prompts are advisory. Gateway policies are enforceable.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              onClick={onRunDemo}
              leadingIcon={<PlayIcon className="h-4 w-4" />}
            >
              Run Live Demo
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={onRunReplay}
              leadingIcon={<RepeatIcon className="h-4 w-4" />}
            >
              Run Replay Suite
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <Badge tone="rose" leadingIcon={<BanIcon className="h-3.5 w-3.5" />}>
              Blocks unsafe actions
            </Badge>
            <Badge tone="amber" leadingIcon={<EditIcon className="h-3.5 w-3.5" />}>
              Rewrites risky promises
            </Badge>
            <Badge
              tone="emerald"
              leadingIcon={<ShieldIcon className="h-3.5 w-3.5" />}
            >
              Auditable MCP execution
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}
