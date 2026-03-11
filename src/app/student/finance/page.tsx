"use client";

import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

interface InvoiceRecord {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: "Paid" | "Pending";
}

const TUITION_BALANCE = 3500;
const CONTRACT_NUMBER = "UO-2026-001234";
const ACADEMIC_YEAR = "2025 – 2026";

const INVOICE_HISTORY: InvoiceRecord[] = [
  { id: "INV-2026-001", date: "Mar 01, 2026", description: "Tuition installment Q2", amount: "$2,000", status: "Paid" },
  { id: "INV-2026-002", date: "Feb 01, 2026", description: "Tuition installment Q1", amount: "$2,000", status: "Paid" },
  { id: "INV-2026-003", date: "Jan 15, 2026", description: "Tuition + fees", amount: "$2,500", status: "Pending" },
];

export default function FinancePage() {
  const hasBalance = TUITION_BALANCE > 0;

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Finance
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Tuition balance, invoice history, and online payment.
        </p>
      </section>

      {/* Tuition balance + Pay Online */}
      <div className="grid gap-4 md:grid-cols-[1fr,auto]">
        <Card className="flex flex-col justify-between border-slate-200">
          <h2 className="text-sm font-semibold text-slate-900">Tuition balance</h2>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {TUITION_BALANCE > 0 ? `$${TUITION_BALANCE.toLocaleString()}` : "$0"}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Contract {CONTRACT_NUMBER} · {ACADEMIC_YEAR}
          </p>
          {hasBalance && (
            <p className="mt-2 text-xs text-amber-700">
              Pay by the deadline to avoid exam block.
            </p>
          )}
        </Card>
        <div className="flex items-center">
          <Button
            type="button"
            variant="primary"
            className="h-fit rounded-lg bg-sky-600 px-6 py-3 text-base font-semibold hover:bg-sky-700"
            onClick={() => window.open("#", "_blank")}
          >
            Pay online
          </Button>
        </div>
      </div>

      {/* Invoice history */}
      <Card>
        <h2 className="text-sm font-semibold text-slate-900">Invoice history</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Past and pending invoices
        </p>
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-600">Invoice</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-600">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-600">Description</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-slate-600">Amount</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {INVOICE_HISTORY.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-800">{inv.id}</td>
                  <td className="px-4 py-3 text-slate-600">{inv.date}</td>
                  <td className="px-4 py-3 text-slate-800">{inv.description}</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-900">{inv.amount}</td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={
                        inv.status === "Paid"
                          ? "rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800"
                          : "rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800"
                      }
                    >
                      {inv.status}
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
