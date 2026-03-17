"use client";

import Link from "next/link";
import * as React from "react";
import { ResponsiveContainer, RadialBar, RadialBarChart } from "recharts";

import { Card } from "../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const KPI_GAUGES = [
  {
    id: "enrollment",
    label: "Enrollment",
    target: 5000,
    actual: 4850,
    unit: "students",
    targetLabel: "Target",
    actualLabel: "Actual",
  },
  {
    id: "gpa",
    label: "GPA",
    target: 4.0,
    actual: 3.85,
    unit: "avg",
    targetLabel: "Target",
    actualLabel: "Actual",
  },
  {
    id: "budget",
    label: "Budget",
    target: 100,
    actual: 98,
    unit: "%",
    targetLabel: "Target",
    actualLabel: "Actual",
  },
];

function GaugeCard({
  label,
  target,
  actual,
  unit,
}: {
  label: string;
  target: number;
  actual: number;
  unit: string;
}) {
  const isPercent = unit === "%";
  const rawRatio = isPercent ? actual / target : actual / target;
  const displayValue = Math.min(100, Math.round(rawRatio * 100));
  const isOnTrack = rawRatio >= 0.9;
  const fill = isOnTrack ? "#10b981" : "#f59e0b";
  const data = [{ name: label, value: displayValue, fill }];

  return (
    <Card className="border-slate-200 bg-white">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">{label}</h3>
      <div className="mt-3 flex flex-col items-center gap-2">
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="60%"
              outerRadius="100%"
              data={data}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar background dataKey="value" cornerRadius={8} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Target</span>
            <span className="font-semibold text-slate-900">
              {target}
              {unit}
            </span>
          </div>
          <div className="mt-1 flex justify-between text-sm">
            <span className="text-slate-500">Actual</span>
            <span className="font-semibold text-slate-900">
              {actual}
              {unit}
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-500">
          {displayValue}% of target
          {!isOnTrack && " · Below 90%"}
        </p>
      </div>
    </Card>
  );
}

export default function KPIDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/director" className="text-sm font-medium text-slate-500 hover:text-slate-300">
          ← Deputy Director
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">KPI Dashboard</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Target vs. actual for Enrollment, GPA, and Budget.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {KPI_GAUGES.map((kpi) => (
          <GaugeCard
            key={kpi.id}
            label={kpi.label}
            target={kpi.target}
            actual={kpi.actual}
            unit={kpi.unit}
          />
        ))}
      </div>

      <Card className="border-slate-200 bg-slate-50/50">
        <h2 className="text-sm font-semibold text-slate-700">Quick links</h2>
        <div className="mt-2 flex flex-wrap gap-3">
          <Link
            href="/director/kpi/trends"
            className="text-sm font-medium text-slate-700 underline decoration-slate-400 hover:decoration-slate-600"
          >
            KPI Trends →
          </Link>
          <Link
            href="/director/kpi/alerts"
            className="text-sm font-medium text-slate-700 underline decoration-slate-400 hover:decoration-slate-600"
          >
            KPI Alerts →
          </Link>
        </div>
      </Card>
    </div>
  );
}
