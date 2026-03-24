"use client";

import * as React from "react";
import Link from "next/link";
import { CalendarClock } from "lucide-react";

import { Card } from "@/app/components/ui/Card";

type Frequency = "Daily" | "Weekly";

type ScheduledPolicy = {
  frequency: Frequency;
  time: string;
  retentionDays: number;
};

export default function BackupSchedulePage() {
  const [policy, setPolicy] = React.useState<ScheduledPolicy>({
    frequency: "Daily",
    time: "02:00",
    retentionDays: 30,
  });
  const [savedMessage, setSavedMessage] = React.useState("");

  const savePolicy = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavedMessage(`Schedule saved: ${policy.frequency} at ${policy.time}, keep for ${policy.retentionDays} days.`);
  };

  return (
    <div className="space-y-5 bg-slate-50 text-slate-900">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Link href="/operations/backup" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Back to Backup Hub
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">Backup Schedule</h1>
          <p className="mt-1 text-sm text-slate-600">Configure backup frequency and retention policy.</p>
        </div>
        <CalendarClock className="h-6 w-6 text-indigo-400" />
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <form onSubmit={savePolicy} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Backup Frequency</label>
            <select
              value={policy.frequency}
              onChange={(e) => setPolicy((prev) => ({ ...prev, frequency: e.target.value as Frequency }))}
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-400 focus:ring-2"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Backup Time</label>
            <input
              type="time"
              value={policy.time}
              onChange={(e) => setPolicy((prev) => ({ ...prev, time: e.target.value }))}
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-400 focus:ring-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Backup Retention Policy</label>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-slate-600">Keep for</span>
              <input
                type="number"
                min={1}
                value={policy.retentionDays}
                onChange={(e) => setPolicy((prev) => ({ ...prev, retentionDays: Math.max(1, Number(e.target.value) || 1) }))}
                className="w-24 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-400 focus:ring-2"
              />
              <span className="text-sm text-slate-600">days</span>
            </div>
          </div>

          <button
            type="submit"
            className="rounded-md border border-indigo-400 bg-indigo-400 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Save Backup Policy
          </button>

          {savedMessage ? <p className="text-sm font-medium text-indigo-600">{savedMessage}</p> : null}
        </form>
      </Card>
    </div>
  );
}
