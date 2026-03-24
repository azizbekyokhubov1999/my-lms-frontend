"use client";

import * as React from "react";
import { FileCheck2 } from "lucide-react";

import { SecuritySubpageShell } from "../_components/SecuritySubpageShell";

type StandardCheck = {
  id: string;
  standard: "GDPR" | "ISO 27001";
  control: string;
  passed: boolean;
};

const initialChecks: StandardCheck[] = [
  { id: "a1", standard: "GDPR", control: "Data access requests handled in SLA", passed: true },
  { id: "a2", standard: "GDPR", control: "Data retention policy documented", passed: true },
  { id: "a3", standard: "ISO 27001", control: "Access control review monthly", passed: true },
  { id: "a4", standard: "ISO 27001", control: "Incident post-mortem evidence attached", passed: false },
];

export default function SecurityAuditPage() {
  const [checks, setChecks] = React.useState<StandardCheck[]>(initialChecks);
  const score = Math.round((checks.filter((c) => c.passed).length / checks.length) * 100);

  const toggle = (id: string) => {
    setChecks((prev) => prev.map((c) => (c.id === id ? { ...c, passed: !c.passed } : c)));
  };

  return (
    <SecuritySubpageShell
      title="Security Audit"
      description="Validate GDPR and ISO controls with a live compliance score."
      icon={FileCheck2}
      badgeText="Audit controls"
    >
      <div className="space-y-5">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-900">Compliance Score</p>
            <p className="text-lg font-bold text-slate-900">{score}%</p>
          </div>
          <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-200">
            <div className={`h-full rounded-full ${score < 80 ? "bg-rose-500" : "bg-indigo-400"}`} style={{ width: `${score}%` }} />
          </div>
        </div>

        <div className="space-y-2">
          {checks.map((check) => (
            <label key={check.id} className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{check.control}</p>
                <p className="mt-1 text-xs text-slate-600">{check.standard}</p>
              </div>
              <input
                type="checkbox"
                checked={check.passed}
                onChange={() => toggle(check.id)}
                className="mt-1 h-4 w-4 accent-indigo-500"
              />
            </label>
          ))}
        </div>
      </div>
    </SecuritySubpageShell>
  );
}
