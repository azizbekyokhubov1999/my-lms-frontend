"use client";

import {
  Activity,
  Cpu,
  ShieldAlert,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import "./operations-clean-light.css";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type IconKey = "activity" | "cpu" | "zap" | "shieldAlert" | "shieldCheck";

const ICONS: Record<IconKey, React.ComponentType<{ className?: string }>> = {
  activity: Activity,
  cpu: Cpu,
  zap: Zap,
  shieldAlert: ShieldAlert,
  shieldCheck: ShieldCheck,
};

type NavLeaf = {
  label: string;
  href: string;
  icon: IconKey;
};

const PRE_GROUP_LEAVES: NavLeaf[] = [
  { label: "Dashboard", href: "/operations/dashboard", icon: "cpu" },
];

const POST_GROUP_LEAVES: NavLeaf[] = [
  { label: "System Health", href: "/operations/system-health", icon: "activity" },
  { label: "Integrations", href: "/operations/integrations", icon: "zap" },
  { label: "Incidents", href: "/operations/incidents", icon: "shieldAlert" },
  { label: "Security", href: "/operations/security", icon: "shieldCheck" },
  { label: "Backup", href: "/operations/backup", icon: "activity" },
  { label: "Performance", href: "/operations/performance", icon: "cpu" },
  { label: "Access", href: "/operations/access", icon: "shieldCheck" },
  { label: "Compliance", href: "/operations/compliance", icon: "shieldCheck" },
  { label: "Maintenance", href: "/operations/maintenance", icon: "activity" },
  { label: "Capacity", href: "/operations/capacity", icon: "cpu" },
  { label: "Reports", href: "/operations/reports", icon: "zap" },
];

const BOTTOM_LEAVES: NavLeaf[] = [
  { label: "Profile", href: "/operations/profile", icon: "shieldCheck" },
  { label: "Settings", href: "/operations/settings", icon: "cpu" },
];

export default function OperationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  const closeMobile = React.useCallback(() => setMobileOpen(false), []);

  return (
    <div className="operations-clean-light min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-indigo-400/40 bg-slate-950/95 px-3 sm:px-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-indigo-400/50 bg-indigo-400/10 px-3 py-2 text-slate-100 hover:bg-indigo-400/20 md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span className="text-sm font-semibold">{mobileOpen ? "Close" : "Menu"}</span>
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold uppercase tracking-wide text-slate-100">
              IT Operations Command Center
            </h1>
          </div>
        </div>
      </header>

      <div className="flex">
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-950/70 md:hidden"
            aria-hidden
            onClick={closeMobile}
          />
        )}

        <aside
          className={cn(
            "z-50 hidden w-72 shrink-0 flex-col border-r border-slate-200 bg-white md:flex",
            mobileOpen ? "fixed left-0 top-14 h-[calc(100vh-3.5rem)]" : "hidden",
          )}
        >
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {PRE_GROUP_LEAVES.map((leaf) => {
                const Icon = ICONS[leaf.icon];
                const active = isActive(leaf.href);

                return (
                  <Link
                    key={leaf.href}
                    href={leaf.href}
                    onClick={closeMobile}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "border-indigo-400/60 bg-indigo-400/10 text-slate-100"
                        : "border-indigo-400/20 bg-slate-950/30 text-slate-100/70 hover:bg-indigo-400/10 hover:border-indigo-400/50 hover:text-slate-100",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4",
                        active ? "text-indigo-400" : "text-slate-100/70",
                      )}
                    />
                    <span>{leaf.label}</span>
                  </Link>
                );
              })}

             
              <div className="pt-3 space-y-2">
                {POST_GROUP_LEAVES.map((leaf) => {
                  const Icon = ICONS[leaf.icon];
                  const active = isActive(leaf.href);

                  return (
                    <Link
                      key={leaf.href}
                      href={leaf.href}
                      onClick={closeMobile}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "border-indigo-400/60 bg-indigo-400/10 text-slate-100"
                          : "border-indigo-400/20 bg-slate-950/30 text-slate-100/70 hover:bg-indigo-400/10 hover:border-indigo-400/50 hover:text-slate-100",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4",
                          active ? "text-indigo-400" : "text-slate-100/70",
                        )}
                      />
                      <span>{leaf.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          <div className="border-t border-indigo-400/40 p-4">
            <div className="space-y-2">
              {BOTTOM_LEAVES.map((leaf) => {
                const Icon = ICONS[leaf.icon];
                const active = isActive(leaf.href);

                return (
                  <Link
                    key={leaf.href}
                    href={leaf.href}
                    onClick={closeMobile}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "border-indigo-400/60 bg-indigo-400/10 text-slate-100"
                        : "border-indigo-400/20 bg-slate-950/30 text-slate-100/70 hover:bg-indigo-400/10 hover:border-indigo-400/50 hover:text-slate-100",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4",
                        active ? "text-indigo-400" : "text-slate-100/70",
                      )}
                    />
                    <span>{leaf.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 bg-slate-50">
          <div className="p-4 sm:p-6 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

