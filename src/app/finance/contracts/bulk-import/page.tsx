"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const REQUIRED_FIELDS = ["studentId", "studentName", "totalAmount", "startDate", "endDate"] as const;
const FILE_COLUMNS = ["Column A", "Column B", "Column C", "Column D", "Column E", "Column F"] as const;

type FieldMapping = Partial<Record<(typeof REQUIRED_FIELDS)[number], string>>;

// Mock validation preview rows
interface PreviewRow {
  row: number;
  studentId: string;
  studentName: string;
  totalAmount: string;
  startDate: string;
  endDate: string;
  errors: string[];
  status: "valid" | "invalid";
}

const MOCK_PREVIEW: PreviewRow[] = [
  { row: 1, studentId: "STU-10042", studentName: "Anna Petrova", totalAmount: "450000", startDate: "2025-09-01", endDate: "2029-06-30", errors: [], status: "valid" },
  { row: 2, studentId: "STU-10043", studentName: "Ivan Kozlov", totalAmount: "380000", startDate: "2025-09-01", endDate: "2029-06-30", errors: [], status: "valid" },
  { row: 3, studentId: "STU-10044", studentName: "", totalAmount: "520000", startDate: "2025-09-01", endDate: "2029-06-30", errors: ["Missing student name"], status: "invalid" },
  { row: 4, studentId: "STU-10045", studentName: "Maria Sokolova", totalAmount: "invalid", startDate: "2025-09-01", endDate: "2029-06-30", errors: ["Invalid amount"], status: "invalid" },
  { row: 5, studentId: "STU-10046", studentName: "Dmitri Volkov", totalAmount: "420000", startDate: "2025-09-01", endDate: "2028-12-31", errors: [], status: "valid" },
];

