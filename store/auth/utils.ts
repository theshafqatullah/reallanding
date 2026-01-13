import type { BaseUser, UserType } from "./types";

// =====================
// Role Priority: agency > agent > user
// =====================
const ROLE_PRIORITY: UserType[] = ["agency", "agent", "user"];

/**
 * Derives user type from Appwrite labels
 * Priority: agency > agent > user
 */
export function deriveUserType(labels: string[]): UserType {
  for (const role of ROLE_PRIORITY) {
    if (labels.includes(role)) {
      return role;
    }
  }
  return "user";
}

/**
 * Checks if user has agent role
 */
export function isAgent(user: BaseUser | null): boolean {
  if (!user?.labels) return false;
  return user.labels.includes("agent");
}

/**
 * Checks if user has agency role
 */
export function isAgency(user: BaseUser | null): boolean {
  if (!user?.labels) return false;
  return user.labels.includes("agency");
}

/**
 * Checks if user is a normal user (no special roles)
 */
export function isNormalUser(user: BaseUser | null): boolean {
  if (!user?.labels) return true;
  return !user.labels.includes("agent") && !user.labels.includes("agency");
}

/**
 * Extracts agent data if user has agent role
 */
export function getAgentData(user: BaseUser | null): BaseUser | null {
  if (!user || !isAgent(user)) return null;
  return user;
}

/**
 * Extracts agency data if user has agency role
 */
export function getAgencyData(user: BaseUser | null): BaseUser | null {
  if (!user || !isAgency(user)) return null;
  return user;
}

/**
 * Formats Appwrite error message
 */
export function formatAuthError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  if (typeof error === "object" && error !== null) {
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
  }
  return "An unexpected error occurred";
}

/**
 * Generates a unique user ID for Appwrite
 */
export function generateUserId(): string {
  return "unique()";
}
