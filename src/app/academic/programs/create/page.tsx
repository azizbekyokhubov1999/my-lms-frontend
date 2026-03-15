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

const STEPS = ["Basics", "Duration & Credits", "Review"];

export default function CreateProgramPage() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [name, setName] = React.useState("");
  const [code, setCode] = React.useState("");
  const [faculty, setFaculty] = React.useState("");
  const [durationYears, setDurationYears] = React.useState("");
  const [credits, setCredits] = React.useState("");
  const [description, setDescription] = React.useState("");

  const canNextStep0 = name.trim() && code.trim();
  const canNextStep1 = durationYears && Number(durationYears) > 0 && credits && Number(credits) > 0;

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else {
      alert(`Program "${name}" created (Demo). Redirecting.`);
      router.push("/academic/programs");
    }
  };

  const handleBack = () => (step > 0 ? setStep((s) => s - 1) : router.push("/academic/programs"));

  return (
    <div className="space-y-6">
      <div>
        <Link href="/academic/programs" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Programs
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Create Program</h1>
        <p className="mt-0.5 text-sm text-slate-600">Define a new academic program in steps.</p>
      </div>

      {/* Stepper */}
      <nav aria-label="Progress" className="flex items-center justify-center">
        <ol className="flex items-center gap-2">
          {STEPS.map((label, i) => (
            <li key={label} className="flex items-center">
              <button
                type="button"
                onClick={() => setStep(i)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2",
                  i === step && "bg-purple-700 text-white",
                  i < step && "bg-purple-100 text-purple-800 hover:bg-purple-200",
                  i > step && "bg-slate-100 text-slate-500 hover:bg-slate-200",
                )}
              >
                {i + 1}. {label}
              </button>
              {i < STEPS.length - 1 && (
                <span className="mx-1 h-0.5 w-6 bg-slate-200" aria-hidden />
              )}
            </li>
          ))}
        </ol>
      </nav>

      <Card className="max-w-2xl p-6">
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Basic information</h2>
            <Input label="Program name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. BSc Software Development" className="focus-visible:ring-purple-500 focus-visible:border-purple-500" />
            <Input label="Program code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. BSC-SD" className="font-mono focus-visible:ring-purple-500 focus-visible:border-purple-500" />
            <Input label="Faculty" value={faculty} onChange={(e) => setFaculty(e.target.value)} placeholder="e.g. Engineering" className="focus-visible:ring-purple-500 focus-visible:border-purple-500" />
            <div>
              <label className="block text-sm font-medium text-slate-800">Description (optional)</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Brief description of the program" className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100" />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Duration & credits</h2>
            <Input label="Duration (years)" type="number" min={1} max={6} value={durationYears} onChange={(e) => setDurationYears(e.target.value)} placeholder="4" className="focus-visible:ring-purple-500 focus-visible:border-purple-500" />
            <Input label="Total credits" type="number" min={60} value={credits} onChange={(e) => setCredits(e.target.value)} placeholder="240" className="focus-visible:ring-purple-500 focus-visible:border-purple-500" />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Review</h2>
            <dl className="grid gap-2 text-sm">
              <div><dt className="text-slate-500">Name</dt><dd className="font-medium text-slate-900">{name || "—"}</dd></div>
              <div><dt className="text-slate-500">Code</dt><dd className="font-mono text-slate-900">{code || "—"}</dd></div>
              <div><dt className="text-slate-500">Faculty</dt><dd className="text-slate-900">{faculty || "—"}</dd></div>
              <div><dt className="text-slate-500">Duration</dt><dd className="text-slate-900">{durationYears ? `${durationYears} years` : "—"}</dd></div>
              <div><dt className="text-slate-500">Credits</dt><dd className="text-slate-900">{credits || "—"}</dd></div>
              {description && <div><dt className="text-slate-500">Description</dt><dd className="text-slate-700">{description}</dd></div>}
            </dl>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <Button type="button" variant="secondary" onClick={handleBack}>
            {step === 0 ? "Cancel" : "Back"}
          </Button>
          <Button
            type="button"
            className="bg-purple-700 hover:bg-purple-800 focus-visible:ring-purple-500"
            onClick={handleNext}
            disabled={(step === 0 && !canNextStep0) || (step === 1 && !canNextStep1)}
          >
            {step === STEPS.length - 1 ? "Create Program" : "Next"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
