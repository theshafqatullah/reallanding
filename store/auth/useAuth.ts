// store/auth/useAuth.ts
"use client";

import { create } from "zustand";
import { account } from "@/services/appwrite";
import { ID, OAuthProvider } from "appwrite";
import type { Models } from "appwrite";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Define the shape of our Auth Store
interface AuthState {
  user: Models.User<Models.Preferences> | null;
  session: Models.Session | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  // Core Actions
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  
  // Initialization
  checkAuth: () => Promise<void>;
  
  // OAuth
  signInWithGoogle: (successUrl?: string, failureUrl?: string) => void;
  signInWithFacebook: (successUrl?: string, failureUrl?: string) => void;

  // Password Management
  forgotPassword: (email: string, redirectUrl?: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (userId: string, secret: string, password: string) => Promise<{ success: boolean; error?: string }>;
  
  // State helpers
  clearAuthError: () => void;
}

// Create the Zustand store
const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  user: null,
  session: null,
  loading: true,
  error: null,
  isAuthenticated: false,

  clearAuthError: () => set({ error: null }),

  checkAuth: async () => {
    try {
      // Don't modify loading state drastically to avoid flashing
      // but ensure we are verifying the session
      
      const user = await account.get();
      
      // Optional: Fetch session details for metadata
      let session: Models.Session | null = null;
      try {
        session = await account.getSession('current');
      } catch (e) {
        // Ignore session fetch error if user is already retrieved
      }

      set({ 
        user, 
        session, 
        isAuthenticated: true,
        loading: false, 
        error: null 
      });
    } catch (error: any) {
      // If 401, it means we are just a guest.
      set({ 
        user: null, 
        session: null, 
        isAuthenticated: false,
        loading: false, 
        error: null 
      });
    }
  },

  signIn: async (email, password) => {
    try {
      set({ loading: true, error: null });
      
      await account.createEmailPasswordSession({
          email,
          password
      });
      
      // Verify immediately
      await get().checkAuth();
      return { success: true };
    } catch (error: any) {
      const msg = error?.message || 'Sign in failed';
      set({ 
        loading: false, 
        error: msg,
        isAuthenticated: false
      });
      return { success: false, error: msg };
    }
  },

  signUp: async (email, password, name) => {
    try {
      set({ loading: true, error: null });
      
      await account.create({
          userId: ID.unique(),
          email,
          password,
          name
      });
      
      // Auto login
      return await get().signIn(email, password);
    } catch (error: any) {
      const msg = error?.message || 'Registration failed';
      set({ 
        loading: false, 
        error: msg 
      });
      return { success: false, error: msg };
    }
  },

  signOut: async () => {
    try {
      set({ loading: true });
      await account.deleteSession('current');
    } catch (error) {
      console.warn('[AUTH] Logout warning:', error);
    } finally {
      set({ 
        user: null, 
        session: null, 
        isAuthenticated: false,
        loading: false,
        error: null
      });
    }
  },

  signInWithGoogle: (successUrl?: string, failureUrl?: string) => {
    const success = successUrl || `${typeof window !== 'undefined' ? window.location.origin : ''}/`;
    const failure = failureUrl || `${typeof window !== 'undefined' ? window.location.origin : ''}/signin`;
    account.createOAuth2Session({
      provider: OAuthProvider.Google,
      success,
      failure,
    });
  },

  signInWithFacebook: (successUrl?: string, failureUrl?: string) => {
    const success = successUrl || `${typeof window !== 'undefined' ? window.location.origin : ''}/`;
    const failure = failureUrl || `${typeof window !== 'undefined' ? window.location.origin : ''}/signin`;
    account.createOAuth2Session({
      provider: OAuthProvider.Facebook,
      success,
      failure,
    });
  },

  forgotPassword: async (email: string, redirectUrl?: string) => {
    try {
      set({ loading: true, error: null });
      const url = redirectUrl || `${typeof window !== 'undefined' ? window.location.origin : ''}/reset-password`;
      await account.createRecovery({ email, url });
      set({ loading: false });
      return { success: true };
    } catch (err: any) {
      set({ loading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  resetPassword: async (userId: string, secret: string, password: string) => {
      try {
        set({ loading: true, error: null });
        await account.updateRecovery({
          userId,
          secret,
          password,
        });
        set({ loading: false });
        return { success: true };
      } catch (err: any) {
        set({ loading: false, error: err.message });
        return { success: false, error: err.message };
      }
  }

}));

// Init flag
let isInitialized = false;

// Hook
export const useAuth = () => {
  const store = useAuthStore();
  const router = useRouter();
  
  useEffect(() => {
    if (!isInitialized) {
        store.checkAuth();
        isInitialized = true;
    }
  }, []);

  return {
    ...store,
    // Add compatibility aliases if the UI depends on them
    login: store.signIn,
    register: store.signUp,
    logout: store.signOut,
    init: store.checkAuth,
    // Add userType for safe compatibility
    userType: null as 'agent' | 'agency' | 'user' | null
  };
};

export { useAuthStore };