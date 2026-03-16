"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../components/ui/Card";

export default function ReplacementsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Replacements</h1>
        <p className="mt-1 text-sm text-slate-600">
          Transition workflow: initiate replacement, transfer content, and view audit history.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/resources/replacements/initiate">
          <Card className="h-full border-teal-100 bg-teal-50/50 transition-shadow hover:shadow-md">
            <h2 className="text-sm font-semibold text-slate-800">Initiate replacement</h2>
            <p className="mt-1 text-xs text-slate-600">
              Select outgoing teacher and incoming replacement. Start the transition workflow.
            </p>
            <span className="mt-3 inline-block text-sm font-medium text-teal-600">Start wizard →</span>
          </Card>
        </Link>
        <Link href="/resources/replacements/transfer">
          <Card className="h-full border-teal-100 bg-teal-50/50 transition-shadow hover:shadow-md">
            <h2 className="text-sm font-semibold text-slate-800">Content transfer</h2>
            <p className="mt-1 text-xs text-slate-600">
              Checklist: course materials, lecture notes, and student groups. Transfer ownership to new teacher.
            </p>
            <span className="mt-3 inline-block text-sm font-medium text-teal-600">Open checklist →</span>
          </Card>
        </Link>
        <Link href="/resources/replacements/history">
          <Card className="h-full border-teal-100 bg-teal-50/50 transition-shadow hover:shadow-md">
            <h2 className="text-sm font-semibold text-slate-800">Replacement history</h2>
            <p className="mt-1 text-xs text-slate-600">
              Audit trail: why, when, and by whom each replacement was initiated.
            </p>
            <span className="mt-3 inline-block text-sm font-medium text-teal-600">View history →</span>
          </Card>
        </Link>
      </div>
    </div>
  );
}
