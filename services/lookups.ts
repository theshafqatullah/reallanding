import { databases } from "@/services/appwrite";
import { Query } from "appwrite";

const DATABASE_ID = "main";

// Collection IDs
const COUNTRIES_COLLECTION_ID = "countries";
const STATES_COLLECTION_ID = "states";
const CITIES_COLLECTION_ID = "cities";
const LOCATIONS_COLLECTION_ID = "locations";
const PROPERTY_TYPES_COLLECTION_ID = "property_types";
const LISTING_TYPES_COLLECTION_ID = "listing_types";
const PROPERTY_STATUSES_COLLECTION_ID = "property_statuses";
const AMENITIES_COLLECTION_ID = "amenities";

// ============================================================================
// Types
// ============================================================================

export interface Country {
  $id: string;
  name: string;
  iso_code: string;
  currency_code?: string;
  phone_code?: string;
  flag_url?: string;
  is_active: boolean;
}

export interface State {
  $id: string;
  name: string;
  country_id: string;
  state_code?: string;
  is_active: boolean;
}

export interface City {
  $id: string;
  name: string;
  state_id?: string;
  country_id?: string;
  is_active: boolean;
}

export interface Location {
  $id: string;
  name: string;
  city_id: string;
  area_type?: string;
  zone?: string;
  district?: string;
  postal_code?: string;
  is_active: boolean;
  is_gated?: boolean;
}

export interface PropertyType {
  $id: string;
  name: string;
  category: string;
  description?: string;
  icon_name?: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
  is_featured: boolean;
}

export interface ListingType {
  $id: string;
  name: string;
  description?: string;
  icon_name?: string;
  is_active: boolean;
}

export interface PropertyStatus {
  $id: string;
  name: string;
  description?: string;
  color_code?: string;
  icon_name?: string;
  slug?: string;
  badge_text?: string;
  display_order: number;
  is_active: boolean;
  is_default: boolean;
  show_in_filter: boolean;
}

export interface Amenity {
  $id: string;
  name: string;
  description?: string;
  icon_name?: string;
  category?: string;
  is_active: boolean;
}

// ============================================================================
// Lookup Service
// ============================================================================

/**
 * Lookup service for fetching related/reference data collections
 */
