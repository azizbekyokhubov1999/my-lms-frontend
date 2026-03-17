"use client";

import Link from "next/link";

export default function DirectorPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Deputy Director</h1>
      <p className="text-slate-600">
        Strategic overview. Use the sidebar to open Dashboard, KPI Center, or other sections.
      </p>
      <Link
        href="/director/dashboard"
        className="inline-flex items-center rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
