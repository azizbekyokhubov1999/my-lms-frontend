"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

const PAYMENT_STATUS_KEY = "admission_payment_status";
const REFRESH_COUNT_KEY = "admission_refresh_count";
const HISTORY_KEY = "admission_application_history";
const HAS_DATA_KEY = "admission_has_data";
const EXAM_BOOKING_KEY = "admission_exam_booking";
const REJECTION_REASON_KEY = "admission_rejection_reason";
const ATTEMPT_COUNT_KEY = "admission_attempt_count";

function getAttemptCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const v = localStorage.getItem(ATTEMPT_COUNT_KEY);
    const n = parseInt(v ?? "0", 10);
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

const DEFAULT_REJECTION_REASON =
  "Below passing score in quantitative section. Low GPA in Mathematics.";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type ResultStatus = "Passed" | "Failed" | "Pending";

interface HistoryRow {
  activity: string;
  date: string;
  paymentStatus: string;
  result: ResultStatus;
}

function getStoredRefreshCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const v = localStorage.getItem(REFRESH_COUNT_KEY);
    const n = parseInt(v ?? "0", 10);
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

function getStoredHistory(): HistoryRow[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryRow[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHistory(rows: HistoryRow[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(rows));
  } catch {
    /* ignore */
  }
}

interface ExamBooking {
  date: string;
  time: string;
  durationMinutes?: number;
  location?: string;
  bookedAt?: string;
}

function getStoredExamBooking(): ExamBooking | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(EXAM_BOOKING_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ExamBooking;
    return parsed?.date && parsed?.time ? parsed : null;
  } catch {
    return null;
  }
}

function getStoredRejectionReason(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(REJECTION_REASON_KEY);
  } catch {
    return null;
  }
}

const DEFAULT_HISTORY: HistoryRow[] = [
  {
    activity: "Initial Application",
    date: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    paymentStatus: "Paid",
    result: "Pending",
  },
];

const DOCUMENTS = [
  { id: "passport", label: "Passport", verified: true },
  { id: "diploma", label: "Diploma", verified: true },
];

