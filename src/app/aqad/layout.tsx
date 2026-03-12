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

const MAIN_NAV = [
  { key: "overview", label: "Overview", href: "/aqad" },
  { key: "reviews", label: "Course Reviews", href: "/aqad/reviews" },
  { key: "monitoring", label: "Live Monitoring", href: "/aqad/monitoring" },
  { key: "exam-audit", label: "Exam Audit", href: "/aqad/exam-audit" },
  { key: "complaints", label: "Complaints Hub", href: "/aqad/complaints" },
  { key: "corrective-actions", label: "Corrective Actions", href: "/aqad/corrective-actions" },
  { key: "standards", label: "Quality Standards", href: "/aqad/standards" },
  { key: "quality-checklist", label: "Quality Checklist", href: "/aqad/quality-checklist" },
  { key: "scheduler", label: "Academic Scheduler", href: "/aqad/scheduler" },
  { key: "audit-trail", label: "Audit Trail", href: "/aqad/audit-trail" },
  { key: "reports", label: "Reports & Analytics", href: "/aqad/reports" },
] as const;

const FOOTER_NAV = [
  { key: "profile", label: "Profile", href: "/aqad/profile" },
  { key: "settings", label: "Settings", href: "/aqad/settings" },
] as const;

interface AqadLayoutProps {
  children: React.ReactNode;
}

export default function AqadLayout({ children }: AqadLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { logout } = useAuth();

  const isActive = (href: string, key: string) => {
    const path = pathname?.replace(/\/$/, "") ?? "";
    const base = href.replace(/\/$/, "");
    if (key === "overview") return path === "/aqad";
    if (key === "profile" || key === "settings") return path === base;
    return path === base || (base !== "/aqad" && path.startsWith(base + "/"));
  };

  return (
    <ProtectedRoute allowedRoles={["AQAD", "ADMIN"]}>
      <div className="flex min-h-screen bg-slate-50 text-slate-900">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-indigo-950 text-slate-100 shadow-xl transition-transform lg:static lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          )}
          aria-label="AQAD dashboard navigation"
        >
          <div className="flex h-16 items-center justify-between border-b border-indigo-900 px-4">
            <Link href="/aqad" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-xs font-bold text-indigo-950">
                AQ
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">
                  Unified Online University
                </span>
                <span className="text-[11px] text-indigo-200">
                  Quality Assurance
                </span>
              </div>
            </Link>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-indigo-100 hover:bg-indigo-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-950 lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close navigation"
            >
              <span className="text-lg leading-none">&times;</span>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4 text-sm" aria-label="Main">
            <ul className="space-y-1">
              {MAIN_NAV.map((item) => {
                const active = isActive(item.href, item.key);
                return (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-indigo-700 text-white"
                          : "text-indigo-50 hover:bg-indigo-900 hover:text-white",
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer: Profile and Settings */}
          <div className="shrink-0 border-t border-indigo-900 px-3 py-3">
            <ul className="space-y-1">
              {FOOTER_NAV.map((item) => {
                const active = isActive(item.href, item.key);
                return (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-indigo-700 text-white"
                          : "text-indigo-200 hover:bg-indigo-900 hover:text-white",
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 px-3 text-[11px] text-indigo-300">
              AQAD Portal • Spring 2026
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
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white lg:hidden"
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
                  <span>AQAD Dashboard</span>
                </div>
              </div>

              <div className="flex flex-1 items-center justify-end gap-3">
                <div className="hidden max-w-md flex-1 sm:block">
                  <Input
                    type="search"
                    placeholder="Search modules, audits, complaints..."
                    aria-label="Search"
                  />
                </div>

                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  aria-label="Notifications"
                >
                  <span className="text-lg leading-none">🔔</span>
                </button>

                <button
                  type="button"
                  onClick={logout}
                  className="rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                >
                  Log out
                </button>

                <Link
                  href="/aqad/profile"
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 text-xs hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  aria-label="Go to profile"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
                    AQ
                  </span>
                  <span className="hidden flex-col text-left text-[11px] text-slate-700 sm:flex">
                    <span className="font-semibold">AQAD Analyst</span>
                    <span className="text-slate-500">aqad@university.edu</span>
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
