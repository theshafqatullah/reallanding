"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
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
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from "@/components/ui/sheet";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    MapPinIcon,
    BedDoubleIcon,
    BathIcon,
    RulerIcon,
    HeartIcon,
    ListIcon,
    SlidersHorizontalIcon,
    XIcon,
    HomeIcon,
    PhoneIcon,
    MailIcon,
    ChevronDownIcon,
    CheckIcon,
    MapIcon,
    BellIcon,
    ArrowRightIcon,
    BuildingIcon,
    CalendarIcon,
    BadgeCheckIcon,
    MessageCircleIcon,
    GridIcon,
} from "lucide-react";
import { propertiesService, type PropertyFilters } from "@/services/properties";
import {
    lookupsService,
    type PropertyType,
    type ListingType,
    type City,
} from "@/services/lookups";
import { savedPropertiesService } from "@/services/saved-properties";
import { usersService } from "@/services/users";
import { useAuth } from "@/store/auth";
import { type Properties, type UserSavedProperties, type Users } from "@/types/appwrite";
import { toast } from "sonner";
import { PropertyInquiryDialog } from "@/components/shared/property-inquiry-dialog";

const ITEMS_PER_PAGE = 15;

// Format price with currency
function formatPrice(price: number, currency: string = "PKR"): string {
    if (currency === "PKR") {
        if (price >= 10000000) {
            return `${(price / 10000000).toFixed(2)} Crore`;
        } else if (price >= 100000) {
            return `${(price / 100000).toFixed(2)} Lac`;
        }
        return price.toLocaleString();
    }
    if (currency === "AED" || currency === "USD") {
        return new Intl.NumberFormat("en-US", {
            maximumFractionDigits: 0,
        }).format(price);
    }
    return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 0,
    }).format(price);
}

// Format area with unit
function formatArea(area: number | null, unit: string = "sqft"): string {
    if (!area) return "N/A";
    return `${area.toLocaleString()} ${unit}`;
}

