import { Models } from "appwrite";

// ============================================================================
// User Types & Roles
// ============================================================================

export type UserType = "agency" | "agent" | "user";

export interface UserPreferences extends Models.Preferences {
  theme?: "light" | "dark" | "system";
  language?: string;
  timezone?: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
  [key: string]: unknown;
}

export interface User extends Models.User<UserPreferences> {
  // Add any custom extensions here if needed
}

// ============================================================================
// Auth State
// ============================================================================

export interface AuthState {
  user: User | null;
  session: Models.Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  userType: UserType | null;
}

// ============================================================================
// Legacy AuthStore Interface (for backwards compatibility)
// ============================================================================

export interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setSession: (session: Models.Session | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetAuth: () => void;
  clearAuthError: () => void;
}

// ============================================================================
// Auth Form Types
// ============================================================================

export interface SignInFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms?: boolean;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

// ============================================================================
// Auth Response Types
// ============================================================================

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  session?: Models.Session;
}

export interface AuthError {
  code: number;
  message: string;
  type?: string;
}
