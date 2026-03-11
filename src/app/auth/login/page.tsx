"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import * as React from "react";

import { useAuth } from "@/hooks/useAuth";
import type { LoginType } from "@/context/AuthContext";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

function getLoginType(searchParams: URLSearchParams | null): LoginType {
  const type = searchParams?.get("type")?.toLowerCase();
  if (type === "student" || type === "staff" || type === "applicant") {
    return type;
  }
  return "applicant";
}

function LoginForm() {
  const searchParams = useSearchParams();
  const type = React.useMemo(
    () => getLoginType(searchParams),
    [searchParams]
  );
  const { login } = useAuth();
  const [step, setStep] = React.useState<"credentials" | "mfa">("credentials");
  const [identifier, setIdentifier] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const isApplicant = type === "applicant";
  const isStaff = type === "staff";
  const isStaffFlow = isStaff && step === "mfa";

  async function handleCredentialsSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await login({
        identifier,
        password,
        type,
      });
      if (result.success) return;
      if (result.needsMfa) {
        setStep("mfa");
        setOtp("");
        return;
      }
      setError(result.error ?? "Invalid credentials.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleMfaSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await login({
        identifier,
        password,
        type: "staff",
        otp,
      });
      if (result.success) return;
      setError(result.error ?? "Invalid verification code.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const title =
    type === "applicant"
      ? "Applicant Login"
      : type === "student"
        ? "Student Login"
        : "Staff Login";
  const subtext =
    type === "applicant"
      ? "Enter your phone and password to check your admission status."
      : type === "student"
        ? "Use your institutional email to access your student portal."
        : "Use your institutional email. MFA may be required.";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <Card className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          <p className="mt-2 text-sm text-slate-600">{subtext}</p>
        </div>

        {step === "credentials" ? (
          <form
            onSubmit={handleCredentialsSubmit}
            className="flex flex-col gap-4"
            noValidate
          >
            {error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            {isApplicant ? (
              <Input
                label="Phone Number"
                type="tel"
                autoComplete="tel"
                placeholder="+1 (555) 000-0000"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            ) : (
              <Input
                label="Institutional Email"
                type="email"
                autoComplete="email"
                placeholder={
                  type === "student"
                    ? "you@student.university.edu"
                    : "you@university.edu"
                }
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            )}

            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {type === "student" && (
              <div className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">
                Identity verification via camera will be required for exams.
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="mt-2 w-full"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        ) : (
          <form
            onSubmit={handleMfaSubmit}
            className="flex flex-col gap-4"
            noValidate
          >
            {error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <p className="text-sm text-slate-600">
              Enter the 6-digit code sent to your email/phone.
            </p>
            <Input
              label="Verification code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              maxLength={6}
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
            />

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || otp.length !== 6}
              className="mt-2 w-full"
            >
              {isSubmitting ? "Verifying..." : "Verify"}
            </Button>

            <button
              type="button"
              onClick={() => {
                setStep("credentials");
                setError(null);
                setOtp("");
              }}
              className="text-sm text-slate-600 hover:underline"
            >
              ← Back to sign in
            </button>
          </form>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-slate-600">
          <Link href="/auth/login?type=applicant" className="font-semibold text-blue-900 hover:underline">
            Applicant
          </Link>
          <Link href="/auth/login?type=student" className="font-semibold text-blue-900 hover:underline">
            Student
          </Link>
          <Link href="/auth/login?type=staff" className="font-semibold text-blue-900 hover:underline">
            Staff
          </Link>
        </div>

        <p className="mt-4 text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="font-semibold text-blue-900 hover:underline"
          >
            Register as applicant
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-sm text-slate-500">Loading...</div>
      </div>
    }>
      <LoginForm />
    </React.Suspense>
  );
}
