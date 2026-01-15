"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useListingFormStore } from "@/store/listing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { 
  ArrowRightIcon, 
  ArrowLeftIcon, 
  BedDoubleIcon, 
  RulerIcon, 
  SparklesIcon,
  WrenchIcon,
  ShieldCheckIcon
} from "lucide-react";

const areaUnits = [
  { value: "sqft", label: "Square Feet" },
  { value: "sqm", label: "Square Meters" },
  { value: "marla", label: "Marla" },
  { value: "kanal", label: "Kanal" },
];

const conditionTypes = [
  { value: "new", label: "Brand New" },
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "needs_renovation", label: "Needs Renovation" },
  { value: "under_construction", label: "Under Construction" },
];

const furnishedStatuses = [
  { value: "unfurnished", label: "Unfurnished" },
  { value: "semi_furnished", label: "Semi-Furnished" },
  { value: "fully_furnished", label: "Fully Furnished" },
];

const facingDirections = [
  { value: "north", label: "North" },
  { value: "south", label: "South" },
  { value: "east", label: "East" },
  { value: "west", label: "West" },
  { value: "north_east", label: "North-East" },
  { value: "north_west", label: "North-West" },
  { value: "south_east", label: "South-East" },
  { value: "south_west", label: "South-West" },
];

const petPolicies = [
  { value: "allowed", label: "Pets Allowed" },
  { value: "not_allowed", label: "No Pets" },
  { value: "negotiable", label: "Negotiable" },
];

const ownershipTypes = [
  { value: "freehold", label: "Freehold" },
  { value: "leasehold", label: "Leasehold" },
  { value: "cooperative", label: "Cooperative" },
];

