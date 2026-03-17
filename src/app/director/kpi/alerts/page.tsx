"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Switch } from "../../../components/ui/Switch";

interface TriggerConfig {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  operator: "below" | "above";
  value: string;
  unit: string;
}

const DEFAULT_TRIGGERS: TriggerConfig[] = [
  { id: "attendance", label: "Attendance", description: "Alert me if attendance drops below", enabled: true, operator: "below", value: "75", unit: "%" },
  { id: "gpa", label: "GPA", description: "Alert me if average GPA falls below", enabled: true, operator: "below", value: "3.0", unit: "" },
  { id: "enrollment", label: "Enrollment", description: "Alert me if enrollment drops below", enabled: false, operator: "below", value: "10000", unit: " students" },
  { id: "budget", label: "Budget utilization", description: "Alert me if budget utilization goes above", enabled: true, operator: "above", value: "105", unit: "%" },
];

export default function KPIAlertsPage() {
  const [triggers, setTriggers] = React.useState<TriggerConfig[]>(DEFAULT_TRIGGERS);

  const updateTrigger = (id: string, patch: Partial<TriggerConfig>) => {
    setTriggers((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/director/kpi" className="text-sm font-medium text-slate-500 hover:text-slate-300">
          ← KPI Dashboard
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">KPI Alerts</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Set trigger points. You will be notified when a KPI crosses the threshold.
        </p>
      </div>

      <Card className="border-slate-200 bg-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Trigger points
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Enable and set the threshold for each alert (e.g. &quot;Alert me if attendance drops below 75%&quot;).
        </p>
        <ul className="mt-4 space-y-4">
          {triggers.map((t) => (
            <li
              key={t.id}
              className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-900">{t.label}</p>
                <p className="mt-0.5 text-xs text-slate-500">{t.description}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">
                    {t.operator === "below" ? "below" : "above"}
                  </span>
                  <Input
                    type="text"
                    value={t.value}
                    onChange={(e) => updateTrigger(t.id, { value: e.target.value })}
                    className="w-24"
                    aria-label={`${t.label} threshold`}
                  />
                  <span className="text-sm text-slate-600">{t.unit}</span>
                </div>
                <Switch
                  checked={t.enabled}
                  onCheckedChange={(checked) => updateTrigger(t.id, { enabled: checked })}
                  aria-label={`Toggle ${t.label} alert`}
                />
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-slate-500">
          Changes are saved automatically. Notifications will be sent to your registered email and in-app.
        </p>
      </Card>
    </div>
  );
}
