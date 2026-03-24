"use client";

import * as React from "react";
import { SlidersHorizontal } from "lucide-react";

import { Card } from "@/app/components/ui/Card";

import { HubBackButton } from "../HubBackButton";

const GROUPS = [
  {
    name: "lms-web-asg",
    min: 4,
    max: 24,
    desired: 8,
    mode: "Horizontal",
    status: "Active",
  },
  {
    name: "api-tier-asg",
    min: 2,
    max: 12,
    desired: 4,
    mode: "Horizontal",
    status: "Active",
  },
  {
    name: "batch-workers",
    min: 1,
    max: 8,
    desired: 3,
    mode: "Horizontal",
    status: "Dry-run policy",
  },
  {
    name: "db-primary",
    min: 1,
    max: 1,
    desired: 1,
    mode: "Vertical (IOPS)",
    status: "Active",
  },
];

type HistoryEntry = {
  id: string;
  at: string;
  action: string;
  target: string;
  result: string;
};

const ACTIONS = [
  { id: "vert", label: "Increase instance size", detail: "Next SKU up for selected group" },
  { id: "add-node", label: "Add node to cluster", detail: "+1 to desired count (within max)" },
  { id: "remove-node", label: "Remove node (drain)", detail: "Scale in after connection drain" },
  { id: "rebalance", label: "Rebalance traffic", detail: "Shift weight across AZs" },
] as const;

function timeStamp() {
  return new Date().toLocaleString();
}

export default function ScalingPage() {
  const [selectedGroup, setSelectedGroup] = React.useState(GROUPS[0].name);
  const [history, setHistory] = React.useState<HistoryEntry[]>([
    {
      id: "h0",
      at: "2026-03-24 04:12 UTC",
      action: "Add node to cluster",
      target: "lms-web-asg",
      result: "Success (+1 desired)",
    },
    {
      id: "h1",
      at: "2026-03-23 18:40 UTC",
      action: "Increase instance size",
      target: "db-primary",
      result: "CHG-1192 required (blocked)",
    },
  ]);

  const runAction = (label: string) => {
    const blocked = label === "Increase instance size" && selectedGroup === "db-primary";
    setHistory((prev) => [
      {
        id: `h-${Date.now()}`,
        at: timeStamp(),
        action: label,
        target: selectedGroup,
        result: blocked ? "Blocked — needs change ticket" : "Queued (demo)",
      },
      ...prev,
    ]);
  };

  return (
    <div className="space-y-5 bg-slate-50 text-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <HubBackButton />
        <SlidersHorizontal className="h-6 w-6 text-indigo-400" aria-hidden />
      </div>

      <div>
        <h1 className="text-2xl font-semibold text-slate-900">System scaling</h1>
        <p className="mt-1 text-sm text-slate-600">
          Autoscaling context, manual scaling actions, and recent execution log.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-slate-200 bg-white shadow-sm lg:col-span-1">
          <h2 className="text-sm font-semibold text-slate-900">Scaling actions</h2>
          <p className="mt-1 text-xs text-slate-600">
            Target group for operations (demo — no cloud API).
          </p>
          <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Target group
          </label>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
          >
            {GROUPS.map((g) => (
              <option key={g.name} value={g.name}>
                {g.name}
              </option>
            ))}
          </select>

          <ul className="mt-5 space-y-3">
            {ACTIONS.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => runAction(a.label)}
                  className="w-full rounded-xl border-2 border-indigo-400 bg-white px-4 py-3 text-left transition-colors hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  <span className="block text-sm font-semibold text-indigo-400">{a.label}</span>
                  <span className="mt-1 block text-xs text-slate-600">{a.detail}</span>
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() =>
              setHistory((prev) => [
                {
                  id: `h-${Date.now()}`,
                  at: timeStamp(),
                  action: "Dry-run validation",
                  target: selectedGroup,
                  result: "No drift detected",
                },
                ...prev,
              ])
            }
            className="mt-4 w-full rounded-xl bg-indigo-400 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
          >
            Run policy dry-run
          </button>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-900">Group inventory</h2>
          <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-[720px] w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-600">
                  <th className="px-4 py-3">Group</th>
                  <th className="px-4 py-3">Mode</th>
                  <th className="px-4 py-3">Min / Max / Desired</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {GROUPS.map((g) => (
                  <tr key={g.name} className="border-t border-slate-200">
                    <td className="px-4 py-3 font-mono text-xs font-medium text-slate-900">
                      {g.name}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{g.mode}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-800">
                      {g.min} / {g.max} / {g.desired}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          g.status === "Active"
                            ? "rounded-full border border-emerald-500/40 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600"
                            : "rounded-full border border-amber-500/40 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800"
                        }
                      >
                        {g.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="mt-6 text-sm font-semibold text-slate-900">Scaling history</h3>
          <p className="mt-1 text-xs text-slate-600">Latest operations (newest first).</p>
          <div className="mt-3 max-h-[280px] overflow-y-auto rounded-lg border border-slate-200">
            <table className="min-w-full border-collapse text-sm">
              <thead className="sticky top-0 bg-slate-50">
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-600">
                  <th className="px-4 py-2">When</th>
                  <th className="px-4 py-2">Action</th>
                  <th className="px-4 py-2">Target</th>
                  <th className="px-4 py-2">Result</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h.id} className="border-t border-slate-200">
                    <td className="whitespace-nowrap px-4 py-2 font-mono text-xs text-slate-600">
                      {h.at}
                    </td>
                    <td className="px-4 py-2 text-slate-900">{h.action}</td>
                    <td className="px-4 py-2 font-mono text-xs text-slate-700">{h.target}</td>
                    <td className="px-4 py-2">
                      <span
                        className={
                          h.result.toLowerCase().includes("block") ||
                          h.result.toLowerCase().includes("chg")
                            ? "text-sm font-medium text-rose-600"
                            : h.result.toLowerCase().includes("success") ||
                                h.result.toLowerCase().includes("no drift")
                              ? "text-sm font-medium text-emerald-600"
                              : "text-sm text-slate-700"
                        }
                      >
                        {h.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Policies (summary)</h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-slate-700">
          <li>Scale out when p95 CPU &gt; 72% for 5 minutes; scale in below 35% for 15 minutes.</li>
          <li>Database vertical scaling requires change ticket (CHG) — no auto-apply.</li>
        </ul>
      </Card>
    </div>
  );
}
