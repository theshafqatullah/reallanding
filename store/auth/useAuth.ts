"use client";

import { useCallback, useEffect } from "react";
import { ID, OAuthProvider } from "appwrite";
import { account } from "@/services/appwrite";
import { useAuthStore } from "./store";
import { formatAuthError, getAgentData, getAgencyData } from "./utils";
import type { SignUpMetadata, UpdateUserData } from "./types";

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
  // Derived Role Data
  // =====================
  const agent = getAgentData(user);
  const agency = getAgencyData(user);

  // =====================
  // Initialize Auth State
  // =====================
  const initializeAuth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const currentUser = await account.get();
      const currentSession = await account.getSession({ sessionId: "current" });
      hydrateFromSession(currentUser, currentSession);
    } catch (error) {
      // No active session or error - reset auth state
      console.log("No active session found:", error);
      resetAuth();
    }
  }, [setLoading, setError, hydrateFromSession, resetAuth]);

  // =====================
  // Sign In
  // =====================
  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        setError(null);
        
        // Create session - this stores the session in the SDK (cookie or localStorage)
        const session = await account.createEmailPasswordSession({ email, password });
        
        // Get user info using the active session
        const user = await account.get();
        
        hydrateFromSession(user, session);
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

        // Auto sign in after signup
        const session = await account.createEmailPasswordSession({ email, password });
        const user = await account.get();
        hydrateFromSession(user, session);
        
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
      await account.deleteSession({ sessionId: "current" });
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
        const url = redirectUrl || `${window.location.origin}/reset-password`;
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
      const currentSession = await account.getSession({ sessionId: "current" });
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
      const success = successUrl || `${window.location.origin}/`;
      const failure = failureUrl || `${window.location.origin}/signin`;
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
        const url = redirectUrl || `${window.location.origin}/verify-email`;
        await account.createEmailVerification({ url });
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
  // Initialize on Mount
  // =====================
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

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

    // Derived Role Data
    agent,
    agency,

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
