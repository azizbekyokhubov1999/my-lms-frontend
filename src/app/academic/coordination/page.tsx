"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../components/ui/Card";

const SECTIONS = [
  { href: "/academic/coordination/finance", title: "Finance coordination", description: "View financial blocks and request temporary unlocks for academic reasons.", icon: "💰" },
  { href: "/academic/coordination/aqad", title: "AQAD sync", description: "Quality audits for programs and curriculum improvement requests.", icon: "📋" },
  { href: "/academic/coordination/resources", title: "Resource requests", description: "Request teachers or specialized rooms from Resource Dept.", icon: "🏫" },
  { href: "/academic/coordination/admin", title: "Admin requests", description: "Request new user roles or system configuration changes.", icon: "⚙️" },
];

const RECENT_TICKETS = [
  { id: "FIN-001", section: "Finance", subject: "Temporary unlock – STU-10002", status: "pending" as const },
  { id: "AQAD-002", section: "AQAD", subject: "Curriculum improvement – BSc SD", status: "approved" as const },
  { id: "RES-003", section: "Resources", subject: "Room A101 – CS101", status: "rejected" as const },
];

const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
};

export default function CoordinationPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/academic/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Dashboard
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Coordination</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Service desk: Finance, AQAD, Resources, and Admin requests. Track ticket status (Pending, Approved, Rejected).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SECTIONS.map((s) => (
          <Link key={s.href} href={s.href}>
            <Card className="h-full border-purple-200 bg-purple-50/30 p-4 transition-shadow hover:shadow-md">
              <span className="text-2xl">{s.icon}</span>
              <h2 className="mt-2 font-semibold text-slate-900">{s.title}</h2>
              <p className="mt-0.5 text-sm text-slate-600">{s.description}</p>
              <p className="mt-2 text-sm font-medium text-purple-700">Open →</p>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Recent tickets</h2>
        <p className="mt-0.5 text-xs text-slate-600">Across all coordination areas.</p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Ticket</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Section</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Subject</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {RECENT_TICKETS.map((t) => (
                <tr key={t.id} className="hover:bg-purple-50/50">
                  <td className="px-4 py-3 font-mono font-medium text-slate-900">{t.id}</td>
                  <td className="px-4 py-3 text-slate-700">{t.section}</td>
                  <td className="px-4 py-3 text-slate-700">{t.subject}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[t.status]}`}>
                      {t.status}
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
