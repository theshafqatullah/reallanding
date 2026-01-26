"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";
import { lookupsService, type PropertyType, type ListingType, type City, type Location } from "@/services/lookups";
import { propertiesService } from "@/services/properties";
import { usersService } from "@/services/users";
import { blogsService } from "@/services/blogs";
import { type Properties, type Users, type BlogPosts } from "@/types/appwrite";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
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
  SparklesIcon,
  BrainIcon,
  ScanIcon,
  Glasses,
  MousePointerClickIcon,
  Cpu,
  Zap,
  Globe,
  Video,
  Mic,
  Camera,
  Box,
} from "lucide-react";

// Mock featured properties data - will be replaced with real data
const mockFeaturedProperties = [
  {
    id: 1,
    title: "Modern Luxury Villa",
    location: "DHA, Lahore",
    price: 35000000,
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
    location: "Gulberg, Lahore",
    price: 85000,
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
    location: "Bahria Town, Islamabad",
    price: 67500000,
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
    location: "Clifton, Karachi",
    price: 125000000,
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
    location: "Murree, Punjab",
    price: 32000000,
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
    location: "F-7, Islamabad",
    price: 45000,
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
  { label: "Properties Listed", value: "50K+", numericValue: 50000, suffix: "+", icon: HomeIcon },
  { label: "Happy Customers", value: "25K+", numericValue: 25000, suffix: "+", icon: UsersIcon },
  { label: "Cities Covered", value: "200+", numericValue: 200, suffix: "+", icon: MapPinIcon },
  { label: "Expert Agents", value: "1K+", numericValue: 1000, suffix: "+", icon: ShieldCheckIcon },
];

// Custom hook for counting animation
function useCountUp(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const startCounting = useCallback(() => {
    if (hasStarted) return;
    setHasStarted(true);

    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, hasStarted]);

  useEffect(() => {
    if (!startOnView) {
      startCounting();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startCounting();
          }
        });
      },
      { threshold: 0.3 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [startCounting, startOnView]);

  return { count, ref };
}

// Format large numbers (e.g., 50000 -> 50K)
function formatStatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + "K";
  }
  return num.toString();
}

// Individual stat item component with animation
function AnimatedStatItem({ stat }: { stat: typeof stats[0] }) {
  const { count, ref } = useCountUp(stat.numericValue, 2000);

  return (
    <div ref={ref} className="text-center">
      <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-3">
        <stat.icon className="h-7 w-7 text-primary" />
      </div>
      <div className="text-3xl md:text-4xl font-bold mb-1 text-foreground">
        {formatStatNumber(count)}{stat.suffix}
      </div>
      <div className="text-sm text-muted-foreground">{stat.label}</div>
    </div>
  );
}

// Popular cities data - will be populated with real data
const mockPopularCities = [
  {
    name: "Lahore",
    properties: 2456,
    image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=600&h=400&fit=crop",
    avgPrice: "1.5 Cr",
  },
  {
    name: "Karachi",
    properties: 1832,
    image: "https://images.unsplash.com/photo-1567501155-f5c0c5e45ff7?w=600&h=400&fit=crop",
    avgPrice: "2.2 Cr",
  },
  {
    name: "Islamabad",
    properties: 1245,
    image: "https://images.unsplash.com/photo-1603490834571-1a9b4b9b3c01?w=600&h=400&fit=crop",
    avgPrice: "2.8 Cr",
  },
  {
    name: "Rawalpindi",
    properties: 987,
    image: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=600&h=400&fit=crop",
    avgPrice: "85 Lac",
  },
  {
    name: "Faisalabad",
    properties: 756,
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&h=400&fit=crop",
    avgPrice: "65 Lac",
  },
  {
    name: "Multan",
    properties: 654,
    image: "https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=600&h=400&fit=crop",
    avgPrice: "55 Lac",
  },
];

// Featured agents data - will be replaced with real data
const mockFeaturedAgents = [
  {
    name: "Ahmed Hassan",
    title: "Senior Real Estate Agent",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    deals: 156,
    rating: 4.9,
    specialization: "Luxury Homes",
  },
  {
    name: "Sarah Ahmed",
    title: "Commercial Property Specialist",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop",
    deals: 203,
    rating: 4.8,
    specialization: "Commercial",
  },
  {
    name: "Fatima Khan",
    title: "Residential Expert",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop",
    deals: 189,
    rating: 5.0,
    specialization: "Family Homes",
  },
  {
    name: "Ali Raza",
    title: "Investment Advisor",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop",
    deals: 134,
    rating: 4.9,
    specialization: "Investment",
  },
];

