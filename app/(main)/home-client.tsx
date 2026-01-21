"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";
import { lookupsService, type PropertyType, type ListingType, type City, type Location } from "@/services/lookups";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  SearchIcon,
  MapPinIcon,
  HomeIcon,
  BuildingIcon,
  TrendingUpIcon,
  ShieldCheckIcon,
  UsersIcon,
  StarIcon,
  BedDoubleIcon,
  BathIcon,
  RulerIcon,
  HeartIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  PhoneIcon,
  MailIcon,
  PlayCircleIcon,
  CalendarIcon,
  ClockIcon,
  AwardIcon,
  ThumbsUpIcon,
  DollarSignIcon,
  KeyIcon,
  SmartphoneIcon,
  CalculatorIcon,
  TrendingDownIcon,
  EyeIcon,
  MessageSquareIcon,
  ChevronDownIcon,
} from "lucide-react";

// Mock featured properties data
const featuredProperties = [
  {
    id: 1,
    title: "Modern Luxury Villa",
    location: "Beverly Hills, CA",
    price: 2850000,
    beds: 5,
    baths: 4,
    sqft: 4500,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
    type: "For Sale",
    featured: true,
  },
  {
    id: 2,
    title: "Downtown Penthouse",
    location: "Manhattan, NY",
    price: 8500,
    beds: 3,
    baths: 2,
    sqft: 2200,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
    type: "For Rent",
    featured: true,
  },
  {
    id: 3,
    title: "Cozy Family Home",
    location: "Austin, TX",
    price: 675000,
    beds: 4,
    baths: 3,
    sqft: 2800,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
    type: "For Sale",
    featured: false,
  },
  {
    id: 4,
    title: "Beachfront Condo",
    location: "Miami, FL",
    price: 1250000,
    beds: 2,
    baths: 2,
    sqft: 1800,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
    type: "For Sale",
    featured: true,
  },
  {
    id: 5,
    title: "Mountain Retreat",
    location: "Aspen, CO",
    price: 3200000,
    beds: 6,
    baths: 5,
    sqft: 5200,
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop",
    type: "For Sale",
    featured: false,
  },
  {
    id: 6,
    title: "Urban Studio Loft",
    location: "San Francisco, CA",
    price: 3200,
    beds: 1,
    baths: 1,
    sqft: 850,
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop",
    type: "For Rent",
    featured: false,
  },
];

const propertyCategories = [
  { name: "Houses", icon: HomeIcon, count: 1234 },
  { name: "Apartments", icon: BuildingIcon, count: 856 },
  { name: "Condos", icon: BuildingIcon, count: 432 },
  { name: "Townhouses", icon: HomeIcon, count: 289 },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "First-time Buyer",
    content: "Real Landing made finding my dream home so easy! The search tools are intuitive and the agents were incredibly helpful throughout the process.",
    avatar: "SJ",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Property Investor",
    content: "I've used many real estate platforms, but Real Landing stands out with its comprehensive listings and market insights. Highly recommended!",
    avatar: "MC",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Home Seller",
    content: "Sold my property within 2 weeks! The exposure and professional support from Real Landing exceeded my expectations.",
    avatar: "ER",
    rating: 5,
  },
];

const stats = [
  { label: "Properties Listed", value: "50K+", icon: HomeIcon },
  { label: "Happy Customers", value: "25K+", icon: UsersIcon },
  { label: "Cities Covered", value: "200+", icon: MapPinIcon },
  { label: "Expert Agents", value: "1K+", icon: ShieldCheckIcon },
];

