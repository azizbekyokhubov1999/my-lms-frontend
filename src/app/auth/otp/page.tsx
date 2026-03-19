"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

export default function OtpVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") ?? "";

  const [otp, setOtp] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function handleVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Verification API wiring was not specified in the task.
      // This page provides the UI shell for OTP confirmation.
      window.alert("OTP verification is not wired yet in this UI.");
    } catch (err: any) {
      setError(err?.message ?? "OTP verification failed.");
      window.alert(err?.message ?? "OTP verification failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <Card className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">
            Verify OTP
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Enter the OTP sent to your Telegram group
            {phone ? ` (phone: ${phone})` : ""}.
          </p>
        </div>

        <form onSubmit={handleVerify} className="flex flex-col gap-4" noValidate>
          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <Input
            label="One-time password (OTP)"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="000000"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            required
          />

          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || otp.length !== 6}
            className="mt-2 w-full"
          >
            {isSubmitting ? "Verifying..." : "Verify"}
          </Button>

          <div className="text-center text-sm text-slate-600">
            <button
              type="button"
              className="font-semibold text-blue-900 hover:underline"
              onClick={() => router.push("/auth/register")}
            >
              Back to registration
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

