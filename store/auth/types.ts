import type { Models } from "appwrite";

// =====================
// Base User Type (from Appwrite)
// =====================
export type BaseUser = Models.User<Models.Preferences>;

// =====================
// User Role Types
// =====================
export type UserType = "agent" | "agency" | "user";

export interface NormalUser extends BaseUser {
  userType: "user";
}

export interface Agent extends BaseUser {
  userType: "agent";
}

export interface Agency extends BaseUser {
  userType: "agency";
}

export type AppUser = NormalUser | Agent | Agency;

// =====================
// Session Type
// =====================
export type Session = Models.Session;

// =====================
// Auth State
// =====================
export interface AuthState {
  user: BaseUser | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  userType: UserType | null;
}

// =====================
// Auth Actions
// =====================
export interface AuthActions {
  setUser: (user: BaseUser | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  resetAuth: () => void;
  hydrateFromSession: (user: BaseUser, session: Session) => void;
}

// =====================
// Auth Store (State + Actions)
// =====================
export type AuthStore = AuthState & AuthActions;

// =====================
// Sign Up Metadata
// =====================
export interface SignUpMetadata {
  name?: string;
  [key: string]: unknown;
}

// =====================
// Update User Data
// =====================
export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  prefs?: Record<string, unknown>;
}
