import api from "@/lib/api";
import { isAxiosError, type AxiosError } from "axios";

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

/** Login body — send either `email` or `phone` (e.g. applicant vs student/staff). */
export interface LoginCredentials {
  password: string;
  email?: string;
  phone?: string;
}

/**
 * Extract a human-readable message from Axios error responses.
 * Many APIs return `{ message: string }`, `{ error: string }`, or plain text.
 */
function getServerErrorMessage(err: unknown, fallback: string): string {
  if (!isAxiosError(err)) {
    return err instanceof Error ? err.message : fallback;
  }

  const axiosErr = err as AxiosError;
  const data: unknown = axiosErr.response?.data;

  if (typeof data === "string" && data.trim()) {
    return data.trim();
  }

  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    const msg = obj.message ?? obj.error ?? obj.detail;
    if (typeof msg === "string" && msg.trim()) {
      return msg.trim();
    }
  }


  const status = axiosErr.response?.status;
  return status ? `${fallback} (HTTP ${status})` : fallback;
}

export async function registerUser(userData: RegisterRequest) {
  try {
    console.log("[authService] registerUser payload:", userData);
    const res = await api.post("/api/auth/register", userData);
    return res.data;
  } catch (err: unknown) {
    throw new Error(getServerErrorMessage(err, "Failed to register user"));
  }
}

/**
 * Verify OTP after registration (or similar flow).
 * POST body: `{ email, code }` — adjust field names if your Swagger differs.
 */
export async function verifyOtp(email: string, code: string) {
  try {
    const payload = { email, code };
    console.log("[authService] verifyOtp payload:", { email, code: "***" });
    const res = await api.post("/api/auth/verify-email", payload);
    return res.data;
  } catch (err: unknown) {
    throw new Error(getServerErrorMessage(err, "OTP verification failed"));
  }
}

/**
 * Login — response typically includes JWT + user (shape depends on backend).
 */
export async function loginUser(credentials: LoginCredentials) {
  const { password, email, phone } = credentials;
  const trimmedPhone = phone?.trim();
  const trimmedEmail = email?.trim();

  const body =
    trimmedPhone && trimmedPhone.length > 0
      ? { phone: trimmedPhone, password }
      : trimmedEmail && trimmedEmail.length > 0
        ? { email: trimmedEmail, password }
        : null;

  if (!body) {
    throw new Error("Email or phone is required");
  }

  try {
    console.log("[authService] loginUser:", "phone" in body ? { phone: body.phone } : { email: body.email });
    const res = await api.post("/api/auth/login", body);
    return res.data;
  } catch (err: unknown) {
    throw new Error(getServerErrorMessage(err, "Invalid credentials"));
  }
}
