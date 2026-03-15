"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

const MOCK_STUDENTS = [
  { id: "s1", name: "Anna Petrova", studentId: "STU-10001", group: "SD-24-01" },
  { id: "s2", name: "Ivan Kozlov", studentId: "STU-10002", group: "SD-24-01" },
  { id: "s3", name: "Maria Sokolova", studentId: "STU-10003", group: "SD-24-01" },
];

const MOCK_MODULES = ["CS101", "SE201", "CS102"];

const MOCK_AUDIT_LOG = [
  { id: "a1", studentId: "STU-10002", module: "CS101", reason: "Medical excuse approved. Doc on file.", at: "2026-03-05 14:00", by: "Dr. Sokolova" },
  { id: "a2", studentId: "STU-10005", module: "SE201", reason: "Exceptional circumstances. Dean approval.", at: "2026-03-04 10:30", by: "Prof. Petrov" },
];

export default function EligibilityOverridesPage() {
  const router = useRouter();
  const [studentId, setStudentId] = React.useState("");
  const [module, setModule] = React.useState("");
  const [reason, setReason] = React.useState("");

  const canSubmit = studentId && module && reason.trim().length >= 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    const s = MOCK_STUDENTS.find((x) => x.id === studentId);
    alert(`Override recorded (Demo): Grant exam access for ${s?.name} (${s?.studentId}), module ${module}. Reason: ${reason}. Audit trail updated.`);
    router.push("/academic/exam-eligibility/students");
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/academic/exam-eligibility" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Exam eligibility
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Eligibility overrides</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Manually grant exam access (e.g. medical excuse). All overrides are recorded for audit.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-purple-900">Grant override</h2>
          <p className="mt-0.5 text-xs text-slate-600">Select student and module. Reason is required.</p>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-800">Student</label>
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
              >
                <option value="">— Select —</option>
                {MOCK_STUDENTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.studentId}) · {s.group}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-800">Module / exam</label>
              <select
                value={module}
                onChange={(e) => setModule(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
              >
                <option value="">— Select —</option>
                {MOCK_MODULES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-800">
                Reason <span className="text-rose-600">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                minLength={10}
                rows={3}
                placeholder="e.g. Medical excuse. Documentation on file. Approved by department."
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
              />
              <p className="mt-0.5 text-xs text-slate-500">Minimum 10 characters. Stored in audit trail.</p>
            </div>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 focus-visible:ring-purple-500"
              disabled={!canSubmit}
            >
              Grant exam access
            </Button>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-purple-900">Audit trail</h2>
          <p className="mt-0.5 text-xs text-slate-600">Recent overrides (who, when, reason).</p>
          <ul className="mt-4 space-y-3">
            {MOCK_AUDIT_LOG.map((a) => (
              <li key={a.id} className="rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm">
                <p className="font-medium text-slate-900">{a.studentId} · {a.module}</p>
                <p className="mt-0.5 text-slate-700">{a.reason}</p>
                <p className="mt-1 text-xs text-slate-500">{a.at} by {a.by}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
