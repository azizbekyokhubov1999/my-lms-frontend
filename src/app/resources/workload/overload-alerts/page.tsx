"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../../components/ui/Card";

interface OverloadRow {
  id: string;
  name: string;
  faculty: string;
  lectureHours: number;
  seminarHours: number;
  students: number;
}

const MOCK_OVERLOADS: OverloadRow[] = [
  {
    id: "t1",
    name: "Dr. Nina Kozlova",
    faculty: "Engineering",
    lectureHours: 14,
    seminarHours: 10,
    students: 220,
  },
  {
    id: "t2",
    name: "Prof. Timur Akhmetov",
    faculty: "Business",
    lectureHours: 16,
    seminarHours: 8,
    students: 210,
  },
];

function calcLoadScore(r: OverloadRow): number {
  const hours = r.lectureHours + r.seminarHours;
  return hours * 1.5 + r.students * 0.1;
}

export default function OverloadAlertsPage() {
  const rows = React.useMemo(
    () =>
      MOCK_OVERLOADS.map((r) => ({
        ...r,
        totalHours: r.lectureHours + r.seminarHours,
        loadScore: calcLoadScore(r),
      })),
    [],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/resources/workload"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Workload dashboard
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">
            Overload alerts
          </h1>
          <p className="mt-0.5 text-sm text-slate-600">
            Critical situations where teachers exceed safe workload thresholds
            (students &gt; 200 or lecture hours &gt; 22 h/week).
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {rows.map((r) => (
          <Card
            key={r.id}
            className="border-rose-200 bg-rose-100/80"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {r.name}
                </p>
                <p className="text-xs text-slate-600">{r.faculty}</p>
              </div>
              <span className="inline-flex rounded-full bg-rose-500 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
                Critical
              </span>
            </div>

            <dl className="mt-3 space-y-1 text-xs text-slate-700">
              <div className="flex justify-between gap-2">
                <dt>Lecture hours</dt>
                <dd className="font-medium">{r.lectureHours.toFixed(1)} h</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>Seminar hours</dt>
                <dd className="font-medium">{r.seminarHours.toFixed(1)} h</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>Total hours</dt>
                <dd className="font-medium">{r.totalHours.toFixed(1)} h</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>Assigned students</dt>
                <dd className="font-medium">{r.students}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>Load score</dt>
                <dd className="font-semibold text-rose-700">
                  {r.loadScore.toFixed(1)}
                </dd>
              </div>
            </dl>

            <div className="mt-3 flex items-center justify-between gap-2">
              <div className="h-2 w-full rounded-full bg-rose-200">
                <div
                  className="h-2 rounded-full bg-rose-500"
                  style={{
                    width: `${Math.min((r.loadScore / 100) * 100, 100)}%`,
                  }}
                />
              </div>
              <span className="ml-2 text-[11px] text-rose-800">
                High load
              </span>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Link
                href="/resources/assignments/assistants"
                className="rounded-md bg-rose-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-rose-700"
              >
                Act – Assign assistant
              </Link>
              <Link
                href="/resources/assignments/co-teaching"
                className="rounded-md border border-rose-400 bg-white px-3 py-1.5 text-xs font-medium text-rose-700 transition-colors hover:bg-rose-50"
              >
                Act – Plan co-teaching
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