export default function BulkImportContractsPage() {
  const [dragOver, setDragOver] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [fileName, setFileName] = React.useState("");
  const [mapping, setMapping] = React.useState<FieldMapping>({
    studentId: "",
    studentName: "",
    totalAmount: "",
    startDate: "",
    endDate: "",
  });
  const [importing, setImporting] = React.useState(false);
  const [done, setDone] = React.useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f && (f.name.endsWith(".csv") || f.name.endsWith(".xlsx") || f.name.endsWith(".xls"))) {
      setFile(f);
      setFileName(f.name);
    } else {
      alert("Please upload a CSV or Excel file.");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setFileName(f.name);
    }
  };

  const setMappingField = (field: (typeof REQUIRED_FIELDS)[number], value: string) => {
    setMapping((prev) => ({ ...prev, [field]: value }));
  };

  const handleStartImport = () => {
    const missing = REQUIRED_FIELDS.filter((f) => !mapping[f]?.trim());
    if (missing.length > 0) {
      alert(`Map required fields: ${missing.join(", ")}`);
      return;
    }
    const invalidCount = MOCK_PREVIEW.filter((r) => r.status === "invalid").length;
    if (invalidCount > 0) {
      const proceed = window.confirm(`${invalidCount} row(s) have validation errors. Proceed with valid rows only?`);
      if (!proceed) return;
    }
    setImporting(true);
    setTimeout(() => {
      setImporting(false);
      setDone(true);
      const validCount = MOCK_PREVIEW.filter((r) => r.status === "valid").length;
      alert(`Bulk import completed (Demo). ${validCount} contract(s) imported.`);
    }, 1500);
  };

  const validCount = MOCK_PREVIEW.filter((r) => r.status === "valid").length;
  const invalidCount = MOCK_PREVIEW.filter((r) => r.status === "invalid").length;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/finance/contracts" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Contracts
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Bulk Import Contracts</h1>
        <p className="mt-1 text-sm text-slate-600">
          Upload a CSV or Excel file to import thousands of contracts. Map columns and review validation.
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Upload file
        </h2>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "mt-3 flex min-h-[180px] flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors",
            dragOver ? "border-emerald-400 bg-emerald-50/50" : "border-slate-200 bg-slate-50/50",
          )}
        >
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileInput}
            className="hidden"
            id="bulk-import-contracts-file"
          />
          <label
            htmlFor="bulk-import-contracts-file"
            className="cursor-pointer text-center text-sm text-slate-600 hover:text-slate-900"
          >
            <span className="font-medium text-emerald-700">Choose a file</span>
            <span className="text-slate-500"> or drag and drop</span>
            <br />
            <span className="text-xs text-slate-500">CSV or Excel (.xlsx, .xls)</span>
          </label>
          {fileName && (
            <p className="mt-2 text-sm font-medium text-slate-700">{fileName}</p>
          )}
        </div>
      </Card>

      {fileName && (
        <>
          <Card className="p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Field mapping
            </h2>
            <p className="mt-1 text-xs text-slate-600">
              Map your file columns to contract fields.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {REQUIRED_FIELDS.map((field) => (
                <div key={field} className="flex flex-col gap-1">
                  <label htmlFor={`map-${field}`} className="text-sm font-medium text-slate-700">
                    {field === "studentId" && "Student ID"}
                    {field === "studentName" && "Student Name"}
                    {field === "totalAmount" && "Total Amount"}
                    {field === "startDate" && "Start Date"}
                    {field === "endDate" && "End Date"}
                  </label>
                  <select
                    id={`map-${field}`}
                    value={mapping[field] ?? ""}
                    onChange={(e) => setMappingField(field, e.target.value)}
                    className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="">— Select column —</option>
                    {FILE_COLUMNS.map((col) => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </Card>

          <Card className="overflow-hidden p-0">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Validation preview
              </h2>
              <p className="mt-1 text-xs text-slate-600">
                {validCount} valid, {invalidCount} invalid. Fix errors in your file or import valid rows only.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="w-12 px-4 py-2.5 text-left text-xs font-semibold text-slate-600">Row</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600">Student ID</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600">Student Name</th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-600">Total Amount</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600">Start</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600">End</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_PREVIEW.map((r) => (
                    <tr
                      key={r.row}
                      className={cn(
                        "border-b border-slate-100 last:border-0",
                        r.status === "valid" ? "hover:bg-emerald-50/70" : "bg-amber-50/50",
                      )}
                    >
                      <td className="px-4 py-2.5 font-mono text-xs text-slate-600">{r.row}</td>
                      <td className="px-4 py-2.5 font-mono text-slate-700">{r.studentId}</td>
                      <td className="px-4 py-2.5 text-slate-700">{r.studentName || "—"}</td>
                      <td className="px-4 py-2.5 text-right font-medium text-slate-900">{r.totalAmount}</td>
                      <td className="px-4 py-2.5 text-slate-600">{r.startDate}</td>
                      <td className="px-4 py-2.5 text-slate-600">{r.endDate}</td>
                      <td className="px-4 py-2.5">
                        {r.status === "valid" ? (
                          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                            Valid
                          </span>
                        ) : (
                          <div className="space-y-1">
                            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                              Invalid
                            </span>
                            {r.errors.length > 0 && (
                              <p className="text-xs text-amber-700">{r.errors.join(", ")}</p>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-4 py-3">
              <p className="text-xs text-slate-600">
                Showing 5 sample rows. Full file will be validated on import.
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setFile(null);
                    setFileName("");
                    setMapping({});
                    setDone(false);
                  }}
                >
                  Clear
                </Button>
                <Button
                  type="button"
                  className="bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500"
                  onClick={handleStartImport}
                  disabled={importing}
                >
                  {importing ? "Importing…" : "Import Valid Rows"}
                </Button>
              </div>
            </div>
          </Card>

          {done && (
            <p className="text-sm text-emerald-600">
              Import finished. You can clear and upload another file.
            </p>
          )}
        </>
      )}

      <p className="text-xs text-slate-500">
        Expected columns: studentId, studentName, totalAmount, startDate, endDate. Dates in YYYY-MM-DD format.
      </p>
    </div>
  );
}
