import { databases } from "@/services/appwrite";
import { Query, ID } from "appwrite";
import { type PropertyReviews } from "@/types/appwrite";

const DATABASE_ID = "main";
const PROPERTY_REVIEWS_COLLECTION_ID = "property_reviews";

export interface CreatePropertyReviewData {
    property_id: string;
    reviewer_id?: string;
    reviewer_email: string;
    reviewer_name: string;
    title: string;
    review_text?: string | null;
    rating: number;
    review_type?: string;
    pros?: string;
    cons?: string;
    is_verified_buyer?: boolean;
}

export interface PropertyReviewFilters {
    property_id?: string;
    reviewer_id?: string;
    is_published?: boolean;
    is_active?: boolean;
    is_approved?: boolean;
    min_rating?: number;
    review_type?: string;
    limit?: number;
    offset?: number;
}

/**
 * Property Reviews Service - CRUD operations for property reviews
 */
export const propertyReviewsService = {
    /**
     * Get a review by ID
     */
    async getById(reviewId: string): Promise<PropertyReviews | null> {
        try {
            const response = await databases.getDocument(
                DATABASE_ID,
                PROPERTY_REVIEWS_COLLECTION_ID,
                reviewId
            );
            return response as unknown as PropertyReviews;
        } catch (error) {
            console.error("Error fetching property review by ID:", error);
            return null;
        }
    },

    /**
     * List reviews with filters
     */
    async list(filters?: PropertyReviewFilters): Promise<{ reviews: PropertyReviews[]; total: number }> {
        try {
            const queries: string[] = [];
            
            // Store filters for client-side filtering (may not be indexed)
            const filterIsActive = filters?.is_active;
            const filterIsPublished = filters?.is_published;

            if (filters?.property_id) {
                queries.push(Query.equal("property_id", filters.property_id));
            }
            if (filters?.reviewer_id) {
                queries.push(Query.equal("reviewer_id", filters.reviewer_id));
            }
            // is_published handled client-side since it may not be indexed
            // is_active handled client-side since it may not be indexed
            if (filters?.is_approved !== undefined) {
                queries.push(Query.equal("is_approved", filters.is_approved));
            }
            if (filters?.min_rating !== undefined) {
                queries.push(Query.greaterThanEqual("rating", filters.min_rating));
            }
            if (filters?.review_type) {
                queries.push(Query.equal("review_type", filters.review_type));
            }
            
            // Fetch more if we need to filter client-side
            const requestedLimit = filters?.limit || 25;
            const requestedOffset = filters?.offset || 0;
            const needsClientFilter = filterIsActive !== undefined || filterIsPublished !== undefined;
            if (needsClientFilter) {
                queries.push(Query.limit(200));
            } else {
                if (filters?.limit) {
                    queries.push(Query.limit(filters.limit));
                }
                if (filters?.offset) {
                    queries.push(Query.offset(filters.offset));
                }
            }

            queries.push(Query.orderDesc("$createdAt"));

            const response = await databases.listDocuments(
                DATABASE_ID,
                PROPERTY_REVIEWS_COLLECTION_ID,
                queries
            );

            let reviews = response.documents as unknown as PropertyReviews[];
            let total = response.total;
            
            // Apply client-side filtering for is_active and is_published
            if (needsClientFilter) {
                reviews = reviews.filter(r => {
                    if (filterIsActive !== undefined && r.is_active !== filterIsActive) return false;
                    if (filterIsPublished !== undefined && r.is_published !== filterIsPublished) return false;
                    return true;
                });
                total = reviews.length;
                reviews = reviews.slice(requestedOffset, requestedOffset + requestedLimit);
            }

            return {
                reviews,
                total,
            };
        } catch (error) {
            console.error("Error listing property reviews:", error);
            return { reviews: [], total: 0 };
        }
    },

    /**
     * Get reviews for a specific property
     */
    async getPropertyReviews(
        propertyId: string,
        options?: { limit?: number; offset?: number }
    ): Promise<{ reviews: PropertyReviews[]; total: number }> {
        return this.list({
            property_id: propertyId,
            is_published: true,
            is_active: true,
            limit: options?.limit || 10,
            offset: options?.offset || 0,
        });
    },

    /**
     * Get review statistics for a property
     */
    async getPropertyReviewStats(propertyId: string): Promise<{
        totalReviews: number;
        averageRating: number;
        ratingDistribution: Record<number, number>;
        verifiedBuyerCount: number;
    }> {
        try {
            const { reviews, total } = await this.list({
                property_id: propertyId,
                is_published: true,
                is_active: true,
                limit: 1000, // Get all for accurate stats
            });

            if (total === 0) {
                return {
                    totalReviews: 0,
                    averageRating: 0,
                    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
                    verifiedBuyerCount: 0,
                };
            }

            const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
            let totalRating = 0;
            let verifiedBuyerCount = 0;

            reviews.forEach((review) => {
                totalRating += review.rating;
                ratingDistribution[review.rating] = (ratingDistribution[review.rating] || 0) + 1;
                if (review.is_verified_buyer) {
                    verifiedBuyerCount++;
                }
            });

            return {
                totalReviews: total,
                averageRating: totalRating / total,
                ratingDistribution,
                verifiedBuyerCount,
            };
        } catch (error) {
            console.error("Error getting property review stats:", error);
            return {
                totalReviews: 0,
                averageRating: 0,
                ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
                verifiedBuyerCount: 0,
            };
        }
    },

    /**
     * Check if a user has already reviewed a property
     */
    async hasUserReviewedProperty(propertyId: string, reviewerId: string): Promise<boolean> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                PROPERTY_REVIEWS_COLLECTION_ID,
                [
                    Query.equal("property_id", propertyId),
                    Query.equal("reviewer_id", reviewerId),
                    Query.limit(1),
                ]
            );
            return response.documents.length > 0;
        } catch (error) {
            console.error("Error checking existing property review:", error);
            return false;
        }
    },

    /**
     * Get a user's review for a property
     */
    async getUserReviewForProperty(propertyId: string, reviewerId: string): Promise<PropertyReviews | null> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                PROPERTY_REVIEWS_COLLECTION_ID,
                [
                    Query.equal("property_id", propertyId),
                    Query.equal("reviewer_id", reviewerId),
                    Query.limit(1),
                ]
            );
            if (response.documents.length > 0) {
                return response.documents[0] as unknown as PropertyReviews;
            }
            return null;
        } catch (error) {
            console.error("Error getting user review for property:", error);
            return null;
        }
    },

    /**
     * Create a new property review
     */
    async create(data: CreatePropertyReviewData): Promise<PropertyReviews> {
        try {
            // Check if user has already reviewed this property
            if (data.reviewer_id) {
                const existingReview = await this.hasUserReviewedProperty(data.property_id, data.reviewer_id);
                if (existingReview) {
                    throw new Error("You have already reviewed this property");
                }
            }

            const reviewData = {
                ...data,
                review_type: data.review_type || "general",
                is_active: true,
                is_published: true,
                is_approved: false, // Requires admin approval
                is_verified: false,
                is_verified_buyer: data.is_verified_buyer || false,
                helpful_count: 0,
                helpful_votes: 0,
            };

            const response = await databases.createDocument(
                DATABASE_ID,
                PROPERTY_REVIEWS_COLLECTION_ID,
                ID.unique(),
                reviewData
            );

            return response as unknown as PropertyReviews;
        } catch (error) {
            console.error("Error creating property review:", error);
            throw error;
        }
    },

    /**
     * Update a property review
     */
    async update(reviewId: string, data: Partial<CreatePropertyReviewData>): Promise<PropertyReviews> {
        try {
            const response = await databases.updateDocument(
                DATABASE_ID,
                PROPERTY_REVIEWS_COLLECTION_ID,
                reviewId,
                data
            );
            return response as unknown as PropertyReviews;
        } catch (error) {
            console.error("Error updating property review:", error);
            throw error;
        }
    },

    /**
     * Delete a property review
     */
    async delete(reviewId: string): Promise<void> {
        try {
            await databases.deleteDocument(
                DATABASE_ID,
                PROPERTY_REVIEWS_COLLECTION_ID,
                reviewId
            );
        } catch (error) {
            console.error("Error deleting property review:", error);
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
                    PROPERTY_REVIEWS_COLLECTION_ID,
                    reviewId,
                    { 
                        helpful_count: (review.helpful_count || 0) + 1,
                        helpful_votes: (review.helpful_votes || 0) + 1,
                    }
                );
            }
        } catch (error) {
            console.error("Error marking property review as helpful:", error);
            throw error;
        }
    },

    /**
     * Admin: Approve a review
     */
    async approve(reviewId: string): Promise<PropertyReviews> {
        try {
            const response = await databases.updateDocument(
                DATABASE_ID,
                PROPERTY_REVIEWS_COLLECTION_ID,
                reviewId,
                { 
                    is_approved: true,
                    approved_at: new Date().toISOString(),
                }
            );
            return response as unknown as PropertyReviews;
        } catch (error) {
            console.error("Error approving property review:", error);
            throw error;
        }
    },

    /**
     * Admin: Add response to a review
     */
    async addResponse(reviewId: string, responseText: string): Promise<PropertyReviews> {
        try {
            const response = await databases.updateDocument(
                DATABASE_ID,
                PROPERTY_REVIEWS_COLLECTION_ID,
                reviewId,
                { 
                    admin_response: responseText,
                    response_text: responseText,
                    response_date: new Date().toISOString(),
                }
            );
            return response as unknown as PropertyReviews;
        } catch (error) {
            console.error("Error adding response to property review:", error);
            throw error;
        }
    },
};
