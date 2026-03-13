"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

const CURRENT_VERSION = "2.4.1";

const RELEASE_NOTES = [
  { version: "2.4.1", date: "2026-03-01", notes: ["Security patch for session handling", "Improved backup retention logic", "Bug fix: gradebook export timezone"] },
  { version: "2.4.0", date: "2026-02-15", notes: ["Teams integration for lecture scheduling", "New admin audit log export", "Performance improvements for large courses"] },
  { version: "2.3.2", date: "2026-02-01", notes: ["Database index optimization", "Email template variables expansion", "Accessibility fixes in teacher dashboard"] },
  { version: "2.3.1", date: "2026-01-20", notes: ["Hotfix: payment callback race condition", "Log rotation tuning"] },
  { version: "2.3.0", date: "2026-01-10", notes: ["Disaster recovery failover controls", "Maintenance window scheduling", "API rate limit dashboard"] },
];

export default function UpdatesPage() {
  const [checking, setChecking] = React.useState(false);
  const [checkResult, setCheckResult] = React.useState<string | null>(null);

  const checkForUpdates = () => {
    setChecking(true);
    setCheckResult(null);
    setTimeout(() => {
      setChecking(false);
      setCheckResult("You are on the latest version.");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/maintenance" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Maintenance
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Updates</h1>
          <p className="mt-1 text-sm text-slate-600">
            Current system version and release notes.
          </p>
        </div>
        <nav className="flex gap-2">
          <Link href="/admin/maintenance" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">Backups</Link>
          <Link href="/admin/maintenance/updates" className="inline-flex h-9 items-center rounded-md bg-slate-100 px-3 text-sm font-medium text-slate-900">Updates</Link>
          <Link href="/admin/maintenance/database" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">Database</Link>
          <Link href="/admin/maintenance/disaster-recovery" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">Disaster Recovery</Link>
        </nav>
      </div>

      <Card className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Current version
        </h2>
        <p className="mt-2 text-2xl font-bold text-slate-900">{CURRENT_VERSION}</p>
        <div className="mt-4">
          <Button variant="primary" size="sm" onClick={checkForUpdates} disabled={checking}>
            {checking ? "Checking…" : "Check for Updates"}
          </Button>
          {checkResult && <p className="mt-2 text-sm text-slate-600">{checkResult}</p>}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Release notes
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Previous versions and changes.
        </p>
        <ul className="mt-4 space-y-6">
          {RELEASE_NOTES.map((release) => (
            <li key={release.version} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">v{release.version}</span>
                <span className="text-sm text-slate-500">{release.date}</span>
              </div>
              <ul className="mt-2 list-inside list-disc space-y-0.5 text-sm text-slate-600">
                {release.notes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
