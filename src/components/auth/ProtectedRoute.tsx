"use client";

import * as React from "react";

import type { AuthRole } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: AuthRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  // Dev role-switching and access checks were temporary during early development.
  // Allow all pages to be accessible via browser directly.
  void allowedRoles;
  return <>{children}</>;
}
