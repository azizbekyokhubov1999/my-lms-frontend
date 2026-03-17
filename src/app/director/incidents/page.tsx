"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Real-time feed: critical issues (newest first). */
const FEED_ITEMS = [
  { id: "f1", title: "Finance collection dropped 40%", time: "2h ago", priority: "High", isNew: true },
  { id: "f2", title: "Major teacher resignation – CS Dept", time: "5h ago", priority: "High", isNew: true },
  { id: "f3", title: "Lab equipment failure – Building B", time: "1d ago", priority: "Medium", isNew: false },
  { id: "f4", title: "Student grievance escalation (Law)", time: "1d ago", priority: "Medium", isNew: false },
  { id: "f5", title: "IT outage during exam window", time: "2d ago", priority: "High", isNew: false },
];

/** Critical issues list: prioritized with escalation status. */
const CRITICAL_ISSUES = [
  { id: "c1", issue: "Finance collection dropped 40%", priority: "High", escalation: "Escalated", department: "Finance", reported: "2025-03-06" },
  { id: "c2", issue: "Major teacher resignation – CS Dept", priority: "High", escalation: "Pending", department: "Engineering", reported: "2025-03-06" },
  { id: "c3", issue: "IT outage during exam window", priority: "High", escalation: "Resolved", department: "IT", reported: "2025-03-04" },
  { id: "c4", issue: "Lab equipment failure – Building B", priority: "Medium", escalation: "In progress", department: "Engineering", reported: "2025-03-05" },
  { id: "c5", issue: "Student grievance escalation (Law)", priority: "Medium", escalation: "Pending", department: "Law", reported: "2025-03-05" },
  { id: "c6", issue: "Overdue curriculum review – BUS101", priority: "Low", escalation: "Pending", department: "Business", reported: "2025-03-01" },
];

export default function IncidentDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/director" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          ← Deputy Director
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Incident dashboard</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Real-time feed of critical issues and prioritized list with escalation status.
        </p>
      </div>

      {/* Real-time feed */}
      <Card className="border-slate-200 bg-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Real-time feed
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">Latest critical issues.</p>
        <ul className="mt-4 space-y-2">
          {FEED_ITEMS.map((item) => (
            <li
              key={item.id}
              className={cn(
                "flex flex-wrap items-center justify-between gap-2 rounded-lg border px-4 py-3",
                item.priority === "High"
                  ? "border-rose-200 bg-rose-50/50"
                  : "border-slate-200 bg-slate-50/30",
                !item.isNew && "border-slate-300 bg-slate-800/5",
              )}
            >
              <div className="min-w-0 flex-1">
                <p className={cn(
                  "font-medium",
                  item.priority === "High" ? "text-rose-900" : "text-slate-900",
                )}>
                  {item.title}
                </p>
                <p className={cn(
                  "text-xs",
                  item.isNew ? "text-slate-500" : "text-slate-500",
                )}>
                  {item.time}
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                  item.priority === "High" && "bg-rose-600 text-white",
                  item.priority === "Medium" && "bg-amber-100 text-amber-800",
                  item.priority === "Low" && "bg-slate-200 text-slate-700",
                )}
              >
                {item.priority}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Critical issues list – prioritized table with escalation */}
      <Card className="border-slate-200 bg-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Critical issues list
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">Prioritized (High, Medium, Low) with escalation status.</p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-800 text-left">
                <th className="px-4 py-3 font-medium text-slate-200">Issue</th>
                <th className="px-4 py-3 font-medium text-slate-200">Priority</th>
                <th className="px-4 py-3 font-medium text-slate-200">Escalation</th>
                <th className="px-4 py-3 font-medium text-slate-200">Department</th>
                <th className="px-4 py-3 font-medium text-slate-200">Reported</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {CRITICAL_ISSUES.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-medium text-slate-900">{row.issue}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        row.priority === "High" && "bg-rose-600 text-white",
                        row.priority === "Medium" && "bg-amber-100 text-amber-800",
                        row.priority === "Low" && "bg-slate-200 text-slate-700",
                      )}
                    >
                      {row.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        row.escalation === "Escalated" && "bg-rose-100 text-rose-800",
                        row.escalation === "In progress" && "bg-amber-100 text-amber-800",
                        row.escalation === "Resolved" && "bg-emerald-100 text-emerald-800",
                        row.escalation === "Pending" && "bg-slate-200 text-slate-700",
                      )}
                    >
                      {row.escalation}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{row.department}</td>
                  <td className="px-4 py-3 text-slate-600">{row.reported}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="border-slate-200 bg-slate-50/50">
        <h2 className="text-sm font-semibold text-slate-700">Incidents module</h2>
        <div className="mt-2 flex flex-wrap gap-3">
          <Link href="/director/incidents/systemic" className="text-sm font-medium text-slate-700 underline decoration-rose-500 hover:decoration-rose-600">Systemic issues →</Link>
        </div>
      </Card>
    </div>
  );
}