export default function CreateListingDetailsPage() {
  const router = useRouter();
  const { details, updateDetails, setCurrentStep } = useListingFormStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(3);
    router.push("/listing/create/media");
  };

  const handleBack = () => {
    setCurrentStep(1);
    router.push("/listing/create");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Specifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BedDoubleIcon className="h-5 w-5 text-primary" />
            Basic Specifications
          </CardTitle>
          <CardDescription>
            Enter the basic specifications of your property
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                min="0"
                placeholder="0"
                value={details.bedrooms ?? ""}
                onChange={(e) => updateDetails({ bedrooms: e.target.value ? Number(e.target.value) : null })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                min="0"
                placeholder="0"
                value={details.bathrooms ?? ""}
                onChange={(e) => updateDetails({ bathrooms: e.target.value ? Number(e.target.value) : null })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="kitchens">Kitchens</Label>
              <Input
                id="kitchens"
                type="number"
                min="0"
                placeholder="1"
                value={details.kitchens}
                onChange={(e) => updateDetails({ kitchens: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parking_spaces">Parking Spaces</Label>
              <Input
                id="parking_spaces"
                type="number"
                min="0"
                placeholder="0"
                value={details.parking_spaces}
                onChange={(e) => updateDetails({ parking_spaces: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="balconies">Balconies</Label>
              <Input
                id="balconies"
                type="number"
                min="0"
                placeholder="0"
                value={details.balconies}
                onChange={(e) => updateDetails({ balconies: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="floors">Total Floors</Label>
              <Input
                id="floors"
                type="number"
                min="1"
                placeholder="1"
                value={details.floors}
                onChange={(e) => updateDetails({ floors: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="floor_number">Floor Number</Label>
              <Input
                id="floor_number"
                type="number"
                min="0"
                placeholder="Ground"
                value={details.floor_number ?? ""}
                onChange={(e) => updateDetails({ floor_number: e.target.value ? Number(e.target.value) : null })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year_built">Year Built</Label>
              <Input
                id="year_built"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                placeholder="2020"
                value={details.year_built ?? ""}
                onChange={(e) => updateDetails({ year_built: e.target.value ? Number(e.target.value) : null })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Area & Size */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RulerIcon className="h-5 w-5 text-primary" />
            Area & Size
          </CardTitle>
          <CardDescription>
            Specify the area measurements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="total_area">Total Area</Label>
              <Input
                id="total_area"
                type="number"
                min="0"
                placeholder="Enter total area"
                value={details.total_area ?? ""}
                onChange={(e) => updateDetails({ total_area: e.target.value ? Number(e.target.value) : null })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="covered_area">Covered Area</Label>
              <Input
                id="covered_area"
                type="number"
                min="0"
                placeholder="Enter covered area"
                value={details.covered_area ?? ""}
                onChange={(e) => updateDetails({ covered_area: e.target.value ? Number(e.target.value) : null })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area_unit">Area Unit</Label>
              <Select
                value={details.area_unit}
                onValueChange={(value) => updateDetails({ area_unit: value })}
              >
                <SelectTrigger id="area_unit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {areaUnits.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="facing">Facing Direction</Label>
              <Select
                value={details.facing}
                onValueChange={(value) => updateDetails({ facing: value })}
              >
                <SelectTrigger id="facing">
                  <SelectValue placeholder="Select direction" />
                </SelectTrigger>
                <SelectContent>
                  {facingDirections.map((dir) => (
                    <SelectItem key={dir.value} value={dir.value}>
                      {dir.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="road_width">Road Width (feet)</Label>
              <Input
                id="road_width"
                type="number"
                min="0"
                placeholder="Road width in feet"
                value={details.road_width_feet ?? ""}
                onChange={(e) => updateDetails({ road_width_feet: e.target.value ? Number(e.target.value) : null })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="view_type">View Type</Label>
              <Input
                id="view_type"
                placeholder="e.g., Park View, Sea View"
                value={details.view_type}
                onChange={(e) => updateDetails({ view_type: e.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_corner"
                checked={details.is_corner}
                onCheckedChange={(checked) => updateDetails({ is_corner: checked })}
              />
              <Label htmlFor="is_corner">Corner Property</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_west_open"
                checked={details.is_west_open}
                onCheckedChange={(checked) => updateDetails({ is_west_open: checked })}
              />
              <Label htmlFor="is_west_open">West Open</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <WrenchIcon className="h-5 w-5 text-primary" />
            Property Features
          </CardTitle>
          <CardDescription>
            Select the condition and features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="condition_type">Condition</Label>
              <Select
                value={details.condition_type}
                onValueChange={(value) => updateDetails({ condition_type: value })}
              >
                <SelectTrigger id="condition_type">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {conditionTypes.map((cond) => (
                    <SelectItem key={cond.value} value={cond.value}>
                      {cond.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="furnished_status">Furnished Status</Label>
              <Select
                value={details.furnished_status}
                onValueChange={(value) => updateDetails({ furnished_status: value })}
              >
                <SelectTrigger id="furnished_status">
                  <SelectValue placeholder="Select furnished status" />
                </SelectTrigger>
                <SelectContent>
                  {furnishedStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pet_policy">Pet Policy</Label>
              <Select
                value={details.pet_policy}
                onValueChange={(value) => updateDetails({ pet_policy: value })}
              >
                <SelectTrigger id="pet_policy">
                  <SelectValue placeholder="Select pet policy" />
                </SelectTrigger>
                <SelectContent>
                  {petPolicies.map((policy) => (
                    <SelectItem key={policy.value} value={policy.value}>
                      {policy.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownership_type">Ownership Type</Label>
              <Select
                value={details.ownership_type}
                onValueChange={(value) => updateDetails({ ownership_type: value })}
              >
                <SelectTrigger id="ownership_type">
                  <SelectValue placeholder="Select ownership type" />
                </SelectTrigger>
                <SelectContent>
                  {ownershipTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="available_from">Available From</Label>
              <Input
                id="available_from"
                type="date"
                value={details.available_from}
                onChange={(e) => updateDetails({ available_from: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SparklesIcon className="h-5 w-5 text-primary" />
            Amenities
          </CardTitle>
          <CardDescription>
            Select the amenities available in your property
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { key: "has_basement", label: "Basement" },
              { key: "has_elevator", label: "Elevator" },
              { key: "has_pool", label: "Swimming Pool" },
              { key: "has_garden", label: "Garden" },
              { key: "has_gym", label: "Gym" },
              { key: "has_powder_room", label: "Powder Room" },
              { key: "has_prayer_room", label: "Prayer Room" },
              { key: "has_terrace", label: "Terrace" },
              { key: "has_study_room", label: "Study Room" },
              { key: "has_central_heating", label: "Central Heating" },
              { key: "has_central_ac", label: "Central AC" },
              { key: "covered_parking", label: "Covered Parking" },
            ].map((amenity) => (
              <div key={amenity.key} className="flex items-center space-x-2">
                <Switch
                  id={amenity.key}
                  checked={details[amenity.key as keyof typeof details] as boolean}
                  onCheckedChange={(checked) =>
                    updateDetails({ [amenity.key]: checked })
                  }
                />
                <Label htmlFor={amenity.key}>{amenity.label}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Rooms */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Rooms</CardTitle>
          <CardDescription>
            Specify additional room counts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="servant_quarters">Servant Quarters</Label>
              <Input
                id="servant_quarters"
                type="number"
                min="0"
                placeholder="0"
                value={details.servant_quarters}
                onChange={(e) => updateDetails({ servant_quarters: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="laundry_rooms">Laundry Rooms</Label>
              <Input
                id="laundry_rooms"
                type="number"
                min="0"
                placeholder="0"
                value={details.laundry_rooms}
                onChange={(e) => updateDetails({ laundry_rooms: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="store_rooms">Store Rooms</Label>
              <Input
                id="store_rooms"
                type="number"
                min="0"
                placeholder="0"
                value={details.store_rooms}
                onChange={(e) => updateDetails({ store_rooms: Number(e.target.value) })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheckIcon className="h-5 w-5 text-primary" />
            Legal Information
          </CardTitle>
          <CardDescription>
            Property legal status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="clear_title"
                checked={details.clear_title}
                onCheckedChange={(checked) => updateDetails({ clear_title: checked })}
              />
              <Label htmlFor="clear_title">Clear Title</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_mortgaged"
                checked={details.is_mortgaged}
                onCheckedChange={(checked) => updateDetails({ is_mortgaged: checked })}
              />
              <Label htmlFor="is_mortgaged">Property is Mortgaged</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Details */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Details</CardTitle>
          <CardDescription>
            Additional costs and fees
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="security_deposit">Security Deposit</Label>
              <Input
                id="security_deposit"
                type="number"
                min="0"
                placeholder="0"
                value={details.security_deposit ?? ""}
                onChange={(e) => updateDetails({ security_deposit: e.target.value ? Number(e.target.value) : null })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maintenance_charges">Maintenance Charges</Label>
              <Input
                id="maintenance_charges"
                type="number"
                min="0"
                placeholder="0"
                value={details.maintenance_charges}
                onChange={(e) => updateDetails({ maintenance_charges: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="service_charges_monthly">Monthly Service Charges</Label>
              <Input
                id="service_charges_monthly"
                type="number"
                min="0"
                placeholder="0"
                value={details.service_charges_monthly ?? ""}
                onChange={(e) => updateDetails({ service_charges_monthly: e.target.value ? Number(e.target.value) : null })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button type="button" variant="outline" size="lg" onClick={handleBack}>
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Basic Info
        </Button>
        <Button type="submit" size="lg">
          Continue to Media
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
