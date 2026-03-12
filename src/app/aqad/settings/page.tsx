"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../components/ui/Card";

const NOTIFICATION_KEYS = {
  newCourseSubmitted: "aqad_notify_new_course",
  urgentComplaint: "aqad_notify_urgent_complaint",
  proctoringFlagDetected: "aqad_notify_proctoring_flag",
} as const;

const DEFAULT_NOTIFICATIONS = {
  [NOTIFICATION_KEYS.newCourseSubmitted]: true,
  [NOTIFICATION_KEYS.urgentComplaint]: true,
  [NOTIFICATION_KEYS.proctoringFlagDetected]: true,
};

function loadNotifications(): Record<string, boolean> {
  if (typeof window === "undefined") return { ...DEFAULT_NOTIFICATIONS };
  const stored = localStorage.getItem("aqad_notifications");
  if (!stored) return { ...DEFAULT_NOTIFICATIONS };
  try {
    const parsed = JSON.parse(stored) as Record<string, boolean>;
    return { ...DEFAULT_NOTIFICATIONS, ...parsed };
  } catch {
    return { ...DEFAULT_NOTIFICATIONS };
  }
}

function saveNotifications(prefs: Record<string, boolean>) {
  if (typeof window === "undefined") return;
  localStorage.setItem("aqad_notifications", JSON.stringify(prefs));
}

const TOGGLES: { key: keyof typeof NOTIFICATION_KEYS; label: string; description: string }[] = [
  { key: "newCourseSubmitted", label: "New Course Submitted", description: "Notify when a new course is submitted for review." },
  { key: "urgentComplaint", label: "Urgent Complaint", description: "Notify when an urgent complaint is raised." },
  { key: "proctoringFlagDetected", label: "Proctoring Flag Detected", description: "Notify when the system flags a proctoring violation for review." },
];

export default function AqadSettingsPage() {
  const [notifications, setNotifications] = React.useState<Record<string, boolean>>(DEFAULT_NOTIFICATIONS);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setNotifications(loadNotifications());
    setMounted(true);
  }, []);

  const setToggle = (key: keyof typeof NOTIFICATION_KEYS, value: boolean) => {
    const storageKey = NOTIFICATION_KEYS[key];
    const next = { ...notifications, [storageKey]: value };
    setNotifications(next);
    saveNotifications(next);
  };

  return (
    <div className="space-y-6">
      <section>
        <Link href="/aqad" className="text-xs font-medium text-indigo-600 hover:underline">
          ← AQAD Dashboard
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          AQAD portal preferences and notification settings. Quality Standards are managed on{" "}
          <Link href="/aqad/standards" className="font-medium text-indigo-600 hover:underline">
            Quality Standards
          </Link>
          .
        </p>
      </section>

      <Card className="rounded-lg border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-900">Notifications</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Choose which events trigger in-app or email notifications.
        </p>
        <ul className="mt-4 space-y-4">
          {TOGGLES.map(({ key, label, description }) => {
            const storageKey = NOTIFICATION_KEYS[key];
            const checked = mounted ? notifications[storageKey] : DEFAULT_NOTIFICATIONS[storageKey];
            return (
              <li
                key={key}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50/50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">{label}</p>
                  <p className="text-xs text-slate-500">{description}</p>
                </div>
                <label className="flex cursor-pointer items-center gap-2">
                  <span className="text-xs text-slate-600">{checked ? "On" : "Off"}</span>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => setToggle(key, e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                    aria-label={`Toggle ${label}`}
                  />
                </label>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
