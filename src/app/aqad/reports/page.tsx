"use client";

import Link from "next/link";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

const MOCK_FAILED_AUDITS = [
  { id: "fa1", courseCode: "CS 450", courseName: "Advanced Algorithms", failedDate: "Mar 1, 2026" },
  { id: "fa2", courseCode: "EE 320", courseName: "Digital Signal Processing", failedDate: "Feb 28, 2026" },
];

export default function AqadReportsPage() {
  return (
    <div className="space-y-6">
      <section>
        <Link href="/aqad" className="text-xs font-medium text-indigo-600 hover:underline">
          ← AQAD Dashboard
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
          Reports &amp; Analytics
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Quality metrics, audit outcomes, and corrective action summaries.
        </p>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-slate-900">Failed Audits</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Audits that did not meet quality standards. Manage follow-up in Corrective Actions.
        </p>
        <Card className="mt-3 overflow-hidden rounded-lg border-slate-200 p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Course
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Failed date
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {MOCK_FAILED_AUDITS.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-900">{row.courseName}</span>
                      <span className="ml-1 text-xs text-slate-500">{row.courseCode}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{row.failedDate}</td>
                    <td className="px-4 py-3 text-right">
                      <Link href="/aqad/corrective-actions">
                        <Button type="button" variant="secondary" size="sm">
                          Corrective Actions
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-3">
            <Link href="/aqad/corrective-actions" className="inline-flex items-center text-xs font-medium text-indigo-600 hover:underline">
              View all corrective actions →
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
