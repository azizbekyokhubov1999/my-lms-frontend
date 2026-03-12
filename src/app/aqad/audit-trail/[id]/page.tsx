"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

// Mock detail keyed by changeId from the trail list (ch1, ch2, …)
const MOCK_DETAILS: Record<
  string,
  {
    auditorName: string;
    timestamp: string;
    entity: "Course" | "User" | "Policy" | "Complaint" | "Exam audit" | "Corrective action";
    actionSummary: string;
    diffs: { field: string; before: string; after: string }[];
    ipAddress: string;
    browserInfo: string;
    transactionId: string;
  }
> = {
  ch1: {
    auditorName: "Jane Smith",
    timestamp: "2026-03-06T14:32:00",
    entity: "Course",
    actionSummary: "Approved course CS 440 - Machine Learning after quality review.",
    diffs: [
      { field: "Status", before: "Pending", after: "Approved" },
      { field: "Reviewed by", before: "—", after: "Jane Smith" },
      { field: "Review date", before: "—", after: "2026-03-06" },
    ],
    ipAddress: "192.168.1.42",
    browserInfo: "Chrome 122.0 / Windows 10",
    transactionId: "TXN-AQAD-2026-03-06-8F3B2C1D",
  },
  ch2: {
    auditorName: "John Doe",
    timestamp: "2026-03-06T11:15:00",
    entity: "Complaint",
    actionSummary: "Resolved complaint C001 (Grade dispute).",
    diffs: [
      { field: "Status", before: "Open", after: "Resolved" },
      { field: "Resolution", before: "—", after: "Grade corrected per rubric." },
    ],
    ipAddress: "10.0.2.18",
    browserInfo: "Firefox 123.0 / macOS",
    transactionId: "TXN-AQAD-2026-03-06-7E2A1B0C",
  },
  ch3: {
    auditorName: "Maria Garcia",
    timestamp: "2026-03-05T16:00:00",
    entity: "Exam audit",
    actionSummary: "Cleared exam flag for RES 301.",
    diffs: [
      { field: "Flag status", before: "Under review", after: "Cleared" },
      { field: "Notes", before: "Face not detected (false positive)", after: "Cleared – verified identity." },
    ],
    ipAddress: "172.16.0.5",
    browserInfo: "Edge 120.0 / Windows 11",
    transactionId: "TXN-AQAD-2026-03-05-9D4C3E2F",
  },
  ch4: {
    auditorName: "Jane Smith",
    timestamp: "2026-03-05T09:45:00",
    entity: "Corrective action",
    actionSummary: "Issued corrective action: Update Lecture 5 video.",
    diffs: [
      { field: "Action", before: "—", after: "Update Lecture 5 video" },
      { field: "Due date", before: "—", after: "2026-03-19" },
    ],
    ipAddress: "192.168.1.42",
    browserInfo: "Chrome 122.0 / Windows 10",
    transactionId: "TXN-AQAD-2026-03-05-1A2B3C4D",
  },
  ch5: {
    auditorName: "John Doe",
    timestamp: "2026-03-04T17:20:00",
    entity: "Course",
    actionSummary: "Rejected course CS 220 - Algorithms (resubmission required).",
    diffs: [
      { field: "Status", before: "In review", after: "Rejected" },
      { field: "Reason", before: "—", after: "Resubmission required – syllabus alignment." },
    ],
    ipAddress: "10.0.2.18",
    browserInfo: "Firefox 123.0 / macOS",
    transactionId: "TXN-AQAD-2026-03-04-5E6F7A8B",
  },
  ch6: {
    auditorName: "Maria Garcia",
    timestamp: "2026-03-04T10:00:00",
    entity: "Course",
    actionSummary: "Conditional approval: BUS 210 - Organizational Behavior.",
    diffs: [
      { field: "Status", before: "In review", after: "Conditionally approved" },
      { field: "Conditions", before: "—", after: "Add subtitles to Lecture 2 by Mar 18." },
    ],
    ipAddress: "172.16.0.5",
    browserInfo: "Edge 120.0 / Windows 11",
    transactionId: "TXN-AQAD-2026-03-04-0B9C8D7E",
  },
};

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function AuditChangeDetailPage() {
  const params = useParams();
  const id = (params?.id as string) ?? "";
  const detail = id ? MOCK_DETAILS[id] : null;

  if (!detail) {
    return (
      <div className="space-y-6">
        <Link href="/aqad/audit-trail" className="text-xs font-medium text-indigo-600 hover:underline">
          ← Back to Trail
        </Link>
        <Card className="rounded-lg border-slate-200 p-6">
          <p className="text-sm text-slate-600">
            Audit change &quot;{id}&quot; not found.
          </p>
          <Link href="/aqad/audit-trail">
            <Button type="button" variant="outline" size="sm" className="mt-3">
              Back to Trail
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section>
        <Link href="/aqad/audit-trail" className="text-xs font-medium text-indigo-600 hover:underline">
          ← Back to Trail
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
          Audit change detail
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Who made the change, when, and what was modified.
        </p>
      </section>

      {/* 1. Change summary */}
      <Card className="rounded-lg border-slate-200 p-4">
        <h2 className="text-sm font-semibold text-slate-900">Change summary</h2>
        <dl className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Who</dt>
            <dd className="mt-0.5 font-medium text-slate-900">{detail.auditorName}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">When</dt>
            <dd className="mt-0.5 font-mono text-sm text-slate-900">
              {formatTimestamp(detail.timestamp)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Entity affected</dt>
            <dd className="mt-0.5 font-medium text-slate-900">{detail.entity}</dd>
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Action</dt>
            <dd className="mt-0.5 text-sm text-slate-700">{detail.actionSummary}</dd>
          </div>
        </dl>
      </Card>

      {/* 2. Diff viewer — Before vs After */}
      <Card className="overflow-hidden rounded-lg border-slate-200 p-0">
        <h2 className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900">
          Before vs After
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[400px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                  Field
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                  Before
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                  After
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {detail.diffs.map((row) => (
                <tr key={row.field} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-slate-900">{row.field}</td>
                  <td className="px-4 py-3 text-slate-600">
                    <span className={row.before === "—" ? "text-slate-400" : ""}>
                      {row.before}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-900">
                    <span className="font-medium text-emerald-800">{row.after}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 3. Metadata */}
      <Card className="rounded-lg border-slate-200 p-4">
        <h2 className="text-sm font-semibold text-slate-900">Metadata</h2>
        <dl className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Audit transaction ID
            </dt>
            <dd className="mt-0.5 font-mono text-sm text-slate-900">
              {detail.transactionId}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              IP address
            </dt>
            <dd className="mt-0.5 font-mono text-sm text-slate-900">{detail.ipAddress}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Browser / environment
            </dt>
            <dd className="mt-0.5 text-sm text-slate-900">{detail.browserInfo}</dd>
          </div>
        </dl>
      </Card>

      {/* 4. Navigation */}
      <div>
        <Link href="/aqad/audit-trail">
          <Button type="button" variant="outline" size="sm">
            Back to Trail
          </Button>
        </Link>
      </div>
    </div>
  );
}
