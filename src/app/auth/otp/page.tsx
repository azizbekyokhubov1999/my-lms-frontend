"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { verifyOtp } from "@/services/authService";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

const TOKEN_STORAGE_KEY = "token";

function extractTokenFromResponse(data: unknown): string | null {
  if (data == null) return null;
  if (typeof data === "string" && data.trim()) return data.trim();

  if (typeof data === "object") {
    const obj = data as Record<string, unknown>;
    const direct =
      obj.token ?? obj.accessToken ?? obj.access_token ?? obj.jwt;
    if (typeof direct === "string" && direct.trim()) return direct.trim();

    const nested = obj.data;
    if (nested && typeof nested === "object") {
      const n = nested as Record<string, unknown>;
      const t = n.token ?? n.accessToken ?? n.access_token ?? n.jwt;
      if (typeof t === "string" && t.trim()) return t.trim();
    }
  }

  return null;
}

function OTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") ?? "";
  const email = searchParams.get("email") ?? "";

  const [otp, setOtp] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function handleVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Email is missing. Please return to registration and try again.");
      return;
    }

    if (otp.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await verifyOtp(email.trim(), otp);
      const token = extractTokenFromResponse(data);

      if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
      } else {
        console.warn("[otp] Verify succeeded but no token field found in response; storing raw response key if present");
      }

      router.push("/admission");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid or expired code. Please try again.";
      setError(message);
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
            {phone ? ` (phone: ${phone})` : ""}
            {email ? ` · ${email}` : ""}.
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
            name="otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="000000"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            required
          />

          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || otp.length !== 6 || !email.trim()}
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

export default function OtpVerificationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OTPContent />
    </Suspense>
  );
}
