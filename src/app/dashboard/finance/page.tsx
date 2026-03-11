import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

interface PaymentRecord {
  id: number;
  date: string;
  amount: string;
  method: string;
  status: "Paid" | "Pending";
}

const CONTRACT_NUMBER = "UO-2026-001234";
const TOTAL_CONTRACT_AMOUNT = "$12,000";
const CURRENT_DEBT = 3500; // in USD for logic, displayed as formatted string

const PAYMENT_HISTORY: PaymentRecord[] = [
  {
    id: 1,
    date: "Mar 01, 2026",
    amount: "$2,000",
    method: "Credit Card",
    status: "Paid",
  },
  {
    id: 2,
    date: "Feb 01, 2026",
    amount: "$2,000",
    method: "Bank Transfer",
    status: "Paid",
  },
  {
    id: 3,
    date: "Jan 01, 2026",
    amount: "$2,500",
    method: "Credit Card",
    status: "Pending",
  },
];

export default function FinancePage() {
  const hasOutstandingDebt = CURRENT_DEBT > 0;

  return (
    <div className="space-y-6">
      {/* Warning banner */}
      {hasOutstandingDebt && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-900">
          <p className="font-semibold">
            Please complete your payment to avoid being blocked from exams.
          </p>
          <p className="mt-1">
            Your account currently has an outstanding balance. Review your
            finance details below.
          </p>
        </div>
      )}

      {/* Header */}
      <section>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Finance overview
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          View your contract, payment history, and current outstanding balance.
        </p>
      </section>

      {/* Top cards: Contract info & balance */}
      <section className="grid gap-4 md:grid-cols-[minmax(0,2fr),minmax(0,1.4fr)]">
        <Card>
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900">
              Contract information
            </h2>
            <dl className="mt-2 grid grid-cols-1 gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Contract number
                </dt>
                <dd className="mt-0.5 text-sm font-semibold text-slate-900">
                  {CONTRACT_NUMBER}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Total contract amount
                </dt>
                <dd className="mt-0.5 text-sm font-semibold text-slate-900">
                  {TOTAL_CONTRACT_AMOUNT}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Payment status
                </dt>
                <dd className="mt-0.5 text-sm font-semibold text-slate-900">
                  {hasOutstandingDebt ? "Partially paid" : "Paid in full"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Academic year
                </dt>
                <dd className="mt-0.5 text-sm text-slate-800">
                  2025 – 2026
                </dd>
              </div>
            </dl>
          </div>
        </Card>

        <Card className="flex flex-col justify-between bg-slate-900 text-slate-50">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-300">
              Current debt
            </p>
            <p className="mt-2 text-3xl font-semibold">
              {CURRENT_DEBT > 0 ? `$${CURRENT_DEBT.toLocaleString()}` : "$0"}
            </p>
            <p className="mt-1 text-xs text-slate-300">
              This amount must be paid before the exam registration deadline.
            </p>
          </div>
          <div className="mt-4 flex justify-end">
            {hasOutstandingDebt ? (
              <Button
                type="button"
                variant="primary"
                className="bg-red-600 hover:bg-red-700 focus-visible:ring-red-700"
              >
                Pay now
              </Button>
            ) : (
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                No outstanding balance
              </span>
            )}
          </div>
        </Card>
      </section>

      {/* Payment history */}
      <section>
        <h2 className="text-sm font-semibold text-slate-900">
          Payment history
        </h2>
        <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="grid grid-cols-[auto,auto,1fr,auto] gap-3 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-600">
            <span>Date</span>
            <span>Amount</span>
            <span>Method</span>
            <span className="text-right">Status</span>
          </div>
          <ul className="divide-y divide-slate-200 text-sm">
            {PAYMENT_HISTORY.map((record) => (
              <li
                key={record.id}
                className="grid grid-cols-[auto,auto,1fr,auto] items-center gap-3 px-4 py-2 text-xs text-slate-700"
              >
                <span>{record.date}</span>
                <span>{record.amount}</span>
                <span>{record.method}</span>
                <span className="text-right">
                  <span
                    className={
                      record.status === "Paid"
                        ? "inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700"
                        : "inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800"
                    }
                  >
                    {record.status}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

