import { History } from "lucide-react";

import { Card } from "@/app/components/ui/Card";

import { HubBackButton } from "../HubBackButton";

const ENTRIES = [
  {
    id: "h1",
    when: "2026-03-22 03:12 UTC",
    action: "Security patch bundle — web tier",
    performedBy: "SRE · on-call (Jordan)",
    duration: "42 min",
    result: "Success" as const,
  },
  {
    id: "h2",
    when: "2026-03-15 02:00 UTC",
    action: "Planned PostgreSQL minor upgrade",
    performedBy: "DBA team · MCP",
    duration: "1h 08 min",
    result: "Success" as const,
  },
  {
    id: "h3",
    when: "2026-03-08 21:40 UTC",
    action: "Hotfix: session store failover",
    performedBy: "Platform · Priya",
    duration: "18 min",
    result: "Success" as const,
  },
  {
    id: "h4",
    when: "2026-02-28 02:30 UTC",
    action: "Kernel upgrade — batch workers",
    performedBy: "Infra automation · batch-01",
    duration: "12 min",
    result: "Rollback" as const,
  },
];

function resultBadge(result: (typeof ENTRIES)[number]["result"]) {
  if (result === "Success")
    return "border-emerald-500/40 bg-emerald-50 text-emerald-700";
  return "border-rose-500/40 bg-rose-50 text-rose-800";
}

export default function MaintenanceHistoryPage() {
  return (
    <div className="space-y-4 bg-slate-50 text-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <HubBackButton />
        <History className="h-6 w-6 text-indigo-400" aria-hidden />
      </div>

      <div>
        <h1 className="text-xl font-semibold text-slate-900">Maintenance history</h1>
        <p className="mt-1 text-sm text-slate-600">
          Chronological record of production maintenance: who ran it, how long, and outcome.
        </p>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-[820px] w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-600">
                <th className="px-4 py-3">Time (UTC)</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Performed by</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Result</th>
              </tr>
            </thead>
            <tbody>
              {ENTRIES.map((row) => (
                <tr key={row.id} className="border-t border-slate-200">
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-700">
                    {row.when}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">{row.action}</td>
                  <td className="px-4 py-3 text-slate-700">{row.performedBy}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">{row.duration}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${resultBadge(
                        row.result,
                      )}`}
                    >
                      {row.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
