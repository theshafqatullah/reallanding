import { databases } from "@/services/appwrite";
import { Query, ID } from "appwrite";
import { type UserNotifications } from "@/types/appwrite";

const DATABASE_ID = "main";
const NOTIFICATIONS_COLLECTION_ID = "user_notifications";

export interface CreateNotificationData {
  user_id: string;
  notification_type: string;
  title: string;
  message: string;
  related_property_id?: string;
  related_user_id?: string;
  action_url?: string;
}

/**
 * Notifications Service - CRUD operations for the user_notifications collection
 */
export const notificationsService = {
  /**
   * Get notification by ID
   */
  async getById(notificationId: string): Promise<UserNotifications | null> {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        NOTIFICATIONS_COLLECTION_ID,
        notificationId
      );
      return response as unknown as UserNotifications;
    } catch (error) {
      console.error("Error fetching notification by ID:", error);
      throw error;
    }
  },

  /**
   * Get all notifications for a user
   */
  async getUserNotifications(
    userId: string,
    options?: {
      is_read?: boolean;
      notification_type?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<{ notifications: UserNotifications[]; total: number }> {
    try {
      // Store filters for client-side filtering (may not be indexed)
      const filterIsRead = options?.is_read;
      const filterType = options?.notification_type;
      const requestedLimit = options?.limit || 25;
      const requestedOffset = options?.offset || 0;
      const needsClientFilter = filterIsRead !== undefined || filterType !== undefined;
      
      const queries: string[] = [
        Query.equal("user_id", userId),
        Query.orderDesc("$createdAt"),
      ];

      // is_read and notification_type handled client-side since they may not be indexed
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
        NOTIFICATIONS_COLLECTION_ID,
        queries
      );

      let notifications = response.documents as unknown as UserNotifications[];
      let total = response.total;
      
      // Apply client-side filtering
      if (needsClientFilter) {
        notifications = notifications.filter(n => {
          if (filterIsRead !== undefined && n.is_read !== filterIsRead) return false;
          if (filterType && n.notification_type !== filterType) return false;
          return true;
        });
        total = notifications.length;
        notifications = notifications.slice(requestedOffset, requestedOffset + requestedLimit);
      }

      return {
        notifications,
        total,
      };
    } catch (error) {
      console.error("Error fetching user notifications:", error);
      throw error;
    }
  },

  /**
   * Get unread notifications count
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        NOTIFICATIONS_COLLECTION_ID,
        [
          Query.equal("user_id", userId),
          Query.limit(200),
        ]
      );

      // Filter is_read client-side since it may not be indexed
      const unreadNotifications = response.documents.filter(
        (doc) => (doc as unknown as UserNotifications).is_read === false
      );

      return unreadNotifications.length;
    } catch (error) {
      console.error("Error getting unread notifications count:", error);
      throw error;
    }
  },

  /**
   * Create a notification
   */
  async create(data: CreateNotificationData): Promise<UserNotifications> {
    try {
      const notificationData = {
        ...data,
        is_read: false,
      };

      const response = await databases.createDocument(
        DATABASE_ID,
        NOTIFICATIONS_COLLECTION_ID,
        ID.unique(),
        notificationData
      );

      return response as unknown as UserNotifications;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        NOTIFICATIONS_COLLECTION_ID,
        notificationId,
        { is_read: true }
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  },

  /**
   * Mark all notifications as read - with batching for performance
   */
  async markAllAsRead(userId: string): Promise<void> {
    try {
      // Only fetch IDs for better performance
      const response = await databases.listDocuments(
        DATABASE_ID,
        NOTIFICATIONS_COLLECTION_ID,
        [
          Query.equal("user_id", userId),
          Query.equal("is_read", false),
          Query.select(["$id"]),
          Query.limit(100),
        ]
      );

      if (response.documents.length === 0) return;

      // Batch updates in chunks of 10 to avoid rate limiting
      const BATCH_SIZE = 10;
      const notifications = response.documents;
      
      for (let i = 0; i < notifications.length; i += BATCH_SIZE) {
        const batch = notifications.slice(i, i + BATCH_SIZE);
        await Promise.all(
          batch.map((notification) =>
            databases.updateDocument(
              DATABASE_ID,
              NOTIFICATIONS_COLLECTION_ID,
              notification.$id,
              { is_read: true }
            )
          )
        );
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  },

  /**
   * Delete a notification
   */
  async delete(notificationId: string): Promise<void> {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        NOTIFICATIONS_COLLECTION_ID,
        notificationId
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  },

  /**
   * Delete all notifications for a user - with batching
   */
  async deleteAll(userId: string): Promise<void> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        NOTIFICATIONS_COLLECTION_ID,
        [
          Query.equal("user_id", userId),
          Query.select(["$id"]),
          Query.limit(100),
        ]
      );

      if (response.documents.length === 0) return;

      // Batch deletes in chunks of 10
      const BATCH_SIZE = 10;
      const notifications = response.documents;

      for (let i = 0; i < notifications.length; i += BATCH_SIZE) {
        const batch = notifications.slice(i, i + BATCH_SIZE);
        await Promise.all(
          batch.map((notification) =>
            databases.deleteDocument(
              DATABASE_ID,
              NOTIFICATIONS_COLLECTION_ID,
              notification.$id
            )
          )
        );
      }
    } catch (error) {
      console.error("Error deleting all notifications:", error);
      throw error;
    }
  },

  /**
   * Create system notifications
   */
  async createInquiryNotification(
    userId: string,
    propertyId: string,
    inquirerName: string
  ): Promise<UserNotifications> {
    return this.create({
      user_id: userId,
      notification_type: "inquiry",
      title: "New Property Inquiry",
      message: `${inquirerName} has sent an inquiry about your property.`,
      related_property_id: propertyId,
      action_url: `/inquiries`,
    });
  },

  async createPropertySavedNotification(
    userId: string,
    propertyId: string,
    saverName: string
  ): Promise<UserNotifications> {
    return this.create({
      user_id: userId,
      notification_type: "property_saved",
      title: "Property Saved",
      message: `${saverName} has saved your property to their favorites.`,
      related_property_id: propertyId,
      action_url: `/analytics`,
    });
  },

  async createListingApprovedNotification(
    userId: string,
    propertyId: string,
    propertyTitle: string
  ): Promise<UserNotifications> {
    return this.create({
      user_id: userId,
      notification_type: "listing_approved",
      title: "Listing Approved",
      message: `Your listing "${propertyTitle}" has been approved and is now live.`,
      related_property_id: propertyId,
      action_url: `/p/${propertyId}`,
    });
  },

  async createPriceChangeNotification(
    userId: string,
    propertyId: string,
    propertyTitle: string,
    newPrice: number
  ): Promise<UserNotifications> {
    const formattedPrice = new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(newPrice);

    return this.create({
      user_id: userId,
      notification_type: "price_alert",
      title: "Price Change Alert",
      message: `The price of "${propertyTitle}" has changed to ${formattedPrice}.`,
      related_property_id: propertyId,
      action_url: `/p/${propertyId}`,
    });
  },
};

export default notificationsService;
