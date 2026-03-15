"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface AttendanceRow {
  id: string;
  group: string;
  faculty: string;
  module: string;
  attendancePct: number;
  students: number;
}

const MOCK_ATTENDANCE: AttendanceRow[] = [
  { id: "a1", group: "SD-24-01", faculty: "Engineering", module: "CS101", attendancePct: 88, students: 28 },
  { id: "a2", group: "SD-24-02", faculty: "Engineering", module: "CS101", attendancePct: 65, students: 25 },
  { id: "a3", group: "CS-23-01", faculty: "Engineering", module: "SE201", attendancePct: 92, students: 30 },
  { id: "a4", group: "MBA-24-A", faculty: "Business", module: "Strategy", attendancePct: 58, students: 18 },
  { id: "a5", group: "LLB-23-01", faculty: "Law", module: "Contract Law", attendancePct: 74, students: 22 },
  { id: "a6", group: "SD-24-01", faculty: "Engineering", module: "SE201", attendancePct: 82, students: 28 },
];

const THRESHOLD = 70;

export default function AttendanceReportPage() {
  const [faculty, setFaculty] = React.useState("");
  const [group, setGroup] = React.useState("");
  const [module, setModule] = React.useState("");

  const filtered = React.useMemo(() => {
    let list = MOCK_ATTENDANCE;
    if (faculty) list = list.filter((r) => r.faculty === faculty);
    if (group) list = list.filter((r) => r.group.toLowerCase().includes(group.trim().toLowerCase()));
    if (module) list = list.filter((r) => r.module.toLowerCase().includes(module.trim().toLowerCase()));
    return list;
  }, [faculty, group, module]);

  const faculties = React.useMemo(() => [...new Set(MOCK_ATTENDANCE.map((r) => r.faculty))], []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/academic/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Dashboard
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Attendance reports</h1>
          <p className="mt-0.5 text-sm text-slate-600">
            Filter by group, faculty, and module. Groups below 70% are highlighted.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/academic/performance/grades"
            className="inline-flex h-10 items-center justify-center rounded-md border border-purple-600 px-4 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-50"
          >
            Grade analytics
          </Link>
          <Link
            href="/academic/performance/at-risk"
            className="inline-flex h-10 items-center justify-center rounded-md border border-rose-600 px-4 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-50"
          >
            At-risk students
          </Link>
          <Link
            href="/academic/performance/standing"
            className="inline-flex h-10 items-center justify-center rounded-md bg-purple-600 px-4 text-sm font-medium text-white transition-colors hover:bg-purple-700"
          >
            Academic standing
          </Link>
        </div>
      </div>

      <Card className="p-4">
        <div className="mb-4 flex flex-wrap gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-500">Faculty</label>
            <select
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
              className="mt-0.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
            >
              <option value="">All</option>
              {faculties.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500">Group</label>
            <input
              type="text"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              placeholder="Filter by group"
              className="mt-0.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500">Module</label>
            <input
              type="text"
              value={module}
              onChange={(e) => setModule(e.target.value)}
              placeholder="Filter by module"
              className="mt-0.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
            />
          </div>
        </div>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-purple-200 bg-purple-100">
                <th className="px-4 py-3 text-left font-medium text-purple-900">Group</th>
                <th className="px-4 py-3 text-left font-medium text-purple-900">Faculty</th>
                <th className="px-4 py-3 text-left font-medium text-purple-900">Module</th>
                <th className="px-4 py-3 text-right font-medium text-purple-900">Students</th>
                <th className="px-4 py-3 text-right font-medium text-purple-900">Attendance %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  className={cn(
                    "hover:bg-purple-50/50",
                    r.attendancePct < THRESHOLD && "bg-amber-50",
                  )}
                >
                  <td className="px-4 py-3 font-medium text-slate-900">{r.group}</td>
                  <td className="px-4 py-3 text-slate-700">{r.faculty}</td>
                  <td className="px-4 py-3 text-slate-700">{r.module}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{r.students}</td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={cn(
                        "font-semibold",
                        r.attendancePct < THRESHOLD ? "text-amber-600" : "text-slate-900",
                      )}
                    >
                      {r.attendancePct}%
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
