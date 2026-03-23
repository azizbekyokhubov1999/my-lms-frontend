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

type Impact = "Low" | "Medium" | "High";

type SlowQuery = {
  id: string;
  queryName: string;
  durationMs: number;
  rowsScanned: number;
  impact: Impact;
  status: "Ready" | "Optimizing" | "Optimized";
};

type CachePoint = {
  t: string;
  redis: number;
  cdn: number;
};

function formatPct(n: number) {
  return `${Math.round(n)}%`;
}

function impactPill(impact: Impact) {
  if (impact === "High")
    return "border-amber-500/40 bg-amber-500/10 text-amber-100";
  if (impact === "Medium")
    return "border-indigo-400/30 bg-indigo-400/10 text-indigo-100";
  return "border-emerald-400/30 bg-emerald-400/10 text-emerald-100";
}

function randomId(prefix: string) {
  return `${prefix}-${Math.random().toString(16).slice(2, 9)}`;
}

export default function QueryPerformancePage() {
  const [queries, setQueries] = React.useState<SlowQuery[]>([
    {
      id: "q-1",
      queryName: "student_attendance_report",
      durationMs: 1420,
      rowsScanned: 185_220,
      impact: "High",
      status: "Ready",
    },
    {
      id: "q-2",
      queryName: "course_enrollments_lookup",
      durationMs: 910,
      rowsScanned: 62_410,
      impact: "Medium",
      status: "Ready",
    },
    {
      id: "q-3",
      queryName: "grades_summary_by_period",
      durationMs: 610,
      rowsScanned: 29_884,
      impact: "Low",
      status: "Ready",
    },
    {
      id: "q-4",
      queryName: "learning_outcomes_index",
      durationMs: 780,
      rowsScanned: 41_305,
      impact: "Medium",
      status: "Ready",
    },
  ]);

  const optimizeQuery = React.useCallback(async (id: string) => {
    setQueries((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: "Optimizing" } : q)),
    );

    await new Promise((r) => window.setTimeout(r, 1200));

    setQueries((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q;
        const durationSaved = Math.round(q.durationMs * (0.35 + Math.random() * 0.2));
        const rowsSaved = Math.round(q.rowsScanned * (0.2 + Math.random() * 0.35));
        return {
          ...q,
          status: "Optimized",
          durationMs: Math.max(60, q.durationMs - durationSaved),
          rowsScanned: Math.max(100, q.rowsScanned - rowsSaved),
        };
      }),
    );
  }, []);

  const [cacheSeed, setCacheSeed] = React.useState(0);
  const [purging, setPurging] = React.useState(false);
  const [cachePoints, setCachePoints] = React.useState<CachePoint[]>([]);

  React.useEffect(() => {
    const now = new Date();
    const points: CachePoint[] = Array.from({ length: 24 }).map((_, idx) => {
      const d = new Date(now.getTime() - (23 - idx) * 1800_000);
      const t = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const baseR = 78 + Math.sin((cacheSeed + 1) * 0.8 + idx * 0.35) * 9;
      const baseC = 84 + Math.cos((cacheSeed + 1) * 0.7 + idx * 0.3) * 6;
      return {
        t,
        redis: Math.max(10, Math.min(99, baseR)),
        cdn: Math.max(10, Math.min(99, baseC)),
      };
    });
    setCachePoints(points);
  }, [cacheSeed]);

  const latest = cachePoints[cachePoints.length - 1];

  const purgeCache = React.useCallback(async () => {
    if (purging) return;
    setPurging(true);
    const startSeed = cacheSeed + 1;

    // Drop hit rates immediately, then recover.
    setCacheSeed(startSeed);
    setCachePoints((prev) =>
      prev.map((p) => ({
        ...p,
        redis: Math.max(10, p.redis * (0.35 + Math.random() * 0.1)),
        cdn: Math.max(10, p.cdn * (0.35 + Math.random() * 0.1)),
      })),
    );

    await new Promise((r) => window.setTimeout(r, 1300));

    const recoveryInterval = window.setInterval(() => {
      setCachePoints((prev) =>
        prev.map((p) => ({
          ...p,
          redis: Math.min(99, p.redis + 3 + Math.random() * 2),
          cdn: Math.min(99, p.cdn + 2 + Math.random() * 2),
        })),
      );
    }, 600);

    await new Promise((r) => window.setTimeout(r, 4200));
    window.clearInterval(recoveryInterval);
    setPurging(false);
  }, [cacheSeed, purging]);

  const lowCache = (n: number) => n < 60;

  const redisIsSafe = latest ? !lowCache(latest.redis) : true;
  const cdnIsSafe = latest ? !lowCache(latest.cdn) : true;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">Performance</h1>
        <p className="mt-1 text-sm text-slate-100/70">
          Slow queries + caching hit rate monitoring.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-indigo-400/30 bg-slate-950 lg:col-span-1">
          <h2 className="text-sm font-semibold text-slate-100">Slow Queries</h2>
          <p className="mt-1 text-xs text-slate-100/60">
            Optimize high-impact queries (simulated actions).
          </p>

          <div className="mt-4 overflow-x-auto rounded-xl border border-indigo-400/20">
            <table className="min-w-[720px] w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-900/60 text-left text-xs uppercase tracking-wider text-slate-100/60">
                  <th className="px-4 py-3">Query</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Rows Scanned</th>
                  <th className="px-4 py-3">Impact</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {queries.map((q) => (
                  <tr key={q.id} className="border-t border-indigo-400/20">
                    <td className="px-4 py-3 text-slate-100/80 font-medium">
                      {q.queryName}
                    </td>
                    <td className="px-4 py-3 text-slate-100/70 font-mono">
                      {q.durationMs}ms
                    </td>
                    <td className="px-4 py-3 text-slate-100/70 font-mono">
                      {q.rowsScanned.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${impactPill(
                          q.impact,
                        )}`}
                      >
                        {q.impact}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        disabled={q.status === "Optimizing" || q.status === "Optimized"}
                        onClick={() => optimizeQuery(q.id)}
                        className="rounded-lg border border-indigo-400/60 bg-indigo-400/10 px-3 py-2 text-xs font-medium text-slate-100 transition-colors hover:bg-indigo-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {q.status === "Optimizing"
                          ? "Optimizing..."
                          : q.status === "Optimized"
                            ? "Optimized"
                            : "Optimize"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="border-indigo-400/30 bg-slate-950">
          <h2 className="text-sm font-semibold text-slate-100">Cache Hit Rates</h2>
          <p className="mt-1 text-xs text-slate-100/60">
            Monitor Redis and CDN hit rates.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div
              className={`rounded-xl border px-4 py-3 ${
                redisIsSafe
                  ? "border-indigo-400/30 bg-indigo-400/5"
                  : "border-amber-500/40 bg-amber-500/10"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-100/70">
                Redis Hit Rate
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-100">
                {latest ? formatPct(latest.redis) : "—"}
              </p>
            </div>
            <div
              className={`rounded-xl border px-4 py-3 ${
                cdnIsSafe
                  ? "border-indigo-400/30 bg-indigo-400/5"
                  : "border-amber-500/40 bg-amber-500/10"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-100/70">
                CDN Hit Rate
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-100">
                {latest ? formatPct(latest.cdn) : "—"}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-100">
                  Hit-rate trend
                </p>
                <p className="mt-1 text-xs text-slate-100/60">
                  Last ~12 hours (mock).
                </p>
              </div>
              <button
                type="button"
                onClick={purgeCache}
                disabled={purging}
                className="rounded-xl border border-indigo-400/60 bg-indigo-400/10 px-4 py-3 text-sm font-medium text-slate-100 transition-colors hover:bg-indigo-400/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {purging ? "Purging..." : "Purge Cache"}
              </button>
            </div>

            <div className="mt-4 h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cachePoints}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(129,140,248,0.18)"
                  />
                  <XAxis
                    dataKey="t"
                    tick={{ fill: "rgba(226,232,240,0.65)", fontSize: 11 }}
                  />
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
                    formatter={(value: any) => [`${Math.round(value)}%`, "Hit"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="redis"
                    stroke="#818CF8"
                    dot={false}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="cdn"
                    stroke="#A78BFA"
                    dot={false}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

