import Link from "next/link";

import { Card } from "../../../components/ui/Card";

export default function IntegrationSubpageShell({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-5 bg-slate-50">
      <div>
        <Link
          href="/operations/integrations"
          className="inline-flex items-center rounded-lg border border-indigo-400/60 bg-indigo-400/10 px-3 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-indigo-400/20"
        >
          Back to Integrations
        </Link>
      </div>

      <Card className="rounded-xl border-slate-200 bg-white shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-600">{description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex items-center rounded-lg border border-indigo-400/60 bg-indigo-400/10 px-3 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-indigo-400/20"
          >
            Test Connectivity
          </button>
          <button
            type="button"
            className="inline-flex items-center rounded-lg border border-indigo-400/60 bg-indigo-400/10 px-3 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-indigo-400/20"
          >
            View Logs
          </button>
        </div>
      </Card>
    </div>
  );
}

