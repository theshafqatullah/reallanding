"use client";

import { useAuthInit } from "@/store/auth";
import { ReactNode, useEffect } from "react";

/**
 * AuthHydrator component that checks auth on mount
 * Place this in layout to ensure auth is checked early
 */
export function AuthHydrator({ children }: { children: ReactNode }) {
  // Clear any stale auth-storage from previous versions
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth-storage");
    }
  }, []);
  
  useAuthInit();
  return <>{children}</>;
}
