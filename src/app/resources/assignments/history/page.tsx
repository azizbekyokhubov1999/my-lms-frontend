"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../../components/ui/Card";

type AssignmentStatus = "Active" | "Completed";

interface HistoryRow {
  id: string;
  teacherName: string;
  course: string;
  group: string;
  academicYear: string;
  semester: string;
  status: AssignmentStatus;
}

const MOCK_HISTORY: HistoryRow[] = [
  {
    id: "h1",
    teacherName: "Dr. Nina Kozlova",
    course: "CS101 – Introduction to Programming",
    group: "ENG-1A",
    academicYear: "2023–2024",
    semester: "Fall",
    status: "Completed",
  },
  {
    id: "h2",
    teacherName: "Dr. Nina Kozlova",
    course: "SE301 – Software Architecture",
    group: "ENG-3A",
    academicYear: "2024–2025",
    semester: "Spring",
    status: "Completed",
  },
  {
    id: "h3",
    teacherName: "Prof. Timur Akhmetov",
    course: "FIN201 – Corporate Finance",
    group: "BUS-2A",
    academicYear: "2022–2023",
    semester: "Fall",
    status: "Completed",
  },
];

const STATUS_STYLES: Record<AssignmentStatus, string> = {
  Active: "bg-emerald-100 text-emerald-800",
  Completed: "bg-slate-100 text-slate-700",
};

export default function AssignmentHistoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/resources/assignments"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Assignments
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">
            Assignment history
          </h1>
          <p className="mt-0.5 text-sm text-slate-600">
            Archive of past teaching assignments used to track teacher experience over years.
          </p>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[780px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Teacher</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Course</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Student group</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Academic year</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Semester</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_HISTORY.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">
                    No historical assignments available.
                  </td>
                </tr>
              ) : (
                MOCK_HISTORY.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {h.teacherName}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{h.course}</td>
                    <td className="px-4 py-3 text-slate-700">{h.group}</td>
                    <td className="px-4 py-3 text-slate-700">{h.academicYear}</td>
                    <td className="px-4 py-3 text-slate-700">{h.semester}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          "rounded-full px-2.5 py-0.5 text-xs font-semibold " +
                          STATUS_STYLES[h.status]
                        }
                      >
                        {h.status}
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

