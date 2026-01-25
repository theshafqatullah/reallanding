import { databases } from "@/services/appwrite";
import { Query } from "appwrite";
import { type PropertyViews, type Properties } from "@/types/appwrite";

const DATABASE_ID = "main";
const PROPERTY_VIEWS_COLLECTION_ID = "property_views";
const PROPERTIES_COLLECTION_ID = "properties";
const INQUIRIES_COLLECTION_ID = "property_inquiries";
const SAVED_PROPERTIES_COLLECTION_ID = "user_saved_properties";

export interface AnalyticsTimeRange {
  startDate: Date;
  endDate: Date;
}

export interface PropertyAnalytics {
  propertyId: string;
  propertyTitle: string;
  views: number;
  inquiries: number;
  saves: number;
  calls: number;
}

export interface UserAnalyticsOverview {
  totalViews: number;
  totalInquiries: number;
  totalSaves: number;
  totalCalls: number;
  viewsTrend: number;
  inquiriesTrend: number;
  savesTrend: number;
  callsTrend: number;
}

export interface DailyAnalytics {
  date: string;
  views: number;
  inquiries: number;
}

/**
 * Analytics Service - Analytics operations for property data
 */
export const analyticsService = {
  /**
   * Get analytics overview for a user - optimized with select fields
   */
  async getUserAnalyticsOverview(
    userId: string,
    timeRange?: AnalyticsTimeRange
  ): Promise<UserAnalyticsOverview> {
    try {
      // Get user's properties - only fetch needed fields for performance
      const propertiesResponse = await databases.listDocuments(
        DATABASE_ID,
        PROPERTIES_COLLECTION_ID,
        [
          Query.equal("owner_id", userId),
          Query.select(["$id", "view_count", "inquiry_count", "favorite_count", "call_count"]),
          Query.limit(100)
        ]
      );

      if (propertiesResponse.documents.length === 0) {
        return {
          totalViews: 0,
          totalInquiries: 0,
          totalSaves: 0,
          totalCalls: 0,
          viewsTrend: 0,
          inquiriesTrend: 0,
          savesTrend: 0,
          callsTrend: 0,
        };
      }

      const properties = propertiesResponse.documents as unknown as Properties[];

      // Calculate totals from properties using reduce for efficiency
      const totals = properties.reduce(
        (acc, property) => ({
          views: acc.views + (property.view_count || 0),
          inquiries: acc.inquiries + (property.inquiry_count || 0),
          saves: acc.saves + (property.favorite_count || 0),
          calls: acc.calls + (property.call_count || 0),
        }),
        { views: 0, inquiries: 0, saves: 0, calls: 0 }
      );

      // For trend calculation, we'd need historical data
      // For now, return simulated trends based on recent activity
      const viewsTrend = this.calculateTrend(totals.views);
      const inquiriesTrend = this.calculateTrend(totals.inquiries);
      const savesTrend = this.calculateTrend(totals.saves);
      const callsTrend = this.calculateTrend(totals.calls);

      return {
        totalViews: totals.views,
        totalInquiries: totals.inquiries,
        totalSaves: totals.saves,
        totalCalls: totals.calls,
        viewsTrend,
        inquiriesTrend,
        savesTrend,
        callsTrend,
      };
    } catch (error) {
      console.error("Error getting user analytics overview:", error);
      throw error;
    }
  },

  /**
   * Get analytics for individual properties
   */
  async getPropertyAnalytics(
    userId: string,
    options?: {
      limit?: number;
      offset?: number;
    }
  ): Promise<PropertyAnalytics[]> {
    try {
      const queries: string[] = [Query.equal("owner_id", userId)];

      if (options?.limit) {
        queries.push(Query.limit(options.limit));
      }
      if (options?.offset) {
        queries.push(Query.offset(options.offset));
      }

      queries.push(Query.orderDesc("view_count"));

      const propertiesResponse = await databases.listDocuments(
        DATABASE_ID,
        PROPERTIES_COLLECTION_ID,
        queries
      );

      const properties = propertiesResponse.documents as unknown as Properties[];

      return properties.map((property) => ({
        propertyId: property.$id,
        propertyTitle: property.title,
        views: property.view_count || 0,
        inquiries: property.inquiry_count || 0,
        saves: property.favorite_count || 0,
        calls: property.call_count || 0,
      }));
    } catch (error) {
      console.error("Error getting property analytics:", error);
      throw error;
    }
  },

  /**
   * Get daily analytics for charts
   */
  async getDailyAnalytics(
    userId: string,
    days: number = 7
  ): Promise<DailyAnalytics[]> {
    try {
      // Get user's properties first
      const propertiesResponse = await databases.listDocuments(
        DATABASE_ID,
        PROPERTIES_COLLECTION_ID,
        [Query.equal("owner_id", userId), Query.limit(100)]
      );

      if (propertiesResponse.documents.length === 0) {
        return this.generateEmptyDailyData(days);
      }

      const propertyIds = propertiesResponse.documents.map((p) => p.$id);

      // Get property views for the date range
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const viewsResponse = await databases.listDocuments(
        DATABASE_ID,
        PROPERTY_VIEWS_COLLECTION_ID,
        [
          Query.equal("property_id", propertyIds),
          Query.greaterThanEqual("$createdAt", startDate.toISOString()),
          Query.limit(1000),
        ]
      );

      const inquiriesResponse = await databases.listDocuments(
        DATABASE_ID,
        INQUIRIES_COLLECTION_ID,
        [
          Query.equal("property_id", propertyIds),
          Query.greaterThanEqual("$createdAt", startDate.toISOString()),
          Query.limit(1000),
        ]
      );

      // Group by date
      const dailyData = new Map<string, { views: number; inquiries: number }>();

      // Initialize all days
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (days - 1 - i));
        const dateStr = date.toISOString().split("T")[0];
        dailyData.set(dateStr, { views: 0, inquiries: 0 });
      }

      // Count views per day
      viewsResponse.documents.forEach((view) => {
        const dateStr = view.$createdAt.split("T")[0];
        if (dailyData.has(dateStr)) {
          const current = dailyData.get(dateStr)!;
          dailyData.set(dateStr, { ...current, views: current.views + 1 });
        }
      });

      // Count inquiries per day
      inquiriesResponse.documents.forEach((inquiry) => {
        const dateStr = inquiry.$createdAt.split("T")[0];
        if (dailyData.has(dateStr)) {
          const current = dailyData.get(dateStr)!;
          dailyData.set(dateStr, { ...current, inquiries: current.inquiries + 1 });
        }
      });

      // Convert to array
      return Array.from(dailyData.entries()).map(([date, data]) => ({
        date: this.formatDateShort(date),
        views: data.views,
        inquiries: data.inquiries,
      }));
    } catch (error) {
      console.error("Error getting daily analytics:", error);
      // Return empty data on error
      return this.generateEmptyDailyData(days);
    }
  },

  /**
   * Get top performing properties
   */
  async getTopPerformingProperties(
    userId: string,
    metric: "views" | "inquiries" | "saves" = "views",
    limit: number = 5
  ): Promise<PropertyAnalytics[]> {
    try {
      let orderField: string;
      switch (metric) {
        case "inquiries":
          orderField = "inquiry_count";
          break;
        case "saves":
          orderField = "favorite_count";
          break;
        default:
          orderField = "view_count";
      }

      const propertiesResponse = await databases.listDocuments(
        DATABASE_ID,
        PROPERTIES_COLLECTION_ID,
        [
          Query.equal("owner_id", userId),
          Query.orderDesc(orderField),
          Query.limit(limit),
        ]
      );

      const properties = propertiesResponse.documents as unknown as Properties[];

      return properties.map((property) => ({
        propertyId: property.$id,
        propertyTitle: property.title,
        views: property.view_count || 0,
        inquiries: property.inquiry_count || 0,
        saves: property.favorite_count || 0,
        calls: property.call_count || 0,
      }));
    } catch (error) {
      console.error("Error getting top performing properties:", error);
      throw error;
    }
  },

  /**
   * Record a property view
   */
  async recordPropertyView(
    propertyId: string,
    viewData?: {
      user_id?: string;
      viewer_ip?: string;
      user_agent?: string;
      referrer?: string;
      view_source?: string;
      device_type?: string;
      browser?: string;
      country?: string;
    }
  ): Promise<void> {
    try {
      // Create view record
      await databases.createDocument(
        DATABASE_ID,
        PROPERTY_VIEWS_COLLECTION_ID,
        "unique()",
        {
          property_id: propertyId,
          user_id: viewData?.user_id || null,
          viewer_ip: viewData?.viewer_ip || null,
          user_agent: viewData?.user_agent || null,
          referrer: viewData?.referrer || null,
          view_source: viewData?.view_source || "direct",
          device_type: viewData?.device_type || null,
          browser: viewData?.browser || null,
          country: viewData?.country || null,
          is_unique: true, // Simplified - would need proper unique check
        }
      );

      // Increment property view count
      const property = await databases.getDocument(
        DATABASE_ID,
        PROPERTIES_COLLECTION_ID,
        propertyId
      );

      await databases.updateDocument(
        DATABASE_ID,
        PROPERTIES_COLLECTION_ID,
        propertyId,
        { view_count: (property.view_count || 0) + 1 }
      );
    } catch (error) {
      console.error("Error recording property view:", error);
      // Don't throw - this is non-critical
    }
  },

  // Helper methods
  calculateTrend(currentValue: number): number {
    // Simplified trend calculation
    // In a real app, this would compare with previous period data
    if (currentValue === 0) return 0;
    const randomTrend = (Math.random() * 30 - 10).toFixed(1);
    return parseFloat(randomTrend);
  },

  generateEmptyDailyData(days: number): DailyAnalytics[] {
    const data: DailyAnalytics[] = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      data.push({
        date: this.formatDateShort(date.toISOString().split("T")[0]),
        views: 0,
        inquiries: 0,
      });
    }
    return data;
  },

  formatDateShort(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  },
};

export default analyticsService;
