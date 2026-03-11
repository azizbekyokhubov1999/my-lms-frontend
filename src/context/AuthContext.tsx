"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

export type AuthRole = "STUDENT" | "TEACHER" | "AQAD" | "ADMIN" | "APPLICANT";

const COOKIE_NAME = "auth_role";
const STORAGE_KEY = "auth_session";

interface AuthSession {
  role: AuthRole;
  email?: string;
  phone?: string;
  fullName?: string;
}

function getStoredSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    const validRoles = ["STUDENT", "TEACHER", "AQAD", "ADMIN", "APPLICANT"];
    if (
      parsed &&
      typeof parsed.role === "string" &&
      validRoles.includes(parsed.role)
    ) {
      if (parsed.role === "APPLICANT") {
        return parsed.phone ? parsed : null;
      }
      return parsed.email ? parsed : null;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function setRoleCookie(role: AuthRole | null) {
  if (typeof document === "undefined") return;
  const value = role ? role.toLowerCase() : "";
  const expires = "path=/; max-age=" + (role ? 60 * 60 * 24 * 7 : 0);
  document.cookie = `${COOKIE_NAME}=${value}; ${expires}`;
}

const STUDENT_EMAIL_DOMAIN = "@student.university.edu";
const STAFF_EMAIL_DOMAIN = "@university.edu";

function detectRoleFromEmail(email: string): AuthRole {
  const lower = email.toLowerCase().trim();
  if (lower.includes("aqad")) return "AQAD";
  if (lower.includes("teacher")) return "TEACHER";
  if (lower.includes("admin")) return "ADMIN";
  return "STUDENT";
}

function isStaffRole(role: AuthRole): boolean {
  return role === "AQAD" || role === "TEACHER" || role === "ADMIN";
}

function getRedirectForRole(role: AuthRole): string {
  switch (role) {
    case "APPLICANT":
      return "/admission/status";
    case "AQAD":
    case "ADMIN":
      return "/aqad";
    case "TEACHER":
      return "/teacher";
    case "STUDENT":
      return "/dashboard";
    default:
      return "/dashboard";
  }
}

export type LoginResult =
  | { success: true }
  | { success: false; needsMfa?: boolean; error?: string };

export type LoginType = "applicant" | "student" | "staff";

export interface LoginParams {
  identifier: string; // phone for applicant, email for student/staff
  password: string;
  type: LoginType;
  otp?: string;
}

interface AuthContextValue {
  user: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (params: LoginParams) => Promise<LoginResult>;
  registerApplicant: (fullName: string, phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  /** Upgrade APPLICANT to STUDENT after contract signing */
  upgradeApplicantToStudent: () => void;
  /** Dev only: switch role without full login */
  devSwitchRole?: (role: AuthRole) => void;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = React.useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const session = getStoredSession();
    if (session) {
      setUser(session);
      setRoleCookie(session.role);
    }
    setIsLoading(false);
  }, []);

  const login = React.useCallback(
    async (params: LoginParams): Promise<LoginResult> => {
      const { identifier, password, type, otp } = params;
      const trimmed = identifier.trim();
      const trimmedPassword = password.trim();

      if (!trimmed || trimmedPassword.length < 8) {
        return { success: false, error: "Invalid credentials." };
      }

      if (type === "applicant") {
        const session: AuthSession = {
          role: "APPLICANT",
          phone: trimmed,
          fullName: "",
        };
        setUser(session);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        setRoleCookie("APPLICANT");
        router.push("/admission/status");
        return { success: true };
      }

      if (type === "student") {
        const lower = trimmed.toLowerCase();
        if (!lower.endsWith(STUDENT_EMAIL_DOMAIN)) {
          return { success: false, error: `Only ${STUDENT_EMAIL_DOMAIN} emails are allowed for students.` };
        }
        const session: AuthSession = { role: "STUDENT", email: trimmed };
        setUser(session);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        setRoleCookie("STUDENT");
        router.push("/dashboard");
        return { success: true };
      }

      if (type === "staff") {
        const lower = trimmed.toLowerCase();
        if (!lower.endsWith(STAFF_EMAIL_DOMAIN)) {
          return { success: false, error: `Only institutional @university.edu emails are allowed for staff.` };
        }
        if (lower.endsWith(STUDENT_EMAIL_DOMAIN)) {
          return { success: false, error: "Student emails cannot be used for staff access." };
        }
        const role = detectRoleFromEmail(trimmed);
        if (!isStaffRole(role)) {
          return { success: false, error: "Invalid staff email." };
        }
        if (!otp || otp.length !== 6) {
          return { success: false, needsMfa: true };
        }
        if (!/^\d{6}$/.test(otp)) {
          return { success: false, needsMfa: true, error: "Invalid verification code." };
        }
        const session: AuthSession = { role, email: trimmed };
        setUser(session);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        setRoleCookie(role);
        router.push(getRedirectForRole(role));
        return { success: true };
      }

      return { success: false, error: "Invalid login type." };
    },
    [router]
  );

  const registerApplicant = React.useCallback(
    async (
      fullName: string,
      phone: string,
      password: string
    ): Promise<{ success: boolean; error?: string }> => {
      const trimmedName = fullName.trim();
      const trimmedPhone = phone.trim();

      if (!trimmedName || trimmedPhone.length < 7 || password.length < 8) {
        return { success: false, error: "Please fill all fields. Password must be at least 8 characters." };
      }

      const session: AuthSession = {
        role: "APPLICANT",
        phone: trimmedPhone,
        fullName: trimmedName,
      };
      setUser(session);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      setRoleCookie("APPLICANT");
      router.push("/auth/login");
      return { success: true };
    },
    [router]
  );

  const logout = React.useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    setRoleCookie(null);
    router.push("/auth/login");
  }, [router]);

  const upgradeApplicantToStudent = React.useCallback(() => {
    setUser((prev) => {
      if (!prev || prev.role !== "APPLICANT") return prev;
      const studentEmail =
        prev.phone?.replace(/\D/g, "").slice(-8) + STUDENT_EMAIL_DOMAIN ||
        "student@student.university.edu";
      const session: AuthSession = {
        role: "STUDENT",
        email: studentEmail,
        fullName: prev.fullName,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      setRoleCookie("STUDENT");
      return session;
    });
  }, []);

  const devSwitchRole = React.useCallback(
    (role: AuthRole) => {
      const mockEmails: Record<AuthRole, string> = {
        STUDENT: "student@student.university.edu",
        TEACHER: "teacher@university.edu",
        AQAD: "aqad@university.edu",
        ADMIN: "admin@university.edu",
        APPLICANT: "+1234567890",
      };
      const session: AuthSession =
        role === "APPLICANT"
          ? { role, phone: mockEmails[role] }
          : { role, email: mockEmails[role] };
      setUser(session);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      setRoleCookie(role);
      router.push(
        role === "APPLICANT"
          ? "/admission/status"
          : role === "AQAD"
            ? "/aqad"
            : role === "TEACHER"
              ? "/teacher"
              : "/dashboard"
      );
    },
    [router]
  );

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    registerApplicant,
    logout,
    upgradeApplicantToStudent,
    devSwitchRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return ctx;
}
