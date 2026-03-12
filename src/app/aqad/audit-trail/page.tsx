"use client";

import Link from "next/link";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

interface AuditEntry {
  id: string;
  timestamp: string;
  auditorName: string;
  action: string;
  entity: string;
  changeId?: string;
}

const MOCK_TRAIL: AuditEntry[] = [
  {
    id: "1",
    timestamp: "2026-03-06T14:32:00",
    auditorName: "Jane Smith",
    action: "Approved Course CS 440 - Machine Learning",
    entity: "Course",
    changeId: "ch1",
  },
  {
    id: "2",
    timestamp: "2026-03-06T11:15:00",
    auditorName: "John Doe",
    action: "Resolved complaint C001 (Grade dispute)",
    entity: "Complaint",
    changeId: "ch2",
  },
  {
    id: "3",
    timestamp: "2026-03-05T16:00:00",
    auditorName: "Maria Garcia",
    action: "Cleared exam flag for RES 301",
    entity: "Exam audit",
    changeId: "ch3",
  },
  {
    id: "4",
    timestamp: "2026-03-05T09:45:00",
    auditorName: "Jane Smith",
    action: "Issued corrective action: Update Lecture 5 video",
    entity: "Corrective action",
    changeId: "ch4",
  },
  {
    id: "5",
    timestamp: "2026-03-04T17:20:00",
    auditorName: "John Doe",
    action: "Rejected course CS 220 - Algorithms (resubmission required)",
    entity: "Course",
    changeId: "ch5",
  },
  {
    id: "6",
    timestamp: "2026-03-04T10:00:00",
    auditorName: "Maria Garcia",
    action: "Conditional approval: BUS 210 - Organizational Behavior",
    entity: "Course",
    changeId: "ch6",
  },
];

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AuditTrailPage() {
  return (
    <div className="space-y-6">
      <section>
        <Link href="/aqad" className="text-xs font-medium text-indigo-600 hover:underline">
          ← AQAD Dashboard
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
          Audit trail
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Complete transparency of all quality assurance actions. Timestamp, auditor, action, and entity for every change.
        </p>
      </section>
      <Card className="overflow-hidden rounded-lg border-slate-200 p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                  Timestamp
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                  Auditor name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                  Action
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                  Entity
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-600">
                  View changes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {MOCK_TRAIL.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">
                    {formatTimestamp(row.timestamp)}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {row.auditorName}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {row.action}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {row.entity}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {row.changeId ? (
                      <Link
                        href={`/aqad/audit-trail/${row.changeId}`}
                        className="text-xs font-medium text-indigo-600 hover:underline"
                      >
                        View changes
                      </Link>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-100 px-4 py-3">
          <Button type="button" variant="outline" size="sm">
            Export audit log
          </Button>
        </div>
      </Card>
    </div>
  );
}