// Popular cities data
const popularCities = [
  {
    name: "New York",
    properties: 2456,
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=400&fit=crop",
    avgPrice: "$850K",
  },
  {
    name: "Los Angeles",
    properties: 1832,
    image: "https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=600&h=400&fit=crop",
    avgPrice: "$920K",
  },
  {
    name: "Miami",
    properties: 1245,
    image: "https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=600&h=400&fit=crop",
    avgPrice: "$680K",
  },
  {
    name: "Chicago",
    properties: 987,
    image: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=600&h=400&fit=crop",
    avgPrice: "$425K",
  },
  {
    name: "San Francisco",
    properties: 1567,
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&h=400&fit=crop",
    avgPrice: "$1.2M",
  },
  {
    name: "Austin",
    properties: 876,
    image: "https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=600&h=400&fit=crop",
    avgPrice: "$520K",
  },
];

// Featured agents data
const featuredAgents = [
  {
    name: "Jennifer Martinez",
    title: "Senior Real Estate Agent",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop",
    deals: 156,
    rating: 4.9,
    specialization: "Luxury Homes",
  },
  {
    name: "David Thompson",
    title: "Commercial Property Specialist",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop",
    deals: 203,
    rating: 4.8,
    specialization: "Commercial",
  },
  {
    name: "Sarah Williams",
    title: "Residential Expert",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop",
    deals: 189,
    rating: 5.0,
    specialization: "Family Homes",
  },
  {
    name: "Michael Chen",
    title: "Investment Advisor",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    deals: 134,
    rating: 4.9,
    specialization: "Investment",
  },
];

// Blog posts data
const blogPosts = [
  {
    title: "10 Tips for First-Time Home Buyers in 2026",
    excerpt: "Navigate the real estate market with confidence using these expert tips for buying your first home.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop",
    category: "Buying Tips",
    date: "Jan 10, 2026",
    readTime: "5 min read",
  },
  {
    title: "Real Estate Market Trends to Watch This Year",
    excerpt: "Stay ahead of the curve with insights into the latest market trends and predictions for property values.",
    image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=600&h=400&fit=crop",
    category: "Market Insights",
    date: "Jan 8, 2026",
    readTime: "7 min read",
  },
  {
    title: "How to Stage Your Home for a Quick Sale",
    excerpt: "Professional staging tips that can help you sell your property faster and at a better price.",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
    category: "Selling Tips",
    date: "Jan 5, 2026",
    readTime: "4 min read",
  },
];

// Why choose us features
const whyChooseUs = [
  {
    icon: ShieldCheckIcon,
    title: "Verified Listings",
    description: "All properties are verified by our team to ensure accuracy and legitimacy.",
  },
  {
    icon: DollarSignIcon,
    title: "Best Price Guarantee",
    description: "We help you find the best deals with transparent pricing and no hidden fees.",
  },
  {
    icon: UsersIcon,
    title: "Expert Support",
    description: "Our dedicated team of real estate experts is available 24/7 to assist you.",
  },
  {
    icon: KeyIcon,
    title: "Easy Process",
    description: "Streamlined buying, selling, and renting process from start to finish.",
  },
  {
    icon: TrendingUpIcon,
    title: "Market Insights",
    description: "Get access to real-time market data and property value trends.",
  },
  {
    icon: AwardIcon,
    title: "Award Winning",
    description: "Recognized as the leading property platform for three consecutive years.",
  },
];

// Recently sold properties
const recentlySold = [
  {
    title: "Colonial Style Home",
    location: "Boston, MA",
    soldPrice: 725000,
    originalPrice: 699000,
    daysOnMarket: 12,
    image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=600&h=400&fit=crop",
  },
  {
    title: "Modern Townhouse",
    location: "Seattle, WA",
    soldPrice: 890000,
    originalPrice: 875000,
    daysOnMarket: 8,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
  },
  {
    title: "Waterfront Property",
    location: "Tampa, FL",
    soldPrice: 1250000,
    originalPrice: 1300000,
    daysOnMarket: 21,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
  },
];

// Partner logos
const partners = [
  "Zillow Partner",
  "Realtor.com Certified",
  "Better Business Bureau A+",
  "National Association of Realtors",
  "Forbes Real Estate Council",
  "Inc. 5000",
];

