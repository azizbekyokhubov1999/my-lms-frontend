"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface LMSPayment {
  id: string;
  transactionId: string;
  studentName: string;
  amount: number;
  date: string;
}

interface BankRecord {
  id: string;
  reference: string;
  amount: number;
  date: string;
  description: string;
}

const MOCK_LMS_UNMATCHED: LMSPayment[] = [
  { id: "lms2", transactionId: "TXN-2840", studentName: "Ivan Kozlov", amount: 38000, date: "2026-03-06" },
  { id: "lms4", transactionId: "TXN-2838", studentName: "Dmitri Volkov", amount: 29000, date: "2026-03-05" },
];

const MOCK_1C_UNMATCHED: BankRecord[] = [
  { id: "1c3", reference: "REF-88423", amount: 60000, date: "2026-03-04", description: "Elena Novikova" },
  { id: "1c4", reference: "REF-88424", amount: 38000, date: "2026-03-06", description: "Ivan Kozlov" },
];

export default function ManualMatchPage() {
  const [selectedLms, setSelectedLms] = React.useState<string | null>(null);
  const [selected1c, setSelected1c] = React.useState<string | null>(null);
  const [linked, setLinked] = React.useState<Array<{ lms: string; onec: string }>>([]);

  const handleLink = () => {
    if (!selectedLms || !selected1c) return;
    setLinked((prev) => [...prev, { lms: selectedLms, onec: selected1c }]);
    setSelectedLms(null);
    setSelected1c(null);
  };

  const formatAmount = (n: number) => `${n.toLocaleString()} ₸`;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/finance/reconciliation" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Reconciliation
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Manual Match</h1>
        <p className="mt-1 text-sm text-slate-600">
          Select an LMS payment and a 1C bank record to link them manually.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">LMS Payments (Unmatched)</h2>
          <p className="mt-0.5 text-xs text-slate-600">Click to select</p>
          <ul className="mt-3 space-y-2">
            {MOCK_LMS_UNMATCHED.map((p) => {
              const isSelected = selectedLms === p.id;
              const isLinked = linked.some((l) => l.lms === p.id);
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => !isLinked && setSelectedLms(isSelected ? null : p.id)}
                    disabled={!!isLinked}
                    className={cn(
                      "w-full rounded-lg border px-4 py-2.5 text-left transition-colors",
                      isLinked && "cursor-default border-emerald-200 bg-emerald-50/50 opacity-75",
                      !isLinked && isSelected && "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500",
                      !isLinked && !isSelected && "border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50",
                    )}
                  >
                    <div className="flex justify-between">
                      <span className="font-mono text-sm">{p.transactionId}</span>
                      {isLinked && <span className="text-xs text-emerald-700">Linked</span>}
                      {isSelected && !isLinked && <span className="text-xs text-emerald-700">Selected</span>}
                    </div>
                    <p className="text-sm text-slate-700">{p.studentName}</p>
                    <p className="text-xs text-slate-500">{formatAmount(p.amount)} · {p.date}</p>
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card className="p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">1C Bank Records (Unmatched)</h2>
          <p className="mt-0.5 text-xs text-slate-600">Click to select</p>
          <ul className="mt-3 space-y-2">
            {MOCK_1C_UNMATCHED.map((r) => {
              const isSelected = selected1c === r.id;
              const isLinked = linked.some((l) => l.onec === r.id);
              return (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => !isLinked && setSelected1c(isSelected ? null : r.id)}
                    disabled={!!isLinked}
                    className={cn(
                      "w-full rounded-lg border px-4 py-2.5 text-left transition-colors",
                      isLinked && "cursor-default border-emerald-200 bg-emerald-50/50 opacity-75",
                      !isLinked && isSelected && "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500",
                      !isLinked && !isSelected && "border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50",
                    )}
                  >
                    <div className="flex justify-between">
                      <span className="font-mono text-sm">{r.reference}</span>
                      {isLinked && <span className="text-xs text-emerald-700">Linked</span>}
                      {isSelected && !isLinked && <span className="text-xs text-emerald-700">Selected</span>}
                    </div>
                    <p className="text-sm text-slate-700">{r.description}</p>
                    <p className="text-xs text-slate-500">{formatAmount(r.amount)} · {r.date}</p>
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <div className="flex items-center justify-center gap-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
        <Button
          type="button"
          className="bg-emerald-600 hover:bg-emerald-700"
          onClick={handleLink}
          disabled={!selectedLms || !selected1c}
        >
          Link Selected
        </Button>
        <span className="text-sm text-slate-600">
          {selectedLms && selected1c ? "Ready to link" : "Select one from each column"}
        </span>
      </div>

      {linked.length > 0 && (
        <Card className="p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Linked (this session)</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {linked.map((l, i) => (
              <li key={i}>
                {l.lms} ↔ {l.onec}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
