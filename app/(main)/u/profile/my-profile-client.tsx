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
        <div className="min-h-screen bg-gray-50/50">
            <div className="container mx-auto max-w-6xl px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-2 border-white shadow-md">
                            <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                                {fullName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-2xl font-bold">{fullName}</h1>
                            <p className="text-muted-foreground">{authUser?.email}</p>
                            <Badge variant="outline" className="mt-2">
                                Regular User
                            </Badge>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/properties">
                                <Building2 className="h-4 w-4 mr-2" />
                                Browse Properties
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/u/saved">
                                <Heart className="h-4 w-4 mr-2" />
                                Saved Properties
                            </Link>
                        </Button>
                        <Button variant="ghost" onClick={() => signOut()}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>
                </div>

                <Separator className="mb-8" />

                {/* Tabs */}
                <Tabs defaultValue="account" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
                        <TabsTrigger value="account" className="gap-2">
                            <User className="h-4 w-4 hidden sm:block" />
                            Account
                        </TabsTrigger>
                        <TabsTrigger value="security" className="gap-2">
                            <Shield className="h-4 w-4 hidden sm:block" />
                            Security
                        </TabsTrigger>
                        <TabsTrigger value="sessions" className="gap-2">
                            <Monitor className="h-4 w-4 hidden sm:block" />
                            Sessions
                        </TabsTrigger>
                    </TabsList>

                    {/* Account Tab - Profile Information (READ/UPDATE) */}
                    <TabsContent value="account" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Account Information
                                </CardTitle>
                                <CardDescription>
                                    View and update your account details from Appwrite authentication
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Email (Read-only) */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        Email Address
                                    </Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="email"
                                            value={email}
                                            disabled
                                            className="bg-muted cursor-not-allowed"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Email cannot be changed. Contact support to update.
                                    </p>
                                </div>

                                <Separator />

                                {/* Full Name (Editable) */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="flex items-center gap-2">
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
                                            />
                                            <Button
                                                onClick={handleUpdateName}
                                                disabled={saving || name === authUser?.name || !name.trim()}
                                                size="sm"
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
                                                className="bg-muted cursor-not-allowed"
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

                                {/* Account Metadata */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase">
                                            Account Created
                                        </Label>
                                        <p className="text-sm font-medium">
                                            {authUser?.$createdAt
                                                ? new Date(authUser.$createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })
                                                : 'Unknown'
                                            }
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase">
                                            User ID
                                        </Label>
                                        <p className="text-sm font-mono text-muted-foreground truncate">
                                            {authUser?.$id}
                                        </p>
                                    </div>
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
                        </Card>
                    </TabsContent>

                    {/* Security Tab - Password Management (UPDATE) */}
                    <TabsContent value="security" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Lock className="h-5 w-5" />
                                    Change Password
                                </CardTitle>
                                <CardDescription>
                                    Update your account password for security
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
                                        placeholder="Enter your current password"
                                        disabled={saving}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter a new password (minimum 8 characters)"
                                        disabled={saving}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm your new password"
                                        disabled={saving}
                                    />
                                </div>

                                <Button
                                    onClick={handleUpdatePassword}
                                    disabled={saving || !currentPassword || !newPassword || !confirmPassword}
                                    className="w-full"
                                >
                                    {saving ? <Spinner className="h-4 w-4 mr-2" /> : <Lock className="h-4 w-4 mr-2" />}
                                    Update Password
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Sessions Tab - Active Sessions Management (READ/DELETE) */}
                    <TabsContent value="sessions" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Monitor className="h-5 w-5" />
                                    Active Sessions
                                </CardTitle>
                                <CardDescription>
                                    Manage all your active login sessions
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {sessions.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Monitor className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                                        <p className="text-muted-foreground">No active sessions found</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-3 max-h-96 overflow-y-auto">
                                            {sessions.map((session) => (
                                                <div
                                                    key={session.$id}
                                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {session.deviceName?.toLowerCase().includes("mobile") ? (
                                                            <Smartphone className="h-5 w-5 text-blue-500" />
                                                        ) : (
                                                            <Monitor className="h-5 w-5 text-blue-500" />
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-sm font-medium truncate">
                                                                    {session.clientName || "Unknown Browser"}
                                                                </p>
                                                                {session.current && (
                                                                    <Badge variant="secondary" className="text-xs flex-shrink-0">
                                                                        Current Device
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-muted-foreground">
                                                                {session.ip} • {session.countryName || "Unknown"}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                Last active: {new Date(session.$updatedAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {!session.current && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDeleteSession(session.$id)}
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
                                                className="w-full border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50"
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
                <div className="mt-12">
                    <Card className="border-red-200 bg-red-50/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-600">
                                <AlertTriangle className="h-5 w-5" />
                                Danger Zone
                            </CardTitle>
                            <CardDescription>
                                Irreversible and destructive actions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-red-200 rounded-lg">
                                <div>
                                    <h4 className="font-semibold text-red-900">Delete Your Account</h4>
                                    <p className="text-sm text-red-700 mt-1">
                                        Permanently delete your account and all associated data. This cannot be undone.
                                    </p>
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" className="flex-shrink-0">
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete Account
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="max-w-md">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                                                <AlertTriangle className="h-5 w-5" />
                                                Delete Account?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete your account and remove all data from our servers.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-800 space-y-2">
                                            <p className="font-semibold">Your data will be deleted:</p>
                                            <ul className="list-disc list-inside space-y-1">
                                                <li>Account profile information</li>
                                                <li>Saved properties</li>
                                                <li>Inquiries and messages</li>
                                                <li>All authentication tokens</li>
                                            </ul>
                                        </div>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={handleDeleteAccount}
                                                className="bg-red-600 hover:bg-red-700"
                                            >
                                                Yes, delete my account permanently
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
