"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/store/auth";
import { usersService } from "@/services/users";
import { savedPropertiesService } from "@/services/saved-properties";
import { inquiriesService } from "@/services/inquiries";
import { type Users, type UserSavedProperties, type PropertyInquiries, type Properties } from "@/types/appwrite";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    MapPin,
    Building2,
    Heart,
    MessageCircle,
    User,
    Shield,
    Trash2,
    Save,
    Eye,
    ArrowRight,
    Home,
    Lock,
    LogOut,
    Monitor,
    Smartphone,
    Clock,
    ExternalLink,
} from "lucide-react";
import { Models } from "appwrite";

export default function MyProfileClient() {
    const router = useRouter();
    const {
        user: authUser,
        isAuthenticated,
        loading: authLoading,
        updateName,
        updatePassword,
        deleteAccount,
        getSessions,
        deleteSession,
        deleteAllSessions,
        signOut,
    } = useAuth();

    const [userProfile, setUserProfile] = useState<Users | null>(null);
    const [savedProperties, setSavedProperties] = useState<(UserSavedProperties & { property?: Properties })[]>([]);
    const [sentInquiries, setSentInquiries] = useState<PropertyInquiries[]>([]);
    const [sessions, setSessions] = useState<Models.Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form states
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        async function fetchData() {
            if (!authUser) return;

            try {
                setLoading(true);

                // Fetch user profile
                const profile = await usersService.getByUserId(authUser.$id);
                setUserProfile(profile);

                // Set form values
                setName(authUser.name || "");
                setEmail(authUser.email || "");
                setPhone(authUser.phone || "");

                // Fetch saved properties
                const savedResult = await savedPropertiesService.getUserSavedPropertiesWithDetails(
                    authUser.$id,
                    { limit: 6 }
                );
                setSavedProperties(savedResult.savedProperties);

                // Fetch sent inquiries
                const inquiriesResult = await inquiriesService.getSentInquiries(
                    authUser.$id,
                    { limit: 5 }
                );
                setSentInquiries(inquiriesResult.inquiries);

                // Fetch sessions
                const sessionsData = await getSessions();
                setSessions(sessionsData);

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        }

        if (!authLoading && isAuthenticated) {
            fetchData();
        } else if (!authLoading && !isAuthenticated) {
            setLoading(false);
        }
    }, [authUser, authLoading, isAuthenticated, getSessions]);

    // Handle name update
    const handleUpdateName = async () => {
        if (!name.trim()) {
            toast.error("Name cannot be empty");
            return;
        }
        try {
            setSaving(true);
            await updateName({ name });
            toast.success("Name updated successfully");
        } catch {
            toast.error("Failed to update name");
        } finally {
            setSaving(false);
        }
    };

    // Handle password update
    const handleUpdatePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }
        try {
            setSaving(true);
            await updatePassword({ password: newPassword, oldPassword: currentPassword });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            toast.success("Password updated successfully");
        } catch {
            toast.error("Failed to update password. Check your current password.");
        } finally {
            setSaving(false);
        }
    };

    // Handle session deletion
    const handleDeleteSession = async (sessionId: string) => {
        try {
            await deleteSession(sessionId);
            setSessions(sessions.filter(s => s.$id !== sessionId));
            toast.success("Session terminated");
        } catch {
            toast.error("Failed to terminate session");
        }
    };

    // Handle delete all sessions
    const handleDeleteAllSessions = async () => {
        try {
            await deleteAllSessions();
            // Re-fetch sessions since current session remains
            const newSessions = await getSessions();
            setSessions(newSessions);
            toast.success("All other sessions terminated");
        } catch {
            toast.error("Failed to terminate sessions");
        }
    };

    // Handle account deletion
    const handleDeleteAccount = async () => {
        try {
            await deleteAccount();
            toast.success("Account deleted successfully");
            router.push("/");
        } catch {
            toast.error("Failed to delete account");
        }
    };

    // Remove saved property
    const handleRemoveSavedProperty = async (savedPropertyId: string) => {
        try {
            await savedPropertiesService.delete(savedPropertyId);
            setSavedProperties(savedProperties.filter(sp => sp.$id !== savedPropertyId));
            toast.success("Property removed from saved");
        } catch {
            toast.error("Failed to remove property");
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

    // Not authenticated - show prompt to sign in or explore
    if (!isAuthenticated) {
        return (
            <div className="container mx-auto max-w-4xl px-4 py-16">
                <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <Home className="h-12 w-12 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4">Welcome to Real Landing</h1>
                    <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                        Find your dream property or connect with trusted agents. Sign in to view your profile or explore our listings.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Button asChild size="lg">
                            <Link href="/signin">Sign In</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg">
                            <Link href="/properties">
                                Explore Properties
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>

                    <Separator className="my-8" />

                    {/* Features for guests */}
                    <div className="grid md:grid-cols-3 gap-6 text-left mt-8">
                        <Card>
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-2">
                                    <Building2 className="h-6 w-6 text-blue-600" />
                                </div>
                                <CardTitle className="text-lg">Browse Listings</CardTitle>
                            </CardHeader>
                            <CardContent className="text-muted-foreground">
                                Explore thousands of properties for sale and rent in your area.
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-2">
                                    <Heart className="h-6 w-6 text-green-600" />
                                </div>
                                <CardTitle className="text-lg">Save Favorites</CardTitle>
                            </CardHeader>
                            <CardContent className="text-muted-foreground">
                                Create an account to save your favorite properties and get updates.
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-2">
                                    <MessageCircle className="h-6 w-6 text-purple-600" />
                                </div>
                                <CardTitle className="text-lg">Connect with Agents</CardTitle>
                            </CardHeader>
                            <CardContent className="text-muted-foreground">
                                Get in touch with verified agents to help you find the perfect home.
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    // Always use name from Appwrite account, not from users collection
    const fullName = authUser?.name || "User";

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="container mx-auto max-w-6xl px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-2 border-white shadow-md">
                            <AvatarImage src={userProfile?.profile_image_url || undefined} alt={fullName} />
                            <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                                {fullName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-2xl font-bold">{fullName}</h1>
                            <p className="text-muted-foreground">{authUser?.email}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/properties">
                                <Building2 className="h-4 w-4 mr-2" />
                                Browse Properties
                            </Link>
                        </Button>
                        <Button variant="ghost" onClick={() => signOut()}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
                        <TabsTrigger value="overview" className="gap-2">
                            <User className="h-4 w-4 hidden sm:block" />
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="saved" className="gap-2">
                            <Heart className="h-4 w-4 hidden sm:block" />
                            Saved
                        </TabsTrigger>
                        <TabsTrigger value="inquiries" className="gap-2">
                            <MessageCircle className="h-4 w-4 hidden sm:block" />
                            Inquiries
                        </TabsTrigger>
                        <TabsTrigger value="security" className="gap-2">
                            <Shield className="h-4 w-4 hidden sm:block" />
                            Security
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Profile Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Profile Information
                                    </CardTitle>
                                    <CardDescription>
                                        Update your account details
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Your name"
                                            />
                                            <Button
                                                onClick={handleUpdateName}
                                                disabled={saving || name === authUser?.name}
                                            >
                                                <Save className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            value={email}
                                            disabled
                                            className="bg-muted"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Contact support to change your email
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="+1 (555) 000-0000"
                                            disabled
                                            className="bg-muted"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Phone verification coming soon
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Stats */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Eye className="h-5 w-5" />
                                        Your Activity
                                    </CardTitle>
                                    <CardDescription>
                                        Your engagement on the platform
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                                            <Heart className="h-6 w-6 mx-auto mb-2 text-red-500" />
                                            <p className="text-2xl font-bold">{savedProperties.length}</p>
                                            <p className="text-xs text-muted-foreground">Saved Properties</p>
                                        </div>
                                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                                            <MessageCircle className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                                            <p className="text-2xl font-bold">{sentInquiries.length}</p>
                                            <p className="text-xs text-muted-foreground">Inquiries Sent</p>
                                        </div>
                                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                                            <Monitor className="h-6 w-6 mx-auto mb-2 text-green-500" />
                                            <p className="text-2xl font-bold">{sessions.length}</p>
                                            <p className="text-xs text-muted-foreground">Active Sessions</p>
                                        </div>
                                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                                            <Clock className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                                            <p className="text-2xl font-bold">
                                                {authUser?.$createdAt
                                                    ? new Date(authUser.$createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                                                    : '-'
                                                }
                                            </p>
                                            <p className="text-xs text-muted-foreground">Member Since</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Saved Properties Preview */}
                        {savedProperties.length > 0 && (
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Recent Saved Properties</CardTitle>
                                        <CardDescription>Properties you&apos;ve saved for later</CardDescription>
                                    </div>
                                    <Button variant="ghost" asChild size="sm">
                                        <Link href="#" onClick={() => document.querySelector('[value="saved"]')?.dispatchEvent(new Event('click'))}>
                                            View All
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {savedProperties.slice(0, 3).map((saved) => (
                                            <div key={saved.$id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                                <div className="relative h-32 bg-muted">
                                                    {saved.property?.cover_image_url && (
                                                        <Image
                                                            src={saved.property.cover_image_url}
                                                            alt={saved.property.title || "Property"}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    )}
                                                    <Badge className="absolute top-2 left-2 bg-red-500">
                                                        <Heart className="h-3 w-3 mr-1 fill-current" />
                                                        Saved
                                                    </Badge>
                                                </div>
                                                <div className="p-3">
                                                    <h4 className="font-medium text-sm truncate">
                                                        {saved.property?.title || "Property"}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                        <MapPin className="h-3 w-3" />
                                                        {saved.property?.city?.name || "Location"}
                                                    </p>
                                                    <p className="font-bold text-primary mt-2 text-sm">
                                                        {saved.property?.currency} {saved.property?.price?.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Saved Properties Tab */}
                    <TabsContent value="saved" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Heart className="h-5 w-5 text-red-500" />
                                    Saved Properties
                                </CardTitle>
                                <CardDescription>
                                    Properties you&apos;ve saved to view later
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {savedProperties.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Heart className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                                        <h3 className="font-medium mb-2">No Saved Properties</h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Start exploring and save properties you like!
                                        </p>
                                        <Button asChild>
                                            <Link href="/properties">Browse Properties</Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {savedProperties.map((saved) => (
                                            <div key={saved.$id} className="group border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                                <Link href={`/p/${saved.property?.slug || saved.property?.$id}`}>
                                                    <div className="relative h-40 bg-muted">
                                                        {saved.property?.cover_image_url && (
                                                            <Image
                                                                src={saved.property.cover_image_url}
                                                                alt={saved.property.title || "Property"}
                                                                fill
                                                                className="object-cover group-hover:scale-105 transition-transform"
                                                            />
                                                        )}
                                                        <Badge className="absolute top-2 left-2 bg-primary">
                                                            {saved.property?.listing_type?.name || "For Sale"}
                                                        </Badge>
                                                    </div>
                                                </Link>
                                                <div className="p-3">
                                                    <Link href={`/p/${saved.property?.slug || saved.property?.$id}`}>
                                                        <h4 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                                                            {saved.property?.title || "Property"}
                                                        </h4>
                                                    </Link>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                        <MapPin className="h-3 w-3" />
                                                        {saved.property?.city?.name || "Location not set"}
                                                    </p>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <p className="font-bold text-primary">
                                                            {saved.property?.currency} {saved.property?.price?.toLocaleString()}
                                                        </p>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                            onClick={() => handleRemoveSavedProperty(saved.$id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    {saved.notes && (
                                                        <p className="text-xs text-muted-foreground mt-2 italic truncate">
                                                            Note: {saved.notes}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Inquiries Tab */}
                    <TabsContent value="inquiries" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageCircle className="h-5 w-5 text-blue-500" />
                                    Your Inquiries
                                </CardTitle>
                                <CardDescription>
                                    Messages you&apos;ve sent to property owners and agents
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {sentInquiries.length === 0 ? (
                                    <div className="text-center py-12">
                                        <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                                        <h3 className="font-medium mb-2">No Inquiries Yet</h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Start exploring properties and send inquiries to learn more!
                                        </p>
                                        <Button asChild>
                                            <Link href="/properties">Find Properties</Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {sentInquiries.map((inquiry) => (
                                            <div key={inquiry.$id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-medium truncate">
                                                                {inquiry.subject || "Property Inquiry"}
                                                            </h4>
                                                            <Badge variant={
                                                                inquiry.status === "responded" ? "default" :
                                                                    inquiry.status === "pending" ? "secondary" :
                                                                        "outline"
                                                            }>
                                                                {inquiry.status || "Pending"}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                                            {inquiry.message}
                                                        </p>
                                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {new Date(inquiry.$createdAt).toLocaleDateString()}
                                                            </span>
                                                            {inquiry.inquiry_type && (
                                                                <Badge variant="outline" className="text-xs">
                                                                    {inquiry.inquiry_type}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/p/${inquiry.property_id}`}>
                                                            <ExternalLink className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Security Tab */}
                    <TabsContent value="security" className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Change Password */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Lock className="h-5 w-5" />
                                        Change Password
                                    </CardTitle>
                                    <CardDescription>
                                        Update your account password
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="currentPassword">Current Password</Label>
                                        <Input
                                            id="currentPassword"
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="Enter current password"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <Input
                                            id="newPassword"
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter new password"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                    <Button
                                        onClick={handleUpdatePassword}
                                        disabled={saving || !currentPassword || !newPassword || !confirmPassword}
                                        className="w-full"
                                    >
                                        Update Password
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Active Sessions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Monitor className="h-5 w-5" />
                                        Active Sessions
                                    </CardTitle>
                                    <CardDescription>
                                        Manage your active login sessions
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 max-h-64 overflow-y-auto">
                                        {sessions.map((session) => (
                                            <div key={session.$id} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    {session.deviceName?.toLowerCase().includes("mobile") ? (
                                                        <Smartphone className="h-5 w-5 text-muted-foreground" />
                                                    ) : (
                                                        <Monitor className="h-5 w-5 text-muted-foreground" />
                                                    )}
                                                    <div>
                                                        <p className="text-sm font-medium">
                                                            {session.clientName || "Unknown Browser"}
                                                            {session.current && (
                                                                <Badge variant="secondary" className="ml-2 text-xs">
                                                                    Current
                                                                </Badge>
                                                            )}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {session.ip} • {session.countryName || "Unknown location"}
                                                        </p>
                                                    </div>
                                                </div>
                                                {!session.current && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteSession(session.$id)}
                                                    >
                                                        <LogOut className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    {sessions.length > 1 && (
                                        <Button
                                            variant="outline"
                                            className="w-full mt-4"
                                            onClick={handleDeleteAllSessions}
                                        >
                                            Sign Out All Other Devices
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Danger Zone */}
                        <Card className="border-red-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-red-600">
                                    <Trash2 className="h-5 w-5" />
                                    Danger Zone
                                </CardTitle>
                                <CardDescription>
                                    Irreversible and destructive actions
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50/50">
                                    <div>
                                        <h4 className="font-medium text-red-900">Delete Account</h4>
                                        <p className="text-sm text-red-700">
                                            Permanently delete your account and all associated data
                                        </p>
                                    </div>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive">
                                                Delete Account
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete your
                                                    account and remove all your data from our servers, including:
                                                    <ul className="list-disc list-inside mt-2 space-y-1">
                                                        <li>Your saved properties</li>
                                                        <li>Your inquiries and messages</li>
                                                        <li>Your profile information</li>
                                                    </ul>
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={handleDeleteAccount}
                                                    className="bg-red-600 hover:bg-red-700"
                                                >
                                                    Yes, delete my account
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
