"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type EligibilityStatus = "eligible" | "not_eligible" | "pending";

interface StudentEligibility {
  id: string;
  name: string;
  studentId: string;
  group: string;
  module: string;
  attendance: number;
  hasDebt: boolean;
  status: EligibilityStatus;
}

const MOCK_STUDENTS: StudentEligibility[] = [
  { id: "e1", name: "Anna Petrova", studentId: "STU-10001", group: "SD-24-01", module: "CS101", attendance: 92, hasDebt: false, status: "eligible" },
  { id: "e2", name: "Ivan Kozlov", studentId: "STU-10002", group: "SD-24-01", module: "CS101", attendance: 76, hasDebt: true, status: "not_eligible" },
  { id: "e3", name: "Maria Sokolova", studentId: "STU-10003", group: "SD-24-01", module: "CS101", attendance: 88, hasDebt: false, status: "eligible" },
  { id: "e4", name: "Dmitri Volkov", studentId: "STU-10004", group: "SD-24-01", module: "CS101", attendance: 0, hasDebt: false, status: "pending" },
  { id: "e5", name: "Elena Novikova", studentId: "STU-10005", group: "SD-24-02", module: "SE201", attendance: 65, hasDebt: false, status: "not_eligible" },
];

const STATUS_STYLES: Record<EligibilityStatus, string> = {
  eligible: "bg-emerald-100 text-emerald-800",
  not_eligible: "bg-rose-100 text-rose-800",
  pending: "bg-slate-100 text-slate-600",
};

const STATUS_LABELS: Record<EligibilityStatus, string> = {
  eligible: "Eligible",
  not_eligible: "Not eligible",
  pending: "Pending",
};

export default function StudentEligibilityPage() {
  const [search, setSearch] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState<EligibilityStatus | "">("");

  const filtered = React.useMemo(() => {
    let list = MOCK_STUDENTS;
    if (filterStatus) list = list.filter((s) => s.status === filterStatus);
    const q = search.trim().toLowerCase();
    if (q) list = list.filter((s) => s.name.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q) || s.group.toLowerCase().includes(q));
    return list;
  }, [search, filterStatus]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/academic/exam-eligibility" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Exam eligibility
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Student eligibility</h1>
          <p className="mt-0.5 text-sm text-slate-600">
            Current status: Eligible (green), Not eligible (red), or Pending (gray).
          </p>
        </div>
      </div>

      <Card className="p-4">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Input
            type="search"
            placeholder="Search by name, ID, or group..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs focus-visible:ring-purple-500 focus-visible:border-purple-500"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as EligibilityStatus | "")}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
          >
            <option value="">All statuses</option>
            <option value="eligible">Eligible</option>
            <option value="not_eligible">Not eligible</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-purple-200 bg-purple-100">
                <th className="px-4 py-3 text-left font-medium text-purple-900">Student</th>
                <th className="px-4 py-3 text-left font-medium text-purple-900">Group</th>
                <th className="px-4 py-3 text-left font-medium text-purple-900">Module</th>
                <th className="px-4 py-3 text-right font-medium text-purple-900">Attendance</th>
                <th className="px-4 py-3 text-left font-medium text-purple-900">Debt</th>
                <th className="px-4 py-3 text-left font-medium text-purple-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No students match.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-purple-50/50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{s.name}</p>
                      <p className="text-xs font-mono text-slate-500">{s.studentId}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{s.group}</td>
                    <td className="px-4 py-3 text-slate-700">{s.module}</td>
                    <td className="px-4 py-3 text-right text-slate-700">{s.attendance > 0 ? `${s.attendance}%` : "—"}</td>
                    <td className="px-4 py-3">{s.hasDebt ? <span className="text-rose-600 font-medium">Yes</span> : <span className="text-slate-500">No</span>}</td>
                    <td className="px-4 py-3">
                      <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_STYLES[s.status])}>
                        {STATUS_LABELS[s.status]}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
