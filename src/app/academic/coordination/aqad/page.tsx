"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type Status = "pending" | "approved" | "rejected";

const MOCK_AUDITS = [
  { id: "AQAD-001", program: "BSc Software Development", type: "Quality audit", finding: "Curriculum alignment with industry standards.", status: "approved" as Status, respondedAt: "2026-03-01" },
  { id: "AQAD-002", program: "BSc Software Development", type: "Curriculum improvement", finding: "Request to add module on DevOps. AQAD reference #CI-2026-08.", status: "pending" as Status, respondedAt: "" },
  { id: "AQAD-003", program: "MBA Business Administration", type: "Curriculum improvement", finding: "Suggested update to Strategy course learning outcomes.", status: "pending" as Status, respondedAt: "" },
];

const MOCK_TICKETS = [
  { id: "AQAD-002", subject: "Curriculum improvement – BSc SD", status: "approved" as Status },
  { id: "AQAD-004", subject: "Learning outcomes – MBA Strategy", status: "pending" as Status },
];

const MOCK_REFERRED_ADMISSIONS = [
  { id: "REF-001", applicant: "Anna Petrova", applicantId: "a1", referredAt: "2026-03-05", reason: "Borderline entrance exam score; request AQAD ruling on eligibility criteria." },
  { id: "REF-002", applicant: "Dmitri Volkov", applicantId: "a4", referredAt: "2026-03-04", reason: "Disputed document verification. Needs higher-level review." },
];

const MOCK_PROGRAM_APPROVALS = [
  { id: "PRG-001", program: "MBA Business Administration", code: "MBA-BA", requestedAt: "2026-03-01", aqadStatus: "Pending Approval" as const },
  { id: "PRG-002", program: "LLB Law", code: "LLB", requestedAt: "2026-02-28", aqadStatus: "Pending Approval" as const },
];

const STATUS_STYLES: Record<Status, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
};

export default function AQADSyncPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/academic/coordination" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Coordination
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">AQAD sync</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Quality audits for programs. Referred admission cases and program approval requests. Ticket status: Pending / Approved / Rejected.
        </p>
      </div>

      {/* Referred Admission Cases */}
      <Card className="p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Referred admission cases</h2>
        <p className="mt-0.5 text-xs text-slate-600">Admission decisions referred to AQAD for higher review or dispute resolution.</p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Ref ID</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Applicant</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Referred</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Reason / note</th>
                <th className="w-24 px-4 py-3 text-right font-medium text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_REFERRED_ADMISSIONS.map((r) => (
                <tr key={r.id} className="hover:bg-purple-50/50">
                  <td className="px-4 py-3 font-mono font-medium text-slate-900">{r.id}</td>
                  <td className="px-4 py-3 text-slate-700">{r.applicant}</td>
                  <td className="px-4 py-3 text-slate-600">{r.referredAt}</td>
                  <td className="px-4 py-3 text-slate-600">{r.reason}</td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="border-amber-500 text-amber-600 hover:bg-amber-50"
                      onClick={() => alert(`Review referred case ${r.id} (Demo).`)}
                    >
                      Review
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Program Approval Requests */}
      <Card className="p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Program approval requests</h2>
        <p className="mt-0.5 text-xs text-slate-600">Programs awaiting AQAD approval. Track status here.</p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">ID</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Program</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Code</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Requested</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">AQAD status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_PROGRAM_APPROVALS.map((p) => (
                <tr key={p.id} className="hover:bg-purple-50/50">
                  <td className="px-4 py-3 font-mono font-medium text-slate-900">{p.id}</td>
                  <td className="px-4 py-3 text-slate-700">{p.program}</td>
                  <td className="px-4 py-3 font-mono text-slate-600">{p.code}</td>
                  <td className="px-4 py-3 text-slate-600">{p.requestedAt}</td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", "bg-amber-100 text-amber-700")}>
                      {p.aqadStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Quality audits & curriculum requests</h2>
        <p className="mt-0.5 text-xs text-slate-600">From AQAD. Respond with approval or rejection.</p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">ID</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Program</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Type</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Finding / request</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                <th className="w-24 px-4 py-3 text-right font-medium text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_AUDITS.map((a) => (
                <tr key={a.id} className="hover:bg-purple-50/50">
                  <td className="px-4 py-3 font-mono font-medium text-slate-900">{a.id}</td>
                  <td className="px-4 py-3 text-slate-700">{a.program}</td>
                  <td className="px-4 py-3 text-slate-700">{a.type}</td>
                  <td className="px-4 py-3 text-slate-600">{a.finding}</td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize", STATUS_STYLES[a.status])}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {a.status === "pending" && (
                      <Button
                        type="button"
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={() => alert(`Respond to ${a.id} (Demo). Approve or reject with comment.`)}
                      >
                        Respond
                      </Button>
                    )}
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
