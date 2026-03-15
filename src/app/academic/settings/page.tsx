"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <p className="font-medium text-slate-900">{label}</p>
        {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2",
          checked ? "bg-purple-600" : "bg-slate-200",
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition",
            checked ? "translate-x-5" : "translate-x-0.5",
          )}
        />
      </button>
    </div>
  );
}

export default function AcademicSettingsPage() {
  const [conflictAlerts, setConflictAlerts] = React.useState(true);
  const [exceptionRequests, setExceptionRequests] = React.useState(true);
  const [ascSyncStatus, setAscSyncStatus] = React.useState(true);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/academic/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Dashboard
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Notifications for conflict alerts, exception requests, and aSc sync status.
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Notifications</h2>
        <p className="mt-0.5 text-xs text-slate-600">Choose which alerts you receive.</p>
        <div className="mt-6 divide-y divide-slate-100">
          <Toggle
            label="Conflict alerts"
            description="Notify when schedule conflicts or room double-bookings are detected."
            checked={conflictAlerts}
            onChange={setConflictAlerts}
          />
          <Toggle
            label="New exception requests"
            description="Notify when a new waiver or exception request is submitted for your review."
            checked={exceptionRequests}
            onChange={setExceptionRequests}
          />
          <Toggle
            label="aSc sync status"
            description="Notify when aSc Timetable sync completes or fails."
            checked={ascSyncStatus}
            onChange={setAscSyncStatus}
          />
        </div>
      </Card>
    </div>
  );
}
