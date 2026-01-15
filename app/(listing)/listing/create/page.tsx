"use client";

import React from "react";
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
import { ArrowRightIcon, MapPinIcon, DollarSignIcon, HomeIcon } from "lucide-react";

// TODO: Fetch these from database
const propertyTypes = [
  { id: "1", name: "House" },
  { id: "2", name: "Apartment" },
  { id: "3", name: "Villa" },
  { id: "4", name: "Plot" },
  { id: "5", name: "Commercial" },
  { id: "6", name: "Office" },
];

const listingTypes = [
  { id: "1", name: "For Sale" },
  { id: "2", name: "For Rent" },
  { id: "3", name: "For Lease" },
];

const propertyStatuses = [
  { id: "1", name: "Available" },
  { id: "2", name: "Under Offer" },
  { id: "3", name: "Sold" },
  { id: "4", name: "Rented" },
];

const currencies = [
  { code: "PKR", name: "Pakistani Rupee" },
  { code: "USD", name: "US Dollar" },
  { code: "AED", name: "UAE Dirham" },
];

export default function CreateListingBasicInfoPage() {
  const router = useRouter();
  const { basicInfo, updateBasicInfo, setCurrentStep } = useListingFormStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!basicInfo.title || !basicInfo.property_type_id || !basicInfo.listing_type_id) {
      return;
    }

    setCurrentStep(2);
    router.push("/listing/create/details");
  };

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
                    <SelectItem key={type.id} value={type.id}>
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
                    <SelectItem key={type.id} value={type.id}>
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
                    <SelectItem key={status.id} value={status.id}>
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
