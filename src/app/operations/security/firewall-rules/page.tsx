"use client";

import * as React from "react";
import { ShieldEllipsis } from "lucide-react";

import { SecuritySubpageShell } from "../_components/SecuritySubpageShell";

type Rule = {
  id: string;
  direction: "Inbound" | "Outbound";
  port: number;
  protocol: "TCP" | "UDP";
  action: "Allow" | "Deny";
};

const initialRules: Rule[] = [
  { id: "r1", direction: "Inbound", port: 443, protocol: "TCP", action: "Allow" },
  { id: "r2", direction: "Inbound", port: 22, protocol: "TCP", action: "Deny" },
  { id: "r3", direction: "Outbound", port: 53, protocol: "UDP", action: "Allow" },
];

export default function FirewallRulesPage() {
  const [rules, setRules] = React.useState<Rule[]>(initialRules);
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<Omit<Rule, "id">>({
    direction: "Inbound",
    port: 80,
    protocol: "TCP",
    action: "Allow",
  });

  const addRule = () => {
    setRules((prev) => [
      ...prev,
      { id: `r${prev.length + 1}`, ...draft },
    ]);
    setOpen(false);
  };

  return (
    <SecuritySubpageShell
      title="Firewall Rules"
      description="Review and update inbound/outbound traffic policies."
      icon={ShieldEllipsis}
      badgeText="Policy control"
    >
      <div className="space-y-4">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-md border border-indigo-400 px-3 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50"
          >
            Add Rule
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3">Direction</th>
                <th className="px-4 py-3">Port</th>
                <th className="px-4 py-3">Protocol</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((r) => (
                <tr key={r.id} className="border-t border-slate-200 text-slate-700">
                  <td className="px-4 py-3">{r.direction}</td>
                  <td className="px-4 py-3">{r.port}</td>
                  <td className="px-4 py-3">{r.protocol}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${r.action === "Allow" ? "border-indigo-200 bg-indigo-50 text-indigo-600" : "border-rose-500/30 bg-rose-500/10 text-rose-600"}`}>
                      {r.action}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-lg">
              <h2 className="text-lg font-semibold text-slate-900">Add Firewall Rule</h2>
              <div className="mt-4 space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={draft.direction}
                    onChange={(e) => setDraft((s) => ({ ...s, direction: e.target.value as Rule["direction"] }))}
                    className="rounded-md border border-slate-300 px-3 py-2"
                  >
                    <option>Inbound</option>
                    <option>Outbound</option>
                  </select>
                  <input
                    type="number"
                    value={draft.port}
                    onChange={(e) => setDraft((s) => ({ ...s, port: Number(e.target.value) || 0 }))}
                    className="rounded-md border border-slate-300 px-3 py-2"
                    placeholder="Port"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={draft.protocol}
                    onChange={(e) => setDraft((s) => ({ ...s, protocol: e.target.value as Rule["protocol"] }))}
                    className="rounded-md border border-slate-300 px-3 py-2"
                  >
                    <option>TCP</option>
                    <option>UDP</option>
                  </select>
                  <select
                    value={draft.action}
                    onChange={(e) => setDraft((s) => ({ ...s, action: e.target.value as Rule["action"] }))}
                    className="rounded-md border border-slate-300 px-3 py-2"
                  >
                    <option>Allow</option>
                    <option>Deny</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <button type="button" onClick={() => setOpen(false)} className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700">
                  Cancel
                </button>
                <button type="button" onClick={addRule} className="rounded-md border border-indigo-400 bg-indigo-400 px-3 py-2 text-sm font-semibold text-white">
                  Save Rule
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SecuritySubpageShell>
  );
}
