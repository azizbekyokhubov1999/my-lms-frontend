"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type TicketStatus = "pending" | "approved" | "rejected";

const BLOCKED_STUDENTS = [
  { id: "STU-10002", name: "Ivan Kozlov", debtAmount: 285000, group: "SD-24-01" },
  { id: "STU-10004", name: "Dmitri Volkov", debtAmount: 120000, group: "SD-24-01" },
];

const MOCK_TICKETS = [
  { id: "FIN-001", studentId: "STU-10002", subject: "Temporary unlock – mid-terms", reason: "Allow to sit CS101 mid-term; payment plan in place.", status: "pending" as TicketStatus, createdAt: "2026-03-05" },
  { id: "FIN-002", studentId: "STU-10004", subject: "Unlock – SE201", reason: "Finance agreed partial payment.", status: "approved" as TicketStatus, createdAt: "2026-03-01" },
];

const STATUS_STYLES: Record<TicketStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
};

export default function FinanceCoordinationPage() {
  const router = useRouter();
  const [studentId, setStudentId] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [reason, setReason] = React.useState("");

  const canSubmit = studentId && subject.trim() && reason.trim().length >= 10;

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    const s = BLOCKED_STUDENTS.find((x) => x.id === studentId);
    alert(`Temporary unlock requested (Demo): ${s?.name} (${studentId}). Subject: ${subject}. Reason: ${reason}. Ticket created – Finance will review.`);
    router.push("/academic/coordination");
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/academic/coordination" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Coordination
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Finance coordination</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          View students with financial blocks. Request temporary unlocks for academic reasons. Service desk: Pending / Approved / Rejected.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Students with financial blocks</h2>
          <p className="mt-0.5 text-xs text-slate-600">Request a temporary unlock for academic reasons (e.g. exam).</p>
          <ul className="mt-4 space-y-2">
            {BLOCKED_STUDENTS.map((s) => (
              <li key={s.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <p className="font-medium text-slate-900">{s.name}</p>
                  <p className="text-xs font-mono text-slate-500">{s.id} · {s.group}</p>
                </div>
                <p className="text-sm font-semibold text-rose-600">{s.debtAmount.toLocaleString()} ₸</p>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Request temporary unlock</h2>
          <form onSubmit={handleRequest} className="mt-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-800">Student</label>
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
              >
                <option value="">— Select —</option>
                {BLOCKED_STUDENTS.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-800">Subject / purpose</label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                placeholder="e.g. Temporary unlock – CS101 mid-term"
                className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-800">Reason (academic)</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                minLength={10}
                rows={3}
                placeholder="Explain why temporary unlock is needed..."
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
              />
            </div>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={!canSubmit}>
              Submit request
            </Button>
          </form>
        </Card>
      </div>

      <Card className="p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Tickets (service desk)</h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Ticket</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Subject</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Reason</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Created</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_TICKETS.map((t) => (
                <tr key={t.id} className="hover:bg-purple-50/50">
                  <td className="px-4 py-3 font-mono font-medium text-slate-900">{t.id}</td>
                  <td className="px-4 py-3 text-slate-700">{t.subject}</td>
                  <td className="px-4 py-3 text-slate-600">{t.reason}</td>
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
