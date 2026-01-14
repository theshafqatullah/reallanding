import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";
import { Models, ID, OAuthProvider, AppwriteException } from "appwrite";
import { account } from "@/services/appwrite";
import { User, UserType, AuthState, AuthStore } from "@/types/auth";
import { deriveUserRole } from "@/lib/auth-utils";

// ============================================================================
// Types & Interfaces
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

export interface UpdateProfileParams {
  name?: string;
  email?: string;
  password?: string;
  oldPassword?: string;
}

export interface AuthActions {
  // Core Auth Actions
  signUp: (credentials: SignUpCredentials) => Promise<User>;
  signIn: (credentials: SignInCredentials) => Promise<Models.Session>;
  signOut: () => Promise<void>;
  signOutAllSessions: () => Promise<void>;
  
  // OAuth Actions
  signInWithGoogle: (successUrl?: string, failureUrl?: string) => void;
  signInWithGithub: (successUrl?: string, failureUrl?: string) => void;
  signInWithOAuth: (provider: OAuthProvider, successUrl?: string, failureUrl?: string) => void;
  
  // Session Management
  getCurrentUser: () => Promise<User | null>;
  getCurrentSession: () => Promise<Models.Session | null>;
  refreshSession: () => Promise<Models.Session | null>;
  listSessions: () => Promise<Models.SessionList>;
  deleteSession: (sessionId: string) => Promise<void>;
  
  // Password Recovery
  requestPasswordRecovery: (params: PasswordRecoveryParams) => Promise<Models.Token>;
  confirmPasswordRecovery: (params: ResetPasswordParams) => Promise<Models.Token>;
  
  // Email Verification
  sendVerificationEmail: (redirectUrl: string) => Promise<Models.Token>;
  confirmEmailVerification: (userId: string, secret: string) => Promise<Models.Token>;
  
  // Profile Updates
  updateName: (name: string) => Promise<User>;
  updateEmail: (email: string, password: string) => Promise<User>;
  updatePassword: (password: string, oldPassword?: string) => Promise<User>;
  updatePreferences: (prefs: Models.Preferences) => Promise<User>;
  getPreferences: () => Promise<Models.Preferences>;
  
