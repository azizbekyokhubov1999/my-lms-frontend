"use client";

import Link from "next/link";
import * as React from "react";

import { useAuth } from "@/hooks/useAuth";
import type { AuthRole } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: AuthRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { role, isLoading } = useAuth();
  const hasAccess = React.useMemo(
    () => allowedRoles.includes(role),
    [allowedRoles, role]
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-sm text-slate-500">Loading...</div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <p className="text-6xl font-bold text-slate-200">403</p>
          <h1 className="mt-4 text-xl font-semibold text-slate-900">
            403 Forbidden: Access Denied
          </h1>
          <p className="mt-2 max-w-md text-sm text-slate-600">
            You do not have permission to access this page. This area is
            restricted to authorized personnel only.
          </p>
          <div className="mt-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-md bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900 focus-visible:ring-offset-2"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
