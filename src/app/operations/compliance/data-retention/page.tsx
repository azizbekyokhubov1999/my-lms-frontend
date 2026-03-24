"use client";

import * as React from "react";
import Link from "next/link";
import { Archive } from "lucide-react";

import { Card } from "@/app/components/ui/Card";

const PERIODS = ["3 months", "1 year", "3 years", "7 years", "Indefinite (legal hold)"] as const;

type Period = (typeof PERIODS)[number];

export default function DataRetentionPage() {
  const [logs, setLogs] = React.useState<Period>("1 year");
  const [backups, setBackups] = React.useState<Period>("3 years");
  const [userData, setUserData] = React.useState<Period>("3 years");
  const [saved, setSaved] = React.useState("");

  const save = () => {
    setSaved(
      `Retention saved: Logs ${logs}, Backups ${backups}, User data ${userData}.`,
    );
  };

  return (
    <div className="space-y-4 bg-slate-50 text-slate-900">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/operations/compliance"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          Back to Compliance Hub
        </Link>
        <Archive className="h-6 w-6 text-indigo-400" />
      </div>
      <Card className="border-slate-200 bg-white shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">Data Retention</h1>
        <p className="mt-1 text-sm text-slate-600">
          Define retention periods for logs, backups, and user data in line with policy and regulation.
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-1 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-slate-700">Logs</label>
            <select
              value={logs}
              onChange={(e) => setLogs(e.target.value as Period)}
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-400 focus:ring-2"
            >
              {PERIODS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Backups</label>
            <select
              value={backups}
              onChange={(e) => setBackups(e.target.value as Period)}
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-400 focus:ring-2"
            >
              {PERIODS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">User data</label>
            <select
              value={userData}
              onChange={(e) => setUserData(e.target.value as Period)}
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-400 focus:ring-2"
            >
              {PERIODS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={save}
          className="mt-6 rounded-md border border-indigo-400 bg-indigo-400 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Save retention settings
        </button>
        {saved ? <p className="mt-3 text-sm font-medium text-indigo-600">{saved}</p> : null}
      </Card>
    </div>
  );
}
