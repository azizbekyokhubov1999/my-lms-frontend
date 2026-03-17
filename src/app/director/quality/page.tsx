"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const PROGRAM_APPROVAL_RATE = 87; // %
const COURSE_COMPLIANCE_AVG = 82; // score 0-100
const AVG_RESOLUTION_DAYS = 12;
const ISSUES_OPEN = 5;
const HAS_WARNINGS = ISSUES_OPEN > 3 || COURSE_COMPLIANCE_AVG < 85;

export default function QualityDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/director" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          ← Deputy Director
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Quality dashboard</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          High-level view of AQAD metrics: program approval, compliance, and issue resolution.
        </p>
      </div>

      {HAS_WARNINGS && (
        <Card className="border-amber-500/50 bg-amber-50/50">
          <p className="text-sm font-medium text-amber-800">
            Quality warning: {ISSUES_OPEN} open quality issue(s); course compliance below 85%. Review AQAD metrics and corrective actions.
          </p>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-0 bg-slate-900 shadow-lg">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Program approval rate</p>
          <p className="mt-2 text-2xl font-bold text-white">{PROGRAM_APPROVAL_RATE}%</p>
          <p className="mt-0.5 text-xs text-slate-500">Programs approved by AQAD</p>
        </Card>
        <Card className={cn("border-0 shadow-lg", COURSE_COMPLIANCE_AVG < 85 ? "bg-amber-500/90" : "bg-slate-900")}>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-200">Course compliance score</p>
          <p className="mt-2 text-2xl font-bold text-white">{COURSE_COMPLIANCE_AVG}/100</p>
          <p className="mt-0.5 text-xs text-slate-300">Average across courses</p>
        </Card>
        <Card className="border-0 bg-slate-900 shadow-lg">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Avg. resolution time</p>
          <p className="mt-2 text-2xl font-bold text-white">{AVG_RESOLUTION_DAYS} days</p>
          <p className="mt-0.5 text-xs text-slate-500">Quality issues closed</p>
        </Card>
      </div>

      <Card className="border-slate-200 bg-slate-50/50">
        <h2 className="text-sm font-semibold text-slate-700">Quality module</h2>
        <div className="mt-2 flex flex-wrap gap-3">
          <Link href="/director/quality/metrics" className="text-sm font-medium text-slate-700 underline decoration-amber-500 hover:decoration-amber-600">AQAD metrics →</Link>
          <Link href="/director/quality/complaints" className="text-sm font-medium text-slate-700 underline decoration-amber-500 hover:decoration-amber-600">Complaints analysis →</Link>
          <Link href="/director/quality/actions" className="text-sm font-medium text-slate-700 underline decoration-amber-500 hover:decoration-amber-600">Corrective actions →</Link>
        </div>
      </Card>
    </div>
  );
}