export const lookupsService = {
  // ========================================================================
  // Countries
  // ========================================================================
  
  /**
   * Get all active countries
   */
  async getCountries(): Promise<Country[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COUNTRIES_COLLECTION_ID,
        [
          Query.equal("is_active", true),
          Query.orderAsc("name"),
          Query.limit(250),
        ]
      );
      return response.documents as unknown as Country[];
    } catch (error) {
      console.error("Error fetching countries:", error);
      throw error;
    }
  },

  /**
   * Get a single country by ID
   */
  async getCountryById(countryId: string): Promise<Country | null> {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        COUNTRIES_COLLECTION_ID,
        countryId
      );
      return response as unknown as Country;
    } catch (error) {
      console.error("Error fetching country:", error);
      return null;
    }
  },

  // ========================================================================
  // States
  // ========================================================================

  /**
   * Get states by country
   */
  async getStatesByCountry(countryId: string): Promise<State[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        STATES_COLLECTION_ID,
        [
          Query.equal("country_id", countryId),
          Query.equal("is_active", true),
          Query.orderAsc("name"),
          Query.limit(250),
        ]
      );
      return response.documents as unknown as State[];
    } catch (error) {
      console.error("Error fetching states:", error);
      throw error;
    }
  },

  /**
   * Get all active states
   */
  async getAllStates(): Promise<State[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        STATES_COLLECTION_ID,
        [
          Query.equal("is_active", true),
          Query.orderAsc("name"),
          Query.limit(250),
        ]
      );
      return response.documents as unknown as State[];
    } catch (error) {
      console.error("Error fetching states:", error);
      throw error;
    }
  },

  // ========================================================================
  // Cities
  // ========================================================================

  /**
   * Get cities by state
   */
  async getCitiesByState(stateId: string): Promise<City[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        CITIES_COLLECTION_ID,
        [
          Query.equal("state_id", stateId),
          Query.equal("is_active", true),
          Query.orderAsc("name"),
          Query.limit(500),
        ]
      );
      return response.documents as unknown as City[];
    } catch (error) {
      console.error("Error fetching cities by state:", error);
      throw error;
    }
  },

  /**
   * Get cities by country
   */
  async getCitiesByCountry(countryId: string): Promise<City[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        CITIES_COLLECTION_ID,
        [
          Query.equal("country_id", countryId),
          Query.equal("is_active", true),
          Query.orderAsc("name"),
          Query.limit(500),
        ]
      );
      return response.documents as unknown as City[];
    } catch (error) {
      console.error("Error fetching cities by country:", error);
      throw error;
    }
  },

  /**
   * Get all active cities
   */
  async getAllCities(): Promise<City[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        CITIES_COLLECTION_ID,
        [
          Query.equal("is_active", true),
          Query.orderAsc("name"),
          Query.limit(500),
        ]
      );
      return response.documents as unknown as City[];
    } catch (error) {
      console.error("Error fetching cities:", error);
      throw error;
    }
  },

  // ========================================================================
  // Locations (Areas/Societies)
  // ========================================================================

  /**
   * Get locations by city
   */
  async getLocationsByCity(cityId: string): Promise<Location[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        LOCATIONS_COLLECTION_ID,
        [
          Query.equal("city_id", cityId),
          Query.equal("is_active", true),
          Query.orderAsc("name"),
          Query.limit(500),
        ]
      );
      return response.documents as unknown as Location[];
    } catch (error) {
      console.error("Error fetching locations:", error);
      throw error;
    }
  },

  /**
   * Get a single location by ID
   */
  async getLocationById(locationId: string): Promise<Location | null> {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        LOCATIONS_COLLECTION_ID,
        locationId
      );
      return response as unknown as Location;
    } catch (error) {
      console.error("Error fetching location:", error);
      return null;
    }
  },

  // ========================================================================
  // Property Types
  // ========================================================================

  /**
   * Get all active property types
   */
  async getPropertyTypes(): Promise<PropertyType[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        PROPERTY_TYPES_COLLECTION_ID,
        [
          Query.equal("is_active", true),
          Query.orderAsc("display_order"),
          Query.limit(100),
        ]
      );
      return response.documents as unknown as PropertyType[];
    } catch (error) {
      console.error("Error fetching property types:", error);
      throw error;
    }
  },

  /**
   * Get property types by category
   */
  async getPropertyTypesByCategory(category: string): Promise<PropertyType[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        PROPERTY_TYPES_COLLECTION_ID,
        [
          Query.equal("category", category),
          Query.equal("is_active", true),
          Query.orderAsc("display_order"),
          Query.limit(100),
        ]
      );
      return response.documents as unknown as PropertyType[];
    } catch (error) {
      console.error("Error fetching property types by category:", error);
      throw error;
    }
  },

  /**
   * Get featured property types
   */
  async getFeaturedPropertyTypes(): Promise<PropertyType[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        PROPERTY_TYPES_COLLECTION_ID,
        [
          Query.equal("is_featured", true),
          Query.equal("is_active", true),
          Query.orderAsc("display_order"),
          Query.limit(20),
        ]
      );
      return response.documents as unknown as PropertyType[];
    } catch (error) {
      console.error("Error fetching featured property types:", error);
      throw error;
    }
  },

  // ========================================================================
  // Listing Types
  // ========================================================================

  /**
   * Get all active listing types
   */
  async getListingTypes(): Promise<ListingType[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        LISTING_TYPES_COLLECTION_ID,
        [
          Query.equal("is_active", true),
          Query.limit(50),
        ]
      );
      return response.documents as unknown as ListingType[];
    } catch (error) {
      console.error("Error fetching listing types:", error);
      throw error;
    }
  },

  // ========================================================================
  // Property Statuses
  // ========================================================================

  /**
   * Get all active property statuses
   */
  async getPropertyStatuses(): Promise<PropertyStatus[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        PROPERTY_STATUSES_COLLECTION_ID,
        [
          Query.equal("is_active", true),
          Query.orderAsc("display_order"),
          Query.limit(50),
        ]
      );
      return response.documents as unknown as PropertyStatus[];
    } catch (error) {
      console.error("Error fetching property statuses:", error);
      throw error;
    }
  },

  /**
   * Get property statuses that show in filter
   */
  async getFilterablePropertyStatuses(): Promise<PropertyStatus[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        PROPERTY_STATUSES_COLLECTION_ID,
        [
          Query.equal("is_active", true),
          Query.equal("show_in_filter", true),
          Query.orderAsc("display_order"),
          Query.limit(50),
        ]
      );
      return response.documents as unknown as PropertyStatus[];
    } catch (error) {
      console.error("Error fetching filterable property statuses:", error);
      throw error;
    }
  },

  /**
   * Get default property status
   */
  async getDefaultPropertyStatus(): Promise<PropertyStatus | null> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        PROPERTY_STATUSES_COLLECTION_ID,
        [
          Query.equal("is_default", true),
          Query.limit(1),
        ]
      );
      if (response.documents.length > 0) {
        return response.documents[0] as unknown as PropertyStatus;
      }
      return null;
    } catch (error) {
      console.error("Error fetching default property status:", error);
      return null;
    }
  },

  // ========================================================================
  // Amenities
  // ========================================================================

  /**
   * Get all active amenities
   */
  async getAmenities(): Promise<Amenity[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        AMENITIES_COLLECTION_ID,
        [
          Query.equal("is_active", true),
          Query.orderAsc("name"),
          Query.limit(200),
        ]
      );
      return response.documents as unknown as Amenity[];
    } catch (error) {
      console.error("Error fetching amenities:", error);
      throw error;
    }
  },

  /**
   * Get amenities by category
   */
  async getAmenitiesByCategory(category: string): Promise<Amenity[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        AMENITIES_COLLECTION_ID,
        [
          Query.equal("category", category),
          Query.equal("is_active", true),
          Query.orderAsc("name"),
          Query.limit(100),
        ]
      );
      return response.documents as unknown as Amenity[];
    } catch (error) {
      console.error("Error fetching amenities by category:", error);
      throw error;
    }
  },

  // ========================================================================
  // Batch/Combined Lookups
  // ========================================================================

  /**
   * Get all lookup data needed for property creation form
   */
  async getPropertyFormLookups(): Promise<{
    countries: Country[];
    propertyTypes: PropertyType[];
    listingTypes: ListingType[];
    propertyStatuses: PropertyStatus[];
    amenities: Amenity[];
  }> {
    try {
      const [countries, propertyTypes, listingTypes, propertyStatuses, amenities] = await Promise.all([
        this.getCountries(),
        this.getPropertyTypes(),
        this.getListingTypes(),
        this.getPropertyStatuses(),
        this.getAmenities(),
      ]);

      return {
        countries,
        propertyTypes,
        listingTypes,
        propertyStatuses,
        amenities,
      };
    } catch (error) {
      console.error("Error fetching property form lookups:", error);
      throw error;
    }
  },

  /**
   * Get cascading location data (country -> state -> city -> location)
   */
  async getCascadingLocations(options: {
    countryId?: string;
    stateId?: string;
    cityId?: string;
  }): Promise<{
    states?: State[];
    cities?: City[];
    locations?: Location[];
  }> {
    try {
      const result: {
        states?: State[];
        cities?: City[];
        locations?: Location[];
      } = {};

      if (options.countryId) {
        result.states = await this.getStatesByCountry(options.countryId);
      }
      if (options.stateId) {
        result.cities = await this.getCitiesByState(options.stateId);
      }
      if (options.cityId) {
        result.locations = await this.getLocationsByCity(options.cityId);
      }

      return result;
    } catch (error) {
      console.error("Error fetching cascading locations:", error);
      throw error;
    }
  },
};

export default lookupsService;
