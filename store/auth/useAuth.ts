/**
 * Consolidated Authentication Hook with Zustand Persistence
 * 
 * This file contains all authentication logic following Appwrite Web SDK best practices:
 * - Client-side authentication using Appwrite Client SDK
 * - Session persistence using Zustand middleware (localStorage)
 * - All utility functions (formatAuthError, deriveUserType) included
 * - Proper error handling with user-friendly messages
 * - SSR-safe implementation with window checks
 * 
 * Appwrite SDK automatically stores sessions - the Zustand persist middleware
 * provides additional app-level state persistence across page reloads.
 * 
 * @see https://appwrite.io/docs/products/auth/quick-start
 * @see https://appwrite.io/docs/references/cloud/client-web/account
 */

"use client";

import { useCallback, useEffect } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ID, OAuthProvider, type AppwriteException } from "appwrite";
import { account } from "@/services/appwrite";
import type { Models } from "appwrite";

// =====================
// Utility Functions
// =====================

/**
 * Format Appwrite errors into user-friendly messages
 */
function formatAuthError(error: unknown): string {
  // Type guard for Appwrite exceptions
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    "type" in error &&
    "message" in error
  ) {
    const appwriteError = error as AppwriteException;
    
    // Map common error codes to friendly messages
    switch (appwriteError.code) {
      case 401:
        if (appwriteError.type === "user_invalid_credentials") {
          return "Invalid email or password";
        }
        if (appwriteError.type === "user_session_not_found") {
          return "Session expired. Please sign in again";
        }
        return "Authentication failed. Please try again";
      
      case 409:
        if (appwriteError.type === "user_already_exists") {
          return "An account with this email already exists";
        }
        return "Conflict error. Please try again";
      
      case 429:
        return "Too many requests. Please try again later";
      
      case 400:
        if (appwriteError.message.includes("password")) {
          return "Password must be at least 8 characters";
        }
        if (appwriteError.message.includes("email")) {
          return "Please enter a valid email address";
        }
        return appwriteError.message || "Invalid request";
      
      default:
        return appwriteError.message || "An error occurred. Please try again";
    }
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Fallback for unknown errors
  return "An unexpected error occurred. Please try again";
}

/**
 * Derive user type - simplified to always return 'user'
 */
function deriveUserType(): "user" {
  return "user";
}

// =====================
// Types
// =====================
type BaseUser = Models.User<Models.Preferences>;
type Session = Models.Session;
type UserType = "agent" | "agency" | "user";

interface SignUpMetadata {
  name?: string;
}

interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  prefs?: Record<string, unknown>;
}

interface AuthState {
  user: BaseUser | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  userType: UserType | null;
}

interface AuthActions {
  setUser: (user: BaseUser | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetAuth: () => void;
  hydrateFromSession: (user: BaseUser, session: Session) => void;
}

type AuthStore = AuthState & AuthActions;

// =====================
// Zustand Store with Persistence
// =====================
const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial State
      user: null,
      session: null,
      loading: true,
      error: null,
      isAuthenticated: false,
      userType: null,

      // Actions
      setUser: (user) =>
        set({
          user,
          userType: user ? deriveUserType() : null,
          isAuthenticated: !!user,
        }),

      setSession: (session) => set({ session }),

      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error }),

      resetAuth: () =>
        set({
          user: null,
          session: null,
          loading: false,
          error: null,
          isAuthenticated: false,
          userType: null,
        }),

      hydrateFromSession: (user, session) =>
        set({
          user,
          session,
          loading: false,
          error: null,
          isAuthenticated: true,
          userType: deriveUserType(),
        }),
    }),
    {
      name: "reallanding-auth-storage",
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
        userType: state.userType,
      }),
    }
  )
);

