import { databases } from "@/services/appwrite";
import { Query, ID } from "appwrite";
import { 
  type FeaturedListingPayments, 
  type FeaturedListings, 
  type FeaturedSlots,
  type BannerAds,
  type Promotions 
} from "@/types/appwrite";

const DATABASE_ID = "main";
const FEATURED_LISTING_PAYMENTS_COLLECTION = "featured_listing_payments";
const FEATURED_LISTINGS_COLLECTION = "featured_listings";
const FEATURED_SLOTS_COLLECTION = "featured_slots";
const BANNER_ADS_COLLECTION = "banner_ads";
const PROMOTIONS_COLLECTION = "promotions";

// Package pricing configuration
export const PACKAGE_CONFIG = {
  basic: {
    name: "Basic",
    price: 2999,
    duration: 7,
    description: "7 days of featured visibility",
    features: ["Featured badge", "Priority in search results", "Basic analytics"],
    position_priority: 1,
  },
  standard: {
    name: "Standard",
    price: 5999,
    duration: 14,
    description: "14 days of premium visibility",
    features: ["Featured badge", "Top of search results", "Advanced analytics", "Social media boost"],
    position_priority: 2,
  },
  premium: {
    name: "Premium",
    price: 9999,
    duration: 30,
    description: "30 days of maximum exposure",
    features: ["Featured badge", "Homepage spotlight", "Full analytics dashboard", "Social media campaigns", "Email newsletter feature"],
    position_priority: 3,
  },
  spotlight: {
    name: "Spotlight",
    price: 14999,
    duration: 30,
    description: "30 days of elite visibility with homepage carousel",
    features: ["Homepage carousel feature", "Featured badge", "Maximum priority", "All premium features", "Dedicated support"],
    position_priority: 4,
  },
};

export type PackageType = keyof typeof PACKAGE_CONFIG;

export interface CreateFeaturedListingPaymentData {
  property_id: string;
  property_title: string;
  owner_id: string;
  owner_name: string;
  package: PackageType;
  amount: number;
  currency?: string;
  duration_days: number;
  payment_date: string;
  start_date: string;
  end_date: string;
  transaction_id?: string;
  is_auto_renew?: boolean;
  position_priority?: number;
}

export interface AdsFilters {
  status?: string;
  package?: PackageType;
  property_id?: string;
  limit?: number;
  offset?: number;
  sortField?: string;
  sortOrder?: "asc" | "desc";
}

