"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const TWO_FA_OPTIONS = ["off", "optional", "mandatory"] as const;
const SESSION_TIMEOUT_MINUTES = [15, 30, 60, 120, 480];

export default function AuthenticationSettingsPage() {
  const [twoFa, setTwoFa] = React.useState<string>("optional");
  const [sessionTimeout, setSessionTimeout] = React.useState(60);
  const [minLength, setMinLength] = React.useState("8");
  const [requireUppercase, setRequireUppercase] = React.useState(true);
  const [requireLowercase, setRequireLowercase] = React.useState(true);
  const [requireNumber, setRequireNumber] = React.useState(true);
  const [requireSpecial, setRequireSpecial] = React.useState(true);
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
          <h1 className="text-2xl font-semibold text-slate-900">Security</h1>
          <p className="mt-1 text-sm text-slate-600">
            Authentication, incidents, and encryption settings.
          </p>
        </div>
        <nav className="flex gap-2">
          <Link
            href="/admin/security"
            className="inline-flex h-9 items-center rounded-md bg-slate-100 px-3 text-sm font-medium text-slate-900"
          >
            Authentication
          </Link>
          <Link
            href="/admin/security/incidents"
            className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Incidents
          </Link>
          <Link
            href="/admin/security/encryption"
            className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Encryption
          </Link>
          <Link
            href="/admin/security/audit-logs"
            className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Audit Logs
          </Link>
          <Link
            href="/admin/security/access-control"
            className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Access Control
          </Link>
        </nav>
      </div>

      <Card className="max-w-2xl p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Authentication Settings
        </h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-800">Two-factor authentication (2FA)</label>
            <p className="mt-0.5 text-xs text-slate-500">Require or allow 2FA for user logins.</p>
            <div className="mt-2 flex flex-wrap gap-4">
              {(["off", "optional", "mandatory"] as const).map((opt) => (
                <label key={opt} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="2fa"
                    value={opt}
                    checked={twoFa === opt}
                    onChange={() => setTwoFa(opt)}
                    className="h-4 w-4 border-slate-300 text-blue-900 focus:ring-blue-900"
                  />
                  <span className="text-sm text-slate-700 capitalize">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="session-timeout" className="block text-sm font-medium text-slate-800">
              Session timeout (minutes)
            </label>
            <select
              id="session-timeout"
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(Number(e.target.value))}
              className="mt-1 block w-full max-w-xs rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
            >
              {SESSION_TIMEOUT_MINUTES.map((m) => (
                <option key={m} value={m}>
                  {m === 480 ? "8 hours" : `${m} min`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-800">Password complexity rules</h3>
            <p className="mt-0.5 text-xs text-slate-500">Enforce these rules for new and changed passwords.</p>
            <div className="mt-3 space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  label="Minimum length"
                  type="number"
                  min={6}
                  max={32}
                  value={minLength}
                  onChange={(e) => setMinLength(e.target.value)}
                  className="w-24"
                />
                <span className="pt-6 text-sm text-slate-500">characters</span>
              </div>
              <label className={cn("flex items-center gap-2")}>
                <input
                  type="checkbox"
                  checked={requireUppercase}
                  onChange={(e) => setRequireUppercase(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                />
                <span className="text-sm text-slate-700">Require uppercase letter</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={requireLowercase}
                  onChange={(e) => setRequireLowercase(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                />
                <span className="text-sm text-slate-700">Require lowercase letter</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={requireNumber}
                  onChange={(e) => setRequireNumber(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                />
                <span className="text-sm text-slate-700">Require number</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={requireSpecial}
                  onChange={(e) => setRequireSpecial(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                />
                <span className="text-sm text-slate-700">Require special character (!@#$%^&*)</span>
              </label>
            </div>
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
