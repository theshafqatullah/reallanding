"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/store/auth";
import { savedPropertiesService } from "@/services/saved-properties";
import { type Properties, type UserSavedProperties } from "@/types/appwrite";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import { toast } from "sonner";
import {
    Heart,
    MapPin,
    Building2,
    Trash2,
    ExternalLink,
    Star,
    MoreVertical,
    Edit,
    Home,
    ArrowRight,
} from "lucide-react";

interface SavedPropertyWithDetails extends UserSavedProperties {
    property?: Properties;
}

function formatPrice(price: number) {
    if (price >= 10000000) {
        return `${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
        return `${(price / 100000).toFixed(2)} Lac`;
    }
    return price.toLocaleString();
}

export default function SavedPropertiesClient() {
    const router = useRouter();
    const { user: authUser, isAuthenticated, loading: authLoading } = useAuth();

    const [savedProperties, setSavedProperties] = useState<SavedPropertyWithDetails[]>([]);
    const [filteredProperties, setFilteredProperties] = useState<SavedPropertyWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [sortBy, setSortBy] = useState<"recent" | "favorites" | "name">("recent");

    // Edit dialog states
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingProperty, setEditingProperty] = useState<SavedPropertyWithDetails | null>(null);
    const [editNotes, setEditNotes] = useState("");
    const [editFolder, setEditFolder] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Fetch saved properties
    const fetchSavedProperties = useCallback(async () => {
        if (!authUser) return;

        try {
            setLoading(true);
            const result = await savedPropertiesService.getUserSavedPropertiesWithDetails(authUser.$id, {
                limit: 1000,
            });
            setSavedProperties(result.savedProperties);
            setFilteredProperties(result.savedProperties);
        } catch (error) {
            console.error("Error fetching saved properties:", error);
            toast.error("Failed to load saved properties");
        } finally {
            setLoading(false);
        }
    }, [authUser]);

    // Apply filters and sorting
    useEffect(() => {
        let filtered = [...savedProperties];

        // Filter by search query
        if (searchQuery.trim()) {
            filtered = filtered.filter((sp) =>
                sp.property?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                sp.property?.city?.name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by favorites
        if (showFavoritesOnly) {
            filtered = filtered.filter((sp) => sp.is_favorite);
        }

        // Sort
        if (sortBy === "favorites") {
            filtered.sort((a, b) => (b.is_favorite ? 1 : -1));
        } else if (sortBy === "name") {
            filtered.sort((a, b) =>
                (a.property?.title || "").localeCompare(b.property?.title || "")
            );
        } else {
            // recent - sort by created date
            filtered.sort((a, b) =>
                new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
            );
        }

        setFilteredProperties(filtered);
    }, [savedProperties, searchQuery, showFavoritesOnly, sortBy]);

    // Load data on mount
    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            fetchSavedProperties();
        } else if (!authLoading && !isAuthenticated) {
            setLoading(false);
        }
    }, [authUser, authLoading, isAuthenticated, fetchSavedProperties]);

    // Handle remove property
    const handleRemoveProperty = async (savedPropertyId: string) => {
        try {
            await savedPropertiesService.delete(savedPropertyId);
            setSavedProperties((prev) =>
                prev.filter((sp) => sp.$id !== savedPropertyId)
            );
            toast.success("Property removed from saved");
        } catch (error) {
            console.error("Error removing property:", error);
            toast.error("Failed to remove property");
        }
    };

    // Handle toggle favorite
    const handleToggleFavorite = async (savedPropertyId: string, currentFavorite: boolean) => {
        try {
            await savedPropertiesService.update(savedPropertyId, {
                is_favorite: !currentFavorite,
            });
            setSavedProperties((prev) =>
                prev.map((sp) =>
                    sp.$id === savedPropertyId
                        ? { ...sp, is_favorite: !currentFavorite }
                        : sp
                )
            );
            toast.success(
                !currentFavorite ? "Added to favorites" : "Removed from favorites"
            );
        } catch (error) {
            console.error("Error toggling favorite:", error);
            toast.error("Failed to update favorite status");
        }
    };

    // Handle edit property notes
    const handleEditProperty = (property: SavedPropertyWithDetails) => {
        setEditingProperty(property);
        setEditNotes(property.notes || "");
        setEditFolder(property.folder_name || "");
        setEditDialogOpen(true);
    };

    // Handle save edited property
    const handleSaveEdit = async () => {
        if (!editingProperty) return;

        try {
            setIsSaving(true);
            await savedPropertiesService.update(editingProperty.$id, {
                notes: editNotes || null,
                folder_name: editFolder || null,
            });

            setSavedProperties((prev) =>
                prev.map((sp) =>
                    sp.$id === editingProperty.$id
                        ? {
                            ...sp,
                            notes: editNotes || null,
                            folder_name: editFolder || null,
                        }
                        : sp
                )
            );

            toast.success("Property updated successfully");
            setEditDialogOpen(false);
        } catch (error) {
            console.error("Error updating property:", error);
            toast.error("Failed to update property");
        } finally {
            setIsSaving(false);
        }
    };

    // Show loading state
    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner className="h-8 w-8" />
            </div>
        );
    }

    // Not authenticated
    if (!isAuthenticated) {
        return (
            <div className="container mx-auto max-w-7xl px-4 py-16">
                <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <Heart className="h-12 w-12 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4">Your Saved Properties</h1>
                    <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                        Sign in to view and manage your saved properties.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg">
                            <Link href="/signin">Sign In</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg">
                            <Link href="/properties">
                                Browse Properties
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const stats = {
        total: savedProperties.length,
        favorites: savedProperties.filter((sp) => sp.is_favorite).length,
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="container mx-auto max-w-7xl px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-2">
                                <Heart className="h-8 w-8 text-red-500 fill-red-500" />
                                Saved Properties
                            </h1>
                            <p className="text-muted-foreground mt-2">
                                {stats.total === 0
                                    ? "No saved properties yet. Start exploring!"
                                    : `You have ${stats.total} saved ${stats.total === 1 ? "property" : "properties"}`}
                            </p>
                        </div>
                        <Button asChild>
                            <Link href="/properties">
                                <Building2 className="h-4 w-4 mr-2" />
                                Browse More Properties
                            </Link>
                        </Button>
                    </div>

                    <Separator />
                </div>

                {savedProperties.length === 0 ? (
                    <Card className="text-center py-16">
                        <CardContent>
                            <Heart className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                            <h2 className="text-2xl font-bold mb-2">No Saved Properties Yet</h2>
                            <p className="text-muted-foreground mb-6">
                                Start exploring properties and save your favorites to view them here later.
                            </p>
                            <Button asChild>
                                <Link href="/properties">
                                    <Building2 className="h-4 w-4 mr-2" />
                                    Explore Properties
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {/* Stats and Controls */}
                        <Card className="mb-6">
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                                        <p className="text-3xl font-bold text-primary">
                                            {stats.total}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Total Saved
                                        </p>
                                    </div>
                                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                                        <p className="text-3xl font-bold text-red-500">
                                            {stats.favorites}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Favorites
                                        </p>
                                    </div>
                                    <div className="md:col-span-2 flex flex-col gap-2">
                                        <Input
                                            placeholder="Search properties by name or location..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        variant={showFavoritesOnly ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                                    >
                                        <Star className="h-4 w-4 mr-2" />
                                        Favorites Only
                                    </Button>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="sm">
                                                Sort by: {sortBy === "recent" ? "Recent" : sortBy === "favorites" ? "Favorites" : "Name"}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start">
                                            <DropdownMenuItem onClick={() => setSortBy("recent")}>
                                                {sortBy === "recent" && "✓ "}
                                                Recently Saved
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setSortBy("favorites")}>
                                                {sortBy === "favorites" && "✓ "}
                                                Favorites First
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setSortBy("name")}>
                                                {sortBy === "name" && "✓ "}
                                                Name (A-Z)
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Properties Grid */}
                        {filteredProperties.length === 0 ? (
                            <Card className="text-center py-12">
                                <CardContent>
                                    <Building2 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                                    <h3 className="font-medium text-lg">No properties found</h3>
                                    <p className="text-muted-foreground text-sm mt-1">
                                        Try adjusting your search or filters
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProperties.map((saved) => (
                                    <Card
                                        key={saved.$id}
                                        className="p-0 overflow-hidden transition-all flex flex-col"
                                    >
                                        {/* Property Image */}
                                        <Link
                                            href={`/p/${saved.property?.slug || saved.property?.$id}`}
                                            className="block"
                                        >
                                            <div className="relative h-48 bg-muted overflow-hidden">
                                                {saved.property?.cover_image_url ? (
                                                    <Image
                                                        src={saved.property.cover_image_url}
                                                        alt={saved.property.title || "Property"}
                                                        fill
                                                        className="object-cover hover:scale-105 transition-transform"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-muted">
                                                        <Building2 className="h-12 w-12 text-muted-foreground/50" />
                                                    </div>
                                                )}
                                                <Badge className="absolute top-2 left-2 bg-primary">
                                                    {saved.property?.listing_type?.name || "For Sale"}
                                                </Badge>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="absolute bottom-2 right-2 h-9 w-9 p-0"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleToggleFavorite(saved.$id, saved.is_favorite || false);
                                                    }}
                                                >
                                                    <Star
                                                        className="h-4 w-4"
                                                        fill={saved.is_favorite ? "currentColor" : "none"}
                                                    />
                                                </Button>
                                            </div>
                                        </Link>

                                        {/* Property Info */}
                                        <CardContent className="flex-1 flex flex-col pt-4">
                                            <Link
                                                href={`/p/${saved.property?.slug || saved.property?.$id}`}
                                                className="group"
                                            >
                                                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors truncate">
                                                    {saved.property?.title || "Property"}
                                                </h3>
                                            </Link>

                                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2 mb-3">
                                                <MapPin className="h-4 w-4 flex-shrink-0" />
                                                <span className="truncate">
                                                    {saved.property?.city?.name || "Location not set"}
                                                </span>
                                            </div>

                                            {/* Folder badge */}
                                            {saved.folder_name && (
                                                <Badge variant="outline" className="w-fit mb-2 text-xs">
                                                    {saved.folder_name}
                                                </Badge>
                                            )}

                                            {/* Price */}
                                            <div className="text-lg font-bold text-primary mb-3">
                                                {saved.property?.currency} {formatPrice(saved.property?.price || 0)}
                                            </div>

                                            {/* Notes preview */}
                                            {saved.notes && (
                                                <p className="text-xs text-muted-foreground mb-3 line-clamp-2 italic">
                                                    "{saved.notes}"
                                                </p>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="flex gap-2 mt-auto">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1"
                                                    asChild
                                                >
                                                    <Link href={`/p/${saved.property?.slug || saved.property?.$id}`}>
                                                        <ExternalLink className="h-4 w-4 mr-1" />
                                                        View
                                                    </Link>
                                                </Button>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="outline" size="sm" className="h-10 w-10 p-0">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={() => handleEditProperty(saved)}
                                                        >
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Edit Notes
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <DropdownMenuItem
                                                                    onSelect={(e) => e.preventDefault()}
                                                                    className="text-red-600"
                                                                >
                                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                                    Remove
                                                                </DropdownMenuItem>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Remove from Saved</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Are you sure you want to remove this property from your saved list?
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => handleRemoveProperty(saved.$id)}
                                                                        className="bg-red-600 hover:bg-red-700"
                                                                    >
                                                                        Remove
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* Edit Dialog */}
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Saved Property</DialogTitle>
                            <DialogDescription>
                                {editingProperty?.property?.title}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="folder">Folder</Label>
                                <Input
                                    id="folder"
                                    placeholder="e.g., To Visit, Interested, etc."
                                    value={editFolder}
                                    onChange={(e) => setEditFolder(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Add any notes about this property..."
                                    value={editNotes}
                                    onChange={(e) => setEditNotes(e.target.value)}
                                    rows={4}
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setEditDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleSaveEdit} disabled={isSaving}>
                                {isSaving ? <Spinner className="h-4 w-4 mr-2" /> : null}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
