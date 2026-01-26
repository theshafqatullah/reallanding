import { databases } from "@/services/appwrite";
import { Query } from "appwrite";

const DATABASE_ID = "main";
const FAQS_COLLECTION_ID = "faqs";

export interface FAQ {
  $id: string;
  question: string;
  answer: string;
  category?: string;
  is_active?: boolean;
  display_order?: number;
}

/**
 * FAQs Service - CRUD operations for frequently asked questions
 */
export const faqsService = {
  /**
   * Get all active FAQs
   */
  async getAll(): Promise<FAQ[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        FAQS_COLLECTION_ID,
        [Query.limit(200)]
      );
      // Filter is_active client-side since it might not be indexed
      return (response.documents as unknown as FAQ[])
        .filter(f => f.is_active !== false)
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      return [];
    }
  },

  /**
   * Get FAQs by category
   */
  async getByCategory(category: string): Promise<FAQ[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        FAQS_COLLECTION_ID,
        [Query.limit(100)]
      );
      // Filter by category and is_active client-side
      return (response.documents as unknown as FAQ[])
        .filter(f => f.is_active !== false && f.category === category)
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    } catch (error) {
      console.error("Error fetching FAQs by category:", error);
      return [];
    }
  },

  /**
   * Get all unique FAQ categories
   */
  async getCategories(): Promise<string[]> {
    try {
      const faqs = await this.getAll();
      const categories = new Set(faqs.map(f => f.category).filter(Boolean) as string[]);
      return Array.from(categories);
    } catch (error) {
      console.error("Error fetching FAQ categories:", error);
      return [];
    }
  },

  /**
   * Get a FAQ by ID
   */
  async getById(id: string): Promise<FAQ | null> {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        FAQS_COLLECTION_ID,
        id
      );
      return response as unknown as FAQ;
    } catch (error) {
      console.error("Error fetching FAQ:", error);
      return null;
    }
  },
};
