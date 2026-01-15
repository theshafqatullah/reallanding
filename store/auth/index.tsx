"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { account } from "@/services/appwrite";
import { ID, AppwriteException, Models, OAuthProvider } from "appwrite";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// ============================================================================
// Types
// ============================================================================

export interface User extends Models.User<Models.Preferences> {}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  name: string;
}

export interface PasswordRecoveryParams {
  email: string;
  redirectUrl?: string;
}

export interface ResetPasswordParams {
  userId: string;
  secret: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  error: string | null;
}

export interface AuthActions {
  checkAuth: () => Promise<void>;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => void;
  signInWithOAuth: (provider: OAuthProvider) => void;
  requestPasswordRecovery: (params: PasswordRecoveryParams) => Promise<void>;
  confirmPasswordRecovery: (params: ResetPasswordParams) => Promise<void>;
  clearError: () => void;
  setHydrated: () => void;
}

export type AuthStore = AuthState & AuthActions;

// ============================================================================
// Store
// ============================================================================

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: true,
      isHydrated: false,
      error: null,

      /**
       * Set hydrated status
       */
      setHydrated: () => set({ isHydrated: true }),

      /**
       * Check authentication status
       * Verifies if there's an active session with Appwrite
       */
      checkAuth: async () => {
        set({ isLoading: true, error: null });
        try {
          const user = await account.get();
          set({
            user: user as User,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      /**
       * Sign in with email and password
       */
      signIn: async ({ email, password }: SignInCredentials) => {
        set({ isLoading: true, error: null });
        try {
          // Create session
          await account.createEmailPasswordSession({ email, password });
          
          // Wait for cookie to be set, then retry getting user
          let user = null;
          let retries = 3;
          
          while (retries > 0) {
            try {
              await new Promise(resolve => setTimeout(resolve, 150));
              user = await account.get();
              break;
            } catch {
              retries--;
              if (retries === 0) {
                // Session created, set auth state even without user details
                set({
                  user: null,
                  isAuthenticated: true,
                  isLoading: false,
                  error: null,
                });
                return;
              }
            }
          }
          
          set({
            user: user as User,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const message =
            error instanceof AppwriteException
              ? error.message
              : "Failed to sign in. Please check your credentials.";
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: message,
          });
          throw error;
        }
      },

      /**
       * Sign up new user and auto sign in
       */
      signUp: async ({ name, email, password }: SignUpCredentials) => {
        set({ isLoading: true, error: null });
        try {
          await account.create({
            userId: ID.unique(),
            email,
            password,
            name,
          });
          await get().signIn({ email, password });
        } catch (error) {
          const message =
            error instanceof AppwriteException
              ? error.message
              : "Failed to create account. Please try again.";
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: message,
          });
          throw error;
        }
      },

      /**
       * Sign out current user
       */
      signOut: async () => {
        set({ isLoading: true, error: null });
        try {
          await account.deleteSession({ sessionId: "current" });
        } catch {
          // Ignore errors - session might already be invalid
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
          // Force page reload to clear any cached state
          if (typeof window !== "undefined") {
            window.location.href = "/";
          }
        }
      },

      /**
       * Sign in with Google OAuth
       */
      signInWithGoogle: () => {
        const successUrl = typeof window !== "undefined" ? window.location.origin : "/";
        const failureUrl = typeof window !== "undefined" ? `${window.location.origin}/signin` : "/signin";
        account.createOAuth2Session({
          provider: OAuthProvider.Google,
          success: successUrl,
          failure: failureUrl,
        });
      },

      /**
       * Sign in with any OAuth provider
       */
      signInWithOAuth: (provider: OAuthProvider) => {
        const successUrl = typeof window !== "undefined" ? window.location.origin : "/";
        const failureUrl = typeof window !== "undefined" ? `${window.location.origin}/signin` : "/signin";
        account.createOAuth2Session({
          provider,
          success: successUrl,
          failure: failureUrl,
        });
      },

      /**
       * Send password recovery email
       */
      requestPasswordRecovery: async ({ email, redirectUrl }: PasswordRecoveryParams) => {
        set({ isLoading: true, error: null });
        try {
          const url = redirectUrl || (typeof window !== "undefined" ? `${window.location.origin}/reset-password` : "/reset-password");
          await account.createRecovery({ email, url });
          set({ isLoading: false, error: null });
        } catch (error) {
          const message =
            error instanceof AppwriteException
              ? error.message
              : "Failed to send recovery email.";
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      /**
       * Reset password with token
       */
      confirmPasswordRecovery: async ({ userId, secret, password }: ResetPasswordParams) => {
        set({ isLoading: true, error: null });
        try {
          await account.updateRecovery({ userId, secret, password });
          set({ isLoading: false, error: null });
        } catch (error) {
          const message =
            error instanceof AppwriteException
              ? error.message
              : "Failed to reset password.";
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      /**
       * Clear error state
       */
      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => {
        return (state) => {
          // Use the state's setHydrated action if available
          if (state) {
            state.setHydrated();
          }
        };
      },
    }
  )
);

// ============================================================================
// Hydration Hook - Use in root layout to trigger auth check
// ============================================================================

export function useAuthHydration() {
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const setHydrated = useAuthStore((s) => s.setHydrated);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Fallback: if not hydrated after mount, force it (SSR case)
    if (!isHydrated) {
      setHydrated();
    }
  }, [isHydrated, setHydrated]);

  useEffect(() => {
    if (isHydrated && !hasChecked) {
      checkAuth().finally(() => setHasChecked(true));
    }
  }, [isHydrated, hasChecked, checkAuth]);

  return hasChecked;
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Custom hook to use auth store
 * @example
 * const { user, isAuthenticated, signIn, signOut } = useAuth();
 */
export const useAuth = () => {
  const store = useAuthStore();
  const setHydrated = useAuthStore((s) => s.setHydrated);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Ensure hydration flag is set on client
    if (!store.isHydrated) {
      setHydrated();
    }
  }, [store.isHydrated, setHydrated]);

  // Combined loading state: loading if not mounted, not hydrated, OR actively loading
  const isReady = mounted && store.isHydrated && !store.isLoading;

  return {
    // State
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: !isReady,
    loading: !isReady,
    isHydrated: store.isHydrated,
    error: store.error,

    // Actions
    signIn: store.signIn,
    signUp: store.signUp,
    signOut: store.signOut,
    signInWithGoogle: store.signInWithGoogle,
    signInWithOAuth: store.signInWithOAuth,
    requestPasswordRecovery: store.requestPasswordRecovery,
    confirmPasswordRecovery: store.confirmPasswordRecovery,
    checkAuth: store.checkAuth,
    clearError: store.clearError,
  };
};

