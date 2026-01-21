"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { databases } from "@/services/appwrite";
import { Query } from "appwrite";
import type { Properties, UserSavedProperties } from "@/types/appwrite";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { savedPropertiesService } from "@/services/saved-properties";
import { useAuth } from "@/store/auth";
import { toast } from "sonner";
import {
  Bed,
  Bath,
  Car,
  Ruler,
  MapPin,
  Calendar,
  Phone,
  Mail,
  MessageCircle,
  Heart,
  Share2,
  CheckCircle,
  Home,
  Building2,
  Flame,
  Star,
  Eye,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Grid3X3,
  Play,
  Info,
  Landmark,
  Banknote,
  FileText,
  Shield,
  Zap,
  Thermometer,
  Wind,
  Trees,
  Dumbbell,
  Waves,
  BookOpen,
  Sparkles,
  ArrowLeft,
  Printer,
  Flag,
  Calculator,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const DATABASE_ID = "main";
const PROPERTIES_COLLECTION_ID = "properties";

export default function PropertyDetailClient() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { user } = useAuth();

  const [property, setProperty] = useState<Properties | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Properties[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savingProperty, setSavingProperty] = useState(false);

  // Fetch similar properties
  const fetchSimilarProperties = useCallback(async (prop: Properties) => {
    try {
      const queries = [
        Query.notEqual("$id", prop.$id),
        Query.equal("is_published", true),
        Query.limit(4),
      ];

      if (prop.property_type_id) {
        queries.push(Query.equal("property_type_id", prop.property_type_id));
      }
      if (prop.city_id) {
        queries.push(Query.equal("city_id", prop.city_id));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        PROPERTIES_COLLECTION_ID,
        queries
      );

      setSimilarProperties(response.documents as unknown as Properties[]);
    } catch (err) {
      console.error("Error fetching similar properties:", err);
    }
  }, []);

  // Fetch property
  useEffect(() => {
    async function fetchProperty() {
      try {
        setLoading(true);
        setError(null);

        const decodedSlug = decodeURIComponent(slug);

        // Query property by slug
        const response = await databases.listDocuments(
          DATABASE_ID,
          PROPERTIES_COLLECTION_ID,
          [Query.equal("slug", decodedSlug), Query.limit(1)]
        );

        if (response.documents.length > 0) {
          const prop = response.documents[0] as unknown as Properties;
          setProperty(prop);
          fetchSimilarProperties(prop);
        } else {
          // Try to find by reference_id as fallback
          const refResponse = await databases.listDocuments(
            DATABASE_ID,
            PROPERTIES_COLLECTION_ID,
            [Query.equal("reference_id", decodedSlug), Query.limit(1)]
          );

          if (refResponse.documents.length > 0) {
            const prop = refResponse.documents[0] as unknown as Properties;
            setProperty(prop);
            fetchSimilarProperties(prop);
          } else {
            setError("Property not found");
          }
        }
      } catch (err) {
        console.error("Error fetching property:", err);
        setError("Failed to load property details");
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchProperty();
    }
  }, [slug, fetchSimilarProperties]);

  // Check if property is saved
  useEffect(() => {
    const checkIfSaved = async () => {
      if (!user || !property) return;
      try {
        const result = await savedPropertiesService.getUserSavedProperties(user.$id);
        const saved = result.savedProperties.some((sp: UserSavedProperties) => sp.property_id === property.$id);
        setIsSaved(saved);
      } catch (err) {
        console.error("Error checking saved status:", err);
      }
    };
    checkIfSaved();
  }, [user, property]);

  // Handle save toggle
  const handleSaveToggle = async () => {
    if (!user) {
      toast.error("Please sign in to save properties");
      return;
    }
    if (!property) return;

    setSavingProperty(true);
    try {
      if (isSaved) {
        const result = await savedPropertiesService.getUserSavedProperties(user.$id);
        const savedProperty = result.savedProperties.find((sp: UserSavedProperties) => sp.property_id === property.$id);
        if (savedProperty) {
          await savedPropertiesService.delete(savedProperty.$id);
          setIsSaved(false);
          toast.success("Property removed from saved");
        }
      } else {
        await savedPropertiesService.saveProperty({
          user_id: user.$id,
          property_id: property.$id,
        });
        setIsSaved(true);
        toast.success("Property saved successfully");
      }
    } catch (err) {
      console.error("Error toggling save:", err);
      toast.error("Failed to update saved property");
    } finally {
      setSavingProperty(false);
    }
  };

  // Handle share
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: property?.title,
          text: `Check out this property: ${property?.title}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  // Get all images
  const getAllImages = useCallback(() => {
    if (!property) return [];
    const images: string[] = [];

    if (property.main_image_url) images.push(property.main_image_url);
    if (property.cover_image_url && property.cover_image_url !== property.main_image_url) {
      images.push(property.cover_image_url);
    }

    return images.length > 0 ? images : ["/placeholder-property.jpg"];
  }, [property]);

  const images = getAllImages();

  // Format helpers
  const formatPrice = (price: number, currency: string = "PKR") => {
    if (currency === "PKR") {
      if (price >= 10000000) {
        return `PKR ${(price / 10000000).toFixed(2)} Crore`;
      } else if (price >= 100000) {
        return `PKR ${(price / 100000).toFixed(2)} Lac`;
      }
    }
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatArea = (area: number | null | undefined, unit: string = "sqft") => {
    if (!area) return "N/A";
    return `${area.toLocaleString()} ${unit}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <Skeleton className="h-10 w-32 mb-6" />
          <div className="grid grid-cols-4 gap-2 mb-8">
            <Skeleton className="col-span-4 md:col-span-2 md:row-span-2 aspect-[4/3] rounded-xl" />
            <Skeleton className="hidden md:block aspect-[4/3] rounded-xl" />
            <Skeleton className="hidden md:block aspect-[4/3] rounded-xl" />
            <Skeleton className="hidden md:block aspect-[4/3] rounded-xl" />
            <Skeleton className="hidden md:block aspect-[4/3] rounded-xl" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div>
              <Skeleton className="h-96 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Home className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Property Not Found</h1>
          <p className="text-muted-foreground max-w-md">
            The property you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button onClick={() => router.push("/properties")} className="rounded-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Browse Properties
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Full Screen Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 z-50 bg-black">
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() => setShowGallery(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          <div className="absolute top-4 left-4 z-10">
            <span className="text-white text-lg font-medium">
              {activeImageIndex + 1} / {images.length}
            </span>
          </div>

          <div className="h-full flex items-center justify-center p-4">
            <Button
              size="icon"
              variant="ghost"
              className="absolute left-4 text-white hover:bg-white/20"
              onClick={() => setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            <div className="relative w-full max-w-5xl aspect-video">
              <Image
                src={images[activeImageIndex]}
                alt={`${property.title} - Image ${activeImageIndex + 1}`}
                fill
                className="object-contain"
              />
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="absolute right-4 text-white hover:bg-white/20"
              onClick={() => setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>

          {/* Thumbnails */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 overflow-x-auto max-w-full px-4">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${idx === activeImageIndex ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="container mx-auto max-w-7xl px-4 py-6">
        {/* Back Button */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to listings
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-8">
          <div className="grid grid-cols-4 gap-2 rounded-2xl overflow-hidden">
            {/* Main Image */}
            <div
              className="col-span-4 md:col-span-2 md:row-span-2 relative aspect-[4/3] cursor-pointer group"
              onClick={() => setShowGallery(true)}
            >
              <Image
                src={images[0]}
                alt={property.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {property.is_featured && (
                  <Badge className="bg-primary text-primary-foreground gap-1">
                    <Star className="h-3 w-3" />
                    Featured
                  </Badge>
                )}
                {property.is_verified && (
                  <Badge className="bg-primary text-primary-foreground gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
                {property.is_hot_deal && (
                  <Badge className="bg-destructive text-destructive-foreground gap-1">
                    <Flame className="h-3 w-3" />
                    Hot Deal
                  </Badge>
                )}
                {property.is_urgent_sale && (
                  <Badge variant="outline" className="bg-orange-500 text-white border-orange-500">
                    Urgent Sale
                  </Badge>
                )}
              </div>

              <div className="absolute bottom-4 left-4">
                <Button variant="secondary" size="sm" className="gap-2">
                  <Grid3X3 className="h-4 w-4" />
                  View all {images.length} photos
                </Button>
              </div>
            </div>

            {/* Secondary Images */}
            {images.slice(1, 5).map((img, idx) => (
              <div
                key={idx}
                className="hidden md:block relative aspect-[4/3] cursor-pointer group"
                onClick={() => {
                  setActiveImageIndex(idx + 1);
                  setShowGallery(true);
                }}
              >
                <Image
                  src={img}
                  alt={`${property.title} - Image ${idx + 2}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

                {idx === 3 && images.length > 5 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-xl font-bold">+{images.length - 5}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Video Button */}
          {(property.video_url || property.youtube_video_id) && (
            <div className="mt-4 flex gap-2">
              <Button variant="outline" className="gap-2">
                <Play className="h-4 w-4" />
                Watch Video Tour
              </Button>
              {property.virtual_tour_url && (
                <Button variant="outline" className="gap-2">
                  <Maximize2 className="h-4 w-4" />
                  Virtual Tour
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Price Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {property.listing_type?.name && (
                    <Badge variant="outline" className="text-primary border-primary">
                      For {property.listing_type.name}
                    </Badge>
                  )}
                  {property.property_type?.name && (
                    <Badge variant="secondary">{property.property_type.name}</Badge>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  {property.title}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>
                    {[
                      property.address,
                      property.location?.name,
                      property.city?.name,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </div>
              </div>

              <div className="text-left md:text-right">
                <p className="text-3xl md:text-4xl font-bold text-primary">
                  {formatPrice(property.price, property.currency)}
                </p>
                {property.price_negotiable && (
                  <p className="text-sm text-muted-foreground">Negotiable</p>
                )}
                {property.listing_type?.name === "Rent" && (
                  <p className="text-sm text-muted-foreground">per month</p>
                )}
              </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="flex flex-wrap gap-6 p-4 bg-card rounded-xl border border-border">
              {property.bedrooms !== null && property.bedrooms !== undefined && (
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Bed className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{property.bedrooms}</p>
                    <p className="text-xs text-muted-foreground">Beds</p>
                  </div>
                </div>
              )}
              {property.bathrooms !== null && property.bathrooms !== undefined && (
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Bath className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{property.bathrooms}</p>
                    <p className="text-xs text-muted-foreground">Baths</p>
                  </div>
                </div>
              )}
              {property.total_area && (
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Ruler className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">
                      {property.total_area.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">{property.area_unit || "sqft"}</p>
                  </div>
                </div>
              )}
              {property.parking_spaces && property.parking_spaces > 0 && (
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Car className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{property.parking_spaces}</p>
                    <p className="text-xs text-muted-foreground">Parking</p>
                  </div>
                </div>
              )}
              {property.year_built && (
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{property.year_built}</p>
                    <p className="text-xs text-muted-foreground">Built</p>
                  </div>
                </div>
              )}
            </div>

            {/* Meta Info Bar */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{property.view_count || 0} views</span>
              </div>
              {property.reference_id && (
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>Ref: {property.reference_id}</span>
                </div>
              )}
              {property.published_at && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Listed {formatDate(property.published_at)}</span>
                </div>
              )}
            </div>

            {/* Tabs for Details */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger
                  value="overview"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="features"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Features
                </TabsTrigger>
                <TabsTrigger
                  value="location"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Location
                </TabsTrigger>
                <TabsTrigger
                  value="pricing"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Pricing
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6 pt-6">
                {(property.description || property.short_description) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Info className="h-5 w-5 text-primary" />
                        Description
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                        {property.description || property.short_description}
                      </p>
                      {property.marketing_tagline && (
                        <p className="mt-4 text-lg font-medium text-primary italic border-l-4 border-primary pl-4">
                          &quot;{property.marketing_tagline}&quot;
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      Property Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <DetailItem label="Property Type" value={property.property_type?.name} />
                      <DetailItem label="Listing Type" value={property.listing_type?.name} />
                      <DetailItem label="Status" value={property.property_status?.name} />
                      <DetailItem label="Purpose" value={property.purpose} />
                      <DetailItem label="Condition" value={property.condition_type} />
                      <DetailItem label="Furnished" value={property.furnished_status} />
                      <DetailItem label="Ownership" value={property.ownership_type} />
                      <DetailItem label="Total Area" value={formatArea(property.total_area, property.area_unit)} />
                      <DetailItem label="Covered Area" value={formatArea(property.covered_area, property.area_unit)} />
                      <DetailItem label="Floors" value={property.floors?.toString()} />
                      <DetailItem label="Floor Number" value={property.floor_number?.toString()} />
                      <DetailItem label="Facing" value={property.facing} />
                      <DetailItem label="Year Built" value={property.year_built?.toString()} />
                      <DetailItem label="Kitchens" value={property.kitchens?.toString()} />
                      <DetailItem label="Balconies" value={property.balconies?.toString()} />
                      {property.available_from && (
                        <DetailItem label="Available From" value={formatDate(property.available_from)} />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Features Tab */}
              <TabsContent value="features" className="space-y-6 pt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Amenities & Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {property.has_basement && <FeatureBadge icon={Home} label="Basement" />}
                      {property.has_elevator && <FeatureBadge icon={TrendingUp} label="Elevator" />}
                      {property.has_pool && <FeatureBadge icon={Waves} label="Swimming Pool" />}
                      {property.has_garden && <FeatureBadge icon={Trees} label="Garden" />}
                      {property.has_gym && <FeatureBadge icon={Dumbbell} label="Gym" />}
                      {property.has_terrace && <FeatureBadge icon={Home} label="Terrace" />}
                      {property.has_study_room && <FeatureBadge icon={BookOpen} label="Study Room" />}
                      {property.has_prayer_room && <FeatureBadge icon={Home} label="Prayer Room" />}
                      {property.has_powder_room && <FeatureBadge icon={Home} label="Powder Room" />}
                      {property.has_central_heating && <FeatureBadge icon={Thermometer} label="Central Heating" />}
                      {property.has_central_ac && <FeatureBadge icon={Wind} label="Central AC" />}
                      {property.covered_parking && <FeatureBadge icon={Car} label="Covered Parking" />}
                      {property.is_corner && <FeatureBadge icon={Home} label="Corner Property" />}
                      {property.is_west_open && <FeatureBadge icon={Home} label="West Open" />}
                      {property.clear_title && <FeatureBadge icon={Shield} label="Clear Title" />}
                      {property.bank_loan_available && <FeatureBadge icon={Landmark} label="Bank Loan Available" />}
                      {property.installment_available && <FeatureBadge icon={Calculator} label="Installment Available" />}
                      {property.servant_quarters && property.servant_quarters > 0 && (
                        <FeatureBadge icon={Home} label={`${property.servant_quarters} Servant Quarters`} />
                      )}
                      {property.laundry_rooms && property.laundry_rooms > 0 && (
                        <FeatureBadge icon={Home} label={`${property.laundry_rooms} Laundry Rooms`} />
                      )}
                      {property.store_rooms && property.store_rooms > 0 && (
                        <FeatureBadge icon={Home} label={`${property.store_rooms} Store Rooms`} />
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      Utilities & Systems
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <DetailItem label="Cooling System" value={property.cooling_system} />
                      <DetailItem label="Heating System" value={property.heating_system} />
                      <DetailItem label="Flooring Type" value={property.flooring_type} />
                      <DetailItem label="Electricity Backup" value={property.electricity_backup} />
                      <DetailItem label="Water Supply" value={property.water_supply} />
                      <DetailItem label="Energy Rating" value={property.energy_rating} />
                      <DetailItem label="View Type" value={property.view_type} />
                      <DetailItem label="Pet Policy" value={property.pet_policy} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Location Tab */}
              <TabsContent value="location" className="space-y-6 pt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Location Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <DetailItem label="Building" value={property.building_name} />
                      <DetailItem label="Street" value={property.street_address} />
                      <DetailItem label="Sector" value={property.sector} />
                      <DetailItem label="Block" value={property.block} />
                      <DetailItem label="Area" value={property.location?.name} />
                      <DetailItem label="City" value={property.city?.name} />
                      {property.road_width_feet && (
                        <DetailItem label="Road Width" value={`${property.road_width_feet} ft`} />
                      )}
                      {property.distance_to_city_center_km && (
                        <DetailItem label="Distance to City Center" value={`${property.distance_to_city_center_km} km`} />
                      )}
                      {property.distance_to_airport_km && (
                        <DetailItem label="Distance to Airport" value={`${property.distance_to_airport_km} km`} />
                      )}
                    </div>
                  </CardContent>
                </Card>

                {(property.nearby_schools || property.nearby_hospitals || property.nearby_shopping || property.nearby_transport || property.nearby_mosques) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Nearby Places</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {property.nearby_schools && (
                        <div>
                          <p className="font-medium text-foreground mb-1">Schools</p>
                          <p className="text-muted-foreground">{property.nearby_schools}</p>
                        </div>
                      )}
                      {property.nearby_hospitals && (
                        <div>
                          <p className="font-medium text-foreground mb-1">Hospitals</p>
                          <p className="text-muted-foreground">{property.nearby_hospitals}</p>
                        </div>
                      )}
                      {property.nearby_shopping && (
                        <div>
                          <p className="font-medium text-foreground mb-1">Shopping</p>
                          <p className="text-muted-foreground">{property.nearby_shopping}</p>
                        </div>
                      )}
                      {property.nearby_transport && (
                        <div>
                          <p className="font-medium text-foreground mb-1">Transport</p>
                          <p className="text-muted-foreground">{property.nearby_transport}</p>
                        </div>
                      )}
                      {property.nearby_mosques && (
                        <div>
                          <p className="font-medium text-foreground mb-1">Mosques</p>
                          <p className="text-muted-foreground">{property.nearby_mosques}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Pricing Tab */}
              <TabsContent value="pricing" className="space-y-6 pt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Banknote className="h-5 w-5 text-primary" />
                      Price Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-border">
                      <span className="text-foreground font-medium">Asking Price</span>
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(property.price, property.currency)}
                      </span>
                    </div>

                    {property.total_area && property.total_area > 0 && (
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Price per {property.area_unit || 'sqft'}</span>
                        <span className="text-foreground font-medium">
                          {formatPrice(Math.round(property.price / property.total_area), property.currency)}
                        </span>
                      </div>
                    )}

                    {property.security_deposit && (
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Security Deposit</span>
                        <span className="text-foreground font-medium">
                          {formatPrice(property.security_deposit, property.currency)}
                        </span>
                      </div>
                    )}

                    {property.maintenance_charges && property.maintenance_charges > 0 && (
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Maintenance Charges</span>
                        <span className="text-foreground font-medium">
                          {formatPrice(property.maintenance_charges, property.currency)}
                        </span>
                      </div>
                    )}

                    {property.service_charges_monthly && (
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Service Charges (Monthly)</span>
                        <span className="text-foreground font-medium">
                          {formatPrice(property.service_charges_monthly, property.currency)}
                        </span>
                      </div>
                    )}

                    {property.hoa_fees_monthly && (
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">HOA Fees (Monthly)</span>
                        <span className="text-foreground font-medium">
                          {formatPrice(property.hoa_fees_monthly, property.currency)}
                        </span>
                      </div>
                    )}

                    {property.property_tax_annual && (
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Property Tax (Annual)</span>
                        <span className="text-foreground font-medium">
                          {formatPrice(property.property_tax_annual, property.currency)}
                        </span>
                      </div>
                    )}

                    {property.installment_available && (
                      <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                        <p className="font-semibold text-primary mb-2">💳 Installment Plan Available</p>
                        {property.down_payment_percentage && (
                          <p className="text-sm text-muted-foreground">
                            Down Payment: {property.down_payment_percentage}%
                          </p>
                        )}
                        {property.installment_months && (
                          <p className="text-sm text-muted-foreground">
                            Duration: {property.installment_months} months
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-4 border-2 border-primary/20">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {property.contact_person_name || "Property Agent"}
                    </p>
                    <p className="text-sm text-muted-foreground">Property Consultant</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  {property.contact_phone && (
                    <Button variant="outline" className="w-full justify-start gap-3 h-12" asChild>
                      <a href={`tel:${property.contact_phone}`}>
                        <Phone className="h-5 w-5 text-primary" />
                        <span>{property.contact_phone}</span>
                      </a>
                    </Button>
                  )}

                  {property.contact_email && (
                    <Button variant="outline" className="w-full justify-start gap-3 h-12" asChild>
                      <a href={`mailto:${property.contact_email}`}>
                        <Mail className="h-5 w-5 text-primary" />
                        <span className="truncate">{property.contact_email}</span>
                      </a>
                    </Button>
                  )}

                  {property.whatsapp_number && (
                    <Button className="w-full gap-3 h-12 bg-green-600 hover:bg-green-700" asChild>
                      <a
                        href={`https://wa.me/${property.whatsapp_number.replace(/\D/g, "")}?text=Hi, I'm interested in ${property.title}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="h-5 w-5" />
                        WhatsApp
                      </a>
                    </Button>
                  )}
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={isSaved ? "default" : "outline"}
                    className="gap-2"
                    onClick={handleSaveToggle}
                    disabled={savingProperty}
                  >
                    <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                    {isSaved ? "Saved" : "Save"}
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>

                <Button className="w-full h-12" size="lg">
                  <Calendar className="mr-2 h-5 w-5" />
                  Schedule a Visit
                </Button>

                <Button variant="outline" className="w-full gap-2">
                  <Flag className="h-4 w-4" />
                  Report Listing
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Shield className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-800 mb-1">Safety Tips</p>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• Verify the property documents</li>
                      <li>• Meet the agent in person</li>
                      <li>• Never pay money upfront</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Similar Properties</h2>
              <Button variant="outline" asChild>
                <Link href="/properties">View All</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProperties.map((prop) => (
                <Link key={prop.$id} href={`/p/${prop.slug || prop.reference_id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={prop.main_image_url || prop.cover_image_url || "/placeholder-property.jpg"}
                        alt={prop.title}
                        fill
                        className="object-cover"
                      />
                      {prop.is_featured && (
                        <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <p className="text-lg font-bold text-primary mb-1">
                        {formatPrice(prop.price, prop.currency)}
                      </p>
                      <h3 className="font-medium text-foreground line-clamp-1 mb-1">
                        {prop.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-1 mb-3">
                        {prop.location?.name}, {prop.city?.name}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {prop.bedrooms && (
                          <span className="flex items-center gap-1">
                            <Bed className="h-4 w-4" />
                            {prop.bedrooms}
                          </span>
                        )}
                        {prop.bathrooms && (
                          <span className="flex items-center gap-1">
                            <Bath className="h-4 w-4" />
                            {prop.bathrooms}
                          </span>
                        )}
                        {prop.total_area && (
                          <span className="flex items-center gap-1">
                            <Ruler className="h-4 w-4" />
                            {prop.total_area}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="py-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground capitalize">{value}</p>
    </div>
  );
}

function FeatureBadge({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
      <Icon className="h-4 w-4 text-primary" />
      <span className="text-sm text-foreground">{label}</span>
    </div>
  );
}
