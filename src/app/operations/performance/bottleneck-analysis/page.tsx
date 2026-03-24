"use client";

import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card } from "@/app/components/ui/Card";

const spikeData = [
  { t: "09:00", cpu: 48, memory: 55, latency: 1.1 },
  { t: "10:00", cpu: 62, memory: 60, latency: 1.4 },
  { t: "11:00", cpu: 78, memory: 69, latency: 2.3 },
  { t: "12:00", cpu: 84, memory: 74, latency: 2.7 },
  { t: "13:00", cpu: 66, memory: 63, latency: 1.8 },
  { t: "14:00", cpu: 53, memory: 58, latency: 1.3 },
];

export default function BottleneckAnalysisPage() {
  return (
    <div className="space-y-5 bg-slate-50 text-slate-900">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Link href="/operations/performance" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Back to Performance Hub
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">Bottleneck Analysis</h1>
        </div>
        <BarChart3 className="h-6 w-6 text-indigo-400" />
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">CPU vs Memory vs Request Latency</h2>
        <p className="mt-1 text-sm text-slate-600">Correlation view to identify potential bottlenecks.</p>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={spikeData}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis dataKey="t" stroke="#64748b" />
              <YAxis yAxisId="left" stroke="#64748b" />
              <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="cpu" stroke="#818cf8" name="CPU %" strokeWidth={2} dot={false} />
              <Line yAxisId="left" type="monotone" dataKey="memory" stroke="#6366f1" name="Memory %" strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="latency" stroke="#f43f5e" name="Latency (s)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
