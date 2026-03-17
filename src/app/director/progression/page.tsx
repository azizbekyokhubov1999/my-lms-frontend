"use client";

import Link from "next/link";

import { Card } from "../../components/ui/Card";

export default function ProgressionPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/director" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          ← Deputy Director
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Progression</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Retention analytics and dropout risk.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/director/progression/retention">
          <Card className="h-full border-slate-200 bg-white transition-shadow hover:shadow-md">
            <h2 className="text-sm font-semibold text-slate-800">Retention analytics</h2>
            <p className="mt-1 text-xs text-slate-600">
              Cohort analysis: how many students from the 2024 intake are still active.
            </p>
            <span className="mt-3 inline-block text-sm font-medium text-slate-600">View cohort analysis →</span>
          </Card>
        </Link>
        <Link href="/director/progression/dropout-risk">
          <Card className="h-full border-slate-200 bg-white transition-shadow hover:shadow-md">
            <h2 className="text-sm font-semibold text-slate-800">Dropout risk</h2>
            <p className="mt-1 text-xs text-slate-600">
              Predictive view of students likely to leave (financial and academic patterns).
            </p>
            <span className="mt-3 inline-block text-sm font-medium text-slate-600">View risk list →</span>
          </Card>
        </Link>
      </div>
    </div>
  );
}
