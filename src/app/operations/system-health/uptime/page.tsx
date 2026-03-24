import Link from "next/link";

export default function SystemHealthUptimePage() {
  return (
    <div className="space-y-5">
      <div>
        <Link
          href="/operations/system-health"
          className="inline-flex items-center rounded-lg border border-indigo-400/60 bg-indigo-400/10 px-3 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-indigo-400/20"
        >
          Back to System Overview
        </Link>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Uptime Analytics</h1>
        <p className="mt-1 text-sm text-slate-600">
          Service availability and reliability tracking.
        </p>
      </div>
    </div>
  );
}

