"use client";

import Link from "next/link";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

const DRAFT_KEY = "admission_profile_draft";
const PROFILE_DATA_KEY = "applicant_profile_data";
const APPLICATION_STATUS_KEY = "admission_application_status";

const personalSchema = z.object({
  fullName: z.string().min(2, "At least 2 characters"),
  gender: z.enum(["male", "female", "other", ""]).refine((v) => v !== "", {
    message: "Select gender",
  }),
  dob: z.string().min(1, "Required"),
  nationality: z.string().min(2, "At least 2 characters"),
  nationalIdPassport: z.string().min(3, "At least 3 characters"),
});

const contactSchema = z.object({
  email: z.string().email("Invalid email"),
  phone: z.string().min(6, "At least 6 characters"),
  permanentAddress: z.string().min(10, "At least 10 characters"),
});

const academicSchema = z.object({
  previousSchool: z.string().min(2, "At least 2 characters"),
  yearOfGraduation: z
    .string()
    .min(1, "Required")
    .refine((v) => {
      const y = parseInt(v, 10);
      return y >= 1950 && y <= new Date().getFullYear() + 2;
    }, "Invalid year"),
  gpa: z
    .string()
    .min(1, "Required")
    .refine((v) => {
      const n = parseFloat(v);
      return !Number.isNaN(n) && n >= 0 && n <= 4;
    }, "GPA 0–4"),
  degreeObtained: z.string().min(2, "At least 2 characters"),
});

const programSchema = z.object({
  faculty: z.string().min(2, "Select or enter faculty"),
  major: z.string().min(2, "At least 2 characters"),
  studyMode: z.enum(["online", "hybrid", ""]).refine((v) => v !== "", {
    message: "Select study mode",
  }),
});

const fullSchema = z.object({
  fullName: z.string().default(""),
  gender: z.string().default(""),
  dob: z.string().default(""),
  nationality: z.string().default(""),
  nationalIdPassport: z.string().default(""),
  email: z.string().default(""),
  phone: z.string().default(""),
  permanentAddress: z.string().default(""),
  previousSchool: z.string().default(""),
  yearOfGraduation: z.string().default(""),
  gpa: z.string().default(""),
  degreeObtained: z.string().default(""),
  faculty: z.string().default(""),
  major: z.string().default(""),
  studyMode: z.string().default(""),
});

type FormValues = z.infer<typeof fullSchema>;

const stepSchemas = [personalSchema, contactSchema, academicSchema, programSchema];

const STEPS = [
  { title: "Personal Info", short: "Personal" },
  { title: "Contact Details", short: "Contact" },
  { title: "Academic Background", short: "Academic" },
  { title: "Program Selection", short: "Program" },
];

const FACULTIES = [
  "Computer Science",
  "Engineering",
  "Business",
  "Law",
  "Medicine",
  "Arts & Humanities",
];

const MAJORS = [
  "Software Development",
  "Data Science",
  "Computer Engineering",
  "Business Administration",
  "Other",
];

function loadDraft(): Partial<FormValues> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Partial<FormValues>;
    return { ...defaultValues, ...parsed };
  } catch {
    return {};
  }
}

function saveDraft(data: FormValues) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

function loadSavedProfile(): FormValues | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_DATA_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<FormValues>;
    return { ...defaultValues, ...parsed } as FormValues;
  } catch {
    return null;
  }
}

function saveProfileData(data: FormValues) {
  try {
    localStorage.setItem(PROFILE_DATA_KEY, JSON.stringify(data));
    localStorage.setItem(APPLICATION_STATUS_KEY, "PROFILE_COMPLETED");
  } catch {
    /* ignore */
  }
}

const defaultValues: FormValues = {
  fullName: "",
  gender: "",
  dob: "",
  nationality: "",
  nationalIdPassport: "",
  email: "",
  phone: "",
  permanentAddress: "",
  previousSchool: "",
  yearOfGraduation: "",
  gpa: "",
  degreeObtained: "",
  faculty: "",
  major: "",
  studyMode: "",
};

