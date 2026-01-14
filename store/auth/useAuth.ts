"use client";

import { useEffect, useCallback } from "react";
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
  useAuthStatus,
  useAuthActions,
  SignUpCredentials,
  SignInCredentials,
  PasswordRecoveryParams,
  ResetPasswordParams,
} from "./index";

// ============================================================================
// Main useAuth Hook
// ============================================================================

export interface UseAuthOptions {
  /**
   * If true, redirects unauthenticated users to signin page
   */
  requireAuth?: boolean;
  /**
   * If true, redirects authenticated users away (useful for auth pages)
   */
  redirectIfAuthenticated?: boolean;
  /**
   * Custom redirect URL for unauthenticated users
   */
  redirectTo?: string;
  /**
   * Custom redirect URL for authenticated users
   */
  redirectAuthenticatedTo?: string;
}

export function useAuth(options: UseAuthOptions = {}) {
  const {
    requireAuth = false,
    redirectIfAuthenticated = false,
    redirectTo = "/signin",
    redirectAuthenticatedTo = "/",
  } = options;

  const router = useRouter();

  // State
  const user = useUser();
  const session = useSession();
  const isAuthenticated = useIsAuthenticated();
  const loading = useAuthLoading();
  const error = useAuthError();
  const userType = useUserType();

  // Actions from store
  const {
    signUp: storeSignUp,
    signIn: storeSignIn,
    signOut: storeSignOut,
    signOutAllSessions,
    signInWithGoogle: storeSignInWithGoogle,
    signInWithGithub: storeSignInWithGithub,
    signInWithOAuth: storeSignInWithOAuth,
    getCurrentUser,
    getCurrentSession,
    refreshSession,
    listSessions,
    deleteSession,
    requestPasswordRecovery: storeRequestPasswordRecovery,
    confirmPasswordRecovery: storeConfirmPasswordRecovery,
    sendVerificationEmail,
    confirmEmailVerification,
    updateName,
    updateEmail,
    updatePassword,
    updatePreferences,
    getPreferences,
    initialize,
    clearError,
    reset,
  } = useAuthActions();

  // Initialize auth state on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Handle auth redirects
  useEffect(() => {
    if (loading) return;

    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo);
    }

    if (redirectIfAuthenticated && isAuthenticated) {
      router.push(redirectAuthenticatedTo);
    }
  }, [
    loading,
    isAuthenticated,
    requireAuth,
    redirectIfAuthenticated,
    redirectTo,
    redirectAuthenticatedTo,
    router,
  ]);

  // =========================================================================
  // Enhanced Actions with Navigation
  // =========================================================================

  const signUp = useCallback(
    async (credentials: SignUpCredentials, redirectAfter?: string) => {
      const user = await storeSignUp(credentials);
      if (redirectAfter) {
        router.push(redirectAfter);
      }
      return user;
    },
    [storeSignUp, router]
  );

  const signIn = useCallback(
    async (credentials: SignInCredentials, redirectAfter?: string) => {
      const session = await storeSignIn(credentials);
      if (redirectAfter) {
        router.push(redirectAfter);
      }
      return session;
    },
    [storeSignIn, router]
  );

  const signOut = useCallback(
    async (redirectAfter?: string) => {
      await storeSignOut();
      if (redirectAfter) {
        router.push(redirectAfter);
      } else {
        router.push("/signin");
      }
    },
    [storeSignOut, router]
  );

  const signInWithGoogle = useCallback(
    (successUrl?: string, failureUrl?: string) => {
      storeSignInWithGoogle(
        successUrl || redirectAuthenticatedTo,
        failureUrl || redirectTo
      );
    },
    [storeSignInWithGoogle, redirectAuthenticatedTo, redirectTo]
  );

  const signInWithGithub = useCallback(
    (successUrl?: string, failureUrl?: string) => {
      storeSignInWithGithub(
        successUrl || redirectAuthenticatedTo,
        failureUrl || redirectTo
      );
    },
    [storeSignInWithGithub, redirectAuthenticatedTo, redirectTo]
  );

  const signInWithOAuth = useCallback(
    (provider: OAuthProvider, successUrl?: string, failureUrl?: string) => {
      storeSignInWithOAuth(
        provider,
        successUrl || redirectAuthenticatedTo,
        failureUrl || redirectTo
      );
    },
    [storeSignInWithOAuth, redirectAuthenticatedTo, redirectTo]
  );

  const requestPasswordRecovery = useCallback(
    async (email: string, redirectUrl?: string) => {
      const url =
        redirectUrl ||
        (typeof window !== "undefined"
          ? `${window.location.origin}/reset-password`
          : "/reset-password");

      return storeRequestPasswordRecovery({ email, redirectUrl: url });
    },
    [storeRequestPasswordRecovery]
  );

  const confirmPasswordRecovery = useCallback(
    async (params: ResetPasswordParams, redirectAfter?: string) => {
      const token = await storeConfirmPasswordRecovery(params);
      if (redirectAfter) {
        router.push(redirectAfter);
      }
      return token;
    },
    [storeConfirmPasswordRecovery, router]
  );

  // =========================================================================
  // Computed Properties
  // =========================================================================

  const isAgency = userType === "agency";
  const isAgent = userType === "agent";
  const isRegularUser = userType === "user";
  const isVerified = user?.emailVerification ?? false;

  return {
    // State
    user,
    session,
    isAuthenticated,
    loading,
    error,
    userType,

    // Computed
    isAgency,
    isAgent,
    isRegularUser,
    isVerified,

    // Core Auth Actions
    signUp,
    signIn,
    signOut,
    signOutAllSessions,

    // OAuth Actions
    signInWithGoogle,
    signInWithGithub,
    signInWithOAuth,

    // Session Management
    getCurrentUser,
    getCurrentSession,
    refreshSession,
    listSessions,
    deleteSession,

    // Password Recovery
    requestPasswordRecovery,
    confirmPasswordRecovery,

    // Email Verification
    sendVerificationEmail,
    confirmEmailVerification,

    // Profile Updates
    updateName,
    updateEmail,
    updatePassword,
    updatePreferences,
    getPreferences,

    // Utility
    initialize,
    clearError,
    reset,
  };
}

