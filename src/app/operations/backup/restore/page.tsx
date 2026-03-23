"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Card } from "../../../components/ui/Card";

type RestoreStep = 1 | 2 | 3;

type BackupPoint = {
  id: string;
  label: string;
  ts: string; // ISO
  sizeGB: number;
  checksumOk: boolean;
};

type RestoreEvent = {
  id: string;
  ts: string;
  level: "INFO" | "WARN" | "DONE";
  message: string;
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function randomId() {
  return Math.random().toString(16).slice(2, 10);
}

export default function RestorePage() {
  const router = useRouter();

  const backupPoints: BackupPoint[] = React.useMemo(
    () => [
      {
        id: "rp-latest",
        label: "Latest Successful Backup",
        ts: new Date(Date.now() - 2 * 3600_000).toISOString(),
        sizeGB: 185,
        checksumOk: true,
      },
      {
        id: "rp-daily-1",
        label: "Daily Backup (Yesterday 02:00)",
        ts: new Date(Date.now() - 26 * 3600_000).toISOString(),
        sizeGB: 179,
        checksumOk: true,
      },
      {
        id: "rp-daily-2",
        label: "Daily Backup (2 days ago 02:00)",
        ts: new Date(Date.now() - 50 * 3600_000).toISOString(),
        sizeGB: 172,
        checksumOk: true,
      },
    ],
    [],
  );

  const [step, setStep] = React.useState<RestoreStep>(1);
  const [selectedId, setSelectedId] = React.useState<string>(backupPoints[0]?.id ?? "");

  const [target, setTarget] = React.useState<"Production" | "Staging">("Production");
  const [confirmChecked, setConfirmChecked] = React.useState(false);

  const [progress, setProgress] = React.useState(0);
  const [restoring, setRestoring] = React.useState(false);
  const [events, setEvents] = React.useState<RestoreEvent[]>([]);

  const selected = backupPoints.find((b) => b.id === selectedId) ?? backupPoints[0];

  const canContinue = React.useMemo(() => {
    if (step === 1) return Boolean(selectedId);
    if (step === 2) return confirmChecked;
    return false;
  }, [confirmChecked, selectedId, step]);

  const nextStep = () => {
    if (!canContinue) return;
    setStep((s) => (s === 1 ? 2 : 3));
  };

  const resetAndBack = () => {
    router.push("/operations/backup");
  };

  const startRestore = React.useCallback(() => {
    if (!selected || restoring) return;

    setRestoring(true);
    setProgress(0);
    setEvents([
      {
        id: randomId(),
        ts: new Date().toISOString(),
        level: "INFO",
        message: `Preparing restore into ${target}...`,
      },
    ]);

    const id = window.setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + 8 + Math.floor(Math.random() * 5));
        setEvents((prev) => {
          const now = new Date().toISOString();
          if (next >= 100) {
            return [
              ...prev,
              {
                id: randomId(),
                ts: now,
                level: "DONE",
                message: "Restore completed successfully.",
              },
            ];
          }

          if (next > 20 && next < 35) {
            return [
              ...prev,
              { id: randomId(), ts: now, level: "INFO", message: "Verifying checksum..." },
            ];
          }
          if (next > 40 && next < 60) {
            return [
              ...prev,
              { id: randomId(), ts: now, level: "INFO", message: "Rehydrating storage volumes..." },
            ];
          }
          if (next > 70 && next < 85) {
            return [
              ...prev,
              { id: randomId(), ts: now, level: "INFO", message: "Updating indexes and caches..." },
            ];
          }
          return prev;
        });
        return next;
      });
    }, 600);

    window.setTimeout(() => {
      window.clearInterval(id);
      setRestoring(false);
      setProgress(100);
      setStep(3);
    }, 9000);
  }, [restoring, selected, target]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">Restore Now</h1>
        <p className="mt-1 text-sm text-slate-100/70">
          Step-by-step restore wizard with progress and event log.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-indigo-400/30 bg-slate-950 lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-100">
                Step {step} of 3
              </p>
              <p className="mt-1 text-xs text-slate-100/60">
                Select backup point, confirm restore, then monitor progress.
              </p>
            </div>
            <button
              type="button"
              onClick={resetAndBack}
              className="rounded-lg border border-indigo-400/30 bg-slate-900/30 px-3 py-2 text-sm text-slate-100/80 transition-colors hover:bg-indigo-400/10"
            >
              Back to Schedule
            </button>
          </div>

          <div className="mt-6">
            {step === 1 ? (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-slate-100">
                  1) Select Backup Point
                </h2>
                <div className="grid gap-3">
                  {backupPoints.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedId(b.id)}
                      className={[
                        "flex flex-col gap-1 rounded-xl border px-4 py-3 text-left transition-colors",
                        selectedId === b.id
                          ? "border-indigo-400/60 bg-indigo-400/10"
                          : "border-indigo-400/20 bg-slate-900/20 hover:border-indigo-400/40 hover:bg-indigo-400/5",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-100">{b.label}</p>
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                            b.checksumOk
                              ? "border-indigo-400/40 bg-indigo-400/10 text-indigo-100"
                              : "border-amber-500/40 bg-amber-500/10 text-amber-100"
                          }`}
                        >
                          {b.checksumOk ? "Checksum OK" : "Checksum Warning"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-100/60">
                        {formatDateTime(b.ts)} · Size: {b.sizeGB}GB
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-slate-100">
                  2) Confirm Restore
                </h2>

                <div className="rounded-xl border border-indigo-400/20 bg-indigo-400/5 p-4">
                  <p className="text-sm font-semibold text-slate-100">
                    Target:{" "}
                    <span className="text-slate-100">{target}</span>
                  </p>
                  <p className="mt-2 text-sm text-slate-100/70">
                    Backup point:{" "}
                    <span className="font-semibold text-slate-100">{selected?.label}</span>
                  </p>
                  <p className="mt-2 text-xs text-slate-100/60">
                    {selected ? formatDateTime(selected.ts) : ""}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-100/70">
                      Restore target
                    </label>
                    <select
                      value={target}
                      onChange={(e) =>
                        setTarget(e.target.value as "Production" | "Staging")
                      }
                      className="mt-2 w-full rounded-lg border border-indigo-400/30 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400/60"
                    >
                      <option value="Production">Production</option>
                      <option value="Staging">Staging</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-start gap-3 md:justify-end">
                    <label className="flex items-center gap-3 rounded-xl border border-indigo-400/20 bg-slate-900/20 px-4 py-3 text-sm text-slate-100/80">
                      <input
                        type="checkbox"
                        checked={confirmChecked}
                        onChange={(e) => setConfirmChecked(e.target.checked)}
                      />
                      I understand this may impact services.
                    </label>
                  </div>
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-slate-100">
                  3) Restoration Progress
                </h2>

                <div className="rounded-xl border border-indigo-400/20 bg-indigo-400/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-100">
                      {restoring ? "Restoring..." : progress >= 100 ? "Restore Complete" : "Ready to start"}
                    </p>
                    <p className="text-xs text-slate-100/60">
                      Progress: {progress}%
                    </p>
                  </div>

                  <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-900">
                    <div
                      className="h-full rounded-full bg-indigo-400"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-100">
                      Event Log
                    </p>
                    <button
                      type="button"
                      onClick={startRestore}
                      disabled={restoring}
                      className="rounded-xl border border-indigo-400/60 bg-indigo-400/10 px-4 py-2 text-sm font-medium text-slate-100 transition-colors hover:bg-indigo-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {restoring ? "Restoring..." : "Start Restore"}
                    </button>
                  </div>

                  <div className="mt-3 max-h-[300px] overflow-y-auto rounded-xl border border-indigo-400/20 bg-slate-950 p-4 font-mono text-xs text-slate-100/80">
                    {events.length === 0 ? (
                      <div className="text-slate-100/60">No events yet.</div>
                    ) : null}
                    {events.map((ev) => (
                      <div key={ev.id} className="flex items-start gap-3 py-1">
                        <span className="w-[86px] shrink-0 text-slate-100/50">
                          {formatDateTime(ev.ts)}
                        </span>
                        <span
                          className={[
                            "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase",
                            ev.level === "DONE"
                              ? "border-indigo-400/40 bg-indigo-400/10 text-indigo-100"
                              : ev.level === "WARN"
                                ? "border-amber-500/40 bg-amber-500/10 text-amber-100"
                                : "border-indigo-400/30 bg-indigo-400/5 text-indigo-100",
                          ].join(" ")}
                        >
                          {ev.level}
                        </span>
                        <span className="min-w-0 wrap-break-word">{ev.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
            {step !== 3 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!canContinue}
                className="rounded-xl border border-indigo-400/60 bg-indigo-400/10 px-4 py-3 text-sm font-medium text-slate-100 transition-colors hover:bg-indigo-400/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Continue
              </button>
            ) : null}
            {step === 3 ? (
              <button
                type="button"
                onClick={() => router.push("/operations/backup")}
                className="rounded-xl border border-indigo-400/60 bg-indigo-400/10 px-4 py-3 text-sm font-medium text-slate-100 transition-colors hover:bg-indigo-400/20"
              >
                Done
              </button>
            ) : null}
          </div>
        </Card>

        <Card className="border-indigo-400/30 bg-slate-950">
          <h2 className="text-sm font-semibold text-slate-100">
            Restore Safety Notes
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-100/70">
            <li>✓ Always verify checksum before restoring.</li>
            <li>✓ Use Staging first for complex migrations.</li>
            <li>✓ Ensure backups are within retention window.</li>
            <li>✓ Plan maintenance window for Production restores.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

