"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";

const DEFAULT_STUDENTS_PER_TEACHER = 25;
const DEFAULT_CURRENT_FTE = 96;

export default function ResourcePlanningPage() {
  const [expectedIntake, setExpectedIntake] = React.useState("");
  const [studentsPerTeacher, setStudentsPerTeacher] = React.useState(String(DEFAULT_STUDENTS_PER_TEACHER));
  const [currentFTE, setCurrentFTE] = React.useState(String(DEFAULT_CURRENT_FTE));

  const intake = React.useMemo(() => parseInt(expectedIntake, 10) || 0, [expectedIntake]);
  const ratio = React.useMemo(() => Math.max(1, parseInt(studentsPerTeacher, 10) || DEFAULT_STUDENTS_PER_TEACHER), [studentsPerTeacher]);
  const current = React.useMemo(() => Math.max(0, parseInt(currentFTE, 10) || DEFAULT_CURRENT_FTE), [currentFTE]);

  const requiredFTE = React.useMemo(() => (intake > 0 ? Math.ceil(intake / ratio) : 0), [intake, ratio]);
  const gap = React.useMemo(() => (requiredFTE > 0 ? Math.max(0, requiredFTE - current) : 0), [requiredFTE, current]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/resources/reports" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Reports
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Resource planning</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Based on expected student intake, forecast how many teachers are needed and the hiring gap.
        </p>
      </div>

      <Card className="border-teal-100">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Forecasting inputs</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input
            type="number"
            label="Expected student intake"
            placeholder="e.g. 2400"
            min={0}
            value={expectedIntake}
            onChange={(e) => setExpectedIntake(e.target.value)}
            helperText="Total new students to plan for"
          />
          <Input
            type="number"
            label="Students per teacher (ratio)"
            min={1}
            value={studentsPerTeacher}
            onChange={(e) => setStudentsPerTeacher(e.target.value)}
            helperText="Target ratio for capacity"
          />
          <Input
            type="number"
            label="Current FTE (teachers)"
            min={0}
            value={currentFTE}
            onChange={(e) => setCurrentFTE(e.target.value)}
            helperText="Existing full-time equivalent"
          />
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Forecast result</h2>
        <p className="mt-0.5 text-xs text-slate-600">Required teachers = ceil(Intake ÷ Ratio). Gap = Required − Current.</p>
        <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Required FTE</dt>
            <dd className="mt-1 text-2xl font-semibold text-slate-900">{intake > 0 ? requiredFTE : "—"}</dd>
            {intake > 0 && (
              <p className="mt-0.5 text-xs text-slate-600">
                {intake} ÷ {ratio} = {requiredFTE}
              </p>
            )}
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Current FTE</dt>
            <dd className="mt-1 text-2xl font-semibold text-slate-900">{current}</dd>
          </div>
          <div className="rounded-lg border-2 border-teal-200 bg-teal-50/50 p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-teal-700">Gap (to hire)</dt>
            <dd className="mt-1 text-2xl font-semibold text-teal-900">{intake > 0 ? gap : "—"}</dd>
            {intake > 0 && gap > 0 && (
              <p className="mt-0.5 text-xs text-teal-700">
                {requiredFTE} − {current} = {gap} more teacher(s) needed
              </p>
            )}
            {intake > 0 && gap === 0 && (
              <p className="mt-0.5 text-xs text-teal-700">No additional hiring required for this intake.</p>
            )}
          </div>
        </dl>
        {intake > 0 && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-teal-100 bg-teal-50/30 p-3 text-sm text-teal-800">
            <span className="font-medium">Summary:</span>
            <span>
              For {intake} students at {ratio} students/teacher, you need {requiredFTE} FTE. Current staff: {current}.{" "}
              {gap > 0 ? `Hire ${gap} more teacher(s).` : "No gap."}
            </span>
          </div>
        )}
      </Card>
    </div>
  );
}
