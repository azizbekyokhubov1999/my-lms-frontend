"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

const COMPLIANCE_REPORTS = [
  { id: "tax-2025", name: "Tax Summary FY 2025", description: "Annual tax compliance report" },
  { id: "audit-q1", name: "Internal Audit Q1 2026", description: "Quarterly internal audit" },
  { id: "revenue-stmt", name: "Revenue Statement", description: "Monthly revenue breakdown" },
  { id: "contract-summary", name: "Contract Summary", description: "All contracts by status" },
];

function exportToExcel(rows: Array<Record<string, string>>, filename: string) {
  const headers = Object.keys(rows[0] ?? {});
  const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => r[h]).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ComplianceReportsPage() {
  const handleExportExcel = (id: string, name: string) => {
    const sample = [
      { Report: name, Generated: new Date().toISOString().slice(0, 10), Status: "Approved" },
    ];
    exportToExcel(sample, `${id}.csv`);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/finance/reports" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Reports
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Compliance & Export</h1>
        <p className="mt-1 text-sm text-slate-600">
          Ready-to-print PDF and Excel exports for tax and internal audit compliance.
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Compliance Reports
        </h2>
        <p className="mt-0.5 text-xs text-slate-600">
          Select a report and export to Excel or print (PDF).
        </p>
        <ul className="mt-4 space-y-3">
          {COMPLIANCE_REPORTS.map((r) => (
            <li
              key={r.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 p-4 hover:bg-slate-50/50"
            >
              <div>
                <p className="font-medium text-slate-900">{r.name}</p>
                <p className="text-sm text-slate-600">{r.description}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleExportExcel(r.id, r.name)}
                >
                  Export to Excel
                </Button>
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={handleExportPDF}
                >
                  Print / PDF
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="border-l-4 border-l-emerald-600 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Quick Export
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Export all tables as Excel (CSV). Use Print for PDF.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => exportToExcel([{ Report: "Full Tax Report", Date: new Date().toISOString().slice(0, 10) }], "tax-compliance.csv")}>
            Tax Report (Excel)
          </Button>
          <Button variant="secondary" onClick={handleExportPDF}>
            Print to PDF
          </Button>
        </div>
      </Card>
    </div>
  );
}
