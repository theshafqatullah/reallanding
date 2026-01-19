import { databases } from "@/services/appwrite";
import { Query, ID } from "appwrite";
import { type UserSavedProperties, type Properties } from "@/types/appwrite";

const DATABASE_ID = "main";
const SAVED_PROPERTIES_COLLECTION_ID = "user_saved_properties";
const PROPERTIES_COLLECTION_ID = "properties";

export interface SavePropertyData {
  user_id: string;
  property_id: string;
  notes?: string;
  folder_name?: string;
  is_favorite?: boolean;
  priority?: number;
}

/**
 * Saved Properties Service - CRUD operations for the user_saved_properties collection
 */
export const savedPropertiesService = {
  /**
   * Get saved property by ID
   */
  async getById(savedPropertyId: string): Promise<UserSavedProperties | null> {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        SAVED_PROPERTIES_COLLECTION_ID,
        savedPropertyId
      );
      return response as unknown as UserSavedProperties;
    } catch (error) {
      console.error("Error fetching saved property by ID:", error);
      throw error;
    }
  },

  /**
   * Get all saved properties for a user
   */
  async getUserSavedProperties(
    userId: string,
    options?: {
      folder_name?: string;
      is_favorite?: boolean;
      limit?: number;
      offset?: number;
    }
  ): Promise<{ savedProperties: UserSavedProperties[]; total: number }> {
    try {
      const queries: string[] = [Query.equal("user_id", userId)];

      if (options?.folder_name) {
        queries.push(Query.equal("folder_name", options.folder_name));
      }
      if (options?.is_favorite !== undefined) {
        queries.push(Query.equal("is_favorite", options.is_favorite));
      }
      if (options?.limit) {
        queries.push(Query.limit(options.limit));
      }
      if (options?.offset) {
        queries.push(Query.offset(options.offset));
      }

      queries.push(Query.orderDesc("$createdAt"));

      const response = await databases.listDocuments(
        DATABASE_ID,
        SAVED_PROPERTIES_COLLECTION_ID,
        queries
      );

      return {
        savedProperties: response.documents as unknown as UserSavedProperties[],
        total: response.total,
      };
    } catch (error) {
      console.error("Error fetching user saved properties:", error);
      throw error;
    }
  },

  /**
   * Get saved properties with full property details
   */
  async getUserSavedPropertiesWithDetails(
    userId: string,
    options?: {
      folder_name?: string;
      is_favorite?: boolean;
      limit?: number;
      offset?: number;
    }
  ): Promise<{ 
    savedProperties: (UserSavedProperties & { property?: Properties })[]; 
    total: number 
  }> {
    try {
      const { savedProperties, total } = await this.getUserSavedProperties(userId, options);

      // Fetch property details for each saved property
      const savedWithDetails = await Promise.all(
        savedProperties.map(async (saved) => {
          try {
            const property = await databases.getDocument(
              DATABASE_ID,
              PROPERTIES_COLLECTION_ID,
              saved.property_id
            );
            return { ...saved, property: property as unknown as Properties };
          } catch {
            // Property might have been deleted
            return { ...saved, property: undefined };
          }
        })
      );

      return {
        savedProperties: savedWithDetails,
        total,
      };
    } catch (error) {
      console.error("Error fetching saved properties with details:", error);
      throw error;
    }
  },

  /**
   * Check if a property is saved by the user
   */
  async isPropertySaved(userId: string, propertyId: string): Promise<boolean> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        SAVED_PROPERTIES_COLLECTION_ID,
        [
          Query.equal("user_id", userId),
          Query.equal("property_id", propertyId),
          Query.limit(1),
        ]
      );

      return response.documents.length > 0;
    } catch (error) {
      console.error("Error checking if property is saved:", error);
      throw error;
    }
  },

  /**
   * Get the saved property record if exists
   */
  async getSavedPropertyRecord(
    userId: string,
    propertyId: string
  ): Promise<UserSavedProperties | null> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        SAVED_PROPERTIES_COLLECTION_ID,
        [
          Query.equal("user_id", userId),
          Query.equal("property_id", propertyId),
          Query.limit(1),
        ]
      );

      if (response.documents.length > 0) {
        return response.documents[0] as unknown as UserSavedProperties;
      }
      return null;
    } catch (error) {
      console.error("Error getting saved property record:", error);
      throw error;
    }
  },

  /**
   * Save a property
   */
  async saveProperty(data: SavePropertyData): Promise<UserSavedProperties> {
    try {
      // Check if already saved
      const existing = await this.getSavedPropertyRecord(
        data.user_id,
        data.property_id
      );

      if (existing) {
        throw new Error("Property is already saved");
      }

      const savedPropertyData = {
        user_id: data.user_id,
        property_id: data.property_id,
        notes: data.notes || null,
        folder_name: data.folder_name || null,
        is_favorite: data.is_favorite || false,
        priority: data.priority || 0,
      };

      const response = await databases.createDocument(
        DATABASE_ID,
        SAVED_PROPERTIES_COLLECTION_ID,
        ID.unique(),
        savedPropertyData
      );

      // Increment the property's favorite count
      try {
        const property = await databases.getDocument(
          DATABASE_ID,
          PROPERTIES_COLLECTION_ID,
          data.property_id
        );
        await databases.updateDocument(
          DATABASE_ID,
          PROPERTIES_COLLECTION_ID,
          data.property_id,
          { favorite_count: (property.favorite_count || 0) + 1 }
        );
      } catch {
        // Property update is non-critical
      }

      return response as unknown as UserSavedProperties;
    } catch (error) {
      console.error("Error saving property:", error);
      throw error;
    }
  },

  /**
   * Unsave a property
   */
  async unsaveProperty(userId: string, propertyId: string): Promise<void> {
    try {
      const savedRecord = await this.getSavedPropertyRecord(userId, propertyId);

      if (!savedRecord) {
        throw new Error("Property is not saved");
      }

      await databases.deleteDocument(
        DATABASE_ID,
        SAVED_PROPERTIES_COLLECTION_ID,
        savedRecord.$id
      );

      // Decrement the property's favorite count
      try {
        const property = await databases.getDocument(
          DATABASE_ID,
          PROPERTIES_COLLECTION_ID,
          propertyId
        );
        await databases.updateDocument(
          DATABASE_ID,
          PROPERTIES_COLLECTION_ID,
          propertyId,
          { favorite_count: Math.max(0, (property.favorite_count || 0) - 1) }
        );
      } catch {
        // Property update is non-critical
      }
    } catch (error) {
      console.error("Error unsaving property:", error);
      throw error;
    }
  },

  /**
   * Toggle save property
   */
  async toggleSaveProperty(
    userId: string,
    propertyId: string
  ): Promise<{ saved: boolean; savedProperty?: UserSavedProperties }> {
    try {
      const existing = await this.getSavedPropertyRecord(userId, propertyId);

      if (existing) {
        await this.unsaveProperty(userId, propertyId);
        return { saved: false };
      } else {
        const savedProperty = await this.saveProperty({
          user_id: userId,
          property_id: propertyId,
        });
        return { saved: true, savedProperty };
      }
    } catch (error) {
      console.error("Error toggling save property:", error);
      throw error;
    }
  },

  /**
   * Update saved property (notes, folder, etc.)
   */
  async update(
    savedPropertyId: string,
    data: Partial<UserSavedProperties>
  ): Promise<UserSavedProperties> {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        SAVED_PROPERTIES_COLLECTION_ID,
        savedPropertyId,
        data as Record<string, unknown>
      );

      return response as unknown as UserSavedProperties;
    } catch (error) {
      console.error("Error updating saved property:", error);
      throw error;
    }
  },

  /**
   * Delete a saved property by ID
   */
  async delete(savedPropertyId: string): Promise<void> {
    try {
      // Get the saved property to find the property_id for decrementing count
      const saved = await this.getById(savedPropertyId);
      
      await databases.deleteDocument(
        DATABASE_ID,
        SAVED_PROPERTIES_COLLECTION_ID,
        savedPropertyId
      );

      // Decrement the property's favorite count if we found it
      if (saved?.property_id) {
        try {
          const property = await databases.getDocument(
            DATABASE_ID,
            PROPERTIES_COLLECTION_ID,
            saved.property_id
          );
          await databases.updateDocument(
            DATABASE_ID,
            PROPERTIES_COLLECTION_ID,
            saved.property_id,
            { favorite_count: Math.max(0, (property.favorite_count || 0) - 1) }
          );
        } catch {
          // Property update is non-critical
        }
      }
    } catch (error) {
      console.error("Error deleting saved property:", error);
      throw error;
    }
  },

  /**
   * Toggle favorite status
   */
  async toggleFavorite(savedPropertyId: string): Promise<UserSavedProperties> {
    try {
      const saved = await this.getById(savedPropertyId);
      if (!saved) {
        throw new Error("Saved property not found");
      }

      return await this.update(savedPropertyId, {
        is_favorite: !saved.is_favorite,
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
      throw error;
    }
  },

  /**
   * Get user's folders/collections
   */
  async getUserFolders(
    userId: string
  ): Promise<{ name: string; count: number }[]> {
    try {
      const { savedProperties } = await this.getUserSavedProperties(userId, {
        limit: 100,
      });

      const folderMap = new Map<string, number>();

      savedProperties.forEach((saved) => {
        const folderName = saved.folder_name || "Uncategorized";
        folderMap.set(folderName, (folderMap.get(folderName) || 0) + 1);
      });

      return Array.from(folderMap.entries()).map(([name, count]) => ({
        name,
        count,
      }));
    } catch (error) {
      console.error("Error getting user folders:", error);
      throw error;
    }
  },

  /**
   * Get saved properties statistics
   */
  async getUserSavedStats(userId: string): Promise<{
    total: number;
    favorites: number;
    foldersCount: number;
    thisMonth: number;
  }> {
    try {
      const { savedProperties, total } = await this.getUserSavedProperties(
        userId,
        { limit: 100 }
      );

      const folders = await this.getUserFolders(userId);
      
      // Calculate this month's saves
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const thisMonth = savedProperties.filter(
        (saved) => new Date(saved.$createdAt) >= startOfMonth
      ).length;

      return {
        total,
        favorites: savedProperties.filter((s) => s.is_favorite).length,
        foldersCount: folders.length,
        thisMonth,
      };
    } catch (error) {
      console.error("Error getting saved stats:", error);
      throw error;
    }
  },
};

export default savedPropertiesService;
