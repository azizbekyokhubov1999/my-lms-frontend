"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type Step = 1 | 2 | 3;

const MOCK_TEACHERS = [
  "Dr. Nina Kozlova – Engineering",
  "Prof. Timur Akhmetov – Business",
  "Dr. Aigerim Sadykova – Law",
  "Assoc. Prof. Malik Nurgaliyev – Medicine",
];

const STEPS: Array<{ num: Step; label: string }> = [
  { num: 1, label: "Outgoing teacher" },
  { num: 2, label: "Incoming replacement" },
  { num: 3, label: "Confirm" },
];

export default function InitiateReplacementPage() {
  const router = useRouter();
  const [step, setStep] = React.useState<Step>(1);
  const [outgoingSearch, setOutgoingSearch] = React.useState("");
  const [incomingSearch, setIncomingSearch] = React.useState("");
  const [outgoing, setOutgoing] = React.useState<string | null>(null);
  const [incoming, setIncoming] = React.useState<string | null>(null);
  const [reason, setReason] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const filteredOutgoing = React.useMemo(() => {
    const q = outgoingSearch.trim().toLowerCase();
    if (!q) return MOCK_TEACHERS;
    return MOCK_TEACHERS.filter((t) => t.toLowerCase().includes(q));
  }, [outgoingSearch]);

  const filteredIncoming = React.useMemo(() => {
    const q = incomingSearch.trim().toLowerCase();
    if (!q) return MOCK_TEACHERS;
    return MOCK_TEACHERS.filter((t) => t.toLowerCase().includes(q));
  }, [incomingSearch]);

  const canNext1 = Boolean(outgoing);
  const canNext2 = Boolean(incoming && incoming !== outgoing);
  const canSubmit = step === 3 && outgoing && incoming && reason.trim().length >= 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitted(true);
    setTimeout(() => router.push("/resources/replacements/transfer"), 1500);
  };

  if (submitted) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
        <p className="text-lg font-medium text-teal-700">Replacement initiated. Proceed to Content Transfer.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/resources/replacements" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Replacements
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Initiate replacement</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Select the outgoing teacher and the incoming replacement. Students in affected groups will be notified when the transfer is complete.
        </p>
      </div>

      {/* Step progress */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <React.Fragment key={s.num}>
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                step >= s.num ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-500",
              )}
            >
              {s.num}
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn("h-0.5 flex-1 min-w-[20px]", step > s.num ? "bg-teal-600" : "bg-slate-200")} />
            )}
          </React.Fragment>
        ))}
      </div>
      <p className="text-xs font-medium text-slate-500">Step {step}: {STEPS[step - 1].label}</p>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <section className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Outgoing teacher</h2>
              <Input
                label="Search"
                placeholder="Search by name or department…"
                value={outgoingSearch}
                onChange={(e) => setOutgoingSearch(e.target.value)}
              />
              <ul className="max-h-48 space-y-1 overflow-y-auto rounded-md border border-slate-200 bg-white p-1 text-sm">
                {filteredOutgoing.map((t) => (
                  <li key={t}>
                    <button
                      type="button"
                      onClick={() => setOutgoing(t)}
                      className={cn(
                        "w-full rounded-md px-2 py-2 text-left",
                        outgoing === t ? "bg-teal-600 text-white" : "hover:bg-slate-50",
                      )}
                    >
                      {t}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {step === 2 && (
            <section className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Incoming replacement</h2>
              <Input
                label="Search"
                placeholder="Search by name or department…"
                value={incomingSearch}
                onChange={(e) => setIncomingSearch(e.target.value)}
              />
              <ul className="max-h-48 space-y-1 overflow-y-auto rounded-md border border-slate-200 bg-white p-1 text-sm">
                {filteredIncoming
                  .filter((t) => t !== outgoing)
                  .map((t) => (
                    <li key={t}>
                      <button
                        type="button"
                        onClick={() => setIncoming(t)}
                        className={cn(
                          "w-full rounded-md px-2 py-2 text-left",
                          incoming === t ? "bg-teal-600 text-white" : "hover:bg-slate-50",
                        )}
                      >
                        {t}
                      </button>
                    </li>
                  ))}
              </ul>
            </section>
          )}

          {step === 3 && (
            <section className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Confirm & reason</h2>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                <p><strong>Outgoing:</strong> {outgoing}</p>
                <p className="mt-1"><strong>Incoming:</strong> {incoming}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-800">Reason for replacement (required)</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  placeholder="e.g. Leave of absence, resignation, reassignment…"
                  className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                  required
                  minLength={10}
                />
                <p className="mt-0.5 text-xs text-slate-500">Min 10 characters. Stored in audit trail.</p>
              </div>
            </section>
          )}

          <div className="flex justify-between gap-3 border-t border-slate-200 pt-4">
            <Button
              type="button"
              variant="secondary"
              disabled={step === 1}
              onClick={() => setStep((s) => (s > 1 ? (s - 1) as Step : s))}
            >
              Back
            </Button>
            {step < 3 ? (
              <Button
                type="button"
                className="bg-teal-600 hover:bg-teal-700"
                disabled={(step === 1 && !canNext1) || (step === 2 && !canNext2)}
                onClick={() => setStep((s) => (s + 1) as Step)}
              >
                Next
              </Button>
            ) : (
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={!canSubmit}>
                Initiate replacement
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
