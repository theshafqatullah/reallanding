import { User } from "@/store/auth";
import { UserType } from "@/types/appwrite";

export function deriveUserRole(user: User | null): UserType | null {
  if (!user) return null;

  const labels = user.labels || [];

  if (labels.includes("agency")) {
    return UserType.AGENCY;
  }

  if (labels.includes("agent")) {
    return UserType.AGENT;
  }

  return UserType.USER;
}
