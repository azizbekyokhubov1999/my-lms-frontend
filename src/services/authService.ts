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

export async function registerUser(userData: RegisterRequest) {
  try {
    console.log("[authService] registerUser payload:", userData);
    const res = await api.post("/api/auth/register", userData);
    return res.data;
  } catch (err: unknown) {
    const axiosErr = isAxiosError(err) ? (err as AxiosError) : null;
    const status = axiosErr?.response?.status;
    const data = axiosErr?.response?.data;
    const details = data ? ` - ${typeof data === "string" ? data : JSON.stringify(data)}` : "";

    throw new Error(
      `Failed to register user${status ? ` (HTTP ${status})` : ""}${details}`,
    );
  }
}

