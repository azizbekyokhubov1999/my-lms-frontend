import Link from "next/link";

import IntegrationSubpageShell from "../_components/IntegrationSubpageShell";

export default function IntegrationsOneCPage() {
  return (
    <div className="space-y-5 bg-slate-50">
      <IntegrationSubpageShell
        title="1C (OneC) Integration"
        description="Overview for OneC connectivity, schema mapping, and reliability checks."
      />

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">OneC Sync Jobs</h2>
        <p className="mt-1 text-sm text-slate-600">
          Navigate to the dedicated sync-jobs workflow for OneC.
        </p>
        <div className="mt-4">
          <Link
            href="/operations/integrations/onec/sync-jobs"
            className="inline-flex items-center rounded-lg border border-indigo-400/60 bg-indigo-400/10 px-3 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-indigo-400/20"
          >
            Open OneC Sync Jobs
          </Link>
        </div>
      </div>
    </div>
  );
}
