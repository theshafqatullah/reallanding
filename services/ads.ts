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
    // Store filters for client-side filtering (may not be indexed)
    const filterStatus = filters.status;
    const filterPackage = filters.package;
    const requestedLimit = filters.limit || 25;
    const requestedOffset = filters.offset || 0;
    const needsClientFilter = filterStatus !== undefined || filterPackage !== undefined;
    
    const queries: string[] = [
      Query.equal("owner_id", userId),
      Query.orderDesc("$createdAt"),
    ];

    // status and package handled client-side since they may not be indexed

    if (filters.property_id) {
      queries.push(Query.equal("property_id", filters.property_id));
    }

    if (needsClientFilter) {
      queries.push(Query.limit(200));
    } else {
      if (filters.limit) {
        queries.push(Query.limit(filters.limit));
      }
      if (filters.offset) {
        queries.push(Query.offset(filters.offset));
      }
    }

    const response = await databases.listDocuments(
      DATABASE_ID,
      FEATURED_LISTING_PAYMENTS_COLLECTION,
      queries
    );

    let payments = response.documents as unknown as FeaturedListingPayments[];
    let total = response.total;
    
    // Apply client-side filtering
    if (needsClientFilter) {
      payments = payments.filter(p => {
        if (filterStatus && p.status !== filterStatus) return false;
        if (filterPackage && p.package !== filterPackage) return false;
        return true;
      });
      total = payments.length;
      payments = payments.slice(requestedOffset, requestedOffset + requestedLimit);
    }

    return {
      payments,
      total,
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
      Query.lessThanEqual("start_date", now),
      Query.greaterThanEqual("end_date", now),
      Query.orderDesc("position_priority"),
      Query.limit(100),
    ];

    const response = await databases.listDocuments(
      DATABASE_ID,
      FEATURED_LISTING_PAYMENTS_COLLECTION,
      queries
    );

    // Filter status and is_active client-side since they may not be indexed
    const activeListings = (response.documents as unknown as FeaturedListingPayments[]).filter(
      listing => (listing.status as unknown as string) === "active" && listing.is_active === true
    );

    return activeListings.slice(0, limit);
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
        Query.orderAsc("name"),
        Query.limit(100),
      ]
    );
    
    // Filter status and is_active client-side since they may not be indexed
    return (response.documents as unknown as FeaturedSlots[]).filter(
      slot => (slot.status as unknown as string) === "active" && slot.is_active === true
    );
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
      Query.lessThanEqual("start_date", now),
      Query.greaterThanEqual("end_date", now),
      Query.limit(100),
    ];

    const response = await databases.listDocuments(
      DATABASE_ID,
      BANNER_ADS_COLLECTION,
      queries
    );

    // Filter status and is_active client-side since they may not be indexed
    return (response.documents as unknown as BannerAds[]).filter(
      ad => (ad.status as unknown as string) === "active" && ad.is_active === true
    );
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
          Query.limit(20),
        ]
      );

      // Filter status and is_active client-side since they may not be indexed
      const activePromos = (response.documents as unknown as Promotions[]).filter(
        promo => (promo.status as unknown as string) === "active" && promo.is_active === true
      );
      
      if (activePromos.length === 0) return null;

      const promo = activePromos[0];

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
