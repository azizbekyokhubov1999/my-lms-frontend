"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import * as React from "react";

import { Card } from "../../../components/ui/Card";

const MOCK_GROUPS: Record<string, { name: string; program: string; cohortYear: number; status: string }> = {
  g1: { name: "SD-24-01", program: "BSc Software Development", cohortYear: 2024, status: "active" },
  g2: { name: "SD-24-02", program: "BSc Software Development", cohortYear: 2024, status: "active" },
  g3: { name: "CS-23-01", program: "BSc Computer Science", cohortYear: 2023, status: "active" },
  g4: { name: "SD-20-01", program: "BSc Software Development", cohortYear: 2020, status: "graduated" },
  g5: { name: "MBA-24-A", program: "MBA Business Administration", cohortYear: 2024, status: "active" },
};

interface StudentRow {
  id: string;
  name: string;
  studentId: string;
  gpa: number;
  attendanceAvg: number;
}

const MOCK_STUDENTS: Record<string, StudentRow[]> = {
  g1: [
    { id: "s1", name: "Anna Petrova", studentId: "STU-10001", gpa: 3.4, attendanceAvg: 92 },
    { id: "s2", name: "Ivan Kozlov", studentId: "STU-10002", gpa: 3.1, attendanceAvg: 88 },
    { id: "s3", name: "Maria Sokolova", studentId: "STU-10003", gpa: 3.8, attendanceAvg: 96 },
    { id: "s4", name: "Dmitri Volkov", studentId: "STU-10004", gpa: 2.9, attendanceAvg: 78 },
  ],
  g2: [
    { id: "s5", name: "Elena Novikova", studentId: "STU-10005", gpa: 3.5, attendanceAvg: 94 },
  ],
  g3: [],
  g4: [],
  g5: [],
};

export default function GroupDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const group = id ? MOCK_GROUPS[id] : null;
  const students = (id && MOCK_STUDENTS[id]) ?? [];

  if (!group) {
    return (
      <div className="space-y-6">
        <Link href="/academic/groups" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Groups
        </Link>
        <p className="text-slate-600">Group not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/academic/groups" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Groups
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">{group.name}</h1>
          <p className="mt-0.5 text-sm text-slate-600">
            {group.program} · Cohort {group.cohortYear}
          </p>
        </div>
        <Link
          href="/academic/groups/bulk-assign"
          className="inline-flex h-10 items-center justify-center rounded-md bg-purple-600 px-4 text-sm font-medium text-white transition-colors hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
        >
          Bulk Assign to this group
        </Link>
      </div>

      <Card className="p-0">
        <div className="border-b border-purple-200 bg-purple-100 px-4 py-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-purple-900">Students in this group</h2>
          <p className="mt-0.5 text-xs text-purple-800/80">Current GPA and attendance average per student.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Student</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Student ID</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">GPA</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Attendance avg.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                    No students in this group. Use Bulk Assign to add students.
                  </td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr key={s.id} className="hover:bg-purple-50/50">
                    <td className="px-4 py-3 font-medium text-slate-900">{s.name}</td>
                    <td className="px-4 py-3 font-mono text-slate-700">{s.studentId}</td>
                    <td className="px-4 py-3 text-right font-medium text-slate-900">{s.gpa.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-slate-700">{s.attendanceAvg}%</td>
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
