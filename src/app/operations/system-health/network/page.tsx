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

type NetworkPoint = {
  t: string;
  packetLossPct: number;
  throughputMbps: number;
};

function makeTimeLabel(indexFromEnd: number) {
  const d = new Date(Date.now() - indexFromEnd * 1000);
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function NetworkMonitoringPage() {
  const [seed, setSeed] = React.useState(0);
  const [points, setPoints] = React.useState<NetworkPoint[]>([]);

  const refresh = React.useCallback(() => {
    const nextSeed = seed + 1;
    const rand = (n: number) => {
      const x = Math.sin(nextSeed * 666 + n) * 0.5 + 0.5;
      return x;
    };

    const history: NetworkPoint[] = Array.from({ length: 30 }).map((_, idx) => {
      const fromEnd = 29 - idx;
      return {
        t: makeTimeLabel(fromEnd),
        packetLossPct: Number((0.02 + rand(1 + idx) * 0.25).toFixed(2)),
        throughputMbps: Math.round(80 + rand(2 + idx) * 620),
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
          const x = Math.sin(nextSeed * 666 + n + prev.length) * 0.5 + 0.5;
          return x;
        };

        const next: NetworkPoint = {
          t: makeTimeLabel(0),
          packetLossPct: Number((0.02 + rand(101) * 0.25).toFixed(2)),
          throughputMbps: Math.round(80 + rand(102) * 620),
        };

        return prev.length >= 30 ? [...prev.slice(1), next] : [...prev, next];
      });
    }, 2100);

    return () => window.clearInterval(id);
  }, [seed]);

  const getReport = React.useCallback(() => {
    const last = points[points.length - 1];
    return [
      "IT Operations - Network Monitoring",
      `GeneratedAt: ${new Date().toISOString()}`,
      `Latest: ${
        last
          ? `Loss=${last.packetLossPct}%, Throughput=${last.throughputMbps}Mbps`
          : "N/A"
      }`,
      "",
      "Time,PacketLossPct,ThroughputMbps",
      ...points.map((p) => `${p.t},${p.packetLossPct},${p.throughputMbps}`),
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
            Network Monitoring
          </h1>
          <p className="mt-1 text-sm text-slate-100/70">
            Real-time packet loss and throughput trends.
          </p>
        </div>

        <OperationsActionsBar
          onRefresh={refresh}
          getReport={getReport}
          reportFileBaseName="system-health-network"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-indigo-400/30 bg-slate-950">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-100/70">
            Packet loss
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-100">
            {latest ? `${latest.packetLossPct}%` : "—"}
          </p>
        </Card>
        <Card className="border-indigo-400/30 bg-slate-950">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-100/70">
            Throughput
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-100">
            {latest ? `${latest.throughputMbps} Mbps` : "—"}
          </p>
        </Card>
      </div>

      <Card className="border-indigo-400/30 bg-slate-950">
        <p className="text-sm font-semibold text-slate-100">
          Network telemetry (real-time)
        </p>
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
                  if (name === "packetLossPct") return [`${value}%`, "Loss"];
                  if (name === "throughputMbps")
                    return [`${value} Mbps`, "Throughput"];
                  return [String(value), String(name)];
                }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="packetLossPct"
                stroke="#818CF8"
                dot={false}
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="throughputMbps"
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


