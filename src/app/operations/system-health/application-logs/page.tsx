"use client";

import * as React from "react";
import OperationsActionsBar from "../../_components/OperationsActionsBar";

import { Card } from "../../../components/ui/Card";

type LogLevel = "INFO" | "WARN" | "ERROR";

type LogEntry = {
  id: string;
  ts: Date;
  level: LogLevel;
  message: string;
};

const LEVEL_STYLE: Record<LogLevel, string> = {
  INFO: "text-indigo-300",
  WARN: "text-amber-300",
  ERROR: "text-rose-300",
};

function formatTime(d: Date) {
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function randomId() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function buildMockMessage(level: LogLevel) {
  const base = [
    "GET /api/health returned 200",
    "Background worker completed job",
    "TLS handshake renegotiation succeeded",
    "Cache warmed for key=ops-dashboard",
    "Queue depth check passed",
    "DB pool is within normal bounds",
  ];
  const warn = [
    "Elevated latency detected (p95)",
    "Retrying upstream request after timeout",
    "Rate limit near threshold",
    "Minor packet reordering observed",
  ];
  const err = [
    "Failed to connect to datastore",
    "Unhandled exception in request pipeline",
    "Webhook signature verification failed",
    "Circuit breaker opened due to errors",
  ];

  if (level === "WARN") {
    const idx = Math.floor(Math.random() * warn.length);
    return warn[idx];
  }
  if (level === "ERROR") {
    const idx = Math.floor(Math.random() * err.length);
    return err[idx];
  }
  const idx = Math.floor(Math.random() * base.length);
  return base[idx];
}

export default function ApplicationLogsPage() {
  const [query, setQuery] = React.useState("");
  const [logs, setLogs] = React.useState<LogEntry[]>([]);
  const [lastRefreshAt, setLastRefreshAt] = React.useState<Date>(new Date());
  const [autoScroll, setAutoScroll] = React.useState(true);

  const logsRef = React.useRef<HTMLDivElement | null>(null);

  const spawnLogs = React.useCallback((count: number) => {
    const next: LogEntry[] = [];
    for (let i = 0; i < count; i += 1) {
      const r = Math.random();
      const level: LogLevel = r < 0.08 ? "ERROR" : r < 0.26 ? "WARN" : "INFO";
      next.push({
        id: randomId(),
        ts: new Date(),
        level,
        message: buildMockMessage(level),
      });
    }
    setLogs((prev) => [...prev, ...next].slice(-200));
  }, []);

  const refresh = React.useCallback(() => {
    const now = new Date();
    setLastRefreshAt(now);
    setLogs([]);
    spawnLogs(40);
  }, [spawnLogs]);

  React.useEffect(() => {
    refresh();
    const id = window.setInterval(() => spawnLogs(3), 1800);
    return () => window.clearInterval(id);
  }, [refresh, spawnLogs]);

  React.useEffect(() => {
    if (!autoScroll) return;
    const el = logsRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [logs, autoScroll]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return logs;
    return logs.filter((l) => {
      return (
        l.level.toLowerCase().includes(q) ||
        l.message.toLowerCase().includes(q)
      );
    });
  }, [logs, query]);

  const clearLogs = React.useCallback(() => {
    setLogs([]);
  }, []);

  const getReport = React.useCallback(() => {
    return [
      "IT Operations - Application Logs",
      `GeneratedAt: ${new Date().toISOString()}`,
      `LastRefreshAt: ${lastRefreshAt.toISOString()}`,
      `SearchQuery: ${query.trim() || "(none)"}`,
      "",
      "Timestamp,Level,Message",
      ...filtered.map((l) => `${l.ts.toISOString()},${l.level},${l.message}`),
      "",
      "Notes: mock terminal log stream for UI module.",
    ].join("\n");
  }, [filtered, lastRefreshAt, query]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">
            Application Logs
          </h1>
          <p className="mt-1 text-sm text-slate-100/70">
            Terminal-style UI with search, auto-updates, and clear controls.
          </p>
          <p className="mt-2 text-xs text-slate-100/50">
            Last refresh: {formatTime(lastRefreshAt)}
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <OperationsActionsBar
            onRefresh={refresh}
            getReport={getReport}
            reportFileBaseName="application-logs"
          />
          <button
            type="button"
            onClick={clearLogs}
            className="rounded-xl border border-indigo-400/60 bg-indigo-400/10 px-4 py-3 text-sm font-medium text-slate-100 transition-colors hover:bg-indigo-400/20"
          >
            Clear Logs
          </button>
        </div>
      </div>

      <Card className="border-indigo-400/30 bg-slate-950">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-100/70">
              Search
            </label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by level or message..."
              className="mt-2 w-full rounded-lg border border-indigo-400/30 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-100/40 outline-none focus:border-indigo-400/60"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-100/70">
              <input
                type="checkbox"
                checked={autoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
              />
              Auto-scroll
            </label>
          </div>
        </div>

        <div className="mt-4">
          <div
            ref={logsRef}
            className="h-[420px] overflow-y-auto rounded-lg border border-indigo-400/30 bg-slate-950 p-4 font-mono text-xs text-slate-100/80"
            onScroll={(e) => {
              const target = e.currentTarget;
              const nearBottom =
                target.scrollHeight - target.scrollTop - target.clientHeight <
                30;
              setAutoScroll(nearBottom);
            }}
          >
            {filtered.length === 0 ? (
              <div className="text-slate-100/60">No logs match your filter.</div>
            ) : null}

            {filtered.map((l) => (
              <div key={l.id} className="flex gap-3">
                <span className="w-[82px] shrink-0 text-slate-100/50">
                  {formatTime(l.ts)}
                </span>
                <span className={`w-[62px] shrink-0 ${LEVEL_STYLE[l.level]}`}>
                  {l.level}
                </span>
                <span className="min-w-0 wrap-break-word">{l.message}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

