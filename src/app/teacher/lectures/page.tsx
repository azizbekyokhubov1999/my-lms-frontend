"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface ScheduledLecture {
  id: string;
  course: string;
  title: string;
  day: string;
  date: string;
  time: string;
  duration: string;
  meetingUrl: string;
  dateTime: Date;
}

interface PastLecture {
  id: string;
  course: string;
  title: string;
  date: string;
  recordingUrl: string;
  attendanceUrl: string;
  attendanceRate: number;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const SCHEDULED: ScheduledLecture[] = [
  { id: "s1", course: "CS 440", title: "ML Intro", day: "Mon", date: "Mar 10", time: "10:00 AM", duration: "60 min", meetingUrl: "#", dateTime: new Date("2026-03-10T10:00:00") },
  { id: "s2", course: "CS 210", title: "Trees & Graphs", day: "Mon", date: "Mar 10", time: "02:00 PM", duration: "75 min", meetingUrl: "#", dateTime: new Date("2026-03-10T14:00:00") },
  { id: "s3", course: "RES 301", title: "Qualitative Methods", day: "Tue", date: "Mar 11", time: "11:00 AM", duration: "60 min", meetingUrl: "#", dateTime: new Date("2026-03-11T11:00:00") },
  { id: "s4", course: "CS 440", title: "ML Core", day: "Wed", date: "Mar 12", time: "10:00 AM", duration: "60 min", meetingUrl: "#", dateTime: new Date("2026-03-12T10:00:00") },
  { id: "s5", course: "CS 210", title: "Graph Algorithms", day: "Wed", date: "Mar 12", time: "02:00 PM", duration: "75 min", meetingUrl: "#", dateTime: new Date("2026-03-12T14:00:00") },
  { id: "s6", course: "RES 301", title: "Literature Review", day: "Fri", date: "Mar 14", time: "09:30 AM", duration: "60 min", meetingUrl: "#", dateTime: new Date("2026-03-14T09:30:00") },
];

const ARCHIVE: PastLecture[] = [
  { id: "p1", course: "CS 440", title: "ML Intro", date: "Mar 3, 2026", recordingUrl: "#", attendanceUrl: "#", attendanceRate: 92 },
  { id: "p2", course: "CS 210", title: "Trees Basics", date: "Mar 3, 2026", recordingUrl: "#", attendanceUrl: "#", attendanceRate: 88 },
  { id: "p3", course: "RES 301", title: "Methodology", date: "Mar 4, 2026", recordingUrl: "#", attendanceUrl: "#", attendanceRate: 85 },
  { id: "p4", course: "CS 440", title: "Regression", date: "Mar 5, 2026", recordingUrl: "#", attendanceUrl: "#", attendanceRate: 90 },
  { id: "p5", course: "CS 210", title: "Graph Intro", date: "Mar 5, 2026", recordingUrl: "#", attendanceUrl: "#", attendanceRate: 82 },
];

function formatCountdown(target: Date): string {
  const now = new Date();
  const ms = target.getTime() - now.getTime();
  if (ms <= 0) return "Started or ended";
  const h = Math.floor(ms / (60 * 60 * 1000));
  const m = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
  if (h >= 24) {
    const d = Math.floor(h / 24);
    return `${d}d ${h % 24}h`;
  }
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function TeacherLecturesPage() {
  const [now, setNow] = React.useState(new Date());
  const nextLecture = SCHEDULED.find((l) => l.dateTime > now) ?? SCHEDULED[0];
  const countdown = nextLecture ? formatCountdown(nextLecture.dateTime) : "—";

  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const byDay = WEEKDAYS.map((day) => ({
    day,
    lectures: SCHEDULED.filter((l) => l.day === day),
  }));

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
            Live Lectures
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Schedule, join meetings, and access recording archives.
          </p>
        </div>
        <Link href="/teacher/lectures/list">
          <Button type="button" variant="secondary" size="sm">
            View full list
          </Button>
        </Link>
      </section>

      {/* Next Lecture — countdown */}
      <Card className="rounded-lg border-teal-200 bg-teal-50/50 p-4">
        <h2 className="text-sm font-semibold text-slate-900">Next lecture</h2>
        {nextLecture ? (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-medium text-slate-900">{nextLecture.course} – {nextLecture.title}</p>
              <p className="text-sm text-slate-600">
                {nextLecture.day}, {nextLecture.date} · {nextLecture.time} ({nextLecture.duration})
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-2xl font-bold text-teal-700 tabular-nums">
                {countdown}
              </p>
              <span className="text-xs text-slate-500">until start</span>
              <a href={nextLecture.meetingUrl} target="_blank" rel="noopener noreferrer">
                <Button type="button" variant="primary" size="sm" className="bg-teal-600 hover:bg-teal-700">
                  Join Teams
                </Button>
              </a>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-600">No upcoming lectures this week.</p>
        )}
      </Card>

      {/* Weekly calendar */}
      <Card className="rounded-lg border-slate-200 p-4">
        <h2 className="text-sm font-semibold text-slate-900">This week</h2>
        <p className="mt-0.5 text-xs text-slate-500">Scheduled live lectures</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {byDay.map(({ day, lectures }) => (
            <div key={day} className="rounded-lg border border-slate-200 bg-slate-50/50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{day}</p>
              {lectures.length === 0 ? (
                <p className="mt-2 text-xs text-slate-500">No lectures</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {lectures.map((l) => (
                    <li key={l.id} className="flex items-center justify-between gap-2 rounded border border-slate-100 bg-white px-3 py-2">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{l.course}</p>
                        <p className="text-xs text-slate-500">{l.time} · {l.duration}</p>
                      </div>
                      <a href={l.meetingUrl} target="_blank" rel="noopener noreferrer">
                        <Button type="button" variant="primary" size="sm" className="bg-teal-600 hover:bg-teal-700">
                          Start Meeting
                        </Button>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Recording archive */}
      <Card className="overflow-hidden rounded-lg border-slate-200 p-0">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-900">Recording archive</h2>
          <p className="mt-0.5 text-xs text-slate-500">Past lectures with Teams recordings and attendance</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Lecture</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Attendance</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-600">Links</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {ARCHIVE.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{row.course}</p>
                    <p className="text-xs text-slate-500">{row.title}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{row.date}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-slate-900">{row.attendanceRate}%</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <a href={row.recordingUrl} className="text-xs font-medium text-teal-600 hover:underline">Recording</a>
                      <a href={row.attendanceUrl} className="text-xs font-medium text-teal-600 hover:underline">Attendance</a>
                    </div>
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
