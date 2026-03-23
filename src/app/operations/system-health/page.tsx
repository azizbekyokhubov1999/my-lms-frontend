"use client";

import * as React from "react";
import {
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";

import { Card } from "../../components/ui/Card";

import OperationsActionsBar from "../_components/OperationsActionsBar";

function GaugeCard({
  title,
  value,
  color = "#818CF8",
  description,
}: {
  title: string;
  value: number;
  color?: string;
  description: string;
}) {
  const chartData = React.useMemo(() => [{ value }], [value]);

  return (
    <Card className="border-indigo-400/30 bg-slate-950">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-100/70">
            {title}
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-slate-100">
              {Math.round(value)}%
            </span>
            <span className="text-sm text-slate-100/60">{description}</span>
          </div>
        </div>

        <div className="h-24 w-24">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              data={chartData}
              innerRadius={30}
              outerRadius={42}
              startAngle={180}
              endAngle={0}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} />
              <RadialBar
                dataKey="value"
                cornerRadius={10}
                fill={color}
                background={{ fill: "rgba(129,140,248,0.15)" }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}

function formatISOTime(d: Date) {
  return d.toISOString().replace(/[:]/g, "-").replace(/\..+$/, "");
}

export default function SystemHealthPage() {
  const [seed, setSeed] = React.useState(0);
  const [uptimePct, setUptimePct] = React.useState(99.9);
  const [cpuPct, setCpuPct] = React.useState(42);
  const [ramPct, setRamPct] = React.useState(58);
  const [diskPct, setDiskPct] = React.useState(67);
  const [lastUpdated, setLastUpdated] = React.useState(new Date());

  const refresh = React.useCallback(() => {
    const now = new Date();
    // Deterministic-ish variation per refresh.
    const jitter = (n: number) => {
      const x = Math.sin((seed + 1) * 999 + n) * 0.5 + 0.5;
      return x;
    };

    setUptimePct(Number((99.5 + jitter(1) * 0.5).toFixed(2)));
    setCpuPct(Number((20 + jitter(2) * 70).toFixed(0)));
    setRamPct(Number((25 + jitter(3) * 60).toFixed(0)));
    setDiskPct(Number((40 + jitter(4) * 50).toFixed(0)));
    setLastUpdated(now);
    setSeed((s) => s + 1);
  }, [seed]);

  React.useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getReport = React.useCallback(() => {
    return [
      "IT Operations - System Health Snapshot",
      `GeneratedAt: ${lastUpdated.toISOString()}`,
      `Server Uptime (%): ${uptimePct}`,
      `CPU Usage (%): ${cpuPct}`,
      `RAM Usage (%): ${ramPct}`,
      `Disk Usage (%): ${diskPct}`,
      "",
      "Notes: This is mock data for the current UI module.",
    ].join("\n");
  }, [cpuPct, diskPct, lastUpdated, ramPct, uptimePct]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">System Health</h1>
          <p className="mt-1 text-sm text-slate-100/70">
            Server uptime, resource saturation, and operational readiness.
          </p>
          <p className="mt-2 text-xs text-slate-100/50">
            Last updated: {formatISOTime(lastUpdated)}
          </p>
        </div>

        <OperationsActionsBar
          onRefresh={refresh}
          getReport={getReport}
          reportFileBaseName="system-health"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <GaugeCard
          title="Server Uptime"
          value={uptimePct}
          description={uptimePct >= 99.9 ? "Stable" : "Monitor"}
        />
        <GaugeCard title="CPU" value={cpuPct} description="Compute load" />
        <GaugeCard title="RAM" value={ramPct} description="Memory usage" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <GaugeCard title="Disk" value={diskPct} description="Storage utilization" />
        <Card className="border-indigo-400/30 bg-slate-950">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-100/70">
            Quick checklist
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-100/80">
            <li>✓ Web gateway responding</li>
            <li>✓ Background workers healthy</li>
            <li>✓ Database connectivity verified</li>
            <li>✓ Backup jobs within SLA</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

