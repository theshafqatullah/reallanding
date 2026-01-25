import { databases } from "@/services/appwrite";
import { Query, ID } from "appwrite";
import { type Messages, type Conversations } from "@/types/appwrite";

const DATABASE_ID = "main";
const CONVERSATIONS_COLLECTION_ID = "conversations";
const MESSAGES_COLLECTION_ID = "messages";

export interface CreateConversationData {
  initiator_id: string;
  initiator_name: string;
  initiator_role: "user" | "agent" | "agency" | "admin";
  type: "inquiry" | "general" | "support";
  subject?: string;
  property_id?: string;
  property_title?: string;
  participants?: string[];
}

export interface CreateMessageData {
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: "user" | "agent" | "agency" | "admin";
  sender_avatar_url?: string;
  content: string;
  type?: "text" | "image" | "file" | "system";
  property_id?: string;
  property_title?: string;
  property_image_url?: string;
  reply_to_id?: string;
  reply_to_preview?: string;
  attachments?: string[];
}

export interface ConversationWithDetails extends Conversations {
  participant?: {
    id: string;
    name: string;
    avatar_url?: string;
    role: string;
    is_online?: boolean;
  };
  property?: {
    id: string;
    title: string;
    image_url?: string;
  };
}

export interface MessagesResponse {
  messages: Messages[];
  total: number;
  hasMore: boolean;
}

export interface ConversationsResponse {
  conversations: Conversations[];
  total: number;
  hasMore: boolean;
}

/**
 * Messaging Service - CRUD operations for conversations and messages
 */
