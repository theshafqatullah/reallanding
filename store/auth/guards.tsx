"use client";

import { ReactNode } from "react";
import { useRequireAuth, useRedirectIfAuthenticated } from "./use-auth";

// ============================================================================
// Auth Guard - Protects routes that require authentication
// ============================================================================

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

export function AuthGuard({
  children,
  fallback = null,
  redirectTo = "/signin",
}: AuthGuardProps) {
  const { isAuthenticated, loading } = useRequireAuth(redirectTo);

  if (loading) {
    return <>{fallback}</>;
  }

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// ============================================================================
// Guest Guard - For auth pages (signin, signup, etc.)
// ============================================================================

interface GuestGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

export function GuestGuard({
  children,
  fallback = null,
  redirectTo = "/",
}: GuestGuardProps) {
  const { isAuthenticated, loading } = useRedirectIfAuthenticated(redirectTo);

  if (loading) {
    return <>{fallback}</>;
  }

  if (isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
