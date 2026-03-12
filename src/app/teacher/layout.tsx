"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const PENDING_ASSIGNMENTS = 5;
const PENDING_EXAMS = 4;

const NAV_GROUPS = [
  {
    label: "Teaching",
    items: [
      { key: "courses", label: "Courses", href: "/teacher/courses" },
      { key: "lectures", label: "Lectures", href: "/teacher/lectures" },
      { key: "materials-library", label: "Materials Library", href: "/teacher/materials/materials-library" },
    ],
  },
  {
    label: "Assessment",
    items: [
      { key: "assignments", label: "Assignments", href: "/teacher/assignments", badge: PENDING_ASSIGNMENTS },
      { key: "quizzes", label: "Quizzes", href: "/teacher/quizzes" },
      { key: "exams", label: "Exams", href: "/teacher/exams", badge: PENDING_EXAMS },
      { key: "gradebook", label: "Gradebook", href: "/teacher/gradebook" },
    ],
  },
  {
    label: "Engagement",
    items: [
      { key: "qa", label: "Q&A Hub", href: "/teacher/qa" },
      { key: "comments", label: "Comments", href: "/teacher/qa/comments-management" },
      { key: "attendance", label: "Attendance", href: "/teacher/attendance" },
    ],
  },
  {
    label: "Quality",
    items: [
      { key: "aqad-feedback", label: "AQAD Feedback", href: "/teacher/aqad-feedback" },
      { key: "aqad-tasks", label: "Corrective Actions", href: "/teacher/aqad-tasks" },
    ],
  },
  {
    label: "Admin",
    items: [
      { key: "reports", label: "Reports", href: "/teacher/reports" },
    ],
  },
] as const;

interface TeacherLayoutProps {
  children: React.ReactNode;
}

export default function TeacherLayout({ children }: TeacherLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { logout } = useAuth();

  const isActive = (href: string) => {
    const path = pathname?.replace(/\/$/, "") ?? "";
    const base = href.replace(/\/$/, "");
    return path === base || (base !== "/teacher" && path.startsWith(base + "/"));
  };

  return (
    <ProtectedRoute allowedRoles={["TEACHER", "ADMIN"]}>
      <div className="flex min-h-screen bg-slate-50 text-slate-900">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-teal-900 text-slate-100 shadow-xl transition-transform lg:static lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          )}
          aria-label="Teacher dashboard navigation"
        >
          <div className="flex h-16 items-center justify-between border-b border-teal-800 px-4">
            <Link href="/teacher" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-xs font-bold text-teal-900">
                T
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">
                  Unified Online University
                </span>
                <span className="text-[11px] text-teal-200">
                  Instructor Portal
                </span>
              </div>
            </Link>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-teal-100 hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal-900 lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close navigation"
            >
              <span className="text-lg leading-none">&times;</span>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4 text-sm" aria-label="Main">
            <Link
              href="/teacher"
              className={cn(
                "mb-4 flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === "/teacher" || pathname === "/teacher/"
                  ? "bg-teal-700 text-white"
                  : "text-teal-50 hover:bg-teal-800 hover:text-white",
              )}
              aria-current={pathname === "/teacher" ? "page" : undefined}
            >
              Dashboard
            </Link>
            <ul className="space-y-6">
              {NAV_GROUPS.map((group) => (
                <li key={group.label}>
                  <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-teal-300">
                    {group.label}
                  </p>
                  <ul className="space-y-0.5">
                    {group.items.map((item) => {
                      const active = isActive(item.href);
                      const badge = "badge" in item ? (item as { badge?: number }).badge : undefined;
                      return (
                        <li key={item.key}>
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                              active
                                ? "bg-teal-700 text-white"
                                : "text-teal-50 hover:bg-teal-800 hover:text-white",
                            )}
                            aria-current={active ? "page" : undefined}
                          >
                            <span>{item.label}</span>
                            {badge != null && badge > 0 && (
                              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold text-white">
                                {badge > 99 ? "99+" : badge}
                              </span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          </nav>

          <div className="shrink-0 border-t border-teal-800 px-3 py-3">
            <div className="flex flex-col gap-1">
              <Link
                href="/teacher/profile"
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === "/teacher/profile" || pathname?.startsWith("/teacher/profile/")
                    ? "bg-teal-700 text-white"
                    : "text-teal-50 hover:bg-teal-800 hover:text-white",
                )}
                aria-current={pathname === "/teacher/profile" ? "page" : undefined}
              >
                Profile
              </Link>
              <Link
                href="/teacher/settings"
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === "/teacher/settings" || pathname?.startsWith("/teacher/settings/")
                    ? "bg-teal-700 text-white"
                    : "text-teal-50 hover:bg-teal-800 hover:text-white",
                )}
                aria-current={pathname === "/teacher/settings" ? "page" : undefined}
              >
                Settings
              </Link>
            </div>
            <p className="mt-2 px-3 text-[11px] text-teal-300">
              Instructor Portal • Spring 2026
            </p>
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
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white lg:hidden"
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
                  <span>Teacher Dashboard</span>
                </div>
              </div>

              <div className="flex flex-1 items-center justify-end gap-3">
                <div className="hidden max-w-md flex-1 sm:block">
                  <Input
                    type="search"
                    placeholder="Search courses, students..."
                    aria-label="Search"
                  />
                </div>

                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  aria-label="Notifications"
                >
                  <span className="text-lg leading-none">🔔</span>
                </button>

                <button
                  type="button"
                  onClick={logout}
                  className="rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                >
                  Log out
                </button>

                <Link
                  href="/teacher/profile"
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-left shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  aria-label="Go to profile"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-teal-600 text-sm font-semibold text-white">
                    T
                  </span>
                  <span className="hidden flex-col text-left text-[11px] text-slate-700 sm:flex">
                    <span className="font-semibold">Instructor</span>
                    <span className="text-slate-500">teacher@university.edu</span>
                  </span>
                </Link>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto px-4 py-4 lg:px-6 lg:py-6">
            <div className="min-h-[calc(100vh-7rem)]">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
