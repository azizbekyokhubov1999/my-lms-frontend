"use client";

import * as React from "react";
import Link from "next/link";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "../../../components/ui/Card";
import OperationsActionsBar from "../../_components/OperationsActionsBar";

type Point = {
  t: string;
  cpu: number;
  ram: number;
  disk: number;
};

function makeTimeLabel(indexFromEnd: number) {
  const d = new Date(Date.now() - indexFromEnd * 1000);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function ServerMonitoringPage() {
  const [seed, setSeed] = React.useState(0);
  const [points, setPoints] = React.useState<Point[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const refresh = React.useCallback(() => {
    setRefreshing(true);
    const nextSeed = seed + 1;
    const rand = (n: number) => {
      const x = Math.sin(nextSeed * 999 + n) * 0.5 + 0.5;
      return x;
    };

    const history: Point[] = Array.from({ length: 30 }).map((_, idx) => {
      const fromEnd = 29 - idx;
      return {
        t: makeTimeLabel(fromEnd),
        cpu: Math.round(15 + rand(1 + idx) * 80),
        ram: Math.round(20 + rand(2 + idx) * 70),
        disk: Math.round(5 + rand(3 + idx) * 90),
      };
    });

    setPoints(history);
    setSeed(nextSeed);
    setRefreshing(false);
  }, [seed]);

  React.useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setPoints((prev) => {
        const nextSeed = seed + 1;
        const rand = (n: number) => {
          const x = Math.sin(nextSeed * 999 + n + prev.length) * 0.5 + 0.5;
          return x;
        };

        const last = prev[prev.length - 1];
        const t = makeTimeLabel(0);
        const next: Point = {
          t,
          cpu: Math.round(15 + rand(101) * 80),
          ram: Math.round(20 + rand(102) * 70),
          disk: Math.round(5 + rand(103) * 90),
        };
        const merged = prev.length >= 30 ? [...prev.slice(1), next] : [...prev, next];
        return merged;
      });
    }, 2000);

    return () => window.clearInterval(id);
  }, [seed]);

  const getReport = React.useCallback(() => {
    const last = points[points.length - 1];
    return [
      "IT Operations - Server Monitoring",
      `GeneratedAt: ${new Date().toISOString()}`,
      `Latest: ${last ? `CPU=${last.cpu}%, RAM=${last.ram}%, Disk=${last.disk}%` : "N/A"}`,
      "",
      "Time,CPU,RAM,Disk",
      ...points.map((p) => `${p.t},${p.cpu},${p.ram},${p.disk}`),
      "",
      "Notes: mock real-time UI data.",
    ].join("\n");
  }, [points]);

  const latest = points[points.length - 1];

  return (
    <div className="space-y-5">
      <div>
        <Link
          href="/operations/system-health"
          className="inline-flex items-center rounded-lg border border-indigo-400/60 bg-indigo-400/10 px-3 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-indigo-400/20"
        >
          Back to System Overview
        </Link>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Server Monitoring</h1>
          <p className="mt-1 text-sm text-slate-100/70">
            Real-time CPU/RAM/Disk utilization across the last ~60 seconds.
          </p>
        </div>

        <OperationsActionsBar
          onRefresh={refresh}
          getReport={getReport}
          reportFileBaseName="system-health-server"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-indigo-400/30 bg-slate-950">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-100/70">
            CPU
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-100">
            {latest ? `${latest.cpu}%` : "—"}
          </p>
        </Card>
        <Card className="border-indigo-400/30 bg-slate-950">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-100/70">
            RAM
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-100">
            {latest ? `${latest.ram}%` : "—"}
          </p>
        </Card>
        <Card className="border-indigo-400/30 bg-slate-950">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-100/70">
            Disk
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-100">
            {latest ? `${latest.disk}%` : "—"}
          </p>
        </Card>
      </div>

      <Card className="border-indigo-400/30 bg-slate-950">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-100">
            Utilization (real-time)
          </p>
          <p className="text-xs text-slate-100/60">
            {refreshing ? "Refreshing..." : "Auto-updating"}
          </p>
        </div>

        <div className="mt-4 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(129,140,248,0.18)" />
              <XAxis dataKey="t" tick={{ fill: "rgba(226,232,240,0.65)", fontSize: 11 }} />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "rgba(226,232,240,0.65)", fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  background: "#0b1220",
                  border: "1px solid rgba(129,140,248,0.35)",
                  color: "#e2e8f0",
                }}
                labelStyle={{ color: "#e2e8f0" }}
                formatter={(value: any) => `${value}%`}
              />
              <Line
                type="monotone"
                dataKey="cpu"
                stroke="#818CF8"
                dot={false}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="ram"
                stroke="#A78BFA"
                dot={false}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="disk"
                stroke="#22C55E"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}


