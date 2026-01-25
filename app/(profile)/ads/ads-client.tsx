"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/store/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { adsService, PACKAGE_CONFIG, type PackageType } from "@/services/ads";
import { propertiesService } from "@/services/properties";
import { usersService } from "@/services/users";
import { type FeaturedListingPayments, type Properties, type Users, UserType } from "@/types/appwrite";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
    Megaphone,
    Sparkles,
    TrendingUp,
    Eye,
    MousePointerClick,
    Calendar,
    Clock,
    DollarSign,
    Building2,
    MoreVertical,
    Plus,
    RefreshCw,
    Pause,
    Play,
    X,
    ChevronRight,
    CheckCircle,
    AlertTriangle,
    Star,
    Zap,
    Crown,
    Target,
    BarChart3,
    Percent,
    ArrowUpRight,
    Home,
    ExternalLink,
    Repeat,
    Ban,
    Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Helper function to format price
function formatPrice(price: number, currency: string = "PKR") {
    if (currency === "PKR") {
        if (price >= 10000000) {
            return `PKR ${(price / 10000000).toFixed(2)} Cr`;
        } else if (price >= 100000) {
            return `PKR ${(price / 100000).toFixed(2)} Lac`;
        }
    }
    return `${currency} ${price.toLocaleString()}`;
}

// Helper to get status badge
function getStatusBadge(status: string) {
    const statusConfig: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; icon: React.ReactNode; label: string }> = {
        active: { variant: "default", icon: <CheckCircle className="h-3 w-3 mr-1" />, label: "Active" },
        pending: { variant: "secondary", icon: <Clock className="h-3 w-3 mr-1" />, label: "Pending" },
        expired: { variant: "outline", icon: <AlertTriangle className="h-3 w-3 mr-1" />, label: "Expired" },
        cancelled: { variant: "destructive", icon: <X className="h-3 w-3 mr-1" />, label: "Cancelled" },
        paused: { variant: "secondary", icon: <Pause className="h-3 w-3 mr-1" />, label: "Paused" },
    };

    const config = statusConfig[status] || { variant: "outline", icon: null, label: status };

    return (
        <Badge variant={config.variant} className="capitalize">
            {config.icon}
            {config.label}
        </Badge>
    );
}

