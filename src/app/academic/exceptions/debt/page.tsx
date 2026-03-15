"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

const MOCK_STUDENTS_WITH_DEBT = [
  { id: "d1", name: "Ivan Kozlov", studentId: "STU-10002", debtAmount: 285000, group: "SD-24-01" },
  { id: "d2", name: "Dmitri Volkov", studentId: "STU-10004", debtAmount: 120000, group: "SD-24-01" },
];

const MOCK_DEBT_WAIVERS = [
  { id: "w1", studentId: "STU-10002", validUntil: "2026-03-15", reason: "Payment plan with Finance. Allowed to attend and sit exams until deadline.", grantedBy: "Dr. Sokolova", grantedAt: "2026-03-01 10:00" },
];

export default function DebtExceptionsPage() {
  const router = useRouter();
  const [selectedId, setSelectedId] = React.useState("");
  const [validUntil, setValidUntil] = React.useState("");
  const [reason, setReason] = React.useState("");

  const canSubmit = selectedId && validUntil && reason.trim().length >= 10;
  const selected = MOCK_STUDENTS_WITH_DEBT.find((s) => s.id === selectedId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !selected) return;
    alert(`Debt exception granted (Demo): ${selected.name} may attend classes/exams despite debt until ${validUntil}. Reason: ${reason}. Coordinated with Finance; audit trail recorded.`);
    router.push("/academic/exceptions");
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/academic/exceptions" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Exceptions
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Debt exceptions</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Allow a student to attend classes or exams despite financial debt. Coordinated with Finance. Who granted and why are recorded.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-violet-200 bg-violet-100 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-violet-900">Grant debt waiver</h2>
          <p className="mt-0.5 text-xs text-slate-600">Select student with debt. Set validity and mandatory reason (audit).</p>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-800">Student (with debt)</label>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
              >
                <option value="">— Select —</option>
                {MOCK_STUDENTS_WITH_DEBT.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.studentId}) · {s.debtAmount.toLocaleString()} ₸
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-800">Valid until</label>
              <input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-800">Reason <span className="text-rose-600">*</span></label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                minLength={10}
                rows={3}
                placeholder="e.g. Payment plan agreed with Finance. Student allowed to attend and sit exams until deadline."
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
              />
            </div>
            <Button
              type="submit"
              className="bg-violet-600 hover:bg-violet-700 focus-visible:ring-violet-500"
              disabled={!canSubmit}
            >
              Grant debt exception
            </Button>
          </form>
        </Card>

        <div className="space-y-4">
          <Card className="border-violet-200 bg-violet-100 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-violet-900">Active debt waivers</h2>
            <p className="mt-0.5 text-xs text-slate-600">Each shows who granted and why (audit trail).</p>
            <ul className="mt-3 space-y-3">
              {MOCK_DEBT_WAIVERS.map((w) => (
                <li key={w.id} className="rounded-lg border border-violet-200 bg-white p-3 text-sm">
                  <p className="font-medium text-slate-900">{w.studentId}</p>
                  <p className="text-slate-700">Valid until: {w.validUntil}</p>
                  <p className="mt-1 text-slate-700"><strong>Why:</strong> {w.reason}</p>
                  <p className="mt-2 text-xs text-slate-500"><strong>Granted by:</strong> {w.grantedBy} · {w.grantedAt}</p>
                </li>
              ))}
            </ul>
          </Card>
          <p className="text-xs text-slate-600">
            Finance module is notified when a debt exception is granted so blocking rules can be adjusted.
          </p>
        </div>
      </div>
    </div>
  );
}
