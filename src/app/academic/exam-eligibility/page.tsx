"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Card } from "../../components/ui/Card";
import { getStoredRules, type EligibilityRule } from "./eligibilityRules";

export default function EligibilityRulesPage() {
  const pathname = usePathname();
  const [rules, setRules] = React.useState<EligibilityRule[]>([]);

  React.useEffect(() => {
    setRules(getStoredRules());
  }, [pathname]);

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
            href="/academic/calendar"
            className="inline-flex h-10 items-center justify-center rounded-md border border-purple-600 px-4 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-50"
          >
            Academic Calendar
          </Link>
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
          {rules.length === 0 ? (
            <li className="rounded-lg border-2 border-dashed border-purple-200 bg-purple-50/30 px-4 py-8 text-center text-sm text-slate-600">
              No rules yet. Add a rule to define eligibility conditions.
            </li>
          ) : (
            rules.map((r) => (
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
                  <Link
                    href={`/academic/exam-eligibility/rules/manage?id=${encodeURIComponent(r.id)}`}
                    className="rounded-md border border-purple-600 px-3 py-1.5 text-sm font-medium text-purple-700 hover:bg-purple-100"
                  >
                    Edit
                  </Link>
                </div>
              </li>
            ))
          )}
        </ul>
        <Link
          href="/academic/exam-eligibility/rules/manage"
          className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-purple-600 px-4 text-sm font-medium text-white hover:bg-purple-700"
        >
          + Add rule
        </Link>
      </Card>
    </div>
  );
}
