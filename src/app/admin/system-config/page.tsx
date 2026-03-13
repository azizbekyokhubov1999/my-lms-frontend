"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Australia/Sydney",
];

export default function GeneralSettingsPage() {
  const [universityName, setUniversityName] = React.useState("Online University");
  const [logoUrl, setLogoUrl] = React.useState("/logo.png");
  const [timezone, setTimezone] = React.useState("America/New_York");
  const [academicYearStart, setAcademicYearStart] = React.useState("2025-09-01");
  const [academicYearEnd, setAcademicYearEnd] = React.useState("2026-06-30");
  const [saved, setSaved] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">System Configuration</h1>
          <p className="mt-1 text-sm text-slate-600">
            General settings, email templates, and payment options.
          </p>
        </div>
        <nav className="flex gap-2">
          <Link
            href="/admin/system-config"
            className="inline-flex h-9 items-center rounded-md bg-slate-100 px-3 text-sm font-medium text-slate-900"
          >
            General
          </Link>
          <Link
            href="/admin/system-config/email-templates"
            className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Email Templates
          </Link>
          <Link
            href="/admin/system-config/payment"
            className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Payment
          </Link>
          <Link
            href="/admin/system-config/integrations"
            className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Integrations
          </Link>
        </nav>
      </div>

      <Card className="max-w-2xl p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          General Settings
        </h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <Input
            label="University Name"
            type="text"
            value={universityName}
            onChange={(e) => setUniversityName(e.target.value)}
            placeholder="e.g. Online University"
          />
          <Input
            label="Logo URL"
            type="url"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://example.com/logo.png"
            helperText="URL or path to the institution logo."
          />
          <div>
            <label htmlFor="timezone" className="block text-sm font-medium text-slate-800">
              Timezone
            </label>
            <select
              id="timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Academic Year Start"
              type="date"
              value={academicYearStart}
              onChange={(e) => setAcademicYearStart(e.target.value)}
            />
            <Input
              label="Academic Year End"
              type="date"
              value={academicYearEnd}
              onChange={(e) => setAcademicYearEnd(e.target.value)}
            />
          </div>
          <div className="pt-2">
            <Button type="submit" variant="primary">
              {saved ? "Saved" : "Save changes"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
