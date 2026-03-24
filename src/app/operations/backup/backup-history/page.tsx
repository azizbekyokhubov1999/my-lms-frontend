"use client";

import Link from "next/link";
import { ClipboardList } from "lucide-react";

import { Card } from "@/app/components/ui/Card";

type HistoryStatus = "Success" | "Failed";

type BackupHistoryRow = {
  id: string;
  backupId: string;
  size: string;
  duration: string;
  status: HistoryStatus;
};

const HISTORY_ROWS: BackupHistoryRow[] = [
  { id: "h1", backupId: "BKP-20260306-0200", size: "125 GB", duration: "45m", status: "Success" },
  { id: "h2", backupId: "BKP-20260305-0200", size: "124 GB", duration: "47m", status: "Success" },
  { id: "h3", backupId: "BKP-20260304-0200", size: "--", duration: "9m", status: "Failed" },
];

export default function BackupHistoryPage() {
  return (
    <div className="space-y-5 bg-slate-50 text-slate-900">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Link href="/operations/backup" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Back to Backup Hub
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">Backup History</h1>
          <p className="mt-1 text-sm text-slate-600">Success and failure logs for all backup runs.</p>
        </div>
        <ClipboardList className="h-6 w-6 text-indigo-400" />
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3">Backup ID</th>
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {HISTORY_ROWS.map((row) => (
                <tr key={row.id} className="border-t border-slate-200 text-slate-700">
                  <td className="px-4 py-3 font-medium text-slate-900">{row.backupId}</td>
                  <td className="px-4 py-3">{row.size}</td>
                  <td className="px-4 py-3">{row.duration}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                        row.status === "Success"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                          : "border-rose-200 bg-rose-50 text-rose-600"
                      }`}
                    >
                      {row.status}
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
