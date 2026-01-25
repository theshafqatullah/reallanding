import { type Conversations, type Messages } from "@/types/appwrite";
import { type ConversationUI, type MessageUI } from "./types";

/**
 * Format relative time for display
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return "Just now";
  } else if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  } else {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
}

/**
 * Format message timestamp
 */
export function formatMessageTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Format date header for message groups
 */
export function formatDateHeader(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) {
    return "Today";
  } else if (isYesterday) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }
}

/**
 * Transform Appwrite conversation to UI format
 */
export function transformConversation(
  conv: Conversations,
  userId: string,
  participantName?: string,
  participantAvatar?: string | null
): ConversationUI {
  // Parse participants to find the other person
  let participants: string[] = [];
  try {
    participants = conv.participants ? JSON.parse(conv.participants) : [];
  } catch {
    participants = [];
  }

  const isInitiator = conv.initiator_id === userId;
  const otherParticipantId = isInitiator
    ? participants.find((p) => p !== userId) || participants[1] || ""
    : conv.initiator_id;

  // Determine the other participant's name
  let otherName = participantName || "Unknown User";
  if (!participantName) {
    if (isInitiator) {
      // If we're the initiator, the other person's name isn't stored directly
      // It would need to be fetched separately or stored in participants metadata
      otherName = "Agent";
    } else {
      otherName = conv.initiator_name;
    }
  }

  // Determine role display
  const roleDisplay =
    conv.initiator_role === "agent"
      ? "Agent"
      : conv.initiator_role === "agency"
        ? "Agency"
        : "User";

  return {
    id: conv.$id,
    participant: {
      id: otherParticipantId,
      name: otherName,
      avatar: participantAvatar || null,
      role: isInitiator ? roleDisplay : roleDisplay,
      isOnline: false, // Would need real-time presence system
    },
    lastMessage: {
      content: conv.last_message_preview || "No messages yet",
      timestamp: conv.last_message_at || conv.$createdAt,
      isRead: isInitiator
        ? conv.unread_by_initiator === 0
        : conv.unread_count === 0,
      sender: conv.last_message_by === userId ? "me" : "them",
    },
    unreadCount: isInitiator ? conv.unread_by_initiator : conv.unread_count,
    property: conv.property_title || null,
    propertyId: conv.property_id || null,
    isStarred: conv.is_starred || false,
    isMuted: conv.is_muted || false,
    type: (conv.type as unknown as "inquiry" | "general" | "support") || "general",
    subject: conv.subject || null,
  };
}

/**
 * Transform Appwrite message to UI format
 */
export function transformMessage(msg: Messages, userId: string): MessageUI {
  // Map status to valid UI status
  const statusMap: Record<string, "sent" | "delivered" | "read"> = {
    sent: "sent",
    delivered: "delivered",
    read: "read",
  };
  const status = statusMap[String(msg.status)] || "sent";

  // Parse attachments
  let attachments: string[] = [];
  try {
    attachments = msg.attachments ? JSON.parse(msg.attachments) : [];
  } catch {
    attachments = [];
  }

  return {
    id: msg.$id,
    content: msg.content,
    timestamp: msg.$createdAt,
    sender: msg.sender_id === userId ? "me" : "them",
    status,
    senderName: msg.sender_name,
    senderAvatar: msg.sender_avatar_url || undefined,
    propertyInfo: msg.property_id
      ? {
          id: msg.property_id,
          title: msg.property_title || "Property",
          image: msg.property_image_url || undefined,
        }
      : undefined,
    isEdited: msg.is_edited || false,
    replyTo: msg.reply_to_id
      ? {
          id: msg.reply_to_id,
          preview: msg.reply_to_preview || "",
        }
      : undefined,
    attachments: attachments.length > 0 ? attachments : undefined,
  };
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Truncate text to a certain length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}
