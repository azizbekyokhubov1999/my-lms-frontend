"use client";

import Link from "next/link";
import * as React from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const STUDENT_NAME = "Student Name";

// Performance overview
const PERFORMANCE = {
  gpa: 3.8,
  attendance: 92,
  completedCredits: 78,
};

// Next lecture: use a time that can be "within 5 mins" for demo (e.g. now + 3 mins)
function getNextLecture() {
  const now = new Date();
  const start = new Date(now);
  start.setMinutes(now.getMinutes() + 4);
  start.setSeconds(0, 0);
  return {
    subject: "Distributed Systems",
    topic: "Lecture 3: Case studies",
    startAt: start,
    teamsLink: "#",
  };
}

// Deadlines & tasks
const DEADLINES: { id: string; title: string; dueAt: Date; type: "assignment" | "exam" }[] = [
  { id: "1", title: "Assignment 2: System design reflection", dueAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), type: "assignment" },
  { id: "2", title: "Algorithms midterm exam", dueAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), type: "exam" },
  { id: "3", title: "Research Methods essay draft", dueAt: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), type: "assignment" },
];

// Weekly attendance (last 7 days)
const WEEKLY_ATTENDANCE = [
  { day: "Mon", label: "M", pct: 100 },
  { day: "Tue", label: "T", pct: 100 },
  { day: "Wed", label: "W", pct: 85 },
  { day: "Thu", label: "T", pct: 100 },
  { day: "Fri", label: "F", pct: 92 },
  { day: "Sat", label: "S", pct: 0 },
  { day: "Sun", label: "S", pct: 0 },
];

// Active courses with progress
const ACTIVE_COURSES = [
  { id: "algorithms", name: "Algorithms", progress: 45 },
  { id: "distributed-systems", name: "Distributed Systems", progress: 70 },
  { id: "research-methods", name: "Research Methods", progress: 100 },
];

function formatCountdown(dueAt: Date): string {
  const now = new Date();
  const diff = dueAt.getTime() - now.getTime();
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  if (days < 0) return "Overdue";
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `Due in ${days} days`;
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

/** Circular progress ring */
function CircularProgress({ value, label, sublabel }: { value: number; label: string; sublabel?: string }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="flex flex-col items-center">
      <div className="relative inline-flex items-center justify-center">
        <svg className="h-20 w-20 -rotate-90" viewBox="0 0 100 100" aria-hidden>
          <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-200" />
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={c}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="text-sky-600 transition-[stroke-dashoffset] duration-500"
          />
        </svg>
        <span className="absolute text-sm font-bold text-slate-900">{value}%</span>
      </div>
      <p className="mt-2 max-w-[100px] truncate text-center text-xs font-medium text-slate-700">{label}</p>
      {sublabel && <p className="text-[10px] text-slate-500">{sublabel}</p>}
    </div>
  );
}

export default function StudentDashboardPage() {
  const nextLecture = React.useMemo(() => getNextLecture(), []);
  const [now, setNow] = React.useState(() => new Date());

  // Update "now" every 30s so Join button state stays correct
  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  const msUntilStart = nextLecture.startAt.getTime() - now.getTime();
  const canJoinTeams = msUntilStart <= 5 * 60 * 1000 && msUntilStart > -60 * 60 * 1000; // 5 mins before until 1 hr after

  return (
    <div className="space-y-6">
      {/* Header */}
      <section>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Welcome back, {STUDENT_NAME}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Here’s your academic overview and what’s next.
        </p>
      </section>

      {/* 1. Performance Overview — 3 mini-cards */}
      <section>
        <h2 className="text-sm font-semibold text-slate-900">Performance overview</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Current GPA</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{PERFORMANCE.gpa}</p>
            <p className="text-[11px] text-slate-500">out of 4.0</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Overall attendance</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{PERFORMANCE.attendance}%</p>
            <p className="text-[11px] text-slate-500">this term</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Completed credits</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{PERFORMANCE.completedCredits}</p>
            <p className="text-[11px] text-slate-500">credit hours</p>
          </div>
        </div>
      </section>

      {/* 2. Next Lecture — prominent card + Join via Teams */}
      <section>
        <h2 className="text-sm font-semibold text-slate-900">Next lecture</h2>
        <div className="mt-3 rounded-xl border-2 border-sky-200 bg-linear-to-br from-sky-50 to-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-base font-semibold text-slate-900">{nextLecture.subject}</p>
              <p className="mt-0.5 text-sm text-slate-600">{nextLecture.topic}</p>
              <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                <span className="h-2 w-2 rounded-full bg-sky-500" aria-hidden />
                {formatTime(nextLecture.startAt)}
              </p>
            </div>
            <div className="shrink-0">
              <a
                href={nextLecture.teamsLink}
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold shadow-sm transition-colors",
                  canJoinTeams
                    ? "bg-[#5059C9] text-white hover:bg-[#464EB8]"
                    : "cursor-not-allowed bg-slate-200 text-slate-500",
                )}
                aria-disabled={!canJoinTeams}
              >
                <span aria-hidden>▶</span>
                Join via Teams
              </a>
              {!canJoinTeams && (
                <p className="mt-1.5 text-[11px] text-slate-500">
                  Available 5 minutes before start
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* 3. Deadlines & Tasks */}
        <section className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-900">Deadlines & tasks</h2>
          <ul className="mt-3 space-y-2">
            {DEADLINES.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500">
                    {item.type === "exam" ? "Exam" : "Assignment"}
                  </p>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
                    item.dueAt.getTime() - now.getTime() < 24 * 60 * 60 * 1000
                      ? "bg-amber-100 text-amber-800"
                      : "bg-slate-100 text-slate-700",
                  )}
                >
                  {formatCountdown(item.dueAt)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* 4. Attendance Chart — weekly bar chart */}
        <section className="lg:col-span-3">
          <h2 className="text-sm font-semibold text-slate-900">Attendance this week</h2>
          <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-end justify-between gap-1 h-32">
              {WEEKLY_ATTENDANCE.map((d) => (
                <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full max-w-[32px] rounded-t bg-sky-500 transition-all duration-300"
                    style={{ height: `${Math.max(4, (d.pct / 100) * 100)}%` }}
                    title={`${d.day}: ${d.pct}%`}
                  />
                  <span className="text-[10px] font-medium text-slate-500">{d.day}</span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-center text-xs text-slate-500">Daily attendance %</p>
          </div>
        </section>
      </div>

      {/* 5. Course Progress — circular progress bars */}
      <section>
        <h2 className="text-sm font-semibold text-slate-900">Course progress</h2>
        <div className="mt-3 flex flex-wrap gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {ACTIVE_COURSES.map((course) => (
            <Link
              key={course.id}
              href="/student/courses"
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 rounded-lg"
            >
              <CircularProgress
                value={course.progress}
                label={course.name}
                sublabel={course.progress === 100 ? "Completed" : "In progress"}
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
