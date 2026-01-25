import { databases } from "@/services/appwrite";
import { Query, ID } from "appwrite";
import { type AgentReviews } from "@/types/appwrite";

const DATABASE_ID = "main";
const AGENT_REVIEWS_COLLECTION_ID = "agent_reviews";

export interface CreateAgentReviewData {
    agent_id: string;
    reviewer_id?: string;
    reviewer_email: string;
    reviewer_name: string;
    title: string;
    review_text: string;
    rating: number;
    pros?: string;
    cons?: string;
}

export interface AgentReviewFilters {
    agent_id?: string;
    reviewer_id?: string;
    is_published?: boolean;
    is_active?: boolean;
    min_rating?: number;
    limit?: number;
    offset?: number;
}

/**
 * Agent Reviews Service - CRUD operations for agent reviews
 */
export const agentReviewsService = {
    /**
     * Get a review by ID
     */
    async getById(reviewId: string): Promise<AgentReviews | null> {
        try {
            const response = await databases.getDocument(
                DATABASE_ID,
                AGENT_REVIEWS_COLLECTION_ID,
                reviewId
            );
            return response as unknown as AgentReviews;
        } catch (error) {
            console.error("Error fetching review by ID:", error);
            return null;
        }
    },

    /**
     * List reviews with filters
     */
    async list(filters?: AgentReviewFilters): Promise<{ reviews: AgentReviews[]; total: number }> {
        try {
            const queries: string[] = [];

            if (filters?.agent_id) {
                queries.push(Query.equal("agent_id", filters.agent_id));
            }
            if (filters?.reviewer_id) {
                queries.push(Query.equal("reviewer_id", filters.reviewer_id));
            }
            if (filters?.is_published !== undefined) {
                queries.push(Query.equal("is_published", filters.is_published));
            }
            if (filters?.is_active !== undefined) {
                queries.push(Query.equal("is_active", filters.is_active));
            }
            if (filters?.min_rating !== undefined) {
                queries.push(Query.greaterThanEqual("rating", filters.min_rating));
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
                AGENT_REVIEWS_COLLECTION_ID,
                queries
            );

            return {
                reviews: response.documents as unknown as AgentReviews[],
                total: response.total,
            };
        } catch (error) {
            console.error("Error listing reviews:", error);
            return { reviews: [], total: 0 };
        }
    },

    /**
     * Get reviews for a specific agent
     */
    async getAgentReviews(
        agentId: string,
        options?: { limit?: number; offset?: number }
    ): Promise<{ reviews: AgentReviews[]; total: number }> {
        return this.list({
            agent_id: agentId,
            is_published: true,
            is_active: true,
            limit: options?.limit || 10,
            offset: options?.offset || 0,
        });
    },

    /**
     * Get review statistics for an agent
     */
    async getAgentReviewStats(agentId: string): Promise<{
        totalReviews: number;
        averageRating: number;
        ratingDistribution: Record<number, number>;
    }> {
        try {
            const { reviews, total } = await this.list({
                agent_id: agentId,
                is_published: true,
                is_active: true,
                limit: 1000, // Get all for accurate stats
            });

            if (total === 0) {
                return {
                    totalReviews: 0,
                    averageRating: 0,
                    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
                };
            }

            const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
            let totalRating = 0;

            reviews.forEach((review) => {
                totalRating += review.rating;
                ratingDistribution[review.rating] = (ratingDistribution[review.rating] || 0) + 1;
            });

            return {
                totalReviews: total,
                averageRating: totalRating / total,
                ratingDistribution,
            };
        } catch (error) {
            console.error("Error getting agent review stats:", error);
            return {
                totalReviews: 0,
                averageRating: 0,
                ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            };
        }
    },

    /**
     * Check if a user has already reviewed an agent
     */
    async hasUserReviewedAgent(agentId: string, reviewerId: string): Promise<boolean> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                AGENT_REVIEWS_COLLECTION_ID,
                [
                    Query.equal("agent_id", agentId),
                    Query.equal("reviewer_id", reviewerId),
                    Query.limit(1),
                ]
            );
            return response.documents.length > 0;
        } catch (error) {
            console.error("Error checking existing review:", error);
            return false;
        }
    },

    /**
     * Get a user's review for an agent
     */
    async getUserReviewForAgent(agentId: string, reviewerId: string): Promise<AgentReviews | null> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                AGENT_REVIEWS_COLLECTION_ID,
                [
                    Query.equal("agent_id", agentId),
                    Query.equal("reviewer_id", reviewerId),
                    Query.limit(1),
                ]
            );
            if (response.documents.length > 0) {
                return response.documents[0] as unknown as AgentReviews;
            }
            return null;
        } catch (error) {
            console.error("Error getting user review for agent:", error);
            return null;
        }
    },

    /**
     * Create a new review
     */
    async create(data: CreateAgentReviewData): Promise<AgentReviews> {
        try {
            // Check if user has already reviewed this agent
            if (data.reviewer_id) {
                const existingReview = await this.hasUserReviewedAgent(data.agent_id, data.reviewer_id);
                if (existingReview) {
                    throw new Error("You have already reviewed this agent");
                }
            }

            const reviewData = {
                ...data,
                is_active: true,
                is_published: true,
                is_verified: false,
                helpful_count: 0,
            };

            const response = await databases.createDocument(
                DATABASE_ID,
                AGENT_REVIEWS_COLLECTION_ID,
                ID.unique(),
                reviewData
            );

            return response as unknown as AgentReviews;
        } catch (error) {
            console.error("Error creating review:", error);
            throw error;
        }
    },

    /**
     * Update a review
     */
    async update(reviewId: string, data: Partial<CreateAgentReviewData>): Promise<AgentReviews> {
        try {
            const response = await databases.updateDocument(
                DATABASE_ID,
                AGENT_REVIEWS_COLLECTION_ID,
                reviewId,
                data
            );
            return response as unknown as AgentReviews;
        } catch (error) {
            console.error("Error updating review:", error);
            throw error;
        }
    },

    /**
     * Delete a review
     */
    async delete(reviewId: string): Promise<void> {
        try {
            await databases.deleteDocument(
                DATABASE_ID,
                AGENT_REVIEWS_COLLECTION_ID,
                reviewId
            );
        } catch (error) {
            console.error("Error deleting review:", error);
            throw error;
        }
    },

    /**
     * Increment helpful count
     */
    async markHelpful(reviewId: string): Promise<void> {
        try {
            const review = await this.getById(reviewId);
            if (review) {
                await databases.updateDocument(
                    DATABASE_ID,
                    AGENT_REVIEWS_COLLECTION_ID,
                    reviewId,
                    { helpful_count: (review.helpful_count || 0) + 1 }
                );
            }
        } catch (error) {
            console.error("Error marking review as helpful:", error);
            throw error;
        }
    },
};