  // State Management
  initialize: () => Promise<void>;
  setUser: (user: User | null) => void;
  setSession: (session: Models.Session | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export type AuthStoreState = AuthState & AuthActions;

// ============================================================================
// Initial State
// ============================================================================

const initialState: AuthState = {
  user: null,
  session: null,
  isAuthenticated: false,
  loading: true, // Start with loading true for initial auth check
  error: null,
  userType: null,
};

// Track initialization to prevent multiple calls
let isInitializing = false;
let isInitialized = false;

// ============================================================================
// Error Handling Utility
// ============================================================================

const handleAuthError = (error: unknown): string => {
  if (error instanceof AppwriteException) {
    // Handle specific Appwrite error codes
    switch (error.code) {
      case 401:
        return "Invalid credentials. Please check your email and password.";
      case 404:
        return "Account not found. Please sign up first.";
      case 409:
        return "An account with this email already exists.";
      case 429:
        return "Too many attempts. Please try again later.";
      case 500:
        return "Server error. Please try again later.";
      default:
        return error.message || "An authentication error occurred.";
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return "An unexpected error occurred.";
};

// ============================================================================
// Auth Store
// ============================================================================

export const useAuthStore = create<AuthStoreState>()(
  devtools(
    immer((set, get) => ({
      // Initial State
      ...initialState,

        // ====================================================================
        // State Setters
        // ====================================================================
        
        setUser: (user) =>
          set((state) => {
            state.user = user;
            state.isAuthenticated = !!user;
            state.userType = deriveUserRole(user);
          }),

        setSession: (session) =>
          set((state) => {
            state.session = session;
          }),

        setLoading: (loading) =>
          set((state) => {
            state.loading = loading;
          }),

        setError: (error) =>
          set((state) => {
            state.error = error;
          }),

        clearError: () =>
          set((state) => {
            state.error = null;
          }),

        reset: () => {
          // Reset initialization flags so next login can reinitialize
          isInitialized = false;
          set((state) => {
            state.user = null;
            state.session = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            state.userType = null;
          });
        },

        // ====================================================================
        // Initialization
        // ====================================================================

        initialize: async () => {
          // Prevent multiple simultaneous initializations
          if (isInitializing) {
            // Wait for the current initialization to complete
            return new Promise<void>((resolve) => {
              const checkInterval = setInterval(() => {
                if (!isInitializing) {
                  clearInterval(checkInterval);
                  resolve();
                }
              }, 50);
            });
          }

          // If already initialized, just ensure loading is false
          if (isInitialized) {
            const { setLoading } = get();
            setLoading(false);
            return;
          }

          isInitializing = true;
          const { setUser, setSession, setLoading, setError, reset } = get();
          
          try {
            // Try to get current user and session
            const [user, session] = await Promise.all([
              account.get().catch(() => null),
              account.getSession({ sessionId: "current" }).catch(() => null),
            ]);

            if (user && session) {
              setUser(user as User);
              setSession(session);
            } else {
              // No valid session - reset to unauthenticated state
              set((state) => {
                state.user = null;
                state.session = null;
                state.isAuthenticated = false;
                state.userType = null;
                state.error = null;
              });
            }
          } catch (error) {
            console.error("Auth initialization error:", error);
            // Reset to unauthenticated state on error
            set((state) => {
              state.user = null;
              state.session = null;
              state.isAuthenticated = false;
              state.userType = null;
              state.error = null;
            });
          } finally {
            setLoading(false);
            isInitializing = false;
            isInitialized = true;
          }
        },

        // ====================================================================
        // Core Authentication
        // ====================================================================

        signUp: async (credentials) => {
          const { setUser, setSession, setLoading, setError, clearError } = get();
          
          setLoading(true);
          clearError();

          try {
            // Create user account
            const user = await account.create({
              userId: ID.unique(),
              email: credentials.email,
              password: credentials.password,
              name: credentials.name,
            });

            // Automatically sign in after registration
            const session = await account.createEmailPasswordSession({
              email: credentials.email,
              password: credentials.password,
            });

            // Get full user object after session creation
            const fullUser = await account.get();

            setUser(fullUser as User);
            setSession(session);
            setLoading(false);

            return fullUser as User;
          } catch (error) {
            const errorMessage = handleAuthError(error);
            setError(errorMessage);
            setLoading(false);
            throw new Error(errorMessage);
          }
        },

        signIn: async (credentials) => {
          const { setUser, setSession, setLoading, setError, clearError } = get();
          
          setLoading(true);
          clearError();

          try {
            const session = await account.createEmailPasswordSession({
              email: credentials.email,
              password: credentials.password,
            });

            const user = await account.get();

            setUser(user as User);
            setSession(session);
            setLoading(false);

            return session;
          } catch (error) {
            const errorMessage = handleAuthError(error);
            setError(errorMessage);
            setLoading(false);
            throw new Error(errorMessage);
          }
        },

        signOut: async () => {
          const { reset, setLoading, setError, clearError } = get();
          
          setLoading(true);
          clearError();

          try {
            await account.deleteSession("current");
            reset();
          } catch (error) {
            const errorMessage = handleAuthError(error);
            setError(errorMessage);
            setLoading(false);
            // Still reset even if logout fails on server
            reset();
            throw new Error(errorMessage);
          }
        },

        signOutAllSessions: async () => {
          const { reset, setLoading, setError, clearError } = get();
          
          setLoading(true);
          clearError();

          try {
            await account.deleteSessions();
            reset();
          } catch (error) {
            const errorMessage = handleAuthError(error);
            setError(errorMessage);
            setLoading(false);
            reset();
            throw new Error(errorMessage);
          }
        },

        // ====================================================================
        // OAuth Authentication
        // ====================================================================

        signInWithGoogle: (successUrl, failureUrl) => {
          const { signInWithOAuth } = get();
          signInWithOAuth(OAuthProvider.Google, successUrl, failureUrl);
        },

        signInWithGithub: (successUrl, failureUrl) => {
          const { signInWithOAuth } = get();
          signInWithOAuth(OAuthProvider.Github, successUrl, failureUrl);
        },

        signInWithOAuth: (provider, successUrl, failureUrl) => {
          const defaultSuccessUrl = typeof window !== "undefined" 
            ? `${window.location.origin}/` 
            : "/";
          const defaultFailureUrl = typeof window !== "undefined" 
            ? `${window.location.origin}/signin` 
            : "/signin";

          account.createOAuth2Session({
            provider,
            success: successUrl || defaultSuccessUrl,
            failure: failureUrl || defaultFailureUrl,
          });
        },

        // ====================================================================
        // Session Management
        // ====================================================================

        getCurrentUser: async () => {
          const { setUser, setLoading, clearError } = get();
          
          setLoading(true);
          clearError();

          try {
            const user = await account.get();
            setUser(user as User);
            setLoading(false);
            return user as User;
          } catch {
            setUser(null);
            setLoading(false);
            return null;
          }
        },

        getCurrentSession: async () => {
          const { setSession, setLoading } = get();
          
          setLoading(true);

          try {
            const session = await account.getSession({ sessionId: "current" });
            setSession(session);
            setLoading(false);
            return session;
          } catch {
            setSession(null);
            setLoading(false);
            return null;
          }
        },

        refreshSession: async () => {
          const { setSession, setLoading, setError, clearError } = get();
          
          setLoading(true);
          clearError();

          try {
            const session = await account.updateSession({ sessionId: "current" });
            setSession(session);
            setLoading(false);
            return session;
          } catch (error) {
            const errorMessage = handleAuthError(error);
            setError(errorMessage);
            setLoading(false);
            return null;
          }
        },

        listSessions: async () => {
          try {
            return await account.listSessions();
          } catch (error) {
            const errorMessage = handleAuthError(error);
            throw new Error(errorMessage);
          }
        },

        deleteSession: async (sessionId) => {
          const { setLoading, setError, clearError } = get();
          
          setLoading(true);
          clearError();

          try {
            await account.deleteSession({ sessionId });
            setLoading(false);
          } catch (error) {
            const errorMessage = handleAuthError(error);
            setError(errorMessage);
            setLoading(false);
            throw new Error(errorMessage);
          }
        },

        // ====================================================================
        // Password Recovery
        // ====================================================================

        requestPasswordRecovery: async ({ email, redirectUrl }) => {
          const { setLoading, setError, clearError } = get();
          
          setLoading(true);
          clearError();

          try {
            const token = await account.createRecovery({
              email,
              url: redirectUrl,
            });
            setLoading(false);
            return token;
          } catch (error) {
            const errorMessage = handleAuthError(error);
            setError(errorMessage);
            setLoading(false);
            throw new Error(errorMessage);
          }
        },

        confirmPasswordRecovery: async ({ userId, secret, password }) => {
          const { setLoading, setError, clearError } = get();
          
          setLoading(true);
          clearError();

          try {
            const token = await account.updateRecovery({
              userId,
              secret,
              password,
            });
            setLoading(false);
            return token;
          } catch (error) {
            const errorMessage = handleAuthError(error);
            setError(errorMessage);
            setLoading(false);
            throw new Error(errorMessage);
          }
        },

        // ====================================================================
        // Email Verification
        // ====================================================================

        sendVerificationEmail: async (redirectUrl) => {
          const { setLoading, setError, clearError } = get();
          
          setLoading(true);
          clearError();

          try {
            const token = await account.createVerification({
              url: redirectUrl,
            });
            setLoading(false);
            return token;
          } catch (error) {
            const errorMessage = handleAuthError(error);
            setError(errorMessage);
            setLoading(false);
            throw new Error(errorMessage);
          }
        },

        confirmEmailVerification: async (userId, secret) => {
          const { setLoading, setError, clearError, getCurrentUser } = get();
          
          setLoading(true);
          clearError();

          try {
            const token = await account.updateVerification({
              userId,
              secret,
            });
            // Refresh user data after verification
            await getCurrentUser();
            setLoading(false);
            return token;
          } catch (error) {
            const errorMessage = handleAuthError(error);
            setError(errorMessage);
            setLoading(false);
            throw new Error(errorMessage);
          }
        },

        // ====================================================================
        // Profile Updates
        // ====================================================================

        updateName: async (name) => {
          const { setUser, setLoading, setError, clearError } = get();
          
          setLoading(true);
          clearError();

          try {
            const user = await account.updateName({ name });
            setUser(user as User);
            setLoading(false);
            return user as User;
          } catch (error) {
            const errorMessage = handleAuthError(error);
            setError(errorMessage);
            setLoading(false);
            throw new Error(errorMessage);
          }
        },

        updateEmail: async (email, password) => {
          const { setUser, setLoading, setError, clearError } = get();
          
          setLoading(true);
          clearError();

          try {
            const user = await account.updateEmail({ email, password });
            setUser(user as User);
            setLoading(false);
            return user as User;
          } catch (error) {
            const errorMessage = handleAuthError(error);
            setError(errorMessage);
            setLoading(false);
            throw new Error(errorMessage);
          }
        },

        updatePassword: async (password, oldPassword) => {
          const { setUser, setLoading, setError, clearError } = get();
          
          setLoading(true);
          clearError();

          try {
            const user = await account.updatePassword({ password, oldPassword });
            setUser(user as User);
            setLoading(false);
            return user as User;
          } catch (error) {
            const errorMessage = handleAuthError(error);
            setError(errorMessage);
            setLoading(false);
            throw new Error(errorMessage);
          }
        },

        updatePreferences: async (prefs) => {
          const { setUser, setLoading, setError, clearError } = get();
          
          setLoading(true);
          clearError();

          try {
            const user = await account.updatePrefs({ prefs });
            setUser(user as User);
            setLoading(false);
            return user as User;
          } catch (error) {
            const errorMessage = handleAuthError(error);
            setError(errorMessage);
            setLoading(false);
            throw new Error(errorMessage);
          }
        },

        getPreferences: async () => {
          const { setLoading, setError, clearError } = get();
          
          setLoading(true);
          clearError();

          try {
            const prefs = await account.getPrefs();
            setLoading(false);
            return prefs;
          } catch (error) {
            const errorMessage = handleAuthError(error);
            setError(errorMessage);
            setLoading(false);
            throw new Error(errorMessage);
          }
        },
      })),
    { name: "AuthStore" }
  )
);

// ============================================================================
// Selector Hooks for Performance Optimization
// ============================================================================

export const useUser = () => useAuthStore((state) => state.user);
export const useSession = () => useAuthStore((state) => state.session);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.loading);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useUserType = () => useAuthStore((state) => state.userType);

// Compound selectors - using useShallow to prevent infinite loops
export const useAuthStatus = () =>
  useAuthStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
      loading: state.loading,
      user: state.user,
    }))
  );

