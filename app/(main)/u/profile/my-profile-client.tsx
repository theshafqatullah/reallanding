"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/store/auth";
import { useAuth as useAppAuth } from "@/lib/auth-context";
import { usersService } from "@/services/users";
import { type Users, AvailabilityStatus, UserType } from "@/types/appwrite";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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
    User,
    Shield,
    Trash2,
    Save,
    ArrowRight,
    Home,
    Lock,
    LogOut,
    Monitor,
    Smartphone,
    Clock,
    ExternalLink,
    Mail,
    Edit2,
    Heart,
    Building2,
    AlertTriangle,
    Phone,
    MapPin,
    Globe,
    Star,
    CheckCircle,
    Briefcase,
    Eye,
    MessageCircle,
    Settings,
    Bell,
    CreditCard,
    FileText,
    TrendingUp,
    Award,
    Calendar,
    Share2,
    Linkedin,
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Camera,
    PenSquare,
    ChevronRight,
    Sparkles,
    Zap,
} from "lucide-react";
import { Models } from "appwrite";

export default function MyProfileClient() {
    const router = useRouter();
    const { user: appAuthUser, isLoading: appAuthLoading } = useAppAuth();
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

    const [sessions, setSessions] = useState<Models.Session[]>([]);
    const [profile, setProfile] = useState<Users | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Form states for CRUD operations
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isEditingName, setIsEditingName] = useState(false);


    // Get user label (role) from auth preferences
    const userLabel = appAuthUser?.labels?.[0]; // "agent", "agency", or other labels

    // Quick links for dashboard
    const quickLinks = [
        { icon: PenSquare, label: "Edit Profile", href: "/profile", description: "Update your information" },
        { icon: Heart, label: "Saved Properties", href: "/saved", description: "View saved listings" },
        { icon: Bell, label: "Notifications", href: "/notifications", description: "Manage alerts" },
        { icon: Shield, label: "Security", href: "/security", description: "Password & sessions" },
        { icon: FileText, label: "My Listings", href: "/listings", description: "Manage properties" },
        { icon: MessageCircle, label: "Messages", href: "/u/messages", description: "View conversations" },
    ];

    // Stats for the profile
    const profileStats = profile ? [
        { icon: Eye, label: "Profile Views", value: profile.profile_views || 0 },
        { icon: Home, label: "Active Listings", value: profile.active_listings || 0 },
        { icon: Star, label: "Rating", value: profile.rating > 0 ? profile.rating.toFixed(1) : "N/A" },
        { icon: CheckCircle, label: "Deals Closed", value: profile.deals_closed || 0 },
    ] : [];

    // Ensure component is mounted before rendering
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Fetch sessions, profile data and initialize form
    useEffect(() => {
        async function fetchData() {
            if (!authUser) return;

            try {
                setLoading(true);

                // Set auth data in form
                setName(authUser.name || "");
                setEmail(authUser.email || "");

                // Fetch sessions and user profile in parallel
                const [sessionsData, userProfile] = await Promise.all([
                    getSessions(),
                    usersService.getByUserId(authUser.$id),
                ]);

                setSessions(sessionsData);
                setProfile(userProfile);

            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to load profile data");
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

    // Handle name update (CREATE/UPDATE)
    const handleUpdateName = async () => {
        if (!name.trim()) {
            toast.error("Name cannot be empty");
            return;
        }
        if (name === authUser?.name) {
            toast.info("Name hasn't changed");
            setIsEditingName(false);
            return;
        }
        try {
            setSaving(true);
            await updateName({ name });
            toast.success("Name updated successfully");
            setIsEditingName(false);
        } catch (error) {
            console.error("Error updating name:", error);
            toast.error("Failed to update name");
        } finally {
            setSaving(false);
        }
    };

    // Handle password update (UPDATE)
    const handleUpdatePassword = async () => {
        if (!currentPassword.trim()) {
            toast.error("Current password is required");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }
        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }
        if (newPassword === currentPassword) {
            toast.error("New password must be different from current password");
            return;
        }
        try {
            setSaving(true);
            await updatePassword({ password: newPassword, oldPassword: currentPassword });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            toast.success("Password updated successfully");
        } catch (error) {
            console.error("Error updating password:", error);
            toast.error("Failed to update password. Check your current password.");
        } finally {
            setSaving(false);
        }
    };

    // Handle session deletion (DELETE)
    const handleDeleteSession = async (sessionId: string) => {
        try {
            await deleteSession(sessionId);
            setSessions(sessions.filter(s => s.$id !== sessionId));
            toast.success("Session terminated");
        } catch (error) {
            console.error("Error deleting session:", error);
            toast.error("Failed to terminate session");
        }
    };

    // Handle delete all sessions (DELETE)
    const handleDeleteAllSessions = async () => {
        try {
            await deleteAllSessions();
            // Re-fetch sessions since current session remains
            const newSessions = await getSessions();
            setSessions(newSessions);
            toast.success("All other sessions terminated");
        } catch (error) {
            console.error("Error deleting all sessions:", error);
            toast.error("Failed to terminate sessions");
        }
    };

    // Handle account deletion (DELETE)
    const handleDeleteAccount = async () => {
        try {
            await deleteAccount();
            toast.success("Account deleted successfully");
            router.push("/");
        } catch (error) {
            console.error("Error deleting account:", error);
            toast.error("Failed to delete account");
        }
    };

    // Show loading state
    if (!isMounted || authLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner className="h-8 w-8" />
            </div>
        );
    }

    // Not authenticated - show prompt to sign in or explore
    if (!isAuthenticated) {
        return (
            <div className="container mx-auto max-w-7xl px-4 py-16">
                <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <Home className="h-12 w-12 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4">Welcome to Real Landing</h1>
                    <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                        Find your dream property or connect with trusted agents. Sign in to view your profile.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
                </div>
            </div>
        );
    }

    // Authenticated user profile
    const fullName = profile
        ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || authUser?.name || "User"
        : authUser?.name || "User";

    const initials = fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U";

    const profileCompletion = profile?.profile_completion_percentage || 20;

    // Helper function to get availability status color
    const getAvailabilityColor = (status?: string) => {
        switch (status) {
            case AvailabilityStatus.AVAILABLE: return "bg-green-500";
            case AvailabilityStatus.BUSY: return "bg-yellow-500";
            case AvailabilityStatus.AWAY: return "bg-orange-500";
            default: return "bg-gray-400";
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Banner Section */}
            <div className="relative w-full h-48 md:h-64 bg-gradient-to-br from-primary/30 via-primary/10 to-accent/20">
                {profile?.banner_image_url ? (
                    <Image
                        src={profile.banner_image_url}
                        alt="Profile banner"
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/30" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

                {/* Edit Banner Button */}
                <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-4 right-4 opacity-80 hover:opacity-100"
                    asChild
                >
                    <Link href="/profile">
                        <Camera className="h-4 w-4 mr-2" />
                        Edit Banner
                    </Link>
                </Button>
            </div>

            <div className="container mx-auto max-w-7xl px-4">
                {/* Profile Header */}
                <div className="relative -mt-20 md:-mt-24 mb-8">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                        {/* Profile Image */}
                        <div className="relative group">
                            <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background ring-2 ring-border shadow-xl">
                                {profile?.profile_image_url ? (
                                    <AvatarImage src={profile.profile_image_url} alt={fullName} className="object-cover" />
                                ) : null}
                                <AvatarFallback className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            {/* Online Status */}
                            <div className={`absolute bottom-2 right-2 h-5 w-5 rounded-full ${getAvailabilityColor(profile?.availability_status)} border-2 border-background`} />
                            {/* Edit Avatar Overlay */}
                            <Link
                                href="/profile"
                                className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Camera className="h-8 w-8 text-white" />
                            </Link>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left pb-2">
                            <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                                    {fullName}
                                </h1>
                                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                    {profile?.is_verified && (
                                        <Badge className="gap-1 bg-primary/10 text-primary border-primary/20">
                                            <CheckCircle className="h-3 w-3" />
                                            Verified
                                        </Badge>
                                    )}
                                    {profile?.is_premium && (
                                        <Badge variant="secondary" className="gap-1">
                                            <Star className="h-3 w-3" />
                                            Premium
                                        </Badge>
                                    )}
                                    <Badge variant="outline">
                                        {profile?.user_type
                                            ? profile.user_type.charAt(0).toUpperCase() + profile.user_type.slice(1)
                                            : userLabel
                                                ? userLabel.charAt(0).toUpperCase() + userLabel.slice(1)
                                                : "User"}
                                    </Badge>
                                </div>
                            </div>

                            {profile?.designation && (
                                <p className="text-lg text-muted-foreground mb-1">{profile.designation}</p>
                            )}

                            {profile?.company_name && (
                                <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mb-2">
                                    <Building2 className="h-4 w-4" />
                                    <span>{profile.company_name}</span>
                                </div>
                            )}

                            <p className="text-muted-foreground text-sm">{authUser?.email}</p>

                            {profile?.tagline && (
                                <p className="mt-2 text-muted-foreground italic">&quot;{profile.tagline}&quot;</p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 pb-2">
                            <Button asChild>
                                <Link href="/profile">
                                    <Edit2 className="h-4 w-4 mr-2" />
                                    Edit Profile
                                </Link>
                            </Button>
                            {profile?.username && (
                                <Button variant="outline" asChild>
                                    <Link href={`/u/${profile.username}`} target="_blank">
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        View Public Profile
                                    </Link>
                                </Button>
                            )}
                            <Button variant="ghost" size="icon" onClick={() => signOut()}>
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Profile Completion Banner */}
                {profileCompletion < 100 && (
                    <Card className="mb-8 border-0 bg-gradient-to-r from-violet-50 to-blue-50 shadow-sm">
                        <CardContent className="py-4">
                            <div className="flex flex-col md:flex-row items-center gap-4">
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center">
                                        <Sparkles className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-foreground">Complete Your Profile</h3>
                                        <p className="text-sm text-muted-foreground">Add more details to stand out and get more visibility</p>
                                    </div>
                                </div>
                                <div className="w-full md:w-48">
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <span className="text-muted-foreground">Progress</span>
                                        <span className="font-semibold text-violet-600">{profileCompletion}%</span>
                                    </div>
                                    <Progress value={profileCompletion} className="h-2" />
                                </div>
                                <Button asChild size="sm" className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700">
                                    <Link href="/profile">
                                        Complete Now
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Stats Cards */}
                {profile && profileStats.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {profileStats.map((stat, index) => (
                            <Card key={index} className="p-4 text-center border border-border shadow-none">
                                <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center mx-auto mb-2">
                                    <stat.icon className="h-5 w-5 text-primary" />
                                </div>
                                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Quick Links Grid */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {quickLinks.map((link, index) => (
                            <Link key={index} href={link.href}>
                                <Card className="p-4 text-center border border-border shadow-none hover:border-primary/50 hover:-translate-y-1 transition-all duration-200 cursor-pointer h-full">
                                    <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-3">
                                        <link.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-foreground text-sm mb-1">{link.label}</h3>
                                    <p className="text-xs text-muted-foreground">{link.description}</p>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Main Content Tabs */}
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="mb-6 bg-muted/50 rounded-xl p-1 w-full sm:w-auto inline-grid grid-cols-4">
                        <TabsTrigger value="overview" className="gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                            <User className="h-4 w-4" />
                            <span className="hidden sm:inline">Overview</span>
                        </TabsTrigger>
                        <TabsTrigger value="account" className="gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                            <Settings className="h-4 w-4" />
                            <span className="hidden sm:inline">Account</span>
                        </TabsTrigger>
                        <TabsTrigger value="security" className="gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                            <Shield className="h-4 w-4" />
                            <span className="hidden sm:inline">Security</span>
                        </TabsTrigger>
                        <TabsTrigger value="sessions" className="gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                            <Monitor className="h-4 w-4" />
                            <span className="hidden sm:inline">Sessions</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Profile Details */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* About Section */}
                                {profile?.bio && (
                                    <Card className="border-0 shadow-lg">
                                        <CardHeader className="pb-4">
                                            <CardTitle className="flex items-center gap-2">
                                                <User className="h-5 w-5 text-primary" />
                                                About
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground whitespace-pre-wrap">{profile.bio}</p>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Specializations */}
                                {profile?.specializations && (
                                    <Card className="border-0 shadow-lg">
                                        <CardHeader className="pb-4">
                                            <CardTitle className="flex items-center gap-2">
                                                <Briefcase className="h-5 w-5 text-primary" />
                                                Specializations
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-wrap gap-2">
                                                {profile.specializations.split(",").map((spec, i) => (
                                                    <Badge key={i} variant="secondary" className="px-3 py-1">
                                                        {spec.trim()}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Service Areas */}
                                {profile?.service_areas && (
                                    <Card className="border-0 shadow-lg">
                                        <CardHeader className="pb-4">
                                            <CardTitle className="flex items-center gap-2">
                                                <MapPin className="h-5 w-5 text-primary" />
                                                Service Areas
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-wrap gap-2">
                                                {profile.service_areas.split(",").map((area, i) => (
                                                    <Badge key={i} className="px-3 py-1 bg-primary/10 text-primary border-primary/20">
                                                        <MapPin className="h-3 w-3 mr-1" />
                                                        {area.trim()}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Contact Info */}
                                <Card className="border-0 shadow-lg">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-2">
                                            <Phone className="h-5 w-5 text-primary" />
                                            Contact Info
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {profile?.email && (
                                            <div className="flex items-center gap-3">
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">{profile.email}</span>
                                            </div>
                                        )}
                                        {profile?.phone && (
                                            <div className="flex items-center gap-3">
                                                <Phone className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">{profile.phone}</span>
                                            </div>
                                        )}
                                        {(profile?.city || profile?.country) && (
                                            <div className="flex items-center gap-3">
                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">
                                                    {[profile.city, profile.state, profile.country].filter(Boolean).join(", ")}
                                                </span>
                                            </div>
                                        )}
                                        {profile?.website_url && (
                                            <div className="flex items-center gap-3">
                                                <Globe className="h-4 w-4 text-muted-foreground" />
                                                <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                                    Website
                                                </a>
                                            </div>
                                        )}

                                        {!profile?.phone && !profile?.city && !profile?.website_url && (
                                            <div className="text-center py-4">
                                                <p className="text-sm text-muted-foreground mb-3">Add your contact info to connect with clients</p>
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href="/profile">Add Contact Info</Link>
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Social Links */}
                                {(profile?.social_media_linkedin || profile?.social_media_facebook || profile?.social_media_instagram || profile?.social_media_twitter) && (
                                    <Card className="border-0 shadow-lg">
                                        <CardHeader className="pb-4">
                                            <CardTitle className="flex items-center gap-2">
                                                <Share2 className="h-5 w-5 text-primary" />
                                                Social Links
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-wrap gap-2">
                                                {profile.social_media_linkedin && (
                                                    <Button variant="outline" size="sm" asChild>
                                                        <a href={profile.social_media_linkedin} target="_blank" rel="noopener noreferrer">
                                                            <Linkedin className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                )}
                                                {profile.social_media_facebook && (
                                                    <Button variant="outline" size="sm" asChild>
                                                        <a href={profile.social_media_facebook} target="_blank" rel="noopener noreferrer">
                                                            <Facebook className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                )}
                                                {profile.social_media_instagram && (
                                                    <Button variant="outline" size="sm" asChild>
                                                        <a href={profile.social_media_instagram} target="_blank" rel="noopener noreferrer">
                                                            <Instagram className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                )}
                                                {profile.social_media_twitter && (
                                                    <Button variant="outline" size="sm" asChild>
                                                        <a href={profile.social_media_twitter} target="_blank" rel="noopener noreferrer">
                                                            <Twitter className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Professional Details */}
                                {(profile?.license_number || profile?.experience_years) && (
                                    <Card className="border-0 shadow-lg">
                                        <CardHeader className="pb-4">
                                            <CardTitle className="flex items-center gap-2">
                                                <Award className="h-5 w-5 text-primary" />
                                                Professional
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            {profile.license_number && (
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">License</span>
                                                    <span className="text-sm font-medium">{profile.license_number}</span>
                                                </div>
                                            )}
                                            {profile.experience_years > 0 && (
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Experience</span>
                                                    <span className="text-sm font-medium">{profile.experience_years} years</span>
                                                </div>
                                            )}
                                            {profile.team_size > 0 && (
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Team Size</span>
                                                    <span className="text-sm font-medium">{profile.team_size} members</span>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    {/* Account Tab - Profile Information (READ/UPDATE) */}
                    <TabsContent value="account" className="space-y-8">
                        <Card className="border-0 shadow-lg">
                            <CardHeader className="pb-6 border-b">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <User className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl">Account Information</CardTitle>
                                        <CardDescription>
                                            View and update your account details
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-8 pt-6">
                                {/* Email (Read-only) */}
                                <div className="space-y-3">
                                    <Label htmlFor="email" className="flex items-center gap-2 font-semibold text-base">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        Email Address
                                    </Label>
                                    <Input
                                        id="email"
                                        value={email}
                                        disabled
                                        className="bg-muted/50 cursor-not-allowed border-0"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Email cannot be changed. Contact support to update.
                                    </p>
                                </div>

                                <Separator />

                                {/* Full Name (Editable) */}
                                <div className="space-y-3">
                                    <Label htmlFor="name" className="flex items-center gap-2 font-semibold text-base">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        Full Name
                                    </Label>
                                    {isEditingName ? (
                                        <div className="flex gap-2">
                                            <Input
                                                id="name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Enter your full name"
                                                disabled={saving}
                                                className="border-primary/50"
                                            />
                                            <Button
                                                onClick={handleUpdateName}
                                                disabled={saving || name === authUser?.name || !name.trim()}
                                                size="sm"
                                                className="min-w-fit"
                                            >
                                                {saving ? <Spinner className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setIsEditingName(false);
                                                    setName(authUser?.name || "");
                                                }}
                                                size="sm"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2 items-center">
                                            <Input
                                                id="name"
                                                value={name}
                                                disabled
                                                className="bg-muted/50 cursor-not-allowed border-0"
                                            />
                                            <Button
                                                variant="outline"
                                                onClick={() => setIsEditingName(true)}
                                                size="sm"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Update your display name that appears across the platform.
                                    </p>
                                </div>

                                <Separator />

                                {/* Account Metadata Grid */}
                                <div className="grid md:grid-cols-3 gap-6 pt-4">
                                    <div className="p-6 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200">
                                        <Label className="text-xs font-semibold text-blue-900 uppercase tracking-widest">
                                            Account Created
                                        </Label>
                                        <p className="text-lg font-bold text-blue-900 mt-3">
                                            {authUser?.$createdAt
                                                ? new Date(authUser.$createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })
                                                : 'Unknown'
                                            }
                                        </p>
                                    </div>
                                    <div className="p-6 rounded-lg bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200">
                                        <Label className="text-xs font-semibold text-green-900 uppercase tracking-widest">
                                            Account Status
                                        </Label>
                                        <Badge className="mt-3 bg-green-600 hover:bg-green-700">
                                            <span className="w-2 h-2 bg-green-300 rounded-full mr-2"></span>
                                            Active
                                        </Badge>
                                    </div>
                                    <div className="p-6 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200">
                                        <Label className="text-xs font-semibold text-purple-900 uppercase tracking-widest">
                                            User Type
                                        </Label>
                                        <Badge variant="outline" className="mt-3">Regular User</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Security Tab - Password Update */}
                    <TabsContent value="security" className="space-y-8">
                        <Card className="border-0 shadow-lg">
                            <CardHeader className="pb-6 border-b">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                                        <Lock className="h-6 w-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl">Password & Security</CardTitle>
                                        <CardDescription>
                                            Update your password and security settings
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="currentPassword" className="flex items-center gap-2 font-semibold">
                                            <Lock className="h-4 w-4 text-muted-foreground" />
                                            Current Password
                                        </Label>
                                        <Input
                                            id="currentPassword"
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="Enter current password"
                                            className="border-border"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword" className="flex items-center gap-2 font-semibold">
                                            <Shield className="h-4 w-4 text-muted-foreground" />
                                            New Password
                                        </Label>
                                        <Input
                                            id="newPassword"
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter new password (min 8 characters)"
                                            className="border-border"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword" className="flex items-center gap-2 font-semibold">
                                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                                            Confirm New Password
                                        </Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm new password"
                                            className="border-border"
                                        />
                                    </div>
                                </div>

                                <Button
                                    onClick={handleUpdatePassword}
                                    disabled={saving || !currentPassword || !newPassword || !confirmPassword}
                                    className="w-full h-11"
                                >
                                    {saving ? (
                                        <>
                                            <Spinner className="h-4 w-4 mr-2" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Update Password
                                        </>
                                    )}
                                </Button>

                                <div className="bg-muted/50 rounded-lg p-4">
                                    <h4 className="font-semibold text-sm mb-2">Password Requirements:</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-3 w-3 text-green-500" />
                                            Minimum 8 characters
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-3 w-3 text-green-500" />
                                            Must be different from current password
                                        </li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Sessions Tab - Active Sessions Management (READ/DELETE) */}
                    <TabsContent value="sessions" className="space-y-8">
                        <Card className="border-0 shadow-lg">
                            <CardHeader className="pb-6 border-b">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-lg bg-cyan-100 flex items-center justify-center">
                                        <Monitor className="h-6 w-6 text-cyan-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl">Active Sessions</CardTitle>
                                        <CardDescription>
                                            Manage all your active login sessions
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">
                                {sessions.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                                            <Monitor className="h-8 w-8 text-muted-foreground/50" />
                                        </div>
                                        <p className="text-muted-foreground text-lg">No active sessions found</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-4 max-h-[500px] overflow-y-auto">
                                            {sessions.map((session) => (
                                                <div
                                                    key={session.$id}
                                                    className="flex items-center justify-between p-5 border border-slate-200 rounded-lg hover:bg-slate-50/50 transition-all hover:border-slate-300"
                                                >
                                                    <div className="flex items-center gap-4 flex-1">
                                                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center flex-shrink-0">
                                                            {session.deviceName?.toLowerCase().includes("mobile") ? (
                                                                <Smartphone className="h-5 w-5 text-cyan-600" />
                                                            ) : (
                                                                <Monitor className="h-5 w-5 text-blue-600" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <p className="text-sm font-semibold truncate">
                                                                    {session.clientName || "Unknown Browser"}
                                                                </p>
                                                                {session.current && (
                                                                    <Badge className="bg-green-600 text-xs flex-shrink-0">
                                                                        <span className="w-1.5 h-1.5 bg-green-300 rounded-full mr-1.5"></span>
                                                                        Current
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-muted-foreground">
                                                                {session.ip} • {session.countryName || "Unknown Location"}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                Last active: {new Date(session.$updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {!session.current && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDeleteSession(session.$id)}
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-4 flex-shrink-0"
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
                                                className="w-full border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50 h-11"
                                                onClick={handleDeleteAllSessions}
                                            >
                                                <LogOut className="h-4 w-4 mr-2" />
                                                Sign Out All Other Sessions
                                            </Button>
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Danger Zone - Account Deletion */}
                <div className="mt-16 pb-8">
                    <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-50/50 shadow-lg">
                        <CardHeader className="pb-6 border-b border-red-200">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                                    <AlertTriangle className="h-6 w-6 text-red-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl text-red-600">Danger Zone</CardTitle>
                                    <CardDescription className="text-red-700">
                                        Irreversible and destructive actions
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 border-2 border-red-200 rounded-lg bg-white/50">
                                <div>
                                    <h4 className="font-bold text-lg text-red-900">Delete Your Account</h4>
                                    <p className="text-sm text-red-700 mt-2 leading-relaxed">
                                        Permanently delete your account and all associated data. This action cannot be undone.
                                    </p>
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" className="flex-shrink-0 h-11 gap-2">
                                            <Trash2 className="h-4 w-4" />
                                            Delete Account
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="max-w-md">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="flex items-center gap-2 text-red-600 text-lg">
                                                <AlertTriangle className="h-6 w-6" />
                                                Delete Account?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete your account and remove all data from our servers.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800 space-y-3">
                                            <p className="font-bold">Your data will be permanently deleted:</p>
                                            <ul className="list-disc list-inside space-y-2 ml-2">
                                                <li>Account profile information</li>
                                                <li>Saved properties</li>
                                                <li>Inquiries and messages</li>
                                                <li>All authentication tokens</li>
                                            </ul>
                                        </div>
                                        <AlertDialogFooter className="gap-2">
                                            <AlertDialogCancel className="h-10">Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={handleDeleteAccount}
                                                className="bg-red-600 hover:bg-red-700 h-10"
                                            >
                                                Yes, delete permanently
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
