import { databases, storage } from "@/services/appwrite";
import { Query, ID } from "appwrite";
import { type Properties, PropertyStatus } from "@/types/appwrite";

const DATABASE_ID = "main";
const PROPERTIES_COLLECTION_ID = "properties";
const IMAGES_BUCKET_ID = "images";
const VIDEOS_BUCKET_ID = "videos";

// Appwrite configuration for generating file URLs
const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1";
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "";

export interface CreatePropertyData {
  title: string;
  description?: string;
  property_type_id: string;
  listing_type_id: string;
  property_status?: PropertyStatus;
  location_id: string;
  price: number;
  owner_id?: string;
  agent_id?: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area_unit?: string;
  total_area?: number | null;
  covered_area?: number | null;
  address?: string;
  city_id?: string;
  country_id?: string;
  state_id?: string;
}

export interface CreateFullPropertyData extends CreatePropertyData {
  // Basic Info
  currency?: string;
  price_negotiable?: boolean;
  street_address?: string;
  building_name?: string;
  unit_number?: string;
  sector?: string;
  block?: string;
  plot_number?: string;

  // Details
  kitchens?: number;
  parking_spaces?: number;
  floors?: number;
  floor_number?: number | null;
  facing?: string;
  condition_type?: string;
  furnished_status?: string;
  pet_policy?: string;
  ownership_type?: string;
  year_built?: number | null;
  available_from?: string;
  balconies?: number;
  servant_quarters?: number;
  laundry_rooms?: number;
  store_rooms?: number;
  has_basement?: boolean;
  has_elevator?: boolean;
  has_pool?: boolean;
  has_garden?: boolean;
  has_gym?: boolean;
  has_powder_room?: boolean;
  has_prayer_room?: boolean;
  has_terrace?: boolean;
  has_study_room?: boolean;
  has_central_heating?: boolean;
  has_central_ac?: boolean;
  security_deposit?: number | null;
  maintenance_charges?: number;
  service_charges_monthly?: number | null;
  hoa_fees_monthly?: number | null;
  is_mortgaged?: boolean;
  clear_title?: boolean;
  construction_status?: string;
  possession_status?: string;
  is_west_open?: boolean;
  is_corner?: boolean;
  road_width_feet?: number | null;

  // Media
  main_image_url?: string;
  video_url?: string;
  virtual_tour_url?: string;
  youtube_video_id?: string;
  total_images?: number;
  image_urls?: string[];
  video_urls?: string[];
  image_ids?: string[];
  video_ids?: string[];

  // Contact
  contact_person_name?: string;
  contact_phone?: string;
  contact_email?: string;
  whatsapp_number?: string;

  // SEO & Marketing
  meta_description?: string;
  seo_keywords?: string;
  marketing_tagline?: string;

  // Publish settings
  is_featured?: boolean;
  is_urgent_sale?: boolean;
  is_hot_deal?: boolean;
  is_published?: boolean;
}

export interface PropertyFilters {
  owner_id?: string;
  agent_id?: string;
  status?: string;
  construction_status?: string;
  is_active?: boolean;
  is_published?: boolean;
  is_featured?: boolean;
  property_type_id?: string;
  listing_type_id?: string;
  country_id?: string;
  state_id?: string;
  city_id?: string;
  location_id?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  bathrooms?: number;
  search?: string;
  limit?: number;
  offset?: number;
}

/**
 * Properties Service - CRUD operations for the properties collection
 */
