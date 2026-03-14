"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type EventType = "Contract created" | "Payment recorded" | "Refund issued" | "Block applied" | "Block released";

interface TransactionEvent {
  id: string;
  eventType: EventType;
  timestamp: string;
  transactionId: string | null;
  studentName: string;
  studentId: string;
  amount: number | null;
  details: string;
}

const MOCK_EVENTS: TransactionEvent[] = [
  { id: "ev1", eventType: "Payment recorded", timestamp: "2026-03-06 14:32:18", transactionId: "TXN-2841", studentName: "Anna Petrova", studentId: "STU-10001", amount: 45000, details: "Card" },
  { id: "ev2", eventType: "Block applied", timestamp: "2026-03-06 10:00:00", transactionId: null, studentName: "Elena Novikova", studentId: "STU-10005", amount: null, details: "Overdue debt (2 installments)" },
  { id: "ev3", eventType: "Payment recorded", timestamp: "2026-03-06 09:15:22", transactionId: "TXN-2840", studentName: "Ivan Kozlov", studentId: "STU-10002", amount: 38000, details: "Bank Transfer" },
  { id: "ev4", eventType: "Refund issued", timestamp: "2026-03-05 16:40:33", transactionId: "RFND-001", studentName: "Alexey Popov", studentId: "STU-10006", amount: 15000, details: "Course withdrawal" },
  { id: "ev5", eventType: "Contract created", timestamp: "2026-03-05 11:22:11", transactionId: null, studentName: "Maria Sokolova", studentId: "STU-10003", amount: 520000, details: "CNT-2024-00321" },
  { id: "ev6", eventType: "Block released", timestamp: "2026-03-04 15:30:00", transactionId: null, studentName: "Dmitri Volkov", studentId: "STU-10004", amount: null, details: "Payment received" },
];

const EVENT_OPTIONS: EventType[] = [
  "Contract created",
  "Payment recorded",
  "Refund issued",
  "Block applied",
  "Block released",
];

export default function TransactionHistoryPage() {
  const [search, setSearch] = React.useState("");
  const [eventFilter, setEventFilter] = React.useState<string>("");

  const filtered = React.useMemo(() => {
    return MOCK_EVENTS.filter((e) => {
      if (eventFilter && e.eventType !== eventFilter) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        if (
          !e.studentName.toLowerCase().includes(q) &&
          !e.studentId.toLowerCase().includes(q) &&
          !(e.transactionId?.toLowerCase().includes(q))
        )
          return false;
      }
      return true;
    });
  }, [search, eventFilter]);

  const sorted = React.useMemo(
    () => [...filtered].sort((a, b) => b.timestamp.localeCompare(a.timestamp)),
    [filtered]
  );

  const formatAmount = (n: number | null) => (n != null ? `${n.toLocaleString()} ₸` : "—");

  const getEventBadgeClass = (t: EventType) => {
    switch (t) {
      case "Contract created":
        return "bg-slate-100 text-slate-700";
      case "Payment recorded":
        return "bg-emerald-100 text-emerald-700";
      case "Refund issued":
        return "bg-amber-100 text-amber-700";
      case "Block applied":
        return "bg-red-100 text-red-700";
      case "Block released":
        return "bg-emerald-100 text-emerald-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/finance/audit" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Audit & Logs
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Transaction History</h1>
        <p className="mt-1 text-sm text-slate-600">
          Every financial event: contracts, payments, refunds, blocks.
        </p>
      </div>

      <Card className="p-4">
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <Input
            type="search"
            placeholder="Search by student, ID, or transaction..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs font-mono"
          />
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value="">Event: All</option>
            {EVENT_OPTIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Timestamp</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Event</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Transaction ID</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Student</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.map((e) => (
                <tr key={e.id} className="hover:bg-emerald-50/50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{e.timestamp}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        getEventBadgeClass(e.eventType)
                      )}
                    >
                      {e.eventType}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-700">
                    {e.transactionId ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{e.studentName}</p>
                    <p className="font-mono text-xs text-slate-500">{e.studentId}</p>
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-medium text-slate-900">
                    {formatAmount(e.amount)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{e.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sorted.length === 0 && (
          <p className="py-8 text-center text-slate-500">No transactions match the filters.</p>
        )}
      </Card>
    </div>
  );
}
