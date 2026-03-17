"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../components/ui/Card";
import { Switch } from "../../components/ui/Switch";

export default function DirectorSettingsPage() {
  const [executiveEmail, setExecutiveEmail] = React.useState(true);
  const [executiveSms, setExecutiveSms] = React.useState(false);
  const [highOnly, setHighOnly] = React.useState(false);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/director" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          ← Deputy Director
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Executive alerts and notification preferences.
        </p>
      </div>

      {/* Executive Alerts – SMS/Email for incidents */}
      <Card className="border-slate-200 bg-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Executive alerts
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          SMS and/or email notifications for critical incidents (e.g. finance drops, major resignations, systemic issues).
        </p>
        <ul className="mt-4 space-y-4">
          <li className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3">
            <div>
              <p className="font-medium text-slate-900">Email notifications</p>
              <p className="text-xs text-slate-500">Receive incident alerts by email.</p>
            </div>
            <Switch
              checked={executiveEmail}
              onCheckedChange={setExecutiveEmail}
              aria-label="Toggle executive email alerts"
            />
          </li>
          <li className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3">
            <div>
              <p className="font-medium text-slate-900">SMS notifications</p>
              <p className="text-xs text-slate-500">Receive critical incident alerts by SMS.</p>
            </div>
            <Switch
              checked={executiveSms}
              onCheckedChange={setExecutiveSms}
              aria-label="Toggle executive SMS alerts"
            />
          </li>
          <li className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3">
            <div>
              <p className="font-medium text-slate-900">High-priority only</p>
              <p className="text-xs text-slate-500">Only send alerts for High-priority incidents (not Medium/Low).</p>
            </div>
            <Switch
              checked={highOnly}
              onCheckedChange={setHighOnly}
              aria-label="Toggle high-priority only"
            />
          </li>
        </ul>
      </Card>
    </div>
  );
}
