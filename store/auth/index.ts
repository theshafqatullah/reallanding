// =====================
// Auth Module Exports
// =====================

// Hook
export { useAuth } from "./useAuth";

// Store
export { useAuthStore } from "./store";

// Types
export type {
  BaseUser,
  NormalUser,
  Agent,
  Agency,
  AppUser,
  Session,
  UserType,
  AuthState,
  AuthActions,
  AuthStore,
  SignUpMetadata,
  UpdateUserData,
} from "./types";

// Utils
export {
  deriveUserType,
  isAgent,
  isAgency,
  isNormalUser,
  getAgentData,
  getAgencyData,
  formatAuthError,
  generateUserId,
} from "./utils";
