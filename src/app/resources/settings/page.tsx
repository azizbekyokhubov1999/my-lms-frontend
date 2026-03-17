"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../components/ui/Card";
import { Switch } from "../../components/ui/Switch";

const LANGUAGES = [
  { value: "uz", label: "Uzbek" },
  { value: "en", label: "English" },
  { value: "ru", label: "Russian" },
];

const DATE_FORMATS = [
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
];

const TIMEZONES = [
  { value: "Asia/Tashkent", label: "Asia/Tashkent (UTC+5)" },
  { value: "Europe/London", label: "Europe/London (UTC+0)" },
  { value: "Europe/Moscow", label: "Europe/Moscow (UTC+3)" },
  { value: "America/New_York", label: "America/New York (UTC-5)" },
];

const SYNC_FREQUENCY = [
  { value: "15", label: "Every 15 minutes" },
  { value: "30", label: "Every 30 minutes" },
  { value: "60", label: "Every hour" },
  { value: "manual", label: "Manual only" },
];

const REFRESH_INTERVAL = [
  { value: "5", label: "5 minutes" },
  { value: "15", label: "15 minutes" },
  { value: "30", label: "30 minutes" },
  { value: "60", label: "1 hour" },
];

const VISIBILITY_OPTIONS = [
  { value: "none", label: "Hidden" },
  { value: "teachers", label: "Teachers only" },
  { value: "departments", label: "Other departments only" },
  { value: "all", label: "Teachers and departments" },
];

function Select({
  label,
  value,
  options,
  onChange,
  "aria-label": ariaLabel,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
  "aria-label"?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-600">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel ?? label}
        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function SettingsPage() {
  const [newTeacherReg, setNewTeacherReg] = React.useState(true);
  const [workloadAlerts, setWorkloadAlerts] = React.useState(true);
  const [replacementCompletions, setReplacementCompletions] = React.useState(true);
  const [language, setLanguage] = React.useState("en");
  const [dateFormat, setDateFormat] = React.useState("DD/MM/YYYY");
  const [timezone, setTimezone] = React.useState("Asia/Tashkent");
  const [ascSyncFrequency, setAscSyncFrequency] = React.useState("30");
  const [refreshInterval, setRefreshInterval] = React.useState("15");
  const [contactVisibilityTeachers, setContactVisibilityTeachers] = React.useState("teachers");
  const [contactVisibilityDepartments, setContactVisibilityDepartments] = React.useState("departments");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/resources/profile" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Profile
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Notification preferences, interface, system integration, and privacy.
        </p>
      </div>

      {/* 1. Notification Preferences */}
      <Card className="border-teal-100 bg-teal-50/20">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Notification preferences
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">Choose which events trigger notifications.</p>
        <ul className="mt-4 space-y-4">
          <li className="flex items-center justify-between gap-4 rounded-lg border border-slate-100 bg-white px-4 py-3">
            <div>
              <p className="font-medium text-slate-900">New Teacher Registration</p>
              <p className="text-xs text-slate-500">When a new teacher is registered in the system.</p>
            </div>
            <Switch
              checked={newTeacherReg}
              onCheckedChange={setNewTeacherReg}
              aria-label="Toggle New Teacher Registration notifications"
            />
          </li>
          <li className="flex items-center justify-between gap-4 rounded-lg border border-slate-100 bg-white px-4 py-3">
            <div>
              <p className="font-medium text-slate-900">Workload Overload Alerts</p>
              <p className="text-xs text-slate-500">When a teacher exceeds recommended hours.</p>
            </div>
            <Switch
              checked={workloadAlerts}
              onCheckedChange={setWorkloadAlerts}
              aria-label="Toggle Workload Overload Alerts"
            />
          </li>
          <li className="flex items-center justify-between gap-4 rounded-lg border border-slate-100 bg-white px-4 py-3">
            <div>
              <p className="font-medium text-slate-900">Replacement Completions</p>
              <p className="text-xs text-slate-500">When a replacement workflow is completed.</p>
            </div>
            <Switch
              checked={replacementCompletions}
              onCheckedChange={setReplacementCompletions}
              aria-label="Toggle Replacement Completions notifications"
            />
          </li>
        </ul>
      </Card>

      {/* 2. Interface Settings */}
      <Card className="border-teal-100">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Interface settings
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">Language, date format, and timezone.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Select
            label="Language"
            value={language}
            options={LANGUAGES}
            onChange={setLanguage}
          />
          <Select
            label="Date format"
            value={dateFormat}
            options={DATE_FORMATS}
            onChange={setDateFormat}
          />
          <Select
            label="Timezone"
            value={timezone}
            options={TIMEZONES}
            onChange={setTimezone}
          />
        </div>
      </Card>

      {/* 3. System Integration */}
      <Card className="border-teal-100">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          System integration
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">aSc Timetable sync and data refresh.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Select
            label="aSc Timetable sync frequency"
            value={ascSyncFrequency}
            options={SYNC_FREQUENCY}
            onChange={setAscSyncFrequency}
          />
          <Select
            label="Data refresh interval"
            value={refreshInterval}
            options={REFRESH_INTERVAL}
            onChange={setRefreshInterval}
          />
        </div>
      </Card>

      {/* 4. Privacy */}
      <Card className="border-teal-100 bg-teal-50/20">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Privacy
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">Who can see your personal contact information.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Select
            label="Visibility to teachers"
            value={contactVisibilityTeachers}
            options={VISIBILITY_OPTIONS}
            onChange={setContactVisibilityTeachers}
          />
          <Select
            label="Visibility to other departments"
            value={contactVisibilityDepartments}
            options={VISIBILITY_OPTIONS}
            onChange={setContactVisibilityDepartments}
          />
        </div>
      </Card>
    </div>
  );
}
