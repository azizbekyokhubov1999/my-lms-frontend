"use client";

import Link from "next/link";
import * as React from "react";
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { Card } from "../../../components/ui/Card";

/** Competency mastery: subject -> value (0–100). Hard vs Soft for one or more cohorts. */
const HARD_SKILLS = [
  { subject: "Technical knowledge", fullMark: 100, hard: 82, soft: 45 },
  { subject: "Analysis & problem-solving", fullMark: 100, hard: 78, soft: 70 },
  { subject: "Research methods", fullMark: 100, hard: 75, soft: 55 },
  { subject: "Numeracy", fullMark: 100, hard: 88, soft: 60 },
  { subject: "Writing & documentation", fullMark: 100, hard: 72, soft: 78 },
  { subject: "Tools & software", fullMark: 100, hard: 85, soft: 50 },
];

const SOFT_SKILLS = [
  { subject: "Communication", fullMark: 100, hard: 50, soft: 80 },
  { subject: "Teamwork", fullMark: 100, hard: 55, soft: 85 },
  { subject: "Leadership", fullMark: 100, hard: 48, soft: 72 },
  { subject: "Ethics & integrity", fullMark: 100, hard: 70, soft: 88 },
  { subject: "Adaptability", fullMark: 100, hard: 60, soft: 75 },
  { subject: "Time management", fullMark: 100, hard: 65, soft: 78 },
];

const COMBINED_OUTCOMES = [
  { subject: "Technical", fullMark: 100, hard: 82, soft: 52 },
  { subject: "Analysis", fullMark: 100, hard: 78, soft: 70 },
  { subject: "Research", fullMark: 100, hard: 75, soft: 55 },
  { subject: "Communication", fullMark: 100, hard: 50, soft: 80 },
  { subject: "Teamwork", fullMark: 100, hard: 55, soft: 85 },
  { subject: "Ethics", fullMark: 100, hard: 70, soft: 88 },
];

export default function LearningOutcomesPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/director/academic" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          ← Academic Performance
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Learning Outcomes</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Competency mastery from assessment data: Hard skills vs Soft skills.
        </p>
      </div>

      <Card className="border-slate-200 bg-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Hard skills vs Soft skills (combined view)
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Mastery level 0–100% by competency. Based on assessment data.
        </p>
        <div className="mt-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={COMBINED_OUTCOMES}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#64748b" }} />
              <Radar name="Hard skills" dataKey="hard" stroke="#0f766e" fill="#0f766e" fillOpacity={0.4} strokeWidth={2} />
              <Radar name="Soft skills" dataKey="soft" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} strokeWidth={2} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                formatter={(value: unknown) => [`${value}%`, undefined]}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="border-slate-200 bg-white">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            Hard skills mastery
          </h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={HARD_SKILLS}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#64748b" }} />
                <Radar name="Hard" dataKey="hard" stroke="#0f766e" fill="#0f766e" fillOpacity={0.4} strokeWidth={2} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }} formatter={(value: unknown) => [`${value}%`, "Mastery"]} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="border-slate-200 bg-white">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            Soft skills mastery
          </h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={SOFT_SKILLS}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#64748b" }} />
                <Radar name="Soft" dataKey="soft" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} strokeWidth={2} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }} formatter={(value: unknown) => [`${value}%`, "Mastery"]} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
