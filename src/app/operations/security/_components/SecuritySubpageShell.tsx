import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { Card } from "@/app/components/ui/Card";

type SecuritySubpageShellProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  badgeText: string;
  children?: React.ReactNode;
};

export function SecuritySubpageShell({
  title,
  description,
  icon: Icon,
  badgeText,
  children,
}: SecuritySubpageShellProps) {
  return (
    <div className="space-y-5 bg-slate-50 text-slate-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/operations/security"
            className="inline-flex items-center text-sm font-medium text-indigo-500 hover:text-indigo-600"
          >
            Back to Security Hub
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
          <Icon className="h-4 w-4" />
          {badgeText}
        </span>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">{children}</Card>
    </div>
  );
}
