import { databases } from "@/services/appwrite";
import { Query } from "appwrite";
import { type BlogPosts, Category, Status17 } from "@/types/appwrite";

const DATABASE_ID = "main";
const BLOG_POSTS_COLLECTION_ID = "blog_posts";

export interface BlogFilters {
  category?: Category;
  status?: Status17;
  is_featured?: boolean;
  is_pinned?: boolean;
  author_id?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

/**
 * Blog Posts Service - CRUD operations for blog posts
 */
export const blogsService = {
  /**
   * Get a blog post by ID
   */
  async getById(postId: string): Promise<BlogPosts | null> {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        BLOG_POSTS_COLLECTION_ID,
        postId
      );
      return response as unknown as BlogPosts;
    } catch (error) {
      console.error("Error fetching blog post by ID:", error);
      return null;
    }
  },

  /**
   * Get a blog post by slug
   */
  async getBySlug(slug: string): Promise<BlogPosts | null> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        BLOG_POSTS_COLLECTION_ID,
        [
          Query.equal("slug", slug),
          Query.equal("is_active", true),
          Query.limit(1),
        ]
      );

      if (response.documents.length > 0) {
        return response.documents[0] as unknown as BlogPosts;
      }
      return null;
    } catch (error) {
      console.error("Error fetching blog post by slug:", error);
      return null;
    }
  },

  /**
   * Get published blog posts
   */
  async getPublished(options?: {
    category?: Category;
    limit?: number;
    offset?: number;
  }): Promise<{ posts: BlogPosts[]; total: number }> {
    try {
      const queries: string[] = [
        Query.equal("is_active", true),
        Query.equal("status", Status17.PUBLISHED),
        Query.orderDesc("published_at"),
      ];

      if (options?.category) {
        queries.push(Query.equal("category", options.category));
      }
      if (options?.limit) {
        queries.push(Query.limit(options.limit));
      }
      if (options?.offset) {
        queries.push(Query.offset(options.offset));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        BLOG_POSTS_COLLECTION_ID,
        queries
      );

      return {
        posts: response.documents as unknown as BlogPosts[],
        total: response.total,
      };
    } catch (error) {
      console.error("Error fetching published blog posts:", error);
      return { posts: [], total: 0 };
    }
  },

  /**
   * Get featured blog posts
   */
  async getFeatured(limit: number = 3): Promise<BlogPosts[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        BLOG_POSTS_COLLECTION_ID,
        [
          Query.equal("is_active", true),
          Query.equal("status", Status17.PUBLISHED),
          Query.equal("is_featured", true),
          Query.orderDesc("published_at"),
          Query.limit(limit),
        ]
      );

      return response.documents as unknown as BlogPosts[];
    } catch (error) {
      console.error("Error fetching featured blog posts:", error);
      return [];
    }
  },

  /**
   * Get latest blog posts
   */
  async getLatest(limit: number = 6): Promise<BlogPosts[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        BLOG_POSTS_COLLECTION_ID,
        [
          Query.equal("is_active", true),
          Query.equal("status", Status17.PUBLISHED),
          Query.orderDesc("published_at"),
          Query.limit(limit),
        ]
      );

      return response.documents as unknown as BlogPosts[];
    } catch (error) {
      console.error("Error fetching latest blog posts:", error);
      return [];
    }
  },

  /**
   * Get pinned blog posts
   */
  async getPinned(): Promise<BlogPosts[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        BLOG_POSTS_COLLECTION_ID,
        [
          Query.equal("is_active", true),
          Query.equal("status", Status17.PUBLISHED),
          Query.equal("is_pinned", true),
          Query.orderDesc("published_at"),
          Query.limit(5),
        ]
      );

      return response.documents as unknown as BlogPosts[];
    } catch (error) {
      console.error("Error fetching pinned blog posts:", error);
      return [];
    }
  },

  /**
   * Get blog posts by category
   */
  async getByCategory(
    category: Category,
    options?: { limit?: number; offset?: number }
  ): Promise<{ posts: BlogPosts[]; total: number }> {
    try {
      const queries: string[] = [
        Query.equal("is_active", true),
        Query.equal("status", Status17.PUBLISHED),
        Query.equal("category", category),
        Query.orderDesc("published_at"),
      ];

      if (options?.limit) {
        queries.push(Query.limit(options.limit));
      }
      if (options?.offset) {
        queries.push(Query.offset(options.offset));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        BLOG_POSTS_COLLECTION_ID,
        queries
      );

      return {
        posts: response.documents as unknown as BlogPosts[],
        total: response.total,
      };
    } catch (error) {
      console.error("Error fetching blog posts by category:", error);
      return { posts: [], total: 0 };
    }
  },

  /**
   * Search blog posts
   */
  async search(
    searchQuery: string,
    options?: { limit?: number; offset?: number }
  ): Promise<{ posts: BlogPosts[]; total: number }> {
    try {
      const queries: string[] = [
        Query.equal("is_active", true),
        Query.equal("status", Status17.PUBLISHED),
        Query.search("title", searchQuery),
      ];

      if (options?.limit) {
        queries.push(Query.limit(options.limit));
      }
      if (options?.offset) {
        queries.push(Query.offset(options.offset));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        BLOG_POSTS_COLLECTION_ID,
        queries
      );

      return {
        posts: response.documents as unknown as BlogPosts[],
        total: response.total,
      };
    } catch (error) {
      console.error("Error searching blog posts:", error);
      return { posts: [], total: 0 };
    }
  },

  /**
   * Increment view count for a blog post
   */
  async incrementViews(postId: string): Promise<void> {
    try {
      const post = await this.getById(postId);
      if (post) {
        await databases.updateDocument(
          DATABASE_ID,
          BLOG_POSTS_COLLECTION_ID,
          postId,
          {
            views_count: (post.views_count || 0) + 1,
          }
        );
      }
    } catch (error) {
      console.error("Error incrementing blog post views:", error);
    }
  },

  /**
   * Get popular blog posts by views
   */
  async getPopular(limit: number = 5): Promise<BlogPosts[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        BLOG_POSTS_COLLECTION_ID,
        [
          Query.equal("is_active", true),
          Query.equal("status", Status17.PUBLISHED),
          Query.orderDesc("views_count"),
          Query.limit(limit),
        ]
      );

      return response.documents as unknown as BlogPosts[];
    } catch (error) {
      console.error("Error fetching popular blog posts:", error);
      return [];
    }
  },

  /**
   * Get related blog posts by category (excluding current post)
   */
  async getRelated(
    postId: string,
    category: Category,
    limit: number = 4
  ): Promise<BlogPosts[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        BLOG_POSTS_COLLECTION_ID,
        [
          Query.equal("is_active", true),
          Query.equal("status", Status17.PUBLISHED),
          Query.equal("category", category),
          Query.notEqual("$id", postId),
          Query.orderDesc("published_at"),
          Query.limit(limit),
        ]
      );

      return response.documents as unknown as BlogPosts[];
    } catch (error) {
      console.error("Error fetching related blog posts:", error);
      return [];
    }
  },

  /**
   * Get all categories with post counts
   */
  async getCategoryCounts(): Promise<{ category: Category; count: number }[]> {
    const categories = Object.values(Category);
    const counts: { category: Category; count: number }[] = [];

    try {
      for (const category of categories) {
        const response = await databases.listDocuments(
          DATABASE_ID,
          BLOG_POSTS_COLLECTION_ID,
          [
            Query.equal("is_active", true),
            Query.equal("status", Status17.PUBLISHED),
            Query.equal("category", category),
            Query.limit(1),
          ]
        );
        if (response.total > 0) {
          counts.push({ category, count: response.total });
        }
      }

      return counts;
    } catch (error) {
      console.error("Error fetching category counts:", error);
      return [];
    }
  },
};
