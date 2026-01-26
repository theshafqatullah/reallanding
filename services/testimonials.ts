import { databases } from "@/services/appwrite";
import { Query } from "appwrite";

const DATABASE_ID = "main";
const TESTIMONIALS_COLLECTION_ID = "testimonials";

export interface Testimonial {
  $id: string;
  name: string;
  role?: string;
  content: string;
  avatar_url?: string;
  rating?: number;
  is_featured?: boolean;
  is_active?: boolean;
  display_order?: number;
}

/**
 * Testimonials Service - CRUD operations for testimonials
 */
export const testimonialsService = {
  /**
   * Get all active testimonials
   */
  async getAll(): Promise<Testimonial[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        TESTIMONIALS_COLLECTION_ID,
        [Query.limit(100)]
      );
      // Filter is_active client-side since it might not be indexed
      return (response.documents as unknown as Testimonial[])
        .filter(t => t.is_active !== false)
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      return [];
    }
  },

  /**
   * Get featured testimonials for homepage
   */
  async getFeatured(limit: number = 6): Promise<Testimonial[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        TESTIMONIALS_COLLECTION_ID,
        [Query.limit(50)]
      );
      // Filter is_featured and is_active client-side
      return (response.documents as unknown as Testimonial[])
        .filter(t => t.is_active !== false && t.is_featured === true)
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
        .slice(0, limit);
    } catch (error) {
      console.error("Error fetching featured testimonials:", error);
      return [];
    }
  },

  /**
   * Get a testimonial by ID
   */
  async getById(id: string): Promise<Testimonial | null> {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        TESTIMONIALS_COLLECTION_ID,
        id
      );
      return response as unknown as Testimonial;
    } catch (error) {
      console.error("Error fetching testimonial:", error);
      return null;
    }
  },
};