// =====================
// useAuth Hook
// =====================
export function useAuth() {
  const {
    user,
    session,
    loading,
    error,
    isAuthenticated,
    userType,
    setUser,
    setSession,
    setLoading,
    setError,
    resetAuth,
    hydrateFromSession,
  } = useAuthStore();

  // =====================
  // Initialize Auth State
  // =====================
  const initializeAuth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('[AUTH] Initializing auth state...');
      
      // Try to get current user from Appwrite
      const currentUser = await account.get();
      const currentSession = await account.getSession('current');
      
      console.log('[AUTH] Found existing session:', currentSession.$id);
      
      // Only hydrate if we got valid data
      if (currentUser && currentSession) {
        hydrateFromSession(currentUser, currentSession);
        console.log('[AUTH] Auth state initialized successfully');
      } else {
        console.log('[AUTH] No valid session found, resetting auth');
        resetAuth();
      }
    } catch (error) {
      console.log('[AUTH] No active session, resetting auth state');
      // No active session in Appwrite - reset auth state
      resetAuth();
    }
  }, [setLoading, setError, hydrateFromSession, resetAuth]);

  // =====================
  // Initialize on Mount - Only if not already authenticated
  // =====================
  useEffect(() => {
    console.log('[AUTH] useEffect running, user:', user ? 'exists' : 'null');
    // Only initialize if we don't already have a user from persisted state
    // This prevents overriding the Zustand persisted state unnecessarily
    if (!user) {
      console.log('[AUTH] No persisted user, calling initializeAuth');
      initializeAuth();
    } else {
      // We have persisted state, just set loading to false
      console.log('[AUTH] Using persisted user:', user.$id);
      setLoading(false);
    }
  }, []); // Empty deps - only run once on mount

  // =====================
  // Sign In
  // =====================
  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('[AUTH] Starting sign in...');
        
        // Create session - this returns the session object
        const session = await account.createEmailPasswordSession({ email, password });
        console.log('[AUTH] Session created:', session.$id);
        
        // Get user data - the session should now be stored by Appwrite SDK
        const currentUser = await account.get();
        console.log('[AUTH] User fetched:', currentUser.$id);
        
        // Hydrate state with user and session
        hydrateFromSession(currentUser, session);
        console.log('[AUTH] State hydrated successfully');
        
        return { success: true };
      } catch (err) {
        console.error('[AUTH] Sign in error:', err);
        const errorMessage = formatAuthError(err);
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [setLoading, setError, hydrateFromSession]
  );

  // =====================
  // Sign Up
  // =====================
  const signUp = useCallback(
    async (email: string, password: string, metadata?: SignUpMetadata) => {
      try {
        setLoading(true);
        setError(null);
        
        // Create account
        await account.create({
          userId: ID.unique(),
          email,
          password,
          name: metadata?.name,
        });

        // Auto sign in after signup - this returns the session
        const session = await account.createEmailPasswordSession({ email, password });
        
        // Get user data
        const currentUser = await account.get();
        
        // Hydrate state with user and session
        hydrateFromSession(currentUser, session);
        return { success: true };
      } catch (err) {
        const errorMessage = formatAuthError(err);
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [setLoading, setError, hydrateFromSession]
  );

  // =====================
  // Sign Out
  // =====================
  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await account.deleteSession('current');
      resetAuth();
      return { success: true };
    } catch (err) {
      // Even if delete fails, reset auth locally
      resetAuth();
      return { success: true };
    }
  }, [setLoading, setError, resetAuth]);

  // =====================
  // Forgot Password
  // =====================
  const forgotPassword = useCallback(
    async (email: string, redirectUrl?: string) => {
      try {
        setLoading(true);
        setError(null);
        const url = redirectUrl || `${typeof window !== 'undefined' ? window.location.origin : ''}/reset-password`;
        await account.createRecovery({ email, url });
        setLoading(false);
        return { success: true };
      } catch (err) {
        const errorMessage = formatAuthError(err);
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [setLoading, setError]
  );

  // =====================
  // Reset Password
  // =====================
  const resetPassword = useCallback(
    async (userId: string, secret: string, newPassword: string) => {
      try {
        setLoading(true);
        setError(null);
        await account.updateRecovery({
          userId,
          secret,
          password: newPassword,
        });
        setLoading(false);
        return { success: true };
      } catch (err) {
        const errorMessage = formatAuthError(err);
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [setLoading, setError]
  );

  // =====================
  // Refresh User
  // =====================
  const refreshUser = useCallback(async () => {
    try {
      setLoading(true);
      const currentUser = await account.get();
      setUser(currentUser);
      setLoading(false);
      return { success: true, user: currentUser };
    } catch (err) {
      const errorMessage = formatAuthError(err);
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [setLoading, setUser, setError]);

  // =====================
  // Get Session
  // =====================
  const getSession = useCallback(async () => {
    try {
      const currentSession = await account.getSession('current');
      setSession(currentSession);
      return { success: true, session: currentSession };
    } catch (err) {
      const errorMessage = formatAuthError(err);
      return { success: false, error: errorMessage };
    }
  }, [setSession]);

  // =====================
  // Update User
  // =====================
  const updateUser = useCallback(
    async (data: UpdateUserData) => {
      try {
        setLoading(true);
        setError(null);

        // Update name if provided
        if (data.name) {
          await account.updateName({ name: data.name });
        }

        // Update email if provided (requires password)
        if (data.email && data.password) {
          await account.updateEmail({ email: data.email, password: data.password });
        }

        // Update phone if provided (requires password)
        if (data.phone && data.password) {
          await account.updatePhone({ phone: data.phone, password: data.password });
        }

        // Update preferences if provided
        if (data.prefs) {
          await account.updatePrefs({ prefs: data.prefs });
        }

        // Refresh user data
        const updatedUser = await account.get();
        setUser(updatedUser);
        setLoading(false);
        
        return { success: true, user: updatedUser };
      } catch (err) {
        const errorMessage = formatAuthError(err);
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [setLoading, setError, setUser]
  );

  // =====================
  // Update Password
  // =====================
  const updatePassword = useCallback(
    async (newPassword: string, oldPassword: string) => {
      try {
        setLoading(true);
        setError(null);
        await account.updatePassword({ password: newPassword, oldPassword });
        setLoading(false);
        return { success: true };
      } catch (err) {
        const errorMessage = formatAuthError(err);
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [setLoading, setError]
  );

  // =====================
  // OAuth Sign In
  // =====================
  const signInWithOAuth = useCallback(
    (provider: OAuthProvider, successUrl?: string, failureUrl?: string) => {
      const success = successUrl || `${typeof window !== 'undefined' ? window.location.origin : ''}/`;
      const failure = failureUrl || `${typeof window !== 'undefined' ? window.location.origin : ''}/signin`;
      account.createOAuth2Session({
        provider,
        success,
        failure,
      });
    },
    []
  );

  // =====================
  // Sign In with Google
  // =====================
  const signInWithGoogle = useCallback(
    (successUrl?: string, failureUrl?: string) => {
      signInWithOAuth(OAuthProvider.Google, successUrl, failureUrl);
    },
    [signInWithOAuth]
  );

  // =====================
  // Sign In with Facebook
  // =====================
  const signInWithFacebook = useCallback(
    (successUrl?: string, failureUrl?: string) => {
      signInWithOAuth(OAuthProvider.Facebook, successUrl, failureUrl);
    },
    [signInWithOAuth]
  );

  // =====================
  // Clear Auth Error
  // =====================
  const clearAuthError = useCallback(() => {
    setError(null);
  }, [setError]);

  // =====================
  // Send Email Verification
  // =====================
  const sendEmailVerification = useCallback(
    async (redirectUrl?: string) => {
      try {
        setLoading(true);
        setError(null);
        const url = redirectUrl || `${typeof window !== 'undefined' ? window.location.origin : ''}/verify-email`;
        await account.createVerification({ url });
        setLoading(false);
        return { success: true };
      } catch (err) {
        const errorMessage = formatAuthError(err);
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [setLoading, setError]
  );

  // =====================
  // Verify Email
  // =====================
  const verifyEmail = useCallback(
    async (userId: string, secret: string) => {
      try {
        setLoading(true);
        setError(null);
        await account.updateEmailVerification({ userId, secret });
        await refreshUser();
        return { success: true };
      } catch (err) {
        const errorMessage = formatAuthError(err);
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [setLoading, setError, refreshUser]
  );

  // =====================
  // Delete All Sessions (Logout Everywhere)
  // =====================
  const signOutAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await account.deleteSessions();
      resetAuth();
      return { success: true };
    } catch (err) {
      const errorMessage = formatAuthError(err);
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [setLoading, setError, resetAuth]);

  // =====================
  // Get User Preferences
  // =====================
  const getPreferences = useCallback(async () => {
    try {
      const prefs = await account.getPrefs();
      return { success: true, prefs };
    } catch (err) {
      const errorMessage = formatAuthError(err);
      return { success: false, error: errorMessage };
    }
  }, []);

  // =====================
  // Update User Preferences
  // =====================
  // Update User Preferences
  // =====================
  const updatePreferences = useCallback(
    async (prefs: Record<string, unknown>) => {
      try {
        setLoading(true);
        setError(null);
        const result = await account.updatePrefs({ prefs });
        setLoading(false);
        return { success: true, prefs: result };
      } catch (err) {
        const errorMessage = formatAuthError(err);
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [setLoading, setError]
  );

  // =====================
  // Return Hook Values
  // =====================
  return {
    // State
    user,
    session,
    loading,
    error,
    isAuthenticated,
    userType,

    // Auth Functions
    signIn,
    signUp,
    signOut,
    signOutAll,
    forgotPassword,
    resetPassword,
    refreshUser,
    getSession,
    updateUser,
    updatePassword,
    clearAuthError,

    // OAuth Functions
    signInWithOAuth,
    signInWithGoogle,
    signInWithFacebook,

    // Email Verification
    sendEmailVerification,
    verifyEmail,

    // Preferences
    getPreferences,
    updatePreferences,

    // Re-initialize
    initializeAuth,
  };
}
