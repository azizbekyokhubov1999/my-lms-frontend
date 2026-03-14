"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import * as React from "react";

import { Button } from "../../../components/ui/Button";

// Mock payment data by ID
const MOCK_PAYMENT_BY_ID: Record<string, { transactionId: string; studentName: string; studentId: string; amount: number; method: string; date: string; status: string }> = {
  p1: { transactionId: "TXN-2841", studentName: "Anna Petrova", studentId: "STU-10001", amount: 45000, method: "Card", date: "2026-03-06", status: "Verified" },
  p2: { transactionId: "TXN-2840", studentName: "Ivan Kozlov", studentId: "STU-10002", amount: 38000, method: "Bank Transfer", date: "2026-03-06", status: "Pending" },
  p3: { transactionId: "TXN-2839", studentName: "Maria Sokolova", studentId: "STU-10003", amount: 52000, method: "Card", date: "2026-03-05", status: "Verified" },
  p4: { transactionId: "TXN-2838", studentName: "Dmitri Volkov", studentId: "STU-10004", amount: 29000, method: "Cash", date: "2026-03-05", status: "Verified" },
  p5: { transactionId: "TXN-2837", studentName: "Elena Novikova", studentId: "STU-10005", amount: 60000, method: "Bank Transfer", date: "2026-03-04", status: "Rejected" },
  p6: { transactionId: "TXN-2836", studentName: "Anna Petrova", studentId: "STU-10001", amount: 45000, method: "Bank Transfer", date: "2026-03-03", status: "Verified" },
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

      {/* Printable receipt card */}
      <div className="relative mx-auto max-w-lg overflow-hidden rounded-xl border-2 border-slate-200 bg-white shadow-lg print:max-w-full print:shadow-none print:border">
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
