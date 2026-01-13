// store/auth/useAuth.ts
"use client";

import { create } from "zustand";
import { account } from "@/services/appwrite";
import { ID } from "appwrite";
import type { Models } from "appwrite";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Define the shape of our Auth Store
interface AuthState {
  user: Models.User<Models.Preferences> | null;
  session: Models.Session | null;
  userType: 'agent' | 'agency' | 'user' | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>; // Alias
  init: () => Promise<void>;
  
  forgotPassword: (email: string, redirectUrl?: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (userId: string, secret: string, password: string) => Promise<{ success: boolean; error?: string }>;
  clearAuthError: () => void;

  // Setters
  setUser: (user: Models.User<Models.Preferences> | null) => void;
  setSession: (session: Models.Session | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Helper to determine user type
function deriveUserType(user: Models.User<Models.Preferences> | null): 'agent' | 'agency' | 'user' | null {
  if (!user) return null;
  // Logic to determine type based on user labels or prefs can go here.
  // For now, default to 'user'
  return 'user';
}

// Create the Zustand store
// Using vanilla store for the logic, hooks will consume it
const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  user: null,
  session: null,
  userType: null,
  loading: true,
  error: null,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user, userType: deriveUserType(user) }),
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearAuthError: () => set({ error: null }),

  init: async () => {
    try {
      // Don't set loading=true here to avoid flash if we solve it quickly
      // or if we are already loaded. 
      
      // 1. Check for active session
      // This will throw if no session exists (guest)
      const user = await account.get();
      
      // 2. If successful, get the session details (optional)
      let session: Models.Session | null = null;
      try {
        session = await account.getSession('current');
      } catch (e) {
        console.warn('[AUTH] Could not fetch session details', e);
      }

      set({ 
        user, 
        session, 
        userType: deriveUserType(user),
        isAuthenticated: true,
        loading: false, 
        error: null 
      });
      console.log('[AUTH] Initialized user:', user.$id);
    } catch (error: any) {
      // Expected error for guests
      set({ 
        user: null, 
        session: null, 
        userType: null,
        isAuthenticated: false,
        loading: false,
        error: null 
      });
      
      // Only log if it's NOT a 401 (which is normal for guests)
      if (error?.code !== 401 && error?.type !== 'general_unauthorized_scope' && !error?.message?.includes('missing scopes')) {
        console.error('[AUTH] Init error:', error);
      } else {
        console.log('[AUTH] User is guest (no session)');
      }
    }
  },

  login: async (email, password) => {
    try {
      set({ loading: true, error: null });
      
      // 1. Create the session
      const session = await account.createEmailPasswordSession({
          email,
          password
      });
      console.log('[AUTH] Session created:', session.$id);
      
      // 2. Fetch the user details immediately to confirm session validity
      const user = await account.get();
      
      set({ 
        user, 
        session, 
        userType: deriveUserType(user),
        isAuthenticated: true,
        loading: false,
        error: null
      });
      console.log('[AUTH] Login success user:', user.$id);
    } catch (error: any) {
      console.error('[AUTH] Login failed:', error);
      set({ 
        loading: false, 
        error: error.message || 'Login failed',
        isAuthenticated: false
      });
      throw error;
    }
  },

  register: async (email, password, name) => {
    try {
      set({ loading: true, error: null });
      
      // 1. Create the account
      await account.create({
          userId: ID.unique(),
          email,
          password,
          name
      });
      
      // 2. Automatically log them in
      await get().login(email, password);
    } catch (error: any) {
      console.error('[AUTH] Registration failed:', error);
      set({ 
        loading: false, 
        error: error.message || 'Registration failed' 
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      set({ loading: true });
      await account.deleteSession('current');
    } catch (error) {
      console.warn('[AUTH] Logout warning:', error);
    } finally {
      set({ 
        user: null, 
        session: null, 
        userType: null,
        isAuthenticated: false,
        loading: false,
        error: null
      });
    }
  },
  
  signOut: async () => {
     return get().logout();
  },

  forgotPassword: async (email: string, redirectUrl?: string) => {
    try {
      set({ loading: true, error: null });
      const url = redirectUrl || `${typeof window !== 'undefined' ? window.location.origin : ''}/reset-password`;
      await account.createRecovery({ email, url });
      set({ loading: false });
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || "Failed to send reset email";
      set({ loading: false, error: errorMessage });
      return { success: false, error: errorMessage };
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
        // Optionally login immediately? No, let them login manually usually.
        return { success: true };
      } catch (err: any) {
        const errorMessage = err.message || "Failed to reset password";
        set({ loading: false, error: errorMessage });
        return { success: false, error: errorMessage };
      }
  }

}));

// Init flag to prevent double initialization in Strict Mode
let isInitialized = false;

// Export Hook
export const useAuth = () => {
  const store = useAuthStore();
  const router = useRouter();
  
  useEffect(() => {
    if (!isInitialized) {
        store.init();
        isInitialized = true;
    }
  }, []);

  return store;
