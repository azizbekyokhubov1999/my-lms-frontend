"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface UnblockRequest {
  id: string;
  studentName: string;
  studentId: string;
  requestedBy: string;
  reason: string;
  requestedAt: string;
  status: "Pending" | "Approved" | "Rejected";
}

const MOCK_REQUESTS: UnblockRequest[] = [
  { id: "REQ-1", studentName: "Anna Petrova", studentId: "STU-10001", requestedBy: "Dr. Ivanov (Academic Dept)", reason: "Final exam on 2026-03-10", requestedAt: "2026-03-05", status: "Pending" },
  { id: "REQ-2", studentName: "Ivan Kozlov", studentId: "STU-10002", requestedBy: "Prof. Sokolova (Dean Office)", reason: "Thesis defense scheduled", requestedAt: "2026-03-04", status: "Pending" },
];

export default function UnblockingRequestsPage() {
  const [requests, setRequests] = React.useState(MOCK_REQUESTS);
  const [comments, setComments] = React.useState<Record<string, string>>({});

  const handleApprove = (id: string) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Approved" } : r)));
    setComments((c) => ({ ...c, [id]: "" }));
  };

  const handleReject = (id: string) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Rejected" } : r)));
  };

  const pending = requests.filter((r) => r.status === "Pending");

  return (
    <div className="space-y-6">
      <div>
        <Link href="/finance/blocking" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Blocking System
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Unblocking Requests</h1>
        <p className="mt-1 text-sm text-slate-600">
          Manual exceptions from Academic Dept. Approve or reject with a comment.
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          {pending.length === 0 ? (
            <p className="text-center text-slate-500">No pending unblocking requests.</p>
          ) : (
            pending.map((req) => (
              <div
                key={req.id}
                className="rounded-lg border border-slate-200 bg-slate-50/50 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-900">{req.studentName}</p>
                    <p className="text-sm text-slate-500">{req.studentId}</p>
                    <p className="mt-1 text-sm text-slate-700">{req.reason}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Requested by {req.requestedBy} on {req.requestedAt}
                    </p>
                  </div>
                  <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                    Pending Unblock
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap items-end gap-3">
                  <div className="min-w-0 flex-1">
                    <label className="block text-xs font-medium text-slate-600">Comment (optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Approved for exam period only"
                      value={comments[req.id] ?? ""}
                      onChange={(e) => setComments((c) => ({ ...c, [req.id]: e.target.value }))}
                      className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handleApprove(req.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                      onClick={() => handleReject(req.id)}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {requests.some((r) => r.status !== "Pending") && (
        <Card className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Recent Decisions</h2>
          <ul className="mt-4 space-y-2">
            {requests
              .filter((r) => r.status !== "Pending")
              .map((r) => (
                <li key={r.id} className="flex items-center justify-between rounded border border-slate-100 px-4 py-2">
                  <span className="text-sm text-slate-700">{r.studentName} ({r.studentId})</span>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                      r.status === "Approved" && "bg-green-100 text-green-700",
                      r.status === "Rejected" && "bg-red-100 text-red-700",
                    )}
                  >
                    {r.status}
                  </span>
                </li>
              ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
