"use client";

import * as React from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";

import { Card } from "@/app/components/ui/Card";

type Step = 1 | 2 | 3;

type BackupVersion = {
  id: string;
  label: string;
  size: string;
};

const VERSIONS: BackupVersion[] = [
  { id: "v1", label: "Latest Successful Backup (2h ago)", size: "125 GB" },
  { id: "v2", label: "Daily Backup (Yesterday)", size: "124 GB" },
  { id: "v3", label: "Daily Backup (2 days ago)", size: "123 GB" },
];

export default function RestorePage() {
  const [step, setStep] = React.useState<Step>(1);
  const [versionId, setVersionId] = React.useState(VERSIONS[0].id);
  const [targetDb, setTargetDb] = React.useState("Production DB");
  const [progress, setProgress] = React.useState(0);
  const [running, setRunning] = React.useState(false);

  const startRestoration = () => {
    if (running) return;
    setStep(3);
    setRunning(true);
    setProgress(0);

    const intervalId = window.setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + 10, 100);
        if (next >= 100) {
          window.clearInterval(intervalId);
          setRunning(false);
        }
        return next;
      });
    }, 400);
  };

  return (
    <div className="space-y-5 bg-slate-50 text-slate-900">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Link href="/operations/backup" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Back to Backup Hub
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">Restore Center</h1>
          <p className="mt-1 text-sm text-slate-600">Step-by-step restoration workflow with progress tracking.</p>
        </div>
        <RotateCcw className="h-6 w-6 text-indigo-400" />
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <span className={step >= 1 ? "text-indigo-600" : ""}>Step 1</span>
          <span>-&gt;</span>
          <span className={step >= 2 ? "text-indigo-600" : ""}>Step 2</span>
          <span>-&gt;</span>
          <span className={step >= 3 ? "text-indigo-600" : ""}>Step 3</span>
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Select Backup Version</h2>
            <div className="space-y-2">
              {VERSIONS.map((version) => (
                <label key={version.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                  <span className="text-sm text-slate-700">{version.label}</span>
                  <input
                    type="radio"
                    name="backupVersion"
                    checked={versionId === version.id}
                    onChange={() => setVersionId(version.id)}
                    className="h-4 w-4 accent-indigo-500"
                  />
                </label>
              ))}
            </div>
            <button type="button" onClick={() => setStep(2)} className="rounded-md border border-indigo-400 bg-indigo-400 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
              Continue
            </button>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Select Target Database</h2>
            <select
              value={targetDb}
              onChange={(e) => setTargetDb(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-400 focus:ring-2"
            >
              <option>Production DB</option>
              <option>Staging DB</option>
              <option>Disaster Recovery DB</option>
            </select>
            <div className="flex gap-2">
              <button type="button" onClick={() => setStep(1)} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                Back
              </button>
              <button type="button" onClick={startRestoration} className="rounded-md border border-indigo-400 bg-indigo-400 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
                Start Restoration
              </button>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Restoration Progress</h2>
            <p className="text-sm text-slate-600">Version: {versionId} | Target: {targetDb}</p>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-indigo-400" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-sm font-medium text-slate-700">{progress}% complete {running ? "(restoring...)" : "(done)"}</p>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
