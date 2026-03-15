"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type AppealType = "grade" | "disciplinary";
type AppealStatus = "pending" | "under_review" | "approved" | "rejected";

interface Appeal {
  id: string;
  studentName: string;
  studentId: string;
  type: AppealType;
  subject: string;
  submittedAt: string;
  status: AppealStatus;
  summary: string;
  reviewedBy?: string;
  reviewedAt?: string;
  outcomeReason?: string;
}

const MOCK_APPEALS: Appeal[] = [
  { id: "ap1", studentName: "Ivan Kozlov", studentId: "STU-10002", type: "grade", subject: "CS101 Mid-term", submittedAt: "2026-03-05", status: "pending", summary: "Student appeals grade; claims grading error on question 3." },
  { id: "ap2", studentName: "Dmitri Volkov", studentId: "STU-10004", type: "disciplinary", subject: "Attendance warning", submittedAt: "2026-03-04", status: "under_review", summary: "Appeal against attendance-based warning. Medical documentation provided." },
  { id: "ap3", studentName: "Elena Novikova", studentId: "STU-10005", type: "grade", subject: "SE201 Assignment", submittedAt: "2026-03-01", status: "approved", summary: "Re-grade request.", reviewedBy: "Dr. Sokolova", reviewedAt: "2026-03-03 11:00", outcomeReason: "Partial marks restored after re-check." },
];

const TYPE_LABELS: Record<AppealType, string> = { grade: "Grade", disciplinary: "Disciplinary" };
const STATUS_STYLES: Record<AppealStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  under_review: "bg-violet-100 text-violet-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
};

export default function AppealsPage() {
  const [filterStatus, setFilterStatus] = React.useState<AppealStatus | "">("");

  const filtered = React.useMemo(() => {
    if (!filterStatus) return MOCK_APPEALS;
    return MOCK_APPEALS.filter((a) => a.status === filterStatus);
  }, [filterStatus]);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/academic/exceptions" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Exceptions
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Appeals management</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Workflow to review student appeals against grades or disciplinary actions.
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-medium text-slate-500">Filter by status</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as AppealStatus | "")}
          className="mt-0.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="under_review">Under review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map((a) => (
          <Card key={a.id} className="border-violet-200 bg-violet-100 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium text-slate-900">{a.studentName}</p>
                <p className="text-xs font-mono text-slate-500">{a.studentId}</p>
                <span className="mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold text-violet-800">
                  {TYPE_LABELS[a.type]}
                </span>
                <p className="mt-1 text-sm font-medium text-slate-800">{a.subject}</p>
                <p className="mt-0.5 text-sm text-slate-700">{a.summary}</p>
                <p className="mt-1 text-xs text-slate-500">Submitted: {a.submittedAt}</p>
                {a.reviewedBy && (
                  <p className="mt-1 text-xs text-slate-600">
                    <strong>Reviewed by:</strong> {a.reviewedBy} · {a.reviewedAt}
                    {a.outcomeReason && <> · <strong>Why:</strong> {a.outcomeReason}</>}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_STYLES[a.status])}>
                  {a.status.replace("_", " ")}
                </span>
                {(a.status === "pending" || a.status === "under_review") && (
                  <Button
                    type="button"
                    size="sm"
                    className="bg-violet-600 hover:bg-violet-700"
                    onClick={() => alert(`Open appeal workflow for ${a.subject} (Demo). Record decision and reason for audit.`)}
                  >
                    Review
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
