"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
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

// Mock saved properties
const MOCK_SAVED = [
  {
    id: "1",
    title: "Stunning 4 Bedroom House in Model Town",
    location: "Model Town, Lahore",
    price: 45000000,
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
    savedAt: "2026-01-10",
    priceAlert: true,
  },
  {
    id: "2",
    title: "Penthouse with City View in Gulberg",
    location: "Gulberg, Lahore",
    price: 75000000,
    bedrooms: 3,
    bathrooms: 4,
    area: 2800,
    savedAt: "2026-01-08",
    priceAlert: false,
  },
  {
    id: "3",
    title: "Family Home in Bahria Town",
    location: "Bahria Town Phase 5, Lahore",
    price: 35000000,
    bedrooms: 5,
    bathrooms: 4,
    area: 4000,
    savedAt: "2026-01-05",
    priceAlert: true,
  },
];

const MOCK_COLLECTIONS = [
  { id: "1", name: "Dream Homes", count: 5 },
  { id: "2", name: "Investment Properties", count: 3 },
  { id: "3", name: "Vacation Homes", count: 2 },
];

function formatPrice(price: number) {
  if (price >= 10000000) {
    return `PKR ${(price / 10000000).toFixed(2)} Cr`;
  } else if (price >= 100000) {
    return `PKR ${(price / 100000).toFixed(2)} Lac`;
  }
  return `PKR ${price.toLocaleString()}`;
}

export default function SavedPropertiesPage() {
  const [savedProperties, setSavedProperties] = useState(MOCK_SAVED);
  const [activeTab, setActiveTab] = useState("all");

  const handleRemove = (id: string) => {
    setSavedProperties((prev) => prev.filter((p) => p.id !== id));
  };

  const togglePriceAlert = (id: string) => {
    setSavedProperties((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, priceAlert: !p.priceAlert } : p
      )
    );
  };

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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Saved</p>
          <p className="text-2xl font-bold">{savedProperties.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Price Alerts</p>
          <p className="text-2xl font-bold">
            {savedProperties.filter((p) => p.priceAlert).length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Collections</p>
          <p className="text-2xl font-bold">{MOCK_COLLECTIONS.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">This Month</p>
          <p className="text-2xl font-bold">3</p>
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
                <Link href="/search">Browse Properties</Link>
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4">
              {savedProperties.map((property) => (
                <Card key={property.id} className="p-4">
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
                            {property.title}
                          </h3>
                          <p className="text-muted-foreground flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3" />
                            {property.location}
                          </p>
                        </div>
                        {property.priceAlert && (
                          <Badge variant="secondary" className="shrink-0">
                            <Bell className="h-3 w-3 mr-1" />
                            Price Alert
                          </Badge>
                        )}
                      </div>

                      <p className="text-xl font-bold text-primary mt-2">
                        {formatPrice(property.price)}
                      </p>

                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Bed className="h-4 w-4" />
                          {property.bedrooms} Beds
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="h-4 w-4" />
                          {property.bathrooms} Baths
                        </span>
                        <span className="flex items-center gap-1">
                          <Ruler className="h-4 w-4" />
                          {property.area.toLocaleString()} sq ft
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground mt-2">
                        Saved on {new Date(property.savedAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex md:flex-col gap-2 shrink-0">
                      <Button size="sm" asChild>
                        <Link href={`/p/${property.id}`}>
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePriceAlert(property.id)}
                      >
                        {property.priceAlert ? (
                          <>
                            <BellOff className="h-4 w-4 mr-1" />
                            Remove Alert
                          </>
                        ) : (
                          <>
                            <Bell className="h-4 w-4 mr-1" />
                            Add Alert
                          </>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleRemove(property.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="collections" className="mt-6">
          <div className="grid md:grid-cols-3 gap-4">
            {MOCK_COLLECTIONS.map((collection) => (
              <Card
                key={collection.id}
                className="p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{collection.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {collection.count} properties
                    </p>
                  </div>
                </div>
              </Card>
            ))}

            {/* Add Collection */}
            <Card className="p-6 border-dashed hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center">
                  <Heart className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">Create Collection</h3>
                  <p className="text-sm text-muted-foreground">
                    Organize your saves
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
