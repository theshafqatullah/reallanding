"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/store/auth";
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
import Link from "next/link";
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
  AlertCircle,
} from "lucide-react";

// Mock data for listings
const MOCK_LISTINGS = [
  {
    id: "1",
    title: "Modern 3 Bedroom Apartment in DHA Phase 6",
    location: "DHA Phase 6, Lahore",
    price: 25000000,
    status: "active",
    views: 245,
    inquiries: 12,
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    createdAt: "2025-12-15",
    image: null,
  },
  {
    id: "2",
    title: "Luxury Villa with Pool in Bahria Town",
    location: "Bahria Town, Lahore",
    price: 85000000,
    status: "pending",
    views: 89,
    inquiries: 5,
    bedrooms: 5,
    bathrooms: 6,
    area: 5000,
    createdAt: "2025-12-20",
    image: null,
  },
  {
    id: "3",
    title: "Commercial Plaza in Gulberg",
    location: "Gulberg III, Lahore",
    price: 150000000,
    status: "sold",
    views: 567,
    inquiries: 34,
    bedrooms: 0,
    bathrooms: 4,
    area: 10000,
    createdAt: "2025-11-10",
    image: null,
  },
];

function formatPrice(price: number) {
  if (price >= 10000000) {
    return `PKR ${(price / 10000000).toFixed(2)} Cr`;
  } else if (price >= 100000) {
    return `PKR ${(price / 100000).toFixed(2)} Lac`;
  }
  return `PKR ${price.toLocaleString()}`;
}

function getStatusBadge(status: string) {
  switch (status) {
    case "active":
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
    case "sold":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
          <CheckCircle className="h-3 w-3 mr-1" />
          Sold
        </Badge>
      );
    case "expired":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          <XCircle className="h-3 w-3 mr-1" />
          Expired
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

export default function MyListingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(false);

  const filteredListings = MOCK_LISTINGS.filter((listing) => {
    if (activeTab === "all") return true;
    return listing.status === activeTab;
  });

  const stats = {
    total: MOCK_LISTINGS.length,
    active: MOCK_LISTINGS.filter((l) => l.status === "active").length,
    pending: MOCK_LISTINGS.filter((l) => l.status === "pending").length,
    sold: MOCK_LISTINGS.filter((l) => l.status === "sold").length,
  };

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
                <Card key={listing.id} className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Image */}
                    <div className="w-full md:w-48 h-32 bg-muted rounded-lg flex items-center justify-center shrink-0">
                      <Building2 className="h-8 w-8 text-muted-foreground" />
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
                            {listing.location}
                          </p>
                        </div>
                        {getStatusBadge(listing.status)}
                      </div>

                      <p className="text-xl font-bold text-primary mt-2">
                        {formatPrice(listing.price)}
                      </p>

                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                        {listing.bedrooms > 0 && (
                          <span className="flex items-center gap-1">
                            <Bed className="h-4 w-4" />
                            {listing.bedrooms} Beds
                          </span>
                        )}
                        {listing.bathrooms > 0 && (
                          <span className="flex items-center gap-1">
                            <Bath className="h-4 w-4" />
                            {listing.bathrooms} Baths
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Ruler className="h-4 w-4" />
                          {listing.area.toLocaleString()} sq ft
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {listing.views} views
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex md:flex-col gap-2 shrink-0">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/listing/${listing.id}/edit`}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/p/${listing.id}`}>
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
                          <DropdownMenuItem>Mark as Sold</DropdownMenuItem>
                          <DropdownMenuItem>Renew Listing</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
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
