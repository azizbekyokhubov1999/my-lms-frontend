"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface HistoryEntry {
  id: string;
  studentName: string;
  studentId: string;
  action: "Blocked" | "Released";
  date: string;
  reason?: string;
}

const MOCK_HISTORY: HistoryEntry[] = [
  { id: "h1", studentName: "Anna Petrova", studentId: "STU-10001", action: "Blocked", date: "2026-02-25", reason: "Overdue debt" },
  { id: "h2", studentName: "Ivan Kozlov", studentId: "STU-10002", action: "Blocked", date: "2026-03-01", reason: "Overdue debt" },
  { id: "h3", studentName: "Dmitri Volkov", studentId: "STU-10004", action: "Released", date: "2026-02-28", reason: "Payment received" },
  { id: "h4", studentName: "Elena Novikova", studentId: "STU-10005", action: "Blocked", date: "2026-03-03", reason: "Overdue debt" },
  { id: "h5", studentName: "Alexey Popov", studentId: "STU-10006", action: "Released", date: "2026-02-15", reason: "Payment plan approved" },
];

export default function BlockingHistoryPage() {
  const [search, setSearch] = React.useState("");
  const [actionFilter, setActionFilter] = React.useState<string>("");

  const filtered = React.useMemo(() => {
    return MOCK_HISTORY.filter((e) => {
      if (actionFilter && e.action !== actionFilter) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        if (!e.studentName.toLowerCase().includes(q) && !e.studentId.toLowerCase().includes(q))
          return false;
      }
      return true;
    });
  }, [search, actionFilter]);

  const sorted = React.useMemo(() => {
    return [...filtered].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [filtered]);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/finance/blocking" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Blocking System
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Blocking History</h1>
        <p className="mt-1 text-sm text-slate-600">
          Audit log of when students were blocked and released.
        </p>
      </div>

      <Card className="p-4">
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <Input
            type="search"
            placeholder="Search by student name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-300 focus:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value="">Action: All</option>
            <option value="Blocked">Blocked</option>
            <option value="Released">Released</option>
          </select>
        </div>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Date</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Student</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Action</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.map((e) => (
                <tr key={e.id} className="hover:bg-emerald-50/70">
                  <td className="px-4 py-3 text-slate-600">{e.date}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{e.studentName}</p>
                    <p className="text-xs text-slate-500">{e.studentId}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        e.action === "Blocked" && "bg-red-100 text-red-700",
                        e.action === "Released" && "bg-green-100 text-green-700",
                      )}
                    >
                      {e.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{e.reason ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sorted.length === 0 && (
          <p className="py-8 text-center text-slate-500">No history entries match the filters.</p>
        )}
      </Card>
    </div>
  );
}
