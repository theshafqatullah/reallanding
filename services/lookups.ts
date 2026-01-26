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
  image_url?: string;
  is_featured?: boolean;
  display_order?: number;
  population?: number;
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

export interface Amenity {
  $id: string;
  name: string;
  description?: string;
  icon_name?: string;
  category?: string;
  is_active: boolean;
}

// ============================================================================
// In-Memory Cache for Lookups (reduces API calls for static data)
// ============================================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache TTL

const cache: {
  countries?: CacheEntry<Country[]>;
  states?: Map<string, CacheEntry<State[]>>;
  cities?: Map<string, CacheEntry<City[]>>;
  locations?: Map<string, CacheEntry<Location[]>>;
  propertyTypes?: CacheEntry<PropertyType[]>;
  listingTypes?: CacheEntry<ListingType[]>;
  amenities?: CacheEntry<Amenity[]>;
} = {
  states: new Map(),
  cities: new Map(),
  locations: new Map(),
};

function isCacheValid<T>(entry?: CacheEntry<T>): boolean {
  if (!entry) return false;
  return Date.now() - entry.timestamp < CACHE_TTL;
}

// ============================================================================
// Lookup Service
// ============================================================================

/**
 * Lookup service for fetching related/reference data collections
 * Includes in-memory caching for better performance
 */
