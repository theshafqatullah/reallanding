"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { databases } from "@/services/appwrite";
import { Query } from "appwrite";
import type { Properties } from "@/types/appwrite";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
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
} from "lucide-react";
import Image from "next/image";

const DATABASE_ID = "main";
const PROPERTIES_COLLECTION_ID = "properties";

export default function PropertyDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [property, setProperty] = useState<Properties | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          setProperty(response.documents[0] as unknown as Properties);
        } else {
          // Try to find by reference_id as fallback
          const refResponse = await databases.listDocuments(
            DATABASE_ID,
            PROPERTIES_COLLECTION_ID,
            [Query.equal("reference_id", decodedSlug), Query.limit(1)]
          );

          if (refResponse.documents.length > 0) {
            setProperty(refResponse.documents[0] as unknown as Properties);
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
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Property Not Found</h1>
        <p className="text-gray-600">
          The property you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
      </div>
    );
  }

  const formatPrice = (price: number, currency: string = "PKR") => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatArea = (area: number | null, unit: string = "sqft") => {
    if (!area) return "N/A";
    return `${area.toLocaleString()} ${unit}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Property Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {property.is_featured && (
                <Badge variant="default" className="gap-1">
                  <Star className="h-3 w-3" />
                  Featured
                </Badge>
              )}
              {property.is_verified && (
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Verified
                </Badge>
              )}
              {property.is_hot_deal && (
                <Badge variant="destructive" className="gap-1">
                  <Flame className="h-3 w-3" />
                  Hot Deal
                </Badge>
              )}
              {property.is_urgent_sale && (
                <Badge variant="outline" className="text-orange-600 border-orange-600">
                  Urgent Sale
                </Badge>
              )}
              {property.is_new_listing && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  New Listing
                </Badge>
              )}
              {property.is_premium && (
                <Badge variant="secondary">Premium</Badge>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {property.title}
            </h1>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
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

          <div className="text-right">
            <p className="text-3xl font-bold text-primary">
              {formatPrice(property.price, property.currency)}
            </p>
            {property.price_negotiable && (
              <p className="text-sm text-gray-500">Negotiable</p>
            )}
            {property.listing_type?.name && (
              <Badge variant="outline" className="mt-2">
                For {property.listing_type.name}
              </Badge>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex flex-wrap gap-4 text-gray-600">
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{property.view_count} views</span>
          </div>
          {property.reference_id && (
            <div className="flex items-center gap-1">
              <span className="text-sm">Ref: {property.reference_id}</span>
            </div>
          )}
          {property.published_at && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>
                Listed {new Date(property.published_at).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Image */}
      <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden mb-8 bg-gray-100">
        {property.main_image_url || property.cover_image_url ? (
          <Image
            src={property.main_image_url || property.cover_image_url || ""}
            alt={property.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Home className="h-24 w-24 text-gray-300" />
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button size="icon" variant="secondary" className="rounded-full">
            <Heart className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="secondary" className="rounded-full">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Property Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Features */}
          <Card>
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {property.bedrooms !== null && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Bed className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{property.bedrooms}</p>
                      <p className="text-sm text-gray-500">Bedrooms</p>
                    </div>
                  </div>
                )}
                {property.bathrooms !== null && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Bath className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{property.bathrooms}</p>
                      <p className="text-sm text-gray-500">Bathrooms</p>
                    </div>
                  </div>
                )}
                {property.total_area && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Ruler className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {property.total_area.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">{property.area_unit}</p>
                    </div>
                  </div>
                )}
                {property.parking_spaces > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Car className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{property.parking_spaces}</p>
                      <p className="text-sm text-gray-500">Parking</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {(property.description || property.short_description) && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {property.description || property.short_description}
                </p>
                {property.marketing_tagline && (
                  <p className="mt-4 text-lg font-medium text-primary italic">
                    &quot;{property.marketing_tagline}&quot;
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailRow label="Property Type" value={property.property_type?.name} />
                <DetailRow label="Listing Type" value={property.listing_type?.name} />
                <DetailRow label="Status" value={property.property_status?.name} />
                <DetailRow label="Purpose" value={property.purpose} />
                <DetailRow label="Condition" value={property.condition_type} />
                <DetailRow label="Furnished Status" value={property.furnished_status} />
                <DetailRow label="Ownership Type" value={property.ownership_type} />
                <DetailRow
                  label="Total Area"
                  value={formatArea(property.total_area, property.area_unit)}
                />
                <DetailRow
                  label="Covered Area"
                  value={formatArea(property.covered_area, property.area_unit)}
                />
                <DetailRow label="Floors" value={property.floors?.toString()} />
                <DetailRow label="Floor Number" value={property.floor_number?.toString()} />
                <DetailRow label="Facing" value={property.facing} />
                <DetailRow label="Year Built" value={property.year_built?.toString()} />
                <DetailRow label="Kitchens" value={property.kitchens?.toString()} />
                <DetailRow label="Balconies" value={property.balconies?.toString()} />
                {property.available_from && (
                  <DetailRow
                    label="Available From"
                    value={new Date(property.available_from).toLocaleDateString()}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Amenities & Features */}
          <Card>
            <CardHeader>
              <CardTitle>Amenities & Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.has_basement && <FeatureBadge label="Basement" />}
                {property.has_elevator && <FeatureBadge label="Elevator" />}
                {property.has_pool && <FeatureBadge label="Swimming Pool" />}
                {property.has_garden && <FeatureBadge label="Garden" />}
                {property.has_gym && <FeatureBadge label="Gym" />}
                {property.has_terrace && <FeatureBadge label="Terrace" />}
                {property.has_study_room && <FeatureBadge label="Study Room" />}
                {property.has_prayer_room && <FeatureBadge label="Prayer Room" />}
                {property.has_powder_room && <FeatureBadge label="Powder Room" />}
                {property.has_central_heating && <FeatureBadge label="Central Heating" />}
                {property.has_central_ac && <FeatureBadge label="Central AC" />}
                {property.covered_parking && <FeatureBadge label="Covered Parking" />}
                {property.is_corner && <FeatureBadge label="Corner Property" />}
                {property.is_west_open && <FeatureBadge label="West Open" />}
                {property.clear_title && <FeatureBadge label="Clear Title" />}
                {property.bank_loan_available && <FeatureBadge label="Bank Loan Available" />}
                {property.installment_available && <FeatureBadge label="Installment Available" />}
                {property.servant_quarters > 0 && (
                  <FeatureBadge label={`${property.servant_quarters} Servant Quarters`} />
                )}
                {property.laundry_rooms > 0 && (
                  <FeatureBadge label={`${property.laundry_rooms} Laundry Rooms`} />
                )}
                {property.store_rooms > 0 && (
                  <FeatureBadge label={`${property.store_rooms} Store Rooms`} />
                )}
              </div>

              {/* Related Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity, index) => (
                      <Badge key={index} variant="secondary">
                        {amenity.name}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.cooling_system && (
                  <DetailRow label="Cooling System" value={property.cooling_system} />
                )}
                {property.heating_system && (
                  <DetailRow label="Heating System" value={property.heating_system} />
                )}
                {property.flooring_type && (
                  <DetailRow label="Flooring Type" value={property.flooring_type} />
                )}
                {property.electricity_backup && (
                  <DetailRow label="Electricity Backup" value={property.electricity_backup} />
                )}
                {property.water_supply && (
                  <DetailRow label="Water Supply" value={property.water_supply} />
                )}
                {property.energy_rating && (
                  <DetailRow label="Energy Rating" value={property.energy_rating} />
                )}
                {property.view_type && (
                  <DetailRow label="View Type" value={property.view_type} />
                )}
                {property.road_width_feet && (
                  <DetailRow label="Road Width" value={`${property.road_width_feet} ft`} />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Nearby Places */}
          {(property.nearby_schools ||
            property.nearby_hospitals ||
            property.nearby_shopping ||
            property.nearby_transport ||
            property.nearby_mosques) && (
            <Card>
              <CardHeader>
                <CardTitle>Nearby Places</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {property.nearby_schools && (
                  <div>
                    <p className="font-medium text-gray-700">Schools</p>
                    <p className="text-gray-600">{property.nearby_schools}</p>
                  </div>
                )}
                {property.nearby_hospitals && (
                  <div>
                    <p className="font-medium text-gray-700">Hospitals</p>
                    <p className="text-gray-600">{property.nearby_hospitals}</p>
                  </div>
                )}
                {property.nearby_shopping && (
                  <div>
                    <p className="font-medium text-gray-700">Shopping</p>
                    <p className="text-gray-600">{property.nearby_shopping}</p>
                  </div>
                )}
                {property.nearby_transport && (
                  <div>
                    <p className="font-medium text-gray-700">Transport</p>
                    <p className="text-gray-600">{property.nearby_transport}</p>
                  </div>
                )}
                {property.nearby_mosques && (
                  <div>
                    <p className="font-medium text-gray-700">Mosques</p>
                    <p className="text-gray-600">{property.nearby_mosques}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Contact & Pricing */}
        <div className="space-y-6">
          {/* Contact Card */}
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {property.contact_person_name && (
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{property.contact_person_name}</p>
                    <p className="text-sm text-gray-500">Property Contact</p>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {property.contact_phone && (
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Phone className="h-4 w-4" />
                    {property.contact_phone}
                  </Button>
                )}
                {property.contact_email && (
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Mail className="h-4 w-4" />
                    {property.contact_email}
                  </Button>
                )}
                {property.whatsapp_number && (
                  <Button
                    variant="default"
                    className="w-full gap-2 bg-green-600 hover:bg-green-700"
                    asChild
                  >
                    <a
                      href={`https://wa.me/${property.whatsapp_number.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </a>
                  </Button>
                )}
              </div>

              <Separator />

              <Button className="w-full" size="lg">
                Schedule a Visit
              </Button>
            </CardContent>
          </Card>

          {/* Price Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Price Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Price</span>
                <span className="font-bold">
                  {formatPrice(property.price, property.currency)}
                </span>
              </div>
              {property.maintenance_charges > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Maintenance Charges</span>
                  <span>{formatPrice(property.maintenance_charges, property.currency)}</span>
                </div>
              )}
              {property.security_deposit && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Security Deposit</span>
                  <span>{formatPrice(property.security_deposit, property.currency)}</span>
                </div>
              )}
              {property.service_charges_monthly && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Charges (Monthly)</span>
                  <span>
                    {formatPrice(property.service_charges_monthly, property.currency)}
                  </span>
                </div>
              )}
              {property.hoa_fees_monthly && (
                <div className="flex justify-between">
                  <span className="text-gray-600">HOA Fees (Monthly)</span>
                  <span>{formatPrice(property.hoa_fees_monthly, property.currency)}</span>
                </div>
              )}
              {property.property_tax_annual && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Tax (Annual)</span>
                  <span>{formatPrice(property.property_tax_annual, property.currency)}</span>
                </div>
              )}
              {property.installment_available && (
                <>
                  <Separator />
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="font-medium text-green-700">Installment Available</p>
                    {property.down_payment_percentage && (
                      <p className="text-sm text-green-600">
                        Down Payment: {property.down_payment_percentage}%
                      </p>
                    )}
                    {property.installment_months && (
                      <p className="text-sm text-green-600">
                        Duration: {property.installment_months} months
                      </p>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {property.building_name && (
                <p className="text-gray-700">
                  <span className="font-medium">Building:</span> {property.building_name}
                </p>
              )}
              {property.street_address && (
                <p className="text-gray-700">
                  <span className="font-medium">Street:</span> {property.street_address}
                </p>
              )}
              {property.sector && (
                <p className="text-gray-700">
                  <span className="font-medium">Sector:</span> {property.sector}
                </p>
              )}
              {property.block && (
                <p className="text-gray-700">
                  <span className="font-medium">Block:</span> {property.block}
                </p>
              )}
              {property.location?.name && (
                <p className="text-gray-700">
                  <span className="font-medium">Area:</span> {property.location.name}
                </p>
              )}
              {property.city?.name && (
                <p className="text-gray-700">
                  <span className="font-medium">City:</span> {property.city.name}
                </p>
              )}
              {property.distance_to_city_center_km && (
                <p className="text-gray-700">
                  <span className="font-medium">Distance to City Center:</span>{" "}
                  {property.distance_to_city_center_km} km
                </p>
              )}
              {property.distance_to_airport_km && (
                <p className="text-gray-700">
                  <span className="font-medium">Distance to Airport:</span>{" "}
                  {property.distance_to_airport_km} km
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  if (!value) return null;
  return (
    <div className="flex justify-between py-2 border-b border-gray-100">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900 capitalize">{value}</span>
    </div>
  );
}

function FeatureBadge({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  );
}
