/**
 * Contact Service
 * Handles contact form submissions and inquiries
 */

import { databases } from "./appwrite";
import { Query, ID, Models } from "appwrite";

const DATABASE_ID = "main";
const CONTACT_INQUIRIES_COLLECTION = "contact_inquiries";
const CONTACT_REQUESTS_COLLECTION = "contact_requests";

// Types based on the collection attributes
export type ContactInquiry = Models.Document & {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  inquiry_type?: string;
  status?: "new" | "in_progress" | "responded" | "closed";
  priority?: "low" | "normal" | "high" | "urgent";
  assigned_to_user_id?: string;
  response_message?: string;
  ip_address?: string;
  user_agent?: string;
  referrer_url?: string;
};

export type ContactRequest = Models.Document & {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  source?: "website" | "mobile_app" | "social_media" | "referral" | "other";
  status?: "pending" | "contacted" | "converted" | "closed";
  priority?: "low" | "normal" | "high";
  follow_up_date?: string;
  notes?: string;
  is_spam?: boolean;
  responded_by?: string;
};

export interface CreateContactInquiryData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  inquiry_type?: string;
}

export interface CreateContactRequestData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  source?: "website" | "mobile_app" | "social_media" | "referral" | "other";
}

export interface ContactQueryOptions {
  status?: string;
  priority?: string;
  limit?: number;
  offset?: number;
}

