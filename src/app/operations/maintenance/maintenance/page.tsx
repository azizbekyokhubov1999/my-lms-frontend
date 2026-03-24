import { Server } from "lucide-react";

import { Card } from "@/app/components/ui/Card";

import { HubBackButton } from "../HubBackButton";

const METRICS = [
  { label: "CPU load", value: "32%", tone: "good" as const },
  { label: "Memory", value: "61%", tone: "good" as const },
  { label: "Disk I/O", value: "Normal", tone: "good" as const },
  { label: "App services", value: "12/12 up", tone: "good" as const },
];

const RUNTIME_SPECS = [
  { name: "Node.js (LTS)", value: "v22.14.0", detail: "Active LTS — runtime for API & SSR workers" },
  { name: "Package manager", value: "pnpm 10.6.4", detail: "Lockfile verified on last deploy" },
  { name: "Next.js", value: "15.2.1", detail: "App Router; edge middleware enabled" },
  { name: "Database", value: "PostgreSQL 16.4", detail: "Primary + 2 replicas (sync replication)" },
  { name: "DB extensions", value: "pgvector 0.7.0", detail: "Embedding index on course catalog" },
  { name: "OS build", value: "Ubuntu 24.04.2 LTS", detail: "Kernel 6.8.0-55-generic" },
  { name: "Container runtime", value: "containerd 1.7.24", detail: "Orchestrated via systemd / k8s node agent" },
];

function toneClass(tone: (typeof METRICS)[number]["tone"]) {
  if (tone === "good") return "border-emerald-500/35 bg-emerald-50 text-emerald-700";
  return "border-amber-500/35 bg-amber-50 text-amber-800";
}

export default function SystemMaintenanceDetailPage() {
  return (
    <div className="space-y-4 bg-slate-50 text-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <HubBackButton />
        <Server className="h-6 w-6 text-indigo-400" aria-hidden />
      </div>

      <div>
        <h1 className="text-xl font-semibold text-slate-900">System maintenance</h1>
        <p className="mt-1 text-sm text-slate-600">
          Live capacity signals, runtime inventory, and patch alignment for production.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((m) => (
          <Card key={m.label} className="border-slate-200 bg-white shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {m.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{m.value}</p>
            <span
              className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${toneClass(m.tone)}`}
            >
              Nominal
            </span>
          </Card>
        ))}
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Platform versioning</h2>
          <span className="inline-flex w-fit rounded-full border border-emerald-500/35 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            Drift check: OK
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-600">
          Authoritative runtime and datastore versions as reported by the last health probe.
        </p>

        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-[640px] w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-600">
                <th className="px-4 py-3">Component</th>
                <th className="px-4 py-3">Version / build</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {RUNTIME_SPECS.map((row) => (
                <tr key={row.name} className="border-t border-slate-200">
                  <td className="px-4 py-3 font-medium text-slate-900">{row.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-800">{row.value}</td>
                  <td className="px-4 py-3 text-slate-600">{row.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
