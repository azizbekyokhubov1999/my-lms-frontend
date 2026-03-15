"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type TabId = "general" | "notifications" | "security" | "export";

const TABS: Array<{ id: TabId; label: string }> = [
  { id: "general", label: "General" },
  { id: "notifications", label: "Notifications" },
  { id: "security", label: "Security" },
  { id: "export", label: "Export" },
];

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
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
          checked ? "bg-emerald-500" : "bg-slate-200",
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

export default function FinanceSettingsPage() {
  const [activeTab, setActiveTab] = React.useState<TabId>("general");
  const [language, setLanguage] = React.useState<"uz" | "en" | "ru">("en");
  const [theme, setTheme] = React.useState<"light" | "dark">("light");
  const [alertHighRisk, setAlertHighRisk] = React.useState(true);
  const [oneCSyncReports, setOneCSyncReports] = React.useState(true);
  const [dailyRevenueEmail, setDailyRevenueEmail] = React.useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(false);
  const [exportFormat, setExportFormat] = React.useState<"pdf" | "excel">("pdf");
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [passwordSaved, setPasswordSaved] = React.useState(false);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New password and confirmation do not match.");
      return;
    }
    setPasswordSaved(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/finance/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Dashboard
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="mt-0.5 text-sm text-slate-600">Language, notifications, security, and export preferences.</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex gap-1 overflow-x-auto" aria-label="Settings sections">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
                activeTab === tab.id
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900",
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* General */}
      {activeTab === "general" && (
        <Card className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">General Settings</h2>
          <p className="mt-0.5 text-xs text-slate-600">Language and appearance.</p>
          <div className="mt-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-800">Language</label>
              <p className="mt-0.5 text-xs text-slate-500">Interface language.</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(["en", "uz", "ru"] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={cn(
                      "rounded-lg border px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
                      language === lang
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50",
                    )}
                  >
                    {lang === "en" ? "EN" : lang === "uz" ? "UZ" : "RU"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-800">Theme</label>
              <p className="mt-0.5 text-xs text-slate-500">Light or dark interface.</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(["light", "dark"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTheme(t)}
                    className={cn(
                      "rounded-lg border px-4 py-2 text-sm font-medium capitalize transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
                      theme === t
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Notifications */}
      {activeTab === "notifications" && (
        <Card className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Financial Notifications</h2>
          <p className="mt-0.5 text-xs text-slate-600">Choose which alerts and reports you receive.</p>
          <div className="mt-6 divide-y divide-slate-100">
            <Toggle
              label="Alert on High-Risk Debtors"
              description="Get notified when a debtor is marked high risk or misses payments."
              checked={alertHighRisk}
              onChange={setAlertHighRisk}
            />
            <Toggle
              label="1C Sync Completion Reports"
              description="Receive a summary when 1C reconciliation sync finishes."
              checked={oneCSyncReports}
              onChange={setOneCSyncReports}
            />
            <Toggle
              label="Daily Revenue Summary Email"
              description="Receive a daily email with revenue and payment highlights."
              checked={dailyRevenueEmail}
              onChange={setDailyRevenueEmail}
            />
          </div>
        </Card>
      )}

      {/* Security */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Change Password</h2>
            <p className="mt-0.5 text-xs text-slate-600">Update your account password.</p>
            <form onSubmit={handleChangePassword} className="mt-6 max-w-sm space-y-4">
              <Input
                label="Current password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
              />
              <Input
                label="New password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
              />
              <Input
                label="Confirm new password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
              />
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500"
                disabled={!currentPassword || !newPassword || !confirmPassword}
              >
                {passwordSaved ? "Password updated" : "Change password"}
              </Button>
            </form>
          </Card>
          <Card className="p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Two-Factor Authentication</h2>
            <p className="mt-0.5 text-xs text-slate-600">Add an extra layer of security to your account.</p>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-medium text-slate-900">
                  Status: {twoFactorEnabled ? "Enabled" : "Not enabled"}
                </p>
                <p className="mt-0.5 text-sm text-slate-500">
                  {twoFactorEnabled
                    ? "Your account is protected with 2FA."
                    : "Enable 2FA to require a code from your authenticator app when signing in."}
                </p>
              </div>
              <Button
                type="button"
                variant="secondary"
                className={twoFactorEnabled ? "border-rose-200 text-rose-700 hover:bg-rose-50" : "border-emerald-600 text-emerald-700 hover:bg-emerald-50"}
                onClick={() => setTwoFactorEnabled((v) => !v)}
              >
                {twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Export */}
      {activeTab === "export" && (
        <Card className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Export Preferences</h2>
          <p className="mt-0.5 text-xs text-slate-600">Default format for reports and exports.</p>
          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-800">Default report format</label>
            <p className="mt-0.5 text-xs text-slate-500">Used when downloading reports from Finance modules.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(["pdf", "excel"] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setExportFormat(fmt)}
                  className={cn(
                    "rounded-lg border px-4 py-2 text-sm font-medium uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
                    exportFormat === fmt
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50",
                  )}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
