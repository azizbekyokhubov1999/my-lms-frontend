"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { Suspense } from "react";

import { Card } from "../../../components/ui/Card";

const MOCK_DAY_CLASSES = [
  { id: "c1", time: "09:00–10:30", group: "SD-24-01", course: "CS101 Intro to Python", room: "A101", teacher: "Dr. Sokolova" },
  { id: "c2", time: "10:45–12:15", group: "SD-24-01", course: "SE201 Software Design", room: "B202", teacher: "Prof. Petrov" },
  { id: "c3", time: "14:00–15:30", group: "SD-24-02", course: "CS102 Data Structures", room: "A102", teacher: "Dr. Sokolova" },
];

function ScheduleDetailContent() {
  const searchParams = useSearchParams();
  const date = searchParams.get("date") ?? "Fri 6 Mar";
  const slot = searchParams.get("slot") ?? "09:00";

  return (
    <div className="space-y-6">
      <div>
        <Link href="/academic/schedules" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Schedules
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Schedule detail</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          {date} — classes for the day. Filter by group or room from the main schedule.
        </p>
      </div>

      <Card className="p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Classes on {date}</h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-purple-200 bg-purple-100">
                <th className="px-4 py-3 text-left font-medium text-purple-900">Time</th>
                <th className="px-4 py-3 text-left font-medium text-purple-900">Group</th>
                <th className="px-4 py-3 text-left font-medium text-purple-900">Course</th>
                <th className="px-4 py-3 text-left font-medium text-purple-900">Room</th>
                <th className="px-4 py-3 text-left font-medium text-purple-900">Teacher</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_DAY_CLASSES.map((c) => (
                <tr key={c.id} className="hover:bg-purple-50/50">
                  <td className="px-4 py-3 font-mono text-slate-700">{c.time}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{c.group}</td>
                  <td className="px-4 py-3 text-slate-700">{c.course}</td>
                  <td className="px-4 py-3 text-slate-700">{c.room}</td>
                  <td className="px-4 py-3 text-slate-700">{c.teacher}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default function ScheduleDetailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ScheduleDetailContent />
    </Suspense>
  );
}
