"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function DisasterRecoveryPage() {
  const [failoverActive, setFailoverActive] = React.useState(false);
  const [readOnlyActive, setReadOnlyActive] = React.useState(false);
  const [switchingFailover, setSwitchingFailover] = React.useState(false);
  const [togglingReadOnly, setTogglingReadOnly] = React.useState(false);

  const switchFailover = () => {
    if (!confirm("Switch to Failover Server? All write traffic will go to the secondary. Continue?")) return;
    setSwitchingFailover(true);
    setTimeout(() => {
      setFailoverActive(!failoverActive);
      setSwitchingFailover(false);
    }, 2000);
  };

  const toggleReadOnly = () => {
    if (readOnlyActive) {
      if (!confirm("Disable read-only mode? Writes will be allowed again.")) return;
    } else {
      if (!confirm("Enable read-only mode? All write operations will be rejected. Use during emergencies.")) return;
    }
    setTogglingReadOnly(true);
    setTimeout(() => {
      setReadOnlyActive(!readOnlyActive);
      setTogglingReadOnly(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/maintenance" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Maintenance
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Disaster Recovery</h1>
          <p className="mt-1 text-sm text-slate-600">
            Failover server and read-only mode for emergencies.
          </p>
        </div>
        <nav className="flex gap-2">
          <Link href="/admin/maintenance" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">Backups</Link>
          <Link href="/admin/maintenance/updates" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">Updates</Link>
          <Link href="/admin/maintenance/database" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">Database</Link>
          <Link href="/admin/maintenance/disaster-recovery" className="inline-flex h-9 items-center rounded-md bg-slate-100 px-3 text-sm font-medium text-slate-900">Disaster Recovery</Link>
        </nav>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className={cn("p-6", failoverActive && "border-amber-300 bg-amber-50/30")}>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Failover server
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Switch traffic to the secondary server when the primary is unavailable. High-level control only; full failover is managed by infrastructure.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium",
                failoverActive ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800",
              )}
            >
              {failoverActive ? "Failover active" : "Primary active"}
            </span>
            <Button
              variant={failoverActive ? "secondary" : "primary"}
              size="sm"
              onClick={switchFailover}
              disabled={switchingFailover}
            >
              {switchingFailover ? "Switching…" : failoverActive ? "Switch to Primary" : "Switch to Failover Server"}
            </Button>
          </div>
        </Card>

        <Card className={cn("p-6", readOnlyActive && "border-red-200 bg-red-50/30")}>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Read-only mode
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Activate during emergencies to block all writes. Users can still view data. Disable when the incident is resolved.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium",
                readOnlyActive ? "bg-red-100 text-red-800" : "bg-slate-100 text-slate-700",
              )}
            >
              {readOnlyActive ? "Read-only active" : "Writes allowed"}
            </span>
            <Button
              variant={readOnlyActive ? "secondary" : "primary"}
              size="sm"
              onClick={toggleReadOnly}
              disabled={togglingReadOnly}
            >
              {togglingReadOnly ? "Updating…" : readOnlyActive ? "Disable Read-only" : "Activate Read-only Mode"}
            </Button>
          </div>
        </Card>
      </div>

      <p className="text-xs text-slate-500">
        These controls are for emergency use. Coordinate with your infrastructure team before switching failover or enabling read-only mode.
      </p>
    </div>
  );
}
