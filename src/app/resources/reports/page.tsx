"use client";

import Link from "next/link";

import { Card } from "../../components/ui/Card";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Reports</h1>
        <p className="mt-1 text-sm text-slate-600">
          Utilization analytics and resource planning for teaching capacity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/resources/reports/utilization">
          <Card className="h-full border-teal-100 bg-teal-50/50 transition-shadow hover:shadow-md">
            <h2 className="text-sm font-semibold text-slate-800">Utilization analytics</h2>
            <p className="mt-1 text-xs text-slate-600">
              Compare how different departments use their teaching resources.
            </p>
            <span className="mt-3 inline-block text-sm font-medium text-teal-600">View analytics →</span>
          </Card>
        </Link>
        <Link href="/resources/reports/planning">
          <Card className="h-full border-teal-100 bg-teal-50/50 transition-shadow hover:shadow-md">
            <h2 className="text-sm font-semibold text-slate-800">Resource planning</h2>
            <p className="mt-1 text-xs text-slate-600">
              Forecast staffing: expected student intake and teacher gap.
            </p>
            <span className="mt-3 inline-block text-sm font-medium text-teal-600">Open planning →</span>
          </Card>
        </Link>
      </div>
    </div>
  );
}
