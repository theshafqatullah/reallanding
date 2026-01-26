"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { usersService } from "@/services/users";
import { type Users, UserType } from "@/types/appwrite";
import {
    StarIcon,
    PhoneIcon,
    MailIcon,
    MapPinIcon,
    AwardIcon,
    TrendingUpIcon,
    SearchIcon,
    UsersIcon,
    ArrowRightIcon,
    CheckCircleIcon,
    HomeIcon,
    BuildingIcon,
    SparklesIcon,
    BriefcaseIcon,
    HeartIcon,
    MessageSquareIcon,
    CalendarIcon,
    ClockIcon,
    LinkedinIcon,
    TwitterIcon,
    FacebookIcon,
    FilterIcon,
    ChevronDownIcon,
    BrainIcon,
    Zap,
    Target,
    SlidersHorizontal,
    X,
    ArrowUpDown,
    Grid3X3,
    List,
    RefreshCw,
    MapIcon,
    BadgeCheck,
    Globe,
} from "lucide-react";

const teamStats = [
    { label: "Expert Agents", value: "200+", icon: UsersIcon },
    { label: "Properties Sold", value: "50K+", icon: HomeIcon },
    { label: "Client Satisfaction", value: "98%", icon: HeartIcon },
    { label: "AI Match Rate", value: "95%", icon: BrainIcon },
];

const aiMatchingFeatures = [
    {
        icon: BrainIcon,
        title: "Smart Matching",
        description: "Our AI analyzes your preferences to match you with the perfect agent for your needs.",
    },
    {
        icon: Target,
        title: "Expertise Match",
        description: "Get paired with agents who specialize in your property type and location.",
    },
    {
        icon: Zap,
        title: "Instant Connect",
        description: "Connect immediately with your matched agent through our platform.",
    },
];

const specialties = [
    { name: "All Agents", value: "all" },
    { name: "Agents", value: UserType.AGENT },
    { name: "Agencies", value: UserType.AGENCY },
];

// Available specializations for filtering
const availableSpecializations = [
    "Residential Sales",
    "Commercial Sales",
    "Luxury Properties",
    "First-Time Buyers",
    "Investment Properties",
    "Rentals & Leasing",
    "Property Management",
    "New Construction",
    "Foreclosures",
    "Relocation",
];

// Sort options
const sortOptions = [
    { label: "Most Relevant", value: "relevant" },
    { label: "Highest Rated", value: "rating-desc" },
    { label: "Most Sales", value: "sales-desc" },
    { label: "Most Listings", value: "listings-desc" },
    { label: "Most Experience", value: "experience-desc" },
    { label: "Newest First", value: "newest" },
];

const whyChooseUs = [
    {
        icon: AwardIcon,
        title: "Top-Rated Professionals",
        description: "Our agents average 4.8+ stars from thousands of verified client reviews.",
    },
    {
        icon: TrendingUpIcon,
        title: "Proven Track Record",
        description: "Over $5 billion in successful transactions and 50,000+ properties sold.",
    },
    {
        icon: ClockIcon,
        title: "24/7 Availability",
        description: "Our team is available around the clock to assist with your real estate needs.",
    },
    {
        icon: CheckCircleIcon,
        title: "Local Market Experts",
        description: "Deep knowledge of local markets, neighborhoods, and property values.",
    },
];

