"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface CollectionCase {
  id: string;
  studentName: string;
  studentId: string;
  remainingDebt: number;
  promiseToPayDate: string | null;
  lastReminder: string | null;
  reminderType: "Email" | "SMS" | null;
}

const MOCK_CASES: CollectionCase[] = [
  { id: "STU-10001", studentName: "Anna Petrova", studentId: "STU-10001", remainingDebt: 315000, promiseToPayDate: "2026-03-15", lastReminder: "2026-03-01", reminderType: "SMS" },
  { id: "STU-10002", studentName: "Ivan Kozlov", studentId: "STU-10002", remainingDebt: 285000, promiseToPayDate: "2026-03-20", lastReminder: "2026-03-03", reminderType: "Email" },
  { id: "STU-10005", studentName: "Elena Novikova", studentId: "STU-10005", remainingDebt: 312000, promiseToPayDate: null, lastReminder: null, reminderType: null },
];

export default function DebtCollectionPage() {
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [reminderChannel, setReminderChannel] = React.useState<"Email" | "SMS">("Email");
  const [promiseDate, setPromiseDate] = React.useState("");
  const [promiseStudent, setPromiseStudent] = React.useState("");

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSendReminders = () => {
    alert(`Sending ${reminderChannel} reminders to ${selectedIds.size} student(s) (Demo).`);
    setSelectedIds(new Set());
  };

  const handleSetPromise = () => {
    if (!promiseStudent || !promiseDate) return;
    alert(`Promise to Pay set for ${promiseStudent} on ${promiseDate} (Demo).`);
    setPromiseStudent("");
    setPromiseDate("");
  };

  const formatAmount = (n: number) => `${n.toLocaleString()} ₸`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/finance/debts" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Debt Management
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Debt Collection Hub</h1>
          <p className="mt-1 text-sm text-slate-600">
            Send payment reminders and track Promise to Pay dates.
          </p>
        </div>
        <Link
          href="/finance/debts/collection/promises"
          className="inline-flex h-10 items-center justify-center rounded-md border border-emerald-600 px-4 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
        >
          View Promises List
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Send Reminders */}
        <Card className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Send Reminders</h2>
          <p className="mt-1 text-xs text-slate-600">Select students and send automated Email or SMS reminders.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="channel"
                checked={reminderChannel === "Email"}
                onChange={() => setReminderChannel("Email")}
                className="border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-slate-700">Email</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="channel"
                checked={reminderChannel === "SMS"}
                onChange={() => setReminderChannel("SMS")}
                className="border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-slate-700">SMS</span>
            </label>
          </div>
          <Button
            type="button"
            className="mt-4 bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500"
            onClick={handleSendReminders}
            disabled={selectedIds.size === 0}
          >
            Send {reminderChannel} Reminders ({selectedIds.size} selected)
          </Button>
        </Card>

        {/* Promise to Pay */}
        <Card className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Promise to Pay</h2>
          <p className="mt-1 text-xs text-slate-600">Record when a student commits to a payment date.</p>
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700">Student</label>
              <select
                value={promiseStudent}
                onChange={(e) => setPromiseStudent(e.target.value)}
                className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">— Select —</option>
                {MOCK_CASES.map((c) => (
                  <option key={c.id} value={c.id}>{c.studentName} ({c.studentId})</option>
                ))}
              </select>
            </div>
            <Input
              label="Promise to Pay Date"
              type="date"
              value={promiseDate}
              onChange={(e) => setPromiseDate(e.target.value)}
            />
            <Button
              type="button"
              className="bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500"
              onClick={handleSetPromise}
              disabled={!promiseStudent || !promiseDate}
            >
              Record Promise
            </Button>
          </div>
        </Card>
      </div>

      {/* Cases table with Promise to Pay tracking */}
      <Card className="overflow-hidden p-0">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Collection Cases</h2>
          <p className="mt-0.5 text-xs text-slate-600">Select rows to send reminders. Overdue amounts in rose.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="w-10 px-4 py-2.5 text-left">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === MOCK_CASES.length}
                    onChange={(e) =>
                      setSelectedIds(e.target.checked ? new Set(MOCK_CASES.map((c) => c.id)) : new Set())
                    }
                    aria-label="Select all"
                  />
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Student</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Remaining Debt</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Promise to Pay</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Last Reminder</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_CASES.map((c) => (
                <tr key={c.id} className="hover:bg-emerald-50/70">
                  <td className="px-4 py-2.5">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(c.id)}
                      onChange={() => toggleSelect(c.id)}
                      aria-label={`Select ${c.studentName}`}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{c.studentName}</p>
                    <p className="text-xs text-slate-500">{c.studentId}</p>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-rose-600">{formatAmount(c.remainingDebt)}</td>
                  <td className="px-4 py-3">
                    {c.promiseToPayDate ? (
                      <span className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        new Date(c.promiseToPayDate) < new Date()
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      )}>
                        {c.promiseToPayDate}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {c.lastReminder ? (
                      <span>{c.lastReminder} ({c.reminderType})</span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/finance/debts/${c.id}`}
                      className="text-sm font-medium text-emerald-700 hover:underline"
                    >
                      View
                    </Link>
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
