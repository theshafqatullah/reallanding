"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "@/store/auth";
import { propertiesService } from "@/services/properties";
import { type Properties } from "@/types/appwrite";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  Search,
  ArrowUpDown,
  TrendingUp,
  Heart,
  MessageSquare,
  Copy,
  Share2,
  BarChart3,
  RefreshCw,
  Archive,
  DollarSign,
  AlertTriangle,
  Sparkles,
  Target,
  Calendar,
  ExternalLink,
  Grid3X3,
  List,
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
        <Badge className="bg-primary/20 text-primary hover:bg-primary/20">
          <CheckCircle className="h-3 w-3 mr-1" />
          Sold
        </Badge>
      );
    case "rented":
      return (
        <Badge className="bg-primary/20 text-primary hover:bg-primary/20">
          <CheckCircle className="h-3 w-3 mr-1" />
          Rented
        </Badge>
      );
    default:
      return null;
  }
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

// Quick Stats Card Component
function QuickStatCard({
  label,
  value,
  subValue,
  icon: Icon,
  iconBg,
  trend,
}: {
  label: string;
  value: string | number;
  subValue?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  trend?: number;
}) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subValue && (
            <p className="text-xs text-muted-foreground mt-1">{subValue}</p>
          )}
        </div>
        <div className={`p-2.5 rounded-lg ${iconBg}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {trend !== undefined && (
        <div className="flex items-center gap-1 mt-2">
          <TrendingUp className={`h-3 w-3 ${trend >= 0 ? "text-green-600" : "text-red-600"}`} />
          <span className={`text-xs font-medium ${trend >= 0 ? "text-green-600" : "text-red-600"}`}>
            {Math.abs(trend)}%
          </span>
          <span className="text-xs text-muted-foreground">vs last month</span>
        </div>
      )}
    </Card>
  );
}

export default function MyListingsPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState<Properties[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedListings, setSelectedListings] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    sold: 0,
    totalViews: 0,
    totalInquiries: 0,
    totalSaves: 0,
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
      const totalViews = properties.reduce((sum, p) => sum + (p.view_count || 0), 0);
      const totalInquiries = properties.reduce((sum, p) => sum + (p.inquiry_count || 0), 0);
      const totalSaves = properties.reduce((sum, p) => sum + (p.share_count || 0), 0);

      const newStats = {
        total,
        active: properties.filter(
          (p) => p.verification_status === "approved" && p.is_active
        ).length,
        pending: properties.filter(
          (p) => p.verification_status === "pending"
        ).length,
        sold: properties.filter((p) => p.availability === "sold").length,
        totalViews,
        totalInquiries,
        totalSaves,
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

  // Refresh handler
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchListings();
    setRefreshing(false);
    toast.success("Listings refreshed");
  };

  // Filter and sort listings
  const filteredListings = useMemo(() => {
    let result = [...listings];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (listing) =>
          listing.title?.toLowerCase().includes(query) ||
          listing.address?.toLowerCase().includes(query) ||
          listing.city?.name?.toLowerCase().includes(query)
      );
    } else if (activeTab === "pending") {
      result = result.filter((listing) => listing.verification_status === "pending");
    } else if (activeTab === "sold") {
      result = result.filter((listing) => listing.availability === "sold");
    }

    // Sort
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.$createdAt).getTime() - new Date(b.$createdAt).getTime());
        break;
      case "price-high":
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "price-low":
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "views":
        result.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
        break;
    }

    return result;
  }, [listings, searchQuery, activeTab, sortBy]);

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedListings.length === filteredListings.length) {
      setSelectedListings([]);
    } else {
      setSelectedListings(filteredListings.map((l) => l.$id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedListings((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Bulk actions
  const handleBulkActivate = async () => {
    if (selectedListings.length === 0) return;
    setBulkActionLoading(true);
    try {
      await Promise.all(
        selectedListings.map((id) => propertiesService.update(id, { is_active: true }))
      );
      toast.success(`${selectedListings.length} listings activated`);
      setSelectedListings([]);
      fetchListings();
    } catch (error) {
      console.error("Error activating listings:", error);
      toast.error("Failed to activate some listings");
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkDeactivate = async () => {
    if (selectedListings.length === 0) return;
    setBulkActionLoading(true);
    try {
      await Promise.all(
        selectedListings.map((id) => propertiesService.update(id, { is_active: false }))
      );
      toast.success(`${selectedListings.length} listings deactivated`);
      setSelectedListings([]);
      fetchListings();
    } catch (error) {
      console.error("Error deactivating listings:", error);
      toast.error("Failed to deactivate some listings");
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedListings.length === 0) return;
    setBulkActionLoading(true);
    try {
      await Promise.all(selectedListings.map((id) => propertiesService.delete(id)));
      toast.success(`${selectedListings.length} listings deleted`);
      setSelectedListings([]);
      fetchListings();
    } catch (error) {
      console.error("Error deleting listings:", error);
      toast.error("Failed to delete some listings");
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Copy and share handlers
  const handleCopyLink = (listing: Properties) => {
    const url = `${window.location.origin}/p/${listing.slug || listing.$id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  const handleShare = async (listing: Properties) => {
    const url = `${window.location.origin}/p/${listing.slug || listing.$id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.title,
          text: `Check out this property: ${listing.title}`,
          url,
        });
      } catch {
        handleCopyLink(listing);
      }
    } else {
      handleCopyLink(listing);
    }
  };

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
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">My Listings</h1>
            <p className="text-muted-foreground">
              Manage and track your property listings
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleRefresh} disabled={refreshing}>
                  <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Refresh listings</TooltipContent>
            </Tooltip>
            <Button asChild>
              <Link href="/listing/create">
                <Plus className="h-4 w-4 mr-2" />
                Add New Listing
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <QuickStatCard
            label="Total Listings"
            value={stats.total}
            icon={Building2}
            iconBg="bg-primary/20 text-primary"
          />
          <QuickStatCard
            label="Active"
            value={stats.active}
            subValue={`${stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% of total`}
            icon={CheckCircle}
            iconBg="bg-green-100 text-green-600"
          />
          <QuickStatCard
            label="Total Views"
            value={stats.totalViews.toLocaleString()}
            icon={Eye}
            iconBg="bg-purple-100 text-purple-600"
            trend={12}
          />
          <QuickStatCard
            label="Inquiries"
            value={stats.totalInquiries}
            icon={MessageSquare}
            iconBg="bg-orange-100 text-orange-600"
            trend={8}
          />
          <QuickStatCard
            label="Saves"
            value={stats.totalSaves}
            icon={Heart}
            iconBg="bg-red-100 text-red-600"
            trend={15}
          />
        </div>

        {/* Performance Overview */}
        {stats.total > 0 && (
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Performance Overview
              </h3>
              <Link href="/analytics" className="text-sm text-primary hover:underline flex items-center gap-1">
                View detailed analytics
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Listing Quality</span>
                  <span className="font-medium">{Math.round((stats.active / Math.max(stats.total, 1)) * 100)}%</span>
                </div>
                <Progress value={(stats.active / Math.max(stats.total, 1)) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.active} of {stats.total} listings are active and approved
                </p>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Engagement Rate</span>
                  <span className="font-medium">
                    {stats.totalViews > 0
                      ? ((stats.totalInquiries / stats.totalViews) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
                <Progress
                  value={stats.totalViews > 0 ? Math.min((stats.totalInquiries / stats.totalViews) * 100, 100) : 0}
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.totalInquiries} inquiries from {stats.totalViews} views
                </p>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Status Distribution</span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm">
                  <div className="flex items-center gap-1 text-emerald-600">
                    <Target className="h-4 w-4" />
                    <span>{stats.sold} Sold</span>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-600">
                    <Clock className="h-4 w-4" />
                    <span>{stats.pending} Pending</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Search, Filter & Actions Bar */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, address, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full lg:w-48">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="views">Most Views</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="rounded-r-none"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="rounded-l-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedListings.length > 0 && (
          <Card className="p-3 bg-primary/5 border-primary/20">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium">
                {selectedListings.length} selected
              </span>
              <div className="flex-1" />
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkActivate}
                disabled={bulkActionLoading}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Activate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDeactivate}
                disabled={bulkActionLoading}
              >
                <Archive className="h-4 w-4 mr-1" />
                Deactivate
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" disabled={bulkActionLoading}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete {selectedListings.length} listings?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. All selected listings will be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleBulkDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button variant="ghost" size="sm" onClick={() => setSelectedListings([])}>
                <XCircle className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
          </Card>
        )}

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
                  {searchQuery
                    ? `No listings matching "${searchQuery}"`
                    : `You don't have any ${activeTab !== "all" ? activeTab : ""} listings yet.`}
                </p>
                <Button asChild>
                  <Link href="/listing/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Listing
                  </Link>
                </Button>
              </Card>
            ) : (
              <>
                {/* Select All */}
                <div className="flex items-center gap-2 mb-4 px-1">
                  <Checkbox
                    checked={selectedListings.length === filteredListings.length && filteredListings.length > 0}
                    onCheckedChange={toggleSelectAll}
                    id="select-all"
                  />
                  <label htmlFor="select-all" className="text-sm text-muted-foreground cursor-pointer">
                    Select all ({filteredListings.length})
                  </label>
                </div>

                {/* Listings */}
                <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-4"}>
                  {filteredListings.map((listing) => (
                    <Card key={listing.$id} className={`p-4 hover:shadow-md transition-shadow ${selectedListings.includes(listing.$id) ? "ring-2 ring-primary" : ""}`}>
                      <div className={viewMode === "grid" ? "space-y-4" : "flex flex-col md:flex-row gap-4"}>
                        {/* Selection & Image */}
                        <div className={viewMode === "grid" ? "" : "flex gap-3"}>
                          <Checkbox
                            checked={selectedListings.includes(listing.$id)}
                            onCheckedChange={() => toggleSelect(listing.$id)}
                            className="mt-1 shrink-0"
                          />
                          <div className={`${viewMode === "grid" ? "w-full h-48 mt-2" : "w-full md:w-44 h-32"} bg-muted rounded-lg flex items-center justify-center shrink-0 overflow-hidden relative`}>
                            {listing.main_image_url ? (
                              <Image
                                src={listing.main_image_url}
                                alt={listing.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <Building2 className="h-8 w-8 text-muted-foreground" />
                            )}
                            {listing.is_featured && (
                              <div className="absolute top-2 left-2">
                                <Badge className="bg-yellow-500 text-white">
                                  <Sparkles className="h-3 w-3 mr-1" />
                                  Featured
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className="font-semibold text-lg line-clamp-1">{listing.title}</h3>
                              <p className="text-muted-foreground flex items-center gap-1 text-sm">
                                <MapPin className="h-3 w-3 shrink-0" />
                                <span className="truncate">{listing.address || listing.city?.name || "Location not specified"}</span>
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-1.5 shrink-0">
                              {getAvailabilityBadge(listing.availability)}
                              {getStatusBadge(listing.verification_status, listing.is_active)}
                            </div>
                          </div>

                          <p className="text-xl font-bold text-primary mt-2">
                            {formatPrice(listing.price)}
                            {listing.listing_type?.name?.toLowerCase() === "rent" && <span className="text-sm font-normal text-muted-foreground">/month</span>}
                          </p>

                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-muted-foreground">
                            {listing.bedrooms != null && listing.bedrooms > 0 && (
                              <span className="flex items-center gap-1">
                                <Bed className="h-4 w-4" />
                                {listing.bedrooms} Beds
                              </span>
                            )}
                            {listing.bathrooms != null && listing.bathrooms > 0 && (
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
                          </div>

                          {/* Engagement Stats */}
                          <div className="flex items-center gap-4 mt-3 pt-3 border-t text-sm">
                            <Tooltip>
                              <TooltipTrigger className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                                <Eye className="h-4 w-4" />
                                {listing.view_count || 0}
                              </TooltipTrigger>
                              <TooltipContent>Views</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                                <MessageSquare className="h-4 w-4" />
                                {listing.inquiry_count || 0}
                              </TooltipTrigger>
                              <TooltipContent>Inquiries</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                                <Heart className="h-4 w-4" />
                                {listing.share_count || 0}
                              </TooltipTrigger>
                              <TooltipContent>Saves</TooltipContent>
                            </Tooltip>
                            <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatTimeAgo(listing.$createdAt)}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className={`flex ${viewMode === "grid" ? "justify-between" : "md:flex-col"} gap-2 shrink-0`}>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/listing/${listing.$id}/edit`}>
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/p/${listing.slug || listing.$id}`} target="_blank">
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
                              <DropdownMenuItem onClick={() => handleCopyLink(listing)}>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy Link
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleShare(listing)}>
                                <Share2 className="h-4 w-4 mr-2" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {listing.availability !== "sold" && (
                                <DropdownMenuItem onClick={() => handleMarkAsSold(listing.$id)}>
                                  <DollarSign className="h-4 w-4 mr-2" />
                                  Mark as Sold
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleToggleActive(listing.$id, listing.is_active)}>
                                {listing.is_active ? (
                                  <>
                                    <Archive className="h-4 w-4 mr-2" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
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
                                      Are you sure you want to delete &quot;{listing.title}&quot;? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(listing.$id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      {deletingId === listing.$id ? <Spinner className="h-4 w-4" /> : "Delete"}
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
              </>
            )}
          </TabsContent>
        </Tabs>

        {/* Tips Section */}
        {stats.total > 0 && stats.total < 5 && (
          <Card className="p-5 bg-gradient-to-br from-primary/5 via-background to-accent/5 border-primary/20">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                <AlertTriangle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Tips to Get More Visibility</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Add high-quality photos (listings with 10+ photos get 3x more views)</li>
                  <li>• Write detailed descriptions with property features</li>
                  <li>• Keep your pricing competitive with market rates</li>
                  <li>• Respond quickly to inquiries to boost your profile</li>
                </ul>
              </div>
            </div>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
}