const testimonials = [
    {
        quote: "Sarah helped us find our dream home in just 3 weeks. Her knowledge of the Manhattan market is unmatched!",
        author: "Jennifer & Mark Thompson",
        agent: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    },
    {
        quote: "Michael's expertise in commercial real estate saved us thousands. Highly recommend for any business property needs.",
        author: "Robert Chen",
        agent: "Michael Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
    {
        quote: "As first-time buyers, Emily made the process stress-free. She was patient and answered all our questions.",
        author: "The Garcia Family",
        agent: "Emily Rodriguez",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    },
];

// Helper function to get agent display name
function getAgentDisplayName(agent: Users): string {
    if (agent.first_name && agent.last_name) {
        return `${agent.first_name} ${agent.last_name}`;
    }
    if (agent.first_name) return agent.first_name;
    if (agent.company_name) return agent.company_name;
    return agent.username;
}

// Helper function to get agent role/designation
function getAgentRole(agent: Users): string {
    if (agent.designation) return agent.designation;
    if (agent.user_type === UserType.AGENCY) return "Real Estate Agency";
    return "Real Estate Agent";
}

// Helper function to get agent location
function getAgentLocation(agent: Users): string {
    const parts = [agent.city, agent.state, agent.country].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Location not specified";
}

// Helper function to get agent specializations array
function getAgentSpecializations(agent: Users): string[] {
    if (!agent.specializations) return [];
    return agent.specializations.split(",").map((s) => s.trim()).slice(0, 3);
}

// Default avatar for agents without profile images
const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop";

export default function AgentsPageClient() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilter, setSelectedFilter] = useState<string>("all");
    const [agents, setAgents] = useState<Users[]>([]);
    const [featuredAgents, setFeaturedAgents] = useState<Users[]>([]);
    const [totalAgents, setTotalAgents] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [offset, setOffset] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const LIMIT = 8;

    // Advanced filter states
    const [sortBy, setSortBy] = useState("relevant");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [minRating, setMinRating] = useState(0);
    const [minExperience, setMinExperience] = useState(0);
    const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
    const [availableOnly, setAvailableOnly] = useState(false);
    const [verifiedOnly, setVerifiedOnly] = useState(false);
    const [locationFilter, setLocationFilter] = useState("");
    const [filtersOpen, setFiltersOpen] = useState(false);

    // Count active filters
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (minRating > 0) count++;
        if (minExperience > 0) count++;
        if (selectedSpecializations.length > 0) count++;
        if (availableOnly) count++;
        if (verifiedOnly) count++;
        if (locationFilter) count++;
        return count;
    }, [minRating, minExperience, selectedSpecializations, availableOnly, verifiedOnly, locationFilter]);

    // Reset filters
    const resetFilters = useCallback(() => {
        setMinRating(0);
        setMinExperience(0);
        setSelectedSpecializations([]);
        setAvailableOnly(false);
        setVerifiedOnly(false);
        setLocationFilter("");
        setSortBy("relevant");
    }, []);

    // Filter and sort agents
    const filteredAgents = useMemo(() => {
        let result = [...agents];

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter((agent) => {
                const name = getAgentDisplayName(agent).toLowerCase();
                const specializations = (agent.specializations || "").toLowerCase();
                const city = (agent.city || "").toLowerCase();
                const bio = (agent.bio || "").toLowerCase();
                return (
                    name.includes(query) ||
                    specializations.includes(query) ||
                    city.includes(query) ||
                    bio.includes(query)
                );
            });
        }

        // Apply rating filter
        if (minRating > 0) {
            result = result.filter((agent) => (agent.rating || 0) >= minRating);
        }

        // Apply experience filter
        if (minExperience > 0) {
            result = result.filter((agent) => (agent.experience_years || 0) >= minExperience);
        }

        // Apply specialization filter
        if (selectedSpecializations.length > 0) {
            result = result.filter((agent) => {
                const agentSpecs = (agent.specializations || "").toLowerCase();
                return selectedSpecializations.some((spec) => agentSpecs.includes(spec.toLowerCase()));
            });
        }

        // Apply availability filter
        if (availableOnly) {
            result = result.filter((agent) => agent.availability_status === "available");
        }

        // Apply verified filter
        if (verifiedOnly) {
            result = result.filter((agent) => agent.is_verified);
        }

        // Apply location filter
        if (locationFilter) {
            const loc = locationFilter.toLowerCase();
            result = result.filter((agent) => {
                const location = getAgentLocation(agent).toLowerCase();
                return location.includes(loc);
            });
        }

        // Apply sorting
        switch (sortBy) {
            case "rating-desc":
                result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case "sales-desc":
                result.sort((a, b) => (b.total_sales || 0) - (a.total_sales || 0));
                break;
            case "listings-desc":
                result.sort((a, b) => (b.active_listings || 0) - (a.active_listings || 0));
                break;
            case "experience-desc":
                result.sort((a, b) => (b.experience_years || 0) - (a.experience_years || 0));
                break;
            case "newest":
                result.sort((a, b) => new Date(b.$createdAt || 0).getTime() - new Date(a.$createdAt || 0).getTime());
                break;
            default:
                // Keep original order for "relevant"
                break;
        }

        return result;
    }, [agents, searchQuery, minRating, minExperience, selectedSpecializations, availableOnly, verifiedOnly, locationFilter, sortBy]);

    // Fetch agents on mount and when filters change
    useEffect(() => {
        const fetchAgents = async () => {
            setLoading(true);
            try {
                const userType = selectedFilter === "all"
                    ? undefined
                    : selectedFilter as UserType.AGENT | UserType.AGENCY;

                const [agentsResult, featured] = await Promise.all([
                    usersService.getAgents({
                        limit: LIMIT,
                        offset: 0,
                        userType
                    }),
                    usersService.getFeaturedAgents(4),
                ]);

                setAgents(agentsResult.agents);
                setTotalAgents(agentsResult.total);
                setFeaturedAgents(featured);
                setOffset(LIMIT);
            } catch (error) {
                console.error("Failed to fetch agents:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAgents();
    }, [selectedFilter]);

    // Load more agents
    const handleLoadMore = async () => {
        setLoadingMore(true);
        try {
            const userType = selectedFilter === "all"
                ? undefined
                : selectedFilter as UserType.AGENT | UserType.AGENCY;

            const result = await usersService.getAgents({
                limit: LIMIT,
                offset,
                userType,
            });

            setAgents((prev) => [...prev, ...result.agents]);
            setOffset((prev) => prev + LIMIT);
        } catch (error) {
            console.error("Failed to load more agents:", error);
        } finally {
            setLoadingMore(false);
        }
    };

    // Refresh agents
    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            const userType = selectedFilter === "all"
                ? undefined
                : selectedFilter as UserType.AGENT | UserType.AGENCY;

            const [agentsResult, featured] = await Promise.all([
                usersService.getAgents({
                    limit: LIMIT,
                    offset: 0,
                    userType
                }),
                usersService.getFeaturedAgents(4),
            ]);

            setAgents(agentsResult.agents);
            setTotalAgents(agentsResult.total);
            setFeaturedAgents(featured);
            setOffset(LIMIT);
        } catch (error) {
            console.error("Failed to refresh agents:", error);
        } finally {
            setRefreshing(false);
        }
    };

    // Navigate to agent profile
    const handleAgentClick = (agent: Users) => {
        router.push(`/u/${agent.username}`);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary/90 via-primary to-primary/80 text-primary-foreground">
                <div className="absolute inset-0 opacity-10">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                    />
                </div>

                <div className="container mx-auto max-w-7xl px-4 py-20 md:py-28 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <Badge
                            variant="secondary"
                            className="mb-6 bg-white/20 text-primary-foreground border-white/30 hover:bg-white/30"
                        >
                            <UsersIcon className="h-4 w-4 mr-2" />
                            200+ Expert Agents
                        </Badge>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            Meet Our <span className="text-secondary">Expert</span> Real Estate Agents
                        </h1>
                        <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                            Our team of experienced professionals is dedicated to helping you find
                            the perfect property. Connect with an agent who understands your needs.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Search agents by name or specialty..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-6 rounded-full bg-white text-foreground border-0 shadow-none"
                                    />
                                </div>
                                <Button size="lg" variant="secondary" className="rounded-full px-8">
                                    Find Agent
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 -mt-24 relative z-20">
                        {teamStats.map((stat) => (
                            <Card
                                key={stat.label}
                                className="p-6 text-center bg-white border border-border shadow-none"
                            >
                                <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <stat.icon className="h-7 w-7 text-primary" />
                                </div>
                                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-muted-foreground text-sm">{stat.label}</div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI Smart Matching Section */}
            <section className="py-16 bg-gradient-to-br from-primary/5 via-white to-secondary relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
                    <div className="absolute bottom-20 right-10 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: "1s" }} />
                </div>

                <div className="container mx-auto max-w-7xl px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-primary/10 to-secondary text-primary border-primary/20">
                                <SparklesIcon className="h-3.5 w-3.5 mr-1" />
                                AI-Powered Matching
                            </Badge>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Find Your Perfect Agent with AI
                            </h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                Our intelligent matching system analyzes your requirements and connects you with agents who have the perfect expertise, track record, and availability for your needs.
                            </p>

                            <div className="space-y-4 mb-8">
                                {aiMatchingFeatures.map((feature) => (
                                    <div key={feature.title} className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <feature.icon className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground">{feature.title}</h3>
                                            <p className="text-muted-foreground text-sm">{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button size="lg" className="rounded-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700">
                                <BrainIcon className="mr-2 h-5 w-5" />
                                Start AI Matching
                            </Button>
                        </div>

                        {/* AI Match Preview Card */}
                        <Card className="p-6 border border-violet-100 shadow-xl bg-white/80 backdrop-blur-sm">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <BrainIcon className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground">AI Agent Matching</h3>
                                <p className="text-sm text-muted-foreground">Tell us what you need</p>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-secondary/50 rounded-xl p-3">
                                    <div className="text-xs text-muted-foreground mb-1">Property Type</div>
                                    <div className="font-medium text-foreground">Residential Home</div>
                                </div>
                                <div className="bg-secondary/50 rounded-xl p-3">
                                    <div className="text-xs text-muted-foreground mb-1">Location</div>
                                    <div className="font-medium text-foreground">Manhattan, NYC</div>
                                </div>
                                <div className="bg-secondary/50 rounded-xl p-3">
                                    <div className="text-xs text-muted-foreground mb-1">Budget Range</div>
                                    <div className="font-medium text-foreground">$500K - $1M</div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-border">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm text-muted-foreground">Top Matches</span>
                                    <Badge variant="secondary" className="bg-gradient-to-r from-violet-100 to-blue-100 text-violet-700">
                                        98% Match
                                    </Badge>
                                </div>
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                                            {i}
                                        </div>
                                    ))}
                                    <div className="w-10 h-10 rounded-full border-2 border-white bg-secondary flex items-center justify-center text-xs font-medium text-foreground">
                                        +12
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Featured Agents */}
            <section className="py-20 bg-white">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="text-center mb-12">
                        <Badge variant="secondary" className="mb-4">
                            <SparklesIcon className="h-4 w-4 mr-2" />
                            Top Performers
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Featured Agents
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Our highest-rated agents with exceptional track records
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {loading ? (
                            // Loading skeletons
                            Array.from({ length: 4 }).map((_, i) => (
                                <Card key={i} className="p-0 overflow-hidden border border-border shadow-none">
                                    <Skeleton className="h-48 w-full" />
                                    <div className="p-5 space-y-3">
                                        <Skeleton className="h-5 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                        <Skeleton className="h-8 w-full" />
                                    </div>
                                </Card>
                            ))
                        ) : featuredAgents.length > 0 ? (
                            featuredAgents.map((agent) => (
                                <Card
                                    key={agent.$id}
                                    className="p-0 overflow-hidden border border-border shadow-none group hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                                    onClick={() => handleAgentClick(agent)}
                                >
                                    <div className="relative">
                                        <div className="h-48 relative">
                                            <Image
                                                src={agent.profile_image_url || DEFAULT_AVATAR}
                                                alt={getAgentDisplayName(agent)}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        {agent.rating > 0 && (
                                            <Badge className="absolute top-3 right-3 bg-primary">
                                                <StarIcon className="h-3 w-3 mr-1 fill-white" />
                                                {agent.rating.toFixed(1)}
                                            </Badge>
                                        )}
                                        <Badge
                                            className={`absolute top-3 left-3 ${agent.availability_status === "available" ? "bg-green-500" : "bg-orange-500"
                                                }`}
                                        >
                                            {agent.availability_status === "available" ? "Available" : "Busy"}
                                        </Badge>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                                            {getAgentDisplayName(agent)}
                                        </h3>
                                        <p className="text-primary text-sm font-medium mb-3">{getAgentRole(agent)}</p>

                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {getAgentSpecializations(agent).map((specialty) => (
                                                <Badge key={specialty} variant="secondary" className="text-xs">
                                                    {specialty}
                                                </Badge>
                                            ))}
                                            {agent.user_type === UserType.AGENCY && (
                                                <Badge variant="outline" className="text-xs">
                                                    <BuildingIcon className="h-3 w-3 mr-1" />
                                                    Agency
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 text-center mb-4">
                                            <div className="bg-secondary rounded-lg p-2">
                                                <div className="font-semibold text-foreground">{agent.total_sales}</div>
                                                <div className="text-xs text-muted-foreground">Sales</div>
                                            </div>
                                            <div className="bg-secondary rounded-lg p-2">
                                                <div className="font-semibold text-foreground">{agent.active_listings}</div>
                                                <div className="text-xs text-muted-foreground">Listings</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                            <MapPinIcon className="h-4 w-4" />
                                            <span className="truncate">{getAgentLocation(agent)}</span>
                                        </div>

                                        <Button size="sm" variant="outline" className="w-full rounded-full">
                                            View Profile
                                            <ArrowRightIcon className="h-4 w-4 ml-1" />
                                        </Button>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-8 text-muted-foreground">
                                No featured agents available at the moment.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Filter & All Agents */}
            <section className="py-20 bg-white">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="text-center mb-12">
                        <Badge variant="secondary" className="mb-4">
                            <UsersIcon className="h-4 w-4 mr-2" />
                            Our Team
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            All Agents
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Find the perfect agent for your specific needs
                        </p>
                    </div>

                    {/* Advanced Filters Bar */}
                    <div className="bg-secondary/30 rounded-2xl p-4 mb-8">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search by name, specialty, or location..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 rounded-full"
                                />
                            </div>

                            {/* Quick Filters */}
                            <div className="flex flex-wrap items-center gap-2">
                                {/* Type Filter */}
                                <div className="flex items-center gap-1 bg-background rounded-full px-1 py-1">
                                    {specialties.map((specialty) => (
                                        <Button
                                            key={specialty.name}
                                            variant={selectedFilter === specialty.value ? "default" : "ghost"}
                                            size="sm"
                                            className="rounded-full h-8 px-3"
                                            onClick={() => setSelectedFilter(specialty.value)}
                                        >
                                            {specialty.name}
                                        </Button>
                                    ))}
                                </div>

                                {/* Sort */}
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-[150px] rounded-full h-10">
                                        <ArrowUpDown className="h-3.5 w-3.5 mr-2" />
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sortOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Advanced Filters Sheet */}
                                <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" size="sm" className="rounded-full h-10 gap-2">
                                            <SlidersHorizontal className="h-4 w-4" />
                                            Filters
                                            {activeFilterCount > 0 && (
                                                <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                                                    {activeFilterCount}
                                                </Badge>
                                            )}
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent className="w-full sm:max-w-md">
                                        <SheetHeader>
                                            <SheetTitle>Filter Agents</SheetTitle>
                                            <SheetDescription>
                                                Refine your search with advanced filters
                                            </SheetDescription>
                                        </SheetHeader>

                                        <div className="py-6 space-y-6">
                                            {/* Location Filter */}
                                            <div className="space-y-2">
                                                <Label className="flex items-center gap-2">
                                                    <MapIcon className="h-4 w-4" />
                                                    Location
                                                </Label>
                                                <Input
                                                    placeholder="City, State, or Country"
                                                    value={locationFilter}
                                                    onChange={(e) => setLocationFilter(e.target.value)}
                                                />
                                            </div>

                                            {/* Rating Filter */}
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <Label className="flex items-center gap-2">
                                                        <StarIcon className="h-4 w-4" />
                                                        Minimum Rating
                                                    </Label>
                                                    <span className="text-sm font-medium">{minRating}+ stars</span>
                                                </div>
                                                <Slider
                                                    value={[minRating]}
                                                    onValueChange={([value]) => setMinRating(value)}
                                                    max={5}
                                                    step={0.5}
                                                    className="w-full"
                                                />
                                                <div className="flex justify-between text-xs text-muted-foreground">
                                                    <span>Any</span>
                                                    <span>5 stars</span>
                                                </div>
                                            </div>

                                            {/* Experience Filter */}
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <Label className="flex items-center gap-2">
                                                        <BriefcaseIcon className="h-4 w-4" />
                                                        Minimum Experience
                                                    </Label>
                                                    <span className="text-sm font-medium">{minExperience}+ years</span>
                                                </div>
                                                <Slider
                                                    value={[minExperience]}
                                                    onValueChange={([value]) => setMinExperience(value)}
                                                    max={30}
                                                    step={1}
                                                    className="w-full"
                                                />
                                                <div className="flex justify-between text-xs text-muted-foreground">
                                                    <span>Any</span>
                                                    <span>30+ years</span>
                                                </div>
                                            </div>

                                            {/* Specializations */}
                                            <div className="space-y-3">
                                                <Label className="flex items-center gap-2">
                                                    <Target className="h-4 w-4" />
                                                    Specializations
                                                </Label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {availableSpecializations.map((spec) => (
                                                        <div key={spec} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={spec}
                                                                checked={selectedSpecializations.includes(spec)}
                                                                onCheckedChange={(checked) => {
                                                                    if (checked) {
                                                                        setSelectedSpecializations((prev) => [...prev, spec]);
                                                                    } else {
                                                                        setSelectedSpecializations((prev) =>
                                                                            prev.filter((s) => s !== spec)
                                                                        );
                                                                    }
                                                                }}
                                                            />
                                                            <label
                                                                htmlFor={spec}
                                                                className="text-sm cursor-pointer"
                                                            >
                                                                {spec}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Toggle Filters */}
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                                        <Label htmlFor="available">Available Now</Label>
                                                    </div>
                                                    <Checkbox
                                                        id="available"
                                                        checked={availableOnly}
                                                        onCheckedChange={(checked) => setAvailableOnly(!!checked)}
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <BadgeCheck className="h-4 w-4 text-primary" />
                                                        <Label htmlFor="verified">Verified Only</Label>
                                                    </div>
                                                    <Checkbox
                                                        id="verified"
                                                        checked={verifiedOnly}
                                                        onCheckedChange={(checked) => setVerifiedOnly(!!checked)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <SheetFooter className="gap-2">
                                            <Button variant="outline" onClick={resetFilters} className="flex-1">
                                                Reset All
                                            </Button>
                                            <SheetClose asChild>
                                                <Button className="flex-1">Apply Filters</Button>
                                            </SheetClose>
                                        </SheetFooter>
                                    </SheetContent>
                                </Sheet>

                                {/* View Mode Toggle */}
                                <div className="hidden md:flex items-center gap-1 bg-background rounded-full p-1">
                                    <Button
                                        variant={viewMode === "grid" ? "default" : "ghost"}
                                        size="sm"
                                        className="h-8 w-8 p-0 rounded-full"
                                        onClick={() => setViewMode("grid")}
                                    >
                                        <Grid3X3 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === "list" ? "default" : "ghost"}
                                        size="sm"
                                        className="h-8 w-8 p-0 rounded-full"
                                        onClick={() => setViewMode("list")}
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Refresh */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-10 w-10 p-0 rounded-full"
                                    onClick={handleRefresh}
                                    disabled={refreshing}
                                >
                                    <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                                </Button>
                            </div>
                        </div>

                        {/* Active Filters Display */}
                        {activeFilterCount > 0 && (
                            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border/50">
                                <span className="text-sm text-muted-foreground">Active filters:</span>
                                {minRating > 0 && (
                                    <Badge variant="secondary" className="gap-1">
                                        {minRating}+ stars
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => setMinRating(0)}
                                        />
                                    </Badge>
                                )}
                                {minExperience > 0 && (
                                    <Badge variant="secondary" className="gap-1">
                                        {minExperience}+ years exp.
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => setMinExperience(0)}
                                        />
                                    </Badge>
                                )}
                                {locationFilter && (
                                    <Badge variant="secondary" className="gap-1">
                                        <MapPinIcon className="h-3 w-3" />
                                        {locationFilter}
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => setLocationFilter("")}
                                        />
                                    </Badge>
                                )}
                                {selectedSpecializations.map((spec) => (
                                    <Badge key={spec} variant="secondary" className="gap-1">
                                        {spec}
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() =>
                                                setSelectedSpecializations((prev) =>
                                                    prev.filter((s) => s !== spec)
                                                )
                                            }
                                        />
                                    </Badge>
                                ))}
                                {availableOnly && (
                                    <Badge variant="secondary" className="gap-1">
                                        Available Now
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => setAvailableOnly(false)}
                                        />
                                    </Badge>
                                )}
                                {verifiedOnly && (
                                    <Badge variant="secondary" className="gap-1">
                                        Verified
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => setVerifiedOnly(false)}
                                        />
                                    </Badge>
                                )}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 text-xs"
                                    onClick={resetFilters}
                                >
                                    Clear all
                                </Button>
                            </div>
                        )}

                        {/* Results Count */}
                        <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Showing <span className="font-medium text-foreground">{filteredAgents.length}</span> of{" "}
                                <span className="font-medium text-foreground">{totalAgents}</span> agents
                            </p>
                            {searchQuery && (
                                <p className="text-sm text-muted-foreground">
                                    Results for &quot;<span className="font-medium text-foreground">{searchQuery}</span>&quot;
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Agents Grid */}
                    <div className={viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        : "space-y-4"
                    }>
                        {loading ? (
                            // Loading skeletons
                            Array.from({ length: 8 }).map((_, i) => (
                                <Card key={i} className="p-5 border border-border shadow-none">
                                    <div className="flex items-start gap-4 mb-4">
                                        <Skeleton className="w-16 h-16 rounded-full" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-3 w-1/2" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-12 w-full mb-4" />
                                    <Skeleton className="h-8 w-full" />
                                </Card>
                            ))
                        ) : filteredAgents.length > 0 ? (
                            filteredAgents.map((agent) => (
                                viewMode === "grid" ? (
                                    // Grid View Card
                                    <Card
                                        key={agent.$id}
                                        className="p-5 border border-border shadow-none hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                                        onClick={() => handleAgentClick(agent)}
                                    >
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="relative">
                                                <Image
                                                    src={agent.profile_image_url || DEFAULT_AVATAR}
                                                    alt={getAgentDisplayName(agent)}
                                                    width={64}
                                                    height={64}
                                                    className="rounded-full object-cover"
                                                />
                                                <div
                                                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${agent.availability_status === "available" ? "bg-green-500" : "bg-orange-500"
                                                        }`}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1">
                                                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                                        {getAgentDisplayName(agent)}
                                                    </h3>
                                                    {agent.is_verified && (
                                                        <BadgeCheck className="h-4 w-4 text-primary shrink-0" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-primary truncate">{getAgentRole(agent)}</p>
                                                {agent.rating > 0 && (
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <StarIcon className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                        <span className="text-xs font-medium text-foreground">{agent.rating.toFixed(1)}</span>
                                                        <span className="text-xs text-muted-foreground">({agent.total_reviews})</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {agent.bio && (
                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{agent.bio}</p>
                                        )}

                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {getAgentSpecializations(agent).map((specialty) => (
                                                <Badge key={specialty} variant="secondary" className="text-xs">
                                                    {specialty}
                                                </Badge>
                                            ))}
                                            {agent.user_type === UserType.AGENCY && (
                                                <Badge variant="outline" className="text-xs">
                                                    <BuildingIcon className="h-3 w-3 mr-1" />
                                                    Agency
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                                            <MapPinIcon className="h-3 w-3" />
                                            <span className="truncate">{getAgentLocation(agent)}</span>
                                            {agent.experience_years > 0 && (
                                                <>
                                                    <span>•</span>
                                                    <span>{agent.experience_years}+ years</span>
                                                </>
                                            )}
                                        </div>

                                        <Button variant="outline" size="sm" className="w-full rounded-full">
                                            View Profile
                                            <ArrowRightIcon className="h-4 w-4 ml-1" />
                                        </Button>
                                    </Card>
                                ) : (
                                    // List View Card
                                    <Card
                                        key={agent.$id}
                                        className="p-4 border border-border shadow-none hover:bg-secondary/30 transition-all duration-300 cursor-pointer"
                                        onClick={() => handleAgentClick(agent)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="relative shrink-0">
                                                <Image
                                                    src={agent.profile_image_url || DEFAULT_AVATAR}
                                                    alt={getAgentDisplayName(agent)}
                                                    width={80}
                                                    height={80}
                                                    className="rounded-xl object-cover"
                                                />
                                                <div
                                                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${agent.availability_status === "available" ? "bg-green-500" : "bg-orange-500"
                                                        }`}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
                                                        {getAgentDisplayName(agent)}
                                                    </h3>
                                                    {agent.is_verified && (
                                                        <BadgeCheck className="h-4 w-4 text-primary" />
                                                    )}
                                                    {agent.rating > 0 && (
                                                        <div className="flex items-center gap-1">
                                                            <StarIcon className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                            <span className="text-xs font-medium">{agent.rating.toFixed(1)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-sm text-primary">{getAgentRole(agent)}</p>
                                                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <MapPinIcon className="h-3 w-3" />
                                                        {getAgentLocation(agent)}
                                                    </span>
                                                    {agent.experience_years > 0 && (
                                                        <span className="flex items-center gap-1">
                                                            <BriefcaseIcon className="h-3 w-3" />
                                                            {agent.experience_years}+ years
                                                        </span>
                                                    )}
                                                    <span className="flex items-center gap-1">
                                                        <HomeIcon className="h-3 w-3" />
                                                        {agent.total_sales} sales
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <BuildingIcon className="h-3 w-3" />
                                                        {agent.active_listings} listings
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-1 max-w-[200px] shrink-0">
                                                {getAgentSpecializations(agent).map((specialty) => (
                                                    <Badge key={specialty} variant="secondary" className="text-xs">
                                                        {specialty}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <Button variant="outline" size="sm" className="rounded-full shrink-0">
                                                View Profile
                                                <ArrowRightIcon className="h-4 w-4 ml-1" />
                                            </Button>
                                        </div>
                                    </Card>
                                )
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                                    <SearchIcon className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-medium text-foreground mb-2">No agents found</h3>
                                <p className="text-muted-foreground mb-4">
                                    Try adjusting your filters or search criteria
                                </p>
                                <Button variant="outline" onClick={resetFilters}>
                                    Reset Filters
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Load More Button */}
                    {!loading && filteredAgents.length < totalAgents && filteredAgents.length === agents.length && (
                        <div className="text-center mt-10">
                            <Button
                                variant="outline"
                                size="lg"
                                className="rounded-full px-8"
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                            >
                                {loadingMore ? "Loading..." : "Load More Agents"}
                                <ChevronDownIcon className="h-4 w-4 ml-2" />
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* Why Choose Our Agents */}
            <section className="py-20 bg-white">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="text-center mb-12">
                        <Badge variant="secondary" className="mb-4">
                            <CheckCircleIcon className="h-4 w-4 mr-2" />
                            Why Us
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Why Choose Our Agents
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            What sets our team apart from the rest
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {whyChooseUs.map((item) => (
                            <Card
                                key={item.title}
                                className="p-6 text-center border border-border shadow-none hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <item.icon className="h-7 w-7 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                                <p className="text-muted-foreground text-sm">{item.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Agent Testimonials */}
            <section className="py-20 bg-white">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="text-center mb-12">
                        <Badge variant="secondary" className="mb-4">
                            <StarIcon className="h-4 w-4 mr-2" />
                            Client Stories
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            What Clients Say About Our Agents
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Real experiences from satisfied clients
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial) => (
                            <Card
                                key={testimonial.author}
                                className="p-6 border border-border shadow-none"
                            >
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <StarIcon key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <blockquote className="text-foreground mb-6">
                                    &ldquo;{testimonial.quote}&rdquo;
                                </blockquote>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={testimonial.avatar}
                                            alt={testimonial.author}
                                            width={48}
                                            height={48}
                                            className="rounded-full"
                                        />
                                        <div>
                                            <div className="font-semibold text-foreground">{testimonial.author}</div>
                                            <div className="text-sm text-muted-foreground">
                                                Worked with {testimonial.agent}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-white">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="text-center mb-12">
                        <Badge variant="secondary" className="mb-4">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            Easy Process
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Connect With an Agent in 3 Steps
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Getting started is quick and easy
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: "01",
                                title: "Browse Agents",
                                description: "Search our directory to find agents that match your specific needs and location.",
                                icon: SearchIcon,
                            },
                            {
                                step: "02",
                                title: "Schedule a Call",
                                description: "Book a free consultation to discuss your real estate goals and requirements.",
                                icon: PhoneIcon,
                            },
                            {
                                step: "03",
                                title: "Start Your Journey",
                                description: "Work with your chosen agent to buy, sell, or invest in property.",
                                icon: HomeIcon,
                            },
                        ].map((item) => (
                            <div key={item.step} className="text-center">
                                <div className="w-20 h-20 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <item.icon className="h-10 w-10" />
                                </div>
                                <div className="text-sm font-bold text-primary mb-2">STEP {item.step}</div>
                                <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                                <p className="text-muted-foreground">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Join Our Team */}
            <section className="py-20 bg-white">
                <div className="container mx-auto max-w-7xl px-4">
                    <Card className="p-8 md:p-12 border border-border shadow-none bg-primary text-primary-foreground">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <div>
                                <Badge variant="secondary" className="mb-4">
                                    <BriefcaseIcon className="h-4 w-4 mr-2" />
                                    Careers
                                </Badge>
                                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                    Join Our Growing Team
                                </h2>
                                <p className="text-lg text-primary-foreground/80 mb-6">
                                    Are you a motivated real estate professional looking to take your career to
                                    the next level? We offer competitive commissions, comprehensive training,
                                    and a supportive team environment.
                                </p>
                                <ul className="space-y-3 mb-6">
                                    {[
                                        "Industry-leading commission structure",
                                        "Comprehensive training & mentorship",
                                        "Advanced marketing & technology tools",
                                        "Collaborative team culture",
                                    ].map((benefit) => (
                                        <li key={benefit} className="flex items-center gap-2">
                                            <CheckCircleIcon className="h-5 w-5 text-secondary" />
                                            <span>{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end">
                                <Button size="lg" variant="secondary" className="rounded-full px-8" asChild>
                                    <Link href="/contact">
                                        Apply Now
                                        <ArrowRightIcon className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="rounded-full px-8 border-white/30 text-primary-foreground hover:bg-white/10"
                                >
                                    Learn More
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 p-12 rounded-3xl bg-secondary">
                        <div className="text-center lg:text-left">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Ready to Find Your Perfect Agent?
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-xl">
                                Let us match you with an expert who understands your unique needs and goals.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button size="lg" className="rounded-full px-8" asChild>
                                <Link href="/contact">
                                    Get Matched Now
                                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
                                <Link href="/properties">Browse Properties</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
