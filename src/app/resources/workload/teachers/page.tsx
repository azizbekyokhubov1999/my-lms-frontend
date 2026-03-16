"use client";

import * as React from "react";

import { Card } from "../../../components/ui/Card";

interface TeacherWorkloadRow {
  id: string;
  name: string;
  faculty: string;
  lectureHours: number;
  seminarHours: number;
  students: number;
  qaCount: number;
}

const MOCK_TEACHER_WORKLOAD: TeacherWorkloadRow[] = [
  {
    id: "t1",
    name: "Dr. Nina Kozlova",
    faculty: "Engineering",
    lectureHours: 10,
    seminarHours: 12,
    students: 220,
    qaCount: 48,
  },
  {
    id: "t2",
    name: "Prof. Timur Akhmetov",
    faculty: "Business",
    lectureHours: 8,
    seminarHours: 9,
    students: 180,
    qaCount: 37,
  },
  {
    id: "t3",
    name: "Dr. Aigerim Sadykova",
    faculty: "Law",
    lectureHours: 6,
    seminarHours: 6,
    students: 110,
    qaCount: 22,
  },
];

export default function TeacherWorkloadPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Teacher workload detail
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Weekly breakdown of lecture / seminar hours, assigned students, and Q&amp;A activity.
        </p>
      </div>

      <Card>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">
                  Teacher
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">
                  Faculty
                </th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">
                  Lecture (h)
                </th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">
                  Seminar (h)
                </th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">
                  Total (h)
                </th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">
                  Students
                </th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">
                  Q&amp;A
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_TEACHER_WORKLOAD.map((t) => {
                const total = t.lectureHours + t.seminarHours;
                const overloaded = total > 20;
                const barColor = overloaded ? "bg-rose-500" : "bg-teal-600";
                const pct = Math.min((total / 24) * 100, 100);
                return (
                  <tr key={t.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {t.name}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{t.faculty}</td>
                    <td className="px-4 py-3 text-right text-slate-700">
                      {t.lectureHours.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-700">
                      {t.seminarHours.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-700">
                      <div className="flex items-center justify-end gap-2">
                        <span>{total.toFixed(1)}</span>
                        <div className="h-2 w-24 rounded-full bg-slate-200">
                          <div
                            className={`h-2 rounded-full ${barColor}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-700">
                      {t.students}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-700">
                      {t.qaCount}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

