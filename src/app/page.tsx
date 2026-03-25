"use client";

import Link from "next/link";
import {
  BadgeCheck,
  BookOpen,
  Building2,
  FileUser,
  ShieldCheck,
  Wallet,
  Users,
  School,
  User,
  UserCog,
} from "lucide-react";

const ROLES = [
  {
    title: "Applicant",
    description: "Admission profile & application workflow.",
    href: "/admission/profile",
    icon: FileUser,
  },
  {
    title: "Student",
    description: "Learning portal, schedules, and progress.",
    href: "/student",
    icon: User,
  },
  {
    title: "Teacher",
    description: "Courses, grading, and content delivery.",
    href: "/teacher",
    icon: School,
  },
  {
    title: "AQAD",
    description: "Quality assurance & accreditation modules.",
    href: "/aqad",
    icon: BadgeCheck,
  },
  {
    title: "Academic department",
    description: "Curriculum dashboards and program governance.",
    href: "/academic/dashboard",
    icon: Building2,
  },
  {
    title: "Resource department",
    description: "Learning resources, staffing, and inventory.",
    href: "/resources/dashboard",
    icon: BookOpen,
  },
  {
    title: "Financial department",
    description: "Reports, budgeting, and cost efficiency.",
    href: "/finance/dashboard",
    icon: Wallet,
  },
  {
    title: "Admin",
    description: "User management, roles, and configuration.",
    href: "/admin/dashboard",
    icon: UserCog,
  },
  {
    title: "Deputy director",
    description: "Executive KPIs and strategic oversight.",
    href: "/director/dashboard",
    icon: Users,
  },
  {
    title: "IT Operations",
    description: "Infrastructure, security, and system health.",
    href: "/operations/dashboard",
    icon: ShieldCheck,
  },
] as const;

export default function ProjectHubPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <div className="absolute right-4 top-4 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-400">
            Static Prototype Mode
          </div>

          <header className="max-w-3xl">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              LMS Platform Prototype - Review Portal
            </h1>
            <p className="mt-3 text-sm text-slate-600 sm:text-base">
              Final Year Software Development Project. Select a role to explore
              the dashboard functionalities.
            </p>
          </header>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900">
              Select a role to explore
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {ROLES.map((role) => {
                const Icon = role.icon;
                return (
                  <div
                    key={role.title}
                    className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-transform duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-400/15"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50">
                        <Icon className="h-5 w-5 text-indigo-400" aria-hidden />
                      </div>
                    </div>

                    <h3 className="mt-4 text-base font-semibold text-slate-900">
                      {role.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {role.description}
                    </p>

                    <Link
                      href={role.href}
                      prefetch
                      className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-indigo-400 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
                    >
                      Explore Dashboard
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
