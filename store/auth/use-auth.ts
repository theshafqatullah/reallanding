"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { OAuthProvider } from "appwrite";
import {
  useAuthStore,
  useUser,
  useSession,
  useIsAuthenticated,
  useAuthLoading,
  useAuthError,
  useUserType,
  SignUpCredentials,
  SignInCredentials,
  PasswordRecoveryParams,
  ResetPasswordParams,
} from "./auth-store";

// ============================================================================
// Main useAuth Hook
// ============================================================================

export function useAuth() {
  const user = useUser();
  const session = useSession();
  const isAuthenticated = useIsAuthenticated();
  const loading = useAuthLoading();
  const error = useAuthError();
  const userType = useUserType();

  // Get actions directly from store
  const signUp = useAuthStore((s) => s.signUp);
  const signIn = useAuthStore((s) => s.signIn);
  const signOut = useAuthStore((s) => s.signOut);
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle);
  const signInWithGithub = useAuthStore((s) => s.signInWithGithub);
  const signInWithOAuth = useAuthStore((s) => s.signInWithOAuth);
  const requestPasswordRecovery = useAuthStore((s) => s.requestPasswordRecovery);
  const confirmPasswordRecovery = useAuthStore((s) => s.confirmPasswordRecovery);
  const clearError = useAuthStore((s) => s.clearError);

  return {
    // State
    user,
    session,
    isAuthenticated,
    loading,
    error,
    userType,

    // Actions
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
    signInWithGithub,
    signInWithOAuth,
    requestPasswordRecovery,
    confirmPasswordRecovery,
    clearError,
  };
}

// ============================================================================
// Auth Guard Hook - Redirects if not authenticated
// ============================================================================

export function useRequireAuth(redirectTo = "/signin") {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [loading, isAuthenticated, redirectTo, router]);

  return { isAuthenticated, loading };
}

// ============================================================================
// Guest Guard Hook - Redirects if authenticated
// ============================================================================

export function useRedirectIfAuthenticated(redirectTo = "/") {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [loading, isAuthenticated, redirectTo, router]);

  return { isAuthenticated, loading };
}

// Re-export types
export type { SignUpCredentials, SignInCredentials, PasswordRecoveryParams, ResetPasswordParams };
