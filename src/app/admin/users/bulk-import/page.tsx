"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const FILE_FIELDS = ["name", "email", "role", "password"] as const;
const CSV_COLUMNS = ["Column A", "Column B", "Column C", "Column D", "Column E"] as const;

type FieldMapping = Record<string, string>;

export default function AdminUsersBulkImportPage() {
  const [dragOver, setDragOver] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [fileName, setFileName] = React.useState("");
  const [mapping, setMapping] = React.useState<FieldMapping>({
    name: "",
    email: "",
    role: "",
    password: "",
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

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setFileName(f.name);
    }
  };

  const setMappingField = (field: string, value: string) => {
    setMapping((prev) => ({ ...prev, [field]: value }));
  };

  const handleStartImport = () => {
    const missing = FILE_FIELDS.filter((f) => !mapping[f]?.trim());
    if (missing.length > 0) {
      alert(`Map required fields: ${missing.join(", ")}`);
      return;
    }
    setImporting(true);
    setTimeout(() => {
      setImporting(false);
      setDone(true);
      alert("Bulk import completed (Demo). 0 rows processed.");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/users" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Users
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Bulk Import Users</h1>
        <p className="mt-1 text-sm text-slate-600">
          Upload a CSV or Excel file and map columns to user fields.
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
            "mt-3 flex min-h-[160px] flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors",
            dragOver ? "border-blue-400 bg-blue-50/50" : "border-slate-200 bg-slate-50/50",
          )}
        >
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileInput}
            className="hidden"
            id="bulk-import-file"
          />
          <label
            htmlFor="bulk-import-file"
            className="cursor-pointer text-center text-sm text-slate-600 hover:text-slate-900"
          >
            <span className="font-medium text-blue-700">Choose a file</span>
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
        <Card className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Field mapping
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            Match each system field to a column in your file.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {FILE_FIELDS.map((field) => (
              <div key={field} className="flex flex-col gap-1">
                <label htmlFor={`map-${field}`} className="text-sm font-medium text-slate-700">
                  {field === "name" && "Full name"}
                  {field === "email" && "Email"}
                  {field === "role" && "Role"}
                  {field === "password" && "Password (optional)"}
                </label>
                <select
                  id={`map-${field}`}
                  value={mapping[field] ?? ""}
                  onChange={(e) => setMappingField(field, e.target.value)}
                  className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                >
                  <option value="">— Select column —</option>
                  {CSV_COLUMNS.map((col) => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <Button
              type="button"
              variant="primary"
              onClick={handleStartImport}
              disabled={importing}
            >
              {importing ? "Importing…" : "Start Import"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => { setFile(null); setFileName(""); setMapping({ name: "", email: "", role: "", password: "" }); setDone(false); }}
            >
              Clear
            </Button>
          </div>
          {done && (
            <p className="mt-4 text-sm text-emerald-600">Import finished. You can clear and upload another file.</p>
          )}
        </Card>
      )}

      <p className="text-xs text-slate-500">
        Expected columns: name (or first/last), email, role (Admin, Rector, Dean, AQAD, Teacher, Student, Applicant, Finance, Support).
        Password column is optional; users can be sent a reset link.
      </p>
    </div>
  );
}
