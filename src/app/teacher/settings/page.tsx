"use client";

import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface ToggleProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}

function Toggle({ id, checked, onChange, label, description }: ToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <label htmlFor={id} className="text-sm font-medium text-slate-900">
          {label}
        </label>
        {description && (
          <p className="mt-0.5 text-xs text-slate-500">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        id={id}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2",
          checked ? "bg-teal-600" : "bg-slate-200",
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

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "ar", label: "العربية" },
];

const TIMEZONES = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "Eastern (New York)" },
  { value: "America/Chicago", label: "Central (Chicago)" },
  { value: "America/Denver", label: "Mountain (Denver)" },
  { value: "America/Los_Angeles", label: "Pacific (Los Angeles)" },
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Kolkata", label: "India (IST)" },
];

const ACTIVE_SESSIONS = [
  { id: "s1", device: "Chrome on Windows", location: "New York, US", current: true, lastActive: "Now" },
  { id: "s2", device: "Safari on Mac", location: "New York, US", current: false, lastActive: "2 hours ago" },
  { id: "s3", device: "Firefox on Android", location: "Boston, US", current: false, lastActive: "1 day ago" },
];

export default function TeacherSettingsPage() {
  const [notifySubmission, setNotifySubmission] = React.useState(true);
  const [notifyQa, setNotifyQa] = React.useState(true);
  const [notifyAqad, setNotifyAqad] = React.useState(true);

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [passwordSaved, setPasswordSaved] = React.useState(false);

  const [language, setLanguage] = React.useState("en");
  const [timezone, setTimezone] = React.useState("America/New_York");
  const [prefsSaved, setPrefsSaved] = React.useState(false);

  const [sessions, setSessions] = React.useState(ACTIVE_SESSIONS);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return;
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 2000);
  };

  const handleSavePrefs = () => {
    setPrefsSaved(true);
    setTimeout(() => setPrefsSaved(false), 2000);
  };

  const handleRevokeSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage your notification, security, and regional preferences.
        </p>
      </section>

      {/* Notification Preferences */}
      <Card className="rounded-lg border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-900">Notification preferences</h3>
        <p className="mt-0.5 text-xs text-slate-500">Choose what triggers email and in-app notifications</p>
        <div className="mt-6 space-y-6">
          <Toggle
            id="notify-submission"
            checked={notifySubmission}
            onChange={setNotifySubmission}
            label="New assignment submission"
            description="When a student submits an assignment for grading"
          />
          <Toggle
            id="notify-qa"
            checked={notifyQa}
            onChange={setNotifyQa}
            label="New Q&A question"
            description="When a student posts a question in the Q&A Hub"
          />
          <Toggle
            id="notify-aqad"
            checked={notifyAqad}
            onChange={setNotifyAqad}
            label="AQAD task issued"
            description="When an academic quality task is assigned for your course"
          />
        </div>
      </Card>

      {/* Security */}
      <Card className="rounded-lg border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-900">Security</h3>
        <p className="mt-0.5 text-xs text-slate-500">Change password and manage active sessions</p>

        <div className="mt-6">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-600">Change password</h4>
          <form onSubmit={handleChangePassword} className="mt-3 flex flex-col gap-3 sm:max-w-sm">
            <Input
              type="password"
              label="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <Input
              type="password"
              label="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <Input
              type="password"
              label="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <Button
              type="submit"
              variant="primary"
              className="w-fit bg-teal-600 hover:bg-teal-700"
              disabled={newPassword !== confirmPassword}
            >
              {passwordSaved ? "Saved ✓" : "Change password"}
            </Button>
          </form>
        </div>

        <div className="mt-8">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-600">Active sessions</h4>
          <p className="mt-1 text-xs text-slate-500">Devices where you are currently signed in. Revoke any session to sign out on that device.</p>
          <ul className="mt-4 divide-y divide-slate-200">
            {sessions.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0">
                <div>
                  <p className="text-sm font-medium text-slate-900">{s.device}</p>
                  <p className="text-xs text-slate-500">{s.location} · {s.lastActive}</p>
                  {s.current && (
                    <span className="mt-1 inline-block text-[10px] font-medium text-teal-600">Current session</span>
                  )}
                </div>
                {!s.current && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => handleRevokeSession(s.id)}
                  >
                    Revoke
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </Card>

      {/* Language & Regional */}
      <Card className="rounded-lg border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-900">Language & regional</h3>
        <p className="mt-0.5 text-xs text-slate-500">Affects how dates, times, and content are displayed. Timezone is crucial for lecture scheduling.</p>
        <div className="mt-6 flex flex-wrap gap-6">
          <div className="min-w-[200px]">
            <label htmlFor="language-select" className="block text-xs font-medium text-slate-700">
              UI language
            </label>
            <select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>
          <div className="min-w-[240px]">
            <label htmlFor="timezone-select" className="block text-xs font-medium text-slate-700">
              Timezone
            </label>
            <select
              id="timezone-select"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              {TIMEZONES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <p className="mt-1 text-[11px] text-slate-500">Used for lecture times and deadlines</p>
          </div>
        </div>
        <Button
          type="button"
          variant="primary"
          size="sm"
          className="mt-4 bg-teal-600 hover:bg-teal-700"
          onClick={handleSavePrefs}
        >
          {prefsSaved ? "Saved ✓" : "Save preferences"}
        </Button>
      </Card>
    </div>
  );
}
