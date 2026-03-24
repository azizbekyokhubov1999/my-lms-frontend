 "use client";

import * as React from "react";
import Link from "next/link";
import { Activity } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card } from "@/app/components/ui/Card";

const STORAGE_USED_PERCENT = 68;
const SIZE_TREND = [
  { day: "Mon", sizeGb: 116 },
  { day: "Tue", sizeGb: 122 },
  { day: "Wed", sizeGb: 119 },
  { day: "Thu", sizeGb: 128 },
  { day: "Fri", sizeGb: 131 },
  { day: "Sat", sizeGb: 127 },
  { day: "Sun", sizeGb: 134 },
];

const RECENT_JOBS = [
  { name: "Nightly Production Snapshot", type: "Full", size: "125 GB", duration: "45m", status: "Success" },
  { name: "Student DB Delta", type: "Incremental", size: "14 GB", duration: "12m", status: "Success" },
  { name: "Media Archive Sync", type: "Incremental", size: "9 GB", duration: "18m", status: "Failed" },
  { name: "Weekly Full Archive", type: "Full", size: "310 GB", duration: "1h 34m", status: "Success" },
];

const ALERTS = [
  "Storage is projected to reach 90% in 12 days.",
  "Last full backup took 18% longer than baseline.",
  "One incremental job failed due to transient network timeout.",
];

export default function BackupDashboardPage() {
  const [notice, setNotice] = React.useState("");

  const runManualBackup = () => {
    setNotice("Manual backup has been queued and will start shortly.");
  };

  const downloadLogs = () => {
    const lines = [
      "Backup Logs - Backup System Monitoring",
      `Generated: ${new Date().toISOString()}`,
      ...RECENT_JOBS.map((job) => `${job.name} | ${job.type} | ${job.size} | ${job.duration} | ${job.status}`),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "backup-logs.txt";
    link.click();
    URL.revokeObjectURL(url);
    setNotice("Backup logs downloaded.");
  };

  return (
    <div className="space-y-6 bg-slate-50 text-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link
            href="/operations/backup"
            className="inline-flex items-center rounded-md border border-indigo-300 bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-600 hover:border-indigo-400"
          >
            Back to Backup Hub
          </Link>
          <h1 className="mt-3 text-2xl font-semibold text-slate-900">Backup System Monitoring</h1>
          <p className="mt-1 text-sm text-slate-600">
            Real-time visibility into backup size, reliability, scheduling, and storage health.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Activity className="h-7 w-7 text-indigo-400" />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={runManualBackup}
              className="rounded-md border border-indigo-400 bg-indigo-400 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
            >
              Manual Backup Now
            </button>
            <button
              type="button"
              onClick={downloadLogs}
              className="rounded-md border border-indigo-300 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
            >
              Download Backup Logs
            </button>
          </div>
        </div>
      </div>
      {notice ? <p className="text-sm font-medium text-indigo-600">{notice}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-slate-200 bg-white shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total Backup Size</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">1.42 TB</p>
          <p className="mt-1 text-sm text-slate-600">Across production and archival snapshots</p>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Success Rate (Last 30 days)</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">98.6%</p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-indigo-400" style={{ width: "98.6%" }} />
          </div>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Next Scheduled Backup</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">02:00 AM</p>
          <p className="mt-1 text-sm text-slate-600">Full backup window starts in 5h 18m</p>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Storage Usage</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{STORAGE_USED_PERCENT}%</p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-indigo-400" style={{ width: `${STORAGE_USED_PERCENT}%` }} />
          </div>
          <p className="mt-1 text-sm text-slate-600">6.8 TB of 10 TB allocated</p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-slate-200 bg-white shadow-sm lg:col-span-2">
          <h2 className="text-base font-semibold text-slate-900">Backup Size Trend (Last 7 days)</h2>
          <p className="mt-1 text-sm text-slate-600">Daily backup volume trend in gigabytes.</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SIZE_TREND}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Area type="monotone" dataKey="sizeGb" stroke="#818cf8" fill="#c7d2fe" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Backup Alerts</h2>
          <div className="mt-3 space-y-2">
            {ALERTS.map((alert) => (
              <div key={alert} className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-slate-700">
                {alert}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Recent Backup Jobs</h2>
        <div className="mt-3 overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3">Job Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_JOBS.map((job) => (
                <tr key={job.name} className="border-t border-slate-200 text-slate-700">
                  <td className="px-4 py-3 font-medium text-slate-900">{job.name}</td>
                  <td className="px-4 py-3">{job.type}</td>
                  <td className="px-4 py-3">{job.size}</td>
                  <td className="px-4 py-3">{job.duration}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                        job.status === "Success"
                          ? "border-indigo-200 bg-indigo-50 text-indigo-600"
                          : "border-rose-200 bg-rose-50 text-rose-600"
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
