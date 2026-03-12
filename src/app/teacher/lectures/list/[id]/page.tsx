"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import * as React from "react";

import { Card } from "../../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface AttendanceRecord {
  studentId: string;
  studentName: string;
  joinedAt: string;
  leftAt: string;
  durationMinutes: number;
  status: "full" | "partial" | "late";
}

interface QaEntry {
  id: string;
  time: string;
  studentName: string;
  question: string;
  answer?: string;
}

interface Material {
  id: string;
  title: string;
  type: string;
  url: string;
}

const LECTURE_DETAILS: Record<string, {
  subject: string;
  course: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  teamsLink: string;
  recordingUrl: string | null;
  attendanceCount: number;
  totalEnrolled: number;
}> = {
  l1: { subject: "CS 440", course: "CS 440 - Machine Learning", title: "ML Intro", date: "Mar 3, 2026", time: "10:00 AM", duration: "60 min", teamsLink: "#", recordingUrl: "#", attendanceCount: 39, totalEnrolled: 42 },
  l2: { subject: "CS 210", course: "CS 210 - Data Structures", title: "Trees Basics", date: "Mar 3, 2026", time: "2:00 PM", duration: "75 min", teamsLink: "#", recordingUrl: "#", attendanceCount: 25, totalEnrolled: 28 },
  l3: { subject: "RES 301", course: "RES 301 - Research Methods", title: "Methodology", date: "Mar 4, 2026", time: "11:00 AM", duration: "60 min", teamsLink: "#", recordingUrl: null, attendanceCount: 16, totalEnrolled: 18 },
  l4: { subject: "CS 440", course: "CS 440 - Machine Learning", title: "Regression", date: "Mar 5, 2026", time: "10:00 AM", duration: "60 min", teamsLink: "#", recordingUrl: "#", attendanceCount: 38, totalEnrolled: 42 },
  l5: { subject: "CS 210", course: "CS 210 - Data Structures", title: "Graph Intro", date: "Mar 5, 2026", time: "2:00 PM", duration: "75 min", teamsLink: "#", recordingUrl: "#", attendanceCount: 24, totalEnrolled: 28 },
};

const ATTENDANCE: Record<string, AttendanceRecord[]> = {
  l1: [
    { studentId: "st1", studentName: "Alex Johnson", joinedAt: "10:02", leftAt: "10:58", durationMinutes: 56, status: "full" },
    { studentId: "st2", studentName: "Jordan Lee", joinedAt: "10:15", leftAt: "10:58", durationMinutes: 43, status: "late" },
    { studentId: "st6", studentName: "Casey Brown", joinedAt: "10:00", leftAt: "10:45", durationMinutes: 45, status: "partial" },
  ],
  l2: [
    { studentId: "st3", studentName: "Sam Chen", joinedAt: "2:00", leftAt: "3:12", durationMinutes: 72, status: "full" },
    { studentId: "st8", studentName: "Jamie Park", joinedAt: "2:10", leftAt: "3:15", durationMinutes: 65, status: "late" },
  ],
  l3: [],
  l4: [],
  l5: [],
};

const QA_TRANSCRIPTS: Record<string, QaEntry[]> = {
  l1: [
    { id: "qa1", time: "10:22", studentName: "Alex Johnson", question: "How does gradient descent differ from stochastic gradient descent?" },
    { id: "qa2", time: "10:45", studentName: "Jordan Lee", question: "Can we use cross-validation for model selection?", answer: "Yes, k-fold cross-validation is commonly used to select models and hyperparameters." },
    { id: "qa3", time: "10:52", studentName: "Casey Brown", question: "What's the difference between L1 and L2 regularization?" },
  ],
  l2: [
    { id: "qa4", time: "2:35", studentName: "Sam Chen", question: "When would we use a B-tree over a binary search tree?", answer: "B-trees are preferred for disk-based storage and databases due to reduced I/O." },
  ],
  l3: [],
  l4: [
    { id: "qa5", time: "10:30", studentName: "Riley Davis", question: "How do we handle multicollinearity in regression?" },
  ],
  l5: [],
};

const MATERIALS: Record<string, Material[]> = {
  l1: [
    { id: "m1", title: "Lecture 1 Slides", type: "PDF", url: "#" },
    { id: "m2", title: "Notebook - Linear Regression", type: "Jupyter", url: "#" },
  ],
  l2: [
    { id: "m3", title: "Trees and Graphs Handout", type: "PDF", url: "#" },
  ],
  l3: [
    { id: "m4", title: "Methodology Overview", type: "PDF", url: "#" },
  ],
  l4: [
    { id: "m5", title: "Regression Slides", type: "PDF", url: "#" },
  ],
  l5: [],
};

