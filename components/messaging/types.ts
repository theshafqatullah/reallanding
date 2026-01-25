import { type Conversations, type Messages } from "@/types/appwrite";

// Conversation UI type for display
export interface ConversationUI {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar: string | null;
    role: string;
    isOnline: boolean;
  };
  lastMessage: {
    content: string;
    timestamp: string;
    isRead: boolean;
    sender: "me" | "them";
  };
  unreadCount: number;
  property: string | null;
  propertyId: string | null;
  isStarred: boolean;
  isMuted: boolean;
  type: "inquiry" | "general" | "support";
  subject: string | null;
}

// Message UI type for display
export interface MessageUI {
  id: string;
  content: string;
  timestamp: string;
  sender: "me" | "them";
  status: "sent" | "delivered" | "read";
  senderName?: string;
  senderAvatar?: string;
  propertyInfo?: {
    id: string;
    title: string;
    image?: string;
  };
  isEdited?: boolean;
  replyTo?: {
    id: string;
    preview: string;
  };
  attachments?: string[];
}

// User role type
export type UserRole = "user" | "agent" | "agency" | "admin";

// Participant info type
export interface ParticipantInfo {
  id: string;
  name: string;
  avatar?: string | null;
  role: UserRole;
}
