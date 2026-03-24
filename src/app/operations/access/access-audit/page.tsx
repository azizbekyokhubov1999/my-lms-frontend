"use client";

import * as React from "react";
import Link from "next/link";

import { Card } from "@/app/components/ui/Card";

type AuditCheck = {
  id: string;
  label: string;
  checked: boolean;
};

const INITIAL_CHECKS: AuditCheck[] = [
  { id: "a1", label: "MFA enabled for privileged users", checked: true },
  { id: "a2", label: "Quarterly role review completed", checked: false },
  { id: "a3", label: "Inactive sessions auto-expired", checked: true },
];

export default function AccessAuditPage() {
  const [checks, setChecks] = React.useState(INITIAL_CHECKS);
  const [msg, setMsg] = React.useState("");

  const toggle = (id: string) => setChecks((prev) => prev.map((c) => (c.id === id ? { ...c, checked: !c.checked } : c)));
  const generate = () => setMsg("Access Audit Report (PDF) generated successfully.");

  return (
    <div className="space-y-4 bg-slate-50 text-slate-900">
      <Link href="/operations/access" className="inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-500">
        Back to Access Hub
      </Link>
      <Card className="border-slate-200 bg-white shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">Access Audit</h1>
        <div className="mt-3 space-y-2">
          {checks.map((check) => (
            <label key={check.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
              <span className="text-sm text-slate-800">{check.label}</span>
              <input type="checkbox" checked={check.checked} onChange={() => toggle(check.id)} className="h-4 w-4 accent-indigo-500" />
            </label>
          ))}
        </div>
        <button type="button" onClick={generate} className="mt-4 rounded-md border border-indigo-400 bg-indigo-400 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
          Generate Access Audit Report (PDF)
        </button>
        {msg ? <p className="mt-2 text-sm font-medium text-indigo-600">{msg}</p> : null}
      </Card>
    </div>
  );
}
