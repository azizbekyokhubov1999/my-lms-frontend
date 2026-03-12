"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// 1. Academic KPI Cards
const KPI_CARDS = [
  { label: "Active Courses", value: "6", subtext: "This semester" },
  { label: "Total Students", value: "342", subtext: "Across all courses" },
  { label: "Average Attendance (%)", value: "87%", subtext: "Last 30 days" },
  { label: "Pending Assignments to Grade", value: "23", subtext: "Require feedback" },
];

// 2. Upcoming Lectures — today's live Teams lectures
const UPCOMING_LECTURES = [
  { id: "l1", course: "CS 440 - Machine Learning", time: "10:00 AM", duration: "60 min", meetingUrl: "#" },
  { id: "l2", course: "CS 210 - Data Structures", time: "02:00 PM", duration: "75 min", meetingUrl: "#" },
  { id: "l3", course: "RES 301 - Research Methods", time: "04:30 PM", duration: "60 min", meetingUrl: "#" },
];

// 3. AQAD Alerts — urgent corrective actions
const AQAD_ALERTS = [
  { id: "ca1", title: "Update Lecture 5 video", course: "CS 210", due: "Mar 10, 2026", status: "Overdue" },
  { id: "ca2", title: "Fix quiz typos (Quiz 2)", course: "CS 440", due: "Mar 12, 2026", status: "In progress" },
];

// 4. Student Engagement — participation trend (e.g. % participation by course or week)
const ENGAGEMENT_DATA = [
  { label: "CS 440", value: 92 },
  { label: "CS 210", value: 78 },
  { label: "RES 301", value: 85 },
  { label: "CS 350", value: 71 },
  { label: "EE 320", value: 88 },
  { label: "BUS 210", value: 82 },
];

export default function TeacherDashboardPage() {
  const maxEngagement = Math.max(...ENGAGEMENT_DATA.map((d) => d.value));
  const minEngagement = Math.min(...ENGAGEMENT_DATA.map((d) => d.value));
  const range = maxEngagement - minEngagement || 1;

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Your teaching overview: KPIs, today&apos;s lectures, AQAD alerts, and engagement trends.
        </p>
      </section>

      {/* 1. Academic KPI Cards */}
      <section>
        <h2 className="sr-only">Academic KPIs</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {KPI_CARDS.map((card) => (
            <Card
              key={card.label}
              className="rounded-lg border-slate-200 bg-white"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {card.label}
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {card.value}
              </p>
              <p className="mt-0.5 text-xs text-slate-600">{card.subtext}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* 2. Upcoming Lectures + 3. AQAD Alerts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="text-sm font-semibold text-slate-900">
            Upcoming lectures
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Today&apos;s live Teams sessions
          </p>
          <Card className="mt-3 overflow-hidden rounded-lg border-slate-200 p-0">
            <ul className="divide-y divide-slate-100">
              {UPCOMING_LECTURES.map((lecture) => (
                <li key={lecture.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                  <div>
                    <p className="font-medium text-slate-900">{lecture.course}</p>
                    <p className="text-xs text-slate-500">
                      {lecture.time} · {lecture.duration}
                    </p>
                  </div>
                  <a
                    href={lecture.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0"
                  >
                    <Button type="button" variant="primary" size="sm" className="bg-teal-600 hover:bg-teal-700">
                      Start Meeting
                    </Button>
                  </a>
                </li>
              ))}
            </ul>
            <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-2">
              <Link href="/teacher/lectures" className="text-xs font-medium text-teal-600 hover:underline">
                View full schedule →
              </Link>
            </div>
          </Card>
        </section>

        {/* 3. AQAD Alerts */}
        <section>
          <h2 className="text-sm font-semibold text-slate-900">
            AQAD alerts
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Urgent corrective actions from Quality Assurance
          </p>
          <div className="mt-3 rounded-lg border-2 border-amber-200 bg-amber-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
              Corrective actions require your attention
            </p>
            <ul className="mt-3 space-y-2">
              {AQAD_ALERTS.map((alert) => (
                <li key={alert.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <div>
                    <span className="font-medium text-slate-900">{alert.title}</span>
                    <span className="ml-1 text-slate-600">({alert.course})</span>
                    <span className="ml-1 text-xs text-slate-500">Due {alert.due}</span>
                  </div>
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold",
                      alert.status === "Overdue"
                        ? "bg-red-100 text-red-800"
                        : "bg-amber-100 text-amber-800",
                    )}
                  >
                    {alert.status}
                  </span>
                </li>
              ))}
            </ul>
            <Link href="/teacher/aqad-tasks" className="mt-3 inline-block text-sm font-medium text-amber-800 hover:underline">
              View all AQAD tasks →
            </Link>
          </div>
        </section>
      </div>

      {/* 4. Student Engagement Chart */}
      <section>
        <h2 className="text-sm font-semibold text-slate-900">
          Student engagement
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Participation trends across your courses (last 30 days)
        </p>
        <Card className="mt-3 overflow-hidden rounded-lg border-slate-200">
          <div className="relative h-56 px-4 pt-2 pb-8">
            <svg
              viewBox="0 0 400 160"
              className="h-full w-full"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <defs>
                <linearGradient
                  id="teacherBarGradient"
                  x1="0"
                  y1="1"
                  x2="0"
                  y2="0"
                >
                  <stop offset="0%" stopColor="#0d9488" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              {ENGAGEMENT_DATA.map((d, i) => {
                const barHeight = ((d.value - minEngagement) / range) * 80 + 20;
                const x = 40 + (i * 360) / ENGAGEMENT_DATA.length;
                const y = 120 - barHeight;
                const w = Math.max(24, 360 / ENGAGEMENT_DATA.length - 12);
                return (
                  <g key={d.label}>
                    <rect
                      x={x}
                      y={y}
                      width={w}
                      height={barHeight}
                      rx="4"
                      fill="url(#teacherBarGradient)"
                      className="transition-opacity hover:opacity-90"
                    />
                    <text
                      x={x + w / 2}
                      y={135}
                      textAnchor="middle"
                      className="fill-slate-600 text-[10px] font-medium"
                    >
                      {d.label}
                    </text>
                    <text
                      x={x + w / 2}
                      y={y - 4}
                      textAnchor="middle"
                      className="fill-slate-700 text-[10px] font-semibold"
                    >
                      {d.value}%
                    </text>
                  </g>
                );
              })}
              <line x1="40" y1="120" x2="400" y2="120" stroke="#e2e8f0" strokeWidth="1" />
            </svg>
          </div>
          <div className="border-t border-slate-100 px-4 py-2 text-center text-xs text-slate-500">
            Participation rate by course (% of students active in discussions, submissions, or attendance)
          </div>
        </Card>
      </section>
    </div>
  );
}
