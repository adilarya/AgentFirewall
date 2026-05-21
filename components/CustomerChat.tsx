import type { ScenarioResult } from "@/lib/types";
import Card from "./ui/Card";
import { UserIcon } from "./ui/Icons";

export default function CustomerChat({
  result,
}: {
  result?: ScenarioResult;
}) {
  return (
    <Card
      eyebrow="Step 1"
      title="Customer request"
      subtitle="Input to the agent"
      icon={<UserIcon className="h-5 w-5" />}
      accent="indigo"
    >
      {!result ? (
        <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 py-8 text-center">
          <p className="text-sm text-slate-500">
            Pick a scenario to see the customer message and the agent&apos;s
            intent.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Customer
            </div>
            <p className="text-sm text-slate-800">{result.customerMessage}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Agent intent
            </div>
            <p className="text-sm text-slate-700">{result.agentIntent}</p>
          </div>
        </div>
      )}
    </Card>
  );
}
