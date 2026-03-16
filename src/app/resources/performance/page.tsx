"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const RANKINGS = [
  { id: "t1", rank: 1, name: "Dr. Nina Kozlova", faculty: "Engineering", score: 4.8 },
  { id: "t2", rank: 2, name: "Prof. Timur Akhmetov", faculty: "Business", score: 4.6 },
  { id: "t3", rank: 3, name: "Dr. Aigerim Sadykova", faculty: "Law", score: 4.5 },
  { id: "t4", rank: 4, name: "Assoc. Prof. Malik Nurgaliyev", faculty: "Medicine", score: 4.4 },
  { id: "t5", rank: 5, name: "Ms. Olga Petrova", faculty: "Language", score: 4.3 },
];

const AVG_FEEDBACK_BY_FACULTY = [
  { faculty: "Engineering", avg: 4.5 },
  { faculty: "Business", avg: 4.3 },
  { faculty: "Law", avg: 4.4 },
  { faculty: "Medicine", avg: 4.2 },
  { faculty: "Arts & Sci", avg: 4.1 },
];

const QA_RESPONSE_STATS = [
  { label: "Avg response time", value: "18h", onTarget: true },
  { label: "Within 24h SLA %", value: "92%", onTarget: true },
  { label: "Needs improvement", value: "8%", onTarget: false },
];

export default function PerformanceDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Performance dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">
            Teacher rankings, average student feedback scores, and Q&amp;A response times.
          </p>
        </div>
        <Link
          href="/resources/performance/reports"
          className="inline-flex h-9 items-center justify-center rounded-md border border-teal-600 bg-white px-3 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-50"
        >
          Generate reports →
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-teal-100 bg-teal-50/50">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Avg. feedback score</p>
          <p className="mt-2 text-2xl font-bold text-teal-600">4.42</p>
          <p className="mt-0.5 text-xs text-slate-600">Out of 5 (all teachers)</p>
        </Card>
        <Card className="border-teal-100 bg-teal-50/50">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Q&amp;A avg. response</p>
          <p className="mt-2 text-2xl font-bold text-teal-600">18h</p>
          <p className="mt-0.5 text-xs text-slate-600">Target: &lt; 24h</p>
        </Card>
        <Card className="border-amber-100 bg-amber-50/50">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Below SLA</p>
          <p className="mt-2 text-2xl font-bold text-amber-600">8%</p>
          <p className="mt-0.5 text-xs text-slate-600">Responses &gt; 24h</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Teacher rankings */}
        <Card className="border-teal-100 bg-white/80">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Top teacher rankings</h2>
          <p className="mt-0.5 text-xs text-slate-600">By average student feedback (last 3 months).</p>
          <ul className="mt-4 space-y-2">
            {RANKINGS.map((r) => (
              <li key={r.rank}>
                <Link
                  href={`/resources/performance/${r.id}`}
                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm transition-colors hover:bg-teal-50 hover:border-teal-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
                      {r.rank}
                    </span>
                    <div>
                      <p className="font-medium text-slate-900">{r.name}</p>
                      <p className="text-xs text-slate-500">{r.faculty}</p>
                    </div>
                  </div>
                  <span className={cn("font-semibold", r.score >= 4.5 ? "text-teal-600" : "text-amber-600")}>
                    {r.score}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        {/* Q&A response times */}
        <Card className="border-teal-100 bg-white/80">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Q&amp;A response SLA</h2>
          <p className="mt-0.5 text-xs text-slate-600">Target: answer student questions within 24 hours.</p>
          <div className="mt-4 space-y-3">
            {QA_RESPONSE_STATS.map((s) => (
              <div
                key={s.label}
                className={cn(
                  "flex items-center justify-between rounded-lg border px-3 py-2",
                  s.onTarget ? "border-teal-200 bg-teal-50/50" : "border-amber-200 bg-amber-50/50",
                )}
              >
                <span className="text-sm text-slate-700">{s.label}</span>
                <span className={cn("font-semibold", s.onTarget ? "text-teal-600" : "text-amber-600")}>
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Average feedback by faculty */}
      <Card className="border-teal-100 bg-white/80">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Average feedback by faculty</h2>
        <p className="mt-0.5 text-xs text-slate-600">Student feedback score (1–5) per faculty.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {AVG_FEEDBACK_BY_FACULTY.map((f) => {
            const good = f.avg >= 4.3;
            return (
              <div
                key={f.faculty}
                className={cn(
                  "rounded-lg border p-3",
                  good ? "border-teal-200 bg-teal-50/30" : "border-amber-200 bg-amber-50/30",
                )}
              >
                <p className="text-xs font-medium text-slate-600">{f.faculty}</p>
                <p className={cn("mt-1 text-xl font-bold", good ? "text-teal-600" : "text-amber-600")}>
                  {f.avg.toFixed(1)}
                </p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
