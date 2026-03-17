"use client";

import Link from "next/link";
import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "../../components/ui/Card";

/** Attendance by day of week – highlights "Tuesday slump" pattern */
const ATTENDANCE_BY_DAY = [
  { day: "Mon", pct: 94.2, label: "Monday" },
  { day: "Tue", pct: 88.1, label: "Tuesday" },
  { day: "Wed", pct: 93.8, label: "Wednesday" },
  { day: "Thu", pct: 94.0, label: "Thursday" },
  { day: "Fri", pct: 91.5, label: "Friday" },
  { day: "Sat", pct: 82.0, label: "Saturday" },
];

/** Weekly trend (last 6 weeks) for context */
const ATTENDANCE_WEEKLY = [
  { week: "W1", pct: 92 },
  { week: "W2", pct: 91 },
  { week: "W3", pct: 90 },
  { week: "W4", pct: 93 },
  { week: "W5", pct: 91 },
  { week: "W6", pct: 92 },
];

export default function AttendanceTrendsPage() {
  const tuesdayPct = ATTENDANCE_BY_DAY.find((d) => d.day === "Tue")?.pct ?? 0;
  const avgPct = ATTENDANCE_BY_DAY.reduce((a, d) => a + d.pct, 0) / ATTENDANCE_BY_DAY.length;
  const hasTuesdaySlump = tuesdayPct < avgPct - 2;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/director" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          ← Deputy Director
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Attendance trends</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Identify patterns in student presence (e.g. Tuesday slump).
        </p>
      </div>

      {hasTuesdaySlump && (
        <Card className="border-amber-200 bg-amber-50/50">
          <h2 className="text-sm font-semibold text-amber-800">Pattern detected: Tuesday slump</h2>
          <p className="mt-1 text-sm text-amber-700">
            Tuesday attendance ({tuesdayPct}%) is noticeably lower than the weekly average ({avgPct.toFixed(1)}%). 
            Consider scheduling or engagement interventions for mid-week.
          </p>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-200 bg-white">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            Attendance by day of week
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Average presence % by day. Highlights weekly patterns.
          </p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ATTENDANCE_BY_DAY} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis domain={[75, 100]} tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                  formatter={(value: unknown) => [`${value}%`, "Attendance"]}
                  labelFormatter={(_, payload) => payload?.[0]?.payload?.label ?? ""}
                />
                <Bar dataKey="pct" name="Attendance %" radius={[4, 4, 0, 0]}>
                  {ATTENDANCE_BY_DAY.map((entry) => (
                    <Cell key={entry.day} fill={entry.day === "Tue" ? "#d97706" : "#0f766e"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border-slate-200 bg-white">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            Weekly trend (last 6 weeks)
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Overall attendance trend over recent weeks.
          </p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ATTENDANCE_WEEKLY} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                  formatter={(value: unknown) => [`${value}%`, "Attendance"]}
                />
                <Bar dataKey="pct" name="Attendance %" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
