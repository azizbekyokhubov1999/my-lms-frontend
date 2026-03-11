"use client";

import { AuthProvider } from "@/context/AuthContext";
import { RoleSwitcher } from "@/components/debug/RoleSwitcher";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <RoleSwitcher />
    </AuthProvider>
  );
}
