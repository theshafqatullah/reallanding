import { create } from "zustand";
import type { AuthStore, BaseUser, Session } from "./types";
import { deriveUserType } from "./utils";

// =====================
// Initial State
// =====================
const initialState = {
  user: null,
  session: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  userType: null,
};

// =====================
// Auth Store
// =====================
export const useAuthStore = create<AuthStore>((set) => ({
  ...initialState,

  setUser: (user: BaseUser | null) =>
    set({
      user,
      userType: user ? deriveUserType(user.labels || []) : null,
      isAuthenticated: !!user,
    }),

  setSession: (session: Session | null) =>
    set({ session }),

  setLoading: (loading: boolean) =>
    set({ loading }),

  setError: (error: string | null) =>
    set({ error }),

  setAuthenticated: (isAuthenticated: boolean) =>
    set({ isAuthenticated }),

  resetAuth: () =>
    set({ ...initialState, loading: false }),

  hydrateFromSession: (user: BaseUser, session: Session) =>
    set({
      user,
      session,
      loading: false,
      error: null,
      isAuthenticated: true,
      userType: deriveUserType(user.labels || []),
    }),
}));
