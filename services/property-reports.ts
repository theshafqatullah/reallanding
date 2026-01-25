/**
 * Property Reports Service
 * Handles reporting inappropriate, fraudulent, or inaccurate property listings
 */

import { databases } from "./appwrite";
import { Query, ID, Models } from "appwrite";
import type { PropertyReports } from "@/types/appwrite";

const DATABASE_ID = "main";
const COLLECTION_ID = "property_reports";

// Extended type for document operations
type PropertyReportDoc = PropertyReports & Models.Document;

export interface CreateReportData {
  property_id: string;
  reported_by_user_id?: string;
  report_type: "fraudulent" | "inappropriate" | "inaccurate" | "duplicate" | "sold_rented" | "other";
  description: string;
  reporter_email?: string;
}

export interface ReportsQueryOptions {
  status?: "pending" | "under_review" | "resolved" | "dismissed";
  reportType?: string;
  limit?: number;
  offset?: number;
}

export const propertyReportsService = {
  /**
   * Get a single report by ID
   */
  async getById(reportId: string): Promise<PropertyReports | null> {
    try {
      const report = await databases.getDocument<PropertyReportDoc>(
        DATABASE_ID,
        COLLECTION_ID,
        reportId
      );
      return report;
    } catch (error) {
      console.error("Error fetching property report:", error);
      return null;
    }
  },

  /**
   * Get all reports for a specific property
   */
  async getPropertyReports(
    propertyId: string,
    options: ReportsQueryOptions = {}
  ): Promise<{ reports: PropertyReports[]; total: number }> {
    try {
      const queries = [
        Query.equal("property_id", propertyId),
        Query.orderDesc("$createdAt"),
      ];

      if (options.status) {
        queries.push(Query.equal("status", options.status));
      }
      if (options.reportType) {
        queries.push(Query.equal("report_type", options.reportType));
      }
      if (options.limit) {
        queries.push(Query.limit(options.limit));
      }
      if (options.offset) {
        queries.push(Query.offset(options.offset));
      }

      const response = await databases.listDocuments<PropertyReportDoc>(
        DATABASE_ID,
        COLLECTION_ID,
        queries
      );

      return {
        reports: response.documents,
        total: response.total,
      };
    } catch (error) {
      console.error("Error fetching property reports:", error);
      return { reports: [], total: 0 };
    }
  },

  /**
   * Get reports submitted by a specific user
   */
  async getUserReports(
    userId: string,
    options: ReportsQueryOptions = {}
  ): Promise<{ reports: PropertyReports[]; total: number }> {
    try {
      const queries = [
        Query.equal("reported_by_user_id", userId),
        Query.orderDesc("$createdAt"),
      ];

      if (options.status) {
        queries.push(Query.equal("status", options.status));
      }
      if (options.limit) {
        queries.push(Query.limit(options.limit));
      }
      if (options.offset) {
        queries.push(Query.offset(options.offset));
      }

      const response = await databases.listDocuments<PropertyReportDoc>(
        DATABASE_ID,
        COLLECTION_ID,
        queries
      );

      return {
        reports: response.documents,
        total: response.total,
      };
    } catch (error) {
      console.error("Error fetching user reports:", error);
      return { reports: [], total: 0 };
    }
  },

  /**
   * Get all reports (admin function)
   */
  async getAllReports(
    options: ReportsQueryOptions = {}
  ): Promise<{ reports: PropertyReports[]; total: number }> {
    try {
      const queries = [Query.orderDesc("$createdAt")];

      if (options.status) {
        queries.push(Query.equal("status", options.status));
      }
      if (options.reportType) {
        queries.push(Query.equal("report_type", options.reportType));
      }
      if (options.limit) {
        queries.push(Query.limit(options.limit));
      }
      if (options.offset) {
        queries.push(Query.offset(options.offset));
      }

      const response = await databases.listDocuments<PropertyReportDoc>(
        DATABASE_ID,
        COLLECTION_ID,
        queries
      );

      return {
        reports: response.documents,
        total: response.total,
      };
    } catch (error) {
      console.error("Error fetching all reports:", error);
      return { reports: [], total: 0 };
    }
  },

  /**
   * Create a new property report
   */
  async create(data: CreateReportData): Promise<PropertyReports | null> {
    try {
      // Validate required fields
      if (!data.property_id) {
        throw new Error("Property ID is required");
      }
      if (!data.report_type) {
        throw new Error("Report type is required");
      }
      if (!data.description || data.description.trim().length < 10) {
        throw new Error("Please provide a detailed description (at least 10 characters)");
      }

      const reportData = {
        property_id: data.property_id,
        reported_by_user_id: data.reported_by_user_id || null,
        report_type: data.report_type,
        description: data.description.trim(),
        status: "pending",
        reporter_email: data.reporter_email || null,
        reviewed_by_admin_id: null,
        admin_notes: null,
        reviewed_at: null,
      };

      const report = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        reportData
      );

      return report as unknown as PropertyReports;
    } catch (error) {
      console.error("Error creating property report:", error);
      throw error;
    }
  },

  /**
   * Update report status (admin function)
   */
  async updateStatus(
    reportId: string,
    status: "pending" | "under_review" | "resolved" | "dismissed",
    adminId?: string,
    adminNotes?: string
  ): Promise<PropertyReports | null> {
    try {
      const updateData: Partial<PropertyReports> = {
        status,
      };

      if (adminId) {
        updateData.reviewed_by_admin_id = adminId;
      }
      if (adminNotes) {
        updateData.admin_notes = adminNotes;
      }
      if (status === "resolved" || status === "dismissed") {
        updateData.reviewed_at = new Date().toISOString();
      }

      const report = await databases.updateDocument<PropertyReportDoc>(
        DATABASE_ID,
        COLLECTION_ID,
        reportId,
        updateData
      );

      return report;
    } catch (error) {
      console.error("Error updating report status:", error);
      throw error;
    }
  },

  /**
   * Delete a report
   */
  async delete(reportId: string): Promise<boolean> {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, reportId);
      return true;
    } catch (error) {
      console.error("Error deleting property report:", error);
      return false;
    }
  },

  /**
   * Check if user has already reported this property
   */
  async hasUserReported(
    propertyId: string,
    userId: string
  ): Promise<boolean> {
    try {
      const response = await databases.listDocuments<PropertyReportDoc>(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.equal("property_id", propertyId),
          Query.equal("reported_by_user_id", userId),
          Query.notEqual("status", "dismissed"), // Allow re-reporting if previous was dismissed
        ]
      );

      return response.total > 0;
    } catch (error) {
      console.error("Error checking user report:", error);
      return false;
    }
  },

  /**
   * Get report statistics for a property
   */
  async getPropertyReportStats(propertyId: string): Promise<{
    totalReports: number;
    pendingReports: number;
    resolvedReports: number;
  }> {
    try {
      const [totalResponse, pendingResponse, resolvedResponse] = await Promise.all([
        databases.listDocuments<PropertyReportDoc>(DATABASE_ID, COLLECTION_ID, [
          Query.equal("property_id", propertyId),
        ]),
        databases.listDocuments<PropertyReportDoc>(DATABASE_ID, COLLECTION_ID, [
          Query.equal("property_id", propertyId),
          Query.equal("status", "pending"),
        ]),
        databases.listDocuments<PropertyReportDoc>(DATABASE_ID, COLLECTION_ID, [
          Query.equal("property_id", propertyId),
          Query.equal("status", "resolved"),
        ]),
      ]);

      return {
        totalReports: totalResponse.total,
        pendingReports: pendingResponse.total,
        resolvedReports: resolvedResponse.total,
      };
    } catch (error) {
      console.error("Error fetching property report stats:", error);
      return {
        totalReports: 0,
        pendingReports: 0,
        resolvedReports: 0,
      };
    }
  },
};