export const adsService = {
  // ==================== Featured Listing Payments ====================
  
  /**
   * Create a new featured listing payment/promotion
   */
  async createFeaturedListingPayment(
    data: CreateFeaturedListingPaymentData
  ): Promise<FeaturedListingPayments> {
    const document = await databases.createDocument(
      DATABASE_ID,
      FEATURED_LISTING_PAYMENTS_COLLECTION,
      ID.unique(),
      {
        property_id: data.property_id,
        property_title: data.property_title,
        owner_id: data.owner_id,
        owner_name: data.owner_name,
        package: data.package,
        amount: data.amount,
        currency: data.currency || "PKR",
        duration_days: data.duration_days,
        payment_date: data.payment_date,
        start_date: data.start_date,
        end_date: data.end_date,
        transaction_id: data.transaction_id || null,
        status: "pending",
        is_auto_renew: data.is_auto_renew || false,
        position_priority: data.position_priority || PACKAGE_CONFIG[data.package].position_priority,
        impressions: 0,
        clicks: 0,
        ctr: 0,
        is_active: true,
      }
    );
    return document as unknown as FeaturedListingPayments;
  },

  /**
   * Get all featured listing payments for a user
   */
  async getUserFeaturedListings(
    userId: string,
    filters: AdsFilters = {}
  ): Promise<{ payments: FeaturedListingPayments[]; total: number }> {
    const queries: string[] = [
      Query.equal("owner_id", userId),
      Query.orderDesc("$createdAt"),
    ];

    if (filters.status) {
      queries.push(Query.equal("status", filters.status));
    }

    if (filters.package) {
      queries.push(Query.equal("package", filters.package));
    }

    if (filters.property_id) {
      queries.push(Query.equal("property_id", filters.property_id));
    }

    if (filters.limit) {
      queries.push(Query.limit(filters.limit));
    }

    if (filters.offset) {
      queries.push(Query.offset(filters.offset));
    }

    const response = await databases.listDocuments(
      DATABASE_ID,
      FEATURED_LISTING_PAYMENTS_COLLECTION,
      queries
    );

    return {
      payments: response.documents as unknown as FeaturedListingPayments[],
      total: response.total,
    };
  },

  /**
   * Get a single featured listing payment by ID
   */
  async getFeaturedListingPayment(paymentId: string): Promise<FeaturedListingPayments | null> {
    try {
      const document = await databases.getDocument(
        DATABASE_ID,
        FEATURED_LISTING_PAYMENTS_COLLECTION,
        paymentId
      );
      return document as unknown as FeaturedListingPayments;
    } catch {
      return null;
    }
  },

  /**
   * Update featured listing payment status
   */
  async updateFeaturedListingPaymentStatus(
    paymentId: string,
    status: "pending" | "active" | "expired" | "cancelled" | "paused"
  ): Promise<FeaturedListingPayments> {
    const document = await databases.updateDocument(
      DATABASE_ID,
      FEATURED_LISTING_PAYMENTS_COLLECTION,
      paymentId,
      { status }
    );
    return document as unknown as FeaturedListingPayments;
  },

  /**
   * Record an impression for a featured listing
   */
  async recordImpression(paymentId: string): Promise<void> {
    const payment = await this.getFeaturedListingPayment(paymentId);
    if (payment) {
      const newImpressions = payment.impressions + 1;
      const newCtr = payment.clicks > 0 ? (payment.clicks / newImpressions) * 100 : 0;
      await databases.updateDocument(
        DATABASE_ID,
        FEATURED_LISTING_PAYMENTS_COLLECTION,
        paymentId,
        {
          impressions: newImpressions,
          ctr: newCtr,
        }
      );
    }
  },

  /**
   * Record a click for a featured listing
   */
  async recordClick(paymentId: string): Promise<void> {
    const payment = await this.getFeaturedListingPayment(paymentId);
    if (payment) {
      const newClicks = payment.clicks + 1;
      const newCtr = payment.impressions > 0 ? (newClicks / payment.impressions) * 100 : 0;
      await databases.updateDocument(
        DATABASE_ID,
        FEATURED_LISTING_PAYMENTS_COLLECTION,
        paymentId,
        {
          clicks: newClicks,
          ctr: newCtr,
        }
      );
    }
  },

  /**
   * Toggle auto-renew for a featured listing
   */
  async toggleAutoRenew(paymentId: string): Promise<FeaturedListingPayments> {
    const payment = await this.getFeaturedListingPayment(paymentId);
    if (!payment) throw new Error("Payment not found");
    
    const document = await databases.updateDocument(
      DATABASE_ID,
      FEATURED_LISTING_PAYMENTS_COLLECTION,
      paymentId,
      { is_auto_renew: !payment.is_auto_renew }
    );
    return document as unknown as FeaturedListingPayments;
  },

  /**
   * Cancel a featured listing
   */
  async cancelFeaturedListing(paymentId: string): Promise<FeaturedListingPayments> {
    const document = await databases.updateDocument(
      DATABASE_ID,
      FEATURED_LISTING_PAYMENTS_COLLECTION,
      paymentId,
      { 
        status: "cancelled",
        is_active: false 
      }
    );
    return document as unknown as FeaturedListingPayments;
  },

  /**
   * Get active featured listings for display (all users)
   */
  async getActiveFeaturedListings(
    limit: number = 10
  ): Promise<FeaturedListingPayments[]> {
    const now = new Date().toISOString();
    const queries: string[] = [
      Query.equal("status", "active"),
      Query.equal("is_active", true),
      Query.lessThanEqual("start_date", now),
      Query.greaterThanEqual("end_date", now),
      Query.orderDesc("position_priority"),
      Query.limit(limit),
    ];

    const response = await databases.listDocuments(
      DATABASE_ID,
      FEATURED_LISTING_PAYMENTS_COLLECTION,
      queries
    );

    return response.documents as unknown as FeaturedListingPayments[];
  },

  // ==================== Featured Slots ====================

  /**
   * Get all available featured slots
   */
  async getFeaturedSlots(): Promise<FeaturedSlots[]> {
    const response = await databases.listDocuments(
      DATABASE_ID,
      FEATURED_SLOTS_COLLECTION,
      [
        Query.equal("is_active", true),
        Query.equal("status", "active"),
        Query.orderAsc("name"),
      ]
    );
    return response.documents as unknown as FeaturedSlots[];
  },

  /**
   * Get a single featured slot by ID
   */
  async getFeaturedSlot(slotId: string): Promise<FeaturedSlots | null> {
    try {
      const document = await databases.getDocument(
        DATABASE_ID,
        FEATURED_SLOTS_COLLECTION,
        slotId
      );
      return document as unknown as FeaturedSlots;
    } catch {
      return null;
    }
  },

  // ==================== Banner Ads ====================

  /**
   * Get active banner ads for a placement
   */
  async getBannerAds(placement: string): Promise<BannerAds[]> {
    const now = new Date().toISOString();
    const queries: string[] = [
      Query.equal("placement", placement),
      Query.equal("status", "active"),
      Query.equal("is_active", true),
      Query.lessThanEqual("start_date", now),
      Query.greaterThanEqual("end_date", now),
    ];

    const response = await databases.listDocuments(
      DATABASE_ID,
      BANNER_ADS_COLLECTION,
      queries
    );

    return response.documents as unknown as BannerAds[];
  },

  /**
   * Record banner ad impression
   */
  async recordBannerImpression(adId: string): Promise<void> {
    const ad = await databases.getDocument(DATABASE_ID, BANNER_ADS_COLLECTION, adId);
    const bannerAd = ad as unknown as BannerAds;
    const newImpressions = bannerAd.impressions + 1;
    const newCtr = bannerAd.clicks > 0 ? (bannerAd.clicks / newImpressions) * 100 : 0;
    
    await databases.updateDocument(
      DATABASE_ID,
      BANNER_ADS_COLLECTION,
      adId,
      {
        impressions: newImpressions,
        ctr: newCtr,
      }
    );
  },

  /**
   * Record banner ad click
   */
  async recordBannerClick(adId: string): Promise<void> {
    const ad = await databases.getDocument(DATABASE_ID, BANNER_ADS_COLLECTION, adId);
    const bannerAd = ad as unknown as BannerAds;
    const newClicks = bannerAd.clicks + 1;
    const newCtr = bannerAd.impressions > 0 ? (newClicks / bannerAd.impressions) * 100 : 0;
    
    await databases.updateDocument(
      DATABASE_ID,
      BANNER_ADS_COLLECTION,
      adId,
      {
        clicks: newClicks,
        ctr: newCtr,
      }
    );
  },

  // ==================== Promotions ====================

  /**
   * Validate a promotion code
   */
  async validatePromoCode(code: string): Promise<Promotions | null> {
    try {
      const now = new Date().toISOString();
      const response = await databases.listDocuments(
        DATABASE_ID,
        PROMOTIONS_COLLECTION,
        [
          Query.equal("code", code.toUpperCase()),
          Query.equal("status", "active"),
          Query.equal("is_active", true),
        ]
      );

      if (response.documents.length === 0) return null;

      const promo = response.documents[0] as unknown as Promotions;

      // Check if within date range
      if (promo.start_date && promo.start_date > now) return null;
      if (promo.end_date && promo.end_date < now) return null;

      // Check usage limit
      if (promo.usage_limit && promo.usage_count >= promo.usage_limit) return null;

      return promo;
    } catch {
      return null;
    }
  },

  /**
   * Apply a promotion code (increment usage)
   */
  async usePromoCode(promoId: string): Promise<void> {
    const promo = await databases.getDocument(DATABASE_ID, PROMOTIONS_COLLECTION, promoId);
    const promotion = promo as unknown as Promotions;
    
    await databases.updateDocument(
      DATABASE_ID,
      PROMOTIONS_COLLECTION,
      promoId,
      {
        usage_count: promotion.usage_count + 1,
      }
    );
  },

  /**
   * Calculate discounted price
   */
  calculateDiscountedPrice(
    originalPrice: number,
    discountType: "percentage" | "fixed",
    discountValue: number
  ): number {
    if (discountType === "percentage") {
      return originalPrice * (1 - discountValue / 100);
    }
    return Math.max(0, originalPrice - discountValue);
  },

  // ==================== Analytics ====================

  /**
   * Get ads analytics summary for a user
   */
  async getUserAdsAnalytics(userId: string): Promise<{
    totalSpent: number;
    activeAds: number;
    totalImpressions: number;
    totalClicks: number;
    avgCtr: number;
    expiringSoon: number;
  }> {
    const { payments } = await this.getUserFeaturedListings(userId);

    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    let totalSpent = 0;
    let activeAds = 0;
    let totalImpressions = 0;
    let totalClicks = 0;
    let expiringSoon = 0;

    payments.forEach((payment) => {
      totalSpent += payment.amount;
      totalImpressions += payment.impressions;
      totalClicks += payment.clicks;

      if (String(payment.status) === "active") {
        activeAds++;
        const endDate = new Date(payment.end_date);
        if (endDate <= threeDaysFromNow && endDate >= now) {
          expiringSoon++;
        }
      }
    });

    const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    return {
      totalSpent,
      activeAds,
      totalImpressions,
      totalClicks,
      avgCtr,
      expiringSoon,
    };
  },

  /**
   * Get package configuration
   */
  getPackageConfig() {
    return PACKAGE_CONFIG;
  },
};

export default adsService;
