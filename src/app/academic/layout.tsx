"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Button } from "../components/ui/Button";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const NAV_ITEMS: Array<{ href: string; label: string; tooltip: string; icon: React.ReactNode }> = [
  { href: "/academic/dashboard", label: "Dashboard", tooltip: "Overview", icon: <DashboardIcon /> },
  { href: "/academic/programs", label: "Programs", tooltip: "Modules, Courses, Requirements", icon: <ProgramsIcon /> },
  { href: "/academic/groups", label: "Groups", tooltip: "Cohorts, Transfers", icon: <GroupsIcon /> },
  { href: "/academic/schedules", label: "Schedules", tooltip: "aSc Sync, Overrides", icon: <SchedulesIcon /> },
  { href: "/academic/admission", label: "Admission", tooltip: "Review, Decisions", icon: <AdmissionIcon /> },
  { href: "/academic/exam-eligibility", label: "Exam Eligibility", tooltip: "Rules, Access", icon: <ExamEligibilityIcon /> },
  { href: "/academic/exceptions", label: "Exceptions", tooltip: "Waivers, Appeals", icon: <ExceptionsIcon /> },
  { href: "/academic/performance", label: "Performance", tooltip: "Attendance, Grades", icon: <PerformanceIcon /> },
  { href: "/academic/coordination", label: "Coordination", tooltip: "Inter-dept sync", icon: <CoordinationIcon /> },
];

function DashboardIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}
function ProgramsIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  );
}
function GroupsIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  );
}
function SchedulesIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  );
}
function AdmissionIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
    </svg>
  );
}
function ExamEligibilityIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function ExceptionsIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  );
}
function PerformanceIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  );
}
function CoordinationIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  );
}
function ChevronIcon({ left }: { left?: boolean }) {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d={left ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  );
}

const STORAGE_KEY = "academic-sidebar-collapsed";
const STORAGE_CALENDAR_KEY = "academic-calendar-visible";

function readCollapsed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function readCalendarVisible(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const v = localStorage.getItem(STORAGE_CALENDAR_KEY);
    return v === null || v === "true";
  } catch {
    return true;
  }
}

export default function AcademicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [calendarVisible, setCalendarVisible] = React.useState(true);

  React.useEffect(() => {
    setCollapsed(readCollapsed());
    setCalendarVisible(readCalendarVisible());
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(collapsed));
    } catch {
      /* ignore */
    }
  }, [collapsed]);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CALENDAR_KEY, String(calendarVisible));
    } catch {
      /* ignore */
    }
  }, [calendarVisible]);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const showCollapsed = collapsed && !mobileOpen;

  const sidebarContent = (
    <>
      <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto p-3 sm:p-4 overscroll-contain touch-pan-y" aria-label="Academic navigation">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            title={showCollapsed ? item.tooltip : undefined}
            aria-current={isActive(item.href) ? "page" : undefined}
            className={cn(
              "flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors touch-manipulation",
              isActive(item.href)
                ? "bg-purple-400 text-purple-900"
                : "text-purple-100 hover:bg-purple-800 hover:text-white",
              showCollapsed && "justify-center px-2",
            )}
          >
            <span className={cn("shrink-0", isActive(item.href) ? "text-purple-900" : "text-purple-200")}>{item.icon}</span>
            {!showCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
      <div className="mt-auto shrink-0 border-t border-purple-800 p-3 sm:p-4">
        <Link
          href="/academic/profile"
          aria-current={pathname === "/academic/profile" ? "page" : undefined}
          className={cn(
            "flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-purple-100 transition-colors hover:bg-purple-800 hover:text-white touch-manipulation",
            pathname === "/academic/profile" && "bg-purple-800 text-white",
            showCollapsed && "justify-center px-2",
          )}
          title={showCollapsed ? "Profile" : undefined}
        >
          <span className="shrink-0 text-purple-200">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.116 17.116 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </span>
          {!showCollapsed && <span>Profile</span>}
        </Link>
        <Link
          href="/academic/settings"
          aria-current={pathname === "/academic/settings" ? "page" : undefined}
          className={cn(
            "mt-1 flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-purple-100 transition-colors hover:bg-purple-800 hover:text-white touch-manipulation",
            pathname === "/academic/settings" && "bg-purple-800 text-white",
            showCollapsed && "justify-center px-2",
          )}
          title={showCollapsed ? "Settings" : undefined}
        >
          <span className="shrink-0 text-purple-200">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </span>
          {!showCollapsed && <span>Settings</span>}
        </Link>
        <button
          type="button"
          className={cn(
            "mt-1 flex w-full min-h-[44px] items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-purple-100 transition-colors hover:bg-purple-800 hover:text-white touch-manipulation",
            showCollapsed && "justify-center px-2",
          )}
          title={showCollapsed ? "Log out" : undefined}
          onClick={() => alert("Log out (Demo)")}
        >
          <span className="shrink-0 text-purple-200">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v3.75M15.75 9l-3-3m0 0l-3 3m3-3h8.25M8.25 21H5.625a2.25 2.25 0 01-2.25-2.25V5.625a2.25 2.25 0 012.25-2.25h2.625M15.75 21h2.625a2.25 2.25 0 002.25-2.25V15.75m-6-6l3-3m0 0l3 3m-3-3v12" />
            </svg>
          </span>
          {!showCollapsed && <span>Log out</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-slate-200 bg-purple-50/50 px-3 shadow-sm print:hidden sm:gap-4 sm:px-4">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="shrink-0 lg:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          <MenuIcon />
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="hidden shrink-0 lg:inline-flex"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronIcon left={!collapsed} />
        </Button>

        <div className="flex flex-1 items-center justify-end gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setCalendarVisible((v) => !v)}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2",
              calendarVisible
                ? "border-purple-700 bg-purple-700 text-white hover:bg-purple-800"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
            )}
            aria-pressed={calendarVisible}
            aria-label="Toggle Academic Calendar visibility"
          >
            <CalendarIcon />
            <span className="hidden sm:inline">Academic Calendar</span>
            <span className="text-xs opacity-90">{calendarVisible ? "On" : "Off"}</span>
          </button>
        </div>

        <span className="hidden shrink-0 text-sm font-medium text-slate-600 sm:inline">Academic</span>
      </header>

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-900/20 lg:hidden"
            aria-hidden
            onClick={() => setMobileOpen(false)}
          />
        )}
        <aside
          className={cn(
            "flex min-h-screen flex-col shrink-0 border-r border-purple-800 bg-purple-900 transition-[width] duration-200 ease-out print:hidden",
            "fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-64 md:w-72 lg:relative lg:top-0 lg:h-full lg:min-h-screen lg:max-h-full",
            collapsed ? "lg:w-16" : "lg:w-56",
            mobileOpen ? "flex" : "hidden lg:flex",
          )}
        >
          {sidebarContent}
        </aside>

        <main data-academic-panel className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden bg-purple-50/30 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
