"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type ExceptionType = "debt" | "attendance" | "prerequisite";

interface Waiver {
  id: string;
  studentName: string;
  studentId: string;
  type: ExceptionType;
  validUntil: string;
  reason: string;
  grantedBy: string;
  grantedAt: string;
}

const MOCK_WAIVERS: Waiver[] = [
  { id: "w1", studentName: "Ivan Kozlov", studentId: "STU-10002", type: "debt", validUntil: "2026-03-15", reason: "Payment plan agreed with Finance. Allowed to sit mid-terms.", grantedBy: "Dr. Sokolova", grantedAt: "2026-03-01 10:00" },
  { id: "w2", studentName: "Dmitri Volkov", studentId: "STU-10004", type: "attendance", validUntil: "2026-03-20", reason: "Medical documentation. Waiver for CS101 attendance threshold.", grantedBy: "Prof. Petrov", grantedAt: "2026-03-02 14:30" },
  { id: "w3", studentName: "Elena Novikova", studentId: "STU-10005", type: "prerequisite", validUntil: "2026-04-01", reason: "Transfer student; equivalent course from previous institution.", grantedBy: "Dr. Sokolova", grantedAt: "2026-02-28 09:15" },
];

const TYPE_STYLES: Record<ExceptionType, string> = {
  debt: "bg-amber-100 text-amber-800",
  attendance: "bg-violet-100 text-violet-800",
  prerequisite: "bg-slate-100 text-slate-800",
};

const TYPE_LABELS: Record<ExceptionType, string> = {
  debt: "Debt",
  attendance: "Attendance",
  prerequisite: "Prerequisite",
};

export default function ExceptionsListPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/academic/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Dashboard
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Exceptions</h1>
          <p className="mt-0.5 text-sm text-slate-600">
            Central list of active waivers: Debt, Attendance, Prerequisite. Audit trail on each.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/academic/exceptions/debt"
            className="inline-flex h-10 items-center justify-center rounded-md border border-violet-600 px-4 text-sm font-medium text-violet-700 transition-colors hover:bg-violet-50"
          >
            Debt exceptions
          </Link>
          <Link
            href="/academic/exceptions/appeals"
            className="inline-flex h-10 items-center justify-center rounded-md border border-violet-600 px-4 text-sm font-medium text-violet-700 transition-colors hover:bg-violet-50"
          >
            Appeals
          </Link>
          <Link
            href="/academic/exceptions/create"
            className="inline-flex h-10 items-center justify-center rounded-md bg-violet-600 px-4 text-sm font-medium text-white transition-colors hover:bg-violet-700"
          >
            Create exception
          </Link>
        </div>
      </div>

      <div className="space-y-3">
        {MOCK_WAIVERS.length === 0 ? (
          <Card className="bg-violet-50/50 p-6 text-center text-slate-600">
            No active exceptions. Create one or check Debt / Appeals.
          </Card>
        ) : (
          MOCK_WAIVERS.map((w) => (
            <Card key={w.id} className={cn("border-violet-200 bg-violet-100 p-4")}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-900">{w.studentName}</p>
                  <p className="text-xs font-mono text-slate-500">{w.studentId}</p>
                  <span className={cn("mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold", TYPE_STYLES[w.type])}>
                    {TYPE_LABELS[w.type]}
                  </span>
                  <p className="mt-2 text-sm text-slate-700">Valid until: {w.validUntil}</p>
                  <p className="mt-1 text-sm text-slate-700"><strong>Reason:</strong> {w.reason}</p>
                </div>
                <div className="text-right text-xs text-slate-600">
                  <p><strong>Granted by:</strong> {w.grantedBy}</p>
                  <p><strong>When:</strong> {w.grantedAt}</p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
