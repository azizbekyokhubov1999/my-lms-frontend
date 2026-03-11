"use client";

import * as React from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function DashboardOverviewPage() {
  const studentName = "Student Name";

  const stats = [
    { label: "GPA", value: "3.8" },
    { label: "Attendance", value: "0%" },
    { label: "Current Courses", value: "4" },
    { label: "Upcoming Exams", value: "2" },
  ];

  const recentLectures = [
    {
      id: 1,
      course: "Advanced Algorithms",
      topic: "Greedy strategies and interval scheduling",
      date: "Mar 3, 2026",
    },
    {
      id: 2,
      course: "Distributed Systems",
      topic: "Consensus and fault tolerance",
      date: "Mar 2, 2026",
    },
    {
      id: 3,
      course: "Research Methods",
      topic: "Academic integrity and citation standards",
      date: "Feb 28, 2026",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <section>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Welcome back, {studentName}!
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Here&apos;s an overview of your academic activity and upcoming
          commitments.
        </p>
      </section>

      {/* AI Learning Insights */}
      <section>
        <h2 className="text-sm font-semibold text-slate-900">
          AI learning insights
        </h2>
        <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-600">
              Dropout risk score:
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                "bg-emerald-100 text-emerald-800",
              )}
            >
              Low
              <span
                className="group relative cursor-help"
                title="AI calculated this based on attendance and grades. Low risk indicates good engagement and performance."
              >
                <span className="text-slate-400">ⓘ</span>
                <span className="pointer-events-none absolute bottom-full left-1/2 z-10 -translate-x-1/2 mb-2 hidden max-w-xs rounded bg-slate-800 px-2 py-1 text-[10px] text-white group-hover:block">
                  AI calculated this based on attendance and grades.
                </span>
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* Statistics cards */}
      <section>
        <h2 className="text-sm font-semibold text-slate-900">At a glance</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {item.label}
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent activity */}
      <section>
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-900">
            Recent lectures attended
          </h2>
          <button
            type="button"
            className="text-xs font-medium text-blue-900 hover:underline"
          >
            View all
          </button>
        </div>

        <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="grid grid-cols-[2fr,3fr,auto] bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
            <span>Course</span>
            <span>Topic</span>
            <span className="text-right">Date</span>
          </div>
          <ul className="divide-y divide-slate-200 text-sm">
            {recentLectures.map((lecture) => (
              <li
                key={lecture.id}
                className="grid grid-cols-[2fr,3fr,auto] items-start gap-2 px-3 py-2"
              >
                <div className="font-medium text-slate-900">
                  {lecture.course}
                </div>
                <div className="text-xs text-slate-600">{lecture.topic}</div>
                <div className="text-xs text-slate-500 text-right">
                  {lecture.date}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

