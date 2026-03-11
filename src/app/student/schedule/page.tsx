"use client";

import * as React from "react";

export default function SchedulePage() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Schedule
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Weekly timetable and Microsoft Teams events. Syncs with your calendar.
        </p>
      </section>
      <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-8 text-center text-sm text-slate-600">
        <p className="font-medium text-slate-700">Weekly timetable</p>
        <p className="mt-1">
          Integration with Teams events will appear here. Connect your account in
          Settings to see live sessions and deadlines.
        </p>
      </div>
    </div>
  );
}
