import { User, UserType } from "@/types/auth";

export function deriveUserRole(user: User | null): UserType | null {
  if (!user) return null;

  const labels = user.labels || [];

  if (labels.includes("agency")) {
    return "agency";
  }

  if (labels.includes("agent")) {
    return "agent";
  }

  return "user";
}
