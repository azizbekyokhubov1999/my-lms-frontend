"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

const REPORT_TYPES = [
  { id: "engagement", name: "Monthly User Engagement", description: "Active users, sessions, and page views by month." },
  { id: "completion", name: "Course Completion Trends", description: "Completion rates and drop-off by course and cohort." },
  { id: "grades", name: "Grade Distribution Summary", description: "Score distributions and pass/fail rates by course." },
  { id: "revenue", name: "Revenue & Payments", description: "Payments, refunds, and revenue by period." },
];

const MOCK_ENGAGEMENT = { months: ["Jan", "Feb", "Mar"], activeUsers: [1200, 1350, 1420], sessions: [5400, 6100, 5900] };
const MOCK_COMPLETION = { courses: ["CS 440", "CS 210", "RES 301"], completionRate: [78, 82, 71] };

export default function SystemReportsPage() {
  const [selectedReport, setSelectedReport] = React.useState<string | null>(null);
  const [generating, setGenerating] = React.useState(false);
  const [generated, setGenerated] = React.useState<string | null>(null);

  const generateReport = (id: string) => {
    setSelectedReport(id);
    setGenerating(true);
    setGenerated(null);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(id);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Reports</h1>
          <p className="mt-1 text-sm text-slate-600">
            System reports, analytics, and data export for BI tools.
          </p>
        </div>
        <nav className="flex gap-2">
          <Link href="/admin/reports" className="inline-flex h-9 items-center rounded-md bg-slate-100 px-3 text-sm font-medium text-slate-900">System Reports</Link>
          <Link href="/admin/reports/analytics" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">Analytics</Link>
          <Link href="/admin/reports/export" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">Data Export</Link>
        </nav>
      </div>

      <Card className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          System reports
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Generate high-level summaries. Select a report and click Generate.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {REPORT_TYPES.map((r) => (
            <div
              key={r.id}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-4"
            >
              <h3 className="font-semibold text-slate-900">{r.name}</h3>
              <p className="mt-1 text-sm text-slate-600">{r.description}</p>
              <Button
                variant="primary"
                size="sm"
                className="mt-3"
                onClick={() => generateReport(r.id)}
                disabled={generating}
              >
                {generating && selectedReport === r.id ? "Generating…" : "Generate"}
              </Button>
            </div>
          ))}
        </div>
        {generated && !generating && (
          <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50/50 p-4">
            <p className="font-medium text-emerald-800">Report generated</p>
            <p className="mt-1 text-sm text-emerald-700">
              {generated === "engagement" && (
                <>Monthly engagement: {MOCK_ENGAGEMENT.months.join(", ")} — Active users: {MOCK_ENGAGEMENT.activeUsers.join(" → ")}; Sessions: {MOCK_ENGAGEMENT.sessions.join(", ")}.</>
              )}
              {generated === "completion" && (
                <>Completion trends: {MOCK_COMPLETION.courses.map((c, i) => `${c} ${MOCK_COMPLETION.completionRate[i]}%`).join("; ")}.</>
              )}
              {generated === "grades" && "Grade distribution summary ready. Download from Data Export if needed."}
              {generated === "revenue" && "Revenue & payments summary ready. Export from Data Export for details."}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
