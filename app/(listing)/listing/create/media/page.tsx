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
  UploadIcon,
  VideoIcon,
  PhoneIcon
} from "lucide-react";

export default function CreateListingMediaPage() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Prepare the complete property data
      const propertyData = {
        ...basicInfo,
        ...details,
        ...media,
        owner_id: user?.$id,
      };

      // TODO: Submit to Appwrite database
      console.log("Property data to submit:", propertyData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

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
            Upload high-quality images of your property (first image will be the cover)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="main_image_url">Main Image URL</Label>
            <Input
              id="main_image_url"
              placeholder="https://example.com/image.jpg"
              value={media.main_image_url}
              onChange={(e) => updateMedia({ main_image_url: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              This will be displayed as the main listing image
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover_image_url">Cover Image URL</Label>
            <Input
              id="cover_image_url"
              placeholder="https://example.com/cover.jpg"
              value={media.cover_image_url}
              onChange={(e) => updateMedia({ cover_image_url: e.target.value })}
            />
          </div>

          {/* Image Upload Placeholder */}
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <UploadIcon className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop images here, or click to browse
            </p>
            <Button type="button" variant="outline" size="sm">
              Choose Files
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              PNG, JPG up to 10MB each. Maximum 20 images.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Video & Virtual Tour */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <VideoIcon className="h-5 w-5 text-primary" />
            Video & Virtual Tour
          </CardTitle>
          <CardDescription>
            Add video content to make your listing stand out
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="video_url">Video URL</Label>
              <Input
                id="video_url"
                placeholder="https://example.com/video.mp4"
                value={media.video_url}
                onChange={(e) => updateMedia({ video_url: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="youtube_video_id">YouTube Video ID</Label>
              <Input
                id="youtube_video_id"
                placeholder="e.g., dQw4w9WgXcQ"
                value={media.youtube_video_id}
                onChange={(e) => updateMedia({ youtube_video_id: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
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
