"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";

const MOCK_STUDENTS = [
  { id: "STU-10001", name: "Anna Petrova", contractId: "CNT-2025-00142", totalAmount: 450000, paidAmount: 135000, debtBalance: 315000 },
  { id: "STU-10002", name: "Ivan Kozlov", contractId: "CNT-2025-00089", totalAmount: 380000, paidAmount: 95000, debtBalance: 285000 },
  { id: "STU-10003", name: "Maria Sokolova", contractId: "CNT-2024-00321", totalAmount: 520000, paidAmount: 260000, debtBalance: 260000 },
  { id: "STU-10004", name: "Dmitri Volkov", contractId: "CNT-2024-00215", totalAmount: 420000, paidAmount: 420000, debtBalance: 0 },
  { id: "STU-10005", name: "Elena Novikova", contractId: "CNT-2025-00188", totalAmount: 390000, paidAmount: 78000, debtBalance: 312000 },
];

const PAYMENT_METHODS = [
  { value: "Bank", label: "Bank Transfer" },
  { value: "Card", label: "Card" },
  { value: "Cash", label: "Cash" },
];

const ACCEPTED_TYPES = ".pdf,.jpg,.jpeg,.png";

export default function RecordPaymentPage() {
  const [studentSearch, setStudentSearch] = React.useState("");
  const [selectedStudent, setSelectedStudent] = React.useState<(typeof MOCK_STUDENTS)[0] | null>(null);

  const [amountPaid, setAmountPaid] = React.useState("");
  const [paymentMethod, setPaymentMethod] = React.useState("Bank");
  const [transactionId, setTransactionId] = React.useState("");
  const [date, setDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [receiptFile, setReceiptFile] = React.useState<File | null>(null);
  const [receiptName, setReceiptName] = React.useState("");

  const filteredStudents = React.useMemo(() => {
    if (!studentSearch.trim()) return MOCK_STUDENTS;
    const q = studentSearch.trim().toLowerCase();
    return MOCK_STUDENTS.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.contractId.toLowerCase().includes(q)
    );
  }, [studentSearch]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
      if (["pdf", "jpg", "jpeg", "png"].includes(ext)) {
        setReceiptFile(f);
        setReceiptName(f.name);
      } else {
        alert("Please upload PDF or image (JPG, PNG).");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    alert(`Payment recorded (Demo): ${amountPaid} ₸ for ${selectedStudent.name}. Receipt: ${receiptName || "None"}`);
  };

  const formatAmount = (n: number) => `${n.toLocaleString()} ₸`;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/finance/payments" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Payments
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Record Payment</h1>
        <p className="mt-1 text-sm text-slate-600">
          Search student, view contract and debt, then record the payment with receipt.
        </p>
      </div>

      <Card className="max-w-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-800">Search Student (ID or Name)</label>
            <Input
              type="search"
              placeholder="e.g. STU-10001 or Anna Petrova"
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className="mt-1"
            />
            <ul className="mt-2 max-h-48 space-y-0 overflow-y-auto rounded-lg border border-slate-200">
              {filteredStudents.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedStudent(s)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                      selectedStudent?.id === s.id ? "bg-emerald-50 text-emerald-900" : "hover:bg-emerald-50/50"
                    }`}
                  >
                    <div>
                      <p className="font-medium text-slate-900">{s.name}</p>
                      <p className="text-xs text-slate-500">{s.id} · {s.contractId}</p>
                    </div>
                    {selectedStudent?.id === s.id && (
                      <span className="text-emerald-600 font-medium">✓ Selected</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {selectedStudent && (
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
              <h3 className="text-sm font-semibold text-slate-700">Active Contract & Debt</h3>
              <dl className="mt-2 grid gap-2 sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-slate-500">Contract</dt>
                  <dd className="font-mono text-sm font-medium text-slate-900">{selectedStudent.contractId}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Total Amount</dt>
                  <dd className="text-sm font-medium text-slate-900">{formatAmount(selectedStudent.totalAmount)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Paid to Date</dt>
                  <dd className="text-sm font-medium text-emerald-700">{formatAmount(selectedStudent.paidAmount)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Current Debt Balance</dt>
                  <dd className="text-sm font-semibold text-slate-900">{formatAmount(selectedStudent.debtBalance)}</dd>
                </div>
              </dl>
            </div>
          )}

          {selectedStudent && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Amount Paid (₸)"
                  type="number"
                  placeholder="e.g. 45000"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-slate-800">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  >
                    {PAYMENT_METHODS.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Transaction ID"
                  type="text"
                  placeholder="e.g. TXN-123456"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                />
                <Input
                  label="Date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-800">Receipt Attachment (PDF / Image)</label>
                <p className="mt-0.5 text-xs text-slate-500">Upload payment receipt for verification.</p>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    type="file"
                    accept={ACCEPTED_TYPES}
                    onChange={handleFileChange}
                    className="block w-full max-w-xs text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                  {receiptName && (
                    <span className="text-sm text-slate-600">{receiptName}</span>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-2">
            <Link href="/finance/payments">
              <Button type="button" variant="secondary">Cancel</Button>
            </Link>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500"
              disabled={!selectedStudent || !amountPaid}
            >
              Record Payment
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
