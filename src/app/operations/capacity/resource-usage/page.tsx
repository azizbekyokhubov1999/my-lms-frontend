"use client";

import * as React from "react";
import { Cpu } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "@/app/components/ui/Card";

import { HubBackButton } from "../HubBackButton";

const ROSE = "#f43f5e";
const EMERALD = "#10b981";
const INDIGO = "#818cf8";

function buildSeries(seed: number, base: number, volatility: number) {
  const out: { t: string; v: number }[] = [];
  for (let i = 23; i >= 0; i -= 1) {
    const d = new Date(Date.now() - i * 5 * 60_000);
    const noise = Math.sin(seed * 0.7 + i * 0.4) * volatility;
    const v = Math.min(100, Math.max(0, Math.round(base + noise)));
    out.push({
      t: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      v,
    });
  }
  return out;
}

const TOP_SERVICES = [
  { name: "lms-api", share: 28, cpu: 86, ram: 74, disk: 44 },
  { name: "video-transcode", share: 19, cpu: 72, ram: 81, disk: 52 },
  { name: "session-cache", share: 15, cpu: 54, ram: 88, disk: 31 },
  { name: "search-indexer", share: 12, cpu: 63, ram: 49, disk: 66 },
  { name: "notifications-worker", share: 9, cpu: 41, ram: 38, disk: 28 },
];

function utilizationTone(pct: number) {
  return pct > 80 ? ROSE : EMERALD;
}

export default function ResourceUsagePage() {
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  const cpuSeries = React.useMemo(() => buildSeries(tick, 42, 8), [tick]);
  const ramSeries = React.useMemo(() => buildSeries(tick + 1, 64, 10), [tick]);
  const diskSeries = React.useMemo(() => buildSeries(tick + 2, 52, 6), [tick]);

  return (
    <div className="space-y-5 bg-slate-50 text-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <HubBackButton />
        <Cpu className="h-6 w-6 text-indigo-400" aria-hidden />
      </div>

      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Resource usage</h1>
        <p className="mt-1 text-sm text-slate-600">
          Live utilization streams (5-min resolution, demo). Above 80% is flagged in rose.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">CPU</p>
            <span className="text-xs font-medium text-emerald-500">Rolling avg (live)</span>
          </div>
          <div className="mt-2 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={cpuSeries}>
                <defs>
                  <linearGradient id="cpuFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={INDIGO} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={INDIGO} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="t" tick={{ fill: "#64748b", fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} width={32} />
                <Tooltip
                  contentStyle={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.5rem",
                    fontSize: "12px",
                  }}
                  formatter={(value) => [`${Number(value ?? 0)}%`, "CPU"]}
                />
                <Area type="monotone" dataKey="v" stroke={INDIGO} fill="url(#cpuFill)" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">RAM</p>
            <span className="text-xs font-medium text-emerald-500">Cluster aggregate</span>
          </div>
          <div className="mt-2 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ramSeries}>
                <defs>
                  <linearGradient id="ramFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={INDIGO} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={INDIGO} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="t" tick={{ fill: "#64748b", fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} width={32} />
                <Tooltip
                  contentStyle={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.5rem",
                    fontSize: "12px",
                  }}
                  formatter={(value) => [`${Number(value ?? 0)}%`, "Memory"]}
                />
                <Area type="monotone" dataKey="v" stroke={INDIGO} fill="url(#ramFill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Disk (hot tier)</p>
            <span className="text-xs font-medium text-emerald-500">SSD pool</span>
          </div>
          <div className="mt-2 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={diskSeries}>
                <defs>
                  <linearGradient id="diskFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={INDIGO} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={INDIGO} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="t" tick={{ fill: "#64748b", fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} width={32} />
                <Tooltip
                  contentStyle={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.5rem",
                    fontSize: "12px",
                  }}
                  formatter={(value) => [`${Number(value ?? 0)}%`, "Disk used"]}
                />
                <Area type="monotone" dataKey="v" stroke={INDIGO} fill="url(#diskFill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Top resource-consuming services</h2>
        <p className="mt-1 text-xs text-slate-600">
          Share of pooled compute; per-service peak utilization (last hour).
        </p>
        <ul className="mt-4 space-y-4">
          {TOP_SERVICES.map((s) => {
            const hot = Math.max(s.cpu, s.ram, s.disk);
            return (
              <li key={s.name} className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-mono text-sm font-semibold text-slate-900">{s.name}</p>
                    <p className="text-xs text-slate-600">Pool share: {s.share}%</p>
                  </div>
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                      hot > 80
                        ? "border-rose-500/40 bg-rose-50 text-rose-600"
                        : "border-emerald-500/40 bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    Peak {hot}%
                  </span>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {[
                    { label: "CPU", v: s.cpu },
                    { label: "RAM", v: s.ram },
                    { label: "Disk", v: s.disk },
                  ].map((m) => (
                    <div key={m.label}>
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>{m.label}</span>
                        <span style={{ color: utilizationTone(m.v) }} className="font-semibold">
                          {m.v}%
                        </span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${m.v}%`,
                            backgroundColor: m.v > 80 ? ROSE : EMERALD,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
