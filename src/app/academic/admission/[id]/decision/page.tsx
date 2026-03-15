"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "../../../../components/ui/Button";
import { Card } from "../../../../components/ui/Card";

const MOCK_APPLICANTS: Record<string, string> = {
  a1: "Anna Petrova",
  a2: "Ivan Kozlov",
  a3: "Maria Sokolova",
  a4: "Dmitri Volkov",
  a5: "Elena Novikova",
};

type DecisionType = "accept" | "reject" | "waitlist" | "refer" | null;

export default function AdmissionDecisionPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === "string" ? params.id : "";
  const applicantName = id ? MOCK_APPLICANTS[id] ?? "Applicant" : "Applicant";

  const [decision, setDecision] = React.useState<DecisionType>(null);
  const [feedback, setFeedback] = React.useState("");
  const [referNote, setReferNote] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const showReferNote = decision === "refer";
  const canSubmit =
    decision != null &&
    (decision === "refer" ? referNote.trim().length >= 10 : feedback.trim().length >= 10);

  const handleSubmit = () => {
    if (!canSubmit) return;
    if (decision === "refer") {
      alert(`Referred to AQAD (Demo): ${applicantName}. Note: "${referNote}". Case will appear in Coordination → AQAD.`);
    } else {
      const action = decision === "accept" ? "Accepted" : decision === "reject" ? "Rejected" : "Moved to waitlist";
      alert(`Decision recorded (Demo): ${applicantName} — ${action}. Feedback will be synced with Admission (Abiturient) status.`);
    }
    setSubmitted(true);
    setTimeout(() => router.push("/academic/admission"), 1500);
  };

  if (submitted) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
        <p className="text-lg font-medium text-violet-700">Decision recorded. Redirecting to queue…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href={`/academic/admission/${id}`} className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Back to review
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Admission decision</h1>
        <p className="mt-0.5 text-sm text-slate-600">{applicantName} — Choose outcome and add feedback for the student.</p>
      </div>

      <Card className="max-w-2xl border-2 border-violet-200 bg-violet-50/30 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-violet-900">Decision</h2>
        <p className="mt-0.5 text-xs text-slate-600">Select one. Status will sync with Admission (Abiturient) role.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setDecision("accept")}
            className={`rounded-lg border-2 px-4 py-3 text-sm font-semibold transition-colors ${
              decision === "accept"
                ? "border-emerald-600 bg-emerald-600 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50"
            }`}
          >
            Accept
          </button>
          <button
            type="button"
            onClick={() => setDecision("reject")}
            className={`rounded-lg border-2 px-4 py-3 text-sm font-semibold transition-colors ${
              decision === "reject"
                ? "border-rose-600 bg-rose-600 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-rose-300 hover:bg-rose-50"
            }`}
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => setDecision("waitlist")}
            className={`rounded-lg border-2 px-4 py-3 text-sm font-semibold transition-colors ${
              decision === "waitlist"
                ? "border-violet-600 bg-violet-600 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-violet-300 hover:bg-violet-50"
            }`}
          >
            Move to waitlist
          </button>
          <button
            type="button"
            onClick={() => setDecision("refer")}
            className={`rounded-lg border-2 px-4 py-3 text-sm font-semibold transition-colors ${
              decision === "refer"
                ? "border-amber-500 bg-amber-50 text-amber-700"
                : "border-amber-500 bg-transparent text-amber-600 hover:bg-amber-50"
            }`}
          >
            Refer to AQAD
          </button>
        </div>

        {showReferNote && (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50/50 p-4">
            <label className="block text-sm font-medium text-amber-800">
              Reason for referral / dispute <span className="text-amber-600">*</span>
            </label>
            <textarea
              value={referNote}
              onChange={(e) => setReferNote(e.target.value)}
              required
              minLength={10}
              rows={3}
              placeholder="Explain why this case is being referred for higher review or disputed (e.g. borderline documents, special circumstances)."
              className="mt-1 w-full rounded-md border border-amber-200 bg-white px-3 py-2 text-sm placeholder-amber-400/80 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
            />
            <p className="mt-0.5 text-xs text-amber-700">Minimum 10 characters. This note is sent to AQAD for review.</p>
          </div>
        )}

        {!showReferNote && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-slate-800">
            Feedback for the student <span className="text-rose-600">*</span>
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
            minLength={10}
            rows={4}
            placeholder="e.g. Congratulations, you have been accepted. You will receive enrollment instructions by email."
            className="mt-1 w-full rounded-md border-2 border-slate-200 bg-white px-3 py-2 text-sm placeholder-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
          />
          <p className="mt-0.5 text-xs text-slate-500">Minimum 10 characters. This note is shared with the applicant.</p>
        </div>
        )}

        <div className="mt-6 flex gap-3">
          <Link href={`/academic/admission/${id}`}>
            <Button type="button" variant="secondary">Cancel</Button>
          </Link>
          <Button
            type="button"
            className="bg-violet-600 hover:bg-violet-700 focus-visible:ring-violet-500"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            Submit decision
          </Button>
        </div>
      </Card>
    </div>
  );
}
