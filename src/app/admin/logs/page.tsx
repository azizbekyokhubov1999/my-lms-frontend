"use client";

import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type LogLevel = "Error" | "Warn" | "Debug" | "Info";

interface LogRow {
  id: string;
  timestamp: string;
  service: string;
  level: LogLevel;
  message: string;
}

const SERVICES = ["All", "API", "Database", "Redis", "Teams Integration", "Auth", "Worker"];

const MOCK_LOGS: LogRow[] = [
  { id: "1", timestamp: "2026-03-06 11:02:33", service: "Teams Integration", level: "Error", message: "ERR_TEAMS_401: Token refresh failed; retry in 60s" },
  { id: "2", timestamp: "2026-03-06 11:02:31", service: "API", level: "Debug", message: "Request GET /api/courses/101 completed in 12ms" },
  { id: "3", timestamp: "2026-03-06 11:02:28", service: "Database", level: "Warn", message: "Slow query detected (>500ms): SELECT * FROM enrollments WHERE course_id=?" },
  { id: "4", timestamp: "2026-03-06 11:02:15", service: "Auth", level: "Info", message: "User admin@edu.edu logged in from 10.0.0.1" },
  { id: "5", timestamp: "2026-03-06 11:01:59", service: "Redis", level: "Debug", message: "Cache hit ratio: 0.94 (last 5m)" },
  { id: "6", timestamp: "2026-03-06 11:01:44", service: "API", level: "Error", message: "ERR_API_503: Upstream timeout calling grade-service" },
  { id: "7", timestamp: "2026-03-06 11:01:30", service: "Worker", level: "Info", message: "Job backup-nightly completed successfully" },
  { id: "8", timestamp: "2026-03-06 11:01:12", service: "Teams Integration", level: "Warn", message: "Webhook delivery delayed; queue depth 15" },
  { id: "9", timestamp: "2026-03-06 11:00:55", service: "Database", level: "Info", message: "Connection pool: 12 active, 4 idle" },
  { id: "10", timestamp: "2026-03-06 11:00:40", service: "API", level: "Debug", message: "Request POST /api/submissions completed in 89ms" },
  { id: "11", timestamp: "2026-03-06 10:59:22", service: "Auth", level: "Warn", message: "Failed login attempt for user unknown@test.com (3 attempts)" },
  { id: "12", timestamp: "2026-03-06 10:58:00", service: "Redis", level: "Error", message: "ERR_REDIS_CONN: Connection lost; reconnecting..." },
];

function parseTimestamp(ts: string): number {
  const d = new Date(ts);
  return isNaN(d.getTime()) ? 0 : d.getTime();
}

export default function SystemLogsPage() {
  const [serviceFilter, setServiceFilter] = React.useState("All");
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [levelFilter, setLevelFilter] = React.useState<string>("");
  const [exportOpen, setExportOpen] = React.useState(false);

  const filtered = React.useMemo(() => {
    return MOCK_LOGS.filter((row) => {
      if (serviceFilter !== "All" && row.service !== serviceFilter) return false;
      if (levelFilter && row.level !== levelFilter) return false;
      if (dateFrom) {
        const t = parseTimestamp(row.timestamp);
        if (t < parseTimestamp(dateFrom + " 00:00:00")) return false;
      }
      if (dateTo) {
        const t = parseTimestamp(row.timestamp);
        if (t > parseTimestamp(dateTo + " 23:59:59")) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const match =
          row.message.toLowerCase().includes(q) ||
          row.service.toLowerCase().includes(q) ||
          (row.message.includes("ERR_") && q.includes("err"));
        if (!match) return false;
      }
      return true;
    });
  }, [serviceFilter, levelFilter, dateFrom, dateTo, searchQuery]);

  const exportLog = (format: "log" | "json") => {
    const filename = `system-logs-${new Date().toISOString().slice(0, 10)}.${format}`;
    if (format === "log") {
      const lines = filtered.map((r) => `[${r.timestamp}] [${r.service}] [${r.level}] ${r.message}`);
      const blob = new Blob([lines.join("\n")], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
    setExportOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">System Logs</h1>
        <p className="mt-1 text-sm text-slate-600">
          Real-time log stream. Filter by service, level, date range, or search by error codes and keywords.
        </p>
      </div>

      <Card className="p-4">
        <div className="mb-4 flex flex-wrap items-end gap-4">
          <div className="min-w-[180px]">
            <label htmlFor="log-service" className="block text-xs font-medium text-slate-700">
              Service
            </label>
            <select
              id="log-service"
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
            >
              {SERVICES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="min-w-[140px]">
            <label htmlFor="log-level" className="block text-xs font-medium text-slate-700">
              Log level
            </label>
            <select
              id="log-level"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
            >
              <option value="">All</option>
              <option value="Error">Error</option>
              <option value="Warn">Warn</option>
              <option value="Info">Info</option>
              <option value="Debug">Debug</option>
            </select>
          </div>
          <Input
            label="Date from"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="max-w-[160px]"
          />
          <Input
            label="Date to"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="max-w-[160px]"
          />
          <div className="min-w-[220px] flex-1">
            <label htmlFor="log-search" className="block text-xs font-medium text-slate-700">
              Search (error codes or keywords)
            </label>
            <input
              id="log-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. ERR_TEAMS_401 or timeout"
              className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>
          <div className="relative">
            <Button variant="secondary" size="sm" onClick={() => setExportOpen((o) => !o)}>
              Export
            </Button>
            {exportOpen && (
              <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                <button
                  type="button"
                  className="flex w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                  onClick={() => exportLog("log")}
                >
                  Download .log
                </button>
                <button
                  type="button"
                  className="flex w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                  onClick={() => exportLog("json")}
                >
                  Download .json
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-900/95">
          <table className="w-full min-w-[700px] font-mono text-sm">
            <thead>
              <tr className="border-b border-slate-600 bg-slate-800/80">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-300">Timestamp</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-300">Service</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-300">Level</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-300">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-slate-800/50">
                  <td className="whitespace-nowrap px-4 py-2 text-slate-400">{row.timestamp}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-slate-300">{row.service}</td>
                  <td className="whitespace-nowrap px-4 py-2">
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-xs font-medium",
                        row.level === "Error" && "bg-red-500/20 text-red-400",
                        row.level === "Warn" && "bg-amber-500/20 text-amber-400",
                        row.level === "Info" && "bg-sky-500/20 text-sky-400",
                        row.level === "Debug" && "bg-slate-500/20 text-slate-400",
                      )}
                    >
                      {row.level}
                    </span>
                  </td>
                  <td className="max-w-md truncate px-4 py-2 text-slate-200 sm:max-w-none" title={row.message}>
                    {row.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="py-8 text-center font-mono text-sm text-slate-500">No logs match the filters.</p>
        )}
        <p className="mt-2 text-xs text-slate-500">
          Showing {filtered.length} of {MOCK_LOGS.length} entries. Export filtered results for deep analysis.
        </p>
      </Card>
    </div>
  );
}
