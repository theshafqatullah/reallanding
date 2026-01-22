"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/store/auth";
import { type UserType } from "@/types/appwrite";
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

    const [sessions, setSessions] = useState<Models.Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form states for CRUD operations
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isEditingName, setIsEditingName] = useState(false);

    // Fetch sessions and initialize form
    useEffect(() => {
        async function fetchData() {
            if (!authUser) return;

            try {
                setLoading(true);

                // Set auth data in form
                setName(authUser.name || "");
                setEmail(authUser.email || "");

                // Fetch sessions
                const sessionsData = await getSessions();
                setSessions(sessionsData);

            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to load session data");
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
    const fullName = authUser?.name || "User";

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
            {/* Hero Header Section */}
            <div className="w-full border-b bg-white">
                <div className="container mx-auto max-w-7xl px-4 py-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <Avatar className="h-24 w-24 border-3 border-primary shadow-lg">
                                    <AvatarFallback className="text-3xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold">
                                        {fullName.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-md"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{fullName}</h1>
                                <p className="text-muted-foreground text-sm md:text-base mt-1">{authUser?.email}</p>
                                <div className="flex items-center gap-3 mt-3 flex-wrap">
                                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                        <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                                        Active Account
                                    </Badge>
                                    <Badge variant="outline">Regular User</Badge>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
                                <Link href="/properties">
                                    <Building2 className="h-4 w-4 mr-2" />
                                    Browse
                                </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
                                <Link href="/u/saved">
                                    <Heart className="h-4 w-4 mr-2" />
                                    Saved
                                </Link>
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => signOut()} className="hidden sm:inline-flex">
                                <LogOut className="h-4 w-4 mr-2" />
                                Sign Out
                            </Button>
                            <Button asChild size="sm" className="sm:hidden flex-1">
                                <Link href="/properties">
                                    <Building2 className="h-4 w-4 mr-2" />
                                    Browse
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto max-w-7xl px-4 py-12">
                {/* Tabs */}
                <Tabs defaultValue="account" className="w-full">
                    <div className="mb-8 overflow-x-auto">
                        <TabsList className="inline-grid grid-cols-3 w-full sm:w-auto bg-muted/50 rounded-xl p-1">
                            <TabsTrigger value="account" className="gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                <User className="h-4 w-4" />
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
                    </div>

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

            {/* Account Status */}
            <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase">
                    Account Status
                </Label>
                <div className="flex items-center gap-2">
                    <Badge className="bg-green-600">
                        Active
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                        Your account is in good standing
                    </span>
                </div>
            </div>
        </CardContent>
                        </Card >
                    </TabsContent >

        {/* Security Tab - Password Management (UPDATE) */ }
        < TabsContent value = "security" className = "space-y-8" >
            <Card className="border-0 shadow-lg">
                <CardHeader className="pb-6 border-b">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                            <Lock className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl">Change Password</CardTitle>
                            <CardDescription>
                                Update your account password for security
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="space-y-3">
                        <Label htmlFor="currentPassword" className="font-semibold">Current Password</Label>
                        <Input
                            id="currentPassword"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter your current password"
                            disabled={saving}
                            className="border-0 bg-muted/50"
                        />
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="newPassword" className="font-semibold">New Password</Label>
                        <Input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter a new password (minimum 8 characters)"
                            disabled={saving}
                            className="border-0 bg-muted/50"
                        />
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="confirmPassword" className="font-semibold">Confirm New Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your new password"
                            disabled={saving}
                            className="border-0 bg-muted/50"
                        />
                    </div>

                    <Button
                        onClick={handleUpdatePassword}
                        disabled={saving || !currentPassword || !newPassword || !confirmPassword}
                        className="w-full h-11 text-base"
                    >
                        {saving ? <Spinner className="h-4 w-4 mr-2" /> : <Lock className="h-4 w-4 mr-2" />}
                        Update Password
                    </Button>
                </CardContent>
            </Card>
                    </TabsContent >

        {/* Sessions Tab - Active Sessions Management (READ/DELETE) */ }
        < TabsContent value = "sessions" className = "space-y-8" >
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
                    </TabsContent >
                </Tabs >

        {/* Danger Zone - Account Deletion */ }
        < div className = "mt-16 pb-8" >
            <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-50/50 shadow-lg border-0">
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
                </div >
            </div >
        </div >
    );
}
