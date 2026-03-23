"use client";

import * as React from "react";
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

type DbPoint = {
  t: string;
  latencyMs: number;
  connections: number;
};

function makeTimeLabel(indexFromEnd: number) {
  const d = new Date(Date.now() - indexFromEnd * 1000);
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function DatabaseMonitoringPage() {
  const [seed, setSeed] = React.useState(0);
  const [points, setPoints] = React.useState<DbPoint[]>([]);

  const refresh = React.useCallback(() => {
    const nextSeed = seed + 1;
    const rand = (n: number) => {
      const x = Math.sin(nextSeed * 777 + n) * 0.5 + 0.5;
      return x;
    };

    const history: DbPoint[] = Array.from({ length: 30 }).map((_, idx) => {
      const fromEnd = 29 - idx;
      return {
        t: makeTimeLabel(fromEnd),
        latencyMs: Math.round(70 + rand(1 + idx) * 330),
        connections: Math.round(40 + rand(2 + idx) * 160),
      };
    });

    setPoints(history);
    setSeed(nextSeed);
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
          const x = Math.sin(nextSeed * 777 + n + prev.length) * 0.5 + 0.5;
          return x;
        };

        const next: DbPoint = {
          t: makeTimeLabel(0),
          latencyMs: Math.round(70 + rand(101) * 330),
          connections: Math.round(40 + rand(102) * 160),
        };
        return prev.length >= 30 ? [...prev.slice(1), next] : [...prev, next];
      });
    }, 2200);

    return () => window.clearInterval(id);
  }, [seed]);

  const getReport = React.useCallback(() => {
    const last = points[points.length - 1];
    return [
      "IT Operations - Database Monitoring",
      `GeneratedAt: ${new Date().toISOString()}`,
      `Latest: ${last ? `Latency=${last.latencyMs}ms, Connections=${last.connections}` : "N/A"}`,
      "",
      "Time,LatencyMs,Connections",
      ...points.map((p) => `${p.t},${p.latencyMs},${p.connections}`),
      "",
      "Notes: mock real-time UI data.",
    ].join("\n");
  }, [points]);

  const latest = points[points.length - 1];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">
            Database Monitoring
          </h1>
          <p className="mt-1 text-sm text-slate-100/70">
            Real-time query latency and connection pressure.
          </p>
        </div>

        <OperationsActionsBar
          onRefresh={refresh}
          getReport={getReport}
          reportFileBaseName="system-health-db"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-indigo-400/30 bg-slate-950">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-100/70">
            Query latency (p95)
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-100">
            {latest ? `${latest.latencyMs}ms` : "—"}
          </p>
        </Card>
        <Card className="border-indigo-400/30 bg-slate-950">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-100/70">
            Active connections
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-100">
            {latest ? `${latest.connections}` : "—"}
          </p>
        </Card>
      </div>

      <Card className="border-indigo-400/30 bg-slate-950">
        <p className="text-sm font-semibold text-slate-100">Telemetry (real-time)</p>
        <div className="mt-4 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(129,140,248,0.18)"
              />
              <XAxis
                dataKey="t"
                tick={{ fill: "rgba(226,232,240,0.65)", fontSize: 11 }}
              />
              <YAxis
                yAxisId="left"
                tick={{ fill: "rgba(226,232,240,0.65)", fontSize: 11 }}
                domain={[0, "auto"]}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: "rgba(226,232,240,0.65)", fontSize: 11 }}
                domain={[0, "auto"]}
              />
              <Tooltip
                contentStyle={{
                  background: "#0b1220",
                  border: "1px solid rgba(129,140,248,0.35)",
                  color: "#e2e8f0",
                }}
                labelStyle={{ color: "#e2e8f0" }}
                formatter={(value: any, name: any) => {
                  if (name === "latencyMs") return [`${value} ms`, "Latency"];
                  if (name === "connections")
                    return [`${value} conns`, "Connections"];
                  return [String(value), String(name)];
                }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="latencyMs"
                stroke="#818CF8"
                dot={false}
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="connections"
                stroke="#A78BFA"
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


