"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type Category = "Login issue" | "Grade error" | "Course access" | "Payment" | "Other";
type Priority = "Low" | "Medium" | "High" | "Urgent";
type Status = "Open" | "In progress" | "Resolved" | "Closed";

interface TicketRow {
  id: string;
  ticketId: string;
  user: string;
  userRole: string;
  category: Category;
  priority: Priority;
  status: Status;
}

const CATEGORIES: Category[] = ["Login issue", "Grade error", "Course access", "Payment", "Other"];
const PRIORITIES: Priority[] = ["Low", "Medium", "High", "Urgent"];
const STATUSES: Status[] = ["Open", "In progress", "Resolved", "Closed"];

const MOCK_TICKETS: TicketRow[] = [
  { id: "t1", ticketId: "SUP-1001", user: "Riley Davis", userRole: "Student", category: "Login issue", priority: "High", status: "Open" },
  { id: "t2", ticketId: "SUP-1002", user: "Alex Johnson", userRole: "Teacher", category: "Grade error", priority: "Medium", status: "In progress" },
  { id: "t3", ticketId: "SUP-1003", user: "Jordan Lee", userRole: "Student", category: "Course access", priority: "Low", status: "Resolved" },
  { id: "t4", ticketId: "SUP-1004", user: "Morgan Kim", userRole: "Teacher", category: "Grade error", priority: "Urgent", status: "Open" },
  { id: "t5", ticketId: "SUP-1005", user: "Sam Chen", userRole: "Student", category: "Payment", priority: "Medium", status: "Closed" },
];

export default function SupportTicketsPage() {
  const [categoryFilter, setCategoryFilter] = React.useState<string>("");
  const [priorityFilter, setPriorityFilter] = React.useState<string>("");
  const [statusFilter, setStatusFilter] = React.useState<string>("");
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    return MOCK_TICKETS.filter((t) => {
      if (categoryFilter && t.category !== categoryFilter) return false;
      if (priorityFilter && t.priority !== priorityFilter) return false;
      if (statusFilter && t.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        if (!t.user.toLowerCase().includes(q) && !t.ticketId.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [categoryFilter, priorityFilter, statusFilter, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Support</h1>
          <p className="mt-1 text-sm text-slate-600">
            Tickets, user feedback, and knowledge base.
          </p>
        </div>
        <nav className="flex gap-2">
          <Link href="/admin/support" className="inline-flex h-9 items-center rounded-md bg-slate-100 px-3 text-sm font-medium text-slate-900">Tickets</Link>
          <Link href="/admin/support/feedback" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">Feedback</Link>
          <Link href="/admin/support/knowledge-base" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">Knowledge Base</Link>
        </nav>
      </div>

      <Card className="p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Support tickets
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Requests from students and teachers. Filter by category, priority, or status.
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-4">
          <Input
            type="search"
            placeholder="Search by user or ticket ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
          >
            <option value="">All priorities</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Ticket ID</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">User</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Category</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Priority</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-mono font-medium text-slate-900">{row.ticketId}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-slate-900">{row.user}</span>
                    <span className="ml-1 text-xs text-slate-500">({row.userRole})</span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{row.category}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        row.priority === "Urgent" && "bg-red-100 text-red-800",
                        row.priority === "High" && "bg-amber-100 text-amber-800",
                        row.priority === "Medium" && "bg-sky-100 text-sky-800",
                        row.priority === "Low" && "bg-slate-100 text-slate-700",
                      )}
                    >
                      {row.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        row.status === "Open" && "bg-amber-100 text-amber-800",
                        row.status === "In progress" && "bg-blue-100 text-blue-800",
                        row.status === "Resolved" && "bg-emerald-100 text-emerald-800",
                        row.status === "Closed" && "bg-slate-100 text-slate-700",
                      )}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="py-8 text-center text-slate-500">No tickets match the filters.</p>
        )}
      </Card>
    </div>
  );
}
