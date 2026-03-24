import { Shield } from "lucide-react";

import { SecuritySubpageShell } from "../_components/SecuritySubpageShell";

export default function SecurityDashboardPage() {
  return (
    <SecuritySubpageShell
      title="Security Dashboard"
      description="Track overall posture, active incidents, and control health in one place."
      icon={Shield}
      badgeText="Posture: Stable"
    >
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Risk Score</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">92/100</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Open Alerts</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">6</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Compliant Controls</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">24/25</p>
        </div>
      </div>
    </SecuritySubpageShell>
  );
}
