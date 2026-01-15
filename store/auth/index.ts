// Main auth store
export {
  useAuthStore,
  useUser,
  useSession,
  useIsAuthenticated,
  useAuthLoading,
  useAuthError,
  useUserType,
} from "./auth-store";

export type {
  SignUpCredentials,
  SignInCredentials,
  PasswordRecoveryParams,
  ResetPasswordParams,
} from "./auth-store";

// useAuth hook
export {
  useAuth,
  useRequireAuth,
  useRedirectIfAuthenticated,
} from "./use-auth";

// Guard components
export { AuthGuard, GuestGuard } from "./guards";
