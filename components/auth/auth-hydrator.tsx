"use client";

import { useAuthHydration } from "@/store/auth";
import { ReactNode } from "react";

/**
 * AuthHydrator component that checks auth on mount
 * Place this in layout to ensure auth is checked early
 */
export function AuthHydrator({ children }: { children: ReactNode }) {
  useAuthHydration();
  return <>{children}</>;
}
