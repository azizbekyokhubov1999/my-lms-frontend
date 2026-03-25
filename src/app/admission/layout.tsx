"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { ArrowLeft } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type Lang = "UZ" | "EN" | "RU";

const APPLICANT_ID = "12345";

const PIPELINE_STAGES = [
  { key: "registration", label: "Registration", path: "/admission/status" },
  { key: "documents", label: "Documents", path: "/admission/upload" },
  { key: "verification", label: "Verification", path: "/admission/upload" },
  { key: "fee", label: "Fee", path: "/admission/payment" },
  { key: "exam-schedule", label: "Exam Schedule", path: "/admission/exams/schedule" },
  { key: "exam", label: "Exam", path: "/admission/exam" },
  { key: "results", label: "Results", path: "/admission/status" },
  { key: "contract", label: "Contract", path: "/admission/status" },
  { key: "enrolled", label: "Enrolled", path: "/admission/enrolled" },
] as const;

function getStepperStep(pathname: string): number {
  if (pathname.startsWith("/admission/enrolled")) return 9;
  if (pathname.startsWith("/admission/exams/schedule")) return 5;
  if (pathname.startsWith("/admission/exam")) return 6;
  if (pathname.startsWith("/admission/payment")) return 4;
  if (pathname.startsWith("/admission/upload")) return 2;
  if (pathname.startsWith("/admission/notifications")) return 1;
  if (pathname.startsWith("/admission/profile")) return 1;
  if (pathname.startsWith("/admission/status")) return 1;
  return 1;
}

const APPLICATION_STATUS_KEY = "admission_application_status";

const SIDEBAR_NAV: { label: string; href: string; icon: string }[] = [
  { label: "Overview", href: "/admission/status", icon: "◉" },
  { label: "Profile", href: "/admission/profile", icon: "◎" },
  { label: "Documents", href: "/admission/upload", icon: "▤" },
  { label: "Exams", href: "/admission/exams/schedule", icon: "✎" },
  { label: "Finances", href: "/admission/payment", icon: "¤" },
  { label: "Notifications", href: "/admission/notifications", icon: "✉" },
];

export default function AdmissionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [lang, setLang] = React.useState<Lang>("EN");
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [documentsApproved, setDocumentsApproved] = React.useState(false);
  const { user, logout } = useAuth();

  React.useEffect(() => {
    const sync = () => {
      try {
        setDocumentsApproved(
          typeof window !== "undefined" &&
            localStorage.getItem(APPLICATION_STATUS_KEY) === "DOCUMENTS_APPROVED"
        );
      } catch {
        setDocumentsApproved(false);
      }
    };
    sync();
    window.addEventListener("admission-documents-approved", sync);
    return () => window.removeEventListener("admission-documents-approved", sync);
  }, [pathname]);

  const displayName =
    user?.fullName || (user?.role === "STUDENT" ? "Student" : "Applicant");
  const displayId =
    user?.role === "STUDENT" ? user.email ?? "—" : `#${APPLICANT_ID}`;
  const currentStep = getStepperStep(pathname ?? "");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar: logo + progress stepper + user */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 px-4 py-2 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen((o) => !o)}
              className="flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              <span className="text-lg">{sidebarOpen ? "≡" : "≡"}</span>
            </button>
            <Link href="/admission/status" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-900 text-xs font-bold text-white">
                UO
              </div>
              <span className="hidden text-sm font-semibold text-slate-900 sm:inline">
                Unified Online University
              </span>
            </Link>
          </div>

          {/* Progress Stepper — 9 stages */}
          <nav
            aria-label="Application progress"
            className="hidden flex-1 overflow-x-auto lg:flex lg:justify-center"
          >
            <ol className="flex items-center gap-0.5">
              {PIPELINE_STAGES.map((stage, index) => {
                const step = index + 1;
                const isCompleted = currentStep > step;
                const isCurrent = currentStep === step;
                return (
                  <li key={stage.key} className="flex items-center">
                    <Link
                      href={stage.path}
                      className={cn(
                        "flex items-center gap-1.5 rounded px-2 py-1.5 text-[11px] font-medium transition-colors",
                        isCurrent &&
                          "bg-blue-900 text-white ring-1 ring-blue-900",
                        isCompleted && !isCurrent && "text-emerald-700",
                        !isCurrent &&
                          !isCompleted &&
                          "text-slate-500 hover:text-slate-800"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
                          isCurrent && "bg-white/25",
                          isCompleted && !isCurrent && "bg-emerald-100 text-emerald-700",
                          !isCurrent && !isCompleted && "bg-slate-200 text-slate-500"
                        )}
                      >
                        {isCompleted ? "✓" : step}
                      </span>
                      <span className="hidden max-w-[72px] truncate xl:max-w-none">
                        {stage.label}
                      </span>
                    </Link>
                    {index < PIPELINE_STAGES.length - 1 && (
                      <span
                        className={cn(
                          "mx-0.5 h-px w-2 shrink-0 lg:w-4",
                          isCompleted ? "bg-emerald-300" : "bg-slate-200"
                        )}
                        aria-hidden
                      />
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-medium text-slate-500">
                {user?.role === "STUDENT" ? "Student" : "Applicant"}
              </p>
              <p className="text-sm font-semibold text-slate-900">
                {displayName}
              </p>
              <p className="text-xs font-mono text-slate-600">
                {user?.role === "STUDENT" ? displayId : `ID ${displayId}`}
              </p>
            </div>
            <nav className="flex items-center gap-1" aria-label="Actions">
              <button
                type="button"
                onClick={logout}
                className="rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900"
              >
                Log Out
              </button>
              {(["UZ", "EN", "RU"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={cn(
                    "rounded-md px-2 py-1 text-xs font-medium transition-colors",
                    lang === l
                      ? "bg-blue-900 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  {l}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed left-0 top-[52px] z-20 h-[calc(100vh-52px)] w-56 border-r border-slate-200 bg-white transition-transform lg:top-[52px] lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <Link
            href="/"
            onClick={() => setSidebarOpen(false)}
            className="m-3 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-3 py-2.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-orange-400"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            <span className="text-base leading-none font-semibold">Back to Hub</span>
          </Link>

          <nav className="flex flex-col gap-0.5 p-3" aria-label="Applicant sections">
            {SIDEBAR_NAV.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admission/status" &&
                  pathname?.startsWith(item.href));
              const isDocuments = item.href === "/admission/upload";
              const isExams = item.href === "/admission/exams/schedule";
              const examsDisabled = isExams && !documentsApproved;

              const linkContent = (
                <>
                  <span className="text-base opacity-80" aria-hidden>
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.label}</span>
                  {isDocuments && (
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center"
                      aria-label={
                        documentsApproved
                          ? "Documents verified"
                          : "Documents verification pending"
                      }
                    >
                      {documentsApproved ? (
                        <span className="h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px]">
                          ✓
                        </span>
                      ) : (
                        <span
                          className="h-4 w-4 animate-spin rounded-full border-2 border-amber-500 border-t-transparent"
                          aria-hidden
                        />
                      )}
                    </span>
                  )}
                </>
              );

              if (examsDisabled) {
                return (
                  <span
                    key={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium cursor-not-allowed text-slate-400"
                    )}
                    aria-disabled="true"
                  >
                    {linkContent}
                  </span>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-900 text-white"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  {linkContent}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Overlay when sidebar open on mobile */}
        {sidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 z-10 bg-black/20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          />
        )}

        {/* Main content */}
        <main
          className={cn(
            "min-h-[calc(100vh-52px)] flex-1 transition-[margin]",
            sidebarOpen ? "lg:ml-56" : "lg:ml-0"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
