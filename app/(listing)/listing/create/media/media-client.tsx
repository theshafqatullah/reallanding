"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useListingFormStore } from "@/store/listing";
import { useAuth } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeftIcon,
  ImageIcon,
  UserIcon,
  SearchIcon,
  SparklesIcon,
  CheckCircleIcon,
  Loader2Icon,
  VideoIcon,
  PhoneIcon
} from "lucide-react";
import { PropertyImageUpload, type UploadedImage } from "@/components/listing/property-image-upload";
import { PropertyVideoUpload, type UploadedVideo } from "@/components/listing/property-video-upload";
import { propertiesService } from "@/services/properties";

export default function MediaClient() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    media,
    updateMedia,
    setCurrentStep,
    resetForm,
    basicInfo,
    details,
    isSubmitting,
    setSubmitting,
    setError
  } = useListingFormStore();

  // Image and video states
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<UploadedVideo[]>([]);

  // Handle image upload to Appwrite
  const handleImageUpload = async (file: File): Promise<{ fileId: string; fileUrl: string }> => {
    return await propertiesService.uploadImage(file);
  };

  // Handle video upload to Appwrite
  const handleVideoUpload = async (file: File): Promise<{ fileId: string; fileUrl: string }> => {
    return await propertiesService.uploadVideo(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Validation
      if (!basicInfo.title || !basicInfo.property_type_id || !basicInfo.listing_type_id || !basicInfo.property_status_id) {
        throw new Error("Please complete the basic information first");
      }

      if (!basicInfo.location_id) {
        throw new Error("Please select a location");
      }

      if (!basicInfo.price || basicInfo.price <= 0) {
        throw new Error("Please enter a valid price");
      }

      // Get main image URL from uploaded images
      const mainImage = uploadedImages.find(img => img.isMain);
      const mainImageUrl = mainImage?.url || uploadedImages[0]?.url || "";

      // Get first video URL if any
      const firstVideoUrl = uploadedVideos[0]?.url || "";

      // Create the property
      const propertyData = await propertiesService.createFullProperty({
        // Basic info
        title: basicInfo.title,
        description: basicInfo.description,
        property_type_id: basicInfo.property_type_id,
        listing_type_id: basicInfo.listing_type_id,
        property_status_id: basicInfo.property_status_id,
        location_id: basicInfo.location_id,
        price: basicInfo.price,
        currency: basicInfo.currency || "PKR",
        price_negotiable: basicInfo.price_negotiable,
        address: basicInfo.address,
        street_address: basicInfo.street_address,
        building_name: basicInfo.building_name,
        unit_number: basicInfo.unit_number,
        sector: basicInfo.sector,
        block: basicInfo.block,
        plot_number: basicInfo.plot_number,
        owner_id: user?.$id,

        // Details
        bedrooms: details.bedrooms,
        bathrooms: details.bathrooms,
        kitchens: details.kitchens,
        parking_spaces: details.parking_spaces,
        total_area: details.total_area,
        covered_area: details.covered_area,
        area_unit: details.area_unit,
        floors: details.floors,
        floor_number: details.floor_number,
        facing: details.facing,
        condition_type: details.condition_type,
        furnished_status: details.furnished_status,
        pet_policy: details.pet_policy,
        ownership_type: details.ownership_type,
        year_built: details.year_built,
        available_from: details.available_from ? new Date(details.available_from).toISOString() : undefined,
        balconies: details.balconies,
        servant_quarters: details.servant_quarters,
        laundry_rooms: details.laundry_rooms,
        store_rooms: details.store_rooms,
        has_basement: details.has_basement,
        has_elevator: details.has_elevator,
        has_pool: details.has_pool,
        has_garden: details.has_garden,
        has_gym: details.has_gym,
        has_powder_room: details.has_powder_room,
        has_prayer_room: details.has_prayer_room,
        has_terrace: details.has_terrace,
        has_study_room: details.has_study_room,
        has_central_heating: details.has_central_heating,
        has_central_ac: details.has_central_ac,
        security_deposit: details.security_deposit,
        maintenance_charges: details.maintenance_charges,
        service_charges_monthly: details.service_charges_monthly,
        hoa_fees_monthly: details.hoa_fees_monthly,
        is_mortgaged: details.is_mortgaged,
        clear_title: details.clear_title,
        construction_status: details.construction_status,
        possession_status: details.possession_status,
        is_west_open: details.is_west_open,
        is_corner: details.is_corner,
        road_width_feet: details.road_width_feet,

        // Media
        main_image_url: mainImageUrl,
        video_url: firstVideoUrl,
        virtual_tour_url: media.virtual_tour_url,
        youtube_video_id: media.youtube_video_id,
        total_images: uploadedImages.length,

        // Contact
        contact_person_name: media.contact_person_name,
        contact_phone: media.contact_phone,
        contact_email: media.contact_email,
        whatsapp_number: media.whatsapp_number,

        // SEO & Marketing
        meta_description: media.meta_description,
        seo_keywords: media.seo_keywords,
        marketing_tagline: media.marketing_tagline,

        // Publish settings
        is_featured: media.is_featured,
        is_urgent_sale: media.is_urgent_sale,
        is_hot_deal: media.is_hot_deal,
        is_published: media.is_published,
      });

      // Create property_images documents for each uploaded image
      if (uploadedImages.length > 0) {
        await propertiesService.createPropertyImages(
          propertyData.$id,
          uploadedImages.map((img, index) => ({
            image_url: img.url,
            image_title: img.name,
            display_order: index,
            is_main: img.isMain,
          }))
        );
      }

      toast.success("Property listed successfully!", {
        description: "Your property has been submitted for review.",
      });

      // Reset form and redirect
      resetForm();
      router.push("/listing/success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create listing";
      setError(message);
      toast.error("Failed to create listing", {
        description: message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    setCurrentStep(2);
    router.push("/listing/create/details");
  };

  const handleSaveDraft = async () => {
    toast.info("Draft saved", {
      description: "Your listing has been saved as a draft.",
    });
    // TODO: Implement draft saving
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Images Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            Property Images
          </CardTitle>
          <CardDescription>
            Upload high-quality images of your property. First image or the one marked as main will be the cover image. Maximum 40 images allowed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PropertyImageUpload
            images={uploadedImages}
            onImagesChange={setUploadedImages}
            onUpload={handleImageUpload}
            maxImages={40}
            maxFileSize={10}
            disabled={isSubmitting}
          />
        </CardContent>
      </Card>

      {/* Videos Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <VideoIcon className="h-5 w-5 text-primary" />
            Property Videos
          </CardTitle>
          <CardDescription>
            Upload video walkthroughs of your property. Maximum 5 videos allowed, up to 100MB each.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PropertyVideoUpload
            videos={uploadedVideos}
            onVideosChange={setUploadedVideos}
            onUpload={handleVideoUpload}
            maxVideos={5}
            maxFileSize={100}
            disabled={isSubmitting}
          />
        </CardContent>
      </Card>

      {/* Virtual Tour & YouTube */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <VideoIcon className="h-5 w-5 text-primary" />
            Virtual Tour & External Links
          </CardTitle>
          <CardDescription>
            Add virtual tour or YouTube video links for more engagement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="youtube_video_id">YouTube Video ID</Label>
              <Input
                id="youtube_video_id"
                placeholder="e.g., dQw4w9WgXcQ"
                value={media.youtube_video_id}
                onChange={(e) => updateMedia({ youtube_video_id: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Enter only the video ID from YouTube URL
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="virtual_tour_url">Virtual Tour URL</Label>
              <Input
                id="virtual_tour_url"
                placeholder="https://example.com/tour"
                value={media.virtual_tour_url}
                onChange={(e) => updateMedia({ virtual_tour_url: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Add a 360° virtual tour link (Matterport, etc.)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PhoneIcon className="h-5 w-5 text-primary" />
            Contact Information
          </CardTitle>
          <CardDescription>
            How should interested buyers/renters contact you?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="contact_person_name">Contact Person Name</Label>
              <Input
                id="contact_person_name"
                placeholder="Full name"
                value={media.contact_person_name}
                onChange={(e) => updateMedia({ contact_person_name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_phone">Phone Number</Label>
              <Input
                id="contact_phone"
                type="tel"
                placeholder="+92 300 1234567"
                value={media.contact_phone}
                onChange={(e) => updateMedia({ contact_phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_email">Email Address</Label>
              <Input
                id="contact_email"
                type="email"
                placeholder="email@example.com"
                value={media.contact_email}
                onChange={(e) => updateMedia({ contact_email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
              <Input
                id="whatsapp_number"
                type="tel"
                placeholder="+92 300 1234567"
                value={media.whatsapp_number}
                onChange={(e) => updateMedia({ whatsapp_number: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO & Marketing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SearchIcon className="h-5 w-5 text-primary" />
            SEO & Marketing
          </CardTitle>
          <CardDescription>
            Optimize your listing for search engines
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="short_description">Short Description</Label>
            <Textarea
              id="short_description"
              placeholder="A brief summary of your property (max 160 characters)"
              maxLength={160}
              rows={2}
              value={media.short_description}
              onChange={(e) => updateMedia({ short_description: e.target.value })}
            />
            <p className="text-xs text-muted-foreground text-right">
              {media.short_description.length}/160 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="marketing_tagline">Marketing Tagline</Label>
            <Input
              id="marketing_tagline"
              placeholder="e.g., Your Dream Home Awaits!"
              value={media.marketing_tagline}
              onChange={(e) => updateMedia({ marketing_tagline: e.target.value })}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="meta_title">SEO Title</Label>
            <Input
              id="meta_title"
              placeholder="Title for search engines"
              value={media.meta_title}
              onChange={(e) => updateMedia({ meta_title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta_description">SEO Description</Label>
            <Textarea
              id="meta_description"
              placeholder="Description for search engines (max 160 characters)"
              maxLength={160}
              rows={2}
              value={media.meta_description}
              onChange={(e) => updateMedia({ meta_description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo_keywords">SEO Keywords</Label>
            <Input
              id="seo_keywords"
              placeholder="Comma-separated keywords"
              value={media.seo_keywords}
              onChange={(e) => updateMedia({ seo_keywords: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Publish Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SparklesIcon className="h-5 w-5 text-primary" />
            Listing Options
          </CardTitle>
          <CardDescription>
            Choose how you want to promote your listing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label htmlFor="is_featured" className="font-medium">Featured Listing</Label>
                <p className="text-xs text-muted-foreground">
                  Display at the top of search results
                </p>
              </div>
              <Switch
                id="is_featured"
                checked={media.is_featured}
                onCheckedChange={(checked) => updateMedia({ is_featured: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label htmlFor="is_premium" className="font-medium">Premium Listing</Label>
                <p className="text-xs text-muted-foreground">
                  Get a premium badge and more visibility
                </p>
              </div>
              <Switch
                id="is_premium"
                checked={media.is_premium}
                onCheckedChange={(checked) => updateMedia({ is_premium: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label htmlFor="is_exclusive" className="font-medium">Exclusive Listing</Label>
                <p className="text-xs text-muted-foreground">
                  Mark as exclusively listed with your agency
                </p>
              </div>
              <Switch
                id="is_exclusive"
                checked={media.is_exclusive}
                onCheckedChange={(checked) => updateMedia({ is_exclusive: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label htmlFor="is_urgent_sale" className="font-medium">Urgent Sale</Label>
                <p className="text-xs text-muted-foreground">
                  Highlight as an urgent sale opportunity
                </p>
              </div>
              <Switch
                id="is_urgent_sale"
                checked={media.is_urgent_sale}
                onCheckedChange={(checked) => updateMedia({ is_urgent_sale: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label htmlFor="is_hot_deal" className="font-medium">Hot Deal</Label>
                <p className="text-xs text-muted-foreground">
                  Mark as a special deal
                </p>
              </div>
              <Switch
                id="is_hot_deal"
                checked={media.is_hot_deal}
                onCheckedChange={(checked) => updateMedia({ is_hot_deal: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-primary/5">
              <div>
                <Label htmlFor="is_published" className="font-medium">Publish Immediately</Label>
                <p className="text-xs text-muted-foreground">
                  Make listing visible to everyone
                </p>
              </div>
              <Switch
                id="is_published"
                checked={media.is_published}
                onCheckedChange={(checked) => updateMedia({ is_published: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Button type="button" variant="outline" size="lg" onClick={handleBack}>
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Details
        </Button>

        <div className="flex gap-4">
          <Button type="button" variant="secondary" size="lg" onClick={handleSaveDraft}>
            Save as Draft
          </Button>
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Creating Listing...
              </>
            ) : (
              <>
                <CheckCircleIcon className="mr-2 h-4 w-4" />
                Create Listing
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
