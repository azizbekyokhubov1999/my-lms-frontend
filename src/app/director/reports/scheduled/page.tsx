"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../../components/ui/Card";
import { Switch } from "../../../components/ui/Switch";

export default function ScheduledReportsPage() {
  const [enabled, setEnabled] = React.useState(true);
  const [day, setDay] = React.useState("Monday");
  const [recipient, setRecipient] = React.useState("rector@university.edu");

  return (
    <div className="space-y-6">
      <div>
        <Link href="/director/reports" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          ← Reports
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Scheduled reports</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Automatically email the Dashboard summary to the Rector every Monday.
        </p>
      </div>

      <Card className="border-slate-200 bg-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Dashboard summary schedule
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Enable to send the Executive Dashboard summary by email on the selected day.
        </p>
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <div>
              <p className="font-medium text-slate-900">Email Dashboard summary</p>
              <p className="text-xs text-slate-500">Send to Rector</p>
            </div>
            <Switch checked={enabled} onCheckedChange={setEnabled} aria-label="Toggle scheduled report" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Day of week</label>
              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
              >
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Recipient (Rector)</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                placeholder="rector@university.edu"
              />
            </div>
          </div>
          <p className="text-xs text-slate-500">Next send: every {day} at 08:00 (configurable in system settings).</p>
        </div>
      </Card>
    </div>
  );
}
