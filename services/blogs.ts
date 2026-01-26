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
          Query.limit(10),
        ]
      );

      // Filter is_active client-side since it may not be indexed
      const activePost = (response.documents as unknown as BlogPosts[]).find(
        post => post.is_active === true
      );
      if (activePost) {
        return activePost;
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
      const requestedLimit = options?.limit || 25;
      const requestedOffset = options?.offset || 0;
      
      const queries: string[] = [
        Query.orderDesc("published_at"),
        Query.limit(200), // Fetch more to filter client-side
      ];

      if (options?.category) {
        queries.push(Query.equal("category", options.category));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        BLOG_POSTS_COLLECTION_ID,
        queries
      );

      // Filter status and is_active client-side since they may not be indexed
      const activePosts = (response.documents as unknown as BlogPosts[]).filter(
        post => (post.status as unknown as string) === Status17.PUBLISHED && post.is_active === true
      );
      
      const paginatedPosts = activePosts.slice(requestedOffset, requestedOffset + requestedLimit);

      return {
        posts: paginatedPosts,
        total: activePosts.length,
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
          Query.orderDesc("published_at"),
          Query.limit(100),
        ]
      );

      // Filter status, is_active and is_featured client-side since they may not be indexed
      const featured = (response.documents as unknown as BlogPosts[]).filter(
        post => (post.status as unknown as string) === Status17.PUBLISHED && post.is_active === true && post.is_featured === true
      );

      return featured.slice(0, limit);
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
          Query.orderDesc("published_at"),
          Query.limit(100),
        ]
      );

      // Filter status and is_active client-side since they may not be indexed
      const activePosts = (response.documents as unknown as BlogPosts[]).filter(
        post => (post.status as unknown as string) === Status17.PUBLISHED && post.is_active === true
      );

      return activePosts.slice(0, limit);
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
          Query.orderDesc("published_at"),
          Query.limit(100),
        ]
      );

      // Filter status, is_active and is_pinned client-side since they may not be indexed
      const pinnedPosts = (response.documents as unknown as BlogPosts[]).filter(
        post => (post.status as unknown as string) === Status17.PUBLISHED && post.is_active === true && post.is_pinned === true
      );

      return pinnedPosts.slice(0, 5);
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
      const requestedLimit = options?.limit || 25;
      const requestedOffset = options?.offset || 0;
      
      const queries: string[] = [
        Query.equal("category", category),
        Query.orderDesc("published_at"),
        Query.limit(200), // Fetch more to filter client-side
      ];

      const response = await databases.listDocuments(
        DATABASE_ID,
        BLOG_POSTS_COLLECTION_ID,
        queries
      );

      // Filter status and is_active client-side since they may not be indexed
      const activePosts = (response.documents as unknown as BlogPosts[]).filter(
        post => (post.status as unknown as string) === Status17.PUBLISHED && post.is_active === true
      );
      
      const paginatedPosts = activePosts.slice(requestedOffset, requestedOffset + requestedLimit);

      return {
        posts: paginatedPosts,
        total: activePosts.length,
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
      const requestedLimit = options?.limit || 25;
      const requestedOffset = options?.offset || 0;
      
      const queries: string[] = [
        Query.search("title", searchQuery),
        Query.limit(200), // Fetch more to filter client-side
      ];

      const response = await databases.listDocuments(
        DATABASE_ID,
        BLOG_POSTS_COLLECTION_ID,
        queries
      );

      // Filter status and is_active client-side since they may not be indexed
      const activePosts = (response.documents as unknown as BlogPosts[]).filter(
        post => (post.status as unknown as string) === Status17.PUBLISHED && post.is_active === true
      );
      
      const paginatedPosts = activePosts.slice(requestedOffset, requestedOffset + requestedLimit);

      return {
        posts: paginatedPosts,
        total: activePosts.length,
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
          Query.orderDesc("views_count"),
          Query.limit(100),
        ]
      );

      // Filter status and is_active client-side since they may not be indexed
      const activePosts = (response.documents as unknown as BlogPosts[]).filter(
        post => (post.status as unknown as string) === Status17.PUBLISHED && post.is_active === true
      );

      return activePosts.slice(0, limit);
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
          Query.equal("category", category),
          Query.notEqual("$id", postId),
          Query.orderDesc("published_at"),
          Query.limit(100),
        ]
      );

      // Filter status and is_active client-side since they may not be indexed
      const activePosts = (response.documents as unknown as BlogPosts[]).filter(
        post => (post.status as unknown as string) === Status17.PUBLISHED && post.is_active === true
      );

      return activePosts.slice(0, limit);
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
      // Fetch all posts at once to count by category
      const response = await databases.listDocuments(
        DATABASE_ID,
        BLOG_POSTS_COLLECTION_ID,
        [
          Query.limit(500),
        ]
      );

      // Filter status and is_active client-side since they may not be indexed
      const activePosts = (response.documents as unknown as BlogPosts[]).filter(
        post => (post.status as unknown as string) === Status17.PUBLISHED && post.is_active === true
      );

      // Count posts by category
      for (const category of categories) {
        const count = activePosts.filter(post => post.category === category).length;
        if (count > 0) {
          counts.push({ category, count });
        }
      }

      return counts;
    } catch (error) {
      console.error("Error fetching category counts:", error);
      return [];
    }
  },
};