export const propertiesService = {
  /**
   * Get a property by ID
   */
  async getById(propertyId: string): Promise<Properties | null> {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        PROPERTIES_COLLECTION_ID,
        propertyId
      );
      return response as unknown as Properties;
    } catch (error) {
      console.error("Error fetching property by ID:", error);
      throw error;
    }
  },

  /**
   * Get a property by slug
   */
  async getBySlug(slug: string): Promise<Properties | null> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        PROPERTIES_COLLECTION_ID,
        [Query.equal("slug", slug), Query.limit(1)]
      );

      if (response.documents.length > 0) {
        return response.documents[0] as unknown as Properties;
      }
      return null;
    } catch (error) {
      console.error("Error fetching property by slug:", error);
      throw error;
    }
  },

  /**
   * Get properties by owner ID (user's own listings)
   */
  async getByOwnerId(ownerId: string, options?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ properties: Properties[]; total: number }> {
    try {
      const queries: string[] = [Query.equal("owner_id", ownerId)];

      if (options?.status && options.status !== "all") {
        queries.push(Query.equal("verification_status", options.status));
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
        PROPERTIES_COLLECTION_ID,
        queries
      );

      return {
        properties: response.documents as unknown as Properties[],
        total: response.total,
      };
    } catch (error) {
      console.error("Error fetching properties by owner:", error);
      throw error;
    }
  },

  /**
   * Get properties by agent ID
   */
  async getByAgentId(agentId: string, options?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ properties: Properties[]; total: number }> {
    try {
      const queries: string[] = [Query.equal("agent_id", agentId)];

      if (options?.status && options.status !== "all") {
        queries.push(Query.equal("verification_status", options.status));
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
        PROPERTIES_COLLECTION_ID,
        queries
      );

      return {
        properties: response.documents as unknown as Properties[],
        total: response.total,
      };
    } catch (error) {
      console.error("Error fetching properties by agent:", error);
      throw error;
    }
  },

  /**
   * List properties with filters
   */
  async list(filters?: PropertyFilters): Promise<{ properties: Properties[]; total: number }> {
    try {
      const queries: string[] = [];

      if (filters?.owner_id) {
        queries.push(Query.equal("owner_id", filters.owner_id));
      }
      if (filters?.agent_id) {
        queries.push(Query.equal("agent_id", filters.agent_id));
      }
      if (filters?.is_active !== undefined) {
        queries.push(Query.equal("is_active", filters.is_active));
      }
      if (filters?.is_published !== undefined) {
        queries.push(Query.equal("is_published", filters.is_published));
      }
      if (filters?.is_featured !== undefined) {
        queries.push(Query.equal("is_featured", filters.is_featured));
      }
      if (filters?.property_type_id) {
        queries.push(Query.equal("property_type_id", filters.property_type_id));
      }
      if (filters?.listing_type_id) {
        queries.push(Query.equal("listing_type_id", filters.listing_type_id));
      }
      if (filters?.country_id) {
        queries.push(Query.equal("country_id", filters.country_id));
      }
      if (filters?.state_id) {
        queries.push(Query.equal("state_id", filters.state_id));
      }
      if (filters?.city_id) {
        queries.push(Query.equal("city_id", filters.city_id));
      }
      if (filters?.location_id) {
        queries.push(Query.equal("location_id", filters.location_id));
      }
      if (filters?.min_price !== undefined) {
        queries.push(Query.greaterThanEqual("price", filters.min_price));
      }
      if (filters?.max_price !== undefined) {
        queries.push(Query.lessThanEqual("price", filters.max_price));
      }
      if (filters?.bedrooms !== undefined) {
        queries.push(Query.equal("bedrooms", filters.bedrooms));
      }
      if (filters?.bathrooms !== undefined) {
        queries.push(Query.equal("bathrooms", filters.bathrooms));
      }
      if (filters?.construction_status) {
        queries.push(Query.equal("construction_status", filters.construction_status));
      }
      if (filters?.search) {
        queries.push(Query.search("title", filters.search));
      }
      if (filters?.limit) {
        queries.push(Query.limit(filters.limit));
      }
      if (filters?.offset) {
        queries.push(Query.offset(filters.offset));
      }

      queries.push(Query.orderDesc("$createdAt"));

      const response = await databases.listDocuments(
        DATABASE_ID,
        PROPERTIES_COLLECTION_ID,
        queries
      );

      return {
        properties: response.documents as unknown as Properties[],
        total: response.total,
      };
    } catch (error) {
      console.error("Error listing properties:", error);
      throw error;
    }
  },

  /**
   * Get property count by city ID
   */
  async getCountByCity(cityId: string): Promise<number> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        PROPERTIES_COLLECTION_ID,
        [
          Query.equal("city_id", cityId),
          Query.equal("is_active", true),
          Query.equal("is_published", true),
          Query.limit(1),
        ]
      );
      return response.total;
    } catch (error) {
      console.error("Error getting property count by city:", error);
      return 0;
    }
  },

  /**
   * Get property counts for multiple cities
   */
  async getCountsByCities(cityIds: string[]): Promise<Record<string, number>> {
    try {
      const counts: Record<string, number> = {};
      await Promise.all(
        cityIds.map(async (cityId) => {
          counts[cityId] = await this.getCountByCity(cityId);
        })
      );
      return counts;
    } catch (error) {
      console.error("Error getting property counts by cities:", error);
      return {};
    }
  },

  /**
   * Create a new property
   */
  async create(data: CreatePropertyData): Promise<Properties> {
    try {
      const propertyData = {
        ...data,
        is_active: true,
        is_published: false,
        is_featured: false,
        is_verified: false,
        view_count: 0,
        inquiry_count: 0,
        favorite_count: 0,
        verification_status: "pending",
        availability: "available",
        currency: "PKR",
        condition_type: "new",
        ownership_type: "freehold",
        kitchens: 1,
        parking_spaces: 0,
        floors: 1,
        price_negotiable: true,
      };

      const response = await databases.createDocument(
        DATABASE_ID,
        PROPERTIES_COLLECTION_ID,
        ID.unique(),
        propertyData
      );

      return response as unknown as Properties;
    } catch (error) {
      console.error("Error creating property:", error);
      throw error;
    }
  },

  /**
   * Update a property
   */
  async update(propertyId: string, data: Partial<Properties>): Promise<Properties> {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        PROPERTIES_COLLECTION_ID,
        propertyId,
        data as Record<string, unknown>
      );

      return response as unknown as Properties;
    } catch (error) {
      console.error("Error updating property:", error);
      throw error;
    }
  },

  /**
   * Delete a property
   */
  async delete(propertyId: string): Promise<void> {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        PROPERTIES_COLLECTION_ID,
        propertyId
      );
    } catch (error) {
      console.error("Error deleting property:", error);
      throw error;
    }
  },

  /**
   * Upload property image
   */
  async uploadImage(file: File): Promise<{ fileId: string; fileUrl: string }> {
    try {
      const uploadedFile = await storage.createFile(
        IMAGES_BUCKET_ID,
        ID.unique(),
        file
      );

      const fileUrl = `${APPWRITE_ENDPOINT}/storage/buckets/${IMAGES_BUCKET_ID}/files/${uploadedFile.$id}/view?project=${APPWRITE_PROJECT_ID}`;

      return {
        fileId: uploadedFile.$id,
        fileUrl,
      };
    } catch (error) {
      console.error("Error uploading property image:", error);
      throw error;
    }
  },

  /**
   * Delete property image
   */
  async deleteImage(fileId: string): Promise<void> {
    try {
      await storage.deleteFile(IMAGES_BUCKET_ID, fileId);
    } catch (error) {
      console.error("Error deleting property image:", error);
      throw error;
    }
  },

  /**
   * Upload property video
   */
  async uploadVideo(file: File): Promise<{ fileId: string; fileUrl: string }> {
    try {
      const uploadedFile = await storage.createFile(
        VIDEOS_BUCKET_ID,
        ID.unique(),
        file
      );

      const fileUrl = `${APPWRITE_ENDPOINT}/storage/buckets/${VIDEOS_BUCKET_ID}/files/${uploadedFile.$id}/view?project=${APPWRITE_PROJECT_ID}`;

      return {
        fileId: uploadedFile.$id,
        fileUrl,
      };
    } catch (error) {
      console.error("Error uploading property video:", error);
      throw error;
    }
  },

  /**
   * Delete property video
   */
  async deleteVideo(fileId: string): Promise<void> {
    try {
      await storage.deleteFile(VIDEOS_BUCKET_ID, fileId);
    } catch (error) {
      console.error("Error deleting property video:", error);
      throw error;
    }
  },

  /**
   * Create a full property with all details
   */
  async createFullProperty(data: CreateFullPropertyData): Promise<Properties> {
    try {
      // Filter out undefined and null values, keeping only valid data
      const cleanData: Record<string, unknown> = {};
      
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          cleanData[key] = value;
        }
      });

      // Set defaults
      const propertyData = {
        ...cleanData,
        is_active: true,
        is_verified: false,
        view_count: 0,
        inquiry_count: 0,
        favorite_count: 0,
        quality_score: 0,
      };

      const response = await databases.createDocument(
        DATABASE_ID,
        PROPERTIES_COLLECTION_ID,
        ID.unique(),
        propertyData
      );

      return response as unknown as Properties;
    } catch (error) {
      console.error("Error creating full property:", error);
      throw error;
    }
  },

  /**
   * Update property with image URLs and IDs
   * Images are stored as arrays directly on the property document
   */
  async updatePropertyImages(propertyId: string, images: { url: string; id?: string }[]): Promise<void> {
    try {
      const imageUrls = images.map(img => img.url);
      const imageIds = images.filter(img => img.id).map(img => img.id!);
      const mainImageUrl = images.length > 0 ? images[0].url : null;

      await databases.updateDocument(
        DATABASE_ID,
        PROPERTIES_COLLECTION_ID,
        propertyId,
        {
          image_urls: imageUrls,
          image_ids: imageIds,
          main_image_url: mainImageUrl,
          total_images: images.length,
        }
      );
    } catch (error) {
      console.error("Error updating property images:", error);
      throw error;
    }
  },

  /**
   * Update property with video URLs and IDs
   * Videos are stored as arrays directly on the property document
   */
  async updatePropertyVideos(propertyId: string, videos: { url: string; id?: string }[]): Promise<void> {
    try {
      const videoUrls = videos.map(vid => vid.url);
      const videoIds = videos.filter(vid => vid.id).map(vid => vid.id!);
      const mainVideoUrl = videos.length > 0 ? videos[0].url : null;

      await databases.updateDocument(
        DATABASE_ID,
        PROPERTIES_COLLECTION_ID,
        propertyId,
        {
          video_urls: videoUrls,
          video_ids: videoIds,
          video_url: mainVideoUrl,
        }
      );
    } catch (error) {
      console.error("Error updating property videos:", error);
      throw error;
    }
  },

  /**
   * Get property images by property ID
   * Returns the image_urls array from the property document
   */
  async getPropertyImages(propertyId: string): Promise<string[]> {
    try {
      const property = await databases.getDocument(
        DATABASE_ID,
        PROPERTIES_COLLECTION_ID,
        propertyId
      );

      return (property as unknown as Properties).image_urls || [];
    } catch (error) {
      console.error("Error fetching property images:", error);
      throw error;
    }
  },

  /**
   * Get property videos by property ID
   * Returns the video_urls array from the property document
   */
  async getPropertyVideos(propertyId: string): Promise<string[]> {
    try {
      const property = await databases.getDocument(
        DATABASE_ID,
        PROPERTIES_COLLECTION_ID,
        propertyId
      );

      return (property as unknown as Properties).video_urls || [];
    } catch (error) {
      console.error("Error fetching property videos:", error);
      throw error;
    }
  },

  /**
   * Clear all images from a property
   */
  async clearPropertyImages(propertyId: string): Promise<void> {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        PROPERTIES_COLLECTION_ID,
        propertyId,
        {
          image_urls: [],
          image_ids: [],
          main_image_url: null,
          total_images: 0,
        }
      );
    } catch (error) {
      console.error("Error clearing property images:", error);
      throw error;
    }
  },

  /**
   * Increment view count
   */
  async incrementViewCount(propertyId: string, currentViews: number): Promise<void> {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        PROPERTIES_COLLECTION_ID,
        propertyId,
        { view_count: currentViews + 1 }
      );
    } catch (error) {
      console.error("Error incrementing view count:", error);
      // Don't throw - this is not critical
    }
  },

  /**
   * Get property statistics for a user
   */
  async getUserPropertyStats(userId: string): Promise<{
    total: number;
    active: number;
    pending: number;
    sold: number;
    totalViews: number;
    totalInquiries: number;
  }> {
    try {
      const allProperties = await this.getByOwnerId(userId, { limit: 100 });
      
      const stats = {
        total: allProperties.total,
        active: 0,
        pending: 0,
        sold: 0,
        totalViews: 0,
        totalInquiries: 0,
      };

      allProperties.properties.forEach((property) => {
        if (property.verification_status === "approved" && property.is_active) {
          stats.active++;
        } else if (property.verification_status === "pending") {
          stats.pending++;
        } else if (property.availability === "sold") {
          stats.sold++;
        }
        stats.totalViews += property.view_count || 0;
        stats.totalInquiries += property.inquiry_count || 0;
      });

      return stats;
    } catch (error) {
      console.error("Error getting user property stats:", error);
      throw error;
    }
  },

  /**
   * Get featured properties
   */
  async getFeatured(limit: number = 6): Promise<Properties[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        PROPERTIES_COLLECTION_ID,
        [
          Query.equal("is_featured", true),
          Query.equal("is_active", true),
          Query.equal("is_published", true),
          Query.limit(limit),
          Query.orderDesc("$createdAt"),
        ]
      );

      return response.documents as unknown as Properties[];
    } catch (error) {
      console.error("Error fetching featured properties:", error);
      throw error;
    }
  },
};

export default propertiesService;
