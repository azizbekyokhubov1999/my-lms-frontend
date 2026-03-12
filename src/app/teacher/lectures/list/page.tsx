"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type RecordingStatus = "Available" | "Processing" | "Not recorded" | "Scheduled";

interface LectureRow {
  id: string;
  subject: string;
  course: string;
  title: string;
  date: string;
  time: string;
  teamsLink: string;
  recordingStatus: RecordingStatus;
  recordingUrl?: string;
  attendanceCount: number;
  totalEnrolled?: number;
}

const LECTURES: LectureRow[] = [
  { id: "l1", subject: "CS 440", course: "CS 440 - Machine Learning", title: "ML Intro", date: "Mar 3, 2026", time: "10:00 AM", teamsLink: "#", recordingStatus: "Available", recordingUrl: "#", attendanceCount: 39, totalEnrolled: 42 },
  { id: "l2", subject: "CS 210", course: "CS 210 - Data Structures", title: "Trees Basics", date: "Mar 3, 2026", time: "2:00 PM", teamsLink: "#", recordingStatus: "Available", recordingUrl: "#", attendanceCount: 25, totalEnrolled: 28 },
  { id: "l3", subject: "RES 301", course: "RES 301 - Research Methods", title: "Methodology", date: "Mar 4, 2026", time: "11:00 AM", teamsLink: "#", recordingStatus: "Processing", attendanceCount: 16, totalEnrolled: 18 },
  { id: "l4", subject: "CS 440", course: "CS 440 - Machine Learning", title: "Regression", date: "Mar 5, 2026", time: "10:00 AM", teamsLink: "#", recordingStatus: "Available", recordingUrl: "#", attendanceCount: 38, totalEnrolled: 42 },
  { id: "l5", subject: "CS 210", course: "CS 210 - Data Structures", title: "Graph Intro", date: "Mar 5, 2026", time: "2:00 PM", teamsLink: "#", recordingStatus: "Available", recordingUrl: "#", attendanceCount: 24, totalEnrolled: 28 },
  { id: "l6", subject: "RES 301", course: "RES 301 - Research Methods", title: "Qualitative Methods", date: "Mar 11, 2026", time: "11:00 AM", teamsLink: "#", recordingStatus: "Scheduled", attendanceCount: 0, totalEnrolled: 18 },
  { id: "l7", subject: "CS 440", course: "CS 440 - Machine Learning", title: "ML Core", date: "Mar 12, 2026", time: "10:00 AM", teamsLink: "#", recordingStatus: "Scheduled", attendanceCount: 0, totalEnrolled: 42 },
];

function statusStyles(s: RecordingStatus): string {
  switch (s) {
    case "Available": return "bg-emerald-100 text-emerald-800";
    case "Processing": return "bg-amber-100 text-amber-800";
    case "Not recorded": return "bg-slate-100 text-slate-600";
    case "Scheduled": return "bg-sky-100 text-sky-800";
    default: return "bg-slate-100 text-slate-600";
  }
}

export default function LecturesListPage() {
  return (
    <div className="space-y-6">
      <section>
        <Link href="/teacher/lectures" className="text-xs font-medium text-teal-600 hover:underline">
          ← Live Lectures
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
          Lecture List
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          All lectures with Teams links, recording status, and attendance.
        </p>
      </section>

      <Card className="overflow-hidden rounded-lg border-slate-200 p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Subject</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Teams Link</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Recording</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Attendance</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {LECTURES.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{row.subject}</p>
                    <p className="text-xs text-slate-500">{row.title}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {row.date}
                    <span className="block text-xs text-slate-500">{row.time}</span>
                  </td>
                  <td className="px-4 py-3">
                    <a href={row.teamsLink} className="text-teal-600 hover:underline">
                      Join
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex rounded px-2 py-0.5 text-xs font-semibold", statusStyles(row.recordingStatus))}>
                      {row.recordingStatus}
                    </span>
                    {row.recordingUrl && (
                      <a href={row.recordingUrl} className="ml-1 text-xs text-teal-600 hover:underline">
                        Watch
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-slate-900">{row.attendanceCount}</span>
                    {row.totalEnrolled != null && row.totalEnrolled > 0 && (
                      <span className="text-slate-500"> / {row.totalEnrolled}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/teacher/lectures/list/${row.id}`}>
                      <Button type="button" variant="secondary" size="sm">
                        Details
                      </Button>
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
