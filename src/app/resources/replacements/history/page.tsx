"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../../components/ui/Card";

interface HistoryRow {
  id: string;
  outgoingTeacher: string;
  incomingTeacher: string;
  reason: string;
  initiatedAt: string;
  initiatedBy: string;
  status: "Completed" | "In progress";
}

const MOCK_HISTORY: HistoryRow[] = [
  {
    id: "r1",
    outgoingTeacher: "Dr. Nina Kozlova",
    incomingTeacher: "Mr. Alex Petrov",
    reason: "Temporary leave of absence. Mr. Petrov assigned as replacement for SE301 and CS101.",
    initiatedAt: "2026-03-01 14:30",
    initiatedBy: "Resource Manager",
    status: "Completed",
  },
  {
    id: "r2",
    outgoingTeacher: "Prof. Timur Akhmetov",
    incomingTeacher: "Ms. Aida Suleimen",
    reason: "Reassignment to research. Content transfer and group handover completed.",
    initiatedAt: "2026-02-15 09:00",
    initiatedBy: "Head of Business School",
    status: "Completed",
  },
  {
    id: "r3",
    outgoingTeacher: "Dr. Aigerim Sadykova",
    incomingTeacher: "TBD",
    reason: "Resignation. Incoming replacement to be confirmed.",
    initiatedAt: "2026-03-05 11:00",
    initiatedBy: "Resource Manager",
    status: "In progress",
  },
];

export default function ReplacementHistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/resources/replacements" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Replacements
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Replacement history</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Audit trail: why, when, and by whom each replacement was initiated.
        </p>
      </div>

      <Card>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Outgoing</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Incoming</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Reason</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Initiated</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">By</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_HISTORY.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-medium text-slate-900">{r.outgoingTeacher}</td>
                  <td className="px-4 py-3 text-slate-700">{r.incomingTeacher}</td>
                  <td className="max-w-[240px] px-4 py-3 text-slate-600">{r.reason}</td>
                  <td className="px-4 py-3 text-slate-600">{r.initiatedAt}</td>
                  <td className="px-4 py-3 text-slate-600">{r.initiatedBy}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        r.status === "Completed"
                          ? "rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-800"
                          : "rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800"
                      }
                    >
                      {r.status}
                    </span>
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
