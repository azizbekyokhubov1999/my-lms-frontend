"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Card } from "../../../components/ui/Card";

import {
  getAppeals,
  type Appeal,
  type AppealStatus,
  type AppealType,
} from "./appealsData";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const TYPE_LABELS: Record<AppealType, string> = { grade: "Grade", disciplinary: "Disciplinary" };

const STATUS_STYLES: Record<AppealStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  under_review: "bg-violet-100 text-violet-800",
  resolved: "bg-slate-100 text-slate-700",
};

function statusLabel(a: Appeal): string {
  if (a.status === "resolved" && a.outcome) {
    return `Resolved (${a.outcome === "approved" ? "Approved" : "Rejected"})`;
  }
  return a.status.replace("_", " ");
}

export default function AppealsPage() {
  const pathname = usePathname();
  const [appeals, setAppeals] = React.useState<Appeal[]>([]);
  const [filterStatus, setFilterStatus] = React.useState<AppealStatus | "">("");

  React.useEffect(() => {
    setAppeals(getAppeals());
  }, [pathname]);

  const filtered = React.useMemo(() => {
    if (!filterStatus) return appeals;
    return appeals.filter((a) => a.status === filterStatus);
  }, [appeals, filterStatus]);

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
          <option value="resolved">Resolved</option>
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
                    {a.officerFeedback && <> · <strong>Feedback:</strong> {a.officerFeedback}</>}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_STYLES[a.status])}>
                  {statusLabel(a)}
                </span>
                <Link
                  href={`/academic/exceptions/appeals/${a.id}`}
                  className="inline-flex h-8 items-center justify-center rounded-md bg-violet-600 px-3 text-xs font-medium text-white transition-colors hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
                >
                  {a.status === "resolved" ? "View" : "Review"}
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
