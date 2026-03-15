"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../components/ui/Card";

interface Rule {
  id: string;
  name: string;
  logic: string;
  active: boolean;
}

const MOCK_RULES: Rule[] = [
  { id: "r1", name: "Default exam eligibility", logic: "Min attendance ≥ 80% AND No outstanding debt", active: true },
  { id: "r2", name: "Resit eligibility", logic: "Min attendance ≥ 70% AND Fee paid for resit", active: true },
  { id: "r3", name: "Thesis defense", logic: "All course grades submitted AND Supervisor approval", active: false },
];

export default function EligibilityRulesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/academic/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Dashboard
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Eligibility rules</h1>
          <p className="mt-0.5 text-sm text-slate-600">
            Define logic for exam eligibility (e.g. min attendance, no debt). All conditions must be met.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/academic/exam-eligibility/students"
            className="inline-flex h-10 items-center justify-center rounded-md border border-purple-600 px-4 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-50"
          >
            Student list
          </Link>
          <Link
            href="/academic/exam-eligibility/overrides"
            className="inline-flex h-10 items-center justify-center rounded-md border border-purple-600 px-4 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-50"
          >
            Overrides
          </Link>
          <Link
            href="/academic/exam-eligibility/access"
            className="inline-flex h-10 items-center justify-center rounded-md bg-purple-600 px-4 text-sm font-medium text-white transition-colors hover:bg-purple-700"
          >
            Exam access
          </Link>
        </div>
      </div>

      <Card className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-purple-900">Rules</h2>
        <p className="mt-0.5 text-xs text-slate-600">Conditions are combined with AND. Students must satisfy the active rule for their exam type.</p>
        <ul className="mt-4 space-y-3">
          {MOCK_RULES.map((r) => (
            <li
              key={r.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border-2 border-purple-200 bg-purple-50/50 px-4 py-3"
            >
              <div>
                <p className="font-medium text-purple-900">{r.name}</p>
                <p className="mt-0.5 font-mono text-sm text-purple-800">{r.logic}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    r.active ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {r.active ? "Active" : "Inactive"}
                </span>
                <button
                  type="button"
                  onClick={() => alert(`Edit rule (Demo): ${r.name}`)}
                  className="rounded-md border border-purple-600 px-3 py-1.5 text-sm font-medium text-purple-700 hover:bg-purple-100"
                >
                  Edit
                </button>
              </div>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => alert("Add rule (Demo)")}
          className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-purple-600 px-4 text-sm font-medium text-white hover:bg-purple-700"
        >
          + Add rule
        </button>
      </Card>
    </div>
  );
}