export const contactService = {
  // ==================== CONTACT INQUIRIES ====================

  /**
   * Create a new contact inquiry (general contact form)
   */
  async createInquiry(data: CreateContactInquiryData): Promise<ContactInquiry | null> {
    try {
      // Validate required fields
      if (!data.name?.trim()) {
        throw new Error("Name is required");
      }
      if (!data.email?.trim()) {
        throw new Error("Email is required");
      }
      if (!data.message?.trim()) {
        throw new Error("Message is required");
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error("Please enter a valid email address");
      }

      const inquiryData: Omit<ContactInquiry, keyof Models.Document> = {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone?.trim(),
        subject: data.subject?.trim(),
        message: data.message.trim(),
        inquiry_type: data.inquiry_type || "general",
        status: "new" as const,
        priority: "normal" as const,
        assigned_to_user_id: undefined,
        response_message: undefined,
        ip_address: undefined, // Would be set server-side
        user_agent: typeof window !== "undefined" ? navigator.userAgent : undefined,
        referrer_url: typeof window !== "undefined" ? document.referrer || undefined : undefined,
      };

      const inquiry = await databases.createDocument<ContactInquiry>(
        DATABASE_ID,
        CONTACT_INQUIRIES_COLLECTION,
        ID.unique(),
        inquiryData
      );

      return inquiry;
    } catch (error) {
      console.error("Error creating contact inquiry:", error);
      throw error;
    }
  },

  /**
   * Get all contact inquiries (admin)
   */
  async getInquiries(
    options: ContactQueryOptions = {}
  ): Promise<{ inquiries: ContactInquiry[]; total: number }> {
    try {
      const queries = [Query.orderDesc("$createdAt")];

      if (options.status) {
        queries.push(Query.equal("status", options.status));
      }
      if (options.priority) {
        queries.push(Query.equal("priority", options.priority));
      }
      if (options.limit) {
        queries.push(Query.limit(options.limit));
      }
      if (options.offset) {
        queries.push(Query.offset(options.offset));
      }

      const response = await databases.listDocuments<ContactInquiry>(
        DATABASE_ID,
        CONTACT_INQUIRIES_COLLECTION,
        queries
      );

      return {
        inquiries: response.documents,
        total: response.total,
      };
    } catch (error) {
      console.error("Error fetching contact inquiries:", error);
      return { inquiries: [], total: 0 };
    }
  },

  /**
   * Get a single contact inquiry
   */
  async getInquiryById(inquiryId: string): Promise<ContactInquiry | null> {
    try {
      const inquiry = await databases.getDocument<ContactInquiry>(
        DATABASE_ID,
        CONTACT_INQUIRIES_COLLECTION,
        inquiryId
      );
      return inquiry;
    } catch (error) {
      console.error("Error fetching contact inquiry:", error);
      return null;
    }
  },

  /**
   * Update inquiry status (admin)
   */
  async updateInquiryStatus(
    inquiryId: string,
    status: "new" | "in_progress" | "responded" | "closed",
    responseMessage?: string,
    assignedTo?: string
  ): Promise<ContactInquiry | null> {
    try {
      const updateData: Partial<ContactInquiry> = { status };

      if (responseMessage) {
        updateData.response_message = responseMessage;
      }
      if (assignedTo) {
        updateData.assigned_to_user_id = assignedTo;
      }

      const inquiry = await databases.updateDocument<ContactInquiry>(
        DATABASE_ID,
        CONTACT_INQUIRIES_COLLECTION,
        inquiryId,
        updateData
      );

      return inquiry;
    } catch (error) {
      console.error("Error updating contact inquiry:", error);
      throw error;
    }
  },

  /**
   * Delete an inquiry
   */
  async deleteInquiry(inquiryId: string): Promise<boolean> {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        CONTACT_INQUIRIES_COLLECTION,
        inquiryId
      );
      return true;
    } catch (error) {
      console.error("Error deleting contact inquiry:", error);
      return false;
    }
  },

  // ==================== CONTACT REQUESTS ====================

  /**
   * Create a new contact request (lead generation)
   */
  async createRequest(data: CreateContactRequestData): Promise<ContactRequest | null> {
    try {
      // Validate required fields
      if (!data.name?.trim()) {
        throw new Error("Name is required");
      }
      if (!data.email?.trim()) {
        throw new Error("Email is required");
      }
      if (!data.message?.trim()) {
        throw new Error("Message is required");
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error("Please enter a valid email address");
      }

      const requestData: Omit<ContactRequest, keyof Models.Document> = {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone?.trim(),
        subject: data.subject?.trim(),
        message: data.message.trim(),
        source: data.source || "website",
        status: "pending" as const,
        priority: "normal" as const,
        follow_up_date: undefined,
        notes: undefined,
        is_spam: false,
        responded_by: undefined,
      };

      const request = await databases.createDocument<ContactRequest>(
        DATABASE_ID,
        CONTACT_REQUESTS_COLLECTION,
        ID.unique(),
        requestData
      );

      return request;
    } catch (error) {
      console.error("Error creating contact request:", error);
      throw error;
    }
  },

  /**
   * Get all contact requests (admin)
   */
  async getRequests(
    options: ContactQueryOptions = {}
  ): Promise<{ requests: ContactRequest[]; total: number }> {
    try {
      const queries = [
        Query.orderDesc("$createdAt"),
        Query.equal("is_spam", false),
      ];

      if (options.status) {
        queries.push(Query.equal("status", options.status));
      }
      if (options.priority) {
        queries.push(Query.equal("priority", options.priority));
      }
      if (options.limit) {
        queries.push(Query.limit(options.limit));
      }
      if (options.offset) {
        queries.push(Query.offset(options.offset));
      }

      const response = await databases.listDocuments<ContactRequest>(
        DATABASE_ID,
        CONTACT_REQUESTS_COLLECTION,
        queries
      );

      return {
        requests: response.documents,
        total: response.total,
      };
    } catch (error) {
      console.error("Error fetching contact requests:", error);
      return { requests: [], total: 0 };
    }
  },

  /**
   * Get a single contact request
   */
  async getRequestById(requestId: string): Promise<ContactRequest | null> {
    try {
      const request = await databases.getDocument<ContactRequest>(
        DATABASE_ID,
        CONTACT_REQUESTS_COLLECTION,
        requestId
      );
      return request;
    } catch (error) {
      console.error("Error fetching contact request:", error);
      return null;
    }
  },

  /**
   * Update request status (admin)
   */
  async updateRequestStatus(
    requestId: string,
    status: "pending" | "contacted" | "converted" | "closed",
    notes?: string,
    respondedBy?: string,
    followUpDate?: string
  ): Promise<ContactRequest | null> {
    try {
      const updateData: Partial<ContactRequest> = { status };

      if (notes) {
        updateData.notes = notes;
      }
      if (respondedBy) {
        updateData.responded_by = respondedBy;
      }
      if (followUpDate) {
        updateData.follow_up_date = followUpDate;
      }

      const request = await databases.updateDocument<ContactRequest>(
        DATABASE_ID,
        CONTACT_REQUESTS_COLLECTION,
        requestId,
        updateData
      );

      return request;
    } catch (error) {
      console.error("Error updating contact request:", error);
      throw error;
    }
  },

  /**
   * Mark request as spam
   */
  async markAsSpam(requestId: string): Promise<boolean> {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        CONTACT_REQUESTS_COLLECTION,
        requestId,
        { is_spam: true }
      );
      return true;
    } catch (error) {
      console.error("Error marking as spam:", error);
      return false;
    }
  },

  /**
   * Delete a request
   */
  async deleteRequest(requestId: string): Promise<boolean> {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        CONTACT_REQUESTS_COLLECTION,
        requestId
      );
      return true;
    } catch (error) {
      console.error("Error deleting contact request:", error);
      return false;
    }
  },

  // ==================== STATISTICS ====================

  /**
   * Get contact statistics (admin)
   */
  async getStats(): Promise<{
    totalInquiries: number;
    newInquiries: number;
    totalRequests: number;
    pendingRequests: number;
  }> {
    try {
      const [inquiriesTotal, inquiriesNew, requestsTotal, requestsPending] =
        await Promise.all([
          databases.listDocuments(DATABASE_ID, CONTACT_INQUIRIES_COLLECTION, [
            Query.limit(1),
          ]),
          databases.listDocuments(DATABASE_ID, CONTACT_INQUIRIES_COLLECTION, [
            Query.equal("status", "new"),
            Query.limit(1),
          ]),
          databases.listDocuments(DATABASE_ID, CONTACT_REQUESTS_COLLECTION, [
            Query.equal("is_spam", false),
            Query.limit(1),
          ]),
          databases.listDocuments(DATABASE_ID, CONTACT_REQUESTS_COLLECTION, [
            Query.equal("status", "pending"),
            Query.equal("is_spam", false),
            Query.limit(1),
          ]),
        ]);

      return {
        totalInquiries: inquiriesTotal.total,
        newInquiries: inquiriesNew.total,
        totalRequests: requestsTotal.total,
        pendingRequests: requestsPending.total,
      };
    } catch (error) {
      console.error("Error fetching contact stats:", error);
      return {
        totalInquiries: 0,
        newInquiries: 0,
        totalRequests: 0,
        pendingRequests: 0,
      };
    }
  },
};
