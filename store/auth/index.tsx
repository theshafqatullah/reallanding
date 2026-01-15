"use client";

import { create } from "zustand";
import { account } from "@/services/appwrite";
import { ID, AppwriteException, Models, OAuthProvider } from "appwrite";
import { ReactNode, useEffect, useState, useRef } from "react";
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
  isReady: boolean; // True after initial checkAuth completes
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
}

export type AuthStore = AuthState & AuthActions;

// ============================================================================
// Store - No persistence, relies on Appwrite cookies for session
// ============================================================================

export const useAuthStore = create<AuthStore>((set, get) => ({
  // State
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isReady: false,
  error: null,

  /**
   * Check authentication status
   * Verifies if there's an active session with Appwrite
   */
  checkAuth: async () => {
    // Don't reset loading if already checking
    if (!get().isReady) {
      set({ isLoading: true });
    }
    set({ error: null });
    
    try {
      const user = await account.get();
      set({
        user: user as User,
        isAuthenticated: true,
        isLoading: false,
        isReady: true,
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isReady: true,
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
      
      // Wait a moment for cookie to be set, then get user
      await new Promise(resolve => setTimeout(resolve, 100));
      const user = await account.get();
      
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
}));

// ============================================================================
// Initialization Hook - Call once in root layout
// ============================================================================

export function useAuthInit() {
  const isReady = useAuthStore((s) => s.isReady);
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const initialized = useRef(false);

  useEffect(() => {
    // Only check auth once on initial mount
    if (!initialized.current) {
      initialized.current = true;
      checkAuth();
    }
  }, [checkAuth]);

  return isReady;
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
  const [mounted, setMounted] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    setMounted(true);
    // Trigger auth check if not already done
    if (!initialized.current && !store.isReady) {
      initialized.current = true;
      store.checkAuth();
    }
  }, [store]);

  // Combined loading state
  const isLoading = !mounted || !store.isReady || store.isLoading;

  return {
    // State
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading,
    loading: isLoading,
    isReady: store.isReady,
    isHydrated: store.isReady, // Alias for backwards compatibility
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
  const isReady = useAuthStore((s) => s.isReady);
  const isLoading = useAuthStore((s) => s.isLoading);
  return !isReady || isLoading;
};
export const useAuthError = () => useAuthStore((s) => s.error);

// ============================================================================
// Hydration Hook - For backwards compatibility
// ============================================================================

export function useAuthHydration() {
  return useAuthInit();
}

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
  const { isAuthenticated, isLoading, isReady } = useAuth();

  useEffect(() => {
    if (isReady && !isLoading && !isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isReady, isLoading, isAuthenticated, redirectTo, router]);

  // Show fallback while loading
  if (!isReady || isLoading) {
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
  const { isAuthenticated, isLoading, isReady } = useAuth();

  useEffect(() => {
    if (isReady && !isLoading && isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isReady, isLoading, isAuthenticated, redirectTo, router]);

  // Show fallback while loading
  if (!isReady || isLoading) {
    return <>{fallback}</>;
  }

  // Authenticated - will redirect
  if (isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
