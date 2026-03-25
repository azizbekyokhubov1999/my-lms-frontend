"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import * as React from "react";
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const STAR_BREAKDOWN = [
  { stars: 5, count: 42, pct: 52 },
  { stars: 4, count: 28, pct: 35 },
  { stars: 3, count: 8, pct: 10 },
  { stars: 2, count: 2, pct: 2.5 },
  { stars: 1, count: 1, pct: 1.25 },
];

const SKILL_RADAR_DATA = [
  { subject: "Clarity", value: 92, fullMark: 100 },
  { subject: "Engagement", value: 88, fullMark: 100 },
  { subject: "Feedback", value: 85, fullMark: 100 },
  { subject: "Punctuality", value: 98, fullMark: 100 },
  { subject: "Q&A", value: 90, fullMark: 100 },
];

const MOCK_TEACHER = {
  id: "t1",
  name: "Dr. Nina Kozlova",
  faculty: "Engineering",
  avgFeedback: 4.6,
  classesHeld: 48,
  classesScheduled: 50,
  qaAvgHours: 16,
  qaWithinSLA: 96,
};

export default function TeacherPerformancePage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const teacher = MOCK_TEACHER;
  const attendancePct = Math.round((teacher.classesHeld / teacher.classesScheduled) * 100);
  const attendanceGood = attendancePct >= 90;
  const qaOnTarget = teacher.qaAvgHours < 24;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/resources/performance"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Performance
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">{teacher.name}</h1>
          <p className="mt-0.5 text-sm text-slate-600">{teacher.faculty}</p>
        </div>
        <span className="text-2xl font-bold text-teal-600">{teacher.avgFeedback.toFixed(1)} / 5</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Student feedback – 5-star breakdown */}
        <Card className="border-teal-100 bg-white/80">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Student feedback</h2>
          <p className="mt-0.5 text-xs text-slate-600">Rating distribution (last 3 months).</p>
          <div className="mt-4 space-y-2">
            {STAR_BREAKDOWN.map((row) => (
              <div key={row.stars} className="flex items-center gap-3">
                <span className="w-16 text-sm font-medium text-slate-700">{row.stars} star</span>
                <div className="flex-1 h-6 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-teal-600"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
                <span className="w-12 text-right text-xs text-slate-600">{row.count}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Attendance */}
        <Card className="border-teal-100 bg-white/80">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Attendance metrics</h2>
          <p className="mt-0.5 text-xs text-slate-600">Classes held vs. scheduled.</p>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="h-4 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className={cn("h-full rounded-full", attendanceGood ? "bg-teal-600" : "bg-amber-500")}
                  style={{ width: `${attendancePct}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-slate-700">
                <span className="font-semibold">{teacher.classesHeld}</span> held /{" "}
                <span className="font-semibold">{teacher.classesScheduled}</span> scheduled
              </p>
            </div>
            <span className={cn("text-xl font-bold", attendanceGood ? "text-teal-600" : "text-amber-600")}>
              {attendancePct}%
            </span>
          </div>
        </Card>
      </div>

      {/* Q&A Response SLA */}
      <Card className={cn("border", qaOnTarget ? "border-teal-200 bg-teal-50/30" : "border-amber-200 bg-amber-50/30")}>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Q&amp;A response SLA</h2>
        <p className="mt-0.5 text-xs text-slate-600">Target: average response &lt; 24 hours.</p>
        <div className="mt-4 flex flex-wrap items-center gap-6">
          <div>
            <p className="text-xs text-slate-500">Avg. response time</p>
            <p className={cn("text-2xl font-bold", qaOnTarget ? "text-teal-600" : "text-amber-600")}>
              {teacher.qaAvgHours}h
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Within 24h SLA</p>
            <p className={cn("text-2xl font-bold", teacher.qaWithinSLA >= 90 ? "text-teal-600" : "text-amber-600")}>
              {teacher.qaWithinSLA}%
            </p>
          </div>
        </div>
      </Card>

      {/* Radar – skill distribution */}
      <Card className="border-teal-100 bg-white/80">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Skill distribution</h2>
        <p className="mt-0.5 text-xs text-slate-600">Scores across teaching dimensions (0–100).</p>
        <div className="mt-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={SKILL_RADAR_DATA}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#64748b" }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: "#64748b" }} />
              <Radar
                name="Score"
                dataKey="value"
                stroke="#0d9488"
                fill="#0d9488"
                fillOpacity={0.4}
                strokeWidth={2}
              />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid #99f6e4" }}
                formatter={(value) => [Number(value ?? 0), "Score"]}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
