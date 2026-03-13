"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

export default function DatabaseMaintenancePage() {
  const [indexRunning, setIndexRunning] = React.useState(false);
  const [logRunning, setLogRunning] = React.useState(false);
  const [cacheRunning, setCacheRunning] = React.useState(false);
  const [indexDone, setIndexDone] = React.useState(false);
  const [logDone, setLogDone] = React.useState(false);
  const [cacheDone, setCacheDone] = React.useState(false);

  const runIndexOptimization = () => {
    setIndexRunning(true);
    setIndexDone(false);
    setTimeout(() => {
      setIndexRunning(false);
      setIndexDone(true);
    }, 2500);
  };

  const runLogCleaning = () => {
    setLogRunning(true);
    setLogDone(false);
    setTimeout(() => {
      setLogRunning(false);
      setLogDone(true);
    }, 2000);
  };

  const runCacheFlushing = () => {
    setCacheRunning(true);
    setCacheDone(false);
    setTimeout(() => {
      setCacheRunning(false);
      setCacheDone(true);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/maintenance" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Maintenance
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Database Maintenance</h1>
          <p className="mt-1 text-sm text-slate-600">
            Index optimization, log cleaning, and cache flushing.
          </p>
        </div>
        <nav className="flex gap-2">
          <Link href="/admin/maintenance" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">Backups</Link>
          <Link href="/admin/maintenance/updates" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">Updates</Link>
          <Link href="/admin/maintenance/database" className="inline-flex h-9 items-center rounded-md bg-slate-100 px-3 text-sm font-medium text-slate-900">Database</Link>
          <Link href="/admin/maintenance/disaster-recovery" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">Disaster Recovery</Link>
        </nav>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Index optimization
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Rebuild and analyze indexes to improve query performance. Run during low traffic.
          </p>
          <Button
            variant="primary"
            size="sm"
            className="mt-4"
            onClick={runIndexOptimization}
            disabled={indexRunning}
          >
            {indexRunning ? "Running…" : "Run Index Optimization"}
          </Button>
          {indexDone && <p className="mt-2 text-sm text-emerald-600">Completed successfully.</p>}
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Log cleaning
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Archive or purge old database logs to free space. Keeps recent logs for auditing.
          </p>
          <Button
            variant="primary"
            size="sm"
            className="mt-4"
            onClick={runLogCleaning}
            disabled={logRunning}
          >
            {logRunning ? "Running…" : "Run Log Cleaning"}
          </Button>
          {logDone && <p className="mt-2 text-sm text-emerald-600">Completed successfully.</p>}
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Cache flushing
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Clear application and Redis cache. Use after major data changes or to resolve stale data.
          </p>
          <Button
            variant="primary"
            size="sm"
            className="mt-4"
            onClick={runCacheFlushing}
            disabled={cacheRunning}
          >
            {cacheRunning ? "Running…" : "Run Cache Flushing"}
          </Button>
          {cacheDone && <p className="mt-2 text-sm text-emerald-600">Completed successfully.</p>}
        </Card>
      </div>
    </div>
  );
}
