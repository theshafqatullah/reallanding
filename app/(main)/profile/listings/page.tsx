"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/store/auth";
import { propertiesService } from "@/services/properties";
import { type Properties } from "@/types/appwrite";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  Plus,
  Building2,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  MapPin,
  Bed,
  Bath,
  Ruler,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

function formatPrice(price: number) {
  if (price >= 10000000) {
    return `PKR ${(price / 10000000).toFixed(2)} Cr`;
  } else if (price >= 100000) {
    return `PKR ${(price / 100000).toFixed(2)} Lac`;
  }
  return `PKR ${price.toLocaleString()}`;
}

function getStatusBadge(status: string, isActive: boolean) {
  if (!isActive) {
    return (
      <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
        <XCircle className="h-3 w-3 mr-1" />
        Inactive
      </Badge>
    );
  }

  switch (status) {
    case "approved":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          <CheckCircle className="h-3 w-3 mr-1" />
          Active
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    case "rejected":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

function getAvailabilityBadge(availability: string) {
  switch (availability) {
    case "sold":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
          <CheckCircle className="h-3 w-3 mr-1" />
          Sold
        </Badge>
      );
    case "rented":
      return (
        <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
          <CheckCircle className="h-3 w-3 mr-1" />
          Rented
        </Badge>
      );
    default:
      return null;
  }
}

export default function MyListingsPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState<Properties[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    sold: 0,
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch listings
  const fetchListings = useCallback(async () => {
    if (!user?.$id) return;

    try {
      setLoading(true);
      const { properties, total } = await propertiesService.getByOwnerId(
        user.$id,
        { limit: 50 }
      );

      setListings(properties);

      // Calculate stats
      const newStats = {
        total,
        active: properties.filter(
          (p) => p.verification_status === "approved" && p.is_active
        ).length,
        pending: properties.filter(
          (p) => p.verification_status === "pending"
        ).length,
        sold: properties.filter((p) => p.availability === "sold").length,
      };
      setStats(newStats);
    } catch (error) {
      console.error("Error fetching listings:", error);
      toast.error("Failed to load listings");
    } finally {
      setLoading(false);
    }
  }, [user?.$id]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Filter listings based on active tab
  const filteredListings = listings.filter((listing) => {
    if (activeTab === "all") return true;
    if (activeTab === "active") {
      return listing.verification_status === "approved" && listing.is_active;
    }
    if (activeTab === "pending") {
      return listing.verification_status === "pending";
    }
    if (activeTab === "sold") {
      return listing.availability === "sold";
    }
    return true;
  });

  // Handle delete
  const handleDelete = async (propertyId: string) => {
    try {
      setDeletingId(propertyId);
      await propertiesService.delete(propertyId);
      toast.success("Listing deleted successfully");
      fetchListings();
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast.error("Failed to delete listing");
    } finally {
      setDeletingId(null);
    }
  };

  // Handle mark as sold
  const handleMarkAsSold = async (propertyId: string) => {
    try {
      await propertiesService.update(propertyId, {
        availability: "sold",
        is_active: false,
      });
      toast.success("Listing marked as sold");
      fetchListings();
    } catch (error) {
      console.error("Error updating listing:", error);
      toast.error("Failed to update listing");
    }
  };

  // Handle toggle active
  const handleToggleActive = async (propertyId: string, currentActive: boolean) => {
    try {
      await propertiesService.update(propertyId, {
        is_active: !currentActive,
      });
      toast.success(currentActive ? "Listing deactivated" : "Listing activated");
      fetchListings();
    } catch (error) {
      console.error("Error updating listing:", error);
      toast.error("Failed to update listing");
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Listings</h1>
          <p className="text-muted-foreground">
            Manage your property listings
          </p>
        </div>
        <Button asChild>
          <Link href="/listing/create">
            <Plus className="h-4 w-4 mr-2" />
            Add New Listing
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Listings</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Sold</p>
          <p className="text-2xl font-bold text-blue-600">{stats.sold}</p>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="sold">Sold ({stats.sold})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredListings.length === 0 ? (
            <Card className="p-12 text-center">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No listings found</h3>
              <p className="text-muted-foreground mb-4">
                You don&apos;t have any {activeTab !== "all" ? activeTab : ""} listings yet.
              </p>
              <Button asChild>
                <Link href="/listing/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Listing
                </Link>
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredListings.map((listing) => (
                <Card key={listing.$id} className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Image */}
                    <div className="w-full md:w-48 h-32 bg-muted rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                      {listing.main_image_url ? (
                        <Image
                          src={listing.main_image_url}
                          alt={listing.title}
                          width={192}
                          height={128}
                          className="w-full h-full object-cover"
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
                            {listing.title}
                          </h3>
                          <p className="text-muted-foreground flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3" />
                            {listing.address || "Location not specified"}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {getAvailabilityBadge(listing.availability)}
                          {getStatusBadge(listing.verification_status, listing.is_active)}
                        </div>
                      </div>

                      <p className="text-xl font-bold text-primary mt-2">
                        {formatPrice(listing.price)}
                      </p>

                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                        {listing.bedrooms && listing.bedrooms > 0 && (
                          <span className="flex items-center gap-1">
                            <Bed className="h-4 w-4" />
                            {listing.bedrooms} Beds
                          </span>
                        )}
                        {listing.bathrooms && listing.bathrooms > 0 && (
                          <span className="flex items-center gap-1">
                            <Bath className="h-4 w-4" />
                            {listing.bathrooms} Baths
                          </span>
                        )}
                        {listing.total_area && (
                          <span className="flex items-center gap-1">
                            <Ruler className="h-4 w-4" />
                            {listing.total_area.toLocaleString()} {listing.area_unit || "sq ft"}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {listing.view_count || 0} views
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex md:flex-col gap-2 shrink-0">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/listing/${listing.$id}/edit`}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/p/${listing.slug || listing.$id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {listing.availability !== "sold" && (
                            <DropdownMenuItem
                              onClick={() => handleMarkAsSold(listing.$id)}
                            >
                              Mark as Sold
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() =>
                              handleToggleActive(listing.$id, listing.is_active)
                            }
                          >
                            {listing.is_active ? "Deactivate" : "Activate"} Listing
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                className="text-destructive"
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Listing</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this listing? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(listing.$id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  {deletingId === listing.$id ? (
                                    <Spinner className="h-4 w-4" />
                                  ) : (
                                    "Delete"
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