export const lookupsService = {
  /**
   * Clear all cache entries
   */
  clearCache(): void {
    cache.countries = undefined;
    cache.states?.clear();
    cache.cities?.clear();
    cache.locations?.clear();
    cache.propertyTypes = undefined;
    cache.listingTypes = undefined;
    cache.amenities = undefined;
  },

  // ========================================================================
  // Countries
  // ========================================================================
  
  /**
   * Get all active countries (cached)
   */
  async getCountries(): Promise<Country[]> {
    // Return cached data if valid
    if (isCacheValid(cache.countries)) {
      return cache.countries!.data;
    }

    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COUNTRIES_COLLECTION_ID,
        [
          Query.orderAsc("name"),
          Query.limit(250),
        ]
      );
      // Filter is_active client-side
      const data = (response.documents as unknown as Country[]).filter(c => c.is_active === true);
      
      // Update cache
      cache.countries = { data, timestamp: Date.now() };
      
      return data;
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
          Query.orderAsc("name"),
          Query.limit(250),
        ]
      );
      // Filter is_active client-side
      return (response.documents as unknown as State[]).filter(s => s.is_active === true);
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
          Query.orderAsc("name"),
          Query.limit(250),
        ]
      );
      // Filter is_active client-side
      return (response.documents as unknown as State[]).filter(s => s.is_active === true);
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
          Query.orderAsc("name"),
          Query.limit(500),
        ]
      );
      // Filter is_active client-side
      return (response.documents as unknown as City[]).filter(c => c.is_active === true);
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
          Query.orderAsc("name"),
          Query.limit(500),
        ]
      );
      // Filter is_active client-side
      return (response.documents as unknown as City[]).filter(c => c.is_active === true);
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
          Query.orderAsc("name"),
          Query.limit(500),
        ]
      );
      // Filter is_active client-side
      return (response.documents as unknown as City[]).filter(c => c.is_active === true);
    } catch (error) {
      console.error("Error fetching cities:", error);
      throw error;
    }
  },

  /**
   * Get featured cities for homepage display
   * Returns cities with is_featured=true, sorted by display_order
   */
  async getFeaturedCities(limit: number = 6): Promise<City[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        CITIES_COLLECTION_ID,
        [
          Query.limit(100),
        ]
      );
      // Filter is_featured and is_active client-side, then sort by display_order
      const cities = (response.documents as unknown as City[])
        .filter(c => c.is_active === true && c.is_featured === true)
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
        .slice(0, limit);
      return cities;
    } catch (error) {
      console.error("Error fetching featured cities:", error);
      return [];
    }
  },

  /**
   * Search cities by name (fulltext search)
   */
  async searchCities(searchTerm: string): Promise<City[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        CITIES_COLLECTION_ID,
        [
          Query.search("name", searchTerm),
          Query.limit(50),
        ]
      );
      // Filter is_active client-side
      return (response.documents as unknown as City[]).filter(c => c.is_active === true).slice(0, 20);
    } catch (error) {
      console.error("Error searching cities:", error);
      throw error;
    }
  },

  /**
   * Search locations/areas by name (fulltext search)
   */
  async searchLocations(searchTerm: string): Promise<Location[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        LOCATIONS_COLLECTION_ID,
        [
          Query.search("name", searchTerm),
          Query.limit(50),
        ]
      );
      // Filter is_active client-side
      return (response.documents as unknown as Location[]).filter(l => l.is_active === true).slice(0, 20);
    } catch (error) {
      console.error("Error searching locations:", error);
      throw error;
    }
  },

  /**
   * Search all locations (cities and areas/societies) by name
   * Returns combined results with type indicator
   */
  async searchAllLocations(searchTerm: string): Promise<{
    cities: City[];
    locations: Location[];
  }> {
    try {
      const [cities, locations] = await Promise.all([
        this.searchCities(searchTerm),
        this.searchLocations(searchTerm),
      ]);
      return { cities, locations };
    } catch (error) {
      console.error("Error searching all locations:", error);
      return { cities: [], locations: [] };
    }
  },

  /**
   * Get all locations (areas/societies)
   */
  async getAllLocations(): Promise<Location[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        LOCATIONS_COLLECTION_ID,
        [
          Query.orderAsc("name"),
          Query.limit(500),
        ]
      );
      // Filter is_active client-side
      return (response.documents as unknown as Location[]).filter(l => l.is_active === true);
    } catch (error) {
      console.error("Error fetching all locations:", error);
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
          Query.orderAsc("name"),
          Query.limit(500),
        ]
      );
      // Filter is_active client-side
      return (response.documents as unknown as Location[]).filter(l => l.is_active === true);
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
   * Get all active property types (cached)
   */
  async getPropertyTypes(): Promise<PropertyType[]> {
    // Return cached data if valid
    if (isCacheValid(cache.propertyTypes)) {
      return cache.propertyTypes!.data;
    }

    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        PROPERTY_TYPES_COLLECTION_ID,
        [
          Query.orderAsc("display_order"),
          Query.limit(100),
        ]
      );
      // Filter is_active client-side
      const data = (response.documents as unknown as PropertyType[]).filter(pt => pt.is_active === true);
      
      // Update cache
      cache.propertyTypes = { data, timestamp: Date.now() };
      
      return data;
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
          Query.orderAsc("display_order"),
          Query.limit(100),
        ]
      );
      // Filter is_active client-side
      return (response.documents as unknown as PropertyType[]).filter(pt => pt.is_active === true);
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
          Query.orderAsc("display_order"),
          Query.limit(100),
        ]
      );
      // Filter is_active and is_featured client-side
      const featured = (response.documents as unknown as PropertyType[]).filter(
        pt => pt.is_active === true && pt.is_featured === true
      );
      return featured;
    } catch (error) {
      console.error("Error fetching featured property types:", error);
      throw error;
    }
  },

  // ========================================================================
  // Listing Types
  // ========================================================================

  /**
   * Get all active listing types (cached)
   */
  async getListingTypes(): Promise<ListingType[]> {
    // Return cached data if valid
    if (isCacheValid(cache.listingTypes)) {
      return cache.listingTypes!.data;
    }

    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        LISTING_TYPES_COLLECTION_ID,
        [
          Query.limit(50),
        ]
      );
      // Filter is_active client-side
      const data = (response.documents as unknown as ListingType[]).filter(lt => lt.is_active === true);
      
      // Update cache
      cache.listingTypes = { data, timestamp: Date.now() };
      
      return data;
    } catch (error) {
      console.error("Error fetching listing types:", error);
      throw error;
    }
  },

  // ========================================================================
  // Amenities
  // ========================================================================

  /**
   * Get all active amenities (cached)
   */
  async getAmenities(): Promise<Amenity[]> {
    // Return cached data if valid
    if (isCacheValid(cache.amenities)) {
      return cache.amenities!.data;
    }

    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        AMENITIES_COLLECTION_ID,
        [
          Query.orderAsc("name"),
          Query.limit(200),
        ]
      );
      // Filter is_active client-side
      const data = (response.documents as unknown as Amenity[]).filter(a => a.is_active === true);
      
      // Update cache
      cache.amenities = { data, timestamp: Date.now() };
      
      return data;
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
          Query.orderAsc("name"),
          Query.limit(100),
        ]
      );
      // Filter is_active client-side
      return (response.documents as unknown as Amenity[]).filter(a => a.is_active === true);
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
    amenities: Amenity[];
  }> {
    try {
      const [countries, propertyTypes, listingTypes, amenities] = await Promise.all([
        this.getCountries(),
        this.getPropertyTypes(),
        this.getListingTypes(),
        this.getAmenities(),
      ]);

      return {
        countries,
        propertyTypes,
        listingTypes,
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
