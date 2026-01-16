"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/store/auth";
import { savedPropertiesService } from "@/services/saved-properties";
import { type Properties } from "@/types/appwrite";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  Building2,
  MapPin,
  Bed,
  Bath,
  Ruler,
  Trash2,
  ExternalLink,
  Share2,
  Bell,
  BellOff,
} from "lucide-react";

// Type for saved property with details
interface SavedPropertyWithDetails {
  $id: string;
  property_id: string;
  folder_name?: string | null;
  notes?: string | null;
  $createdAt: string;
  property?: Properties;
}

interface Folder {
  name: string;
  count: number;
}

function formatPrice(price: number) {
  if (price >= 10000000) {
    return `PKR ${(price / 10000000).toFixed(2)} Cr`;
  } else if (price >= 100000) {
    return `PKR ${(price / 100000).toFixed(2)} Lac`;
  }
  return `PKR ${price.toLocaleString()}`;
}

export default function SavedPropertiesPage() {
  const { user } = useAuth();
  const [savedProperties, setSavedProperties] = useState<SavedPropertyWithDetails[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    folders: 0,
    thisMonth: 0,
  });

  // Fetch saved properties
  const fetchSavedProperties = useCallback(async () => {
    if (!user?.$id) return;

    try {
      setLoading(true);
      const [savedData, foldersData, statsData] = await Promise.all([
        savedPropertiesService.getUserSavedPropertiesWithDetails(user.$id, { limit: 50 }),
        savedPropertiesService.getUserFolders(user.$id),
        savedPropertiesService.getUserSavedStats(user.$id),
      ]);

      setSavedProperties(savedData.savedProperties as SavedPropertyWithDetails[]);
      setFolders(foldersData);
      setStats({
        total: statsData.total,
        folders: foldersData.length,
        thisMonth: statsData.thisMonth,
      });
    } catch (error) {
      console.error("Error fetching saved properties:", error);
      toast.error("Failed to load saved properties");
    } finally {
      setLoading(false);
    }
  }, [user?.$id]);

  useEffect(() => {
    fetchSavedProperties();
  }, [fetchSavedProperties]);

  const handleRemove = async (savedId: string, propertyId: string) => {
    if (!user?.$id) return;

    try {
      setRemovingId(savedId);
      await savedPropertiesService.unsaveProperty(user.$id, propertyId);
      toast.success("Property removed from saved");
      fetchSavedProperties();
    } catch (error) {
      console.error("Error removing saved property:", error);
      toast.error("Failed to remove property");
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Saved Properties</h1>
        <p className="text-muted-foreground">
          Properties you&apos;ve saved for later
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Saved</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Collections</p>
          <p className="text-2xl font-bold">{stats.folders}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">This Month</p>
          <p className="text-2xl font-bold">{stats.thisMonth}</p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Saved</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {savedProperties.length === 0 ? (
            <Card className="p-12 text-center">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No saved properties</h3>
              <p className="text-muted-foreground mb-4">
                Start browsing and save properties you&apos;re interested in.
              </p>
              <Button asChild>
                <Link href="/properties">Browse Properties</Link>
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4">
              {savedProperties.map((saved) => {
                const property = saved.property;
                if (!property) return null;

                return (
                  <Card key={saved.$id} className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Image */}
                      <div className="w-full md:w-48 h-32 bg-muted rounded-lg flex items-center justify-center shrink-0 relative overflow-hidden">
                        {property.main_image_url ? (
                          <Image
                            src={property.main_image_url}
                            alt={property.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <Building2 className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-lg line-clamp-1">
                              {property.title}
                            </h3>
                            <p className="text-muted-foreground flex items-center gap-1 text-sm">
                              <MapPin className="h-3 w-3" />
                              {property.address || "Location not specified"}
                            </p>
                          </div>
                          {saved.folder_name && (
                            <Badge variant="secondary" className="shrink-0">
                              {saved.folder_name}
                            </Badge>
                          )}
                        </div>

                        <p className="text-xl font-bold text-primary mt-2">
                          {formatPrice(property.price)}
                        </p>

                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                          {property.bedrooms && (
                            <span className="flex items-center gap-1">
                              <Bed className="h-4 w-4" />
                              {property.bedrooms} Beds
                            </span>
                          )}
                          {property.bathrooms && (
                            <span className="flex items-center gap-1">
                              <Bath className="h-4 w-4" />
                              {property.bathrooms} Baths
                            </span>
                          )}
                          {property.total_area && (
                            <span className="flex items-center gap-1">
                              <Ruler className="h-4 w-4" />
                              {property.total_area.toLocaleString()} {property.area_unit || "sq ft"}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground mt-2">
                          Saved on {new Date(saved.$createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex md:flex-col gap-2 shrink-0">
                        <Button size="sm" asChild>
                          <Link href={`/p/${property.slug || property.$id}`}>
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleRemove(saved.$id, saved.property_id)}
                          disabled={removingId === saved.$id}
                        >
                          {removingId === saved.$id ? (
                            <Spinner className="h-4 w-4 mr-1" />
                          ) : (
                            <Trash2 className="h-4 w-4 mr-1" />
                          )}
                          Remove
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="collections" className="mt-6">
          <div className="grid md:grid-cols-3 gap-4">
            {folders.map((folder) => (
              <Card
                key={folder.name}
                className="p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{folder.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {folder.count} properties
                    </p>
                  </div>
                </div>
              </Card>
            ))}

            {folders.length === 0 && (
              <Card className="p-6 border-dashed col-span-full text-center">
                <Heart className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  No collections yet. Save properties with folders to organize them.
                </p>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
