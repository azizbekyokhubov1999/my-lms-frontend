"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../components/ui/Card";

const STORAGE_KEY = "finance-reconciliation-match-comments";

interface StoredMatch {
  lmsId: string;
  oneCId: string;
  comment: string;
  savedAt: string;
}

function getStoredMatches(): StoredMatch[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredMatch[]) : [];
  } catch {
    return [];
  }
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface LMSPayment {
  id: string;
  transactionId: string;
  studentName: string;
  amount: number;
  date: string;
  matchedId: string | null;
}

interface BankRecord {
  id: string;
  reference: string;
  amount: number;
  date: string;
  description: string;
}

const MOCK_LMS: LMSPayment[] = [
  { id: "lms1", transactionId: "TXN-2841", studentName: "Anna Petrova", amount: 45000, date: "2026-03-06", matchedId: "1c1" },
  { id: "lms2", transactionId: "TXN-2840", studentName: "Ivan Kozlov", amount: 38000, date: "2026-03-06", matchedId: null },
  { id: "lms3", transactionId: "TXN-2839", studentName: "Maria Sokolova", amount: 52000, date: "2026-03-05", matchedId: "1c2" },
  { id: "lms4", transactionId: "TXN-2838", studentName: "Dmitri Volkov", amount: 29000, date: "2026-03-05", matchedId: null },
];

const MOCK_1C: BankRecord[] = [
  { id: "1c1", reference: "REF-88421", amount: 45000, date: "2026-03-06", description: "Anna Petrova" },
  { id: "1c2", reference: "REF-88422", amount: 52000, date: "2026-03-05", description: "Maria Sokolova" },
  { id: "1c3", reference: "REF-88423", amount: 60000, date: "2026-03-04", description: "Elena Novikova" },
  { id: "1c4", reference: "REF-88424", amount: 38000, date: "2026-03-06", description: "Ivan Kozlov" },
];

export default function ReconciliationPage() {
  const [matchComments, setMatchComments] = React.useState<Map<string, string>>(new Map());

  const [storedMatches, setStoredMatches] = React.useState<StoredMatch[]>([]);

  React.useEffect(() => {
    const list = getStoredMatches();
    setStoredMatches(list);
    const map = new Map<string, string>();
    list.forEach((m) => {
      map.set(m.lmsId, m.comment);
      map.set(m.oneCId, m.comment);
    });
    setMatchComments(map);
  }, []);

  const isLmsMatched = (p: LMSPayment) =>
    p.matchedId != null || storedMatches.some((m) => m.lmsId === p.id);
  const is1cMatched = (r: BankRecord) =>
    MOCK_LMS.some((p) => p.matchedId === r.id) || storedMatches.some((m) => m.oneCId === r.id);

  const formatAmount = (n: number) => `${n.toLocaleString()} ₸`;

  const unmatchedLms = MOCK_LMS.filter((p) => !isLmsMatched(p));
  const unmatched1c = MOCK_1C.filter((r) => !is1cMatched(r));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Reconciliation</h1>
          <p className="mt-1 text-sm text-slate-600">
            1C Sync. Match LMS payments with bank records.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/finance/reconciliation/discrepancies"
            className="inline-flex h-10 items-center justify-center rounded-md border border-emerald-600 px-4 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            Discrepancies
          </Link>
          <Link
            href="/finance/reconciliation/history"
            className="inline-flex h-10 items-center justify-center rounded-md border border-emerald-600 px-4 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            Sync History
          </Link>
          <Link
            href="/finance/reconciliation/manual-match"
            className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-600 px-4 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            Manual Match
          </Link>
        </div>
      </div>

      {/* Split-screen view */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">LMS Payments</h2>
          <ul className="mt-3 space-y-2">
            {MOCK_LMS.map((p) => {
              const matched = isLmsMatched(p);
              return (
              <li
                key={p.id}
                className={cn(
                  "rounded-lg border px-4 py-2.5",
                  matched
                    ? "border-emerald-200 bg-emerald-50/50"
                    : "border-amber-200 bg-amber-50/50",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-slate-900">{p.transactionId}</p>
                    <p className="text-xs text-slate-600">{p.studentName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">{formatAmount(p.amount)}</p>
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        matched ? "text-emerald-700" : "text-amber-700",
                      )}
                    >
                      {matched ? "Matched" : "Unmatched"}
                    </span>
                  </div>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">{p.date}</p>
                {matchComments.has(p.id) && (
                  <p className="mt-1 text-xs text-slate-500 italic" title={matchComments.get(p.id)!}>
                    Match note: {matchComments.get(p.id)}
                  </p>
                )}
              </li>
            );
            })}
          </ul>
        </Card>

        <Card className="p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">1C Bank Records</h2>
          <ul className="mt-3 space-y-2">
            {MOCK_1C.map((r) => {
              const isMatched = is1cMatched(r);
              const comment = matchComments.get(r.id);
              return (
                <li
                  key={r.id}
                  className={cn(
                    "rounded-lg border px-4 py-2.5",
                    isMatched
                      ? "border-emerald-200 bg-emerald-50/50"
                      : "border-amber-200 bg-amber-50/50",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-mono text-sm font-medium text-slate-900">{r.reference}</p>
                      <p className="text-xs text-slate-600">{r.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">{formatAmount(r.amount)}</p>
                      <span
                        className={cn(
                          "text-xs font-semibold",
                          isMatched ? "text-emerald-700" : "text-amber-700",
                        )}
                      >
                        {isMatched ? "Matched" : "Unmatched"}
                      </span>
                    </div>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{r.date}</p>
                  {comment && (
                    <p className="mt-1 text-xs text-slate-500 italic" title={comment}>
                      Match note: {comment}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      {/* Summary */}
      <div className="flex flex-wrap gap-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
        <div className="flex items-center gap-2">
          <span className="h-3 w-4 rounded bg-emerald-200" />
          <span className="text-sm text-slate-600">Matched: {MOCK_LMS.filter(isLmsMatched).length} LMS, {MOCK_1C.filter(is1cMatched).length} 1C</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-4 rounded bg-amber-200" />
          <span className="text-sm text-slate-600">Unmatched: {unmatchedLms.length} LMS, {unmatched1c.length} 1C</span>
        </div>
      </div>
    </div>
  );
}
