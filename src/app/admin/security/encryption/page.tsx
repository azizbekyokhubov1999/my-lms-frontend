"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

const ENCRYPTION_STANDARDS = [
  {
    category: "PII (Personally Identifiable Information)",
    algorithm: "AES-256-GCM",
    keyManagement: "KMS with automatic rotation",
    scope: "Names, emails, addresses, IDs",
  },
  {
    category: "Grades & Assessment Data",
    algorithm: "AES-256-GCM",
    keyManagement: "Dedicated key per tenant, KMS",
    scope: "Scores, feedback, submissions",
  },
  {
    category: "Passwords",
    algorithm: "Argon2id",
    keyManagement: "N/A (one-way hash)",
    scope: "User password hashes",
  },
  {
    category: "Data at Rest (Storage)",
    algorithm: "AES-256",
    keyManagement: "Platform-managed keys",
    scope: "Files, backups, databases",
  },
];

export default function DataEncryptionPage() {
  const [rotating, setRotating] = React.useState(false);
  const [rotated, setRotated] = React.useState(false);

  const handleRotateKeys = () => {
    if (!confirm("Rotate encryption keys? This is a sensitive operation and may take several minutes. Continue?")) return;
    setRotating(true);
    setTimeout(() => {
      setRotating(false);
      setRotated(true);
      setTimeout(() => setRotated(false), 3000);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/security" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Security
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Data Encryption</h1>
          <p className="mt-1 text-sm text-slate-600">
            Read-only view of encryption standards for sensitive data. Admin-only key rotation.
          </p>
        </div>
        <nav className="flex gap-2">
          <Link
            href="/admin/security"
            className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Authentication
          </Link>
          <Link
            href="/admin/security/incidents"
            className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Incidents
          </Link>
          <Link
            href="/admin/security/encryption"
            className="inline-flex h-9 items-center rounded-md bg-slate-100 px-3 text-sm font-medium text-slate-900"
          >
            Encryption
          </Link>
          <Link
            href="/admin/security/audit-logs"
            className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Audit Logs
          </Link>
          <Link
            href="/admin/security/access-control"
            className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Access Control
          </Link>
        </nav>
      </div>

      <Card className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Encryption standards (read-only)
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Standards applied to sensitive data. Do not modify without change control.
        </p>
        <dl className="mt-6 space-y-6">
          {ENCRYPTION_STANDARDS.map((item) => (
            <div key={item.category} className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
              <dt className="font-medium text-slate-900">{item.category}</dt>
              <dd className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <span className="text-slate-500">Algorithm:</span>{" "}
                  <span className="font-mono text-slate-800">{item.algorithm}</span>
                </div>
                <div>
                  <span className="text-slate-500">Key management:</span>{" "}
                  <span className="text-slate-800">{item.keyManagement}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500">Scope:</span>{" "}
                  <span className="text-slate-800">{item.scope}</span>
                </div>
              </dd>
            </div>
          ))}
        </dl>
      </Card>

      <Card className="border-amber-200 bg-amber-50/50 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-800">
          Admin only
        </h2>
        <p className="mt-1 text-sm text-slate-700">
          Rotating encryption keys re-encrypts data with new keys. Schedule during low traffic. Only admins can perform this action.
        </p>
        <div className="mt-4">
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleRotateKeys}
            disabled={rotating}
          >
            {rotating ? "Rotating…" : rotated ? "Keys rotated" : "Rotate Encryption Keys"}
          </Button>
          {rotated && (
            <p className="mt-2 text-sm text-emerald-700">Key rotation completed successfully (demo).</p>
          )}
        </div>
      </Card>
    </div>
  );
}
