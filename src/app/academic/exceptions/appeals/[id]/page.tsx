"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "../../../../components/ui/Button";
import { Card } from "../../../../components/ui/Card";

import {
  getAppealById,
  resolveAppeal,
  type Appeal,
  type AppealOutcome,
} from "../appealsData";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const TYPE_LABELS: Record<Appeal["type"], string> = {
  grade: "Grade",
  disciplinary: "Disciplinary",
};

const OUTCOME_LABELS: Record<AppealOutcome, string> = {
  approved: "Approved",
  rejected: "Rejected",
};

const MOCK_OFFICER_NAME = "Academic Officer";

export default function AppealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === "string" ? params.id : "";
  const [appeal, setAppeal] = React.useState<Appeal | null>(null);
  const [loaded, setLoaded] = React.useState(false);
  const [officerFeedback, setOfficerFeedback] = React.useState("");
  const [decision, setDecision] = React.useState<AppealOutcome | null>(null);
  const [submitted, setSubmitted] = React.useState(false);

  React.useEffect(() => {
    const a = id ? getAppealById(id) : undefined;
    setAppeal(a ?? null);
    setLoaded(true);
  }, [id]);

  const handleDecision = (outcome: AppealOutcome) => {
    if (!appeal || appeal.status === "resolved") return;
    setDecision(outcome);
  };

  const handleConfirm = () => {
    if (!appeal || decision === null) return;
    const feedback = officerFeedback.trim() || (decision === "approved" ? "Appeal approved; original decision reversed." : "Appeal rejected; original decision upheld.");
    resolveAppeal(appeal.id, decision, feedback, MOCK_OFFICER_NAME);
    setSubmitted(true);
    setTimeout(() => router.push("/academic/exceptions/appeals"), 1500);
  };

  const canSubmit = decision !== null;
  const isResolved = appeal?.status === "resolved";

  if (!id) {
    return (
      <div className="space-y-4">
        <Link href="/academic/exceptions/appeals" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Appeals
        </Link>
        <p className="text-slate-600">Appeal not found.</p>
      </div>
    );
  }

  if (!loaded || appeal === null) {
    return (
      <div className="space-y-4">
        <Link href="/academic/exceptions/appeals" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Appeals
        </Link>
        <p className="text-slate-600">{loaded ? "Appeal not found." : "Loading…"}</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
        <p className="text-lg font-medium text-violet-700">
          Appeal marked as Resolved. Notification logged for student. Redirecting to list…
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link href="/academic/exceptions/appeals" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Appeals
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Appeal review</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          {appeal.subject} · {appeal.studentName} ({appeal.studentId})
        </p>
        <span className="mt-2 inline-block rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-800">
          {TYPE_LABELS[appeal.type]}
        </span>
        {isResolved && appeal.outcome && (
          <span className={cn(
            "ml-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold",
            appeal.outcome === "approved" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800",
          )}>
            Resolved ({OUTCOME_LABELS[appeal.outcome]})
          </span>
        )}
      </div>

      {/* Appeal details */}
      <Card className="border-violet-200 bg-violet-50/50 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Appeal details</h2>
        <div className="mt-4 space-y-4">
          <div>
            <p className="text-xs font-medium text-slate-500">Student appeal text</p>
            <p className="mt-1 rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-800 whitespace-pre-wrap">
              {appeal.appealText}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Original grade / decision</p>
            <p className="mt-1 rounded-md border border-amber-200 bg-amber-50/50 p-3 text-sm text-slate-800">
              {appeal.originalGradeOrDecision}
            </p>
          </div>
          {appeal.evidence.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-500">Uploaded evidence</p>
              <ul className="mt-1 space-y-1">
                {appeal.evidence.map((e) => (
                  <li key={e.id} className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                    <span className="font-mono">{e.name}</span>
                    <span className="text-xs text-slate-500">({e.uploadedAt})</span>
                    <button
                      type="button"
                      className="ml-auto text-xs font-medium text-violet-600 hover:underline"
                      onClick={() => alert(`Download / view ${e.name} (Demo).`)}
                    >
                      View
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>

      {/* Resolved: show outcome and feedback */}
      {isResolved && (
        <Card className="border-slate-200 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Resolution</h2>
          <p className="mt-2 text-sm text-slate-700">
            <strong>Outcome:</strong> {appeal.outcome && OUTCOME_LABELS[appeal.outcome]}
            {appeal.reviewedBy && <> · <strong>Reviewed by:</strong> {appeal.reviewedBy}</>}
            {appeal.reviewedAt && <> · {appeal.reviewedAt}</>}
          </p>
          {appeal.officerFeedback && (
            <p className="mt-2 text-sm text-slate-700"><strong>Feedback:</strong> {appeal.officerFeedback}</p>
          )}
          <p className="mt-3 text-xs text-slate-500">The student was notified of this decision.</p>
        </Card>
      )}

      {/* Decision interface (only when not resolved) */}
      {!isResolved && (
        <Card className="border-violet-200 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Academic officer feedback</h2>
          <p className="mt-0.5 text-xs text-slate-500">Provide feedback for the student (included in the notification).</p>
          <textarea
            value={officerFeedback}
            onChange={(e) => setOfficerFeedback(e.target.value)}
            rows={4}
            placeholder="e.g. After re-review, question 3 has been re-graded. Your new score is 78%."
            className="mt-3 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
          />

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              type="button"
              className="bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500"
              onClick={() => handleDecision("approved")}
            >
              Approve appeal
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="border-rose-300 bg-white text-rose-700 hover:bg-rose-50"
              onClick={() => handleDecision("rejected")}
            >
              Reject appeal
            </Button>
          </div>

          {canSubmit && (
            <div className="mt-6 rounded-lg border border-violet-200 bg-violet-50/50 p-4">
              <p className="text-sm font-medium text-slate-800">
                {decision === "approved"
                  ? "Approve appeal (reverses original decision)"
                  : "Reject appeal (original decision upheld)"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                On confirm, status will be set to Resolved and the student will be notified.
              </p>
              <div className="mt-3 flex gap-3">
                <Button
                  type="button"
                  className="bg-violet-600 hover:bg-violet-700 focus-visible:ring-violet-500"
                  onClick={handleConfirm}
                >
                  Confirm and close appeal
                </Button>
                <Button type="button" variant="secondary" onClick={() => setDecision(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {!isResolved && (
        <div className="flex justify-end">
          <Link href="/academic/exceptions/appeals">
            <Button type="button" variant="secondary">Back to list</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
