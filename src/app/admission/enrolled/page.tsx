"use client";

import Link from "next/link";
import * as React from "react";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type Step = "contract" | "preview" | "signed";

export default function EnrolledSuccessPage() {
  const { user, upgradeApplicantToStudent } = useAuth();
  const [step, setStep] = React.useState<Step>("contract");
  const [agreeToTerms, setAgreeToTerms] = React.useState(false);

  const name = user?.fullName || "Student";
  // Generate student email: firstname.lastname -> f.lastname@student.university.edu
  const studentEmail =
    user?.role === "STUDENT" && user?.email
      ? user.email
      : (() => {
          const parts = name.trim().toLowerCase().split(/\s+/);
          const last = parts.pop() || "doe";
          const first = parts[0]?.charAt(0) ?? "j";
          return `${first}.${last}@student.university.edu`;
        })();

  const handleGenerateContract = () => {
    setStep("preview");
  };

  const handleSignDigitally = () => {
    if (!agreeToTerms) return;
    upgradeApplicantToStudent();
    setStep("signed");
  };

  if (step === "signed") {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-16">
        {/* Celebration confetti */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "absolute h-2 w-2 animate-confetti rounded-full opacity-70",
                i % 4 === 0 && "bg-emerald-500",
                i % 4 === 1 && "bg-blue-600",
                i % 4 === 2 && "bg-amber-400",
                i % 4 === 3 && "bg-blue-900"
              )}
              style={{
                left: `${15 + ((i * 7) % 70)}%`,
                top: `${-5 - (i % 3)}%`,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>

        <Card className="relative z-10 w-full max-w-xl text-center">
          <div
            className="animate-success-check mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100"
            role="img"
            aria-label="Success"
          >
            <svg
              className="h-12 w-12 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Welcome, {name}!
          </h1>
          <p className="mt-3 text-lg font-medium text-emerald-700">
            Your student account is ready.
          </p>
          <p className="mt-2 text-sm text-slate-600">
            You are now a student at Unified Online University.
          </p>

          <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50/50 px-4 py-4">
            <p className="text-sm font-semibold text-slate-900">
              Your student email
            </p>
            <p className="mt-2 font-mono text-base font-medium text-emerald-800">
              {studentEmail}
            </p>
          </div>

          <div className="mt-8">
            <Link
              href="/auth/login?type=student"
              className="inline-flex w-full min-w-[220px] items-center justify-center rounded-md bg-blue-900 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900 focus-visible:ring-offset-2 sm:w-auto"
            >
              Login as a Student
            </Link>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            <Link
              href="/admission/status"
              className="font-medium text-blue-900 underline hover:no-underline"
            >
              View your application history
            </Link>{" "}
            on the Applicant Dashboard anytime.
          </p>
        </Card>
      </div>
    );
  }

  if (step === "preview") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-slate-900">
              Enrollment Contract
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Two-way agreement • Unified Online University
            </p>

            {/* PDF-style preview */}
            <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-inner">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-2 text-center text-xs font-medium text-slate-500">
                ENROLLMENT CONTRACT — PREVIEW
              </div>
              <div className="max-h-[40vh] overflow-y-auto px-6 py-6 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">
                  Agreement between Unified Online University (“University”) and
                  the undersigned student (“Student”).
                </p>
                <ol className="mt-4 list-decimal space-y-3 pl-5">
                  <li>
                    The University agrees to provide access to the Learning
                    Management System, courses, and support services as described
                    in the program catalog.
                  </li>
                  <li>
                    The Student agrees to abide by the academic integrity
                    policy, attend required assessments, and maintain
                    eligibility as set by the University.
                  </li>
                  <li>
                    Both parties agree that this contract is binding upon
                    digital signature and that the Student’s enrollment is
                    effective upon receipt of the signed document by the
                    University.
                  </li>
                </ol>
                <p className="mt-6 text-slate-600">
                  By signing below, you confirm that you have read, understood,
                  and agree to the terms of this enrollment contract.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-900 focus-visible:ring-blue-900"
                />
                <span className="text-sm text-slate-700">
                  I Agree to the Terms of this enrollment contract and confirm
                  the information I provided is accurate.
                </span>
              </label>
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("contract")}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  disabled={!agreeToTerms}
                  onClick={handleSignDigitally}
                >
                  Sign Digitally
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-xl text-center">
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Enrollment complete
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          You have passed the entrance exam. Generate and sign your enrollment
          contract to activate your student account.
        </p>

        <div className="mt-8">
          <Button
            type="button"
            variant="primary"
            onClick={handleGenerateContract}
            className="min-w-[260px]"
          >
            Generate Enrollment Contract
          </Button>
        </div>
      </Card>
    </div>
  );
}
