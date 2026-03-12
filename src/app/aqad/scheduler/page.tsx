"use client";

import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface CourseDueForReaudit {
  id: string;
  courseName: string;
  courseCode: string;
  instructor: string;
  lastApprovalDate: string;
  lastApprovalTs: number;
  /** Re-audit due date (e.g. 6 months after last approval) */
  reauditDueDate: string;
  reauditDueTs: number;
}

const COURSES_DUE: CourseDueForReaudit[] = [
  {
    id: "c1",
    courseName: "CS 440 - Machine Learning",
    courseCode: "CS 440",
    instructor: "Prof. Sarah Chen",
    lastApprovalDate: "Sep 15, 2025",
    lastApprovalTs: new Date("2025-09-15").getTime(),
    reauditDueDate: "Mar 15, 2026",
    reauditDueTs: new Date("2026-03-15").getTime(),
  },
  {
    id: "c2",
    courseName: "CS 210 - Data Structures",
    courseCode: "CS 210",
    instructor: "Dr. James Wilson",
    lastApprovalDate: "Sep 22, 2025",
    lastApprovalTs: new Date("2025-09-22").getTime(),
    reauditDueDate: "Mar 22, 2026",
    reauditDueTs: new Date("2026-03-22").getTime(),
  },
  {
    id: "c3",
    courseName: "RES 301 - Research Methods",
    courseCode: "RES 301",
    instructor: "Dr. Emma Davis",
    lastApprovalDate: "Oct 1, 2025",
    lastApprovalTs: new Date("2025-10-01").getTime(),
    reauditDueDate: "Apr 1, 2026",
    reauditDueTs: new Date("2026-04-01").getTime(),
  },
  {
    id: "c4",
    courseName: "Physics 201",
    courseCode: "PHY 201",
    instructor: "Prof. Michael Brown",
    lastApprovalDate: "Aug 28, 2025",
    lastApprovalTs: new Date("2025-08-28").getTime(),
    reauditDueDate: "Mar 10, 2026",
    reauditDueTs: new Date("2026-03-10").getTime(),
  },
  {
    id: "c5",
    courseName: "CS 350 - Database Systems",
    courseCode: "CS 350",
    instructor: "Prof. Michael Brown",
    lastApprovalDate: "Oct 10, 2025",
    lastApprovalTs: new Date("2025-10-10").getTime(),
    reauditDueDate: "Apr 10, 2026",
    reauditDueTs: new Date("2026-04-10").getTime(),
  },
];

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getCalendarDays(year: number, month: number): (number | null)[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startDay = first.getDay();
  const startOffset = startDay === 0 ? 6 : startDay - 1;
  const daysInMonth = last.getDate();
  const result: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) result.push(null);
  for (let d = 1; d <= daysInMonth; d++) result.push(d);
  const remainder = (7 - (result.length % 7)) % 7;
  for (let i = 0; i < remainder; i++) result.push(null);
  return result;
}

function dateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function ReauditSchedulerPage() {
  const now = new Date();
  const [currentYear, setCurrentYear] = React.useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = React.useState(now.getMonth());
  const [scheduledAudits, setScheduledAudits] = React.useState<
    Array<{ dateKey: string; courseId: string; courseName: string }>
  >([]);
  const [scheduledCourseIds, setScheduledCourseIds] = React.useState<Set<string>>(new Set());
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const calendarDays = getCalendarDays(currentYear, currentMonth);
  const monthLabel = new Date(currentYear, currentMonth).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const auditsByDate = React.useMemo(() => {
    const map: Record<string, string[]> = {};
    scheduledAudits.forEach(({ dateKey: key, courseName }) => {
      if (!map[key]) map[key] = [];
      map[key].push(courseName);
    });
    return map;
  }, [scheduledAudits]);

  const handleScheduleAudit = (course: CourseDueForReaudit) => {
    const key = dateKey(currentYear, currentMonth, 1);
    const day = currentMonth === now.getMonth() && currentYear === now.getFullYear()
      ? Math.max(now.getDate() + 1, 1)
      : 1;
    const scheduleKey = dateKey(currentYear, currentMonth, day);
    setScheduledAudits((prev) => [
      ...prev,
      { dateKey: scheduleKey, courseId: course.id, courseName: course.courseName },
    ]);
    setScheduledCourseIds((prev) => new Set(prev).add(course.id));
    setSuccessMessage(`Re-audit scheduled for ${course.courseName}. Review task added to AQAD pipeline.`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else setCurrentMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else setCurrentMonth((m) => m + 1);
  };

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Re-audit scheduler
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Calendar of mandatory re-audits, courses due for re-audit, and schedule new review tasks.
        </p>
      </section>

      {successMessage && (
        <div
          role="alert"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          {successMessage}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 1. Calendar view */}
        <section className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-900">Calendar view</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Upcoming mandatory re-audits by date
          </p>
          <Card className="mt-3 overflow-hidden rounded-lg border-slate-200 p-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-semibold text-slate-900">{monthLabel}</h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="rounded border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  ← Prev
                </button>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="rounded border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Next →
                </button>
              </div>
            </div>
            <div className="mt-3">
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-slate-500">
                {WEEKDAYS.map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>
              <div className="mt-2 grid grid-cols-7 gap-1">
                {calendarDays.map((day, i) => {
                  if (day === null) {
                    return <div key={`empty-${i}`} className="aspect-square" />;
                  }
                  const key = dateKey(currentYear, currentMonth, day);
                  const audits = auditsByDate[key] ?? [];
                  const hasAudit = audits.length > 0;
                  const isPast =
                    new Date(currentYear, currentMonth, day).getTime() <
                    new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
                  return (
                    <div
                      key={key}
                      className={cn(
                        "flex aspect-square flex-col items-center justify-center rounded-md border text-xs",
                        isPast && "bg-slate-50 text-slate-400",
                        !isPast && !hasAudit && "border-slate-100 bg-white text-slate-700",
                        !isPast && hasAudit && "border-amber-200 bg-amber-50 text-amber-900",
                      )}
                    >
                      <span className="font-medium">{day}</span>
                      {hasAudit && (
                        <span
                          className="mt-0.5 block max-w-full truncate px-0.5 text-[10px] font-semibold text-amber-700"
                          title={audits.join(", ")}
                        >
                          {audits.length} re-audit{audits.length !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </section>

        {/* 2. Auto-assignment: Due for Re-audit */}
        <section>
          <h2 className="text-sm font-semibold text-slate-900">
            Due for re-audit
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Courses by last approval date — schedule into the pipeline
          </p>
          <Card className="mt-3 overflow-hidden rounded-lg border-slate-200 p-0">
            <ul className="max-h-[340px] overflow-y-auto divide-y divide-slate-100">
              {COURSES_DUE.map((course) => {
                const isScheduled = scheduledCourseIds.has(course.id);
                return (
                  <li
                    key={course.id}
                    className="px-4 py-3 transition-colors hover:bg-slate-50"
                  >
                    <p className="font-medium text-slate-900">{course.courseName}</p>
                    <p className="text-xs text-slate-500">{course.instructor}</p>
                    <p className="mt-1 text-[11px] text-slate-600">
                      Last approved: {course.lastApprovalDate} → Due:{" "}
                      <span className="font-semibold text-slate-800">
                        {course.reauditDueDate}
                      </span>
                    </p>
                    <div className="mt-2">
                      {isScheduled ? (
                        <span className="inline-flex items-center rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                          Scheduled
                        </span>
                      ) : (
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          className="bg-indigo-600 hover:bg-indigo-700 focus-visible:ring-indigo-600"
                          onClick={() => handleScheduleAudit(course)}
                        >
                          Schedule audit
                        </Button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>
        </section>
      </div>

      {/* 3. Task creation summary */}
      <section>
        <Card className="rounded-lg border-slate-200 p-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Scheduled review tasks
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            &quot;Schedule audit&quot; creates a new Review task in the AQAD pipeline for the selected course.
          </p>
          {scheduledAudits.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">
              No audits scheduled yet. Use &quot;Schedule audit&quot; on a course above to add a review task.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {scheduledAudits.map((a, i) => (
                <li
                  key={`${a.dateKey}-${a.courseId}-${i}`}
                  className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50/50 px-3 py-2 text-sm"
                >
                  <span className="font-medium text-slate-900">{a.courseName}</span>
                  <span className="text-xs text-slate-600">{a.dateKey}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </div>
  );
}
