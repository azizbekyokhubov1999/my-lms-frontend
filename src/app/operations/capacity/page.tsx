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

import { Card } from "../../components/ui/Card";
import OperationsActionsBar from "../_components/OperationsActionsBar";

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

    // Base storage (GB) and growth rate.
    const base = 420 + rand(1) * 80;
    const growth = 6 + rand(2) * 3; // GB per point

    // Past
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

    // Future
    for (let i = 1; i <= forecastN; i += 1) {
      const d = new Date(now.getTime() + i * 3600_000);
      const noise = (rand(200 + i) - 0.5) * 10;
      const idx = historyN - 1 + i;
      const baselineFuture = base + idx * growth;
      // If an upgrade is planned, we assume future growth slows down.
      const futureValue =
        baselineFuture - growth * i * (1 - upgradeFactor);
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

  const handlePlanUpgrade = React.useCallback(() => {
    setUpgradePlanned(true);
    setUpgradeModalOpen(false);
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">
            Capacity Planning (Forecasting)
          </h1>
          <p className="mt-1 text-sm text-slate-100/70">
            Infrastructure growth trend with forecast (and optional upgrade plan).
          </p>
          <p className="mt-2 text-xs text-slate-100/50">
            Last updated: {lastUpdated.toLocaleString()}
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <OperationsActionsBar
            onRefresh={refresh}
            getReport={getReport}
            reportFileBaseName="capacity-forecasting"
          />

          <button
            type="button"
            onClick={() => setUpgradeModalOpen(true)}
            className="rounded-xl border border-indigo-400/60 bg-indigo-400/10 px-4 py-3 text-sm font-medium text-slate-100 transition-colors hover:bg-indigo-400/20"
          >
            Plan Upgrade
          </button>
        </div>
      </div>

      <Card className="border-indigo-400/30 bg-slate-950">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-100">
              Infrastructure Trend (GB)
            </p>
            <p className="mt-1 text-xs text-slate-100/60">
              Solid line = history, dashed line = forecast.
            </p>
          </div>
          <div className="text-xs text-slate-100/60">
            Upgrade:{" "}
            <span className="text-slate-100">
              {upgradePlanned ? "Planned" : "Not planned"}
            </span>
          </div>
        </div>

        <div className="mt-4 h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(129,140,248,0.18)"
              />
              <XAxis
                dataKey="t"
                tick={{ fill: "rgba(226,232,240,0.65)", fontSize: 11 }}
              />
              <YAxis
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
                  if (name === "storage") return [`${value} GB`, "History"];
                  if (name === "forecast") return [`${value} GB`, "Forecast"];
                  return [String(value), String(name)];
                }}
              />
              <Line
                type="monotone"
                dataKey="storage"
                stroke="#818CF8"
                dot={false}
                strokeWidth={2}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#A78BFA"
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
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-indigo-400/40 bg-slate-950 p-5">
            <h2 className="text-lg font-semibold text-slate-100">
              Confirm Plan Upgrade
            </h2>
            <p className="mt-2 text-sm text-slate-100/70">
              This will adjust the forecast growth curve to reflect planned capacity expansion.
            </p>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setUpgradeModalOpen(false)}
                className="rounded-xl border border-indigo-400/30 bg-slate-900/30 px-4 py-3 text-sm font-medium text-slate-100 transition-colors hover:bg-indigo-400/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePlanUpgrade}
                className="rounded-xl border border-indigo-400/60 bg-indigo-400/10 px-4 py-3 text-sm font-medium text-slate-100 transition-colors hover:bg-indigo-400/20"
              >
                Apply Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}


