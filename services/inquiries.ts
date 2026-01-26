import { databases } from "@/services/appwrite";
import { Query, ID } from "appwrite";
import { type PropertyInquiries } from "@/types/appwrite";

const DATABASE_ID = "main";
const INQUIRIES_COLLECTION_ID = "property_inquiries";

export interface CreateInquiryData {
  property_id: string;
  inquirer_id?: string;
  inquirer_name?: string;
  inquirer_email?: string;
  inquirer_phone?: string;
  subject?: string;
  message: string;
  inquiry_type?: string;
  preferred_contact_method?: string;
  preferred_contact_time?: string;
  source?: string;
}

export interface InquiryFilters {
  property_id?: string;
  inquirer_id?: string;
  status?: string;
  is_read?: boolean;
  inquiry_type?: string;
  limit?: number;
  offset?: number;
}

/**
 * Inquiries Service - CRUD operations for the property_inquiries collection
 */
export const inquiriesService = {
  /**
   * Get an inquiry by ID
   */
  async getById(inquiryId: string): Promise<PropertyInquiries | null> {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        INQUIRIES_COLLECTION_ID,
        inquiryId
      );
      return response as unknown as PropertyInquiries;
    } catch (error) {
      console.error("Error fetching inquiry by ID:", error);
      throw error;
    }
  },

  /**
   * Get inquiries received by a user (for their properties)
   */
  async getReceivedInquiries(
    userId: string,
    options?: {
      status?: string;
      is_read?: boolean;
      limit?: number;
      offset?: number;
    }
  ): Promise<{ inquiries: PropertyInquiries[]; total: number }> {
    try {
      // First get all property IDs owned by the user - only fetch $id for performance
      const propertiesResponse = await databases.listDocuments(
        DATABASE_ID,
        "properties",
        [
          Query.equal("owner_id", userId),
          Query.select(["$id"]),
          Query.limit(100)
        ]
      );

      if (propertiesResponse.documents.length === 0) {
        return { inquiries: [], total: 0 };
      }

      const propertyIds = propertiesResponse.documents.map((p) => p.$id);
      
      // Store filters for client-side filtering (may not be indexed)
      const filterStatus = options?.status && options.status !== "all" ? options.status : undefined;
      const filterIsRead = options?.is_read;
      const requestedLimit = options?.limit || 25;
      const requestedOffset = options?.offset || 0;
      const needsClientFilter = filterStatus !== undefined || filterIsRead !== undefined;
      
      const queries: string[] = [
        Query.equal("property_id", propertyIds),
        Query.orderDesc("$createdAt"),
      ];

      // status and is_read handled client-side since they may not be indexed
      if (needsClientFilter) {
        queries.push(Query.limit(200));
      } else {
        if (options?.limit) {
          queries.push(Query.limit(options.limit));
        }
        if (options?.offset) {
          queries.push(Query.offset(options.offset));
        }
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        INQUIRIES_COLLECTION_ID,
        queries
      );

      let inquiries = response.documents as unknown as PropertyInquiries[];
      let total = response.total;
      
      // Apply client-side filtering for status and is_read
      if (needsClientFilter) {
        inquiries = inquiries.filter(inq => {
          if (filterStatus && inq.status !== filterStatus) return false;
          if (filterIsRead !== undefined && inq.is_read !== filterIsRead) return false;
          return true;
        });
        total = inquiries.length;
        inquiries = inquiries.slice(requestedOffset, requestedOffset + requestedLimit);
      }

      return {
        inquiries,
        total,
      };
    } catch (error) {
      console.error("Error fetching received inquiries:", error);
      throw error;
    }
  },

  /**
   * Get inquiries sent by a user
   */
  async getSentInquiries(
    userId: string,
    options?: {
      status?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<{ inquiries: PropertyInquiries[]; total: number }> {
    try {
      // Store status filter for client-side filtering (may not be indexed)
      const filterStatus = options?.status && options.status !== "all" ? options.status : undefined;
      const requestedLimit = options?.limit || 25;
      const requestedOffset = options?.offset || 0;
      
      const queries: string[] = [
        Query.equal("inquirer_id", userId),
        Query.orderDesc("$createdAt"),
      ];

      // status handled client-side since it may not be indexed
      if (filterStatus) {
        queries.push(Query.limit(200));
      } else {
        if (options?.limit) {
          queries.push(Query.limit(options.limit));
        }
        if (options?.offset) {
          queries.push(Query.offset(options.offset));
        }
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        INQUIRIES_COLLECTION_ID,
        queries
      );

      let inquiries = response.documents as unknown as PropertyInquiries[];
      let total = response.total;
      
      // Apply client-side filtering for status
      if (filterStatus) {
        inquiries = inquiries.filter(inq => inq.status === filterStatus);
        total = inquiries.length;
        inquiries = inquiries.slice(requestedOffset, requestedOffset + requestedLimit);
      }

      return {
        inquiries,
        total,
      };
    } catch (error) {
      console.error("Error fetching sent inquiries:", error);
      throw error;
    }
  },

  /**
   * Get inquiries for a specific property
   */
  async getByPropertyId(
    propertyId: string,
    options?: {
      status?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<{ inquiries: PropertyInquiries[]; total: number }> {
    try {
      // Store status filter for client-side filtering (may not be indexed)
      const filterStatus = options?.status && options.status !== "all" ? options.status : undefined;
      const requestedLimit = options?.limit || 25;
      const requestedOffset = options?.offset || 0;
      
      const queries: string[] = [
        Query.equal("property_id", propertyId),
        Query.orderDesc("$createdAt"),
      ];

      // status handled client-side since it may not be indexed
      if (filterStatus) {
        queries.push(Query.limit(200));
      } else {
        if (options?.limit) {
          queries.push(Query.limit(options.limit));
        }
        if (options?.offset) {
          queries.push(Query.offset(options.offset));
        }
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        INQUIRIES_COLLECTION_ID,
        queries
      );

      let inquiries = response.documents as unknown as PropertyInquiries[];
      let total = response.total;
      
      // Apply client-side filtering for status
      if (filterStatus) {
        inquiries = inquiries.filter(inq => inq.status === filterStatus);
        total = inquiries.length;
        inquiries = inquiries.slice(requestedOffset, requestedOffset + requestedLimit);
      }

      return {
        inquiries,
        total,
      };
    } catch (error) {
      console.error("Error fetching property inquiries:", error);
      throw error;
    }
  },

  /**
   * Create a new inquiry
   */
  async create(data: CreateInquiryData): Promise<PropertyInquiries> {
    try {
      const inquiryData = {
        ...data,
        status: "pending",
        priority: 0,
        is_read: false,
        inquiry_type: data.inquiry_type || "general",
        preferred_contact_method: data.preferred_contact_method || "email",
        preferred_contact_time: data.preferred_contact_time || "anytime",
      };

      const response = await databases.createDocument(
        DATABASE_ID,
        INQUIRIES_COLLECTION_ID,
        ID.unique(),
        inquiryData
      );

      return response as unknown as PropertyInquiries;
    } catch (error) {
      console.error("Error creating inquiry:", error);
      throw error;
    }
  },

  /**
   * Update an inquiry
   */
  async update(
    inquiryId: string,
    data: Partial<PropertyInquiries>
  ): Promise<PropertyInquiries> {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        INQUIRIES_COLLECTION_ID,
        inquiryId,
        data as Record<string, unknown>
      );

      return response as unknown as PropertyInquiries;
    } catch (error) {
      console.error("Error updating inquiry:", error);
      throw error;
    }
  },

  /**
   * Mark inquiry as read
   */
  async markAsRead(inquiryId: string): Promise<void> {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        INQUIRIES_COLLECTION_ID,
        inquiryId,
        { is_read: true, status: "read" }
      );
    } catch (error) {
      console.error("Error marking inquiry as read:", error);
      throw error;
    }
  },

  /**
   * Reply to an inquiry
   */
  async reply(
    inquiryId: string,
    response: string,
    respondedByUserId: string
  ): Promise<PropertyInquiries> {
    try {
      const updatedInquiry = await databases.updateDocument(
        DATABASE_ID,
        INQUIRIES_COLLECTION_ID,
        inquiryId,
        {
          agent_response: response,
          status: "replied",
          responded_by_user_id: respondedByUserId,
          responded_at: new Date().toISOString(),
        }
      );

      return updatedInquiry as unknown as PropertyInquiries;
    } catch (error) {
      console.error("Error replying to inquiry:", error);
      throw error;
    }
  },

  /**
   * Delete an inquiry
   */
  async delete(inquiryId: string): Promise<void> {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        INQUIRIES_COLLECTION_ID,
        inquiryId
      );
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      throw error;
    }
  },

  /**
   * Get inquiry statistics for a user
   */
  async getUserInquiryStats(userId: string): Promise<{
    total: number;
    unread: number;
    pending: number;
    replied: number;
  }> {
    try {
      const { inquiries, total } = await this.getReceivedInquiries(userId, {
        limit: 100,
      });

      const stats = {
        total,
        unread: 0,
        pending: 0,
        replied: 0,
      };

      inquiries.forEach((inquiry) => {
        if (!inquiry.is_read) {
          stats.unread++;
        }
        if (inquiry.status === "pending" || inquiry.status === "read") {
          stats.pending++;
        } else if (inquiry.status === "replied") {
          stats.replied++;
        }
      });

      return stats;
    } catch (error) {
      console.error("Error getting user inquiry stats:", error);
      throw error;
    }
  },
};

export default inquiriesService;
