"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import type { LoginType } from "@/context/AuthContext";
import { loginUser } from "@/services/authService";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

const TOKEN_STORAGE_KEY = "token";
const USER_STORAGE_KEY = "user";

function getLoginType(searchParams: URLSearchParams | null): LoginType {
  const t = searchParams?.get("type")?.toLowerCase();
  if (t === "student" || t === "staff" || t === "applicant") {
    return t;
  }
  return "applicant";
}

function extractTokenFromLoginResponse(data: unknown): string | null {
  if (data == null) return null;
  if (typeof data === "string" && data.trim()) return data.trim();

  if (typeof data === "object") {
    const obj = data as Record<string, unknown>;
    const direct =
      obj.token ?? obj.accessToken ?? obj.access_token ?? obj.jwt;
    if (typeof direct === "string" && direct.trim()) return direct.trim();

    const nested = obj.data;
    if (nested && typeof nested === "object") {
      const n = nested as Record<string, unknown>;
      const t = n.token ?? n.accessToken ?? n.access_token ?? n.jwt;
      if (typeof t === "string" && t.trim()) return t.trim();
    }
  }

  return null;
}

function extractUserFromLoginResponse(data: unknown): Record<string, unknown> | null {
  if (!data || typeof data !== "object") return null;
  const obj = data as Record<string, unknown>;

  if (obj.user && typeof obj.user === "object" && !Array.isArray(obj.user)) {
    return obj.user as Record<string, unknown>;
  }

  const nested = obj.data;
  if (nested && typeof nested === "object" && !Array.isArray(nested)) {
    const d = nested as Record<string, unknown>;
    if (d.user && typeof d.user === "object") {
      return d.user as Record<string, unknown>;
    }
    if ("role" in d || "email" in d || "phone" in d) {
      return d;
    }
  }

  const {
    token: _t,
    accessToken: _a,
    access_token: _at,
    jwt: _j,
    data: _d,
    ...rest
  } = obj;
  if (Object.keys(rest).length > 0) {
    return rest as Record<string, unknown>;
  }

  return null;
}

function resolveEffectiveRole(
  user: Record<string, unknown> | null,
  loginType: LoginType,
): string {
  const raw = user?.role;
  if (typeof raw === "string" && raw.trim()) {
    return raw.trim().toLowerCase();
  }
  if (loginType === "applicant" || loginType === "student") {
    return loginType;
  }
  return "";
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = React.useMemo(
    () => getLoginType(searchParams),
    [searchParams],
  );

  const [identifier, setIdentifier] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const isApplicant = type === "applicant";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const data = await loginUser(
        isApplicant
          ? { phone: identifier.trim(), password }
          : { email: identifier.trim(), password },
      );

      const token = extractTokenFromLoginResponse(data);
      if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
      }

      const user = extractUserFromLoginResponse(data);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user ?? {}));

      const role = resolveEffectiveRole(user, type);
      if (role === "applicant" || role === "student") {
        router.push("/admission/profile");
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid credentials.";
      setError(message);
      window.alert(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const title =
    type === "applicant"
      ? "Applicant Login"
      : type === "student"
        ? "Student Login"
        : "Staff Login";
  const subtext =
    type === "applicant"
      ? "Enter your phone and password to check your admission status."
      : type === "student"
        ? "Use your institutional email to access your student portal."
        : "Use your institutional email.";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <Card className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          <p className="mt-2 text-sm text-slate-600">{subtext}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
          noValidate
        >
          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          {isApplicant ? (
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+1 (555) 000-0000"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          ) : (
            <Input
              label="Institutional Email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder={
                type === "student"
                  ? "you@student.university.edu"
                  : "you@university.edu"
              }
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          )}

          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {type === "student" && (
            <div className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Identity verification via camera will be required for exams.
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="mt-2 w-full"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-slate-600">
          <Link
            href="/auth/login?type=applicant"
            className="font-semibold text-blue-900 hover:underline"
          >
            Applicant
          </Link>
          <Link
            href="/auth/login?type=student"
            className="font-semibold text-blue-900 hover:underline"
          >
            Student
          </Link>
          <Link
            href="/auth/login?type=staff"
            className="font-semibold text-blue-900 hover:underline"
          >
            Staff
          </Link>
        </div>

        <p className="mt-4 text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="font-semibold text-blue-900 hover:underline"
          >
            Register as applicant
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="text-sm text-slate-500">Loading...</div>
        </div>
      }
    >
      <LoginForm />
    </React.Suspense>
  );
}
