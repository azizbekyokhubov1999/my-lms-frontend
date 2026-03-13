"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";

interface AuditRow {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resourceId: string;
  ip: string;
}

const ACTION_TYPES = ["Login", "Logout", "Updated Course", "Updated User", "Deleted Resource", "Exported Data", "Changed Role", "Updated Settings"];

const MOCK_LOGS: AuditRow[] = [
  { id: "1", timestamp: "2026-03-06 10:45:22", user: "admin@edu.edu", action: "Updated Course", resourceId: "course-101", ip: "10.0.0.1" },
  { id: "2", timestamp: "2026-03-06 10:32:11", user: "admin@edu.edu", action: "Updated User", resourceId: "u4", ip: "10.0.0.1" },
  { id: "3", timestamp: "2026-03-06 09:15:00", user: "alex.johnson@edu.edu", action: "Login", resourceId: "—", ip: "192.168.1.10" },
  { id: "4", timestamp: "2026-03-06 09:12:44", user: "admin@edu.edu", action: "Exported Data", resourceId: "users", ip: "10.0.0.1" },
  { id: "5", timestamp: "2026-03-05 17:22:00", user: "morgan.kim@edu.edu", action: "Updated Course", resourceId: "course-102", ip: "192.168.1.55" },
  { id: "6", timestamp: "2026-03-05 14:00:33", user: "admin@edu.edu", action: "Changed Role", resourceId: "u2", ip: "10.0.0.1" },
  { id: "7", timestamp: "2026-03-05 11:00:00", user: "admin@edu.edu", action: "Updated Settings", resourceId: "system-config", ip: "10.0.0.1" },
  { id: "8", timestamp: "2026-03-04 16:45:00", user: "admin@edu.edu", action: "Deleted Resource", resourceId: "assignment-draft-99", ip: "10.0.0.1" },
];

function parseTimestamp(ts: string): number {
  const d = new Date(ts);
  return isNaN(d.getTime()) ? 0 : d.getTime();
}

export default function AuditLogsPage() {
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");
  const [userFilter, setUserFilter] = React.useState("");
  const [actionFilter, setActionFilter] = React.useState("");
  const [exportOpen, setExportOpen] = React.useState(false);
  const tableRef = React.useRef<HTMLTableElement>(null);

  const filtered = React.useMemo(() => {
    return MOCK_LOGS.filter((row) => {
      if (dateFrom) {
        const t = parseTimestamp(row.timestamp);
        if (t < parseTimestamp(dateFrom + " 00:00:00")) return false;
      }
      if (dateTo) {
        const t = parseTimestamp(row.timestamp);
        if (t > parseTimestamp(dateTo + " 23:59:59")) return false;
      }
      if (userFilter.trim()) {
        if (!row.user.toLowerCase().includes(userFilter.trim().toLowerCase())) return false;
      }
      if (actionFilter && row.action !== actionFilter) return false;
      return true;
    });
  }, [dateFrom, dateTo, userFilter, actionFilter]);

  const exportCsv = () => {
    const headers = ["Timestamp", "User", "Action", "Resource ID", "IP Address"];
    const rows = filtered.map((r) => [r.timestamp, r.user, r.action, r.resourceId, r.ip].join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExportOpen(false);
  };

  const exportPdf = () => {
    setExportOpen(false);
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Allow popups to export PDF.");
      return;
    }
    const table = tableRef.current;
    const rows = table?.querySelectorAll("tbody tr");
    const rowHtml = rows
      ? Array.from(rows)
          .map(
            (tr) =>
              "<tr>" +
              Array.from(tr.querySelectorAll("td"))
                .map((td) => `<td style="border:1px solid #ccc;padding:6px;">${(td as HTMLElement).innerText}</td>`)
                .join("") +
              "</tr>",
          )
          .join("")
      : "";
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head><title>Audit Logs Export</title></head>
        <body style="font-family:sans-serif;padding:20px;">
          <h1>Audit Trail Report</h1>
          <p>Generated: ${new Date().toISOString()}</p>
          <p>Records: ${filtered.length}</p>
          <table style="border-collapse:collapse;width:100%;margin-top:16px;">
            <thead><tr>
              <th style="border:1px solid #ccc;padding:6px;text-align:left;">Timestamp</th>
              <th style="border:1px solid #ccc;padding:6px;text-align:left;">User</th>
              <th style="border:1px solid #ccc;padding:6px;text-align:left;">Action</th>
              <th style="border:1px solid #ccc;padding:6px;text-align:left;">Resource ID</th>
              <th style="border:1px solid #ccc;padding:6px;text-align:left;">IP Address</th>
            </tr></thead>
            <tbody>${rowHtml}</tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/security" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Security
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Audit Logs</h1>
          <p className="mt-1 text-sm text-slate-600">
            Unified audit trail. Filter and export for compliance reports.
          </p>
        </div>
        <nav className="flex gap-2">
          <Link href="/admin/security" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">Authentication</Link>
          <Link href="/admin/security/incidents" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">Incidents</Link>
          <Link href="/admin/security/encryption" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">Encryption</Link>
          <Link href="/admin/security/audit-logs" className="inline-flex h-9 items-center rounded-md bg-slate-100 px-3 text-sm font-medium text-slate-900">Audit Logs</Link>
          <Link href="/admin/security/access-control" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">Access Control</Link>
        </nav>
      </div>

      <Card className="p-4">
        <div className="mb-4 flex flex-wrap items-end gap-4">
          <Input
            label="Date from"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="max-w-[160px]"
          />
          <Input
            label="Date to"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="max-w-[160px]"
          />
          <div className="min-w-[180px]">
            <label htmlFor="audit-user" className="block text-xs font-medium text-slate-700">User</label>
            <input
              id="audit-user"
              type="text"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              placeholder="Filter by user..."
              className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>
          <div className="min-w-[180px]">
            <label htmlFor="audit-action" className="block text-xs font-medium text-slate-700">Action type</label>
            <select
              id="audit-action"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
            >
              <option value="">All actions</option>
              {ACTION_TYPES.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div className="relative ml-auto">
            <Button variant="secondary" size="sm" onClick={() => setExportOpen((o) => !o)}>
              Export for compliance
            </Button>
            {exportOpen && (
              <div className="absolute right-0 top-full z-10 mt-1 w-48 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                <button type="button" className="flex w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100" onClick={exportCsv}>
                  Export CSV
                </button>
                <button type="button" className="flex w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100" onClick={exportPdf}>
                  Export PDF (print)
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table ref={tableRef} className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Timestamp</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">User</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Action</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Resource ID</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 text-slate-700">{row.timestamp}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{row.user}</td>
                  <td className="px-4 py-3 text-slate-900">{row.action}</td>
                  <td className="px-4 py-3 font-mono text-slate-600">{row.resourceId}</td>
                  <td className="px-4 py-3 text-slate-600">{row.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="py-8 text-center text-slate-500">No logs match the filters.</p>
        )}
      </Card>
    </div>
  );
}
