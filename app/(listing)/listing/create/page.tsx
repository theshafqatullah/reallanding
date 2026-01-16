"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useListingFormStore } from "@/store/listing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRightIcon, MapPinIcon, DollarSignIcon, HomeIcon, Loader2Icon } from "lucide-react";
import { lookupsService, type Country, type State, type City, type Location, type PropertyType, type ListingType, type PropertyStatus } from "@/services/lookups";
import { toast } from "sonner";

const currencies = [
  { code: "PKR", name: "Pakistani Rupee" },
  { code: "USD", name: "US Dollar" },
  { code: "AED", name: "UAE Dirham" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "SAR", name: "Saudi Riyal" },
];

export default function CreateListingBasicInfoPage() {
  const router = useRouter();
  const { basicInfo, updateBasicInfo, setCurrentStep } = useListingFormStore();

  // Loading states
  const [isLoadingLookups, setIsLoadingLookups] = useState(true);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);

  // Lookup data
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [listingTypes, setListingTypes] = useState<ListingType[]>([]);
  const [propertyStatuses, setPropertyStatuses] = useState<PropertyStatus[]>([]);

  // Fetch initial lookup data
  useEffect(() => {
    const fetchLookups = async () => {
      try {
        setIsLoadingLookups(true);
        const data = await lookupsService.getPropertyFormLookups();
        setCountries(data.countries);
        setPropertyTypes(data.propertyTypes);
        setListingTypes(data.listingTypes);
        setPropertyStatuses(data.propertyStatuses);
      } catch (error) {
        console.error("Error fetching lookups:", error);
        toast.error("Failed to load form data. Please refresh the page.");
      } finally {
        setIsLoadingLookups(false);
      }
    };

    fetchLookups();
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    const fetchStates = async () => {
      if (!basicInfo.country_id) {
        setStates([]);
        setCities([]);
        setLocations([]);
        return;
      }

      try {
        setIsLoadingStates(true);
        const data = await lookupsService.getStatesByCountry(basicInfo.country_id);
        setStates(data);
        // Clear dependent selections
        updateBasicInfo({ state_id: "", city_id: "", location_id: "" });
        setCities([]);
        setLocations([]);
      } catch (error) {
        console.error("Error fetching states:", error);
        toast.error("Failed to load states");
      } finally {
        setIsLoadingStates(false);
      }
    };

    fetchStates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basicInfo.country_id]);

  // Fetch cities when state changes
  useEffect(() => {
    const fetchCities = async () => {
      if (!basicInfo.state_id) {
        setCities([]);
        setLocations([]);
        return;
      }

      try {
        setIsLoadingCities(true);
        const data = await lookupsService.getCitiesByState(basicInfo.state_id);
        setCities(data);
        // Clear dependent selections
        updateBasicInfo({ city_id: "", location_id: "" });
        setLocations([]);
      } catch (error) {
        console.error("Error fetching cities:", error);
        toast.error("Failed to load cities");
      } finally {
        setIsLoadingCities(false);
      }
    };

    fetchCities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basicInfo.state_id]);

  // Fetch locations when city changes
  useEffect(() => {
    const fetchLocations = async () => {
      if (!basicInfo.city_id) {
        setLocations([]);
        return;
      }

      try {
        setIsLoadingLocations(true);
        const data = await lookupsService.getLocationsByCity(basicInfo.city_id);
        setLocations(data);
        // Clear dependent selection
        updateBasicInfo({ location_id: "" });
      } catch (error) {
        console.error("Error fetching locations:", error);
        toast.error("Failed to load locations");
      } finally {
        setIsLoadingLocations(false);
      }
    };

    fetchLocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basicInfo.city_id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!basicInfo.title || !basicInfo.property_type_id || !basicInfo.listing_type_id || !basicInfo.property_status_id) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!basicInfo.price || basicInfo.price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (!basicInfo.location_id) {
      toast.error("Please select a location");
      return;
    }

    setCurrentStep(2);
    router.push("/listing/create/details");
  };

  if (isLoadingLookups) {
    return (
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-72 mt-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-72 mt-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Property Type Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HomeIcon className="h-5 w-5 text-primary" />
            Property Information
          </CardTitle>
          <CardDescription>
            Select the type of property you want to list
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="property_type">Property Type *</Label>
              <Select
                value={basicInfo.property_type_id}
                onValueChange={(value) => updateBasicInfo({ property_type_id: value })}
              >
                <SelectTrigger id="property_type">
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type.$id} value={type.$id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="listing_type">Listing Type *</Label>
              <Select
                value={basicInfo.listing_type_id}
                onValueChange={(value) => updateBasicInfo({ listing_type_id: value })}
              >
                <SelectTrigger id="listing_type">
                  <SelectValue placeholder="Select listing type" />
                </SelectTrigger>
                <SelectContent>
                  {listingTypes.map((type) => (
                    <SelectItem key={type.$id} value={type.$id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="property_status">Property Status *</Label>
              <Select
                value={basicInfo.property_status_id}
                onValueChange={(value) => updateBasicInfo({ property_status_id: value })}
              >
                <SelectTrigger id="property_status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {propertyStatuses.map((status) => (
                    <SelectItem key={status.$id} value={status.$id}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="title">Property Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Beautiful 3 Bedroom House in DHA Phase 5"
              value={basicInfo.title}
              onChange={(e) => updateBasicInfo({ title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your property in detail..."
              rows={5}
              value={basicInfo.description}
              onChange={(e) => updateBasicInfo({ description: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Pricing Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSignIcon className="h-5 w-5 text-primary" />
            Pricing
          </CardTitle>
          <CardDescription>
            Set the price for your property
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                placeholder="Enter price"
                value={basicInfo.price || ""}
                onChange={(e) => updateBasicInfo({ price: Number(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={basicInfo.currency}
                onValueChange={(value) => updateBasicInfo({ currency: value })}
              >
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="price_negotiable"
              checked={basicInfo.price_negotiable}
              onCheckedChange={(checked) => updateBasicInfo({ price_negotiable: checked })}
            />
            <Label htmlFor="price_negotiable">Price is negotiable</Label>
          </div>
        </CardContent>
      </Card>

      {/* Location Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPinIcon className="h-5 w-5 text-primary" />
            Location
          </CardTitle>
          <CardDescription>
            Where is your property located?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cascading Location Selects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Select
                value={basicInfo.country_id}
                onValueChange={(value) => updateBasicInfo({ country_id: value })}
              >
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.$id} value={country.$id}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State/Province *</Label>
              <Select
                value={basicInfo.state_id}
                onValueChange={(value) => updateBasicInfo({ state_id: value })}
                disabled={!basicInfo.country_id || isLoadingStates}
              >
                <SelectTrigger id="state">
                  {isLoadingStates ? (
                    <div className="flex items-center gap-2">
                      <Loader2Icon className="h-4 w-4 animate-spin" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    <SelectValue placeholder="Select state" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state.$id} value={state.$id}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Select
                value={basicInfo.city_id}
                onValueChange={(value) => updateBasicInfo({ city_id: value })}
                disabled={!basicInfo.state_id || isLoadingCities}
              >
                <SelectTrigger id="city">
                  {isLoadingCities ? (
                    <div className="flex items-center gap-2">
                      <Loader2Icon className="h-4 w-4 animate-spin" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    <SelectValue placeholder="Select city" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.$id} value={city.$id}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Area/Society *</Label>
              <Select
                value={basicInfo.location_id}
                onValueChange={(value) => updateBasicInfo({ location_id: value })}
                disabled={!basicInfo.city_id || isLoadingLocations}
              >
                <SelectTrigger id="location">
                  {isLoadingLocations ? (
                    <div className="flex items-center gap-2">
                      <Loader2Icon className="h-4 w-4 animate-spin" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    <SelectValue placeholder="Select area/society" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.$id} value={location.$id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Address Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="address">Full Address</Label>
              <Input
                id="address"
                placeholder="Enter full address"
                value={basicInfo.address}
                onChange={(e) => updateBasicInfo({ address: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="street_address">Street Address</Label>
              <Input
                id="street_address"
                placeholder="Street name and number"
                value={basicInfo.street_address}
                onChange={(e) => updateBasicInfo({ street_address: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="building_name">Building Name</Label>
              <Input
                id="building_name"
                placeholder="Building or society name"
                value={basicInfo.building_name}
                onChange={(e) => updateBasicInfo({ building_name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit_number">Unit Number</Label>
              <Input
                id="unit_number"
                placeholder="Apartment/unit number"
                value={basicInfo.unit_number}
                onChange={(e) => updateBasicInfo({ unit_number: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sector">Sector</Label>
              <Input
                id="sector"
                placeholder="Sector (e.g., F-7)"
                value={basicInfo.sector}
                onChange={(e) => updateBasicInfo({ sector: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="block">Block</Label>
              <Input
                id="block"
                placeholder="Block (e.g., Block A)"
                value={basicInfo.block}
                onChange={(e) => updateBasicInfo({ block: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="plot_number">Plot Number</Label>
              <Input
                id="plot_number"
                placeholder="Plot number"
                value={basicInfo.plot_number}
                onChange={(e) => updateBasicInfo({ plot_number: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-end">
        <Button type="submit" size="lg">
          Continue to Details
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
