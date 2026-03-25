"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { ArrowLeft } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const NAV_ITEMS = [
  { key: "dashboard", label: "My Dashboard", href: "/student", icon: "▣" },
  { key: "courses", label: "My Courses", href: "/student/courses", icon: "◉" },
  { key: "assignments", label: "Assignments", href: "/student/assignments", icon: "✎" },
  { key: "schedule", label: "Schedule", href: "/student/schedule", icon: "▤" },
  { key: "grades", label: "Grades & Exams", href: "/student/grades", icon: "▥" },
  { key: "exams", label: "Exams", href: "/student/exams", icon: "◎" },
  { key: "attendance", label: "Attendance", href: "/student/attendance", icon: "✓" },
  { key: "finance", label: "Finance", href: "/student/finance", icon: "¤" },
  { key: "resources", label: "Resources", href: "/student/resources", icon: "▦" },
  { key: "profile", label: "Profile", href: "/student/profile", icon: "👤" },
  { key: "settings", label: "Settings", href: "/student/settings", icon: "⚙" },
] as const;

/** Mock current course for quick-access widget */
const CURRENT_COURSE = {
  title: "Distributed Systems",
  progress: 70,
  nextLabel: "Lecture 3: Case studies",
  href: "/student/courses/distributed-systems/lecture/3",
};

interface StudentLayoutProps {
  children: React.ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar — professional, focus-oriented */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-blue-900/50 bg-slate-900 text-slate-100 shadow-xl transition-transform lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
        aria-label="Student portal navigation"
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-700/80 px-4">
          <Link href="/student" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-xs font-bold text-slate-900">
              UO
            </div>
            <div className="flex flex-col min-w-0">
              <span className="truncate text-sm font-semibold text-white">
                Unified Online University
              </span>
              <span className="text-[11px] text-slate-400">Student Portal</span>
            </div>
          </Link>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-700/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          >
            <span className="text-lg leading-none">&times;</span>
          </button>
        </div>

        <Link
          href="/"
          onClick={() => setSidebarOpen(false)}
          className="mx-4 mb-3 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-3 py-2.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-orange-400"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          <span className="text-base leading-none font-semibold">Back to Hub</span>
        </Link>

        <nav className="flex-1 overflow-y-auto px-2 py-3 text-sm" aria-label="Main">
          <ul className="space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const isExactOnly = item.key === "profile" || item.key === "settings";
              const isActive = isExactOnly
                ? pathname === item.href
                : pathname === item.href ||
                  (item.href !== "/student" && pathname?.startsWith(item.href));
              return (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sky-600/90 text-white"
                        : "text-slate-300 hover:bg-slate-700/60 hover:text-white",
                    )}
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center text-base leading-none text-inherit opacity-90" aria-hidden>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Current Course quick-access widget */}
        <div className="shrink-0 border-t border-slate-700/80 px-3 py-3">
          <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Current course
          </p>
          <Link
            href={CURRENT_COURSE.href}
            className="block rounded-lg border border-slate-600/80 bg-slate-800/60 p-3 transition-colors hover:border-sky-500/50 hover:bg-slate-800"
          >
            <p className="truncate text-sm font-semibold text-white">
              {CURRENT_COURSE.title}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-600">
                <div
                  className="h-full rounded-full bg-sky-500"
                  style={{ width: `${CURRENT_COURSE.progress}%` }}
                  aria-hidden
                />
              </div>
              <span className="text-[11px] font-medium text-slate-400">
                {CURRENT_COURSE.progress}%
              </span>
            </div>
            <p className="mt-1.5 truncate text-[11px] text-slate-400">
              Next: {CURRENT_COURSE.nextLabel}
            </p>
          </Link>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          aria-label="Close navigation overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex min-h-screen flex-1 flex-col lg:ml-0">
        {/* Top header */}
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white lg:hidden"
                onClick={() => setSidebarOpen((open) => !open)}
                aria-label="Toggle navigation"
                aria-expanded={sidebarOpen}
              >
                <span className="sr-only">Toggle navigation</span>
                <span className="flex flex-col gap-1">
                  <span className="block h-0.5 w-4 rounded bg-slate-700" />
                  <span className="block h-0.5 w-4 rounded bg-slate-700" />
                  <span className="block h-0.5 w-4 rounded bg-slate-700" />
                </span>
              </button>

              <div className="hidden items-center gap-2 text-sm font-semibold text-slate-800 sm:flex">
                <span>Student Portal</span>
              </div>
            </div>

            <div className="flex flex-1 items-center justify-end gap-3">
              <div className="hidden max-w-md flex-1 sm:block">
                <Input
                  type="search"
                  placeholder="Search courses, exams, or resources"
                  aria-label="Search"
                />
              </div>

              <span
                className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-900"
                title="1C Integration"
              >
                Current Attendance: 0% • Last synced with 1C: 5 mins ago
              </span>

              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                aria-label="Notifications"
              >
                <span className="text-lg leading-none">🔔</span>
              </button>

              <button
                type="button"
                onClick={logout}
                className="rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900"
              >
                Log out
              </button>
              <Link
                href="/student/profile"
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 text-xs hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                aria-label="Go to profile"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-xs font-semibold text-white">
                  ST
                </span>
                <span className="hidden flex-col text-left text-[11px] text-slate-700 sm:flex">
                  <span className="font-semibold">Student Name</span>
                  <span className="text-slate-500">student@university.edu</span>
                </span>
              </Link>
            </div>
          </div>
        </header>

        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto px-4 py-4 lg:px-6 lg:py-6">
          <Card className="min-h-[calc(100vh-7rem)] bg-white">
            {children}
          </Card>
        </main>
      </div>
    </div>
  );
}
