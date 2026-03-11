"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type SystemCheck = {
  id: "camera" | "microphone" | "internet";
  label: string;
  ok: boolean;
};

type Question = {
  id: number;
  text: string;
  options: string[];
};

const EXAM_RULES = [
  "No external devices (phones, notes, second screens).",
  "Stay in camera view for the duration of the exam.",
  "Do not open secondary tabs or leave the exam window.",
  "Your session is recorded for academic integrity.",
];

function AdmissionStepper() {
  const steps = [
    { key: "register", label: "Register", current: false, completed: true },
    { key: "upload", label: "Upload Docs", current: false, completed: true },
    { key: "payment", label: "Payment", current: false, completed: true },
    { key: "exam", label: "Exam", current: true, completed: false },
    { key: "enrolled", label: "Enrolled", current: false, completed: false },
  ];

  return (
    <nav aria-label="Admission steps" className="mb-6">
      <ol className="flex items-center justify-between gap-2 text-xs sm:text-sm">
        {steps.map((step, index) => (
          <li key={step.key} className="flex flex-1 items-center">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold",
                  step.completed && "border-blue-900 bg-blue-900 text-white",
                  step.current &&
                    !step.completed &&
                    "border-blue-900 bg-white text-blue-900",
                  !step.current &&
                    !step.completed &&
                    "border-slate-300 bg-slate-100 text-slate-500"
                )}
                aria-current={step.current ? "step" : undefined}
              >
                {index + 1}
              </div>
              <span
                className={cn(
                  "font-medium",
                  step.current
                    ? "text-blue-900"
                    : step.completed
                      ? "text-slate-900"
                      : "text-slate-500"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="mx-2 hidden h-px flex-1 bg-slate-200 sm:block" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

const MOCK_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "The Unified Online University LMS primarily aims to:",
    options: [
      "Provide social media sharing features",
      "Deliver a scalable online learning environment",
      "Replace all in-person classes worldwide",
      "Act as a file storage platform only",
    ],
  },
  {
    id: 2,
    text: "Which of the following is most important for academic integrity during online exams?",
    options: [
      "Colorful UI themes",
      "High-resolution course thumbnails",
      "Robust identity verification and proctoring",
      "Animated page transitions",
    ],
  },
  {
    id: 3,
    text: "What is a key benefit of using a Learning Management System (LMS)?",
    options: [
      "Automatic generation of social media posts",
      "Centralized management of courses, students, and assessments",
      "Unlimited cloud storage for movies",
      "Offline-only exam delivery",
    ],
  },
];

export default function EntranceExamPage() {
  const overlayVideoRef = React.useRef<HTMLVideoElement>(null);
  const cornerVideoRef = React.useRef<HTMLVideoElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

  const [systemChecks] = React.useState<SystemCheck[]>([
    { id: "camera", label: "Camera", ok: true },
    { id: "microphone", label: "Microphone", ok: true },
    { id: "internet", label: "Internet Connection", ok: true },
  ]);

  const [faceScanStep, setFaceScanStep] = React.useState<
    "align" | "scanning" | "verified"
  >("align");
  const [isVerified, setIsVerified] = React.useState(false);
  const [secondsLeft, setSecondsLeft] = React.useState(30 * 60);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<number, number | null>>(
    () => ({})
  );
  const [submitted, setSubmitted] = React.useState(false);
  const [cameraReady, setCameraReady] = React.useState(false);

  // Request camera for verification overlay and proctoring feed
  React.useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: 640, height: 480 },
        });
        streamRef.current = stream;
        if (overlayVideoRef.current) overlayVideoRef.current.srcObject = stream;
        if (cornerVideoRef.current) cornerVideoRef.current.srcObject = stream;
        setCameraReady(true);
      } catch {
        setCameraReady(false);
      }
    };
    startCamera();
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  React.useEffect(() => {
    if (isVerified && streamRef.current && cornerVideoRef.current) {
      cornerVideoRef.current.srcObject = streamRef.current;
    }
  }, [isVerified]);

  React.useEffect(() => {
    if (!isVerified || submitted) return;
    if (secondsLeft <= 0) {
      setSubmitted(true);
      return;
    }
    const timerId = window.setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => window.clearInterval(timerId);
  }, [isVerified, submitted, secondsLeft]);

  const handleScanFace = () => {
    setFaceScanStep("scanning");
    setTimeout(() => {
      setFaceScanStep("verified");
    }, 1500);
  };

  const handleStartExam = () => {
    setIsVerified(true);
  };

  const handleOptionSelect = (questionId: number, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleNext = () => {
    setCurrentQuestionIndex((prev) =>
      Math.min(prev + 1, MOCK_QUESTIONS.length - 1)
    );
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
  };

  const APPLICATION_STATUS_KEY = "admission_application_status";
  const REFRESH_COUNT_KEY = "admission_refresh_count";
  const HISTORY_KEY = "admission_application_history";

  const handleSubmitExam = () => {
    setSubmitted(true);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(APPLICATION_STATUS_KEY, "UNDER_REVIEW");

        const raw = localStorage.getItem(HISTORY_KEY);
        const defaultRow = {
          activity: "Initial Application",
          date: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          paymentStatus: "Paid",
          result: "Pending" as const,
        };
        let history: Array<{
          activity: string;
          date: string;
          paymentStatus: string;
          result: string;
        }> = [];
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            history = Array.isArray(parsed) ? parsed : [defaultRow];
          } catch {
            history = [defaultRow];
          }
        } else {
          history = [defaultRow];
        }
        const examCount = history.filter((r) =>
          r.activity.startsWith("Entrance Exam #")
        ).length;
        const newRow = {
          activity: `Entrance Exam #${examCount + 1}`,
          date: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          paymentStatus: "Paid",
          result: "Pending",
        };
        localStorage.setItem(
          HISTORY_KEY,
          JSON.stringify([...history, newRow])
        );

        localStorage.setItem(REFRESH_COUNT_KEY, "0");
      } catch {
        /* ignore */
      }
    }
  };

  const minutes = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");
  const currentQuestion = MOCK_QUESTIONS[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Proctoring: persistent red dot + camera feed (only when exam started) */}
      {isVerified && (
        <div className="fixed right-4 top-4 z-50 flex items-start gap-3">
          <div className="flex items-center gap-2 rounded-md border border-red-200 bg-white px-3 py-2 shadow-md">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full bg-red-500 animate-pulse"
              aria-hidden
            />
            <span className="text-xs font-semibold text-red-700">
              Live Proctoring Active
            </span>
          </div>
          <div className="overflow-hidden rounded-lg border-2 border-slate-300 bg-slate-900 shadow-lg">
            <div className="bg-slate-800 px-2 py-1 text-center text-[10px] font-medium text-slate-300">
              You
            </div>
            <div className="relative h-28 w-40 bg-slate-800">
                      {cameraReady && (
                        <video
                          ref={cornerVideoRef}
                          autoPlay
                          muted
                          playsInline
                          className="h-full w-full object-cover"
                          style={{ transform: "scaleX(-1)" }}
                          aria-label="Your camera feed"
                        />
                      )}
              {!cameraReady && (
                <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                  Camera placeholder
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 lg:grid-cols-[260px,1fr]">
        {/* Sidebar: Exam Rules */}
        <aside className="order-2 lg:order-1">
          <Card className="h-full">
            <h2 className="text-sm font-semibold text-slate-900">
              Exam Rules
            </h2>
            <ul className="mt-3 space-y-2">
              {EXAM_RULES.map((rule, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-xs text-slate-700"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
            <h3 className="mt-6 text-xs font-semibold text-slate-900">
              System check
            </h3>
            <ul className="mt-2 space-y-2">
              {systemChecks.map((check) => (
                <li
                  key={check.id}
                  className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2"
                >
                  <span className="text-xs font-medium text-slate-800">
                    {check.label}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                      check.ok
                        ? "bg-emerald-50 text-emerald-800"
                        : "bg-red-50 text-red-700"
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        check.ok ? "bg-emerald-500" : "bg-red-500"
                      )}
                    />
                    {check.ok ? "OK" : "Issue"}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </aside>

        {/* Main: Identity overlay or exam */}
        <main className="order-1 lg:order-2">
          <Card
            className={cn(
              "relative",
              isVerified &&
                "border-red-500/40 shadow-md shadow-red-500/10"
            )}
          >
            <header className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-900">
                Admission Process
              </p>
              <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
                Entrance exam
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                {!isVerified
                  ? "Complete face verification to begin. Your session may be monitored."
                  : "Answer the questions below. Do not leave this window."}
              </p>
            </header>

            <AdmissionStepper />

            {/* Pre-exam: Identity Verification Overlay */}
            {!isVerified && (
              <section className="mt-6">
                <h2 className="text-sm font-semibold text-slate-900">
                  Identity verification
                </h2>
                <div className="mt-4 flex flex-col items-center gap-6 md:flex-row md:items-start">
                  <div className="relative shrink-0">
                    <div className="relative h-64 w-72 overflow-hidden rounded-xl bg-slate-900 md:h-80 md:w-96">
                      {cameraReady ? (
                        <video
                          ref={overlayVideoRef}
                          autoPlay
                          muted
                          playsInline
                          className="h-full w-full object-cover"
                          style={{ transform: "scaleX(-1)" }}
                          aria-label="Camera view for face verification"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-500">
                          Camera placeholder
                        </div>
                      )}
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        aria-hidden
                      >
                        <div className="h-48 w-48 rounded-full border-4 border-white/80 bg-transparent shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] md:h-56 md:w-56" />
                      </div>
                    </div>
                    <p className="mt-3 text-center text-sm font-medium text-slate-700">
                      Align your face with the circle
                    </p>
                  </div>
                  <div className="flex flex-1 flex-col items-start gap-4 rounded-lg bg-slate-50 p-4">
                    {faceScanStep === "align" && (
                      <>
                        <p className="text-sm text-slate-600">
                          Position your face inside the circle so it is clearly
                          visible. Then click Scan Face to verify against your
                          passport.
                        </p>
                        <Button
                          type="button"
                          variant="primary"
                          onClick={handleScanFace}
                        >
                          Scan Face
                        </Button>
                      </>
                    )}
                    {faceScanStep === "scanning" && (
                      <div className="flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
                        <span
                          className="inline-block h-6 w-6 shrink-0 animate-spin rounded-full border-2 border-slate-300 border-t-blue-900"
                          aria-hidden
                        />
                        <span className="text-sm font-medium text-slate-700">
                          Verifying identity...
                        </span>
                      </div>
                    )}
                    {faceScanStep === "verified" && (
                      <>
                        <div className="flex w-full items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                            ✓
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-emerald-900">
                              Identity Verified: 98% Match with Passport
                            </p>
                            <p className="text-xs text-emerald-700">
                              You may proceed to the exam.
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="primary"
                          onClick={handleStartExam}
                        >
                          Start Exam
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Exam questions */}
            {isVerified && (
              <section className="mt-6">
                <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                  <p className="text-xs font-medium text-slate-700">
                    Time remaining
                  </p>
                  <p className="font-mono text-sm font-semibold text-red-600">
                    {minutes}:{seconds}
                  </p>
                </div>

                <div className="mt-4 rounded-md border border-slate-200 bg-white px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Question {currentQuestionIndex + 1} of{" "}
                    {MOCK_QUESTIONS.length}
                  </p>
                  <h2 className="mt-1 text-sm font-semibold text-slate-900">
                    {currentQuestion.text}
                  </h2>
                  <div className="mt-3 space-y-2">
                    {currentQuestion.options.map((option, index) => {
                      const selected = answers[currentQuestion.id] === index;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            handleOptionSelect(currentQuestion.id, index)
                          }
                          className={cn(
                            "flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-colors",
                            selected
                              ? "border-blue-900 bg-blue-50 text-slate-900"
                              : "border-slate-200 bg-white text-slate-800 hover:border-blue-900/60 hover:bg-blue-50/60"
                          )}
                        >
                          <span className="flex-1">{option}</span>
                          <span
                            className={cn(
                              "ml-3 flex h-4 w-4 items-center justify-center rounded-full border text-[10px]",
                              selected
                                ? "border-blue-900 bg-blue-900 text-white"
                                : "border-slate-300 bg-white text-slate-400"
                            )}
                          >
                            {String.fromCharCode(65 + index)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={
                        currentQuestionIndex === 0 || submitted
                      }
                      onClick={handlePrevious}
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      disabled={
                        currentQuestionIndex === MOCK_QUESTIONS.length - 1 ||
                        submitted
                      }
                      onClick={handleNext}
                    >
                      Next
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="primary"
                    disabled={submitted}
                    onClick={handleSubmitExam}
                  >
                    {submitted ? "Exam submitted" : "Submit exam"}
                  </Button>
                </div>

              </section>
            )}
          </Card>
        </main>
      </div>

      {/* Exam submitted modal */}
      {submitted && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="exam-submitted-title"
        >
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <svg
                className="h-8 w-8 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2
              id="exam-submitted-title"
              className="text-center text-xl font-semibold text-slate-900"
            >
              Exam Submitted!
            </h2>
            <p className="mt-3 text-center text-sm text-slate-600">
              Our AI and AQAD team will review your session. Results will be
              available in your student portal within 24 hours.
            </p>
            <div className="mt-6">
              <Link
                href="/admission/status"
                className="inline-flex w-full items-center justify-center rounded-md bg-blue-900 px-4 py-3 text-sm font-medium text-white hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900 focus-visible:ring-offset-2"
              >
                Return to My Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