export default function HomePageClient() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [listingType, setListingType] = useState("buy");
  // State for new hero filters
  const [propertyStatus, setPropertyStatus] = useState("all");
  const [bedsFilter, setBedsFilter] = useState("any");
  const [priceFilter, setPriceFilter] = useState("any");
  const [activeTab, setActiveTab] = useState("properties");
  // Dialog states for filter modals
  const [typeDialogOpen, setTypeDialogOpen] = useState(false);
  const [bedsDialogOpen, setBedsDialogOpen] = useState(false);
  const [priceDialogOpen, setPriceDialogOpen] = useState(false);

  // Lookup data from Appwrite
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [listingTypes, setListingTypes] = useState<ListingType[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  // Load lookup data on mount
  useEffect(() => {
    setMounted(true);

    const loadLookups = async () => {
      try {
        const [propTypes, listTypes, allCities, allLocations] = await Promise.all([
          lookupsService.getPropertyTypes(),
          lookupsService.getListingTypes(),
          lookupsService.getAllCities(),
          lookupsService.getAllLocations(),
        ]);
        setPropertyTypes(propTypes);
        setListingTypes(listTypes);
        setCities(allCities);
        setLocations(allLocations);
      } catch (error) {
        console.error("Error loading lookups:", error);
      }
    };
    loadLookups();
  }, []);

  // Handle search and navigate to properties page with filters
  const handleSearch = async () => {
    const params = new URLSearchParams();

    // Search for matching city or location by name
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();

      // First try to match against loaded cities
      const matchedCity = cities.find(
        (c) => c.name?.toLowerCase().includes(query) ||
          c.name?.toLowerCase() === query
      );

      if (matchedCity) {
        params.set("city", matchedCity.$id);
      } else {
        // Try to match against locations/areas
        const matchedLocation = locations.find(
          (l) => l.name?.toLowerCase().includes(query) ||
            l.name?.toLowerCase() === query
        );

        if (matchedLocation) {
          params.set("location", matchedLocation.$id);
        } else {
          // No exact match - use as text search
          params.set("q", searchQuery.trim());
        }
      }
    }

    // Add listing type (buy/rent) - find the matching listing type ID
    if (listingType) {
      const matchingListingType = listingTypes.find(
        (lt) => lt.name?.toLowerCase() === listingType.toLowerCase() ||
          lt.slug?.toLowerCase() === listingType.toLowerCase()
      );
      if (matchingListingType) {
        params.set("listing", matchingListingType.$id);
      }
      // Also set purpose for UI state
      if (listingType !== "buy") {
        params.set("purpose", listingType);
      }
    }

    // Add property status (all/ready/off-plan)
    if (propertyStatus && propertyStatus !== "all") {
      params.set("status", propertyStatus);
    }

    // Add property type - use the ID directly if it's from lookup, otherwise find it
    if (propertyType && propertyType !== "all") {
      // Check if it's already an ID (from propertyTypes list)
      const isId = propertyTypes.some((pt) => pt.$id === propertyType);
      if (isId) {
        params.set("type", propertyType);
      } else {
        // Try to find by name/category
        const matchingType = propertyTypes.find(
          (pt) => pt.name?.toLowerCase() === propertyType.toLowerCase() ||
            pt.category?.toLowerCase() === propertyType.toLowerCase()
        );
        if (matchingType) {
          params.set("type", matchingType.$id);
        }
      }
    }

    // Add bedrooms filter
    if (bedsFilter && bedsFilter !== "any") {
      // Handle 5+ as 5
      const beds = bedsFilter === "5+" ? "5" : bedsFilter;
      params.set("beds", beds);
    }

    // Add price filter with Pakistani Rupees ranges (Lac/Crore)
    if (priceFilter && priceFilter !== "any") {
      const priceRanges: Record<string, { min?: number; max?: number }> = {
        // Standard ranges
        "0-200k": { min: 0, max: 200000 },
        "200k-500k": { min: 200000, max: 500000 },
        "500k-1m": { min: 500000, max: 1000000 },
        "1m-2m": { min: 1000000, max: 2000000 },
        "2m+": { min: 2000000 },
        // Pakistani Rupees ranges (Lac = 100,000, Crore = 10,000,000)
        "0-50lac": { min: 0, max: 5000000 },
        "50lac-1cr": { min: 5000000, max: 10000000 },
        "1cr-2cr": { min: 10000000, max: 20000000 },
        "2cr-5cr": { min: 20000000, max: 50000000 },
        "5cr+": { min: 50000000 },
      };
      const range = priceRanges[priceFilter];
      if (range) {
        if (range.min !== undefined) params.set("min_price", range.min.toString());
        if (range.max !== undefined) params.set("max_price", range.max.toString());
      }
    }

    const queryString = params.toString();
    router.push(queryString ? `/properties?${queryString}` : "/properties");
  };

  const formatPrice = (price: number, type: string) => {
    if (type === "For Rent") {
      return `$${price.toLocaleString()}/mo`;
    }
    return `$${price.toLocaleString()}`;
  };

  // No longer showing full-page loading - auth loading is handled in header

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[600px] md:min-h-[700px] flex flex-col">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&h=1080&fit=crop"
            alt="Beautiful home"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="container mx-auto max-w-7xl px-4 py-12 md:py-16 relative z-10 flex-1 flex flex-col">
          {/* Hero Text */}
          <div className="text-center text-white mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Real homes live here
            </h1>
            <p className="text-lg md:text-xl text-white/90">
              Real Data. Real Brokers. Real Properties.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-full p-1.5 shadow-lg inline-flex gap-1">
              <button
                onClick={() => setActiveTab("properties")}
                className={`px-4 md:px-6 py-2.5 rounded-full text-sm font-medium transition-all ${activeTab === "properties"
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                Properties
              </button>
              <button
                onClick={() => setActiveTab("new-projects")}
                className={`px-4 md:px-6 py-2.5 rounded-full text-sm font-medium transition-all ${activeTab === "new-projects"
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                New Projects
              </button>
              <button
                onClick={() => setActiveTab("transactions")}
                className={`px-4 md:px-6 py-2.5 rounded-full text-sm font-medium transition-all ${activeTab === "transactions"
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                Transactions
              </button>
              <button
                onClick={() => setActiveTab("agents")}
                className={`px-4 md:px-6 py-2.5 rounded-full text-sm font-medium transition-all ${activeTab === "agents"
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                Agents
              </button>
            </div>
          </div>

          {/* Search Card */}
          <div className="max-w-4xl mx-auto w-full">
            <Card className="bg-white rounded-3xl shadow-2xl p-5 md:p-8">
              {/* First Row - Buy/Rent Toggle + Location + Search */}
              <div className="flex flex-col md:flex-row gap-3">
                {/* Buy/Rent Toggle */}
                <div className="flex rounded-full border border-gray-200 overflow-hidden flex-shrink-0">
                  <button
                    onClick={() => setListingType("buy")}
                    className={`px-6 py-3 text-sm font-medium transition-all ${listingType === "buy"
                      ? "bg-primary text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => setListingType("rent")}
                    className={`px-6 py-3 text-sm font-medium transition-all border-l border-gray-200 ${listingType === "rent"
                      ? "bg-primary text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    Rent
                  </button>
                </div>

                {/* Location Input */}
                <div className="flex-1 relative">
                  <MapPinIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Enter city, neighborhood, or ZIP code"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-12 h-12 text-gray-900 rounded-full border-gray-200 focus-visible:ring-primary"
                  />
                </div>

                {/* Search Button */}
                <Button size="lg" className="h-12 px-10 rounded-full text-base" onClick={handleSearch}>
                  <SearchIcon className="mr-2 h-5 w-5" />
                  Search
                </Button>
              </div>

              {/* Second Row - Filters */}
              <div className="flex gap-3 items-center w-full">
                {/* Property Status Toggle */}
                <div className="flex rounded-full border border-gray-200 overflow-hidden h-11">
                  <button
                    onClick={() => setPropertyStatus("all")}
                    className={`px-5 text-sm font-medium transition-all h-full ${propertyStatus === "all"
                      ? "bg-primary text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setPropertyStatus("ready")}
                    className={`px-5 text-sm font-medium transition-all border-l border-gray-200 h-full ${propertyStatus === "ready"
                      ? "bg-primary text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    Ready
                  </button>
                  <button
                    onClick={() => setPropertyStatus("off-plan")}
                    className={`px-5 text-sm font-medium transition-all border-l border-gray-200 h-full ${propertyStatus === "off-plan"
                      ? "bg-primary text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    Off-Plan
                  </button>
                </div>

                {/* Property Type Button */}
                <button
                  onClick={() => setTypeDialogOpen(true)}
                  className="flex-1 flex items-center justify-between gap-2 h-11 px-5 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                >
                  <span>
                    {propertyType === "all"
                      ? "All Types"
                      : propertyTypes.find(pt => pt.$id === propertyType)?.name || propertyType}
                  </span>
                  <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                </button>

                {/* Beds Button */}
                <button
                  onClick={() => setBedsDialogOpen(true)}
                  className="flex-1 flex items-center justify-between gap-2 h-11 px-5 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                >
                  <span>{bedsFilter === "any" ? "Any Beds" : bedsFilter === "4" ? "4+ Beds" : `${bedsFilter} Bed${bedsFilter !== "1" ? "s" : ""}`}</span>
                  <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                </button>

                {/* Price Button */}
                <button
                  onClick={() => setPriceDialogOpen(true)}
                  className="flex-1 flex items-center justify-between gap-2 h-11 px-5 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                >
                  <span>
                    {priceFilter === "any" ? "Any Price" :
                      priceFilter === "0-50lac" ? "Up to 50 Lac" :
                        priceFilter === "50lac-1cr" ? "50 Lac - 1 Cr" :
                          priceFilter === "1cr-2cr" ? "1 - 2 Crore" :
                            priceFilter === "2cr-5cr" ? "2 - 5 Crore" :
                              priceFilter === "5cr+" ? "5 Crore+" : priceFilter}
                  </span>
                  <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                </button>
              </div>

              {/* Property Type Dialog */}
              <Dialog open={typeDialogOpen} onOpenChange={setTypeDialogOpen}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Property Type</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-3 pt-4 max-h-80 overflow-y-auto">
                    {/* All Types option */}
                    <button
                      onClick={() => {
                        setPropertyType("all");
                        setTypeDialogOpen(false);
                      }}
                      className={`p-4 rounded-xl border text-sm font-medium transition-all ${propertyType === "all"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                        }`}
                    >
                      All Types
                    </button>
                    {/* Dynamic property types from Appwrite */}
                    {propertyTypes.map((type) => (
                      <button
                        key={type.$id}
                        onClick={() => {
                          setPropertyType(type.$id);
                          setTypeDialogOpen(false);
                        }}
                        className={`p-4 rounded-xl border text-sm font-medium transition-all ${propertyType === type.$id
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-gray-200 hover:border-gray-300 text-gray-700"
                          }`}
                      >
                        {type.name}
                      </button>
                    ))}
                    {/* Fallback options if no property types loaded */}
                    {propertyTypes.length === 0 && (
                      <>
                        {["residential", "commercial", "land"].map((type) => (
                          <button
                            key={type}
                            onClick={() => {
                              setPropertyType(type);
                              setTypeDialogOpen(false);
                            }}
                            className={`p-4 rounded-xl border text-sm font-medium transition-all ${propertyType === type
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-gray-200 hover:border-gray-300 text-gray-700"
                              }`}
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Beds Dialog */}
              <Dialog open={bedsDialogOpen} onOpenChange={setBedsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Number of Bedrooms</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-3 gap-3 pt-4">
                    {["any", "1", "2", "3", "4", "5"].map((bed) => (
                      <button
                        key={bed}
                        onClick={() => {
                          setBedsFilter(bed);
                          setBedsDialogOpen(false);
                        }}
                        className={`p-4 rounded-xl border text-sm font-medium transition-all ${bedsFilter === bed
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-gray-200 hover:border-gray-300 text-gray-700"
                          }`}
                      >
                        {bed === "any" ? "Any" : bed === "5" ? "5+" : bed}
                      </button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Price Dialog */}
              <Dialog open={priceDialogOpen} onOpenChange={setPriceDialogOpen}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Price Range (PKR)</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 gap-2 pt-4 max-h-80 overflow-y-auto">
                    {[
                      { value: "any", label: "Any Price" },
                      { value: "0-50lac", label: "Up to 50 Lac" },
                      { value: "50lac-1cr", label: "50 Lac - 1 Crore" },
                      { value: "1cr-2cr", label: "1 Crore - 2 Crore" },
                      { value: "2cr-5cr", label: "2 Crore - 5 Crore" },
                      { value: "5cr+", label: "5 Crore+" },
                    ].map((price) => (
                      <button
                        key={price.value}
                        onClick={() => {
                          setPriceFilter(price.value);
                          setPriceDialogOpen(false);
                        }}
                        className={`p-4 rounded-xl border text-sm font-medium transition-all text-left ${priceFilter === price.value
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-gray-200 hover:border-gray-300 text-gray-700"
                          }`}
                      >
                        {price.label}
                      </button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              {/* AI Prompt Banner */}
              <div className=" pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <HomeIcon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm text-gray-600">
                    Want to find out more about real estate using AI?
                  </span>
                </div>
                <Link href="/ai-search" className="text-sm font-medium text-primary hover:underline flex items-center gap-1 whitespace-nowrap">
                  Try AI Search
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </Card>
          </div>

          {/* Experience the Journey Button */}
          <div className="flex justify-center mt-auto pt-8">
            <Button
              variant="outline"
              className="rounded-full bg-black/50 border-white/30 text-white hover:bg-black/70 hover:text-white px-6"
            >
              <PlayCircleIcon className="mr-2 h-5 w-5" />
              Experience the Journey
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section - Build Trust Immediately */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="h-7 w-7 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-1 text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties - Show Product Right Away */}
      <section className="py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Featured Properties
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Handpicked properties by our experts for you
              </p>
            </div>
            <Link href="/properties">
              <Button variant="outline" className="mt-4 md:mt-0 rounded-full">
                View All Properties
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 p-0 gap-0">
                <div className="relative overflow-hidden">
                  <Image
                    src={property.image}
                    alt={property.title}
                    width={800}
                    height={600}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className={property.type === "For Sale" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}>
                      {property.type}
                    </Badge>
                    {property.featured && (
                      <Badge variant="secondary" className="bg-chart-4 text-foreground">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                    <HeartIcon className="h-5 w-5 text-muted-foreground hover:text-destructive transition-colors" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-xl text-foreground group-hover:text-primary transition-colors">
                      {property.title}
                    </h3>
                  </div>
                  <div className="flex items-center text-muted-foreground mb-4">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    <span className="text-sm">{property.location}</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <BedDoubleIcon className="h-4 w-4" />
                      <span>{property.beds} Beds</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BathIcon className="h-4 w-4" />
                      <span>{property.baths} Baths</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <RulerIcon className="h-4 w-4" />
                      <span>{property.sqft.toLocaleString()} sqft</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(property.price, property.type)}
                    </span>
                    <Button size="sm" variant="outline" className="rounded-full">
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Cities - Geographic Discovery */}
      <section className="py-20 bg-background">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Explore Popular Cities
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Discover properties in the most sought-after locations
              </p>
            </div>
            <Link href="/properties">
              <Button variant="outline" className="mt-4 md:mt-0 rounded-full">
                View All Cities
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularCities.map((city) => (
              <Link href="/properties" key={city.name}>
                <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer p-0 gap-0">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={city.image}
                      alt={city.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-2xl font-bold mb-1">{city.name}</h3>
                      <p className="text-white/80 text-sm">{city.properties.toLocaleString()} Properties</p>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 text-foreground hover:bg-white">
                        Avg. {city.avgPrice}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find your perfect home in just 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <SearchIcon className="h-10 w-10 text-primary" />
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Search Properties</h3>
              <p className="text-muted-foreground">
                Browse thousands of listings with our powerful search filters. Find homes that match your criteria.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <UsersIcon className="h-10 w-10 text-accent-foreground" />
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Connect with Agents</h3>
              <p className="text-muted-foreground">
                Get in touch with verified real estate agents who can guide you through the process.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <HomeIcon className="h-10 w-10 text-primary" />
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Close the Deal</h3>
              <p className="text-muted-foreground">
                Complete your purchase or rental with confidence. We&apos;re with you every step of the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Property Categories - Help with Navigation */}
      <section className="py-16 bg-background">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Browse by Property Type
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find the perfect property that fits your lifestyle and needs
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {propertyCategories.map((category) => (
              <Link href="/properties" key={category.name}>
                <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                  <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-colors">
                    <category.icon className="h-8 w-8 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count.toLocaleString()} Properties</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Reinforce Value */}
      <section className="py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Real Landing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide the best experience in finding your perfect property
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((feature, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Social Proof */}
      <section className="py-20 bg-background">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied homeowners and renters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 fill-chart-4 text-chart-4" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">&ldquo;{testimonial.content}&rdquo;</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Sold - FOMO/Urgency */}
      <section className="py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Recently Sold Properties
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                See what&apos;s selling in your area
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentlySold.map((property, index) => (
              <Card key={index} className="overflow-hidden p-0 gap-0">
                <div className="relative overflow-hidden">
                  <Image
                    src={property.image}
                    alt={property.title}
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-chart-1 text-white">
                    SOLD
                  </Badge>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg text-foreground mb-1">{property.title}</h3>
                  <div className="flex items-center text-muted-foreground mb-4">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-2xl font-bold text-primary">${property.soldPrice.toLocaleString()}</span>
                      {property.soldPrice > property.originalPrice && (
                        <div className="flex items-center text-sm text-chart-1">
                          <TrendingUpIcon className="h-3 w-3 mr-1" />
                          Above asking
                        </div>
                      )}
                      {property.soldPrice < property.originalPrice && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <TrendingDownIcon className="h-3 w-3 mr-1" />
                          Below asking
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Sold in</div>
                      <div className="font-semibold text-foreground">{property.daysOnMarket} days</div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Agents - Human Connection */}
      <section className="py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Meet Our Expert Agents
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Work with the best professionals in the industry
              </p>
            </div>
            <Link href="/agents">
              <Button variant="outline" className="mt-4 md:mt-0 rounded-full">
                View All Agents
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredAgents.map((agent) => (
              <Card key={agent.name} className="overflow-hidden group hover:shadow-lg transition-all duration-300 p-0 gap-0">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={agent.image}
                    alt={agent.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg text-foreground">{agent.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{agent.title}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <StarIcon className="h-4 w-4 fill-chart-4 text-chart-4" />
                      <span className="font-medium">{agent.rating}</span>
                    </div>
                    <Badge variant="secondary">{agent.deals} Deals</Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mortgage Calculator CTA - Interactive Engagement */}
      <section className="py-20 bg-background">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary/5 via-secondary to-primary/5 border border-border">
            <div className="flex-1 text-center lg:text-left">
              <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-6 mx-auto lg:mx-0">
                <CalculatorIcon className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Calculate Your Mortgage
              </h2>
              <p className="text-lg text-muted-foreground mb-6 max-w-xl">
                Use our free mortgage calculator to estimate your monthly payments and see how much house you can afford.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="rounded-full px-8">
                  <CalculatorIcon className="mr-2 h-5 w-5" />
                  Calculate Now
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8">
                  Get Pre-Approved
                </Button>
              </div>
            </div>
            <div className="flex-1 w-full max-w-md">
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4 text-foreground">Quick Estimate</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Home Price</label>
                    <Input type="text" placeholder="$500,000" className="rounded-lg" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Down Payment</label>
                    <Input type="text" placeholder="$100,000 (20%)" className="rounded-lg" />
                  </div>
                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Est. Monthly Payment</span>
                      <span className="text-2xl font-bold text-primary">$2,847</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Latest from Our Blog
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Tips, insights, and news from the real estate world
              </p>
            </div>
            <Link href="/blogs">
              <Button variant="outline" className="mt-4 md:mt-0 rounded-full">
                Read All Articles
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <Card key={index} className="overflow-hidden group hover:shadow-lg transition-all duration-300 p-0 gap-0">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <Badge className="absolute top-4 left-4 bg-white/90 text-foreground hover:bg-white">
                    {post.category}
                  </Badge>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="h-4 w-4" />
                      {post.readTime}
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">{post.excerpt}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App CTA */}
      <section className="py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12 p-8 md:p-12 rounded-3xl bg-primary text-primary-foreground">
            <div className="flex-1 text-center lg:text-left">
              <Badge variant="secondary" className="mb-6 bg-white/20 text-primary-foreground border-white/30">
                Coming Soon
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Get Our Mobile App
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-6 max-w-xl">
                Search properties, schedule viewings, and connect with agents on the go. Download our app for the best mobile experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" variant="secondary" className="rounded-full px-8">
                  <SmartphoneIcon className="mr-2 h-5 w-5" />
                  App Store
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8 border-white/30 text-primary-foreground hover:bg-white/10">
                  <PlayCircleIcon className="mr-2 h-5 w-5" />
                  Google Play
                </Button>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative w-64 h-[500px] bg-white/10 rounded-[3rem] border-4 border-white/20 flex items-center justify-center">
                <div className="text-center p-8">
                  <SmartphoneIcon className="h-16 w-16 mx-auto mb-4 text-primary-foreground/60" />
                  <p className="text-primary-foreground/60 text-sm">App Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges / Partners */}
      <section className="py-16 bg-background">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <p className="text-muted-foreground text-lg">Trusted by industry leaders and recognized by</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {partners.map((partner, index) => (
              <div key={index} className="text-muted-foreground/50 font-semibold text-lg hover:text-muted-foreground transition-colors">
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 p-12 rounded-3xl bg-secondary border border-border">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Ready to Find Your Dream Home?
              </h2>
              <p className="text-xl text-muted-foreground max-w-xl">
                Start your property search today or list your property with us. We make real estate simple.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="rounded-full px-8">
                <SearchIcon className="mr-2 h-5 w-5" />
                Browse Properties
              </Button>
              {!isAuthenticated && (
                <Button size="lg" variant="outline" className="rounded-full px-8">
                  <Link href="/signup" className="flex items-center">
                    Get Started Free
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-background border-t border-border">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-2 text-foreground">Stay Updated</h3>
              <p className="text-muted-foreground">Get the latest property listings and market insights delivered to your inbox.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="rounded-full px-6 w-full md:w-80"
              />
              <Button className="rounded-full px-6">Subscribe</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Bar */}
      <section className="py-6 bg-background border-t border-border">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <PhoneIcon className="h-4 w-4 text-primary" />
              <span>1-800-REAL-LAND</span>
            </div>
            <div className="flex items-center gap-2">
              <MailIcon className="h-4 w-4 text-primary" />
              <span>contact@reallanding.com</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPinIcon className="h-4 w-4 text-primary" />
              <span>123 Property Lane, Real Estate City, RE 12345</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
