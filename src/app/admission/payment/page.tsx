"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

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

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type PaymentMethod = "payme" | "bank" | "card";
type PaymentStatus = "idle" | "syncing" | "confirmed";

const APPLICATION_FEE_USD = 20;
const APPLICATION_FEE_UZS = "250,000";

const STEPS = [
  { key: "register", label: "Register", completed: true },
  { key: "upload", label: "Upload Docs", completed: true },
  { key: "payment", label: "Payment", current: true },
  { key: "exam", label: "Exam", completed: false },
  { key: "enrolled", label: "Enrolled", completed: false },
];

const METHODS: { id: PaymentMethod; label: string; description: string }[] = [
  { id: "payme", label: "Payme / Click", description: "Uzbek e-wallets" },
  { id: "bank", label: "Bank Transfer", description: "Direct bank deposit" },
  { id: "card", label: "Visa / Mastercard", description: "International cards" },
];

export default function AdmissionPaymentPage() {
  const router = useRouter();
  const [attemptCount, setAttemptCount] = React.useState(0);
  const [selectedMethod, setSelectedMethod] = React.useState<PaymentMethod | null>(null);
  const [paymentStatus, setPaymentStatus] = React.useState<PaymentStatus>("idle");
  const [cardNumber, setCardNumber] = React.useState("");
  const [expiry, setExpiry] = React.useState("");
  const [cvv, setCvv] = React.useState("");

  React.useEffect(() => {
    setAttemptCount(getAttemptCount());
  }, []);

  const isFirstAttempt = attemptCount === 0;

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\D/g, "").slice(0, 16);
    return v.replace(/(.{4})/g, "$1 ").trim();
  };

  const canPay =
    selectedMethod === "payme" ||
    selectedMethod === "bank" ||
    (selectedMethod === "card" && cardNumber.replace(/\s/g, "").length >= 16 && expiry.length >= 5 && cvv.length >= 3);

  const handlePay = async () => {
    setPaymentStatus("syncing");
    await new Promise((r) => setTimeout(r, 2200));
    setPaymentStatus("confirmed");
  };

  if (paymentStatus === "confirmed") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <Card className="w-full max-w-md text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
            ✓
          </div>
          <h2 className="mt-4 text-xl font-semibold text-slate-900">
            Payment Received!
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Your Exam is now unlocked.
          </p>
          <Button
            type="button"
            variant="primary"
            className="mt-6 w-full"
            onClick={() => router.push("/admission/exam")}
          >
            Proceed to Exam
          </Button>
        </Card>
      </div>
    );
  }

  // First attempt: fee waived — allow direct proceed to Exam Scheduling
  if (isFirstAttempt) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <Card className="w-full max-w-lg">
          <header className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-900">
              Admission Process
            </p>
            <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
              Application fee
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Free for first attempt
            </p>
          </header>

          <nav aria-label="Admission steps" className="mb-6">
            <ol className="flex items-center justify-between gap-1 text-xs">
              {STEPS.map((step, i) => (
                <li key={step.key} className="flex items-center gap-1">
                  <div
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold",
                      (step.current || step.completed) &&
                        "border-blue-900 bg-blue-900 text-white",
                      !step.current &&
                        !step.completed &&
                        "border-slate-300 bg-slate-100 text-slate-500"
                    )}
                  >
                    {i + 1}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="h-px w-2 bg-slate-200 sm:w-4" />
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50/50 px-4 py-4">
            <p className="text-sm font-medium text-emerald-900">
              As a first-time applicant, your application fee is covered by the
              university.
            </p>
            <p className="mt-2 text-xs text-emerald-800">
              Application Fee: Waived
            </p>
          </div>

          <Link
            href="/admission/exams/schedule"
            className="inline-flex w-full items-center justify-center rounded-lg bg-blue-900 px-4 py-3 text-sm font-medium text-white hover:bg-blue-800"
          >
            Proceed to Exam Scheduling
          </Link>

          <p className="mt-4 text-center text-xs text-slate-500">
            <Link href="/admission/status" className="font-medium text-blue-900 hover:underline">
              Back to Overview
            </Link>
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-lg">
        <header className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-900">
            Admission Process
          </p>
          <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
            Application fee
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Pay the application fee to unlock your entrance exam.
          </p>
        </header>

        <nav aria-label="Admission steps" className="mb-6">
          <ol className="flex items-center justify-between gap-1 text-xs">
            {STEPS.map((step, i) => (
              <li key={step.key} className="flex items-center gap-1">
                <div
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold",
                    step.current && "border-blue-900 bg-blue-900 text-white",
                    step.completed && "border-blue-900 bg-blue-900 text-white",
                    !step.current &&
                      !step.completed &&
                      "border-slate-300 bg-slate-100 text-slate-500"
                  )}
                >
                  {i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="h-px w-2 bg-slate-200 sm:w-4" />
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Invoice Details */}
        <section className="mb-6 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Invoice Details
          </h2>
          <dl className="mt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <dt className="text-slate-600">Application Processing Fee</dt>
              <dd className="font-medium text-slate-900">
                ${APPLICATION_FEE_USD}
              </dd>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <dt>Equivalent (UZS)</dt>
              <dd>{APPLICATION_FEE_UZS} UZS</dd>
            </div>
          </dl>
          <div className="mt-3 border-t border-slate-200 pt-3 flex justify-between text-sm font-semibold">
            <dt>Total</dt>
            <dd className="text-slate-900">${APPLICATION_FEE_USD}</dd>
          </div>
        </section>

        {/* Payment Methods */}
        <section className="mb-6">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">
            Payment method
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {METHODS.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setSelectedMethod(method.id)}
                className={cn(
                  "flex flex-col rounded-xl border-2 px-4 py-3 text-left transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900 focus-visible:ring-offset-2",
                  selectedMethod === method.id
                    ? "border-blue-900 bg-blue-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                )}
              >
                <span className="font-medium text-slate-900">{method.label}</span>
                <span className="mt-0.5 text-xs text-slate-500">
                  {method.description}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Card details (only when Visa/Mastercard selected) */}
        {selectedMethod === "card" && (
          <div className="mb-6 space-y-4 rounded-xl border border-slate-200 bg-slate-50/30 p-4">
            <h3 className="text-sm font-semibold text-slate-800">
              Card details
            </h3>
            <Input
              label="Card number"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) =>
                setCardNumber(formatCardNumber(e.target.value))
              }
              maxLength={19}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Expiry"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                  setExpiry(
                    v.length >= 2 ? `${v.slice(0, 2)}/${v.slice(2)}` : v
                  );
                }}
                maxLength={5}
              />
              <Input
                label="CVV"
                type="password"
                placeholder="123"
                value={cvv}
                onChange={(e) =>
                  setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                maxLength={4}
              />
            </div>
          </div>
        )}

        {paymentStatus === "syncing" ? (
          <div className="flex items-center justify-center gap-3 rounded-lg border border-slate-200 bg-slate-50 py-4">
            <span
              className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-900"
              aria-hidden
            />
            <span className="text-sm font-medium text-slate-700">
              Syncing with 1C Financial System...
            </span>
          </div>
        ) : (
          <Button
            type="button"
            variant="primary"
            disabled={!canPay}
            onClick={handlePay}
            className="w-full"
          >
            Pay Now (${APPLICATION_FEE_USD})
          </Button>
        )}
      </Card>
    </div>
  );
}