// Helper to get package badge
function getPackageBadge(packageType: string) {
    const packageConfig: Record<string, { className: string; icon: React.ReactNode }> = {
        basic: { className: "bg-blue-100 text-blue-700 hover:bg-blue-100", icon: <Zap className="h-3 w-3 mr-1" /> },
        standard: { className: "bg-green-100 text-green-700 hover:bg-green-100", icon: <Star className="h-3 w-3 mr-1" /> },
        premium: { className: "bg-purple-100 text-purple-700 hover:bg-purple-100", icon: <Crown className="h-3 w-3 mr-1" /> },
        spotlight: { className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100", icon: <Sparkles className="h-3 w-3 mr-1" /> },
    };

    const config = packageConfig[packageType] || { className: "bg-gray-100", icon: null };

    return (
        <Badge className={cn(config.className, "capitalize")}>
            {config.icon}
            {packageType}
        </Badge>
    );
}

// Package Card Component
function PackageCard({
    type,
    config,
    isSelected,
    onSelect,
    isPopular = false
}: {
    type: PackageType;
    config: typeof PACKAGE_CONFIG[PackageType];
    isSelected: boolean;
    onSelect: () => void;
    isPopular?: boolean;
}) {
    const icons: Record<PackageType, React.ReactNode> = {
        basic: <Zap className="h-6 w-6" />,
        standard: <Star className="h-6 w-6" />,
        premium: <Crown className="h-6 w-6" />,
        spotlight: <Sparkles className="h-6 w-6" />,
    };

    const colors: Record<PackageType, { bg: string; border: string; text: string }> = {
        basic: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-600" },
        standard: { bg: "bg-green-50", border: "border-green-200", text: "text-green-600" },
        premium: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-600" },
        spotlight: { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-600" },
    };

    return (
        <Card
            className={cn(
                "relative cursor-pointer transition-all hover:shadow-md",
                isSelected && "ring-2 ring-primary",
                colors[type].border
            )}
            onClick={onSelect}
        >
            {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary">Most Popular</Badge>
                </div>
            )}
            <CardHeader className="pb-3">
                <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-3", colors[type].bg)}>
                    <span className={colors[type].text}>{icons[type]}</span>
                </div>
                <CardTitle className="text-lg">{config.name}</CardTitle>
                <CardDescription>{config.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <span className="text-3xl font-bold">{formatPrice(config.price)}</span>
                    <span className="text-muted-foreground">/{config.duration} days</span>
                </div>
                <ul className="space-y-2">
                    {config.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                            {feature}
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}

// Ad Card Component
function AdCard({
    ad,
    onToggleAutoRenew,
    onCancel,
    onViewAnalytics,
}: {
    ad: FeaturedListingPayments;
    onToggleAutoRenew: (id: string) => void;
    onCancel: (id: string) => void;
    onViewAnalytics: (id: string) => void;
}) {
    const daysRemaining = Math.max(0, Math.ceil((new Date(ad.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
    const totalDays = ad.duration_days;
    const progressPercent = ((totalDays - daysRemaining) / totalDays) * 100;

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            {getPackageBadge(ad.package)}
                            {getStatusBadge(String(ad.status))}
                            {ad.is_auto_renew && (
                                <Badge variant="outline" className="text-xs">
                                    <Repeat className="h-3 w-3 mr-1" />
                                    Auto-renew
                                </Badge>
                            )}
                        </div>
                        <h3 className="font-semibold truncate">{ad.property_title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            {new Date(ad.start_date).toLocaleDateString()} - {new Date(ad.end_date).toLocaleDateString()}
                        </p>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onViewAnalytics(ad.$id)}>
                                <BarChart3 className="h-4 w-4 mr-2" />
                                View Analytics
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/p/${ad.property_id}`}>
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    View Property
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onToggleAutoRenew(ad.$id)}>
                                <Repeat className="h-4 w-4 mr-2" />
                                {ad.is_auto_renew ? "Disable Auto-renew" : "Enable Auto-renew"}
                            </DropdownMenuItem>
                            {String(ad.status) === "active" && (
                                <DropdownMenuItem
                                    onClick={() => onCancel(ad.$id)}
                                    className="text-red-600"
                                >
                                    <Ban className="h-4 w-4 mr-2" />
                                    Cancel Promotion
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {String(ad.status) === "active" && (
                    <div className="mt-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Time Remaining</span>
                            <span className="font-medium">{daysRemaining} days left</span>
                        </div>
                        <Progress value={progressPercent} className="h-2" />
                    </div>
                )}

                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                    <div className="text-center">
                        <p className="text-2xl font-bold">{ad.impressions.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                            <Eye className="h-3 w-3" />
                            Impressions
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold">{ad.clicks.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                            <MousePointerClick className="h-3 w-3" />
                            Clicks
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold">{ad.ctr.toFixed(2)}%</p>
                        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                            <Target className="h-3 w-3" />
                            CTR
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function AdsClient() {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();

    // State
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [ads, setAds] = useState<FeaturedListingPayments[]>([]);
    const [properties, setProperties] = useState<Properties[]>([]);
    const [userProfile, setUserProfile] = useState<Users | null>(null);
    const [analytics, setAnalytics] = useState<{
        totalSpent: number;
        activeAds: number;
        totalImpressions: number;
        totalClicks: number;
        avgCtr: number;
        expiringSoon: number;
    } | null>(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    // Create Ad Dialog State
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<string>("");
    const [selectedPackage, setSelectedPackage] = useState<PackageType>("standard");
    const [promoCode, setPromoCode] = useState("");
    const [promoDiscount, setPromoDiscount] = useState<{ type: "percentage" | "fixed"; value: number } | null>(null);
    const [creatingAd, setCreatingAd] = useState(false);

    // Cancel Dialog State
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [adToCancel, setAdToCancel] = useState<string | null>(null);

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/signin?redirect=/profile/ads");
        }
    }, [user, authLoading, router]);

    // Check if user is agent or agency
    const isAgentOrAgency = userProfile?.user_type === UserType.AGENT || userProfile?.user_type === UserType.AGENCY;

    // Fetch data
    const fetchData = useCallback(async () => {
        if (!user?.$id) return;

        try {
            const [adsData, analyticsData, propertiesData, profileData] = await Promise.all([
                adsService.getUserFeaturedListings(user.$id),
                adsService.getUserAdsAnalytics(user.$id),
                propertiesService.getByOwnerId(user.$id, {
                    limit: 100,
                }),
                usersService.getByUserId(user.$id),
            ]);

            setAds(adsData.payments);
            setAnalytics(analyticsData);
            setProperties(propertiesData.properties);
            setUserProfile(profileData);
        } catch (error) {
            console.error("Error fetching ads data:", error);
            toast.error("Failed to load ads data");
        } finally {
            setLoading(false);
        }
    }, [user?.$id]);

    useEffect(() => {
        if (user?.$id) {
            fetchData();
        }
    }, [user?.$id, fetchData]);

    // Refresh data
    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
        toast.success("Data refreshed");
    };

    // Apply promo code
    const handleApplyPromo = async () => {
        if (!promoCode.trim()) return;

        try {
            const promo = await adsService.validatePromoCode(promoCode);
            if (promo) {
                setPromoDiscount({
                    type: promo.discount_type as "percentage" | "fixed",
                    value: promo.discount_value,
                });
                toast.success(`Promo code applied: ${promo.discount_type === "percentage" ? `${promo.discount_value}% off` : `${formatPrice(promo.discount_value)} off`}`);
            } else {
                toast.error("Invalid or expired promo code");
                setPromoDiscount(null);
            }
        } catch {
            toast.error("Failed to validate promo code");
        }
    };

    // Calculate final price
    const calculateFinalPrice = () => {
        const basePrice = PACKAGE_CONFIG[selectedPackage].price;
        if (!promoDiscount) return basePrice;
        return adsService.calculateDiscountedPrice(basePrice, promoDiscount.type, promoDiscount.value);
    };

    // Create promotion
    const handleCreatePromotion = async () => {
        if (!selectedProperty || !user) return;

        const property = properties.find(p => p.$id === selectedProperty);
        if (!property) return;

        setCreatingAd(true);

        try {
            const packageConfig = PACKAGE_CONFIG[selectedPackage];
            const startDate = new Date();
            const endDate = new Date(startDate.getTime() + packageConfig.duration * 24 * 60 * 60 * 1000);

            await adsService.createFeaturedListingPayment({
                property_id: property.$id,
                property_title: property.title,
                owner_id: user.$id,
                owner_name: user.name || user.email?.split("@")[0] || "User",
                package: selectedPackage,
                amount: calculateFinalPrice(),
                currency: "PKR",
                duration_days: packageConfig.duration,
                payment_date: startDate.toISOString(),
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                position_priority: packageConfig.position_priority,
            });

            toast.success("Promotion created successfully!");
            setCreateDialogOpen(false);
            setSelectedProperty("");
            setSelectedPackage("standard");
            setPromoCode("");
            setPromoDiscount(null);
            fetchData();
        } catch (error) {
            console.error("Error creating promotion:", error);
            toast.error("Failed to create promotion");
        } finally {
            setCreatingAd(false);
        }
    };

    // Toggle auto-renew
    const handleToggleAutoRenew = async (adId: string) => {
        try {
            await adsService.toggleAutoRenew(adId);
            toast.success("Auto-renew setting updated");
            fetchData();
        } catch {
            toast.error("Failed to update auto-renew setting");
        }
    };

    // Cancel promotion
    const handleCancelPromotion = async () => {
        if (!adToCancel) return;

        try {
            await adsService.cancelFeaturedListing(adToCancel);
            toast.success("Promotion cancelled");
            setCancelDialogOpen(false);
            setAdToCancel(null);
            fetchData();
        } catch {
            toast.error("Failed to cancel promotion");
        }
    };

    // View analytics
    const handleViewAnalytics = (adId: string) => {
        // In a real app, this would open a detailed analytics view
        toast.info("Detailed analytics coming soon!");
    };

    // Filter ads
    const filteredAds = ads.filter((ad) => {
        if (statusFilter === "all") return true;
        return String(ad.status) === statusFilter;
    });

    // Get eligible properties (not already promoted)
    const eligibleProperties = properties.filter(
        (p) => !ads.some((ad) => ad.property_id === p.$id && String(ad.status) === "active")
    );

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner className="h-8 w-8" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="container mx-auto max-w-7xl p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Megaphone className="h-6 w-6" />
                        Ads & Promotions
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Boost your property listings and reach more potential buyers
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={refreshing}
                    >
                        <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
                        Refresh
                    </Button>
                    <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button disabled={eligibleProperties.length === 0}>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Promotion
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Create New Promotion</DialogTitle>
                                <DialogDescription>
                                    Select a property and package to boost your listing's visibility
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6 py-4">
                                {/* Property Selection */}
                                <div className="space-y-2">
                                    <Label>Select Property</Label>
                                    <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose a property to promote" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {eligibleProperties.map((property) => (
                                                <SelectItem key={property.$id} value={property.$id}>
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="h-4 w-4 text-muted-foreground" />
                                                        <span className="truncate">{property.title}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {eligibleProperties.length === 0 && (
                                        <p className="text-sm text-muted-foreground">
                                            All your properties are already promoted or you have no active listings.
                                        </p>
                                    )}
                                </div>

                                <Separator />

                                {/* Package Selection */}
                                <div className="space-y-4">
                                    <Label>Select Package</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {(Object.entries(PACKAGE_CONFIG) as [PackageType, typeof PACKAGE_CONFIG[PackageType]][]).map(
                                            ([type, config]) => (
                                                <PackageCard
                                                    key={type}
                                                    type={type}
                                                    config={config}
                                                    isSelected={selectedPackage === type}
                                                    onSelect={() => setSelectedPackage(type)}
                                                    isPopular={type === "standard"}
                                                />
                                            )
                                        )}
                                    </div>
                                </div>

                                <Separator />

                                {/* Promo Code */}
                                <div className="space-y-2">
                                    <Label>Promo Code (Optional)</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Enter promo code"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                            className="flex-1"
                                        />
                                        <Button variant="secondary" onClick={handleApplyPromo}>
                                            Apply
                                        </Button>
                                    </div>
                                    {promoDiscount && (
                                        <p className="text-sm text-green-600 flex items-center gap-1">
                                            <CheckCircle className="h-4 w-4" />
                                            Discount applied: {promoDiscount.type === "percentage"
                                                ? `${promoDiscount.value}% off`
                                                : `${formatPrice(promoDiscount.value)} off`}
                                        </p>
                                    )}
                                </div>

                                <Separator />

                                {/* Summary */}
                                <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
                                    <h4 className="font-semibold">Order Summary</h4>
                                    <div className="flex justify-between text-sm">
                                        <span>Package:</span>
                                        <span className="font-medium capitalize">{selectedPackage}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Duration:</span>
                                        <span className="font-medium">{PACKAGE_CONFIG[selectedPackage].duration} days</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Base Price:</span>
                                        <span className="font-medium">{formatPrice(PACKAGE_CONFIG[selectedPackage].price)}</span>
                                    </div>
                                    {promoDiscount && (
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span>Discount:</span>
                                            <span className="font-medium">
                                                -{promoDiscount.type === "percentage"
                                                    ? `${promoDiscount.value}%`
                                                    : formatPrice(promoDiscount.value)}
                                            </span>
                                        </div>
                                    )}
                                    <Separator />
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total:</span>
                                        <span>{formatPrice(calculateFinalPrice())}</span>
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleCreatePromotion}
                                    disabled={!selectedProperty || creatingAd}
                                >
                                    {creatingAd ? (
                                        <>
                                            <Spinner className="h-4 w-4 mr-2" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="h-4 w-4 mr-2" />
                                            Create Promotion
                                        </>
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Non-agent/agency info banner */}
            {!isAgentOrAgency && (
                <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4 flex items-start gap-3">
                        <Info className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm text-blue-800">
                                <strong>Note:</strong> Property promotions are primarily designed for agents and agencies.
                                As a regular user, you can promote your listings, but some features may be limited.
                            </p>
                            <Button variant="link" size="sm" className="p-0 h-auto text-blue-600" asChild>
                                <Link href="/apply">
                                    Become an Agent <ChevronRight className="h-4 w-4 ml-1" />
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Analytics Overview */}
            {analytics && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <DollarSign className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold">{formatPrice(analytics.totalSpent)}</p>
                                    <p className="text-xs text-muted-foreground">Total Spent</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Megaphone className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold">{analytics.activeAds}</p>
                                    <p className="text-xs text-muted-foreground">Active Promotions</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Eye className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold">{analytics.totalImpressions.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground">Impressions</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <MousePointerClick className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold">{analytics.totalClicks.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground">Clicks</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-teal-100 rounded-lg">
                                    <Percent className="h-5 w-5 text-teal-600" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold">{analytics.avgCtr.toFixed(2)}%</p>
                                    <p className="text-xs text-muted-foreground">Avg. CTR</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <Clock className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold">{analytics.expiringSoon}</p>
                                    <p className="text-xs text-muted-foreground">Expiring Soon</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="overview">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        All Promotions
                    </TabsTrigger>
                    <TabsTrigger value="packages">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Packages
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    {/* Filters */}
                    <div className="flex items-center gap-4">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="expired">Expired</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                <SelectItem value="paused">Paused</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">
                            Showing {filteredAds.length} of {ads.length} promotions
                        </p>
                    </div>

                    {/* Ads List */}
                    {filteredAds.length === 0 ? (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <Megaphone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No promotions found</h3>
                                <p className="text-muted-foreground mb-4">
                                    {statusFilter !== "all"
                                        ? "Try changing your filter to see more promotions."
                                        : "Create your first promotion to boost your property's visibility."}
                                </p>
                                {eligibleProperties.length > 0 && (
                                    <Button onClick={() => setCreateDialogOpen(true)}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Your First Promotion
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredAds.map((ad) => (
                                <AdCard
                                    key={ad.$id}
                                    ad={ad}
                                    onToggleAutoRenew={handleToggleAutoRenew}
                                    onCancel={(id) => {
                                        setAdToCancel(id);
                                        setCancelDialogOpen(true);
                                    }}
                                    onViewAnalytics={handleViewAnalytics}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="packages" className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Available Packages</h2>
                        <p className="text-muted-foreground">
                            Choose the perfect package to promote your property listings
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {(Object.entries(PACKAGE_CONFIG) as [PackageType, typeof PACKAGE_CONFIG[PackageType]][]).map(
                            ([type, config]) => (
                                <Card key={type} className="relative">
                                    {type === "standard" && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                            <Badge className="bg-primary">Most Popular</Badge>
                                        </div>
                                    )}
                                    <CardHeader>
                                        <div className={cn(
                                            "w-12 h-12 rounded-lg flex items-center justify-center mb-3",
                                            type === "basic" && "bg-blue-100 text-blue-600",
                                            type === "standard" && "bg-green-100 text-green-600",
                                            type === "premium" && "bg-purple-100 text-purple-600",
                                            type === "spotlight" && "bg-yellow-100 text-yellow-600",
                                        )}>
                                            {type === "basic" && <Zap className="h-6 w-6" />}
                                            {type === "standard" && <Star className="h-6 w-6" />}
                                            {type === "premium" && <Crown className="h-6 w-6" />}
                                            {type === "spotlight" && <Sparkles className="h-6 w-6" />}
                                        </div>
                                        <CardTitle className="text-lg">{config.name}</CardTitle>
                                        <CardDescription>{config.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <span className="text-3xl font-bold">{formatPrice(config.price)}</span>
                                            <span className="text-muted-foreground">/{config.duration} days</span>
                                        </div>
                                        <ul className="space-y-2">
                                            {config.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-center text-sm">
                                                    <CheckCircle className="h-4 w-4 mr-2 text-green-500 shrink-0" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        <Button
                                            className="w-full"
                                            variant={type === "standard" ? "default" : "outline"}
                                            onClick={() => {
                                                setSelectedPackage(type);
                                                setCreateDialogOpen(true);
                                            }}
                                            disabled={eligibleProperties.length === 0}
                                        >
                                            Select {config.name}
                                        </Button>
                                    </CardContent>
                                </Card>
                            )
                        )}
                    </div>

                    {/* FAQ or Additional Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Info className="h-5 w-5" />
                                Frequently Asked Questions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-medium">How does featured listing work?</h4>
                                <p className="text-sm text-muted-foreground">
                                    Featured listings appear at the top of search results and on the homepage, giving your property maximum visibility to potential buyers and renters.
                                </p>
                            </div>
                            <Separator />
                            <div>
                                <h4 className="font-medium">Can I cancel my promotion?</h4>
                                <p className="text-sm text-muted-foreground">
                                    Yes, you can cancel an active promotion at any time. However, refunds are only available within the first 24 hours of the promotion period.
                                </p>
                            </div>
                            <Separator />
                            <div>
                                <h4 className="font-medium">What is auto-renew?</h4>
                                <p className="text-sm text-muted-foreground">
                                    Auto-renew automatically extends your promotion when it expires, ensuring uninterrupted visibility for your property.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Cancel Confirmation Dialog */}
            <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Promotion</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to cancel this promotion? This action cannot be undone, and the remaining promotion days will be forfeited.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setAdToCancel(null)}>
                            Keep Promotion
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleCancelPromotion}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Cancel Promotion
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
