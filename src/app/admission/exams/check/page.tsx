"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

const MIN_MBPS = 2;
const SCHEDULED_EXAM_ID_KEY = "scheduled_exam_id";

type CheckStatus = "idle" | "running" | "pass" | "fail";

function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

export default function TechnicalReadinessCheckPage() {
  const router = useRouter();
  const [scheduledExamId, setScheduledExamId] = React.useState<string>("entrance");
  const [camera, setCamera] = React.useState<CheckStatus>("idle");
  const [microphone, setMicrophone] = React.useState<CheckStatus>("idle");
  const [internet, setInternet] = React.useState<CheckStatus>("idle");
  const [browser, setBrowser] = React.useState<CheckStatus>("idle");
  const [screenShare, setScreenShare] = React.useState<CheckStatus>("idle");
  const [audioLevel, setAudioLevel] = React.useState(0);
  const [speedMbps, setSpeedMbps] = React.useState<number | null>(null);
  const cameraVideoRef = React.useRef<HTMLVideoElement>(null);
  const streamRefs = React.useRef<{ camera: MediaStream | null; screen: MediaStream | null }>({
    camera: null,
    screen: null,
  });

  const allPass =
    camera === "pass" &&
    microphone === "pass" &&
    internet === "pass" &&
    browser === "pass" &&
    screenShare === "pass";

  // Browser support
  const runBrowserCheck = React.useCallback(() => {
    setBrowser("running");
    const check = () => {
      const hasGetUserMedia =
        typeof navigator !== "undefined" &&
        !!navigator.mediaDevices?.getUserMedia;
      const hasGetDisplayMedia =
        typeof navigator !== "undefined" &&
        !!navigator.mediaDevices?.getDisplayMedia;
      const secure = typeof window !== "undefined" && window.isSecureContext;
      return hasGetUserMedia && hasGetDisplayMedia && secure;
    };
    window.setTimeout(() => setBrowser(check() ? "pass" : "fail"), 400);
  }, []);

  React.useEffect(() => {
    runBrowserCheck();
  }, [runBrowserCheck]);

  React.useEffect(() => {
    try {
      const id =
        typeof window !== "undefined"
          ? localStorage.getItem(SCHEDULED_EXAM_ID_KEY)
          : null;
      if (id) setScheduledExamId(id);
    } catch {
      /* keep default */
    }
  }, []);

  // Camera check
  const runCameraCheck = React.useCallback(async () => {
    setCamera("running");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 320, height: 240 },
      });
      streamRefs.current.camera = stream;
      if (cameraVideoRef.current) {
        cameraVideoRef.current.srcObject = stream;
      }
      await new Promise((r) => setTimeout(r, 1500));
      stream.getTracks().forEach((t) => t.stop());
      streamRefs.current.camera = null;
      if (cameraVideoRef.current) cameraVideoRef.current.srcObject = null;
      setCamera("pass");
    } catch {
      setCamera("fail");
    }
  }, []);

  // Microphone check + level
  const runMicrophoneCheck = React.useCallback(async () => {
    setMicrophone("running");
    setAudioLevel(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      let frameId: number;
      const sample = () => {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        setAudioLevel(Math.min(100, Math.round((avg / 255) * 150)));
        frameId = requestAnimationFrame(sample);
      };
      frameId = requestAnimationFrame(sample);
      await new Promise((r) => setTimeout(r, 2000));
      cancelAnimationFrame(frameId);
      stream.getTracks().forEach((t) => t.stop());
      audioContext.close();
      setMicrophone("pass");
    } catch {
      setMicrophone("fail");
    }
  }, []);

  // Internet speed (simulated)
  const runInternetCheck = React.useCallback(async () => {
    setInternet("running");
    setSpeedMbps(null);
    await new Promise((r) => setTimeout(r, 800));
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((r) => setTimeout(r, 120));
    }
    const simulated = MIN_MBPS + Math.random() * 3;
    setSpeedMbps(Math.round(simulated * 10) / 10);
    setInternet(simulated >= MIN_MBPS ? "pass" : "fail");
  }, []);

  // Screen share (requires user gesture)
  const runScreenShareCheck = React.useCallback(async () => {
    setScreenShare("running");
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      streamRefs.current.screen = stream;
      await new Promise((r) => setTimeout(r, 1000));
      stream.getTracks().forEach((t) => t.stop());
      streamRefs.current.screen = null;
      setScreenShare("pass");
    } catch {
      setScreenShare("fail");
    }
  }, []);

  // Run camera, mic, internet on mount (browser already runs in useEffect)
  React.useEffect(() => {
    runCameraCheck();
    runMicrophoneCheck();
    runInternetCheck();
  }, [runCameraCheck, runMicrophoneCheck, runInternetCheck]);

  const checks = [
    {
      id: "camera",
      label: "Camera access",
      status: camera,
      detail:
        camera === "pass"
          ? "Webcam is working"
          : camera === "fail"
            ? "Could not access camera"
            : camera === "running"
              ? "Testing…"
              : "Not run",
      onRetry: runCameraCheck,
    },
    {
      id: "microphone",
      label: "Microphone access",
      status: microphone,
      detail:
        microphone === "pass"
          ? "Microphone working"
          : microphone === "fail"
            ? "Could not access microphone"
            : microphone === "running"
              ? `Level: ${audioLevel}%`
              : "Not run",
      onRetry: runMicrophoneCheck,
    },
    {
      id: "internet",
      label: "Internet speed",
      status: internet,
      detail:
        internet === "pass" && speedMbps != null
          ? `${speedMbps} Mbps (min ${MIN_MBPS} Mbps required)`
          : internet === "fail"
            ? "Below 2 Mbps or test failed"
            : internet === "running"
              ? "Testing…"
              : "Not run",
      onRetry: runInternetCheck,
    },
    {
      id: "browser",
      label: "Browser support",
      status: browser,
      detail:
        browser === "pass"
          ? "Compatible"
          : browser === "fail"
            ? "Use Chrome, Edge, or Firefox (HTTPS required)"
            : "Checking…",
      onRetry: runBrowserCheck,
    },
    {
      id: "screen",
      label: "Screen sharing",
      status: screenShare,
      detail:
        screenShare === "pass"
          ? "Ready for proctoring"
          : screenShare === "fail"
            ? "Permission denied or not supported"
            : screenShare === "running"
              ? "Select a screen/window…"
              : "Requires your permission",
      onRetry: runScreenShareCheck,
    },
  ] as const;

  return (
    <div className="min-h-[calc(100vh-52px)] bg-slate-50 px-4 py-8 lg:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <Link
            href="/admission/exams/schedule"
            className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Schedule
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Technical readiness check
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            All checks must pass before you can start the proctored exam.
          </p>
        </div>

        {/* Hidden video for camera test */}
        <video
          ref={cameraVideoRef}
          autoPlay
          muted
          playsInline
          className="hidden h-0 w-0"
          aria-hidden
        />

        <Card className="overflow-hidden border-slate-200/80 bg-white shadow-md">
          <div className="border-b border-slate-100 bg-linear-to-r from-slate-50 to-blue-50/50 px-4 py-3 sm:px-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
              System checks
            </h2>
          </div>
          <ul className="divide-y divide-slate-100">
            {checks.map((check) => (
              <li key={check.id} className="flex items-center gap-4 px-4 py-4 sm:px-6">
                <div
                  className={cn(
                    "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-all",
                    check.status === "pass" &&
                      "bg-emerald-100 text-emerald-700",
                    check.status === "fail" && "bg-red-100 text-red-700",
                    check.status === "running" &&
                      "bg-amber-100 text-amber-700",
                    check.status === "idle" && "bg-slate-100 text-slate-400"
                  )}
                  aria-hidden
                >
                  {check.status === "pass" && (
                    <svg
                      className="h-8 w-8"
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
                  )}
                  {check.status === "fail" && (
                    <svg
                      className="h-8 w-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                  {check.status === "running" && (
                    <span
                      className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent"
                      aria-hidden
                    />
                  )}
                  {check.status === "idle" && (
                    <span className="text-2xl font-bold">?</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900">{check.label}</p>
                  <p
                    className={cn(
                      "mt-0.5 text-sm",
                      check.status === "pass" && "text-emerald-700",
                      check.status === "fail" && "text-red-700",
                      (check.status === "running" || check.status === "idle") &&
                        "text-slate-500"
                    )}
                  >
                    {check.detail}
                  </p>
                  {check.id === "microphone" &&
                    check.status === "running" &&
                    audioLevel >= 0 && (
                      <div className="mt-2 h-1.5 w-full max-w-[120px] overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-amber-500 transition-all duration-150"
                          style={{ width: `${audioLevel}%` }}
                        />
                      </div>
                    )}
                </div>
                {(check.status === "fail" || check.status === "idle") && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={check.onRetry}
                  >
                    {check.status === "fail" ? "Retry" : "Test"}
                  </Button>
                )}
              </li>
            ))}
          </ul>

          {/* Screen share needs user gesture in most browsers */}
          {checks[4].status === "idle" && (
            <div className="border-t border-slate-100 bg-amber-50/50 px-4 py-3 sm:px-6">
              <p className="text-sm text-slate-700">
                Click &quot;Test&quot; next to Screen sharing and choose a
                window or your full screen when prompted.
              </p>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 bg-slate-50/50 px-4 py-4 sm:px-6">
            <Link
              href="/admission/status"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              ← Back to Overview
            </Link>
            {allPass ? (
              <Button
                type="button"
                variant="primary"
                className="inline-flex h-11 min-w-[180px] items-center justify-center text-base font-semibold"
                onClick={() => router.push("/admission/exam")}
              >
                Start exam
              </Button>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex h-11 min-w-[180px] cursor-not-allowed items-center justify-center rounded-lg bg-slate-300 px-6 text-base font-semibold text-slate-500"
              >
                Complete all checks to continue
              </button>
            )}
          </div>
        </Card>

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link
            href="/admission/exams/schedule"
            className="font-medium text-blue-900 hover:underline"
          >
            Schedule exam
          </Link>
          {" · "}
          <Link
            href="/admission/status"
            className="font-medium text-blue-900 hover:underline"
          >
            Overview
          </Link>
        </p>
      </div>
    </div>
  );
}
