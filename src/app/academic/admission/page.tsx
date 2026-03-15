"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface Applicant {
  id: string;
  name: string;
  applicationId: string;
  faculty: string;
  program: string;
  applicationDate: string;
  priority: "high" | "normal" | "low";
}

const MOCK_APPLICANTS: Applicant[] = [
  { id: "a1", name: "Anna Petrova", applicationId: "APP-2026-001", faculty: "Engineering", program: "BSc Software Development", applicationDate: "2026-03-01", priority: "high" },
  { id: "a2", name: "Ivan Kozlov", applicationId: "APP-2026-002", faculty: "Engineering", program: "BSc Computer Science", applicationDate: "2026-03-02", priority: "normal" },
  { id: "a3", name: "Maria Sokolova", applicationId: "APP-2026-003", faculty: "Business", program: "MBA Business Administration", applicationDate: "2026-02-28", priority: "high" },
  { id: "a4", name: "Dmitri Volkov", applicationId: "APP-2026-004", faculty: "Law", program: "LLB Law", applicationDate: "2026-03-05", priority: "normal" },
  { id: "a5", name: "Elena Novikova", applicationId: "APP-2026-005", faculty: "Engineering", program: "BSc Software Development", applicationDate: "2026-03-04", priority: "low" },
];

const PRIORITY_STYLES: Record<Applicant["priority"], string> = {
  high: "bg-rose-100 text-rose-800",
  normal: "bg-violet-100 text-violet-800",
  low: "bg-slate-100 text-slate-600",
};

type SortBy = "date" | "priority";

export default function AdmissionQueuePage() {
  const [sortBy, setSortBy] = React.useState<SortBy>("date");

  const sorted = React.useMemo(() => {
    const list = [...MOCK_APPLICANTS];
    if (sortBy === "date") {
      list.sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime());
    } else {
      const order = { high: 0, normal: 1, low: 2 };
      list.sort((a, b) => order[a.priority] - order[b.priority] || new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime());
    }
    return list;
  }, [sortBy]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/academic/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Dashboard
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Admission Queue</h1>
          <p className="mt-0.5 text-sm text-slate-600">
            Applicants waiting for an academic decision. Status is synced with Admission (Abiturient) role.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/academic/admission/waitlist"
            className="inline-flex h-10 items-center justify-center rounded-md border border-violet-600 px-4 text-sm font-medium text-violet-700 transition-colors hover:bg-violet-50"
          >
            Waitlist
          </Link>
          <Link
            href="/academic/admission/reports"
            className="inline-flex h-10 items-center justify-center rounded-md border border-violet-600 px-4 text-sm font-medium text-violet-700 transition-colors hover:bg-violet-50"
          >
            Reports
          </Link>
        </div>
      </div>

      <Card className="p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-medium text-slate-700">Sort by</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSortBy("date")}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                sortBy === "date" ? "border-violet-600 bg-violet-600 text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
              )}
            >
              Application date
            </button>
            <button
              type="button"
              onClick={() => setSortBy("priority")}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                sortBy === "priority" ? "border-violet-600 bg-violet-600 text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
              )}
            >
              Priority
            </button>
          </div>
        </div>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-violet-200 bg-violet-100">
                <th className="px-4 py-3 text-left font-medium text-violet-900">Applicant</th>
                <th className="px-4 py-3 text-left font-medium text-violet-900">Application ID</th>
                <th className="px-4 py-3 text-left font-medium text-violet-900">Faculty / Program</th>
                <th className="px-4 py-3 text-left font-medium text-violet-900">Application date</th>
                <th className="px-4 py-3 text-left font-medium text-violet-900">Priority</th>
                <th className="w-28 px-4 py-3 text-right font-medium text-violet-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.map((a) => (
                <tr key={a.id} className="hover:bg-violet-50/50">
                  <td className="px-4 py-3 font-medium text-slate-900">{a.name}</td>
                  <td className="px-4 py-3 font-mono text-slate-700">{a.applicationId}</td>
                  <td className="px-4 py-3 text-slate-700">{a.faculty} · {a.program}</td>
                  <td className="px-4 py-3 text-slate-700">{a.applicationDate}</td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", PRIORITY_STYLES[a.priority])}>
                      {a.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/academic/admission/${a.id}`} className="font-medium text-violet-600 hover:underline">
                      Review
                    </Link>
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