// ============================================================================
// Selector Hooks
// ============================================================================

export const useUser = () => useAuthStore((s) => s.user);
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated);
export const useAuthLoading = () => {
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const isLoading = useAuthStore((s) => s.isLoading);
  return !isHydrated || isLoading;
};
export const useAuthError = () => useAuthStore((s) => s.error);

// ============================================================================
// Guard Components
// ============================================================================

interface GuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

/**
 * Protects routes - redirects unauthenticated users
 */
export function AuthGuard({ children, fallback = null, redirectTo = "/signin" }: GuardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, isHydrated } = useAuth();

  useEffect(() => {
    if (isHydrated && !isLoading && !isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isHydrated, isLoading, isAuthenticated, redirectTo, router]);

  // Show fallback while loading or not hydrated
  if (!isHydrated || isLoading) {
    return <>{fallback}</>;
  }

  // Not authenticated - will redirect
  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * For auth pages - redirects authenticated users away
 */
export function GuestGuard({ children, fallback = null, redirectTo = "/" }: GuardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, isHydrated } = useAuth();

  useEffect(() => {
    if (isHydrated && !isLoading && isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isHydrated, isLoading, isAuthenticated, redirectTo, router]);

  // Show fallback while loading or not hydrated
  if (!isHydrated || isLoading) {
    return <>{fallback}</>;
  }

  // Authenticated - will redirect
  if (isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
