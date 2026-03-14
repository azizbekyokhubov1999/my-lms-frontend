"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const STEPS = ["Select Student", "Contract Terms", "Define Installments"] as const;
type Step = (typeof STEPS)[number];

const MOCK_STUDENTS = [
  { id: "STU-10001", name: "Anna Petrova", email: "anna.petrova@edu.edu", faculty: "Engineering" },
  { id: "STU-10002", name: "Ivan Kozlov", email: "ivan.kozlov@edu.edu", faculty: "Business" },
  { id: "STU-10003", name: "Maria Sokolova", email: "maria.sokolova@edu.edu", faculty: "Medicine" },
  { id: "STU-10004", name: "Dmitri Volkov", email: "dmitri.volkov@edu.edu", faculty: "Law" },
  { id: "STU-10005", name: "Elena Novikova", email: "elena.novikova@edu.edu", faculty: "Arts & Sciences" },
];

interface Installment {
  id: string;
  date: string;
  amount: string;
}

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function CreateContractPage() {
  const [step, setStep] = React.useState<Step>("Select Student");
  const [studentSearch, setStudentSearch] = React.useState("");
  const [selectedStudent, setSelectedStudent] = React.useState<(typeof MOCK_STUDENTS)[0] | null>(null);

  const [totalAmount, setTotalAmount] = React.useState("");
  const [scholarshipDiscount, setScholarshipDiscount] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");

  const [installments, setInstallments] = React.useState<Installment[]>([
    { id: generateId(), date: "", amount: "" },
  ]);

  const filteredStudents = React.useMemo(() => {
    if (!studentSearch.trim()) return MOCK_STUDENTS;
    const q = studentSearch.trim().toLowerCase();
    return MOCK_STUDENTS.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
    );
  }, [studentSearch]);

  const addInstallment = () => {
    setInstallments((prev) => [...prev, { id: generateId(), date: "", amount: "" }]);
  };

  const removeInstallment = (id: string) => {
    if (installments.length <= 1) return;
    setInstallments((prev) => prev.filter((i) => i.id !== id));
  };

  const updateInstallment = (id: string, field: "date" | "amount", value: string) => {
    setInstallments((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  const stepIndex = STEPS.indexOf(step);

  const canProceedStep1 = !!selectedStudent;
  const canProceedStep2 = totalAmount && startDate && endDate;
  const canProceedStep3 = installments.every((i) => i.date && i.amount);

  const handleNext = () => {
    if (step === "Select Student" && canProceedStep1) setStep("Contract Terms");
    else if (step === "Contract Terms" && canProceedStep2) setStep("Define Installments");
    else if (step === "Define Installments" && canProceedStep3) {
      alert("Contract created (Demo).");
      // In real app: submit and redirect
    }
  };

  const handleBack = () => {
    if (step === "Contract Terms") setStep("Select Student");
    else if (step === "Define Installments") setStep("Contract Terms");
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/finance/contracts" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Contracts
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Create Contract</h1>
        <p className="mt-1 text-sm text-slate-600">
          Multi-step wizard: select student, set terms, define installments.
        </p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <button
              type="button"
              onClick={() => {
                if (i < stepIndex || (i === stepIndex - 1)) setStep(s);
              }}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                step === s
                  ? "bg-emerald-600 text-white"
                  : i < stepIndex
                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                    : "bg-slate-100 text-slate-500",
              )}
            >
              {i + 1}. {s}
            </button>
            {i < STEPS.length - 1 && (
              <span className="h-0.5 w-6 bg-slate-200" aria-hidden />
            )}
          </React.Fragment>
        ))}
      </div>

      <Card className="max-w-2xl p-6">
        {/* Step 1: Select Student */}
        {step === "Select Student" && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Step 1: Select Student
            </h2>
            <Input
              type="search"
              placeholder="Search by name, ID, or email..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
            />
            <ul className="max-h-64 space-y-1 overflow-y-auto rounded-lg border border-slate-200">
              {filteredStudents.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedStudent(s)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 text-left transition-colors",
                      selectedStudent?.id === s.id ? "bg-emerald-50 text-emerald-900" : "hover:bg-emerald-50/50",
                    )}
                  >
                    <div>
                      <p className="font-medium text-slate-900">{s.name}</p>
                      <p className="text-xs text-slate-500">{s.id} · {s.faculty}</p>
                    </div>
                    {selectedStudent?.id === s.id && (
                      <span className="text-emerald-600">✓ Selected</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
            {selectedStudent && (
              <p className="text-sm text-slate-600">
                Selected: <strong>{selectedStudent.name}</strong> ({selectedStudent.id})
              </p>
            )}
          </div>
        )}

        {/* Step 2: Contract Terms */}
        {step === "Contract Terms" && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Step 2: Contract Terms
            </h2>
            {selectedStudent && (
              <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
                Student: {selectedStudent.name} ({selectedStudent.id})
              </p>
            )}
            <Input
              label="Total Amount (₸)"
              type="number"
              placeholder="e.g. 450000"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              required
            />
            <Input
              label="Scholarship Discount (%)"
              type="number"
              placeholder="e.g. 10"
              value={scholarshipDiscount}
              onChange={(e) => setScholarshipDiscount(e.target.value)}
              helperText="Optional. 0–100."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
              <Input
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {/* Step 3: Define Installments */}
        {step === "Define Installments" && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Step 3: Define Installments
            </h2>
            <p className="text-sm text-slate-600">
              Add dates and amounts for each payment phase.
            </p>
            <div className="space-y-3">
              {installments.map((inst) => (
                <div
                  key={inst.id}
                  className="flex flex-wrap items-end gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3"
                >
                  <div className="min-w-0 flex-1 sm:flex-initial">
                    <Input
                      label="Date"
                      type="date"
                      value={inst.date}
                      onChange={(e) => updateInstallment(inst.id, "date", e.target.value)}
                    />
                  </div>
                  <div className="min-w-0 flex-1 sm:flex-initial">
                    <Input
                      label="Amount (₸)"
                      type="number"
                      placeholder="Amount"
                      value={inst.amount}
                      onChange={(e) => updateInstallment(inst.id, "amount", e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => removeInstallment(inst.id)}
                    disabled={installments.length <= 1}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addInstallment}
              className="border-emerald-600 text-emerald-700 hover:bg-emerald-50"
            >
              + Add Installment
            </Button>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          {step !== "Select Student" ? (
            <Button type="button" variant="secondary" onClick={handleBack}>
              Back
            </Button>
          ) : (
            <Link href="/finance/contracts">
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </Link>
          )}
          <Button
            type="button"
            className="bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500"
            onClick={handleNext}
            disabled={
              (step === "Select Student" && !canProceedStep1) ||
              (step === "Contract Terms" && !canProceedStep2) ||
              (step === "Define Installments" && !canProceedStep3)
            }
          >
            {step === "Define Installments" ? "Create Contract" : "Next"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
