"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import * as React from "react";

import { Button } from "../../../../components/ui/Button";
import { Card } from "../../../../components/ui/Card";

interface VerificationDocument {
  id: string;
  name: string;
  type: "Diploma" | "Contract" | "Certificate";
  uploadedAt: string;
}

const MOCK_DOCS: VerificationDocument[] = [
  { id: "d1", name: "MSc_Computer_Science_Diploma.pdf", type: "Diploma", uploadedAt: "2026-03-01 10:12" },
  { id: "d2", name: "Employment_Contract_2026.pdf", type: "Contract", uploadedAt: "2026-03-01 10:15" },
  { id: "d3", name: "Teaching_Certificate_HEI.pdf", type: "Certificate", uploadedAt: "2026-03-01 10:18" },
];

export default function TeacherVerificationPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const [decision, setDecision] = React.useState<"approved" | "rejected" | null>(null);
  const [comment, setComment] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = () => {
    if (!decision) return;
    setSubmitted(true);
    setTimeout(() => {
      window.location.href = "/resources/teachers";
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
        <p className="text-lg font-medium text-teal-700">
          Verification decision recorded (Demo). Redirecting to teachers list…
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/resources/teachers"
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Teachers
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Teacher verification</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Review documents and record an approval or rejection for teacher ID {id || "—"}.
        </p>
      </div>

      <Card>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Uploaded documents
        </h2>
        <p className="mt-0.5 text-xs text-slate-600">
          Verify authenticity and match with HR records before approving.
        </p>
        <ul className="mt-4 space-y-2">
          {MOCK_DOCS.map((doc) => (
            <li
              key={doc.id}
              className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
            >
              <span className="inline-flex rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-700">
                {doc.type}
              </span>
              <span className="flex-1 truncate font-mono text-xs text-slate-800">
                {doc.name}
              </span>
              <span className="text-xs text-slate-500">{doc.uploadedAt}</span>
              <button
                type="button"
                className="text-xs font-medium text-teal-700 hover:underline"
                onClick={() => alert(`Open ${doc.name} (Demo)`)}
              >
                View
              </button>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Decision
        </h2>
        <p className="mt-0.5 text-xs text-slate-600">
          Approve only after confirming diplomas, contracts, and certificates are valid and complete.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            type="button"
            className="bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500"
            onClick={() => setDecision("approved")}
          >
            Approve
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="border-rose-300 bg-white text-rose-700 hover:bg-rose-50"
            onClick={() => setDecision("rejected")}
          >
            Reject
          </Button>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-800">
            Verification notes
          </label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="e.g. Diploma verified with issuing institution; contract signed and archived."
            className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
          />
          <p className="mt-0.5 text-xs text-slate-500">
            This note will appear in the audit trail for this teacher.
          </p>
        </div>

        {decision && (
          <div className="mt-4 rounded-lg border border-teal-200 bg-teal-50 p-4 text-sm text-slate-800">
            <p>
              You are about to{" "}
              <strong>{decision === "approved" ? "approve" : "reject"}</strong> this teacher&apos;s
              verification.
            </p>
            <p className="mt-1 text-xs text-slate-600">
              The teacher status will be updated and HR will be notified.
            </p>
            <div className="mt-3 flex gap-2">
              <Button
                type="button"
                className="bg-teal-700 hover:bg-teal-800 focus-visible:ring-teal-700"
                onClick={handleSubmit}
              >
                Confirm decision
              </Button>
              <Button type="button" variant="secondary" onClick={() => setDecision(null)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

