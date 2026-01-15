import { databases, storage } from "@/services/appwrite";
import { Query, ID } from "appwrite";
import { type Users, UserType, AvailabilityStatus, AccountStatus } from "@/types/appwrite";

const DATABASE_ID = "main";
const USERS_COLLECTION_ID = "users";
const STORAGE_BUCKET_ID = "images";

export interface CreateUserData {
  user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  phone?: string;
  user_type?: UserType;
}

export interface UpdateUserData extends Partial<Omit<Users, "$id" | "$createdAt" | "$updatedAt" | "$permissions" | "$databaseId" | "$collectionId" | "user_id" | "email">> {}

/**
 * Users Service - CRUD operations for the users collection
 */
export const usersService = {
  /**
   * Get a user profile by their auth user ID
   */
  async getByUserId(userId: string): Promise<Users | null> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.equal("user_id", userId), Query.limit(1)]
      );

      if (response.documents.length > 0) {
        return response.documents[0] as unknown as Users;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user by user_id:", error);
      throw error;
    }
  },

  /**
   * Get a user profile by document ID
   */
  async getById(documentId: string): Promise<Users | null> {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        documentId
      );
      return response as unknown as Users;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }
  },

  /**
   * Get a user profile by username
   */
  async getByUsername(username: string): Promise<Users | null> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.equal("username", username), Query.limit(1)]
      );

      if (response.documents.length > 0) {
        return response.documents[0] as unknown as Users;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user by username:", error);
      throw error;
    }
  },

  /**
   * Create a new user profile
   */
  async create(data: CreateUserData): Promise<Users> {
    try {
      const defaultData = {
        user_id: data.user_id,
        email: data.email,
        username: data.username || data.email.split("@")[0],
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        phone: data.phone || null,
        user_type: data.user_type || UserType.USER,
        is_active: true,
        is_premium: false,
        is_verified: false,
        is_featured: false,
        accepts_inquiries: true,
        availability_status: AvailabilityStatus.AVAILABLE,
        account_status: AccountStatus.ACTIVE,
        profile_completion_percentage: 20,
        profile_views: 0,
        total_listings: 0,
        active_listings: 0,
        total_sales: 0,
        total_reviews: 0,
        rating: 0,
        experience_years: 0,
        team_size: 0,
        response_time_hours: 24,
        response_rate_percentage: 0,
        deals_closed: 0,
        total_inquiries_received: 0,
        total_inquiries_sent: 0,
        total_earnings: 0,
        pending_commissions: 0,
        credits_balance: 0,
        email_notifications_enabled: true,
        sms_notifications_enabled: false,
        push_notifications_enabled: true,
        marketing_emails_enabled: false,
        identity_verified: false,
        documents_verified: false,
        background_check_completed: false,
        bank_account_verified: false,
        payment_method_verified: false,
      };

      const response = await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        ID.unique(),
        defaultData
      );

      return response as unknown as Users;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  /**
   * Update a user profile
   */
  async update(documentId: string, data: UpdateUserData): Promise<Users> {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        documentId,
        data as Record<string, unknown>
      );

      return response as unknown as Users;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  /**
   * Delete a user profile
   */
  async delete(documentId: string): Promise<void> {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        documentId
      );
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },

  /**
   * Upload a profile or banner image
   */
  async uploadImage(
    documentId: string,
    file: File,
    field: "profile_image_url" | "banner_image_url"
  ): Promise<string> {
    try {
      // Upload to storage
      const uploadedFile = await storage.createFile(
        STORAGE_BUCKET_ID,
        ID.unique(),
        file
      );

      // Get the file URL
      const fileUrl = storage.getFilePreview(STORAGE_BUCKET_ID, uploadedFile.$id).toString();

      // Update the user document with the new image URL
      await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        documentId,
        { [field]: fileUrl }
      );

      return fileUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  },

  /**
   * Check if a username is available
   */
  async isUsernameAvailable(username: string, excludeUserId?: string): Promise<boolean> {
    try {
      const queries = [Query.equal("username", username), Query.limit(1)];
      
      const response = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        queries
      );

      if (response.documents.length === 0) {
        return true;
      }

      // If excludeUserId is provided, check if the found user is the same
      if (excludeUserId && response.documents[0]) {
        const foundUser = response.documents[0] as unknown as Users;
        return foundUser.user_id === excludeUserId;
      }

      return false;
    } catch (error) {
      console.error("Error checking username availability:", error);
      throw error;
    }
  },

  /**
   * Get users list with pagination and filters
   */
  async list(options?: {
    limit?: number;
    offset?: number;
    userType?: UserType;
    isVerified?: boolean;
    isActive?: boolean;
    search?: string;
  }): Promise<{ users: Users[]; total: number }> {
    try {
      const queries: string[] = [];

      if (options?.limit) {
        queries.push(Query.limit(options.limit));
      }
      if (options?.offset) {
        queries.push(Query.offset(options.offset));
      }
      if (options?.userType) {
        queries.push(Query.equal("user_type", options.userType));
      }
      if (options?.isVerified !== undefined) {
        queries.push(Query.equal("is_verified", options.isVerified));
      }
      if (options?.isActive !== undefined) {
        queries.push(Query.equal("is_active", options.isActive));
      }
      if (options?.search) {
        queries.push(Query.search("first_name", options.search));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        queries
      );

      return {
        users: response.documents as unknown as Users[],
        total: response.total,
      };
    } catch (error) {
      console.error("Error listing users:", error);
      throw error;
    }
  },

  /**
   * Get featured agents
   */
  async getFeaturedAgents(limit: number = 4): Promise<Users[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [
          Query.equal("user_type", UserType.AGENT),
          Query.equal("is_featured", true),
          Query.equal("is_active", true),
          Query.limit(limit),
        ]
      );

      return response.documents as unknown as Users[];
    } catch (error) {
      console.error("Error fetching featured agents:", error);
      throw error;
    }
  },

  /**
   * Increment profile views
   */
  async incrementProfileViews(documentId: string, currentViews: number): Promise<void> {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        documentId,
        { profile_views: currentViews + 1 }
      );
    } catch (error) {
      console.error("Error incrementing profile views:", error);
      // Don't throw - this is not critical
    }
  },

  /**
   * Calculate and update profile completion percentage
   */
  calculateProfileCompletion(profile: Partial<Users>): number {
    const requiredFields = [
      "first_name",
      "last_name",
      "phone",
      "bio",
      "profile_image_url",
    ];

    const optionalFields = [
      "address",
      "city",
      "state",
      "country",
      "designation",
      "company_name",
      "website_url",
      "social_media_linkedin",
      "experience_years",
      "specializations",
      "languages_spoken",
    ];

    let completedRequired = 0;
    let completedOptional = 0;

    requiredFields.forEach((field) => {
      if (profile[field as keyof Users]) {
        completedRequired++;
      }
    });

    optionalFields.forEach((field) => {
      if (profile[field as keyof Users]) {
        completedOptional++;
      }
    });

    // Required fields account for 60%, optional for 40%
    const requiredScore = (completedRequired / requiredFields.length) * 60;
    const optionalScore = (completedOptional / optionalFields.length) * 40;

    return Math.round(requiredScore + optionalScore);
  },
};

export default usersService;
