"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function HubBackButton() {
  return (
    <Link
      href="/operations/capacity"
      prefetch
      className="inline-flex items-center gap-2 rounded-lg border-2 border-indigo-400 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-400 shadow-sm transition-colors hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
    >
      <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
      Back to Capacity Hub
    </Link>
  );
}