// Property List Card Component (Bayut Style)
function PropertyListCard({
    property,
    isSaved,
    onSaveToggle,
}: {
    property: Properties;
    isSaved: boolean;
    onSaveToggle: (propertyId: string) => void;
}) {
    const imageUrl = property.main_image_url || property.cover_image_url || "/placeholder-property.jpg";
    const listingType = property.listing_type?.name || "For Sale";
    const propertyType = property.property_type?.name || "Property";
    const cityName = property.city?.name || property.location?.city?.name || "";
    const locationName = property.location?.name || "";
    const fullLocation = [locationName, cityName].filter(Boolean).join(", ");
    const currency = property.currency || "PKR";
    const agentName = property.contact_person_name || "Agent";
    const agentInitial = agentName.charAt(0).toUpperCase();

    return (
        <Card className="p-0 overflow-hidden hover:shadow-lg transition-all border-border bg-card">
            <div className="flex flex-col lg:flex-row">
                {/* Image Section */}
                <div className="relative w-full lg:w-[380px] h-64 lg:h-[280px] flex-shrink-0">
                    <Link href={`/p/${property.slug || property.$id}`}>
                        <Image
                            src={imageUrl}
                            alt={property.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 380px"
                        />
                    </Link>

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        {property.is_verified && (
                            <Badge className="bg-primary text-primary-foreground text-xs px-2 py-0.5 gap-1">
                                <CheckIcon className="w-3 h-3" />
                                Verified
                            </Badge>
                        )}
                        {property.construction_status === "off-plan" && (
                            <Badge className="bg-foreground text-background text-xs px-2 py-0.5">
                                Off-Plan
                            </Badge>
                        )}
                        {property.is_new_listing && (
                            <Badge className="bg-orange-500 text-white text-xs px-2 py-0.5">
                                New
                            </Badge>
                        )}
                        {property.is_featured && (
                            <Badge className="bg-amber-500 text-white text-xs px-2 py-0.5">
                                Featured
                            </Badge>
                        )}
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onSaveToggle(property.$id);
                        }}
                        className="absolute top-3 right-3 p-2 bg-card/95 backdrop-blur-sm rounded-full shadow-md hover:bg-card transition-colors"
                    >
                        <HeartIcon
                            className={`w-5 h-5 ${isSaved ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
                        />
                    </button>

                    {/* Listing Type Badge */}
                    <div className="absolute bottom-3 left-3">
                        <Badge className="bg-primary/90 text-primary-foreground text-xs px-2.5 py-1">
                            {listingType}
                        </Badge>
                    </div>

                    {/* Image Count */}
                    {property.total_images && property.total_images > 1 && (
                        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                            <GridIcon className="w-3 h-3" />
                            {property.total_images}
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="flex-1 p-5">
                    <div className="flex flex-col h-full">
                        {/* Price Row */}
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <p className="text-2xl font-bold text-foreground">
                                    <span className="text-sm font-normal text-muted-foreground mr-1">{currency}</span>
                                    {formatPrice(property.price, currency)}
                                </p>
                                {property.price_negotiable && (
                                    <span className="text-xs text-green-600 font-medium">Negotiable</span>
                                )}
                            </div>
                        </div>

                        {/* Property Type & Features Row */}
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                            <span className="font-medium text-foreground">{propertyType}</span>
                            <span className="text-border">|</span>
                            {property.bedrooms !== null && property.bedrooms > 0 && (
                                <div className="flex items-center gap-1">
                                    <BedDoubleIcon className="w-4 h-4" />
                                    <span>{property.bedrooms} Beds</span>
                                </div>
                            )}
                            {property.bathrooms !== null && property.bathrooms > 0 && (
                                <div className="flex items-center gap-1">
                                    <BathIcon className="w-4 h-4" />
                                    <span>{property.bathrooms} Baths</span>
                                </div>
                            )}
                            {property.total_area && (
                                <>
                                    <span className="text-border">|</span>
                                    <div className="flex items-center gap-1">
                                        <RulerIcon className="w-4 h-4" />
                                        <span>{formatArea(property.total_area, property.area_unit)}</span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Title */}
                        <Link href={`/p/${property.slug || property.$id}`}>
                            <h3 className="text-base font-medium text-primary hover:text-primary/80 transition-colors line-clamp-2 mb-2">
                                {property.title}
                            </h3>
                        </Link>

                        {/* Location */}
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                            <MapPinIcon className="w-4 h-4 flex-shrink-0" />
                            <span className="line-clamp-1">{fullLocation || "Location not specified"}</span>
                        </p>

                        {/* Additional Details */}
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-4">
                            {property.furnished_status && property.furnished_status !== "unfurnished" && (
                                <Badge variant="secondary" className="text-xs capitalize">
                                    {property.furnished_status.replace(/_/g, " ")}
                                </Badge>
                            )}
                            {property.is_corner && (
                                <Badge variant="secondary" className="text-xs">Corner Plot</Badge>
                            )}
                            {property.bank_loan_available && (
                                <Badge variant="secondary" className="text-xs">Bank Loan</Badge>
                            )}
                            {property.installment_available && (
                                <Badge variant="outline" className="text-xs border-green-500 text-green-600">
                                    Installment Plan
                                </Badge>
                            )}
                        </div>

                        {/* Agent & Quick Actions Row */}
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                            {/* Agent Info */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                                    {agentInitial}
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-sm font-medium text-foreground line-clamp-1">{agentName}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {property.agent_id ? "Agent" : "Owner"}
                                    </p>
                                </div>
                            </div>

                            {/* Quick Contact Buttons */}
                            <div className="flex items-center gap-2">
                                {property.contact_email && (
                                    <Button variant="outline" size="sm" className="gap-1.5" asChild>
                                        <a href={`mailto:${property.contact_email}`}>
                                            <MailIcon className="w-4 h-4" />
                                            <span className="hidden sm:inline">Email</span>
                                        </a>
                                    </Button>
                                )}
                                {property.contact_phone && (
                                    <Button variant="outline" size="sm" className="gap-1.5" asChild>
                                        <a href={`tel:${property.contact_phone}`}>
                                            <PhoneIcon className="w-4 h-4" />
                                            <span className="hidden sm:inline">Call</span>
                                        </a>
                                    </Button>
                                )}
                                {property.whatsapp_number && (
                                    <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white gap-1.5" asChild>
                                        <a
                                            href={`https://wa.me/${property.whatsapp_number.replace(/\D/g, "")}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <MessageCircleIcon className="w-4 h-4" />
                                            <span className="hidden sm:inline">WhatsApp</span>
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

// Property Grid Card Component
function PropertyGridCard({
    property,
    isSaved,
    onSaveToggle,
}: {
    property: Properties;
    isSaved: boolean;
    onSaveToggle: (propertyId: string) => void;
}) {
    const imageUrl = property.main_image_url || property.cover_image_url || "/placeholder-property.jpg";
    const listingType = property.listing_type?.name || "For Sale";
    const propertyType = property.property_type?.name || "Property";
    const cityName = property.city?.name || property.location?.city?.name || "";
    const locationName = property.location?.name || "";
    const fullLocation = [locationName, cityName].filter(Boolean).join(", ");
    const currency = property.currency || "PKR";
    const agentName = property.contact_person_name || "Agent";
    const agentInitial = agentName.charAt(0).toUpperCase();

    return (
        <Card className="p-0 overflow-hidden hover:shadow-lg transition-all group bg-card border-border">
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <Link href={`/p/${property.slug || property.$id}`}>
                    <Image
                        src={imageUrl}
                        alt={property.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                </Link>
                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    {property.is_verified && (
                        <Badge className="bg-primary text-primary-foreground text-xs px-2 py-0.5">
                            <CheckIcon className="w-3 h-3 mr-1" />
                            Verified
                        </Badge>
                    )}
                    {property.is_featured && (
                        <Badge className="bg-amber-500 text-white text-xs">Featured</Badge>
                    )}
                </div>
                {/* Save Button */}
                <button
                    onClick={() => onSaveToggle(property.$id)}
                    className="absolute top-2 right-2 p-2 bg-card/95 backdrop-blur-sm rounded-full shadow-md hover:bg-card transition-colors"
                >
                    <HeartIcon
                        className={`w-4 h-4 ${isSaved ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
                    />
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <p className="text-lg font-bold text-foreground">
                            <span className="text-xs font-normal text-muted-foreground mr-1">{currency}</span>
                            {formatPrice(property.price, currency)}
                        </p>
                        {property.price_negotiable && (
                            <span className="text-[10px] text-green-600 font-medium">Negotiable</span>
                        )}
                    </div>
                    <Badge variant="outline" className="text-xs border-border">{listingType}</Badge>
                </div>

                <Link href={`/p/${property.slug || property.$id}`}>
                    <h3 className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1 mb-1">
                        {property.title}
                    </h3>
                </Link>

                <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3">
                    <MapPinIcon className="w-3 h-3 flex-shrink-0" />
                    <span className="line-clamp-1">{fullLocation || "Location not specified"}</span>
                </p>

                {/* Features */}
                <div className="flex items-center justify-between text-xs text-muted-foreground py-2 border-t border-border">
                    {property.bedrooms !== null && property.bedrooms > 0 && (
                        <div className="flex items-center gap-1">
                            <BedDoubleIcon className="w-3.5 h-3.5" />
                            <span>{property.bedrooms}</span>
                        </div>
                    )}
                    {property.bathrooms !== null && property.bathrooms > 0 && (
                        <div className="flex items-center gap-1">
                            <BathIcon className="w-3.5 h-3.5" />
                            <span>{property.bathrooms}</span>
                        </div>
                    )}
                    {property.total_area && (
                        <div className="flex items-center gap-1">
                            <RulerIcon className="w-3.5 h-3.5" />
                            <span>{formatArea(property.total_area, property.area_unit)}</span>
                        </div>
                    )}
                </div>

                {/* Agent & Quick Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                    {/* Agent Info */}
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
                            {agentInitial}
                        </div>
                        <span className="text-xs text-muted-foreground line-clamp-1 max-w-[80px]">{agentName}</span>
                    </div>

                    {/* Quick Contact */}
                    <div className="flex items-center gap-1">
                        <PropertyInquiryDialog
                            propertyId={property.$id}
                            propertyTitle={property.title}
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                        />
                        {property.contact_phone && (
                            <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                                <a href={`tel:${property.contact_phone}`}>
                                    <PhoneIcon className="w-3.5 h-3.5" />
                                </a>
                            </Button>
                        )}
                        {property.whatsapp_number && (
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-green-600 hover:text-green-700" asChild>
                                <a
                                    href={`https://wa.me/${property.whatsapp_number.replace(/\D/g, "")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <MessageCircleIcon className="w-3.5 h-3.5" />
                                </a>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}

// Loading Skeleton
function PropertyCardSkeleton({ viewMode }: { viewMode: "grid" | "list" }) {
    if (viewMode === "list") {
        return (
            <Card className="overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                    <Skeleton className="w-full lg:w-[380px] h-64 lg:h-[280px]" />
                    <div className="flex-1 p-5 space-y-4">
                        <Skeleton className="h-8 w-1/3" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-4 w-1/2" />
                        <div className="flex gap-2 mt-4">
                            <Skeleton className="h-9 w-24" />
                            <Skeleton className="h-9 w-24" />
                            <Skeleton className="h-9 w-12" />
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex justify-between pt-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-16" />
                </div>
            </div>
        </Card>
    );
}

// Right Sidebar Component
function RightSidebar({
    cities,
    onCityClick,
}: {
    cities: City[];
    onCityClick: (cityId: string) => void;
}) {
    return (
        <div className="space-y-6">
            {/* Map Card */}
            <Card className="overflow-hidden border-border">
                <div className="relative h-48 bg-muted">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <MapIcon className="w-16 h-16 text-muted-foreground/30" />
                    </div>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                        <Button variant="outline" size="sm" className="bg-card shadow-md gap-2">
                            <MapIcon className="w-4 h-4" />
                            Find Homes by Drive Time
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Sell or Rent CTA */}
            <Card className="p-5 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h3 className="font-semibold text-lg">Sell or Rent Your Property</h3>
                        <p className="text-sm text-primary-foreground/80 mt-1">
                            Connect with a trusted agent to secure the best deal, faster.
                        </p>
                    </div>
                    <Badge className="bg-destructive text-white text-xs">NEW</Badge>
                </div>
                <Button variant="secondary" className="w-full mt-2">
                    Get Started
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Button>
            </Card>

            {/* Alert Me */}
            <Card className="p-5 border-border">
                <p className="text-sm text-muted-foreground mb-3">
                    Be the first to hear about new properties
                </p>
                <Button variant="outline" className="w-full gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    <BellIcon className="w-4 h-4" />
                    ALERT ME OF NEW PROPERTIES
                </Button>
            </Card>

            {/* Recommended Searches */}
            <Card className="p-5">
                <h3 className="font-semibold text-foreground mb-4">Recommended searches</h3>
                <div className="space-y-2">
                    <Link href="/properties?beds=0" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                        Studio Properties for sale
                    </Link>
                    <Link href="/properties?beds=1" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                        1 Bedroom Properties for sale
                    </Link>
                    <Link href="/properties?beds=2" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                        2 Bedroom Properties for sale
                    </Link>
                    <Link href="/properties?beds=3" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                        3 Bedroom Properties for sale
                    </Link>
                    <Link href="/properties?beds=4" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                        4 Bedroom Properties for sale
                    </Link>
                    <button className="text-sm text-primary font-medium hover:text-primary/80 transition-colors">
                        View More
                    </button>
                </div>
            </Card>

            {/* Invest in Off Plan */}
            <Card className="p-5 bg-secondary">
                <h3 className="font-semibold text-secondary-foreground mb-2">Invest in Off Plan</h3>
                <p className="text-sm text-muted-foreground mb-3">
                    Discover new developments with attractive payment plans
                </p>
                <Button variant="outline" size="sm" className="w-full">
                    Explore Off Plan
                </Button>
            </Card>
        </div>
    );
}

function PropertiesPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();

    // State
    const [properties, setProperties] = useState<Properties[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"grid" | "list">("list");
    const [sortBy, setSortBy] = useState("popular");
    const [currentPage, setCurrentPage] = useState(1);
    const [savedPropertyIds, setSavedPropertyIds] = useState<Set<string>>(new Set());
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // Lookup data
    const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
    const [listingTypes, setListingTypes] = useState<ListingType[]>([]);
    const [cities, setCities] = useState<City[]>([]);

    // Quick filter states
    const [selectedPurpose, setSelectedPurpose] = useState<string>("buy");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [locationSearch, setLocationSearch] = useState("");

    // Filters
    const [filters, setFilters] = useState<PropertyFilters>({
        is_active: true,
        is_published: true,
        limit: ITEMS_PER_PAGE,
        offset: 0,
    });

    // Beds & Baths Popover State
    const [tempBeds, setTempBeds] = useState<number | undefined>(undefined);
    const [tempBaths, setTempBaths] = useState<number | undefined>(undefined);

    // Agent info for filtered view
    const [agentInfo, setAgentInfo] = useState<Users | null>(null);

    // Load lookup data
    useEffect(() => {
        const loadLookups = async () => {
            try {
                const [propTypes, listTypes, allCities] = await Promise.all([
                    lookupsService.getPropertyTypes(),
                    lookupsService.getListingTypes(),
                    lookupsService.getAllCities(),
                ]);
                setPropertyTypes(propTypes);
                setListingTypes(listTypes);
                setCities(allCities);
            } catch (error) {
                console.error("Error loading lookups:", error);
            }
        };
        loadLookups();
    }, []);

    // Load saved properties for current user
    useEffect(() => {
        const loadSavedProperties = async () => {
            if (!user) return;
            try {
                const result = await savedPropertiesService.getUserSavedProperties(user.$id);
                const ids = new Set(result.savedProperties.map((sp: UserSavedProperties) => sp.property_id));
                setSavedPropertyIds(ids);
            } catch (error) {
                console.error("Error loading saved properties:", error);
            }
        };
        loadSavedProperties();
    }, [user]);

    // Initialize filters from URL
    useEffect(() => {
        const urlFilters: PropertyFilters = {
            is_active: true,
            is_published: true,
            limit: ITEMS_PER_PAGE,
            offset: 0,
        };

        const type = searchParams.get("type");
        const city = searchParams.get("city");
        const location = searchParams.get("location");
        const state = searchParams.get("state");
        const listing = searchParams.get("listing");
        const minPrice = searchParams.get("min_price");
        const maxPrice = searchParams.get("max_price");
        const beds = searchParams.get("beds");
        const baths = searchParams.get("baths");
        const search = searchParams.get("q");
        const page = searchParams.get("page");
        const purpose = searchParams.get("purpose");
        const status = searchParams.get("status");
        const agent = searchParams.get("agent");

        if (type) urlFilters.property_type_id = type;
        if (city) urlFilters.city_id = city;
        if (location) urlFilters.location_id = location;
        if (state) urlFilters.state_id = state;
        if (listing) urlFilters.listing_type_id = listing;
        if (minPrice) urlFilters.min_price = parseInt(minPrice);
        if (maxPrice) urlFilters.max_price = parseInt(maxPrice);
        if (beds) {
            urlFilters.bedrooms = parseInt(beds);
            setTempBeds(parseInt(beds));
        }
        if (baths) {
            urlFilters.bathrooms = parseInt(baths);
            setTempBaths(parseInt(baths));
        }
        if (search) {
            urlFilters.search = search;
            setLocationSearch(search);
        }
        if (page) {
            const pageNum = parseInt(page);
            setCurrentPage(pageNum);
            urlFilters.offset = (pageNum - 1) * ITEMS_PER_PAGE;
        }
        if (purpose) {
            setSelectedPurpose(purpose);
        }
        if (status && status !== "all") {
            urlFilters.construction_status = status;
            setSelectedStatus(status);
        }
        if (agent) {
            urlFilters.agent_id = agent;
            // Fetch agent info
            usersService.getById(agent).then((agentData) => {
                setAgentInfo(agentData);
            }).catch((err) => {
                console.error("Error fetching agent info:", err);
                setAgentInfo(null);
            });
        } else {
            setAgentInfo(null);
        }

        setFilters(urlFilters);
    }, [searchParams]);

    // Fetch properties
    const fetchProperties = useCallback(async () => {
        setLoading(true);
        try {
            const result = await propertiesService.list(filters);
            setProperties(result.properties);
            setTotal(result.total);
        } catch (error) {
            console.error("Error fetching properties:", error);
            toast.error("Failed to load properties");
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    // Update URL with filters
    const updateURL = useCallback((newFilters: PropertyFilters, page: number) => {
        const params = new URLSearchParams();
        if (newFilters.property_type_id) params.set("type", newFilters.property_type_id);
        if (newFilters.city_id) params.set("city", newFilters.city_id);
        if (newFilters.location_id) params.set("location", newFilters.location_id);
        if (newFilters.state_id) params.set("state", newFilters.state_id);
        if (newFilters.listing_type_id) params.set("listing", newFilters.listing_type_id);
        if (newFilters.min_price) params.set("min_price", newFilters.min_price.toString());
        if (newFilters.max_price) params.set("max_price", newFilters.max_price.toString());
        if (newFilters.bedrooms) params.set("beds", newFilters.bedrooms.toString());
        if (newFilters.bathrooms) params.set("baths", newFilters.bathrooms.toString());
        if (newFilters.construction_status) params.set("status", newFilters.construction_status);
        if (newFilters.search) params.set("q", newFilters.search);
        if (newFilters.agent_id) params.set("agent", newFilters.agent_id);
        if (page > 1) params.set("page", page.toString());
        if (selectedPurpose !== "buy") params.set("purpose", selectedPurpose);

        const queryString = params.toString();
        router.push(queryString ? `/properties?${queryString}` : "/properties", { scroll: false });
    }, [router, selectedPurpose]);

    // Handle search
    const handleSearch = () => {
        const newFilters = {
            ...filters,
            search: locationSearch || undefined,
            bedrooms: tempBeds,
            bathrooms: tempBaths,
            offset: 0,
        };
        setFilters(newFilters);
        setCurrentPage(1);
        updateURL(newFilters, 1);
    };

    // Handle filter reset
    const handleResetFilters = () => {
        const defaultFilters: PropertyFilters = {
            is_active: true,
            is_published: true,
            limit: ITEMS_PER_PAGE,
            offset: 0,
        };
        setFilters(defaultFilters);
        setLocationSearch("");
        setTempBeds(undefined);
        setTempBaths(undefined);
        setSelectedPurpose("buy");
        setSelectedStatus("all");
        setCurrentPage(1);
        router.push("/properties");
    };

    // Handle city filter
    const handleCityFilter = (cityId: string) => {
        const newFilters = {
            ...filters,
            city_id: cityId,
            offset: 0,
        };
        setFilters(newFilters);
        setCurrentPage(1);
        updateURL(newFilters, 1);
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        const newFilters = {
            ...filters,
            offset: (page - 1) * ITEMS_PER_PAGE,
        };
        setFilters(newFilters);
        setCurrentPage(page);
        updateURL(newFilters, page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Handle save toggle
    const handleSaveToggle = async (propertyId: string) => {
        if (!user) {
            toast.error("Please sign in to save properties");
            return;
        }

        const isSaved = savedPropertyIds.has(propertyId);

        try {
            if (isSaved) {
                const result = await savedPropertiesService.getUserSavedProperties(user.$id);
                const savedProperty = result.savedProperties.find((sp: UserSavedProperties) => sp.property_id === propertyId);
                if (savedProperty) {
                    await savedPropertiesService.delete(savedProperty.$id);
                    setSavedPropertyIds((prev) => {
                        const next = new Set(prev);
                        next.delete(propertyId);
                        return next;
                    });
                    toast.success("Property removed from saved");
                }
            } else {
                await savedPropertiesService.saveProperty({ user_id: user.$id, property_id: propertyId });
                setSavedPropertyIds((prev) => new Set([...prev, propertyId]));
                toast.success("Property saved successfully");
            }
        } catch (error) {
            console.error("Error toggling save:", error);
            toast.error("Failed to update saved property");
        }
    };

    // Calculate total pages
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

    // Get listing type name for header
    const purposeText = selectedPurpose === "rent" ? "for rent" : "for sale";

    return (
        <div className="min-h-screen bg-background">
            {/* Search Header */}
            <div className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
                <div className="container mx-auto max-w-7xl px-4">
                    {/* Main Search Bar */}
                    <div className="flex items-center gap-3 py-4 overflow-x-auto scrollbar-hide">
                        {/* Purpose Dropdown */}
                        <Select value={selectedPurpose} onValueChange={setSelectedPurpose}>
                            <SelectTrigger className="w-24 flex-shrink-0">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="buy">Buy</SelectItem>
                                <SelectItem value="rent">Rent</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Location Search */}
                        <div className="relative flex-1 min-w-[200px]">
                            <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Enter location"
                                value={locationSearch}
                                onChange={(e) => setLocationSearch(e.target.value)}
                                className="pl-9"
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                        </div>

                        {/* Status Tabs */}
                        <div className="hidden md:flex items-center border border-border rounded-lg overflow-hidden flex-shrink-0">
                            {["all", "ready", "off-plan"].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setSelectedStatus(status)}
                                    className={`px-4 py-2 text-sm font-medium transition-colors ${selectedStatus === status
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                        }`}
                                >
                                    {status === "all" ? "All" : status === "ready" ? "Ready" : "Off-Plan"}
                                </button>
                            ))}
                        </div>

                        {/* Property Type */}
                        <Select
                            value={filters.property_type_id || "all"}
                            onValueChange={(value) => {
                                const newFilters = { ...filters, property_type_id: value === "all" ? undefined : value };
                                setFilters(newFilters);
                                handleSearch();
                            }}
                        >
                            <SelectTrigger className="w-36 flex-shrink-0 hidden md:flex">
                                <SelectValue placeholder="Residential" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                {propertyTypes.map((type) => (
                                    <SelectItem key={type.$id} value={type.$id}>
                                        {type.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Beds & Baths Popover */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="flex-shrink-0 hidden md:flex gap-1">
                                    Beds & Baths
                                    <ChevronDownIcon className="w-4 h-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-4">
                                <div className="space-y-4">
                                    <div>
                                        <Label className="text-sm font-medium mb-2 block">Bedrooms</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {["Any", "1", "2", "3", "4", "5+"].map((opt) => {
                                                const val = opt === "Any" ? undefined : opt === "5+" ? 5 : parseInt(opt);
                                                return (
                                                    <button
                                                        key={opt}
                                                        onClick={() => setTempBeds(val)}
                                                        className={`px-3 py-1.5 text-sm rounded-md border font-medium transition-all ${tempBeds === val
                                                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                                            : "border-border bg-background text-foreground hover:border-primary hover:bg-accent"
                                                            }`}
                                                    >
                                                        {opt}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium mb-2 block">Bathrooms</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {["Any", "1", "2", "3", "4+"].map((opt) => {
                                                const val = opt === "Any" ? undefined : opt === "4+" ? 4 : parseInt(opt);
                                                return (
                                                    <button
                                                        key={opt}
                                                        onClick={() => setTempBaths(val)}
                                                        className={`px-3 py-1.5 text-sm rounded-md border font-medium transition-all ${tempBaths === val
                                                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                                            : "border-border bg-background text-foreground hover:border-primary hover:bg-accent"
                                                            }`}
                                                    >
                                                        {opt}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <Button onClick={handleSearch} className="w-full">
                                        Apply
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>

                        {/* More Filters */}
                        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="flex-shrink-0 gap-2">
                                    <SlidersHorizontalIcon className="w-4 h-4" />
                                    <span className="hidden sm:inline">More Filters</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-80 overflow-y-auto">
                                <SheetHeader>
                                    <SheetTitle>Filters</SheetTitle>
                                </SheetHeader>
                                <div className="mt-6 space-y-6">
                                    {/* Price Range */}
                                    <div>
                                        <Label className="text-sm font-medium mb-3 block">Price Range</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input
                                                type="number"
                                                placeholder="Min"
                                                value={filters.min_price || ""}
                                                onChange={(e) => setFilters(prev => ({ ...prev, min_price: e.target.value ? parseInt(e.target.value) : undefined }))}
                                            />
                                            <Input
                                                type="number"
                                                placeholder="Max"
                                                value={filters.max_price || ""}
                                                onChange={(e) => setFilters(prev => ({ ...prev, max_price: e.target.value ? parseInt(e.target.value) : undefined }))}
                                            />
                                        </div>
                                    </div>

                                    {/* City */}
                                    <div>
                                        <Label className="text-sm font-medium mb-3 block">City</Label>
                                        <Select
                                            value={filters.city_id || "all"}
                                            onValueChange={(value) => setFilters(prev => ({ ...prev, city_id: value === "all" ? undefined : value }))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Cities" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Cities</SelectItem>
                                                {cities.map((city) => (
                                                    <SelectItem key={city.$id} value={city.$id}>
                                                        {city.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Features */}
                                    <div>
                                        <Label className="text-sm font-medium mb-3 block">Features</Label>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    id="verified"
                                                    checked={filters.is_featured === true}
                                                    onCheckedChange={(checked) => setFilters(prev => ({ ...prev, is_featured: checked ? true : undefined }))}
                                                />
                                                <Label htmlFor="verified" className="text-sm cursor-pointer">
                                                    Featured Only
                                                </Label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-4 border-t">
                                        <Button variant="outline" onClick={handleResetFilters} className="flex-1">
                                            Reset
                                        </Button>
                                        <SheetClose asChild>
                                            <Button onClick={handleSearch} className="flex-1">
                                                Apply
                                            </Button>
                                        </SheetClose>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Quick Filters */}
                    <div className="flex items-center gap-6 py-3 border-t border-border text-sm overflow-x-auto scrollbar-hide">
                        <div className="flex items-center gap-2 text-muted-foreground hover:text-primary whitespace-nowrap cursor-pointer transition-colors">
                            <Checkbox id="verified-listings" className="h-4 w-4 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                            <label htmlFor="verified-listings" className="cursor-pointer font-medium">Verified listings first</label>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground hover:text-primary whitespace-nowrap cursor-pointer transition-colors">
                            <Checkbox id="floor-plans" className="h-4 w-4 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                            <label htmlFor="floor-plans" className="cursor-pointer font-medium">Properties with floor plans</label>
                        </div>
                        <div className="flex-1" />
                        <Button variant="ghost" className="text-primary font-semibold hover:text-primary/80 hover:bg-accent whitespace-nowrap h-auto px-3 py-1.5">
                            <BellIcon className="w-4 h-4 mr-1.5" />
                            Save Search
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto max-w-7xl px-4 py-8">
                {/* Agent Banner */}
                {agentInfo && (
                    <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-xl flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative h-16 w-16 rounded-full overflow-hidden bg-primary/10 flex-shrink-0">
                            {agentInfo.profile_image_url ? (
                                <Image
                                    src={agentInfo.profile_image_url}
                                    alt={`${agentInfo.first_name || ''} ${agentInfo.last_name || ''}`}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-primary text-xl font-bold">
                                    {(agentInfo.first_name?.[0] || agentInfo.username?.[0] || 'A').toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <p className="text-sm text-muted-foreground mb-1">
                                Showing properties by
                            </p>
                            <h2 className="text-lg font-semibold text-foreground">
                                {agentInfo.first_name && agentInfo.last_name
                                    ? `${agentInfo.first_name} ${agentInfo.last_name}`
                                    : agentInfo.company_name || agentInfo.username}
                            </h2>
                            {agentInfo.designation && (
                                <p className="text-sm text-muted-foreground">{agentInfo.designation}</p>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/u/${agentInfo.username}`}>
                                    View Profile
                                </Link>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    router.push("/properties");
                                }}
                            >
                                <XIcon className="h-4 w-4 mr-1" />
                                Clear Filter
                            </Button>
                        </div>
                    </div>
                )}

                {/* Results Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <h1 className="text-xl font-semibold text-foreground">
                        {agentInfo ? (
                            <>
                                Properties by{" "}
                                <span className="text-primary">
                                    {agentInfo.first_name && agentInfo.last_name
                                        ? `${agentInfo.first_name} ${agentInfo.last_name}`
                                        : agentInfo.company_name || agentInfo.username}
                                </span>
                            </>
                        ) : (
                            <>
                                Properties {purposeText}
                                {filters.city_id && cities.find(c => c.$id === filters.city_id) && (
                                    <span className="text-primary"> in {cities.find(c => c.$id === filters.city_id)?.name}</span>
                                )}
                            </>
                        )}
                    </h1>

                    <div className="flex items-center gap-3">
                        {/* Sort */}
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="popular">Popular</SelectItem>
                                <SelectItem value="newest">Newest</SelectItem>
                                <SelectItem value="price_low">Price: Low</SelectItem>
                                <SelectItem value="price_high">Price: High</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* View Toggle */}
                        <div className="flex items-center border border-border rounded-lg overflow-hidden">
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`}
                            >
                                <ListIcon className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`}
                            >
                                <GridIcon className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground border-l border-border transition-colors">
                                <MapIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* City Tabs */}
                <div className="flex items-center gap-6 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                    {cities.slice(0, 4).map((city) => (
                        <button
                            key={city.$id}
                            onClick={() => handleCityFilter(city.$id)}
                            className={`flex items-center gap-2 whitespace-nowrap text-sm transition-colors ${filters.city_id === city.$id
                                ? "text-primary font-semibold"
                                : "text-muted-foreground hover:text-primary"
                                }`}
                        >
                            <span>{city.name}</span>
                            <span className="text-muted-foreground/60">({Math.floor(Math.random() * 100000).toLocaleString()})</span>
                        </button>
                    ))}
                    <button className="text-primary font-semibold text-sm whitespace-nowrap hover:text-primary/80 transition-colors">
                        VIEW ALL LOCATIONS
                    </button>
                </div>

                {/* Content Grid */}
                <div className="flex gap-6">
                    {/* Properties List */}
                    <main className="flex-1 min-w-0">
                        {loading ? (
                            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "space-y-4"}>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <PropertyCardSkeleton key={i} viewMode={viewMode} />
                                ))}
                            </div>
                        ) : properties.length === 0 ? (
                            <div className="text-center py-16 bg-card rounded-lg border border-border">
                                <HomeIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-foreground mb-2">No Properties Found</h3>
                                <p className="text-muted-foreground mb-6">
                                    We couldn&apos;t find any properties matching your criteria.
                                </p>
                                <Button onClick={handleResetFilters}>Clear Filters</Button>
                            </div>
                        ) : (
                            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "space-y-4"}>
                                {properties.map((property) => (
                                    viewMode === "list" ? (
                                        <PropertyListCard
                                            key={property.$id}
                                            property={property}
                                            isSaved={savedPropertyIds.has(property.$id)}
                                            onSaveToggle={handleSaveToggle}
                                        />
                                    ) : (
                                        <PropertyGridCard
                                            key={property.$id}
                                            property={property}
                                            isSaved={savedPropertyIds.has(property.$id)}
                                            onSaveToggle={handleSaveToggle}
                                        />
                                    )
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {!loading && totalPages > 1 && (
                            <div className="mt-8">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                                                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                            />
                                        </PaginationItem>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                                            .filter((page) => {
                                                if (totalPages <= 7) return true;
                                                if (page === 1 || page === totalPages) return true;
                                                if (Math.abs(page - currentPage) <= 1) return true;
                                                return false;
                                            })
                                            .map((page, index, array) => {
                                                const showEllipsisBefore = index > 0 && page - array[index - 1] > 1;
                                                return (
                                                    <React.Fragment key={page}>
                                                        {showEllipsisBefore && (
                                                            <PaginationItem>
                                                                <PaginationEllipsis />
                                                            </PaginationItem>
                                                        )}
                                                        <PaginationItem>
                                                            <PaginationLink
                                                                onClick={() => handlePageChange(page)}
                                                                isActive={currentPage === page}
                                                                className="cursor-pointer"
                                                            >
                                                                {page}
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                    </React.Fragment>
                                                );
                                            })}

                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>

                                <p className="text-center text-sm text-muted-foreground mt-4">
                                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, total)} of {total} properties
                                </p>
                            </div>
                        )}
                    </main>

                    {/* Right Sidebar - Desktop Only */}
                    <aside className="hidden xl:block w-72 flex-shrink-0">
                        <RightSidebar cities={cities} onCityClick={handleCityFilter} />
                    </aside>
                </div>
            </div>
        </div>
    );
}

// Loading fallback for Suspense
function PropertiesPageLoading() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <Spinner className="h-8 w-8" />
        </div>
    );
}

// Export with Suspense wrapper
export default function PropertiesPageClient() {
    return (
        <Suspense fallback={<PropertiesPageLoading />}>
            <PropertiesPageContent />
        </Suspense>
    );
}
