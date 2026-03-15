"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";

const MOCK_STUDENTS = [
  { id: "s1", name: "Anna Petrova", studentId: "STU-10001" },
  { id: "s2", name: "Ivan Kozlov", studentId: "STU-10002" },
  { id: "s3", name: "Maria Sokolova", studentId: "STU-10003" },
  { id: "s4", name: "Dmitri Volkov", studentId: "STU-10004" },
  { id: "s5", name: "Elena Novikova", studentId: "STU-10005" },
];

const EXCEPTION_TYPES = [
  { value: "debt", label: "Debt" },
  { value: "attendance", label: "Attendance" },
  { value: "prerequisite", label: "Prerequisite" },
];

export default function CreateExceptionPage() {
  const router = useRouter();
  const [studentId, setStudentId] = React.useState("");
  const [type, setType] = React.useState("");
  const [validUntil, setValidUntil] = React.useState("");
  const [reason, setReason] = React.useState("");

  const canSubmit = studentId && type && validUntil && reason.trim().length >= 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    const s = MOCK_STUDENTS.find((x) => x.id === studentId);
    const typeLabel = EXCEPTION_TYPES.find((t) => t.value === type)?.label ?? type;
    alert(`Exception created (Demo): ${s?.name} — ${typeLabel}. Valid until ${validUntil}. Reason: ${reason}. Audit trail recorded (granted by current user).`);
    router.push("/academic/exceptions");
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/academic/exceptions" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Exceptions
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Create exception</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Grant a waiver. Duration and mandatory reason are recorded for audit (who granted, why).
        </p>
      </div>

      <Card className="max-w-2xl border-violet-200 bg-violet-50/30 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-800">Student</label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
            >
              <option value="">— Select student —</option>
              {MOCK_STUDENTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.studentId})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800">Exception type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
            >
              <option value="">— Select type —</option>
              {EXCEPTION_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <Input
            label="Valid until (duration)"
            type="date"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
            required
            helperText="e.g. valid until next week or end of term"
            className="focus-visible:ring-violet-500 focus-visible:border-violet-500"
          />
          <div>
            <label className="block text-sm font-medium text-slate-800">
              Reason <span className="text-rose-600">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              minLength={10}
              rows={4}
              placeholder="Mandatory. Explain why this exception is granted. Stored in audit trail (who granted, why)."
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
            />
            <p className="mt-0.5 text-xs text-slate-500">Minimum 10 characters. Recorded with your identity for audit.</p>
          </div>
          <div className="flex gap-3 pt-2">
            <Link href="/academic/exceptions">
              <Button type="button" variant="secondary">Cancel</Button>
            </Link>
            <Button
              type="submit"
              className="bg-violet-600 hover:bg-violet-700 focus-visible:ring-violet-500"
              disabled={!canSubmit}
            >
              Grant exception
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
