"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const CORRECTIVE_ACTIONS = [
  { id: "a1", fix: "Update curriculum for IT101", program: "Engineering", status: "In progress", dueDate: "2025-04-15", orderedBy: "AQAD" },
  { id: "a2", fix: "Revise assessment rubric – LAW201", program: "Law", status: "Completed", dueDate: "2025-03-01", orderedBy: "AQAD" },
  { id: "a3", fix: "Improve lab safety documentation – MED301", program: "Medicine", status: "Pending", dueDate: "2025-05-01", orderedBy: "AQAD" },
  { id: "a4", fix: "Align BUS101 learning outcomes with standards", program: "Business", status: "In progress", dueDate: "2025-04-30", orderedBy: "AQAD" },
  { id: "a5", fix: "Update syllabus templates (all programs)", program: "Central", status: "Completed", dueDate: "2025-02-28", orderedBy: "AQAD" },
  { id: "a6", fix: "Staff training on grading consistency", program: "Arts & Sciences", status: "Pending", dueDate: "2025-05-15", orderedBy: "AQAD" },
];

export default function CorrectiveActionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/director/quality" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          ← Quality dashboard
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Corrective actions</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Track the status of fixes ordered by AQAD (e.g. curriculum updates, compliance fixes).
        </p>
      </div>

      <Card className="border-slate-200 bg-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          AQAD-ordered fixes
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Status: Pending, In progress, Completed.
        </p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Fix</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Program</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Due date</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Ordered by</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {CORRECTIVE_ACTIONS.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-medium text-slate-900">{row.fix}</td>
                  <td className="px-4 py-3 text-slate-700">{row.program}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        row.status === "Completed" && "bg-emerald-100 text-emerald-800",
                        row.status === "In progress" && "bg-amber-100 text-amber-800",
                        row.status === "Pending" && "bg-slate-200 text-slate-700",
                      )}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{row.dueDate}</td>
                  <td className="px-4 py-3 text-slate-600">{row.orderedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="border-amber-500/30 bg-amber-50/30">
        <p className="text-sm text-amber-800">
          <strong>Warning:</strong> 2 corrective actions are still pending. Ensure due dates are met to maintain AQAD compliance.
        </p>
      </Card>
    </div>
  );
}