// Blog posts data - will be replaced with real data
const mockBlogPosts = [
  {
    title: "10 Tips for First-Time Home Buyers in Pakistan",
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

// AI & Technology Innovation Features
const aiInnovations = [
  {
    icon: BrainIcon,
    title: "AI-Powered Property Matching",
    description: "Our intelligent algorithm learns your preferences and suggests properties that perfectly match your lifestyle, budget, and needs.",
    badge: "AI Powered",
    gradient: "from-primary to-primary/80",
  },
  {
    icon: Glasses,
    title: "Virtual Reality Tours",
    description: "Experience immersive 3D walkthroughs of properties from anywhere in the world. No need to travel for initial viewings.",
    badge: "VR Ready",
    gradient: "from-primary/90 to-primary/70",
  },
  {
    icon: Box,
    title: "Augmented Reality Staging",
    description: "Visualize how your furniture fits in any space. See empty rooms transformed with virtual staging in real-time.",
    badge: "AR Tech",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Mic,
    title: "AI Voice Assistant",
    description: "Search properties, schedule viewings, and get answers using natural voice commands. Your personal real estate concierge.",
    badge: "Voice AI",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: ScanIcon,
    title: "Smart Document Analysis",
    description: "AI-powered document scanning extracts and verifies property documents, legal papers, and ownership records instantly.",
    badge: "DocAI",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Cpu,
    title: "Predictive Price Analytics",
    description: "Machine learning models analyze market trends to predict future property values and investment potential.",
    badge: "ML Analytics",
    gradient: "from-primary/80 to-primary/60",
  },
];

// Smart Features for property exploration
const smartFeatures = [
  {
    icon: Camera,
    title: "360° Virtual Tours",
    description: "Explore every corner of a property with immersive 360-degree photography",
  },
  {
    icon: Video,
    title: "Live Video Calls",
    description: "Connect with agents and sellers through instant video consultations",
  },
  {
    icon: Globe,
    title: "Neighborhood AI",
    description: "AI-analyzed insights on schools, crime rates, amenities, and lifestyle fit",
  },
  {
    icon: Zap,
    title: "Instant Valuations",
    description: "Get accurate property valuations in seconds using our AI valuation model",
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
  const [cityFilter, setCityFilter] = useState("all");
  // State for new hero filters
  const [propertyStatus, setPropertyStatus] = useState("all");
  const [bedsFilter, setBedsFilter] = useState("any");
  const [priceFilter, setPriceFilter] = useState("any");
  const [activeTab, setActiveTab] = useState("properties");
  // Dialog states for filter modals
  const [typeDialogOpen, setTypeDialogOpen] = useState(false);
  const [bedsDialogOpen, setBedsDialogOpen] = useState(false);
  const [priceDialogOpen, setPriceDialogOpen] = useState(false);
  const [cityDialogOpen, setCityDialogOpen] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState("");

  // Agent search state
  const [agentSearchQuery, setAgentSearchQuery] = useState("");
  const [agentType, setAgentType] = useState("all"); // all, agent, agency
  const [agentSpecialization, setAgentSpecialization] = useState("all");
  const [agentCityFilter, setAgentCityFilter] = useState("all");
  const [agentCityDialogOpen, setAgentCityDialogOpen] = useState(false);
  const [agentSpecDialogOpen, setAgentSpecDialogOpen] = useState(false);

  // Project search state
  const [projectSearchQuery, setProjectSearchQuery] = useState("");
  const [projectStatus, setProjectStatus] = useState("all"); // all, upcoming, under-construction, ready
  const [projectType, setProjectType] = useState("all"); // all, residential, commercial, mixed
  const [projectCityFilter, setProjectCityFilter] = useState("all");
  const [projectCityDialogOpen, setProjectCityDialogOpen] = useState(false);
  const [projectTypeDialogOpen, setProjectTypeDialogOpen] = useState(false);

  // Mortgage calculator state
  const [homePrice, setHomePrice] = useState(10000000); // 1 Crore PKR default
  const [downPayment, setDownPayment] = useState(2000000); // 20 Lac PKR default
  const [interestRate, setInterestRate] = useState(18); // 18% default for Pakistan
  const [loanTerm, setLoanTerm] = useState(20); // 20 years default

  // Calculate monthly mortgage payment
  const calculateMonthlyPayment = useCallback(() => {
    const principal = homePrice - downPayment;
    if (principal <= 0) return 0;

    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    if (monthlyRate === 0) {
      return principal / numberOfPayments;
    }

    const payment = principal *
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    return Math.round(payment);
  }, [homePrice, downPayment, interestRate, loanTerm]);

  const monthlyPayment = calculateMonthlyPayment();
  const downPaymentPercent = homePrice > 0 ? Math.round((downPayment / homePrice) * 100) : 0;

  // Format currency for PKR
  const formatPKRInput = (value: number) => {
    if (value >= 10000000) {
      return `${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
      return `${(value / 100000).toFixed(2)} Lac`;
    }
    return value.toLocaleString();
  };

  // Parse user input to number
  const parseInputValue = (value: string): number => {
    const cleaned = value.replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
  };

  // Lookup data from Appwrite
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [listingTypes, setListingTypes] = useState<ListingType[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  // Real data states
  const [featuredProperties, setFeaturedProperties] = useState<Properties[]>([]);
  const [featuredAgents, setFeaturedAgents] = useState<Users[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPosts[]>([]);
  const [popularCities, setPopularCities] = useState(mockPopularCities);
  const [dataLoading, setDataLoading] = useState(true);

  // Filtered cities based on search query
  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  // Load lookup data and real data on mount
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

        // Update popular cities with real data
        if (allCities.length > 0) {
          const cityImages = [
            "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1567501155-f5c0c5e45ff7?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1603490834571-1a9b4b9b3c01?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=600&h=400&fit=crop",
          ];

          // Get actual property counts for cities
          const cityIds = allCities.slice(0, 6).map(c => c.$id);
          const cityCounts = await propertiesService.getCountsByCities(cityIds);

          const updatedCities = allCities.slice(0, 6).map((city, index) => ({
            id: city.$id,
            name: city.name,
            properties: cityCounts[city.$id] || 0,
            image: cityImages[index] || cityImages[0],
            avgPrice: "Contact for price",
          }));
          setPopularCities(updatedCities);
        }
      } catch (error) {
        console.error("Error loading lookups:", error);
      }
    };

    const loadFeaturedData = async () => {
      setDataLoading(true);
      try {
        // Fetch featured properties
        const { properties: featuredProps } = await propertiesService.list({
          is_featured: true,
          is_published: true,
          limit: 6,
        });
        if (featuredProps.length > 0) {
          setFeaturedProperties(featuredProps);
        }

        // Fetch featured agents
        const agents = await usersService.getFeaturedAgents(4);
        if (agents.length > 0) {
          setFeaturedAgents(agents);
        }

        // Fetch latest blog posts
        const posts = await blogsService.getLatest(3);
        if (posts.length > 0) {
          setBlogPosts(posts);
        }
      } catch (error) {
        console.error("Error loading featured data:", error);
      } finally {
        setDataLoading(false);
      }
    };

    loadLookups();
    loadFeaturedData();
  }, []);

  // Handle search and navigate to properties page with filters
  const handleSearch = async () => {
    const params = new URLSearchParams();

    // Add city filter if selected
    if (cityFilter && cityFilter !== "all") {
      params.set("city", cityFilter);
    }

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
        (lt) => lt.name?.toLowerCase() === listingType.toLowerCase()
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

  // Handle agent search
  const handleAgentSearch = () => {
    const params = new URLSearchParams();

    // Add search query
    if (agentSearchQuery.trim()) {
      params.set("q", agentSearchQuery.trim());
    }

    // Add agent type filter
    if (agentType && agentType !== "all") {
      params.set("type", agentType);
    }

    // Add city filter
    if (agentCityFilter && agentCityFilter !== "all") {
      params.set("city", agentCityFilter);
    }

    // Add specialization filter
    if (agentSpecialization && agentSpecialization !== "all") {
      params.set("specialization", agentSpecialization);
    }

    const queryString = params.toString();
    router.push(queryString ? `/agents?${queryString}` : "/agents");
  };

  // Handle project search
  const handleProjectSearch = () => {
    const params = new URLSearchParams();

    // Add search query
    if (projectSearchQuery.trim()) {
      params.set("q", projectSearchQuery.trim());
    }

    // Add project status filter
    if (projectStatus && projectStatus !== "all") {
      params.set("status", projectStatus);
    }

    // Add project type filter
    if (projectType && projectType !== "all") {
      params.set("type", projectType);
    }

    // Add city filter
    if (projectCityFilter && projectCityFilter !== "all") {
      params.set("city", projectCityFilter);
    }

    const queryString = params.toString();
    router.push(queryString ? `/properties?project=true&${queryString}` : "/properties?project=true");
  };

  // Format price for display (PKR with Lac/Crore)
  const formatPricePKR = (price: number, currency: string = "PKR") => {
    if (currency === "PKR") {
      if (price >= 10000000) {
        return `PKR ${(price / 10000000).toFixed(2)} Cr`;
      } else if (price >= 100000) {
        return `PKR ${(price / 100000).toFixed(2)} Lac`;
      }
      return `PKR ${price.toLocaleString()}`;
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price);
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
              {/* Properties Search Card */}
              {activeTab === "properties" && (
                <div className="space-y-4">
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
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center w-full">
                    {/* Property Status Toggle */}
                    <div className="flex rounded-full border border-gray-200 overflow-hidden h-11 flex-shrink-0">
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

                    {/* City Button */}
                    <button
                      onClick={() => setCityDialogOpen(true)}
                      className="flex-1 sm:flex-initial flex items-center justify-between gap-2 h-11 px-5 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                    >
                      <span>
                        {cityFilter === "all"
                          ? "All Cities"
                          : cities.find(c => c.$id === cityFilter)?.name || cityFilter}
                      </span>
                      <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                    </button>

                    {/* Property Type Button */}
                    <button
                      onClick={() => setTypeDialogOpen(true)}
                      className="flex-1 sm:flex-initial flex items-center justify-between gap-2 h-11 px-5 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
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
                      className="flex-1 sm:flex-initial flex items-center justify-between gap-2 h-11 px-5 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
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
                </div>
              )}

              {/* Agents Search Card */}
              {activeTab === "agents" && (
                <div className="space-y-4">
                  {/* First Row - Agent Type Toggle + Search */}
                  <div className="flex flex-col md:flex-row gap-3">
                    {/* Agent/Agency Toggle */}
                    <div className="flex rounded-full border border-gray-200 overflow-hidden flex-shrink-0">
                      <button
                        onClick={() => setAgentType("all")}
                        className={`px-5 py-3 text-sm font-medium transition-all ${agentType === "all"
                          ? "bg-primary text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setAgentType("agent")}
                        className={`px-5 py-3 text-sm font-medium transition-all border-l border-gray-200 ${agentType === "agent"
                          ? "bg-primary text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        Agents
                      </button>
                      <button
                        onClick={() => setAgentType("agency")}
                        className={`px-5 py-3 text-sm font-medium transition-all border-l border-gray-200 ${agentType === "agency"
                          ? "bg-primary text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        Agencies
                      </button>
                    </div>

                    {/* Search Input */}
                    <div className="flex-1 relative">
                      <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search by name, agency, or area of expertise"
                        value={agentSearchQuery}
                        onChange={(e) => setAgentSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAgentSearch()}
                        className="pl-12 h-12 text-gray-900 rounded-full border-gray-200 focus-visible:ring-primary"
                      />
                    </div>

                    {/* Search Button */}
                    <Button size="lg" className="h-12 px-10 rounded-full text-base" onClick={handleAgentSearch}>
                      <SearchIcon className="mr-2 h-5 w-5" />
                      Search
                    </Button>
                  </div>

                  {/* Second Row - Filters */}
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center w-full">
                    {/* City Button */}
                    <button
                      onClick={() => setAgentCityDialogOpen(true)}
                      className="flex-1 sm:flex-initial flex items-center justify-between gap-2 h-11 px-5 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                    >
                      <MapPinIcon className="h-4 w-4 text-gray-400" />
                      <span>
                        {agentCityFilter === "all"
                          ? "All Cities"
                          : cities.find(c => c.$id === agentCityFilter)?.name || agentCityFilter}
                      </span>
                      <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                    </button>

                    {/* Specialization Button */}
                    <button
                      onClick={() => setAgentSpecDialogOpen(true)}
                      className="flex-1 sm:flex-initial flex items-center justify-between gap-2 h-11 px-5 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                    >
                      <span>
                        {agentSpecialization === "all"
                          ? "All Specializations"
                          : agentSpecialization === "residential" ? "Residential"
                            : agentSpecialization === "commercial" ? "Commercial"
                              : agentSpecialization === "luxury" ? "Luxury"
                                : agentSpecialization === "rental" ? "Rental"
                                  : agentSpecialization === "land" ? "Land & Plots"
                                    : agentSpecialization}
                      </span>
                      <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              )}

              {/* New Projects Search Card */}
              {activeTab === "new-projects" && (
                <div className="space-y-4">
                  {/* First Row - Project Status Toggle + Search */}
                  <div className="flex flex-col md:flex-row gap-3">
                    {/* Project Status Toggle */}
                    <div className="flex rounded-full border border-gray-200 overflow-hidden flex-shrink-0">
                      <button
                        onClick={() => setProjectStatus("all")}
                        className={`px-4 py-3 text-sm font-medium transition-all ${projectStatus === "all"
                          ? "bg-primary text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setProjectStatus("upcoming")}
                        className={`px-4 py-3 text-sm font-medium transition-all border-l border-gray-200 ${projectStatus === "upcoming"
                          ? "bg-primary text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        Upcoming
                      </button>
                      <button
                        onClick={() => setProjectStatus("under-construction")}
                        className={`px-4 py-3 text-sm font-medium transition-all border-l border-gray-200 ${projectStatus === "under-construction"
                          ? "bg-primary text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        Under Construction
                      </button>
                      <button
                        onClick={() => setProjectStatus("ready")}
                        className={`px-4 py-3 text-sm font-medium transition-all border-l border-gray-200 ${projectStatus === "ready"
                          ? "bg-primary text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        Ready
                      </button>
                    </div>

                    {/* Search Input */}
                    <div className="flex-1 relative">
                      <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search by project name or developer"
                        value={projectSearchQuery}
                        onChange={(e) => setProjectSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleProjectSearch()}
                        className="pl-12 h-12 text-gray-900 rounded-full border-gray-200 focus-visible:ring-primary"
                      />
                    </div>

                    {/* Search Button */}
                    <Button size="lg" className="h-12 px-10 rounded-full text-base" onClick={handleProjectSearch}>
                      <SearchIcon className="mr-2 h-5 w-5" />
                      Search
                    </Button>
                  </div>

                  {/* Second Row - Filters */}
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center w-full">
                    {/* City Button */}
                    <button
                      onClick={() => setProjectCityDialogOpen(true)}
                      className="flex-1 sm:flex-initial flex items-center justify-between gap-2 h-11 px-5 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                    >
                      <MapPinIcon className="h-4 w-4 text-gray-400" />
                      <span>
                        {projectCityFilter === "all"
                          ? "All Cities"
                          : cities.find(c => c.$id === projectCityFilter)?.name || projectCityFilter}
                      </span>
                      <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                    </button>

                    {/* Project Type Button */}
                    <button
                      onClick={() => setProjectTypeDialogOpen(true)}
                      className="flex-1 sm:flex-initial flex items-center justify-between gap-2 h-11 px-5 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                    >
                      <span>
                        {projectType === "all"
                          ? "All Types"
                          : projectType === "residential" ? "Residential"
                            : projectType === "commercial" ? "Commercial"
                              : projectType === "mixed" ? "Mixed Use"
                                : projectType}
                      </span>
                      <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              )}

              {/* City Dialog */}
              <Dialog open={cityDialogOpen} onOpenChange={(open) => {
                setCityDialogOpen(open);
                if (!open) setCitySearchQuery("");
              }}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Select City</DialogTitle>
                  </DialogHeader>
                  {/* Search Bar */}
                  <div className="relative pt-2">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 mt-1 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search cities..."
                      value={citySearchQuery}
                      onChange={(e) => setCitySearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {/* City List */}
                  <div className="flex flex-col gap-1 pt-2 max-h-80 overflow-y-auto">
                    {/* All Cities option */}
                    {citySearchQuery === "" && (
                      <button
                        onClick={() => {
                          setCityFilter("all");
                          setCityDialogOpen(false);
                          setCitySearchQuery("");
                        }}
                        className={`flex items-center gap-3 p-3 rounded-lg border text-sm font-medium transition-all text-left ${cityFilter === "all"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                      >
                        <MapPinIcon className="h-4 w-4 flex-shrink-0" />
                        <span>All Cities</span>
                      </button>
                    )}
                    {/* City options */}
                    {filteredCities.map((city) => (
                      <button
                        key={city.$id}
                        onClick={() => {
                          setCityFilter(city.$id);
                          setCityDialogOpen(false);
                          setCitySearchQuery("");
                        }}
                        className={`flex items-center gap-3 p-3 rounded-lg border text-sm font-medium transition-all text-left ${cityFilter === city.$id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                      >
                        <MapPinIcon className="h-4 w-4 flex-shrink-0" />
                        <span>{city.name}</span>
                      </button>
                    ))}
                    {/* No results message */}
                    {filteredCities.length === 0 && citySearchQuery !== "" && (
                      <div className="p-4 text-center text-sm text-gray-500">
                        No cities found matching &quot;{citySearchQuery}&quot;
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

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

              {/* Agent City Dialog */}
              <Dialog open={agentCityDialogOpen} onOpenChange={(open) => {
                setAgentCityDialogOpen(open);
                if (!open) setCitySearchQuery("");
              }}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Select City</DialogTitle>
                  </DialogHeader>
                  <div className="relative pt-2">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 mt-1 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search cities..."
                      value={citySearchQuery}
                      onChange={(e) => setCitySearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex flex-col gap-1 pt-2 max-h-80 overflow-y-auto">
                    {citySearchQuery === "" && (
                      <button
                        onClick={() => {
                          setAgentCityFilter("all");
                          setAgentCityDialogOpen(false);
                          setCitySearchQuery("");
                        }}
                        className={`flex items-center gap-3 p-3 rounded-lg border text-sm font-medium transition-all text-left ${agentCityFilter === "all"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                      >
                        <MapPinIcon className="h-4 w-4 flex-shrink-0" />
                        <span>All Cities</span>
                      </button>
                    )}
                    {filteredCities.map((city) => (
                      <button
                        key={city.$id}
                        onClick={() => {
                          setAgentCityFilter(city.$id);
                          setAgentCityDialogOpen(false);
                          setCitySearchQuery("");
                        }}
                        className={`flex items-center gap-3 p-3 rounded-lg border text-sm font-medium transition-all text-left ${agentCityFilter === city.$id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                      >
                        <MapPinIcon className="h-4 w-4 flex-shrink-0" />
                        <span>{city.name}</span>
                      </button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Agent Specialization Dialog */}
              <Dialog open={agentSpecDialogOpen} onOpenChange={setAgentSpecDialogOpen}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Specialization</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    {[
                      { value: "all", label: "All Specializations" },
                      { value: "residential", label: "Residential" },
                      { value: "commercial", label: "Commercial" },
                      { value: "luxury", label: "Luxury" },
                      { value: "rental", label: "Rental" },
                      { value: "land", label: "Land & Plots" },
                    ].map((spec) => (
                      <button
                        key={spec.value}
                        onClick={() => {
                          setAgentSpecialization(spec.value);
                          setAgentSpecDialogOpen(false);
                        }}
                        className={`p-4 rounded-xl border text-sm font-medium transition-all ${agentSpecialization === spec.value
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-gray-200 hover:border-gray-300 text-gray-700"
                          }`}
                      >
                        {spec.label}
                      </button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Project City Dialog */}
              <Dialog open={projectCityDialogOpen} onOpenChange={(open) => {
                setProjectCityDialogOpen(open);
                if (!open) setCitySearchQuery("");
              }}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Select City</DialogTitle>
                  </DialogHeader>
                  <div className="relative pt-2">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 mt-1 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search cities..."
                      value={citySearchQuery}
                      onChange={(e) => setCitySearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex flex-col gap-1 pt-2 max-h-80 overflow-y-auto">
                    {citySearchQuery === "" && (
                      <button
                        onClick={() => {
                          setProjectCityFilter("all");
                          setProjectCityDialogOpen(false);
                          setCitySearchQuery("");
                        }}
                        className={`flex items-center gap-3 p-3 rounded-lg border text-sm font-medium transition-all text-left ${projectCityFilter === "all"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                      >
                        <MapPinIcon className="h-4 w-4 flex-shrink-0" />
                        <span>All Cities</span>
                      </button>
                    )}
                    {filteredCities.map((city) => (
                      <button
                        key={city.$id}
                        onClick={() => {
                          setProjectCityFilter(city.$id);
                          setProjectCityDialogOpen(false);
                          setCitySearchQuery("");
                        }}
                        className={`flex items-center gap-3 p-3 rounded-lg border text-sm font-medium transition-all text-left ${projectCityFilter === city.$id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                      >
                        <MapPinIcon className="h-4 w-4 flex-shrink-0" />
                        <span>{city.name}</span>
                      </button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Project Type Dialog */}
              <Dialog open={projectTypeDialogOpen} onOpenChange={setProjectTypeDialogOpen}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Project Type</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    {[
                      { value: "all", label: "All Types" },
                      { value: "residential", label: "Residential" },
                      { value: "commercial", label: "Commercial" },
                      { value: "mixed", label: "Mixed Use" },
                    ].map((type) => (
                      <button
                        key={type.value}
                        onClick={() => {
                          setProjectType(type.value);
                          setProjectTypeDialogOpen(false);
                        }}
                        className={`p-4 rounded-xl border text-sm font-medium transition-all ${projectType === type.value
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-gray-200 hover:border-gray-300 text-gray-700"
                          }`}
                      >
                        {type.label}
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
              <AnimatedStatItem key={stat.label} stat={stat} />
            ))}
          </div>
        </div>
      </section>

      {/* AI & Technology Innovation Section */}
      <section className="py-20 bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">
              <SparklesIcon className="h-4 w-4 mr-2" />
              Powered by AI & Emerging Tech
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              The Future of Real Estate is{" "}
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                Here
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Experience property search like never before with cutting-edge AI, Virtual Reality tours,
              Augmented Reality staging, and smart analytics that put you years ahead.
            </p>
          </div>

          {/* Main AI Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {aiInnovations.map((feature, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-0 bg-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                <div className="p-6 relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}>
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <Badge variant="outline" className="text-xs font-medium">
                      {feature.badge}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* Interactive Demo CTA */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary via-primary/90 to-primary p-1">
            <div className="bg-card rounded-[22px] p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <Badge className="mb-4 bg-primary/10 text-primary border-0">
                    <Glasses className="h-4 w-4 mr-2" />
                    Try VR Experience
                  </Badge>
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    Walk Through Properties<br />
                    <span className="text-primary">Without Leaving Home</span>
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Our immersive VR tours let you explore properties in stunning detail. Walk through rooms,
                    check finishes, measure spaces, and feel the ambiance - all from your device.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button size="lg" className="rounded-full px-8">
                      <Glasses className="mr-2 h-5 w-5" />
                      Try VR Tour
                    </Button>
                    <Button size="lg" variant="outline" className="rounded-full px-8">
                      <Video className="mr-2 h-5 w-5" />
                      Watch Demo
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-secondary border border-border overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
                          <PlayCircleIcon className="h-10 w-10 text-primary" />
                        </div>
                        <p className="text-muted-foreground">Click to experience VR Tour</p>
                      </div>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-4 left-4 w-12 h-12 rounded-xl bg-primary/20 animate-bounce" style={{ animationDelay: "0s" }} />
                    <div className="absolute top-8 right-8 w-8 h-8 rounded-full bg-primary/20 animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <div className="absolute bottom-8 left-8 w-10 h-10 rounded-lg bg-secondary animate-bounce" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Smart Features Row */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {smartFeatures.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="h-8 w-8 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges / Partners - Horizontal Scrolling */}
      <section className="py-12 bg-background overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-8">
            <p className="text-muted-foreground text-lg">Trusted by industry leaders and recognized by</p>
          </div>
        </div>

        {/* Infinite scrolling partners - First row (left to right) */}
        <div className="relative mb-4">
          <div className="flex animate-scroll-right hover:pause-animation gap-8 md:gap-12">
            {[...partners, ...partners, ...partners, ...partners].map((partner, index) => (
              <div
                key={index}
                className="flex-shrink-0 px-6 py-3 bg-secondary/50 rounded-full border border-border hover:border-primary/30 hover:bg-secondary transition-all duration-300"
              >
                <span className="text-muted-foreground font-semibold text-sm md:text-base whitespace-nowrap hover:text-foreground transition-colors">
                  {partner}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Infinite scrolling partners - Second row (right to left) */}
        <div className="relative">
          <div className="flex animate-scroll-left hover:pause-animation gap-8 md:gap-12">
            {[...partners, ...partners, ...partners, ...partners].reverse().map((partner, index) => (
              <div
                key={index}
                className="flex-shrink-0 px-6 py-3 bg-secondary/50 rounded-full border border-border hover:border-primary/30 hover:bg-secondary transition-all duration-300"
              >
                <span className="text-muted-foreground font-semibold text-sm md:text-base whitespace-nowrap hover:text-foreground transition-colors">
                  {partner}
                </span>
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
            {dataLoading ? (
              // Loading skeletons
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden p-0 gap-0">
                  <Skeleton className="h-64 w-full" />
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-8 w-full" />
                  </div>
                </Card>
              ))
            ) : featuredProperties.length > 0 ? (
              featuredProperties.map((property) => {
                const imageUrl = property.main_image_url || property.cover_image_url || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop";
                const listingType = property.listing_type?.name || "For Sale";
                const cityName = property.city?.name || property.location?.name || "";
                const locationName = property.location?.name || "";
                const fullLocation = [locationName, cityName].filter(Boolean).join(", ");
                const currency = property.currency || "PKR";

                return (
                  <Card key={property.$id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 p-0 gap-0">
                    <div className="relative overflow-hidden">
                      <Link href={`/p/${property.slug || property.$id}`}>
                        <Image
                          src={imageUrl}
                          alt={property.title}
                          width={800}
                          height={600}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>
                      <div className="absolute top-4 left-4 flex gap-2">
                        <Badge className={listingType.toLowerCase().includes("rent") ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"}>
                          {listingType}
                        </Badge>
                        {property.is_featured && (
                          <Badge variant="secondary" className="bg-chart-4 text-foreground">
                            Featured
                          </Badge>
                        )}
                        {property.is_verified && (
                          <Badge className="bg-green-500 text-white">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                        <HeartIcon className="h-5 w-5 text-muted-foreground hover:text-destructive transition-colors" />
                      </button>
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <Link href={`/p/${property.slug || property.$id}`}>
                          <h3 className="font-semibold text-xl text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {property.title}
                          </h3>
                        </Link>
                      </div>
                      <div className="flex items-center text-muted-foreground mb-4">
                        <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="text-sm line-clamp-1">{fullLocation || "Location not specified"}</span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        {property.bedrooms && property.bedrooms > 0 && (
                          <div className="flex items-center gap-1">
                            <BedDoubleIcon className="h-4 w-4" />
                            <span>{property.bedrooms} Beds</span>
                          </div>
                        )}
                        {property.bathrooms && property.bathrooms > 0 && (
                          <div className="flex items-center gap-1">
                            <BathIcon className="h-4 w-4" />
                            <span>{property.bathrooms} Baths</span>
                          </div>
                        )}
                        {property.total_area && (
                          <div className="flex items-center gap-1">
                            <RulerIcon className="h-4 w-4" />
                            <span>{property.total_area.toLocaleString()} {property.area_unit || "sqft"}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <span className="text-2xl font-bold text-primary">
                          {formatPricePKR(property.price, currency)}
                        </span>
                        <Button size="sm" variant="outline" className="rounded-full" asChild>
                          <Link href={`/p/${property.slug || property.$id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })
            ) : (
              // Fallback to mock data if no real properties
              mockFeaturedProperties.map((property) => (
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
                        {formatPricePKR(property.price, "PKR")}
                      </span>
                      <Button size="sm" variant="outline" className="rounded-full">
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
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

      {/* Testimonials - Social Proof with Horizontal Scroll */}
      <section className="py-20 bg-background overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied homeowners and renters
            </p>
          </div>
        </div>

        {/* Infinite scrolling testimonials */}
        <div className="relative">
          <div className="flex animate-scroll-left hover:pause-animation gap-6 pb-4">
            {/* Double the testimonials for seamless loop */}
            {[...testimonials, ...testimonials, ...testimonials].map((testimonial, index) => (
              <Card key={index} className="p-8 min-w-[350px] md:min-w-[400px] flex-shrink-0">
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
            {dataLoading ? (
              // Loading skeletons
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="overflow-hidden p-0 gap-0">
                  <Skeleton className="h-64 w-full" />
                  <div className="p-5 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                </Card>
              ))
            ) : featuredAgents.length > 0 ? (
              featuredAgents.map((agent) => {
                const agentName = agent.first_name && agent.last_name
                  ? `${agent.first_name} ${agent.last_name}`
                  : agent.company_name || agent.username;
                const agentImage = agent.profile_image_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop";
                const agentTitle = agent.designation || (agent.user_type === "agency" ? "Real Estate Agency" : "Real Estate Agent");

                return (
                  <Link href={`/u/${agent.username}`} key={agent.$id}>
                    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 p-0 gap-0 cursor-pointer">
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={agentImage}
                          alt={agentName}
                          fill
                          className="object-cover"
                        />
                        {agent.is_verified && (
                          <Badge className="absolute top-3 right-3 bg-green-500 text-white">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">{agentName}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{agentTitle}</p>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <StarIcon className="h-4 w-4 fill-chart-4 text-chart-4" />
                            <span className="font-medium">{agent.rating?.toFixed(1) || "5.0"}</span>
                          </div>
                          <Badge variant="secondary">{agent.total_sales || 0} Deals</Badge>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })
            ) : (
              // Fallback to mock data
              mockFeaturedAgents.map((agent) => (
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
              ))
            )}
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
                  Get Pre-Approved
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8">
                  Talk to Advisor
                </Button>
              </div>
            </div>
            <div className="flex-1 w-full max-w-md">
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4 text-foreground">Quick Estimate</h3>
                <div className="space-y-6">
                  {/* Home Price */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-sm text-muted-foreground">Home Price</label>
                      <span className="text-sm font-medium text-foreground">PKR {formatPKRInput(homePrice)}</span>
                    </div>
                    <Slider
                      min={1000000}
                      max={100000000}
                      step={500000}
                      value={[homePrice]}
                      onValueChange={(value) => setHomePrice(value[0])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>10 Lac</span>
                      <span>10 Cr</span>
                    </div>
                  </div>

                  {/* Down Payment */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-sm text-muted-foreground">Down Payment ({downPaymentPercent}%)</label>
                      <span className="text-sm font-medium text-foreground">PKR {formatPKRInput(downPayment)}</span>
                    </div>
                    <Slider
                      min={0}
                      max={homePrice}
                      step={100000}
                      value={[downPayment]}
                      onValueChange={(value) => setDownPayment(value[0])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* Interest Rate */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-sm text-muted-foreground">Interest Rate</label>
                      <span className="text-sm font-medium text-foreground">{interestRate}%</span>
                    </div>
                    <Slider
                      min={5}
                      max={30}
                      step={0.5}
                      value={[interestRate]}
                      onValueChange={(value) => setInterestRate(value[0])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>5%</span>
                      <span>30%</span>
                    </div>
                  </div>

                  {/* Loan Term */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-sm text-muted-foreground">Loan Term</label>
                      <span className="text-sm font-medium text-foreground">{loanTerm} Years</span>
                    </div>
                    <Slider
                      min={5}
                      max={30}
                      step={1}
                      value={[loanTerm]}
                      onValueChange={(value) => setLoanTerm(value[0])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>5 yrs</span>
                      <span>30 yrs</span>
                    </div>
                  </div>

                  {/* Results */}
                  <div className="pt-4 border-t border-border space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Loan Amount</span>
                      <span className="font-semibold text-foreground">PKR {formatPKRInput(homePrice - downPayment)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Est. Monthly Payment</span>
                      <span className="text-2xl font-bold text-primary">PKR {formatPKRInput(monthlyPayment)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Total Interest ({loanTerm} yrs)</span>
                      <span className="text-muted-foreground">PKR {formatPKRInput((monthlyPayment * loanTerm * 12) - (homePrice - downPayment))}</span>
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
            {dataLoading ? (
              // Loading skeletons
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="overflow-hidden p-0 gap-0">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-5 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </Card>
              ))
            ) : blogPosts.length > 0 ? (
              blogPosts.map((post) => {
                const postImage = post.featured_image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop";
                const postDate = post.published_at
                  ? new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                  : "Recent";
                const readTime = post.reading_time ? `${post.reading_time} min read` : "5 min read";
                const categoryLabel = post.category?.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()) || "Article";

                return (
                  <Link href={`/blogs/${post.slug || post.$id}`} key={post.$id}>
                    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 p-0 gap-0 cursor-pointer h-full">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={postImage}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <Badge className="absolute top-4 left-4 bg-white/90 text-foreground hover:bg-white">
                          {categoryLabel}
                        </Badge>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            {postDate}
                          </div>
                          <div className="flex items-center gap-1">
                            <ClockIcon className="h-4 w-4" />
                            {readTime}
                          </div>
                        </div>
                        <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2">{post.excerpt}</p>
                      </div>
                    </Card>
                  </Link>
                );
              })
            ) : (
              // Fallback to mock data
              mockBlogPosts.map((post, index) => (
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
              ))
            )}
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