export const useAuthActions = () =>
  useAuthStore(
    useShallow((state) => ({
      signUp: state.signUp,
      signIn: state.signIn,
      signOut: state.signOut,
      signOutAllSessions: state.signOutAllSessions,
      signInWithGoogle: state.signInWithGoogle,
      signInWithGithub: state.signInWithGithub,
      signInWithOAuth: state.signInWithOAuth,
      getCurrentUser: state.getCurrentUser,
      getCurrentSession: state.getCurrentSession,
      refreshSession: state.refreshSession,
      listSessions: state.listSessions,
      deleteSession: state.deleteSession,
      requestPasswordRecovery: state.requestPasswordRecovery,
      confirmPasswordRecovery: state.confirmPasswordRecovery,
      sendVerificationEmail: state.sendVerificationEmail,
      confirmEmailVerification: state.confirmEmailVerification,
      updateName: state.updateName,
      updateEmail: state.updateEmail,
      updatePassword: state.updatePassword,
      updatePreferences: state.updatePreferences,
      getPreferences: state.getPreferences,
      initialize: state.initialize,
      clearError: state.clearError,
      reset: state.reset,
    }))
  );

// ============================================================================
// Re-exports from other modules
// ============================================================================

// Export useAuth hook and related utilities
export { 
  useAuth, 
  useRequireAuth, 
  useRedirectIfAuthenticated, 
  useAuthRole,
  useAuthStatusOnly,
} from "./useAuth";

// Export Provider and Guard components
export { 
  AuthProvider, 
  AuthGuard, 
  GuestGuard, 
  RoleGuard,
  useAuthContext,
} from "./AuthProvider";

// ============================================================================
// Export Default
// ============================================================================

export default useAuthStore;
