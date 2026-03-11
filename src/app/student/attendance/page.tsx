"use client";

import * as React from "react";

import { Card } from "../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type DayStatus = "present" | "absent" | "late" | null;

const ATTENDANCE_WARNING_THRESHOLD = 75;

// Mock: which days have which status (YYYY-MM-DD -> status)
function getMockDayStatus(year: number, month: number): Record<string, DayStatus> {
  const days: Record<string, DayStatus> = {};
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    if (date > today) continue; // future = no status
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue; // weekend no class
    const rand = (d * 7 + month) % 10;
    if (rand <= 1) days[key] = "absent";
    else if (rand <= 3) days[key] = "late";
    else days[key] = "present";
  }
  return days;
}

interface CourseAttendance {
  id: string;
  name: string;
  attended: number;
  total: number;
}

const COURSE_STATS: CourseAttendance[] = [
  { id: "1", name: "Algorithms and Data Structures", attended: 17, total: 18 },
  { id: "2", name: "Distributed Systems", attended: 13, total: 18 },
  { id: "3", name: "Research Methods", attended: 16, total: 18 },
  { id: "4", name: "Data Communications", attended: 18, total: 18 },
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AttendancePage() {
  const [viewDate, setViewDate] = React.useState(() => new Date());
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const [dayStatus, setDayStatus] = React.useState<Record<string, DayStatus>>(() =>
    getMockDayStatus(year, month),
  );

  React.useEffect(() => {
    setDayStatus(getMockDayStatus(year, month));
  }, [year, month]);

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < startPad; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const hasLowAttendance = COURSE_STATS.some((c) => (c.attended / c.total) * 100 < ATTENDANCE_WARNING_THRESHOLD);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Attendance
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Monthly calendar and subject-wise attendance. Synced with 1C.
        </p>
      </section>

      {/* Warning: attendance below 75% */}
      {hasLowAttendance && (
        <div
          className="rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 text-red-900"
          role="alert"
        >
          <p className="font-semibold">
            Risk of failing due to low attendance.
          </p>
          <p className="mt-1 text-sm text-red-800">
            One or more courses are below {ATTENDANCE_WARNING_THRESHOLD}% attendance. Please attend classes regularly.
          </p>
        </div>
      )}

      {/* Monthly calendar */}
      <Card>
        <h2 className="text-sm font-semibold text-slate-900">Monthly calendar</h2>
        <p className="mt-1 text-xs text-slate-500">
          Green = Present, Amber = Late, Red = Absent
        </p>
        <div className="mt-4 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1))}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            ← Previous
          </button>
          <span className="text-base font-semibold text-slate-900">
            {viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </span>
          <button
            type="button"
            onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1))}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Next →
          </button>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-500">
          {WEEKDAYS.map((w) => (
            <div key={w}>{w}</div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1">
          {calendarDays.map((day, i) => {
            if (day === null) {
              return <div key={`empty-${i}`} />;
            }
            const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const status = dayStatus[dateKey] ?? null;
            const isFuture = new Date(year, month, day) > new Date();
            return (
              <div
                key={dateKey}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-lg text-sm font-medium",
                  isFuture && "bg-slate-50 text-slate-400",
                  !isFuture && status === "present" && "bg-emerald-500 text-white",
                  !isFuture && status === "late" && "bg-amber-500 text-white",
                  !isFuture && status === "absent" && "bg-red-500 text-white",
                  !isFuture && status === null && "bg-slate-100 text-slate-500",
                )}
                title={status ? `${dateKey}: ${status}` : dateKey}
              >
                {day}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Subject-wise stats */}
      <Card>
        <h2 className="text-sm font-semibold text-slate-900">Subject-wise attendance</h2>
        <p className="mt-1 text-xs text-slate-500">
          Percentage of attended classes per course
        </p>
        <ul className="mt-4 space-y-4">
          {COURSE_STATS.map((course) => {
            const pct = course.total > 0 ? Math.round((course.attended / course.total) * 100) : 0;
            const isLow = pct < ATTENDANCE_WARNING_THRESHOLD;
            return (
              <li
                key={course.id}
                className="flex flex-col gap-2 rounded-lg border border-slate-100 bg-slate-50/50 px-4 py-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-slate-900">{course.name}</span>
                  <span
                    className={cn(
                      "font-semibold",
                      isLow ? "text-red-600" : "text-slate-900",
                    )}
                  >
                    {pct}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={cn(
                      "h-full rounded-full transition-[width]",
                      isLow ? "bg-red-500" : "bg-emerald-500",
                    )}
                    style={{ width: `${pct}%` }}
                    aria-hidden
                  />
                </div>
                <p className="text-xs text-slate-500">
                  {course.attended} of {course.total} classes
                </p>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
