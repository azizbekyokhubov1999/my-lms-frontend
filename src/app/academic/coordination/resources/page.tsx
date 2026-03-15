"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type Status = "pending" | "approved" | "rejected";

const MOCK_TICKETS = [
  { id: "RES-001", type: "Room", subject: "A101 – CS101", module: "CS101", detail: "Need lab-capable room for practicals.", status: "pending" as Status, createdAt: "2026-03-05" },
  { id: "RES-002", type: "Teacher", subject: "Dr. Sokolova – SE201", module: "SE201", detail: "Request same instructor for next term.", status: "approved" as Status, createdAt: "2026-03-01" },
  { id: "RES-003", type: "Room", subject: "A101 – CS101", module: "CS101", detail: "Double booking conflict.", status: "rejected" as Status, createdAt: "2026-02-28" },
];

const STATUS_STYLES: Record<Status, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
};

export default function ResourceRequestsPage() {
  const router = useRouter();
  const [requestType, setRequestType] = React.useState<"teacher" | "room">("room");
  const [moduleName, setModuleName] = React.useState("");
  const [detail, setDetail] = React.useState("");

  const canSubmit = moduleName.trim() && detail.trim().length >= 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    const typeLabel = requestType === "teacher" ? "Teacher" : "Room";
    alert(`Resource request submitted (Demo): ${typeLabel} for ${moduleName}. Detail: ${detail}. Ticket created – Resource Dept will review.`);
    router.push("/academic/coordination");
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/academic/coordination" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Coordination
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Resource requests</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Request teachers or specialized rooms from Resource Dept. Service desk: Pending / Approved / Rejected.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">New request</h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-800">Request type</label>
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value as "teacher" | "room")}
                className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
              >
                <option value="room">Room (specialized)</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-800">Module / course</label>
              <input
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                required
                placeholder="e.g. CS101, SE201"
                className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-800">Detail (min 10 chars)</label>
              <textarea
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                required
                minLength={10}
                rows={3}
                placeholder="e.g. Need lab with 30 PCs for practicals. Prefer A101."
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
              />
            </div>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={!canSubmit}>
              Submit request
            </Button>
          </form>
        </Card>

        <Card className="p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Tickets</h2>
          <ul className="mt-4 space-y-2">
            {MOCK_TICKETS.map((t) => (
              <li key={t.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <p className="font-mono font-medium text-slate-900">{t.id}</p>
                  <p className="text-sm text-slate-700">{t.subject}</p>
                  <p className="text-xs text-slate-500">{t.detail}</p>
                </div>
                <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize", STATUS_STYLES[t.status])}>
                  {t.status}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-4">
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Ticket</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Type</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Subject</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Created</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_TICKETS.map((t) => (
                <tr key={t.id} className="hover:bg-purple-50/50">
                  <td className="px-4 py-3 font-mono font-medium text-slate-900">{t.id}</td>
                  <td className="px-4 py-3 text-slate-700">{t.type}</td>
                  <td className="px-4 py-3 text-slate-700">{t.subject}</td>
                  <td className="px-4 py-3 text-slate-600">{t.createdAt}</td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize", STATUS_STYLES[t.status])}>
                      {t.status}
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