// ============================================================================
// Specialized Hooks
// ============================================================================

/**
 * Hook for protected pages - redirects to signin if not authenticated
 */
export function useRequireAuth(redirectTo = "/signin") {
  return useAuth({ requireAuth: true, redirectTo });
}

/**
 * Hook for auth pages - redirects away if already authenticated
 */
export function useRedirectIfAuthenticated(redirectTo = "/") {
  return useAuth({ redirectIfAuthenticated: true, redirectAuthenticatedTo: redirectTo });
}

/**
 * Hook for checking specific user roles
 */
export function useAuthRole() {
  const userType = useUserType();
  const isAuthenticated = useIsAuthenticated();
  const loading = useAuthLoading();

  return {
    userType,
    isAuthenticated,
    loading,
    isAgency: userType === "agency",
    isAgent: userType === "agent",
    isRegularUser: userType === "user",
    hasRole: (role: string) => userType === role,
    hasAnyRole: (roles: string[]) => userType !== null && roles.includes(userType),
  };
}

/**
 * Hook for auth status only (lightweight)
 */
export function useAuthStatusOnly() {
  return useAuthStatus();
}

// ============================================================================
// Re-exports for convenience
// ============================================================================

export {
  useAuthStore,
  useUser,
  useSession,
  useIsAuthenticated,
  useAuthLoading,
  useAuthError,
  useUserType,
  useAuthStatus,
  useAuthActions,
};

export type {
  SignUpCredentials,
  SignInCredentials,
  PasswordRecoveryParams,
  ResetPasswordParams,
};

export default useAuth;
