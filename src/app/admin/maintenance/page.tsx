"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

interface BackupRow {
  id: string;
  date: string;
  type: "automated" | "manual";
  size: string;
  status: "completed" | "failed" | "in_progress";
}

const MOCK_BACKUPS: BackupRow[] = [
  { id: "b1", date: "2026-03-06 06:00", type: "automated", size: "2.4 GB", status: "completed" },
  { id: "b2", date: "2026-03-05 06:00", type: "automated", size: "2.3 GB", status: "completed" },
  { id: "b3", date: "2026-03-04 06:00", type: "automated", size: "2.3 GB", status: "completed" },
  { id: "b4", date: "2026-03-03 14:22", type: "manual", size: "2.2 GB", status: "completed" },
  { id: "b5", date: "2026-03-02 06:00", type: "automated", size: "2.2 GB", status: "completed" },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function BackupManagementPage() {
  const [backups, setBackups] = React.useState<BackupRow[]>(MOCK_BACKUPS);
  const [creating, setCreating] = React.useState(false);

  const createManualBackup = () => {
    setCreating(true);
    setTimeout(() => {
      setBackups((prev) => [
        {
          id: "b" + Date.now(),
          date: new Date().toISOString().slice(0, 16).replace("T", " "),
          type: "manual",
          size: "—",
          status: "in_progress",
        },
        ...prev,
      ]);
      setCreating(false);
    }, 1000);
  };

  const restoreFromPoint = (backup: BackupRow) => {
    if (backup.status !== "completed") return;
    if (!confirm(`Restore from backup ${backup.date}? This will overwrite current data.`)) return;
    alert(`Restore started (demo): ${backup.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Maintenance</h1>
          <p className="mt-1 text-sm text-slate-600">
            Backups, updates, database tools, and disaster recovery.
          </p>
        </div>
        <nav className="flex gap-2">
          <Link href="/admin/maintenance" className="inline-flex h-9 items-center rounded-md bg-slate-100 px-3 text-sm font-medium text-slate-900">Backups</Link>
          <Link href="/admin/maintenance/updates" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">Updates</Link>
          <Link href="/admin/maintenance/database" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">Database</Link>
          <Link href="/admin/maintenance/disaster-recovery" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">Disaster Recovery</Link>
        </nav>
      </div>

      <Card className="p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Backup history
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Automated and manual backups. Restore from any completed point.
        </p>
        <div className="mt-4 flex gap-2">
          <Button variant="primary" size="sm" onClick={createManualBackup} disabled={creating}>
            {creating ? "Creating…" : "Create Manual Backup"}
          </Button>
        </div>
        <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[500px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Date</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Type</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Size</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                <th className="w-32 px-4 py-3 text-right font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {backups.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 text-slate-900">{row.date}</td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", row.type === "manual" ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-700")}>
                      {row.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{row.size}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        row.status === "completed" && "bg-emerald-100 text-emerald-800",
                        row.status === "failed" && "bg-red-100 text-red-800",
                        row.status === "in_progress" && "bg-amber-100 text-amber-800",
                      )}
                    >
                      {row.status === "in_progress" ? "In progress" : row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {row.status === "completed" && (
                      <Button variant="secondary" size="sm" onClick={() => restoreFromPoint(row)}>
                        Restore From Point
                      </Button>
                    )}
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
