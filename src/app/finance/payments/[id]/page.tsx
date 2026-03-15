"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import * as React from "react";

import { Button } from "../../../components/ui/Button";

interface PaymentDetail {
  transactionId: string;
  studentName: string;
  studentId: string;
  amount: number;
  method: string;
  date: string;
  status: string;
  contractId: string;
  recordedAt: string;
}

const MOCK_PAYMENT_BY_ID: Record<string, PaymentDetail> = {
  p1: { transactionId: "TXN-2841", studentName: "Anna Petrova", studentId: "STU-10001", amount: 45000, method: "Card", date: "2026-03-06", status: "Verified", contractId: "CNT-2025-00142", recordedAt: "2026-03-06 14:32" },
  p2: { transactionId: "TXN-2840", studentName: "Ivan Kozlov", studentId: "STU-10002", amount: 38000, method: "Bank Transfer", date: "2026-03-06", status: "Pending", contractId: "CNT-2025-00089", recordedAt: "2026-03-06 11:15" },
  p3: { transactionId: "TXN-2839", studentName: "Maria Sokolova", studentId: "STU-10003", amount: 52000, method: "Card", date: "2026-03-05", status: "Verified", contractId: "CNT-2024-00321", recordedAt: "2026-03-05 16:40" },
  p4: { transactionId: "TXN-2838", studentName: "Dmitri Volkov", studentId: "STU-10004", amount: 29000, method: "Cash", date: "2026-03-05", status: "Verified", contractId: "CNT-2024-00215", recordedAt: "2026-03-05 09:22" },
  p5: { transactionId: "TXN-2837", studentName: "Elena Novikova", studentId: "STU-10005", amount: 60000, method: "Bank Transfer", date: "2026-03-04", status: "Rejected", contractId: "CNT-2025-00188", recordedAt: "2026-03-04 15:10" },
  p6: { transactionId: "TXN-2836", studentName: "Anna Petrova", studentId: "STU-10001", amount: 45000, method: "Bank Transfer", date: "2026-03-03", status: "Verified", contractId: "CNT-2025-00142", recordedAt: "2026-03-03 10:05" },
};

export default function PaymentDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";

  const payment = id ? MOCK_PAYMENT_BY_ID[id] : null;

  const handlePrint = () => {
    window.print();
  };

  const formatAmount = (n: number) => `${n.toLocaleString()} ₸`;

  if (!payment) {
    return (
      <div className="space-y-6">
        <Link href="/finance/payments" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Payments
        </Link>
        <p className="text-slate-600">Payment not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link href="/finance/payments" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Payments
        </Link>
        <Button
          type="button"
          className="bg-emerald-600 hover:bg-emerald-700"
          onClick={handlePrint}
        >
          Print Receipt
        </Button>
      </div>

      {/* Detailed payment info */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 print:hidden">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Payment Details</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="flex justify-between border-b border-slate-100 py-2 sm:block sm:border-0 sm:py-0">
            <dt className="text-slate-600">Transaction ID</dt>
            <dd className="font-mono font-medium text-slate-900">{payment.transactionId}</dd>
          </div>
          <div className="flex justify-between border-b border-slate-100 py-2 sm:block sm:border-0 sm:py-0">
            <dt className="text-slate-600">Contract</dt>
            <dd className="font-mono text-slate-900">{payment.contractId}</dd>
          </div>
          <div className="flex justify-between border-b border-slate-100 py-2 sm:block sm:border-0 sm:py-0">
            <dt className="text-slate-600">Student</dt>
            <dd className="font-medium text-slate-900">{payment.studentName} ({payment.studentId})</dd>
          </div>
          <div className="flex justify-between border-b border-slate-100 py-2 sm:block sm:border-0 sm:py-0">
            <dt className="text-slate-600">Recorded at</dt>
            <dd className="text-slate-900">{payment.recordedAt}</dd>
          </div>
          <div className="flex justify-between border-b border-slate-100 py-2 sm:block sm:border-0 sm:py-0">
            <dt className="text-slate-600">Method</dt>
            <dd className="text-slate-900">{payment.method}</dd>
          </div>
          <div className="flex justify-between border-b border-slate-100 py-2 sm:block sm:border-0 sm:py-0">
            <dt className="text-slate-600">Status</dt>
            <dd>
              <span
                className={
                  payment.status === "Verified"
                    ? "rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800"
                    : payment.status === "Pending"
                      ? "rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800"
                      : "rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800"
                }
              >
                {payment.status}
              </span>
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-xl font-bold text-emerald-700">{formatAmount(payment.amount)}</p>
      </div>

      {/* Printable receipt card */}
      <div id="receipt" className="relative mx-auto max-w-lg overflow-hidden rounded-xl border-2 border-slate-200 bg-white shadow-lg print:max-w-full print:shadow-none print:border">
        {/* Watermark */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03] print:opacity-[0.04]"
          aria-hidden
        >
          <span className="whitespace-nowrap text-6xl font-bold uppercase tracking-[0.3em] text-slate-900">
            Paid
          </span>
        </div>

        <div className="relative p-8 sm:p-10">
          {/* University header */}
          <div className="border-b border-slate-200 pb-6 text-center">
            <h1 className="text-xl font-bold uppercase tracking-wide text-slate-900">
              University Receipt
            </h1>
            <p className="mt-1 text-sm text-slate-600">Official Payment Confirmation</p>
            <p className="mt-0.5 text-xs text-slate-500">Finance Department</p>
          </div>

          {/* Transaction details */}
          <div className="mt-6 space-y-4">
            <div className="flex justify-between border-b border-slate-100 py-2">
              <span className="text-slate-600">Transaction ID</span>
              <span className="font-mono font-semibold text-slate-900">{payment.transactionId}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 py-2">
              <span className="text-slate-600">Date</span>
              <span className="font-medium text-slate-900">{payment.date}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 py-2">
              <span className="text-slate-600">Student</span>
              <span className="font-medium text-slate-900">{payment.studentName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 py-2">
              <span className="text-slate-600">Student ID</span>
              <span className="font-mono text-slate-900">{payment.studentId}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 py-2">
              <span className="text-slate-600">Payment Method</span>
              <span className="font-medium text-slate-900">{payment.method}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 py-2">
              <span className="text-slate-600">Status</span>
              <span className="font-semibold text-emerald-700">{payment.status}</span>
            </div>
            <div className="flex justify-between bg-emerald-50 py-3 px-4 -mx-4 rounded-lg mt-4">
              <span className="font-semibold text-slate-700">Amount Paid</span>
              <span className="text-xl font-bold text-emerald-800">{formatAmount(payment.amount)}</span>
            </div>
          </div>

          {/* QR code placeholder */}
          <div className="mt-8 flex flex-col items-center border-t border-slate-200 pt-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50">
              <span className="text-xs text-slate-400">QR Code</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">Verification code placeholder</p>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-slate-400">
            This is an official document. Generated on {new Date().toISOString().slice(0, 10)}.
          </p>
        </div>
      </div>
    </div>
  );
}