function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

function formatGender(v: string): string {
  if (v === "male") return "Male";
  if (v === "female") return "Female";
  if (v === "other") return "Other";
  return v || "—";
}

function formatStudyMode(v: string): string {
  if (v === "online") return "Online";
  if (v === "hybrid") return "Hybrid";
  return v || "—";
}

function formatDate(v: string): string {
  if (!v) return "—";
  try {
    const d = new Date(v);
    return Number.isNaN(d.getTime())
      ? v
      : d.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
  } catch {
    return v;
  }
}

export default function ApplicantProfileWizardPage() {
  const { user } = useAuth();
  const [step, setStep] = React.useState(0);
  const [draftSaved, setDraftSaved] = React.useState(false);
  const [savedData, setSavedData] = React.useState<FormValues | null>(null);
  const [showOverview, setShowOverview] = React.useState(false);

  React.useEffect(() => {
    const saved = loadSavedProfile();
    if (saved) {
      setSavedData(saved);
      setShowOverview(true);
    }
  }, []);

  const [initial] = React.useState<FormValues>(() => {
    const draft = loadDraft();
    if (user?.fullName && !draft.fullName) draft.fullName = user.fullName;
    if (user?.email && !draft.email) draft.email = user.email ?? "";
    return { ...defaultValues, ...draft };
  });

  const form = useForm<FormValues>({
    defaultValues: initial,
    resolver: zodResolver(fullSchema),
    mode: "onTouched",
  });

  // When switching to edit mode, reset form with saved data
  React.useEffect(() => {
    if (!showOverview && savedData) {
      form.reset(savedData);
    }
  }, [showOverview, savedData, form]);

  const { register, handleSubmit, formState: { errors }, getValues, setError, clearErrors } = form;

  const validateCurrentStep = React.useCallback(async () => {
    const keys = step === 0
      ? (["fullName", "gender", "dob", "nationality", "nationalIdPassport"] as const)
      : step === 1
        ? (["email", "phone", "permanentAddress"] as const)
        : step === 2
          ? (["previousSchool", "yearOfGraduation", "gpa", "degreeObtained"] as const)
          : (["faculty", "major", "studyMode"] as const);
    const schema = stepSchemas[step];
    const values = getValues();
    const part = keys.reduce((acc, k) => ({ ...acc, [k]: values[k] }), {} as Record<string, unknown>);
    const result = schema.safeParse(part);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors as Record<string, string[] | undefined>;
      keys.forEach((k) => {
        const msg = fieldErrors[k]?.[0];
        if (msg) setError(k, { message: msg });
      });
      return false;
    }
    keys.forEach((k) => clearErrors(k));
    return true;
  }, [step, getValues, setError, clearErrors]);

  const onNext = async () => {
    const ok = await validateCurrentStep();
    if (ok) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const onBack = () => setStep((s) => Math.max(s - 1, 0));

  const onSaveDraft = () => {
    const values = getValues();
    saveDraft(values);
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2500);
  };

  const onSubmit = (data: FormValues) => {
    saveProfileData(data);
    saveDraft(data);
    setSavedData(data);
    setShowOverview(true);
  };

  // Profile Overview (when applicant_profile_data exists and not in edit mode)
  if (showOverview && savedData) {
    return (
      <div className="min-h-[calc(100vh-52px)] bg-slate-50 px-4 py-8 lg:px-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <Link
              href="/admission/status"
              className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              ← Overview
            </Link>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Profile overview
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  Your application profile has been saved.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowOverview(false)}
              >
                Edit profile
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Personal info
              </h2>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-medium text-slate-500">Full name</dt>
                  <dd className="mt-0.5 font-medium text-slate-900">{savedData.fullName || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-500">Gender</dt>
                  <dd className="mt-0.5 font-medium text-slate-900">{formatGender(savedData.gender)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-500">Date of birth</dt>
                  <dd className="mt-0.5 font-medium text-slate-900">{formatDate(savedData.dob)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-500">Nationality</dt>
                  <dd className="mt-0.5 font-medium text-slate-900">{savedData.nationality || "—"}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs font-medium text-slate-500">National ID / Passport</dt>
                  <dd className="mt-0.5 font-medium text-slate-900">{savedData.nationalIdPassport || "—"}</dd>
                </div>
              </dl>
            </Card>

            <Card>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Contact details
              </h2>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-medium text-slate-500">Email</dt>
                  <dd className="mt-0.5 font-medium text-slate-900">{savedData.email || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-500">Phone</dt>
                  <dd className="mt-0.5 font-medium text-slate-900">{savedData.phone || "—"}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs font-medium text-slate-500">Permanent address</dt>
                  <dd className="mt-0.5 font-medium text-slate-900">{savedData.permanentAddress || "—"}</dd>
                </div>
              </dl>
            </Card>

            <Card>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Academic background
              </h2>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <dt className="text-xs font-medium text-slate-500">Previous school / university</dt>
                  <dd className="mt-0.5 font-medium text-slate-900">{savedData.previousSchool || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-500">Year of graduation</dt>
                  <dd className="mt-0.5 font-medium text-slate-900">{savedData.yearOfGraduation || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-500">GPA</dt>
                  <dd className="mt-0.5 font-medium text-slate-900">{savedData.gpa || "—"}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs font-medium text-slate-500">Degree obtained</dt>
                  <dd className="mt-0.5 font-medium text-slate-900">{savedData.degreeObtained || "—"}</dd>
                </div>
              </dl>
            </Card>

            <Card>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Program selection
              </h2>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-medium text-slate-500">Faculty</dt>
                  <dd className="mt-0.5 font-medium text-slate-900">{savedData.faculty || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-500">Major</dt>
                  <dd className="mt-0.5 font-medium text-slate-900">{savedData.major || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-500">Study mode</dt>
                  <dd className="mt-0.5 font-medium text-slate-900">{formatStudyMode(savedData.studyMode)}</dd>
                </div>
              </dl>
            </Card>
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            <Link href="/admission/status" className="font-medium text-blue-900 hover:underline">
              Back to Overview
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-52px)] bg-slate-50 px-4 py-8 lg:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <Link
            href="/admission/status"
            className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Overview
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Application profile
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Complete your profile in a few steps. You can save a draft anytime.
          </p>
        </div>

        {/* Step indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-2">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.title}>
                <button
                  type="button"
                  onClick={() => setStep(i)}
                  className={cn(
                    "flex flex-1 flex-col items-center rounded-xl border-2 px-2 py-3 transition-all",
                    step === i
                      ? "border-blue-900 bg-blue-50 text-blue-900"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                      step === i ? "bg-blue-900 text-white" : "bg-slate-200 text-slate-600"
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className="mt-1.5 hidden truncate text-xs font-medium sm:block">
                    {s.short}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 w-4 shrink-0 rounded sm:w-6",
                      step > i ? "bg-blue-900" : "bg-slate-200"
                    )}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="overflow-hidden border-slate-200/80 bg-white shadow-md">
            {/* Step header */}
            <div className="border-b border-slate-100 bg-linear-to-r from-slate-50 to-blue-50/50 px-4 py-3 sm:px-6">
              <h2 className="text-lg font-semibold text-slate-900">
                {STEPS[step].title}
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">
                Step {step + 1} of {STEPS.length}
              </p>
            </div>

            <div className="space-y-5 p-4 sm:p-6">
              {step === 0 && (
                <>
                  <Input
                    label="Full name"
                    {...register("fullName")}
                    error={errors.fullName?.message}
                    placeholder="e.g. John Doe"
                  />
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-800">
                      Gender
                    </label>
                    <select
                      {...register("gender")}
                      className={cn(
                        "block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900",
                        errors.gender && "border-red-500"
                      )}
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && (
                      <p className="mt-1 text-xs font-medium text-red-600">
                        {errors.gender.message}
                      </p>
                    )}
                  </div>
                  <Input
                    label="Date of birth"
                    type="date"
                    {...register("dob")}
                    error={errors.dob?.message}
                  />
                  <Input
                    label="Nationality"
                    {...register("nationality")}
                    error={errors.nationality?.message}
                    placeholder="e.g. Uzbekistan"
                  />
                  <Input
                    label="National ID / Passport serial"
                    {...register("nationalIdPassport")}
                    error={errors.nationalIdPassport?.message}
                    placeholder="e.g. AB 1234567"
                  />
                </>
              )}

              {step === 1 && (
                <>
                  <Input
                    label="Email"
                    type="email"
                    {...register("email")}
                    error={errors.email?.message}
                    placeholder="you@example.com"
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    {...register("phone")}
                    error={errors.phone?.message}
                    placeholder="+998 90 123 45 67"
                  />
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-800">
                      Permanent address
                    </label>
                    <textarea
                      {...register("permanentAddress")}
                      rows={3}
                      placeholder="Street, city, country, postal code"
                      className={cn(
                        "block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm placeholder-slate-400",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900",
                        errors.permanentAddress && "border-red-500"
                      )}
                    />
                    {errors.permanentAddress && (
                      <p className="mt-1 text-xs font-medium text-red-600">
                        {errors.permanentAddress.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <Input
                    label="Previous school / university"
                    {...register("previousSchool")}
                    error={errors.previousSchool?.message}
                    placeholder="e.g. Tashkent State University"
                  />
                  <Input
                    label="Year of graduation"
                    {...register("yearOfGraduation")}
                    error={errors.yearOfGraduation?.message}
                    placeholder="e.g. 2023"
                  />
                  <Input
                    label="GPA (0–4 scale)"
                    {...register("gpa")}
                    error={errors.gpa?.message}
                    placeholder="e.g. 3.5"
                  />
                  <Input
                    label="Degree obtained"
                    {...register("degreeObtained")}
                    error={errors.degreeObtained?.message}
                    placeholder="e.g. Bachelor of Science"
                  />
                </>
              )}

              {step === 3 && (
                <>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-800">
                      Faculty
                    </label>
                    <select
                      {...register("faculty")}
                      className={cn(
                        "block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900",
                        errors.faculty && "border-red-500"
                      )}
                    >
                      <option value="">Select faculty</option>
                      {FACULTIES.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                    {errors.faculty && (
                      <p className="mt-1 text-xs font-medium text-red-600">
                        {errors.faculty.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-800">
                      Major
                    </label>
                    <select
                      {...register("major")}
                      className={cn(
                        "block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900",
                        errors.major && "border-red-500"
                      )}
                    >
                      <option value="">Select major</option>
                      {MAJORS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    {errors.major && (
                      <p className="mt-1 text-xs font-medium text-red-600">
                        {errors.major.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-800">
                      Study mode
                    </label>
                    <select
                      {...register("studyMode")}
                      className={cn(
                        "block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900",
                        errors.studyMode && "border-red-500"
                      )}
                    >
                      <option value="">Select</option>
                      <option value="online">Online</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                    {errors.studyMode && (
                      <p className="mt-1 text-xs font-medium text-red-600">
                        {errors.studyMode.message}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/50 px-4 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                {step > 0 ? (
                  <Button type="button" variant="outline" onClick={onBack}>
                    Back
                  </Button>
                ) : (
                  <Link
                    href="/admission/status"
                    className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </Link>
                )}
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onSaveDraft}
                >
                  {draftSaved ? "Draft saved ✓" : "Save as draft"}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                {step < STEPS.length - 1 ? (
                  <Button type="button" variant="primary" onClick={onNext}>
                    Next
                  </Button>
                ) : (
                  <Button type="submit" variant="primary">
                    Save profile
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
}