function statusBadge(s: AttendanceRecord["status"]): string {
  switch (s) {
    case "full": return "bg-emerald-100 text-emerald-800";
    case "partial": return "bg-amber-100 text-amber-800";
    case "late": return "bg-sky-100 text-sky-800";
    default: return "bg-slate-100 text-slate-600";
  }
}

export default function LectureDetailPage() {
  const params = useParams();
  const id = (params?.id as string) ?? "";

  const lecture = LECTURE_DETAILS[id];
  const attendance = ATTENDANCE[id] ?? [];
  const qa = QA_TRANSCRIPTS[id] ?? [];
  const materials = MATERIALS[id] ?? [];

  if (!lecture) {
    return (
      <div className="space-y-6">
        <Link href="/teacher/lectures/list" className="text-xs font-medium text-teal-600 hover:underline">
          ← Lecture List
        </Link>
        <Card className="rounded-lg border-slate-200 p-6">
          <p className="text-sm text-slate-600">Lecture not found.</p>
          <Link href="/teacher/lectures/list" className="mt-2 inline-block text-sm font-medium text-teal-600 hover:underline">
            Back to list
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section>
        <Link href="/teacher/lectures/list" className="text-xs font-medium text-teal-600 hover:underline">
          ← Lecture List
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
          {lecture.subject} – {lecture.title}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          {lecture.date} · {lecture.time} · {lecture.duration}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <a href={lecture.teamsLink} className="text-sm font-medium text-teal-600 hover:underline">
            Teams meeting
          </a>
          {lecture.recordingUrl && (
            <a href={lecture.recordingUrl} className="text-sm font-medium text-teal-600 hover:underline">
              Recording
            </a>
          )}
        </div>
      </section>

      {/* Attendance analytics */}
      <Card className="rounded-lg border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-900">Lecture analytics</h3>
        <p className="mt-0.5 text-xs text-slate-500">Who attended and for how long</p>
        <div className="mt-3 flex flex-wrap gap-4">
          <div className="rounded-lg bg-slate-50 px-4 py-2">
            <span className="text-2xl font-bold text-slate-900">{lecture.attendanceCount}</span>
            <span className="text-slate-600"> / {lecture.totalEnrolled}</span>
            <p className="text-xs text-slate-500">attended</p>
          </div>
          <div className="rounded-lg bg-slate-50 px-4 py-2">
            <span className="text-2xl font-bold text-slate-900">
              {attendance.length > 0
                ? Math.round(attendance.reduce((s, a) => s + a.durationMinutes, 0) / attendance.length)
                : "—"}
            </span>
            <p className="text-xs text-slate-500">avg minutes</p>
          </div>
        </div>
        {attendance.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase text-slate-600">Student</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase text-slate-600">Joined</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase text-slate-600">Left</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase text-slate-600">Duration</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {attendance.map((a) => (
                  <tr key={a.studentId}>
                    <td className="px-4 py-2 font-medium text-slate-900">{a.studentName}</td>
                    <td className="px-4 py-2 text-slate-600">{a.joinedAt}</td>
                    <td className="px-4 py-2 text-slate-600">{a.leftAt}</td>
                    <td className="px-4 py-2 text-slate-600">{a.durationMinutes} min</td>
                    <td className="px-4 py-2">
                      <span className={cn("inline-flex rounded px-1.5 py-0.5 text-xs font-medium capitalize", statusBadge(a.status))}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">No detailed attendance data.</p>
        )}
      </Card>

      {/* Q&A transcript */}
      <Card className="rounded-lg border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-900">Q&A transcript</h3>
        <p className="mt-0.5 text-xs text-slate-500">Questions and answers from this lecture</p>
        {qa.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {qa.map((entry) => (
              <li key={entry.id} className="rounded-lg border border-slate-200 bg-slate-50/50 p-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{entry.time}</span>
                  <span className="font-medium text-slate-700">{entry.studentName}</span>
                </div>
                <p className="mt-1 text-sm font-medium text-slate-900">{entry.question}</p>
                {entry.answer && (
                  <p className="mt-2 border-l-2 border-teal-300 pl-3 text-sm text-slate-700">{entry.answer}</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-slate-500">No Q&A from this lecture.</p>
        )}
      </Card>

      {/* Attached materials */}
      <Card className="rounded-lg border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-900">Attached materials</h3>
        <p className="mt-0.5 text-xs text-slate-500">Resources shared during this lecture</p>
        {materials.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {materials.map((m) => (
              <li key={m.id}>
                <a
                  href={m.url}
                  className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm transition-colors hover:border-teal-300 hover:bg-teal-50/30"
                >
                  <span className="text-slate-500">📄</span>
                  <span className="font-medium text-slate-900">{m.title}</span>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">{m.type}</span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-slate-500">No materials attached.</p>
        )}
      </Card>
    </div>
  );
}
