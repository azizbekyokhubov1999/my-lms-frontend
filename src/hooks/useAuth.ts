"use client";

import * as React from "react";
import { useAuthContext } from "@/context/AuthContext";

export type AuthRole = "STUDENT" | "TEACHER" | "AQAD" | "ADMIN" | "APPLICANT";

export function useAuth() {
  const { user, isAuthenticated, isLoading, login, registerApplicant, logout, upgradeApplicantToStudent } =
    useAuthContext();

  // Role-based access control is not enforced right now; keep a stable role value.
  const role: AuthRole = "STUDENT";

  const setRole = React.useCallback(() => {
    // Role is derived from login; changing it would require re-login.
    // Kept for backward compatibility; no-op.
  }, []);

  return {
    role,
    user,
    isAuthenticated,
    isLoading,
    login,
    registerApplicant,
    logout,
    upgradeApplicantToStudent,
    setRole,
  };
}
