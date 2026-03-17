"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../components/ui/Card";
import { Switch } from "../../components/ui/Switch";

export default function DirectorSettingsPage() {
  const [kpiAlerts, setKpiAlerts] = React.useState(true);
  const [incidentAlerts, setIncidentAlerts] = React.useState(true);
  const [refreshFreq, setRefreshFreq] = React.useState("hourly");
  const [language, setLanguage] = React.useState("en");
  const [timezone, setTimezone] = React.useState("Asia/Tashkent");
  const [currency, setCurrency] = React.useState("UZS");
  const [twoFactor, setTwoFactor] = React.useState(true);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/director" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          ← Deputy Director
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Executive alerts, data refresh, regional settings, and security.
        </p>
      </div>

      {/* Executive Alerts */}
      <Card className="border-slate-200 bg-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Executive alerts
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Receive instant notifications when key KPIs or incidents cross critical thresholds.
        </p>
        <ul className="mt-4 space-y-4">
          <li className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3">
            <div>
              <p className="font-medium text-slate-900">KPI below critical threshold</p>
              <p className="text-xs text-slate-500">
                Alert when a monitored KPI (e.g. revenue, retention) falls below its critical threshold.
              </p>
            </div>
            <Switch
              checked={kpiAlerts}
              onCheckedChange={setKpiAlerts}
              aria-label="Toggle KPI threshold alerts"
            />
          </li>
          <li className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3">
            <div>
              <p className="font-medium text-slate-900">High-priority incidents</p>
              <p className="text-xs text-slate-500">
                Alert when a High-priority incident is reported (e.g. finance drop, major resignation).
              </p>
            </div>
            <Switch
              checked={incidentAlerts}
              onCheckedChange={setIncidentAlerts}
              aria-label="Toggle high-priority incident alerts"
            />
          </li>
        </ul>
      </Card>

      {/* Data Refresh Preferences */}
      <Card className="border-slate-200 bg-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Data refresh preferences
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          How often executive dashboard charts auto-update.
        </p>
        <div className="mt-4">
          <label className="mb-1 block text-xs font-medium text-slate-600">Auto-refresh frequency</label>
          <select
            value={refreshFreq}
            onChange={(e) => setRefreshFreq(e.target.value)}
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
          >
            <option value="realtime">Real-time (every 5 minutes)</option>
            <option value="hourly">Every hour</option>
            <option value="daily">Daily</option>
            <option value="manual">Manual refresh</option>
          </select>
          <p className="mt-1 text-xs text-slate-500">
            Current setting: {refreshFreq === "realtime" ? "Real-time" : refreshFreq === "hourly" ? "Every hour" : refreshFreq === "daily" ? "Daily" : "Manual"}.
          </p>
        </div>
      </Card>

      {/* Regional Settings */}
      <Card className="border-slate-200 bg-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Regional settings
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Language, timezone, and currency display for executive dashboards.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
            >
              <option value="en">English</option>
              <option value="uz">Uzbek</option>
              <option value="ru">Russian</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
            >
              <option value="Asia/Tashkent">Asia/Tashkent (UTC+5)</option>
              <option value="Europe/London">Europe/London (UTC+0)</option>
              <option value="Europe/Moscow">Europe/Moscow (UTC+3)</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
            >
              <option value="UZS">UZS</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Security */}
      <Card className="border-slate-200 bg-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Security
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Two-Factor Authentication for executive actions (e.g. approvals, high-impact changes).
        </p>
        <div className="mt-4 flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3">
          <div>
            <p className="font-medium text-slate-900">Two-Factor Authentication (2FA)</p>
            <p className="text-xs text-slate-500">Require 2FA for high-impact executive actions.</p>
          </div>
          <Switch
            checked={twoFactor}
            onCheckedChange={setTwoFactor}
            aria-label="Toggle 2FA for executive actions"
          />
        </div>
      </Card>
    </div>
  );
}
