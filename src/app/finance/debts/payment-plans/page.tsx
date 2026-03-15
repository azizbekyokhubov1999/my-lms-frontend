"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";

const MOCK_STUDENTS_WITH_DEBT = [
  { id: "STU-10001", name: "Anna Petrova", remainingDebt: 315000, currentDeadline: "2026-03-15" },
  { id: "STU-10002", name: "Ivan Kozlov", remainingDebt: 285000, currentDeadline: "2026-03-20" },
  { id: "STU-10005", name: "Elena Novikova", remainingDebt: 312000, currentDeadline: "2026-03-08" },
];

export default function PaymentPlansPage() {
  const [selectedStudent, setSelectedStudent] = React.useState<string>("");
  const [newDeadline, setNewDeadline] = React.useState("");
  const [installmentsCount, setInstallmentsCount] = React.useState("");
  const [notes, setNotes] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Payment plan created (Demo): Extended deadline for ${selectedStudent || "student"} to ${newDeadline}.`);
  };

  const formatAmount = (n: number) => `${n.toLocaleString()} ₸`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/finance/debts" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Debt Management
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Payment Plans</h1>
          <p className="mt-1 text-sm text-slate-600">
            Create custom installment plans for students in financial difficulty. Extend deadlines and split payments.
          </p>
        </div>
        <Link
          href="/finance/debts/payment-plans/history"
          className="inline-flex h-10 items-center justify-center rounded-md border border-emerald-600 px-4 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
        >
          Plan History
        </Link>
      </div>

      <Card className="max-w-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-800">Select Student</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            >
              <option value="">— Select student —</option>
              {MOCK_STUDENTS_WITH_DEBT.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.id}) · {formatAmount(s.remainingDebt)} due
                </option>
              ))}
            </select>
          </div>

          {selectedStudent && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="New Deadline (Extended)"
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  helperText="When should the revised final payment be due?"
                />
                <Input
                  label="Number of Installments"
                  type="number"
                  placeholder="e.g. 6"
                  value={installmentsCount}
                  onChange={(e) => setInstallmentsCount(e.target.value)}
                  helperText="Split remaining debt into N payments."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-800">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Reason for extension, agreed terms..."
                  className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </>
          )}

          <div className="flex gap-3 pt-2">
            <Link href="/finance/debts">
              <Button type="button" variant="secondary">Cancel</Button>
            </Link>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500"
              disabled={!selectedStudent || !newDeadline}
            >
              Create Payment Plan
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