export const messagingService = {
  // ==================== CONVERSATIONS ====================

  /**
   * Get all conversations for a user
   */
  async getConversations(
    userId: string,
    options?: {
      limit?: number;
      offset?: number;
      type?: "inquiry" | "general" | "support";
      status?: "active" | "archived" | "resolved";
      search?: string;
    }
  ): Promise<ConversationsResponse> {
    try {
      const queries = [
        Query.or([
          Query.equal("initiator_id", userId),
          Query.contains("participants", userId),
        ]),
        Query.orderDesc("last_message_at"),
      ];

      if (options?.type) {
        queries.push(Query.equal("type", options.type));
      }

      if (options?.status) {
        queries.push(Query.equal("status", options.status));
      }

      if (options?.search) {
        queries.push(
          Query.or([
            Query.contains("subject", options.search),
            Query.contains("last_message_preview", options.search),
            Query.contains("initiator_name", options.search),
          ])
        );
      }

      if (options?.limit) {
        queries.push(Query.limit(options.limit));
      }

      if (options?.offset) {
        queries.push(Query.offset(options.offset));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        CONVERSATIONS_COLLECTION_ID,
        queries
      );

      return {
        conversations: response.documents as unknown as Conversations[],
        total: response.total,
        hasMore:
          (options?.offset || 0) + response.documents.length < response.total,
      };
    } catch (error) {
      console.error("Error fetching conversations:", error);
      throw error;
    }
  },

  /**
   * Get a single conversation by ID
   */
  async getConversation(conversationId: string): Promise<Conversations | null> {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        CONVERSATIONS_COLLECTION_ID,
        conversationId
      );
      return response as unknown as Conversations;
    } catch (error) {
      console.error("Error fetching conversation:", error);
      return null;
    }
  },

  /**
   * Create a new conversation
   */
  async createConversation(data: CreateConversationData): Promise<Conversations> {
    try {
      const now = new Date().toISOString();
      const referenceId = `CONV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const conversationData = {
        initiator_id: data.initiator_id,
        initiator_name: data.initiator_name,
        initiator_role: data.initiator_role,
        type: data.type,
        subject: data.subject || null,
        property_id: data.property_id || null,
        property_title: data.property_title || null,
        participants: data.participants ? JSON.stringify(data.participants) : null,
        reference_id: referenceId,
        status: "active",
        last_message_preview: "",
        last_message_at: now,
        last_message_by: data.initiator_id,
        total_messages: 0,
        unread_count: 0,
        unread_by_initiator: 0,
        is_starred: false,
        is_muted: false,
        started_at: now,
      };

      const response = await databases.createDocument(
        DATABASE_ID,
        CONVERSATIONS_COLLECTION_ID,
        ID.unique(),
        conversationData
      );

      return response as unknown as Conversations;
    } catch (error) {
      console.error("Error creating conversation:", error);
      throw error;
    }
  },

  /**
   * Update a conversation
   */
  async updateConversation(
    conversationId: string,
    data: Partial<Conversations>
  ): Promise<Conversations> {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        CONVERSATIONS_COLLECTION_ID,
        conversationId,
        data
      );
      return response as unknown as Conversations;
    } catch (error) {
      console.error("Error updating conversation:", error);
      throw error;
    }
  },

  /**
   * Archive a conversation
   */
  async archiveConversation(conversationId: string): Promise<void> {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        CONVERSATIONS_COLLECTION_ID,
        conversationId,
        {
          status: "archived",
          archived_at: new Date().toISOString(),
        }
      );
    } catch (error) {
      console.error("Error archiving conversation:", error);
      throw error;
    }
  },

  /**
   * Star/unstar a conversation
   */
  async toggleStar(conversationId: string, starred: boolean): Promise<void> {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        CONVERSATIONS_COLLECTION_ID,
        conversationId,
        { is_starred: starred }
      );
    } catch (error) {
      console.error("Error toggling star:", error);
      throw error;
    }
  },

  /**
   * Mute/unmute a conversation
   */
  async toggleMute(conversationId: string, muted: boolean): Promise<void> {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        CONVERSATIONS_COLLECTION_ID,
        conversationId,
        { is_muted: muted }
      );
    } catch (error) {
      console.error("Error toggling mute:", error);
      throw error;
    }
  },

  /**
   * Get unread count for a user
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        CONVERSATIONS_COLLECTION_ID,
        [
          Query.or([
            Query.equal("initiator_id", userId),
            Query.contains("participants", userId),
          ]),
          Query.greaterThan("unread_count", 0),
        ]
      );

      return response.documents.reduce(
        (sum, conv) => sum + ((conv as unknown as Conversations).unread_count || 0),
        0
      );
    } catch (error) {
      console.error("Error getting unread count:", error);
      return 0;
    }
  },

  // ==================== MESSAGES ====================

  /**
   * Get messages for a conversation
   */
  async getMessages(
    conversationId: string,
    options?: {
      limit?: number;
      offset?: number;
      before?: string;
    }
  ): Promise<MessagesResponse> {
    try {
      const queries = [
        Query.equal("conversation_id", conversationId),
        Query.equal("is_deleted", false),
        Query.orderDesc("$createdAt"),
      ];

      if (options?.before) {
        queries.push(Query.lessThan("$createdAt", options.before));
      }

      if (options?.limit) {
        queries.push(Query.limit(options.limit));
      }

      if (options?.offset) {
        queries.push(Query.offset(options.offset));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        MESSAGES_COLLECTION_ID,
        queries
      );

      // Return messages in chronological order
      const messages = (response.documents as unknown as Messages[]).reverse();

      return {
        messages,
        total: response.total,
        hasMore:
          (options?.offset || 0) + response.documents.length < response.total,
      };
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  },

  /**
   * Send a message
   */
  async sendMessage(data: CreateMessageData): Promise<Messages> {
    try {
      const messageData = {
        conversation_id: data.conversation_id,
        sender_id: data.sender_id,
        sender_name: data.sender_name,
        sender_role: data.sender_role,
        sender_avatar_url: data.sender_avatar_url || null,
        content: data.content,
        type: data.type || "text",
        status: "sent",
        property_id: data.property_id || null,
        property_title: data.property_title || null,
        property_image_url: data.property_image_url || null,
        reply_to_id: data.reply_to_id || null,
        reply_to_preview: data.reply_to_preview || null,
        attachments: data.attachments ? JSON.stringify(data.attachments) : null,
        is_edited: false,
        is_deleted: false,
        is_internal_note: false,
      };

      const response = await databases.createDocument(
        DATABASE_ID,
        MESSAGES_COLLECTION_ID,
        ID.unique(),
        messageData
      );

      // Update conversation with last message
      // First get current conversation to increment total_messages
      const currentConv = await this.getConversation(data.conversation_id);
      await this.updateConversation(data.conversation_id, {
        last_message_preview: data.content.substring(0, 100),
        last_message_at: new Date().toISOString(),
        last_message_by: data.sender_id,
        total_messages: (currentConv?.total_messages || 0) + 1,
      });

      return response as unknown as Messages;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  /**
   * Edit a message
   */
  async editMessage(messageId: string, content: string): Promise<Messages> {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        MESSAGES_COLLECTION_ID,
        messageId,
        {
          content,
          is_edited: true,
          edited_at: new Date().toISOString(),
        }
      );
      return response as unknown as Messages;
    } catch (error) {
      console.error("Error editing message:", error);
      throw error;
    }
  },

  /**
   * Delete a message (soft delete)
   */
  async deleteMessage(messageId: string): Promise<void> {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        MESSAGES_COLLECTION_ID,
        messageId,
        { is_deleted: true }
      );
    } catch (error) {
      console.error("Error deleting message:", error);
      throw error;
    }
  },

  /**
   * Mark messages as read
   */
  async markAsRead(
    conversationId: string,
    userId: string
  ): Promise<void> {
    try {
      // Get unread messages for this user in the conversation
      const response = await databases.listDocuments(
        DATABASE_ID,
        MESSAGES_COLLECTION_ID,
        [
          Query.equal("conversation_id", conversationId),
          Query.notEqual("sender_id", userId),
          Query.notEqual("status", "read"),
        ]
      );

      // Mark each message as read
      await Promise.all(
        response.documents.map((doc) =>
          databases.updateDocument(DATABASE_ID, MESSAGES_COLLECTION_ID, doc.$id, {
            status: "read",
            read_by: userId,
          })
        )
      );

      // Update conversation unread count
      await this.updateConversation(conversationId, {
        unread_count: 0,
      });
    } catch (error) {
      console.error("Error marking messages as read:", error);
      throw error;
    }
  },

  /**
   * Start a conversation with a property inquiry
   */
  async startPropertyInquiry(
    propertyId: string,
    propertyTitle: string,
    initiatorId: string,
    initiatorName: string,
    initiatorRole: "user" | "agent" | "agency" | "admin",
    agentId: string,
    agentName: string,
    message: string
  ): Promise<{ conversation: Conversations; message: Messages }> {
    try {
      // Create conversation
      const conversation = await this.createConversation({
        initiator_id: initiatorId,
        initiator_name: initiatorName,
        initiator_role: initiatorRole,
        type: "inquiry",
        subject: `Inquiry about: ${propertyTitle}`,
        property_id: propertyId,
        property_title: propertyTitle,
        participants: [initiatorId, agentId],
      });

      // Send first message
      const firstMessage = await this.sendMessage({
        conversation_id: conversation.$id,
        sender_id: initiatorId,
        sender_name: initiatorName,
        sender_role: initiatorRole,
        content: message,
        property_id: propertyId,
        property_title: propertyTitle,
      });

      return { conversation, message: firstMessage };
    } catch (error) {
      console.error("Error starting property inquiry:", error);
      throw error;
    }
  },

  /**
   * Get or create a conversation between two users
   */
  async getOrCreateConversation(
    userId1: string,
    userName1: string,
    userRole1: "user" | "agent" | "agency" | "admin",
    userId2: string,
    userName2: string,
    propertyId?: string,
    propertyTitle?: string
  ): Promise<Conversations> {
    try {
      // Check if conversation exists
      const queries = [
        Query.or([
          Query.and([
            Query.equal("initiator_id", userId1),
            Query.contains("participants", userId2),
          ]),
          Query.and([
            Query.equal("initiator_id", userId2),
            Query.contains("participants", userId1),
          ]),
        ]),
      ];

      if (propertyId) {
        queries.push(Query.equal("property_id", propertyId));
      }

      const existing = await databases.listDocuments(
        DATABASE_ID,
        CONVERSATIONS_COLLECTION_ID,
        queries
      );

      if (existing.documents.length > 0) {
        return existing.documents[0] as unknown as Conversations;
      }

      // Create new conversation
      return await this.createConversation({
        initiator_id: userId1,
        initiator_name: userName1,
        initiator_role: userRole1,
        type: propertyId ? "inquiry" : "general",
        property_id: propertyId,
        property_title: propertyTitle,
        participants: [userId1, userId2],
      });
    } catch (error) {
      console.error("Error getting or creating conversation:", error);
      throw error;
    }
  },
};
