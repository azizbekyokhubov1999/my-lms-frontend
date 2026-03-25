"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "@/app/components/ui/Card";

import { HubBackButton } from "../HubBackButton";

type TrendPoint = {
  t: string;
  storage: number | null;
  forecast: number | null;
};

function formatTime(d: Date) {
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ForecastingPage() {
  const [seed, setSeed] = React.useState(0);
  const [upgradeModalOpen, setUpgradeModalOpen] = React.useState(false);
  const [upgradePlanned, setUpgradePlanned] = React.useState(false);
  const [lastUpdated, setLastUpdated] = React.useState(new Date());

  const refresh = React.useCallback(() => {
    setLastUpdated(new Date());
    setSeed((s) => s + 1);
  }, []);

  const upgradeFactor = upgradePlanned ? 0.82 : 1;

  const chartData: TrendPoint[] = React.useMemo(() => {
    const points: TrendPoint[] = [];
    const now = new Date();
    const historyN = 24;
    const forecastN = 12;

    const rand = (n: number) => {
      const x = Math.sin((seed + 1) * 1000 + n) * 0.5 + 0.5;
      return x;
    };

    const base = 420 + rand(1) * 80;
    const growth = 6 + rand(2) * 3;

    for (let i = historyN - 1; i >= 0; i -= 1) {
      const d = new Date(now.getTime() - i * 3600_000);
      const idx = historyN - 1 - i;
      const noise = (rand(10 + idx) - 0.5) * 10;
      points.push({
        t: formatTime(d),
        storage: Math.max(0, Math.round(base + idx * growth + noise)),
        forecast: null,
      });
    }

    for (let i = 1; i <= forecastN; i += 1) {
      const d = new Date(now.getTime() + i * 3600_000);
      const noise = (rand(200 + i) - 0.5) * 10;
      const idx = historyN - 1 + i;
      const baselineFuture = base + idx * growth;
      const futureValue = baselineFuture - growth * i * (1 - upgradeFactor);
      const value = Math.round(futureValue + noise);
      points.push({
        t: formatTime(d),
        storage: null,
        forecast: Math.max(0, value),
      });
    }

    return points;
  }, [seed, upgradeFactor, upgradePlanned]);

  const getReport = React.useCallback(() => {
    const lines = [
      "IT Operations - Capacity Forecasting Report",
      `GeneratedAt: ${new Date().toISOString()}`,
      `LastUpdated: ${lastUpdated.toISOString()}`,
      `UpgradePlanned: ${upgradePlanned ? "Yes" : "No"}`,
      "",
      "Time,StorageGB,ForecastGB",
    ];

    for (const p of chartData) {
      lines.push(`${p.t},${p.storage ?? ""},${p.forecast ?? ""}`);
    }

    lines.push(
      "",
      "Notes: mock chart data for UI module. Replace with backend metrics when available.",
    );
    return lines.join("\n");
  }, [chartData, lastUpdated, upgradePlanned]);

  const downloadReport = React.useCallback(() => {
    const blob = new Blob([getReport()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `capacity-forecasting-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [getReport]);

  const handlePlanUpgrade = React.useCallback(() => {
    setUpgradePlanned(true);
    setUpgradeModalOpen(false);
  }, []);

  const exhaustionTimeline = React.useMemo(
    () => [
      {
        resource: "Disk (object store)",
        message: "Disk will be full in 45 days at current growth",
        days: 45,
        severity: "critical" as const,
      },
      {
        resource: "Memory headroom (api tier)",
        message: "RAM saturation expected in ~62 days without scale-out",
        days: 62,
        severity: "warn" as const,
      },
      {
        resource: "vCPU burst credits",
        message: "Burst pool depletes in ~18 days at peak traffic",
        days: 18,
        severity: "critical" as const,
      },
    ],
    [],
  );

  const utilizationForecast = React.useMemo(() => {
    const pts: { day: string; history: number | null; trend: number | null }[] = [];
    const now = lastUpdated.getTime();
    for (let i = -30; i <= 45; i += 3) {
      const d = new Date(now + i * 86400_000);
      const label = `${d.getMonth() + 1}/${d.getDate()}`;
      const base = 58 + i * 0.55 + Math.sin((seed + i) * 0.08) * 4;
      const capped = Math.min(100, Math.max(0, base));
      if (i <= 0) {
        pts.push({ day: label, history: Math.round(capped * 10) / 10, trend: null });
      } else {
        pts.push({ day: label, history: null, trend: Math.round(capped * 10) / 10 });
      }
    }
    return pts;
  }, [seed, lastUpdated]);

  return (
    <div className="space-y-5 bg-slate-50 text-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <HubBackButton />
        <Sparkles className="h-6 w-6 text-indigo-400" aria-hidden />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Predictive forecasting</h1>
          <p className="mt-1 text-sm text-slate-600">
            Model-driven storage trajectory with confidence-style forecast band (demo data).
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Last updated: {lastUpdated.toLocaleString()}
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={refresh}
            className="rounded-xl border-2 border-indigo-400 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-400 shadow-sm transition-colors hover:bg-indigo-50"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={downloadReport}
            className="rounded-xl border-2 border-indigo-400 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-400 shadow-sm transition-colors hover:bg-indigo-50"
          >
            Export report
          </button>
          <button
            type="button"
            onClick={() => setUpgradeModalOpen(true)}
            className="rounded-xl bg-indigo-400 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
          >
            Plan upgrade
          </button>
        </div>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Resource exhaustion timeline</h2>
        <p className="mt-1 text-xs text-slate-600">
          Model outputs (demo) — days until policy breach if trends continue unchanged.
        </p>
        <ul className="mt-4 grid gap-3 md:grid-cols-3">
          {exhaustionTimeline.map((row) => (
            <li
              key={row.resource}
              className={`rounded-xl border p-4 ${
                row.severity === "critical"
                  ? "border-rose-500/40 bg-rose-50"
                  : "border-amber-500/35 bg-amber-50/80"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                {row.resource}
              </p>
              <p className="mt-2 text-lg font-bold text-slate-900">{row.days} days</p>
              <p className="mt-2 text-sm text-slate-700">{row.message}</p>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Utilization trend to limit (%)</p>
            <p className="mt-1 text-xs text-slate-600">
              History (solid) vs. projected (dashed). Rose band at 80% policy.
            </p>
          </div>
        </div>
        <div className="mt-4 h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={utilizationForecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 11 }} width={36} />
              <ReferenceLine
                y={80}
                stroke="#f43f5e"
                strokeDasharray="4 4"
                label={{ value: "80%", fill: "#f43f5e", fontSize: 11 }}
              />
              <ReferenceLine
                y={100}
                stroke="#94a3b8"
                strokeDasharray="2 2"
                label={{ value: "100%", fill: "#64748b", fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  color: "#0f172a",
                  borderRadius: "0.5rem",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="history"
                name="Observed"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="trend"
                name="Forecast"
                stroke="#818cf8"
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={false}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Infrastructure trend (GB)</p>
            <p className="mt-1 text-xs text-slate-600">
              Solid line = history, dashed line = forecast.
            </p>
          </div>
          <div className="text-xs text-slate-600">
            Upgrade:{" "}
            <span className="font-semibold text-slate-900">
              {upgradePlanned ? "Planned" : "Not planned"}
            </span>
          </div>
        </div>

        <div className="mt-4 h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="t" tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} domain={[0, "auto"]} />
              <Tooltip
                contentStyle={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  color: "#0f172a",
                  borderRadius: "0.5rem",
                }}
                formatter={(value, name) => {
                  const v = value ?? "";
                  const n = String(name);
                  if (n === "storage") return [`${v} GB`, "History"];
                  if (n === "forecast") return [`${v} GB`, "Forecast"];
                  return [String(v), n];
                }}
              />
              <Line
                type="monotone"
                dataKey="storage"
                stroke="#818cf8"
                dot={false}
                strokeWidth={2}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#a78bfa"
                dot={false}
                strokeWidth={2}
                strokeDasharray="6 6"
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {upgradeModalOpen ? (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
            <h2 className="text-lg font-semibold text-slate-900">Confirm plan upgrade</h2>
            <p className="mt-2 text-sm text-slate-600">
              This adjusts the forecast curve to reflect planned capacity expansion.
            </p>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setUpgradeModalOpen(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePlanUpgrade}
                className="rounded-xl bg-indigo-400 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
              >
                Apply upgrade plan
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
