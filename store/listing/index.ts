"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { PropertyStatus } from "@/types/appwrite";

// ============================================================================
// Types
// ============================================================================

export interface ListingBasicInfo {
  title: string;
  description: string;
  property_type_id: string;
  listing_type_id: string;
  property_status: PropertyStatus;
  price: number;
  currency: string;
  price_negotiable: boolean;
  // Location
  country_id: string;
  state_id: string;
  city_id: string;
  location_id: string;
  address: string;
  street_address: string;
  building_name: string;
  unit_number: string;
  sector: string;
  block: string;
  plot_number: string;
}

export interface ListingDetails {
  // Basic specs
  bedrooms: number | null;
  bathrooms: number | null;
  kitchens: number;
  parking_spaces: number;
  total_area: number | null;
  covered_area: number | null;
  area_unit: string;
  floors: number;
  floor_number: number | null;
  facing: string;
  // Property features
  condition_type: string;
  furnished_status: string;
  pet_policy: string;
  ownership_type: string;
  year_built: number | null;
  available_from: string;
  // Rooms
  balconies: number;
  servant_quarters: number;
  laundry_rooms: number;
  store_rooms: number;
  // Amenities
  has_basement: boolean;
  has_elevator: boolean;
  has_pool: boolean;
  has_garden: boolean;
  has_gym: boolean;
  has_powder_room: boolean;
  has_prayer_room: boolean;
  has_terrace: boolean;
  has_study_room: boolean;
  has_central_heating: boolean;
  has_central_ac: boolean;
  covered_parking: boolean;
  // Utilities
  cooling_system: string;
  heating_system: string;
  flooring_type: string;
  electricity_backup: string;
  water_supply: string;
  // Financial
  security_deposit: number | null;
  maintenance_charges: number;
  service_charges_monthly: number | null;
  hoa_fees_monthly: number | null;
  // Legal
  is_mortgaged: boolean;
  clear_title: boolean;
  construction_status: string;
  possession_status: string;
  // Location features
  is_west_open: boolean;
  is_corner: boolean;
  road_width_feet: number | null;
  view_type: string;
}

export interface ListingMedia {
  main_image_url: string;
  cover_image_url: string;
  images: string[];
  virtual_tour_url: string;
  video_url: string;
  youtube_video_id: string;
  // Contact
  contact_person_name: string;
  contact_phone: string;
  contact_email: string;
  whatsapp_number: string;
  // Publish settings
  is_featured: boolean;
  is_premium: boolean;
  is_exclusive: boolean;
  is_urgent_sale: boolean;
  is_hot_deal: boolean;
  is_published: boolean;
  // SEO
  meta_title: string;
  meta_description: string;
  seo_keywords: string;
  marketing_tagline: string;
  short_description: string;
}

export interface ListingFormState {
  currentStep: number;
  basicInfo: ListingBasicInfo;
  details: ListingDetails;
  media: ListingMedia;
  isSubmitting: boolean;
  error: string | null;
}

export interface ListingFormActions {
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateBasicInfo: (data: Partial<ListingBasicInfo>) => void;
  updateDetails: (data: Partial<ListingDetails>) => void;
  updateMedia: (data: Partial<ListingMedia>) => void;
  resetForm: () => void;
  setError: (error: string | null) => void;
  setSubmitting: (isSubmitting: boolean) => void;
}

export type ListingFormStore = ListingFormState & ListingFormActions;

// ============================================================================
// Initial State
// ============================================================================

const initialBasicInfo: ListingBasicInfo = {
  title: "",
  description: "",
  property_type_id: "",
  listing_type_id: "",
  property_status: PropertyStatus.ACTIVE,
  price: 0,
  currency: "PKR",
  price_negotiable: false,
  country_id: "",
  state_id: "",
  city_id: "",
  location_id: "",
  address: "",
  street_address: "",
  building_name: "",
  unit_number: "",
  sector: "",
  block: "",
  plot_number: "",
};

const initialDetails: ListingDetails = {
  bedrooms: null,
  bathrooms: null,
  kitchens: 1,
  parking_spaces: 0,
  total_area: null,
  covered_area: null,
  area_unit: "sqft",
  floors: 1,
  floor_number: null,
  facing: "",
  condition_type: "",
  furnished_status: "unfurnished",
  pet_policy: "not_allowed",
  ownership_type: "",
  year_built: null,
  available_from: "",
  balconies: 0,
  servant_quarters: 0,
  laundry_rooms: 0,
  store_rooms: 0,
  has_basement: false,
  has_elevator: false,
  has_pool: false,
  has_garden: false,
  has_gym: false,
  has_powder_room: false,
  has_prayer_room: false,
  has_terrace: false,
  has_study_room: false,
  has_central_heating: false,
  has_central_ac: false,
  covered_parking: false,
  cooling_system: "",
  heating_system: "",
  flooring_type: "",
  electricity_backup: "",
  water_supply: "",
  security_deposit: null,
  maintenance_charges: 0,
  service_charges_monthly: null,
  hoa_fees_monthly: null,
  is_mortgaged: false,
  clear_title: true,
  construction_status: "",
  possession_status: "",
  is_west_open: false,
  is_corner: false,
  road_width_feet: null,
  view_type: "",
};

const initialMedia: ListingMedia = {
  main_image_url: "",
  cover_image_url: "",
  images: [],
  virtual_tour_url: "",
  video_url: "",
  youtube_video_id: "",
  contact_person_name: "",
  contact_phone: "",
  contact_email: "",
  whatsapp_number: "",
  is_featured: false,
  is_premium: false,
  is_exclusive: false,
  is_urgent_sale: false,
  is_hot_deal: false,
  is_published: false,
  meta_title: "",
  meta_description: "",
  seo_keywords: "",
  marketing_tagline: "",
  short_description: "",
};

// ============================================================================
// Store
// ============================================================================

export const useListingFormStore = create<ListingFormStore>()(
  persist(
    (set, get) => ({
      // State
      currentStep: 1,
      basicInfo: initialBasicInfo,
      details: initialDetails,
      media: initialMedia,
      isSubmitting: false,
      error: null,

      // Actions
      setCurrentStep: (step) => set({ currentStep: step }),

      nextStep: () => {
        const { currentStep } = get();
        if (currentStep < 3) {
          set({ currentStep: currentStep + 1 });
        }
      },

      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 });
        }
      },

      updateBasicInfo: (data) =>
        set((state) => ({
          basicInfo: { ...state.basicInfo, ...data },
        })),

      updateDetails: (data) =>
        set((state) => ({
          details: { ...state.details, ...data },
        })),

      updateMedia: (data) =>
        set((state) => ({
          media: { ...state.media, ...data },
        })),

      resetForm: () =>
        set({
          currentStep: 1,
          basicInfo: initialBasicInfo,
          details: initialDetails,
          media: initialMedia,
          isSubmitting: false,
          error: null,
        }),

      setError: (error) => set({ error }),

      setSubmitting: (isSubmitting) => set({ isSubmitting }),
    }),
    {
      name: "listing-form-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ============================================================================
// Hooks
// ============================================================================

export const useListingForm = () => useListingFormStore();
export const useCurrentStep = () => useListingFormStore((s) => s.currentStep);
export const useBasicInfo = () => useListingFormStore((s) => s.basicInfo);
export const useDetails = () => useListingFormStore((s) => s.details);
export const useMedia = () => useListingFormStore((s) => s.media);
