"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type DiscrepancyType = "amount_mismatch" | "duplicate_id" | "missing_record" | "date_mismatch";

interface Discrepancy {
  id: string;
  type: DiscrepancyType;
  description: string;
  lmsRef: string;
  oneCRef: string;
  detail: string;
  createdAt: string;
}

const MOCK_DISCREPANCIES: Discrepancy[] = [
  { id: "d1", type: "amount_mismatch", description: "Amount mismatch", lmsRef: "TXN-2840", oneCRef: "REF-88424", detail: "LMS: 38,000 ₸ vs 1C: 39,000 ₸", createdAt: "2026-03-06" },
  { id: "d2", type: "duplicate_id", description: "Duplicate transaction ID", lmsRef: "TXN-2837", oneCRef: "REF-88423", detail: "Same ID in multiple 1C entries", createdAt: "2026-03-05" },
  { id: "d3", type: "missing_record", description: "No 1C record", lmsRef: "TXN-2838", oneCRef: "—", detail: "Payment recorded in LMS but not in bank statement", createdAt: "2026-03-05" },
];

const TYPE_LABELS: Record<DiscrepancyType, string> = {
  amount_mismatch: "Amount Mismatch",
  duplicate_id: "Duplicate ID",
  missing_record: "Missing Record",
  date_mismatch: "Date Mismatch",
};

export default function DiscrepanciesPage() {
  const [resolved, setResolved] = React.useState<Set<string>>(new Set());

  const handleResolve = (id: string) => {
    setResolved((prev) => new Set([...prev, id]));
  };

  const open = MOCK_DISCREPANCIES.filter((d) => !resolved.has(d.id));

  return (
    <div className="space-y-6">
      <div>
        <Link href="/finance/reconciliation" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Reconciliation
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Discrepancies</h1>
        <p className="mt-1 text-sm text-slate-600">
          Errors: amount mismatch, duplicate transaction IDs. Resolve manually.
        </p>
      </div>

      <Card className="p-4">
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Type</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Description</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">LMS Ref</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">1C Ref</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Detail</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Date</th>
                <th className="w-32 px-4 py-3 text-right font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {open.map((d) => (
                <tr key={d.id} className="hover:bg-emerald-50/70">
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                      {TYPE_LABELS[d.type]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-900">{d.description}</td>
                  <td className="px-4 py-3 font-mono text-slate-700">{d.lmsRef}</td>
                  <td className="px-4 py-3 font-mono text-slate-700">{d.oneCRef}</td>
                  <td className="px-4 py-3 text-slate-600">{d.detail}</td>
                  <td className="px-4 py-3 text-slate-600">{d.createdAt}</td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      type="button"
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handleResolve(d.id)}
                    >
                      Resolve Manually
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {open.length === 0 && (
          <p className="py-8 text-center text-slate-500">No open discrepancies.</p>
        )}
      </Card>
    </div>
  );
}
