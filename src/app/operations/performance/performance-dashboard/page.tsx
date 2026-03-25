"use client";

import Link from "next/link";
import { Gauge } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card } from "@/app/components/ui/Card";

const loadTimeData = [
  { t: "Mon", value: 1.4 },
  { t: "Tue", value: 1.7 },
  { t: "Wed", value: 2.3 },
  { t: "Thu", value: 1.9 },
  { t: "Fri", value: 1.6 },
  { t: "Sat", value: 1.5 },
  { t: "Sun", value: 1.8 },
];

const renderTimeData = [
  { t: "Mon", value: 0.9 },
  { t: "Tue", value: 1.2 },
  { t: "Wed", value: 2.1 },
  { t: "Thu", value: 1.4 },
  { t: "Fri", value: 1.1 },
  { t: "Sat", value: 1.0 },
  { t: "Sun", value: 1.3 },
];

export default function PerformanceDashboardPage() {
  return (
    <div className="space-y-5 bg-slate-50 text-slate-900">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Link href="/operations/performance" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Back to Performance Hub
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">Performance Dashboard</h1>
        </div>
        <Gauge className="h-6 w-6 text-indigo-400" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-slate-200 bg-white shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Dashboard Load Time Trend</h2>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={loadTimeData}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="t" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip formatter={(v) => [`${Number(v ?? 0).toFixed(1)}s`, "Load time"]} />
                <Line type="monotone" dataKey="value" stroke="#818cf8" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Chart Rendering Time Trend</h2>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={renderTimeData}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="t" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip formatter={(v) => [`${Number(v ?? 0).toFixed(1)}s`, "Render time"]} />
                <Line type="monotone" dataKey="value" stroke="#818cf8" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