export default function ApplicantStatusPage() {
  const router = useRouter();
  const { user } = useAuth();
  const name = user?.fullName || "Applicant";
  const applicantId = "12345";
  const isEnrolled = user?.role === "STUDENT";
  const studentEmail = user?.role === "STUDENT" ? user.email : null;

  const [refreshCount, setRefreshCount] = React.useState(0);
  const [history, setHistory] = React.useState<HistoryRow[]>([]);
  const [hasData, setHasData] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [toast, setToast] = React.useState<string | null>(null);
  const [viewDoc, setViewDoc] = React.useState<{ id: string; label: string } | null>(null);
  const [examBooking, setExamBooking] = React.useState<ExamBooking | null>(null);
  const [rejectionReason, setRejectionReason] = React.useState<string | null>(null);
  const [attemptCount, setAttemptCount] = React.useState(0);

  React.useEffect(() => {
    const count = getStoredRefreshCount();
    const stored = getStoredHistory();
    const hasAny = typeof window !== "undefined" && localStorage.getItem(HAS_DATA_KEY) === "true";
    const booking = getStoredExamBooking();
    const reason = getStoredRejectionReason();
    const attempts = getAttemptCount();
    setRefreshCount(count);
    setHistory(stored.length > 0 ? stored : [...DEFAULT_HISTORY]);
    setHasData(hasAny);
    setExamBooking(booking);
    setRejectionReason(reason);
    setAttemptCount(attempts);
  }, []);

  const examResultRevealed = refreshCount >= 2;
  const examResult: "passed" | "failed" = refreshCount >= 3 ? "passed" : "failed";

  React.useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handleRestartApplication = () => {
    try {
      localStorage.setItem(PAYMENT_STATUS_KEY, "unpaid");
    } catch {
      /* ignore */
    }
    router.push("/admission/payment");
  };

  const handleRefreshStatus = async () => {
    setRefreshing(true);
    setToast(null);
    await new Promise((r) => setTimeout(r, 1500));

    const nextCount = refreshCount + 1;
    try {
      localStorage.setItem(REFRESH_COUNT_KEY, String(nextCount));
      localStorage.setItem(HAS_DATA_KEY, "true");
    } catch {
      /* ignore */
    }

    setRefreshCount(nextCount);

    if (nextCount === 1) {
      setToast("Results are still being processed. Please check back later.");
      setHistory((prev) => {
        const base = prev.length > 0 ? prev : [...DEFAULT_HISTORY];
        const hasExam1 = base.some((r) => r.activity.startsWith("Entrance Exam #1"));
        if (!hasExam1) {
          const newRow: HistoryRow = {
            activity: "Entrance Exam #1",
            date: new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            paymentStatus: "Paid",
            result: "Pending",
          };
          const next = [...base, newRow];
          saveHistory(next);
          return next;
        }
        return base;
      });
    } else if (nextCount === 2) {
      try {
        localStorage.setItem(REJECTION_REASON_KEY, DEFAULT_REJECTION_REASON);
      } catch {
        /* ignore */
      }
      setRejectionReason(DEFAULT_REJECTION_REASON);
      setHistory((prev) => {
        const hasExam1 = prev.some((r) => r.activity === "Entrance Exam #1");
        const next = hasExam1
          ? prev.map((r) =>
              r.activity === "Entrance Exam #1"
                ? { ...r, result: "Failed" as const }
                : r
            )
          : [
              ...prev,
              {
                activity: "Entrance Exam #1",
                date: new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }),
                paymentStatus: "Paid",
                result: "Failed" as const,
              },
            ];
        saveHistory(next);
        return next;
      });
    } else if (nextCount >= 3) {
      try {
        localStorage.removeItem(REJECTION_REASON_KEY);
      } catch {
        /* ignore */
      }
      setRejectionReason(null);
      setHistory((prev) => {
        const num = prev.filter((r) => r.activity.startsWith("Entrance Exam #")).length + 1;
        const next = [
          ...prev,
          {
            activity: `Entrance Exam #${num}`,
            date: new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            paymentStatus: "Paid",
            result: "Passed" as const,
          },
        ];
        saveHistory(next);
        return next;
      });
    }

    setRefreshing(false);
  };

  const currentStatusLabel = isEnrolled
    ? "Enrolled"
    : examResultRevealed
      ? examResult === "passed"
        ? "Passed - Sign Contract"
        : "Failed - Retake Available"
      : "Exam Under Review";

  const currentStatusVariant = isEnrolled
    ? "emerald"
    : examResultRevealed
      ? examResult === "passed"
        ? "emerald"
        : "amber"
      : "sky";

  const showStartApplication = !hasData && refreshCount === 0;

  if (showStartApplication) {
    return (
      <div className="min-h-[60vh] bg-linear-to-b from-slate-50 to-emerald-50/30 px-4 py-10 lg:px-6">
        <div className="mx-auto max-w-2xl">
          <header className="mb-8">
            <h1 className="text-xl font-semibold text-slate-900 md:text-2xl">
              Welcome, {name}!
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Applicant ID:{" "}
              <span className="font-mono font-semibold text-emerald-700">
                #{applicantId}
              </span>
            </p>
          </header>

          <Card className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900">
              Start Application
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Complete the steps below to apply for admission.
            </p>

            <ol className="mt-6 space-y-4">
            {(() => {
              const feeWaived = attemptCount === 0;
              return [
                { step: 1, label: "Registration", done: true },
                { step: 2, label: "Documents & Bio-data", done: false, current: true },
                {
                  step: 3,
                  label: feeWaived ? "Application Fee (Waived)" : "Application Fee",
                  done: feeWaived,
                },
                { step: 4, label: "Entrance Exam", done: false },
                { step: 5, label: "Enrollment & Contract", done: false },
              ];
            })().map((s) => (
              <li key={s.step} className="flex items-center gap-4">
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                    s.done && "bg-emerald-500 text-white",
                    (s as { current?: boolean }).current && !s.done && "bg-sky-500 text-white",
                    !s.done && !(s as { current?: boolean }).current && "bg-slate-200 text-slate-500"
                  )}
                >
                  {s.done ? "вњ“" : s.step}
                </span>
                <span
                  className={cn(
                    "font-medium",
                    (s as { current?: boolean }).current ? "text-sky-800" : "text-slate-700"
                  )}
                >
                  Step {s.step}: {s.label}
                </span>
              </li>
            ))}
            </ol>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/admission/upload"
                className="inline-flex items-center justify-center rounded-md bg-blue-900 px-4 py-3 text-sm font-medium text-white hover:bg-blue-800"
              >
                Upload Documents (Step 2)
              </Link>
              <button
                type="button"
                onClick={() => {
                  try {
                    localStorage.setItem(HAS_DATA_KEY, "true");
                  } catch {
                    /* ignore */
                  }
                  setHasData(true);
                }}
                className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                I&apos;ve uploaded вЂ” View student portal
              </button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] bg-linear-to-b from-slate-50 to-emerald-50/30 px-4 py-10 lg:px-6">
      {/* Toast */}
      {toast && (
        <div
          role="status"
          className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900 shadow-lg"
        >
          {toast}
        </div>
      )}

      {/* Document view modal */}
      {viewDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="doc-modal-title"
        >
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <h2 id="doc-modal-title" className="font-semibold text-slate-900">
                {viewDoc.label}
              </h2>
              <button
                type="button"
                onClick={() => setViewDoc(null)}
                className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                Г—
              </button>
            </div>
            <div className="flex items-center justify-center bg-slate-100 p-8">
              <div className="flex h-48 w-64 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-white text-slate-400">
                Document placeholder
              </div>
            </div>
            <div className="border-t border-slate-200 px-4 py-3 text-right">
              <button
                type="button"
                onClick={() => setViewDoc(null)}
                className="rounded-md bg-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <h1 className="text-xl font-semibold text-slate-900 md:text-2xl">
            Welcome back, {name}!
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Applicant ID:{" "}
            <span className="font-mono font-semibold text-emerald-700">
              #{applicantId}
            </span>
          </p>
        </header>

        {/* Current Status Card */}
        <section className="mb-8">
          <Card
            className={cn(
              "border-2",
              currentStatusVariant === "emerald" &&
                "border-emerald-200 bg-emerald-50/50",
              currentStatusVariant === "sky" && "border-sky-200 bg-sky-50/50",
              currentStatusVariant === "amber" &&
                "border-amber-200 bg-amber-50/50"
            )}
          >
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Current status
            </h2>
            <p
              className={cn(
                "mt-2 text-xl font-bold md:text-2xl",
                currentStatusVariant === "emerald" && "text-emerald-800",
                currentStatusVariant === "sky" && "text-sky-800",
                currentStatusVariant === "amber" && "text-amber-800"
              )}
            >
              {currentStatusLabel}
            </p>
            {!isEnrolled && refreshCount < 2 && (
              <p className="mt-1 text-sm text-slate-600">
                Your exam is being reviewed. Results are usually available within
                24 hours. Use &quot;Refresh Status&quot; below to check.
              </p>
            )}
            {examResultRevealed && examResult === "passed" && !isEnrolled && (
              <Link
                href="/admission/enrolled"
                className="mt-3 inline-block text-sm font-semibold text-emerald-700 hover:underline"
              >
                View & Sign Enrollment Contract в†’
              </Link>
            )}
            {examResultRevealed && examResult === "failed" && (
              <div className="mt-4 space-y-3">
                <p className="text-sm text-slate-700">
                  We regret to inform you that you did not pass. You must pay the
                  retake fee before scheduling another attempt.
                </p>
                {rejectionReason && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50/80 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                      Decision reason
                    </p>
                    <p className="mt-1 text-sm text-amber-900">
                      {rejectionReason}
                    </p>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleRestartApplication}
                    className="inline-flex h-9 items-center justify-center rounded-md bg-blue-900 px-4 text-sm font-medium text-white hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900 focus-visible:ring-offset-2"
                  >
                    Pay for Retake
                  </button>
                  <Link
                    href="/admission/exams/check"
                    className="inline-flex h-9 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Retake Exam
                  </Link>
                </div>
              </div>
            )}
          </Card>
        </section>

        {/* Scheduled exam (Overview) */}
        {!isEnrolled && (
          <section className="mb-8">
            <Card className={examBooking ? "border-sky-200 bg-sky-50/50" : ""}>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Entrance exam
              </h2>
              {examBooking ? (
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Scheduled: {new Date(examBooking.date + "Z").toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      at {examBooking.time}
                    </p>
                    {examBooking.durationMinutes && (
                      <p className="mt-0.5 text-xs text-slate-600">
                        Duration: {examBooking.durationMinutes} min В· Proctoring required
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href="/admission/exams/schedule"
                      className="inline-flex h-9 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Change slot
                    </Link>
                    <Link
                      href="/admission/exams/check"
                      className="inline-flex h-9 items-center justify-center rounded-md bg-blue-900 px-4 text-sm font-medium text-white hover:bg-blue-800"
                    >
                      Take exam
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-slate-600">
                    No exam scheduled yet. Book a slot to take your entrance exam.
                  </p>
                  <Link
                    href="/admission/exams/schedule"
                    className="inline-flex h-9 items-center justify-center rounded-md bg-blue-900 px-4 text-sm font-medium text-white hover:bg-blue-800"
                  >
                    Schedule exam
                  </Link>
                </div>
              )}
            </Card>
          </section>
        )}

        {/* Application History Table */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">
            Application history
          </h2>
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 font-semibold text-slate-800">
                      Activity
                    </th>
                    <th className="px-4 py-3 font-semibold text-slate-800">
                      Date
                    </th>
                    <th className="px-4 py-3 font-semibold text-slate-800">
                      Payment status
                    </th>
                    <th className="px-4 py-3 font-semibold text-slate-800">
                      Result
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((row, i) => (
                    <tr
                      key={`${row.activity}-${i}`}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {row.activity}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{row.date}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {row.paymentStatus}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium",
                            row.result === "Passed" &&
                              "border-emerald-200 bg-emerald-50 text-emerald-800",
                            row.result === "Failed" &&
                              "border-red-200 bg-red-50 text-red-800",
                            row.result === "Pending" &&
                              "border-amber-200 bg-amber-50 text-amber-800"
                          )}
                        >
                          {row.result}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* Documents Vault */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">
            Documents vault
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {DOCUMENTS.map((doc) => (
              <Card key={doc.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    рџ“„
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{doc.label}</p>
                    <p className="text-xs text-slate-500">
                      {doc.verified ? "Verified" : "Pending"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setViewDoc({ id: doc.id, label: doc.label })}
                  className="inline-flex h-8 items-center justify-center rounded-md border border-blue-900 px-3 text-xs font-medium text-blue-900 hover:bg-blue-50"
                >
                  View
                </button>
              </Card>
            ))}
          </div>
        </section>

        {/* Exam Results Block */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">
            Exam results
          </h2>
          <Card>
            <p className="text-sm text-slate-600">
              {refreshCount >= 3
                ? "Your latest entrance exam has been reviewed. Result: Passed."
                : examResultRevealed
                  ? "Your entrance exam result: Failed. Pay the retake fee and schedule another attempt."
                  : "Check whether your exam result is ready. Results are typically available within 24 hours."}
            </p>
            {examResultRevealed && examResult === "failed" && rejectionReason && (
              <div className="mt-3 rounded-lg border border-red-100 bg-red-50/50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-red-800">
                  Detailed reason
                </p>
                <p className="mt-1 text-sm text-red-900">{rejectionReason}</p>
              </div>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="primary"
                size="sm"
                disabled={refreshing}
                onClick={handleRefreshStatus}
              >
                {refreshing ? (
                  <>
                    <span
                      className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                      aria-hidden
                    />
                    CheckingвЂ¦
                  </>
                ) : (
                  "Refresh status"
                )}
              </Button>
              {refreshCount >= 3 && (
                <span className="text-sm font-medium text-emerald-700">
                  вњ“ Passed
                </span>
              )}
              {examResultRevealed && refreshCount < 3 && (
                <span className="text-sm font-medium text-amber-700">
                  Retake available
                </span>
              )}
            </div>
          </Card>
        </section>

        {/* Contract Section */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">
            Contract & Enrollment
          </h2>
          <Card>
            {isEnrolled ? (
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-slate-600">
                  Your enrollment contract has been signed and is on file.
                </p>
                <button
                  type="button"
                  className="inline-flex h-8 items-center justify-center rounded-md border border-blue-900 px-3 text-xs font-medium text-blue-900 hover:bg-blue-50"
                  onClick={(e) => e.preventDefault()}
                >
                  Download signed contract
                </button>
              </div>
            ) : refreshCount >= 3 ? (
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-slate-600">
                  Sign your enrollment contract to activate your student
                  account.
                </p>
                <Link
                  href="/admission/enrolled"
                  className="inline-flex h-8 items-center justify-center rounded-md bg-blue-900 px-3 text-xs font-medium text-white hover:bg-blue-800"
                >
                  View & sign enrollment contract
                </Link>
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                Contract will be available after you pass the entrance exam.
              </p>
            )}
          </Card>
        </section>

        {/* Onboarding: Welcome, ID Card, First Steps (when enrolled & contract signed) */}
        {isEnrolled && (
          <>
            <section className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-slate-800">
                Welcome to University
              </h2>
              <Card className="overflow-hidden border-emerald-100 bg-slate-900 p-0">
                <div className="relative flex aspect-video items-center justify-center bg-slate-800">
                  <div className="absolute inset-0 bg-linear-to-b from-emerald-900/20 to-transparent" />
                  <button
                    type="button"
                    className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-xl transition-transform hover:scale-105"
                    aria-label="Play welcome video"
                  >
                    <svg
                      className="ml-1 h-10 w-10"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7L8 5z" />
                    </svg>
                  </button>
                  <span className="absolute bottom-4 left-4 text-sm font-medium text-white/90">
                    Welcome to University вЂ” Watch intro
                  </span>
                </div>
                <p className="px-4 py-3 text-sm text-slate-600">
                  A short welcome and orientation video. Play when ready.
                </p>
              </Card>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-slate-800">
                Digital Student ID Card
              </h2>
              <Card className="overflow-hidden border-2 border-slate-200 shadow-lg">
                <div className="flex flex-col sm:flex-row">
                  <div className="flex h-32 w-full items-center justify-center bg-linear-to-br from-blue-900 to-slate-800 sm:h-40 sm:w-40 sm:shrink-0">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/30 bg-white/10 text-4xl text-white/80">
                      {name.charAt(0)}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-center p-4 sm:p-6">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Unified Online University
                    </p>
                    <p className="mt-1 text-xl font-bold text-slate-900">
                      {name}
                    </p>
                    <p className="mt-1 font-mono text-sm font-medium text-blue-900">
                      {studentEmail ?? "student@university.edu"}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      Student ID В· Valid for current term
                    </p>
                  </div>
                </div>
              </Card>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-slate-800">
                First steps
              </h2>
              <Card className="border-slate-100">
                <ol className="space-y-4">
                  {[
                    {
                      step: 1,
                      title: "Activate your university email",
                      detail: "Check your inbox and set your password. Use this for all university communications.",
                    },
                    {
                      step: 2,
                      title: "Complete orientation",
                      detail: "Finish the short online orientation in the student portal to unlock your courses.",
                    },
                    {
                      step: 3,
                      title: "Explore the student portal",
                      detail: "Familiarize yourself with courses, assignments, and your academic calendar.",
                    },
                    {
                      step: 4,
                      title: "Join your program group",
                      detail: "Your program coordinator will share a link. Introduce yourself and meet peers.",
                    },
                  ].map((item) => (
                    <li
                      key={item.step}
                      className="flex gap-4 rounded-lg border border-slate-100 bg-slate-50/50 p-4"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-900 text-sm font-bold text-white">
                        {item.step}
                      </span>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-sm text-slate-600">
                          {item.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
                <div className="mt-6 border-t border-slate-100 pt-4">
                  <Link
                    href="/student"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-blue-900 px-4 text-sm font-medium text-white hover:bg-blue-800"
                  >
                    Go to student portal
                  </Link>
                </div>
              </Card>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
