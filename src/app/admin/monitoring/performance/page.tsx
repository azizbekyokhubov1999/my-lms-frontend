"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../../components/ui/Card";

function LineChart({
  data,
  color,
  label,
  valueLabel,
  height = 120,
}: {
  data: number[];
  color: string;
  label: string;
  valueLabel: (v: number) => string;
  height?: number;
}) {
  const w = 100;
  const h = 100;
  const max = Math.max(...data, 1);
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1 || 1)) * w;
      const y = h - (v / max) * h;
      return `${x},${y}`;
    })
    .join(" ");
  const last = data[data.length - 1] ?? 0;
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-lg font-bold text-slate-900">{valueLabel(last)}</span>
      </div>
      <div className="mt-2" style={{ height }}>
        <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>
      </div>
    </Card>
  );
}

function useSimulatedSeries(length: number, initial: number, drift: () => number) {
  const [series, setSeries] = React.useState<number[]>(() =>
    Array.from({ length }, () => initial + (Math.random() - 0.5) * 20),
  );
  React.useEffect(() => {
    const id = setInterval(() => {
      setSeries((prev) => [...prev.slice(1), Math.max(0, prev[prev.length - 1]! + drift())]);
    }, 2000);
    return () => clearInterval(id);
  }, []);
  return series;
}

export default function PerformanceMetricsPage() {
  const responseTimes = useSimulatedSeries(24, 85, () => (Math.random() - 0.5) * 30);
  const concurrentUsers = useSimulatedSeries(24, 120, () => (Math.random() - 0.5) * 25);
  const successRate = useSimulatedSeries(24, 98, () => (Math.random() - 0.5) * 2);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/monitoring" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Monitoring
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Performance Metrics</h1>
          <p className="mt-1 text-sm text-slate-600">
            API response times, concurrent users, and request success rate over time.
          </p>
        </div>
        <nav className="flex gap-2">
          <Link href="/admin/monitoring" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">System Health</Link>
          <Link href="/admin/monitoring/performance" className="inline-flex h-9 items-center rounded-md bg-slate-100 px-3 text-sm font-medium text-slate-900">Performance</Link>
          <Link href="/admin/monitoring/storage" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">Storage</Link>
          <Link href="/admin/monitoring/alerts" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">Alerts</Link>
        </nav>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <LineChart
          data={responseTimes}
          color="#2563eb"
          label="API response time (ms)"
          valueLabel={(v) => `${Math.round(v)} ms`}
        />
        <LineChart
          data={concurrentUsers}
          color="#059669"
          label="Concurrent users"
          valueLabel={(v) => `${Math.round(v)}`}
        />
        <LineChart
          data={successRate}
          color="#7c3aed"
          label="Request success rate (%)"
          valueLabel={(v) => `${Math.round(v)}%`}
          height={120}
        />
      </div>
    </div>
  );
}
