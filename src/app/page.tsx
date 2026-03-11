"use client";

import Link from "next/link";
import * as React from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const FEATURES = [
  {
    title: "Global Accreditation",
    description: "Internationally recognized credentials that open doors worldwide.",
    icon: "🌐",
  },
  {
    title: "AI-Powered Learning",
    description: "Smart tools and personalized pathways to accelerate your growth.",
    icon: "🤖",
  },
  {
    title: "Direct 1C/Teams Integration",
    description: "Seamless workflows with your existing enterprise stack.",
    icon: "🔗",
  },
  {
    title: "International Degree",
    description: "Earn a degree that carries weight across borders.",
    icon: "🎓",
  },
] as const;

const STATS = [
  { value: "10k+", label: "Students" },
  { value: "50+", label: "Courses" },
  { value: "AQAD", label: "Certified" },
] as const;

const PATHS = [
  {
    key: "applicant",
    title: "Applicant",
    description: "Start your journey here. Register and apply for admission.",
    href: "/auth/register",
  },
  {
    key: "student",
    title: "Student",
    description: "Already a student? Access your student portal.",
    href: "/auth/login?type=student",
  },
  {
    key: "staff",
    title: "Staff",
    description: "Faculty and Quality Assurance access.",
    href: "/auth/login?type=staff",
  },
] as const;

export default function LandingPage() {
  const choosePathRef = React.useRef<HTMLElement>(null);

  const scrollToPath = React.useCallback(() => {
    choosePathRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0f172a] px-4 py-24 md:py-32 lg:py-40">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_40%,rgba(245,158,11,0.08)_100%)]" />
        <div className="relative mx-auto max-w-5xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Shape Your Future with{" "}
            <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Global Standards
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 md:text-xl">
            Unified Online University — where world-class accreditation meets
            cutting-edge learning technology.
          </p>
          <button
            type="button"
            onClick={scrollToPath}
            className={cn(
              "group mt-10 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-8 py-4 text-base font-semibold text-[#0f172a]",
              "transition-all duration-300 hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/30",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a]"
            )}
          >
            Get Started
            <span className="transition-transform duration-300 group-hover:translate-y-0.5">
              ↓
            </span>
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-b border-slate-100 bg-slate-50/50 px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-bold text-[#0f172a] md:text-3xl">
            Why Choose Us
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
            Four pillars that set us apart.
          </p>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className={cn(
                  "group rounded-xl border border-slate-200 bg-white p-6 shadow-sm",
                  "transition-all duration-300 hover:border-amber-200 hover:shadow-md hover:shadow-amber-500/10"
                )}
              >
                <span className="text-3xl">{feature.icon}</span>
                <h3 className="mt-4 text-lg font-semibold text-[#0f172a]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Banner */}
      <section className="relative overflow-hidden bg-[#0f172a] px-4 py-16 md:py-20">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(245,158,11,0.15)_0%,transparent_50%,rgba(245,158,11,0.1)_100%)]" />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center justify-between gap-8 sm:flex-row sm:gap-12">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-amber-400 md:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm font-medium uppercase tracking-wider text-slate-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Choose Your Path */}
      <section
        ref={choosePathRef}
        id="choose-path"
        className="scroll-mt-20 px-4 py-20 md:py-28"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-bold text-[#0f172a] md:text-3xl">
            Choose Your Path
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
            Select the entry point that fits you.
          </p>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {PATHS.map((path) => (
              <Link
                key={path.key}
                href={path.href}
                className={cn(
                  "group flex flex-col rounded-2xl border-2 border-slate-200 bg-white p-8 shadow-sm",
                  "transition-all duration-300 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/15",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                )}
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#0f172a] text-xl font-bold text-amber-400 transition-colors group-hover:bg-[#1e293b]">
                  {path.key === "applicant"
                    ? "→"
                    : path.key === "student"
                      ? "📚"
                      : "👤"}
                </div>
                <h3 className="text-xl font-semibold text-[#0f172a]">
                  {path.title}
                </h3>
                <p className="mt-3 flex-1 text-slate-600">{path.description}</p>
                <span
                  className={cn(
                    "mt-6 inline-flex items-center gap-2 text-sm font-semibold text-amber-600",
                    "transition-colors group-hover:text-amber-500"
                  )}
                >
                  Continue
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 px-4 py-8">
        <div className="mx-auto max-w-6xl text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Unified Online University. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
}
