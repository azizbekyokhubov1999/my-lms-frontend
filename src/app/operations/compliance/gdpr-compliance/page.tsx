import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { Card } from "@/app/components/ui/Card";

const RTBF_REQUESTS = [
  {
    id: "rtbf-1",
    subject: "user-8821@student.edu",
    requestedAt: "2026-03-20",
    dueBy: "2026-04-19",
    status: "In progress" as const,
  },
  {
    id: "rtbf-2",
    subject: "alumni-441@alumni.edu",
    requestedAt: "2026-03-18",
    dueBy: "2026-04-17",
    status: "Completed" as const,
  },
];

const PII_ACCESS = [
  { id: "p1", actor: "support.agent", subject: "student-1203", field: "Email + phone", at: "2026-03-24 08:12" },
  { id: "p2", actor: "dpo.reviewer", subject: "staff-901", field: "HR record", at: "2026-03-23 15:40" },
  { id: "p3", actor: "ops.admin", subject: "applicant-77", field: "ID document metadata", at: "2026-03-22 11:05" },
];

export default function GdprCompliancePage() {
  return (
    <div className="space-y-4 bg-slate-50 text-slate-900">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/operations/compliance"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          Back to Compliance Hub
        </Link>
        <ShieldCheck className="h-6 w-6 text-indigo-400" />
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">GDPR Compliance</h1>
        <p className="mt-1 text-sm text-slate-600">
          Monitor Right to be Forgotten (erasure) requests and PII access activity.
        </p>

        <h2 className="mt-6 text-sm font-semibold text-slate-900">Right to be Forgotten</h2>
        <div className="mt-2 overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3">Data subject</th>
                <th className="px-4 py-3">Requested</th>
                <th className="px-4 py-3">Due</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {RTBF_REQUESTS.map((r) => (
                <tr key={r.id} className="border-t border-slate-200 text-slate-700">
                  <td className="px-4 py-3 font-medium text-slate-900">{r.subject}</td>
                  <td className="px-4 py-3">{r.requestedAt}</td>
                  <td className="px-4 py-3">{r.dueBy}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                        r.status === "Completed"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                          : "border-amber-200 bg-amber-50 text-amber-600"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-8 text-sm font-semibold text-slate-900">PII access log</h2>
        <p className="mt-1 text-xs text-slate-500">Who accessed which subject data and when.</p>
        <div className="mt-2 overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Actor</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">PII scope</th>
              </tr>
            </thead>
            <tbody>
              {PII_ACCESS.map((row) => (
                <tr key={row.id} className="border-t border-slate-200 text-slate-700">
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{row.at}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{row.actor}</td>
                  <td className="px-4 py-3">{row.subject}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
                      {row.field}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
