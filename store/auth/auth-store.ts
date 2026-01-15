import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { Models, ID, OAuthProvider, AppwriteException } from "appwrite";
import { account } from "@/services/appwrite";
import { User, AuthState } from "@/types/auth";
import { deriveUserRole } from "@/lib/auth-utils";

// ============================================================================
// Types
// ============================================================================

export interface SignUpCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface PasswordRecoveryParams {
  email: string;
  redirectUrl: string;
}

export interface ResetPasswordParams {
  userId: string;
  secret: string;
  password: string;
}

interface AuthActions {
  // Core Auth
  initialize: () => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<User>;
  signIn: (credentials: SignInCredentials) => Promise<Models.Session>;
  signOut: () => Promise<void>;
  
  // OAuth
  signInWithGoogle: (successUrl?: string, failureUrl?: string) => void;
  signInWithGithub: (successUrl?: string, failureUrl?: string) => void;
  signInWithOAuth: (provider: OAuthProvider, successUrl?: string, failureUrl?: string) => void;
  
  // Password Recovery
  requestPasswordRecovery: (params: PasswordRecoveryParams) => Promise<Models.Token>;
  confirmPasswordRecovery: (params: ResetPasswordParams) => Promise<Models.Token>;
  
  // Utils
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

// ============================================================================
// Initial State
// ============================================================================

const initialState: AuthState = {
  user: null,
  session: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  userType: null,
};

// Module-level flag - resets on page reload (which is what we want)
let _isInitialized = false;
let _isInitializing = false;

// ============================================================================
// Error Handler
// ============================================================================

const handleAuthError = (error: unknown): string => {
  if (error instanceof AppwriteException) {
    switch (error.code) {
      case 401:
        if (error.type === "user_invalid_credentials") {
          return "Invalid email or password.";
        }
        return error.message || "Authentication failed.";
      case 404:
        return "Account not found.";
      case 409:
        return "An account with this email already exists.";
      case 429:
        return "Too many attempts. Please try again later.";
      default:
        return error.message || "An error occurred.";
    }
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred.";
};

// ============================================================================
// Store
// ============================================================================

export const useAuthStore = create<AuthStore>()(
  devtools(
    immer((set, get) => ({
      ...initialState,

      // ====================================================================
      // Initialize - Check for existing session
      // ====================================================================
      initialize: async () => {
        // Already initialized or currently initializing
        if (_isInitialized || _isInitializing) {
          return;
        }

        _isInitializing = true;
        set({ loading: true });

        try {
          // Check for existing session via Appwrite cookies
          const session = await account.getSession({ sessionId: "current" });
          
          if (session) {
            const user = await account.get();
            set((state) => {
              state.user = user as User;
              state.session = session;
              state.isAuthenticated = true;
              state.userType = deriveUserRole(user as User);
              state.loading = false;
            });
          } else {
            set((state) => {
              state.user = null;
              state.session = null;
              state.isAuthenticated = false;
              state.userType = null;
              state.loading = false;
            });
          }
        } catch {
          // No session exists - user is not authenticated
          set((state) => {
            state.user = null;
            state.session = null;
            state.isAuthenticated = false;
            state.userType = null;
            state.loading = false;
          });
        } finally {
          _isInitializing = false;
          _isInitialized = true;
        }
      },

      // ====================================================================
      // Sign Up
      // ====================================================================
      signUp: async (credentials) => {
        set({ loading: true, error: null });

        try {
          // Create account
          await account.create({
            userId: ID.unique(),
            email: credentials.email,
            password: credentials.password,
            name: credentials.name,
          });

          // Auto sign in
          const session = await account.createEmailPasswordSession({
            email: credentials.email,
            password: credentials.password,
          });

          // Get user
          const user = await account.get();

          set((state) => {
            state.user = user as User;
            state.session = session;
            state.isAuthenticated = true;
            state.userType = deriveUserRole(user as User);
            state.loading = false;
          });

          return user as User;
        } catch (error) {
          const message = handleAuthError(error);
          set({ error: message, loading: false });
          throw new Error(message);
        }
      },

      // ====================================================================
      // Sign In
      // ====================================================================
      signIn: async (credentials) => {
        set({ loading: true, error: null });

        try {
          const session = await account.createEmailPasswordSession({
            email: credentials.email,
            password: credentials.password,
          });

          // Small delay for cookie to be set
          await new Promise((r) => setTimeout(r, 100));

          const user = await account.get();

          set((state) => {
            state.user = user as User;
            state.session = session;
            state.isAuthenticated = true;
            state.userType = deriveUserRole(user as User);
            state.loading = false;
          });

          return session;
        } catch (error) {
          const message = handleAuthError(error);
          set({ error: message, loading: false });
          throw new Error(message);
        }
      },

      // ====================================================================
      // Sign Out
      // ====================================================================
      signOut: async () => {
        set({ loading: true, error: null });

        try {
          await account.deleteSession({ sessionId: "current" });
        } catch {
          // Ignore errors - session might already be invalid
        } finally {
          // Reset state
          _isInitialized = false;
          set((state) => {
            state.user = null;
            state.session = null;
            state.isAuthenticated = false;
            state.userType = null;
            state.loading = false;
            state.error = null;
          });
        }
      },

      // ====================================================================
      // OAuth
      // ====================================================================
      signInWithGoogle: (successUrl, failureUrl) => {
        get().signInWithOAuth(OAuthProvider.Google, successUrl, failureUrl);
      },

      signInWithGithub: (successUrl, failureUrl) => {
        get().signInWithOAuth(OAuthProvider.Github, successUrl, failureUrl);
      },

      signInWithOAuth: (provider, successUrl, failureUrl) => {
        const success = successUrl || (typeof window !== "undefined" ? window.location.origin : "/");
        const failure = failureUrl || (typeof window !== "undefined" ? `${window.location.origin}/signin` : "/signin");

        account.createOAuth2Session({
          provider,
          success,
          failure,
        });
      },

      // ====================================================================
      // Password Recovery
      // ====================================================================
      requestPasswordRecovery: async ({ email, redirectUrl }) => {
        set({ loading: true, error: null });
        try {
          const token = await account.createRecovery({ email, url: redirectUrl });
          set({ loading: false });
          return token;
        } catch (error) {
          const message = handleAuthError(error);
          set({ error: message, loading: false });
          throw new Error(message);
        }
      },

      confirmPasswordRecovery: async ({ userId, secret, password }) => {
        set({ loading: true, error: null });
        try {
          const token = await account.updateRecovery({ userId, secret, password });
          set({ loading: false });
          return token;
        } catch (error) {
          const message = handleAuthError(error);
          set({ error: message, loading: false });
          throw new Error(message);
        }
      },

      // ====================================================================
      // Utils
      // ====================================================================
      clearError: () => set({ error: null }),
    })),
    { name: "auth-store" }
  )
);

// ============================================================================
// Selector Hooks - Use these in components for better performance
// ============================================================================

export const useUser = () => useAuthStore((s) => s.user);
export const useSession = () => useAuthStore((s) => s.session);
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated);
export const useAuthLoading = () => useAuthStore((s) => s.loading);
export const useAuthError = () => useAuthStore((s) => s.error);
export const useUserType = () => useAuthStore((s) => s.userType);

// ============================================================================
// Initialize store immediately when module loads (client-side only)
// ============================================================================

if (typeof window !== "undefined") {
  useAuthStore.getState().initialize();
}
