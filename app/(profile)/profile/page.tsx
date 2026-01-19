"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/store/auth";
import { databases } from "@/services/appwrite";
import { usersService } from "@/services/users";
import { Query, ID } from "appwrite";
import { type Users, AvailabilityStatus, UserType } from "@/types/appwrite";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Building2,
  Star,
  CheckCircle,
  Briefcase,
  Clock,
  MessageCircle,
  User as UserIcon,
  Save,
  X,
  Camera,
  Edit3,
  Linkedin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  LogIn,
  Shield,
  Bell,
  CreditCard,
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle,
} from "lucide-react";
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

const DATABASE_ID = "main";
const USERS_COLLECTION_ID = "users";

export default function ProfilePage() {
  const { user: authUser, isAuthenticated, loading: authLoading, updateName } = useAuth();

  const [profile, setProfile] = useState<Users | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<Users>>({});
  const [activeTab, setActiveTab] = useState("profile");

  // Create a new user profile document
  const createProfile = useCallback(async () => {
    if (!authUser?.$id || !authUser?.email) return;

    try {
      setCreating(true);

      // Parse name into first and last name
      const nameParts = (authUser.name || "").split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Create new user document
      const newProfile = await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        ID.unique(),
        {
          user_id: authUser.$id,
          email: authUser.email,
          username: authUser.email.split("@")[0],
          first_name: firstName,
          last_name: lastName,
          phone: authUser.phone || null,
          user_type: UserType.USER,
          is_active: true,
          is_premium: false,
          is_verified: authUser.emailVerification || false,
          is_featured: false,
          accepts_inquiries: true,
          availability_status: AvailabilityStatus.AVAILABLE,
          account_status: "active",
          profile_completion_percentage: 20,
          profile_views: 0,
          total_listings: 0,
          active_listings: 0,
          total_sales: 0,
          total_reviews: 0,
          rating: 0,
          experience_years: 0,
          team_size: 0,
          response_time_hours: 24,
          response_rate_percentage: 0,
          deals_closed: 0,
          total_inquiries_received: 0,
          total_inquiries_sent: 0,
          total_earnings: 0,
          pending_commissions: 0,
          credits_balance: 0,
          email_notifications_enabled: true,
          sms_notifications_enabled: false,
          push_notifications_enabled: true,
          marketing_emails_enabled: false,
          identity_verified: false,
          documents_verified: false,
          background_check_completed: false,
          bank_account_verified: false,
          payment_method_verified: false,
        }
      );

      const userProfile = newProfile as unknown as Users;
      setProfile(userProfile);
      setEditedProfile(userProfile);
      setIsEditing(true); // Start in edit mode for new profiles
      toast.success("Profile created! Please complete your information.");
    } catch (err) {
      console.error("Error creating profile:", err);
      toast.error("Failed to create profile");
    } finally {
      setCreating(false);
    }
  }, [authUser]);

  // Fetch user profile from users collection
  const fetchProfile = useCallback(async () => {
    if (!authUser?.$id) return;

    try {
      setLoading(true);

      // Query by user_id field which matches auth user's $id
      const response = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.equal("user_id", authUser.$id), Query.limit(1)]
      );

      if (response.documents.length > 0) {
        const userProfile = response.documents[0] as unknown as Users;
        setProfile(userProfile);
        setEditedProfile(userProfile);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [authUser?.$id]);

  useEffect(() => {
    if (isAuthenticated && authUser?.$id) {
      fetchProfile();
      setDisplayName(authUser.name || "");
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [isAuthenticated, authUser?.$id, authUser?.name, authLoading, fetchProfile]);

  // Handle display name update (Appwrite account)
  const handleUpdateDisplayName = async () => {
    if (!displayName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    try {
      setSavingName(true);
      await updateName({ name: displayName.trim() });
      toast.success("Display name updated successfully");
    } catch {
      toast.error("Failed to update display name");
    } finally {
      setSavingName(false);
    }
  };

  // Handle input changes
  const handleInputChange = (
    field: keyof Users,
    value: string | number | boolean | null
  ) => {
    setEditedProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Save profile changes
  const handleSave = async () => {
    if (!profile?.$id) return;

    try {
      setSaving(true);

      // Fields to update (excluding system fields)
      const updateData: Record<string, unknown> = {};
      const editableFields: (keyof Users)[] = [
        "first_name",
        "last_name",
        "username",
        "phone",
        "alternative_phone",
        "whatsapp_number",
        "address",
        "city",
        "state",
        "country",
        "zip_code",
        "bio",
        "description",
        "tagline",
        "designation",
        "company_name",
        "website_url",
        "office_hours",
        "experience_years",
        "specializations",
        "languages_spoken",
        "service_areas",
        "property_types_handled",
        "certifications",
        "awards",
        "license_number",
        "rera_registration",
        "registration_number",
        "broker_name",
        "broker_license",
        "social_media_linkedin",
        "social_media_facebook",
        "social_media_instagram",
        "social_media_twitter",
        "social_media_youtube",
        "availability_status",
        "accepts_inquiries",
        "preferred_contact_method",
        "timezone",
        "language_preference",
        "currency_preference",
        "email_notifications_enabled",
        "sms_notifications_enabled",
        "push_notifications_enabled",
        "marketing_emails_enabled",
        "min_property_price",
        "max_property_price",
      ];

      editableFields.forEach((field) => {
        if (editedProfile[field] !== undefined) {
          updateData[field] = editedProfile[field];
        }
      });

      await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        profile.$id,
        updateData
      );

      setProfile({ ...profile, ...updateData } as Users);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Error saving profile:", err);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditedProfile(profile || {});
    setIsEditing(false);
  };

  // Handle image upload
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    field: "profile_image_url" | "banner_image_url"
  ) => {
    const file = event.target.files?.[0];
    if (!file || !profile?.$id) return;

    try {
      setSaving(true);

      let fileUrl: string;

      if (field === "profile_image_url") {
        // Upload to avatars bucket
        fileUrl = await usersService.uploadAvatar(profile.$id, file);
      } else {
        // Upload to banners bucket
        fileUrl = await usersService.uploadBanner(profile.$id, file);
      }

      setProfile({ ...profile, [field]: fileUrl });
      setEditedProfile((prev) => ({ ...prev, [field]: fileUrl }));
      toast.success("Image uploaded successfully!");
    } catch (err) {
      console.error("Error uploading image:", err);
      toast.error("Failed to upload image");
    } finally {
      setSaving(false);
    }
  };

  // Delete profile
  const handleDeleteProfile = async () => {
    if (!profile?.$id) return;

    try {
      setSaving(true);
      await databases.deleteDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        profile.$id
      );
      setProfile(null);
      setEditedProfile({});
      toast.success("Profile deleted successfully");
    } catch (err) {
      console.error("Error deleting profile:", err);
      toast.error("Failed to delete profile");
    } finally {
      setSaving(false);
    }
  };

  // Loading state
  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  // No profile found - offer to create one
  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
          <UserIcon className="h-12 w-12 text-primary" />
        </div>
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Welcome, {authUser?.name || "User"}!
          </h1>
          <p className="text-muted-foreground mb-6">
            Your profile hasn&apos;t been set up yet. Create your profile to start listing properties and connecting with buyers.
          </p>
          <Button
            onClick={createProfile}
            disabled={creating}
            size="lg"
            className="gap-2"
          >
            {creating ? (
              <>
                <Spinner className="h-4 w-4" />
                Creating Profile...
              </>
            ) : (
              <>
                <UserIcon className="h-4 w-4" />
                Create My Profile
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Always use name from Appwrite account for display
  const fullName = authUser?.name || "Unknown User";
  const initials = fullName.split(" ").map(n => n[0]).join("").toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-background">
      {/* Banner Section */}
      <div className="relative w-full h-48 md:h-64 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20">
        {profile.banner_image_url ? (
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

        {/* Banner Upload Button */}
        {isEditing && (
          <label className="absolute top-4 right-4 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e, "banner_image_url")}
            />
            <div className="flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-lg border border-border hover:bg-background transition-colors">
              <Camera className="h-4 w-4" />
              <span className="text-sm">Change Banner</span>
            </div>
          </label>
        )}
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Profile Header */}
        <div className="relative -mt-16 md:-mt-20 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            {/* Profile Image */}
            <div className="relative group">
              <Avatar className="h-28 w-28 md:h-36 md:w-36 border-4 border-background ring-2 ring-border">
                {profile.profile_image_url ? (
                  <AvatarImage
                    src={profile.profile_image_url}
                    alt={fullName}
                    className="object-cover"
                  />
                ) : null}
                <AvatarFallback className="text-2xl md:text-3xl font-bold bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>

              {/* Profile Image Upload */}
              {isEditing && (
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, "profile_image_url")}
                  />
                  <Camera className="h-8 w-8 text-white" />
                </label>
              )}

              {/* Status Indicator */}
              {profile.availability_status === AvailabilityStatus.AVAILABLE && (
                <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-background" />
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left pb-2">
              <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  {fullName}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {profile.is_verified && (
                    <Badge className="gap-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                      <CheckCircle className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                  {profile.is_premium && (
                    <Badge variant="secondary" className="gap-1">
                      <Star className="h-3 w-3" />
                      Premium
                    </Badge>
                  )}
                  <Badge variant="outline" className="capitalize">
                    {profile.user_type}
                  </Badge>
                </div>
              </div>

              {profile.designation && (
                <p className="text-lg text-muted-foreground mb-1">
                  {profile.designation}
                </p>
              )}

              {profile.company_name && (
                <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span>{profile.company_name}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pb-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <Spinner className="h-4 w-4 mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Completion */}
        {profile.profile_completion_percentage < 100 && (
          <div className="mb-6 p-4 bg-muted/50 rounded-xl border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                Profile Completion
              </span>
              <span className="text-sm text-muted-foreground">
                {profile.profile_completion_percentage}%
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${profile.profile_completion_percentage}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Complete your profile to increase visibility and trust.
            </p>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="pb-12">
          <TabsList className="w-full md:w-auto mb-6 grid grid-cols-4 md:flex">
            <TabsTrigger value="profile" className="gap-2">
              <UserIcon className="h-4 w-4 hidden md:block" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="professional" className="gap-2">
              <Briefcase className="h-4 w-4 hidden md:block" />
              Professional
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Bell className="h-4 w-4 hidden md:block" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="verification" className="gap-2">
              <Shield className="h-4 w-4 hidden md:block" />
              Verification
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Section title="Personal Information">
                <div className="grid gap-4">
                  {/* Display Name from Appwrite Account */}
                  <div className="space-y-2">
                    <Label htmlFor="displayName" className="text-sm font-medium">
                      Display Name
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Your display name"
                        className="flex-1"
                      />
                      <Button
                        onClick={handleUpdateDisplayName}
                        disabled={savingName || displayName === authUser?.name}
                        size="sm"
                      >
                        {savingName ? <Spinner className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This is your account display name shown across the platform
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      label="First Name"
                      value={editedProfile.first_name || ""}
                      onChange={(v) => handleInputChange("first_name", v)}
                      disabled={!isEditing}
                      placeholder="Optional"
                    />
                    <FormField
                      label="Last Name"
                      value={editedProfile.last_name || ""}
                      onChange={(v) => handleInputChange("last_name", v)}
                      disabled={!isEditing}
                      placeholder="Optional"
                    />
                  </div>
                  <FormField
                    label="Username"
                    value={editedProfile.username || ""}
                    onChange={(v) => handleInputChange("username", v)}
                    disabled={!isEditing}
                    prefix="@"
                  />
                  <FormField
                    label="Email"
                    value={profile.email}
                    disabled={true}
                    icon={<Mail className="h-4 w-4" />}
                  />
                  <FormField
                    label="Tagline"
                    value={editedProfile.tagline || ""}
                    onChange={(v) => handleInputChange("tagline", v)}
                    disabled={!isEditing}
                    placeholder="Your professional tagline"
                  />
                </div>
              </Section>

              {/* Contact Information */}
              <Section title="Contact Information">
                <div className="grid gap-4">
                  <FormField
                    label="Phone"
                    value={editedProfile.phone || ""}
                    onChange={(v) => handleInputChange("phone", v)}
                    disabled={!isEditing}
                    icon={<Phone className="h-4 w-4" />}
                  />
                  <FormField
                    label="Alternative Phone"
                    value={editedProfile.alternative_phone || ""}
                    onChange={(v) => handleInputChange("alternative_phone", v)}
                    disabled={!isEditing}
                  />
                  <FormField
                    label="WhatsApp Number"
                    value={editedProfile.whatsapp_number || ""}
                    onChange={(v) => handleInputChange("whatsapp_number", v)}
                    disabled={!isEditing}
                    icon={<MessageCircle className="h-4 w-4" />}
                  />
                  <FormField
                    label="Website"
                    value={editedProfile.website_url || ""}
                    onChange={(v) => handleInputChange("website_url", v)}
                    disabled={!isEditing}
                    icon={<Globe className="h-4 w-4" />}
                    placeholder="https://"
                  />
                </div>
              </Section>

              {/* Address */}
              <Section title="Address">
                <div className="grid gap-4">
                  <FormField
                    label="Street Address"
                    value={editedProfile.address || ""}
                    onChange={(v) => handleInputChange("address", v)}
                    disabled={!isEditing}
                    icon={<MapPin className="h-4 w-4" />}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      label="City"
                      value={editedProfile.city || ""}
                      onChange={(v) => handleInputChange("city", v)}
                      disabled={!isEditing}
                    />
                    <FormField
                      label="State"
                      value={editedProfile.state || ""}
                      onChange={(v) => handleInputChange("state", v)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      label="Country"
                      value={editedProfile.country || ""}
                      onChange={(v) => handleInputChange("country", v)}
                      disabled={!isEditing}
                    />
                    <FormField
                      label="Zip Code"
                      value={editedProfile.zip_code || ""}
                      onChange={(v) => handleInputChange("zip_code", v)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </Section>

              {/* Social Media */}
              <Section title="Social Media">
                <div className="grid gap-4">
                  <FormField
                    label="LinkedIn"
                    value={editedProfile.social_media_linkedin || ""}
                    onChange={(v) => handleInputChange("social_media_linkedin", v)}
                    disabled={!isEditing}
                    icon={<Linkedin className="h-4 w-4" />}
                    placeholder="https://linkedin.com/in/..."
                  />
                  <FormField
                    label="Facebook"
                    value={editedProfile.social_media_facebook || ""}
                    onChange={(v) => handleInputChange("social_media_facebook", v)}
                    disabled={!isEditing}
                    icon={<Facebook className="h-4 w-4" />}
                  />
                  <FormField
                    label="Instagram"
                    value={editedProfile.social_media_instagram || ""}
                    onChange={(v) => handleInputChange("social_media_instagram", v)}
                    disabled={!isEditing}
                    icon={<Instagram className="h-4 w-4" />}
                  />
                  <FormField
                    label="Twitter"
                    value={editedProfile.social_media_twitter || ""}
                    onChange={(v) => handleInputChange("social_media_twitter", v)}
                    disabled={!isEditing}
                    icon={<Twitter className="h-4 w-4" />}
                  />
                  <FormField
                    label="YouTube"
                    value={editedProfile.social_media_youtube || ""}
                    onChange={(v) => handleInputChange("social_media_youtube", v)}
                    disabled={!isEditing}
                    icon={<Youtube className="h-4 w-4" />}
                  />
                </div>
              </Section>

              {/* Bio */}
              <Section title="About Me" className="lg:col-span-2">
                <div className="grid gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">
                      Bio
                    </Label>
                    <Textarea
                      value={editedProfile.bio || ""}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      disabled={!isEditing}
                      placeholder="Tell people about yourself..."
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">
                      Description
                    </Label>
                    <Textarea
                      value={editedProfile.description || ""}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="Detailed description of your services..."
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                </div>
              </Section>
            </div>
          </TabsContent>

          {/* Professional Tab */}
          <TabsContent value="professional" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Work Details */}
              <Section title="Work Details">
                <div className="grid gap-4">
                  <FormField
                    label="Designation"
                    value={editedProfile.designation || ""}
                    onChange={(v) => handleInputChange("designation", v)}
                    disabled={!isEditing}
                    placeholder="e.g., Senior Real Estate Agent"
                  />
                  <FormField
                    label="Company Name"
                    value={editedProfile.company_name || ""}
                    onChange={(v) => handleInputChange("company_name", v)}
                    disabled={!isEditing}
                    icon={<Building2 className="h-4 w-4" />}
                  />
                  <FormField
                    label="Experience (Years)"
                    value={editedProfile.experience_years?.toString() || "0"}
                    onChange={(v) =>
                      handleInputChange("experience_years", parseInt(v) || 0)
                    }
                    disabled={!isEditing}
                    type="number"
                  />
                  <FormField
                    label="Office Hours"
                    value={editedProfile.office_hours || ""}
                    onChange={(v) => handleInputChange("office_hours", v)}
                    disabled={!isEditing}
                    icon={<Clock className="h-4 w-4" />}
                    placeholder="e.g., Mon-Fri 9AM-6PM"
                  />
                </div>
              </Section>

              {/* Licensing */}
              <Section title="Licensing & Registration">
                <div className="grid gap-4">
                  <FormField
                    label="License Number"
                    value={editedProfile.license_number || ""}
                    onChange={(v) => handleInputChange("license_number", v)}
                    disabled={!isEditing}
                  />
                  <FormField
                    label="RERA Registration"
                    value={editedProfile.rera_registration || ""}
                    onChange={(v) => handleInputChange("rera_registration", v)}
                    disabled={!isEditing}
                  />
                  <FormField
                    label="Registration Number"
                    value={editedProfile.registration_number || ""}
                    onChange={(v) => handleInputChange("registration_number", v)}
                    disabled={!isEditing}
                  />
                  <FormField
                    label="Broker Name"
                    value={editedProfile.broker_name || ""}
                    onChange={(v) => handleInputChange("broker_name", v)}
                    disabled={!isEditing}
                  />
                  <FormField
                    label="Broker License"
                    value={editedProfile.broker_license || ""}
                    onChange={(v) => handleInputChange("broker_license", v)}
                    disabled={!isEditing}
                  />
                </div>
              </Section>

              {/* Expertise */}
              <Section title="Expertise">
                <div className="grid gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">
                      Specializations
                    </Label>
                    <Textarea
                      value={editedProfile.specializations || ""}
                      onChange={(e) =>
                        handleInputChange("specializations", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="e.g., Luxury Properties, Commercial Real Estate, First-time Buyers"
                      rows={3}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Separate with commas
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">
                      Property Types Handled
                    </Label>
                    <Textarea
                      value={editedProfile.property_types_handled || ""}
                      onChange={(e) =>
                        handleInputChange("property_types_handled", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="e.g., Apartments, Villas, Commercial, Land"
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">
                      Service Areas
                    </Label>
                    <Textarea
                      value={editedProfile.service_areas || ""}
                      onChange={(e) =>
                        handleInputChange("service_areas", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="e.g., Downtown, Suburbs, Coastal Areas"
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                </div>
              </Section>

              {/* Skills & Languages */}
              <Section title="Skills & Languages">
                <div className="grid gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">
                      Languages Spoken
                    </Label>
                    <Textarea
                      value={editedProfile.languages_spoken || ""}
                      onChange={(e) =>
                        handleInputChange("languages_spoken", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="e.g., English, Spanish, Mandarin"
                      rows={2}
                      className="resize-none"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">
                      Certifications
                    </Label>
                    <Textarea
                      value={editedProfile.certifications || ""}
                      onChange={(e) =>
                        handleInputChange("certifications", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="List your professional certifications"
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">
                      Awards
                    </Label>
                    <Textarea
                      value={editedProfile.awards || ""}
                      onChange={(e) =>
                        handleInputChange("awards", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="List your awards and achievements"
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                </div>
              </Section>

              {/* Price Range */}
              <Section title="Property Price Range" className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Minimum Price"
                    value={editedProfile.min_property_price?.toString() || ""}
                    onChange={(v) =>
                      handleInputChange(
                        "min_property_price",
                        v ? parseFloat(v) : null
                      )
                    }
                    disabled={!isEditing}
                    type="number"
                    placeholder="0"
                  />
                  <FormField
                    label="Maximum Price"
                    value={editedProfile.max_property_price?.toString() || ""}
                    onChange={(v) =>
                      handleInputChange(
                        "max_property_price",
                        v ? parseFloat(v) : null
                      )
                    }
                    disabled={!isEditing}
                    type="number"
                    placeholder="0"
                  />
                </div>
              </Section>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Availability */}
              <Section title="Availability">
                <div className="grid gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">
                      Status
                    </Label>
                    <Select
                      value={editedProfile.availability_status || ""}
                      onValueChange={(v) =>
                        handleInputChange(
                          "availability_status",
                          v as AvailabilityStatus
                        )
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={AvailabilityStatus.AVAILABLE}>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            Available
                          </div>
                        </SelectItem>
                        <SelectItem value={AvailabilityStatus.BUSY}>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-yellow-500" />
                            Busy
                          </div>
                        </SelectItem>
                        <SelectItem value={AvailabilityStatus.AWAY}>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-orange-500" />
                            Away
                          </div>
                        </SelectItem>
                        <SelectItem value={AvailabilityStatus.OFFLINE}>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-gray-500" />
                            Offline
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <SwitchField
                    label="Accept Inquiries"
                    description="Allow people to send you inquiries"
                    checked={editedProfile.accepts_inquiries || false}
                    onChange={(v) => handleInputChange("accepts_inquiries", v)}
                    disabled={!isEditing}
                  />
                </div>
              </Section>

              {/* Preferences */}
              <Section title="Preferences">
                <div className="grid gap-4">
                  <FormField
                    label="Preferred Contact Method"
                    value={editedProfile.preferred_contact_method || ""}
                    onChange={(v) =>
                      handleInputChange("preferred_contact_method", v)
                    }
                    disabled={!isEditing}
                    placeholder="e.g., Email, Phone, WhatsApp"
                  />
                  <FormField
                    label="Timezone"
                    value={editedProfile.timezone || ""}
                    onChange={(v) => handleInputChange("timezone", v)}
                    disabled={!isEditing}
                    placeholder="e.g., Asia/Karachi"
                  />
                  <FormField
                    label="Language Preference"
                    value={editedProfile.language_preference || ""}
                    onChange={(v) => handleInputChange("language_preference", v)}
                    disabled={!isEditing}
                    placeholder="e.g., English"
                  />
                  <FormField
                    label="Currency Preference"
                    value={editedProfile.currency_preference || ""}
                    onChange={(v) => handleInputChange("currency_preference", v)}
                    disabled={!isEditing}
                    placeholder="e.g., PKR, USD"
                  />
                </div>
              </Section>

              {/* Notifications */}
              <Section title="Notification Preferences" className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SwitchField
                    label="Email Notifications"
                    description="Receive notifications via email"
                    checked={editedProfile.email_notifications_enabled || false}
                    onChange={(v) =>
                      handleInputChange("email_notifications_enabled", v)
                    }
                    disabled={!isEditing}
                  />
                  <SwitchField
                    label="SMS Notifications"
                    description="Receive notifications via SMS"
                    checked={editedProfile.sms_notifications_enabled || false}
                    onChange={(v) =>
                      handleInputChange("sms_notifications_enabled", v)
                    }
                    disabled={!isEditing}
                  />
                  <SwitchField
                    label="Push Notifications"
                    description="Receive push notifications"
                    checked={editedProfile.push_notifications_enabled || false}
                    onChange={(v) =>
                      handleInputChange("push_notifications_enabled", v)
                    }
                    disabled={!isEditing}
                  />
                  <SwitchField
                    label="Marketing Emails"
                    description="Receive marketing and promotional emails"
                    checked={editedProfile.marketing_emails_enabled || false}
                    onChange={(v) =>
                      handleInputChange("marketing_emails_enabled", v)
                    }
                    disabled={!isEditing}
                  />
                </div>
              </Section>
            </div>
          </TabsContent>

          {/* Verification Tab */}
          <TabsContent value="verification" className="space-y-6">
            <Section title="Verification Status">
              <p className="text-muted-foreground mb-6">
                Complete verification steps to increase trust and visibility on
                the platform.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <VerificationCard
                  label="Identity Verification"
                  description="Verify your identity with government ID"
                  verified={profile.identity_verified}
                />
                <VerificationCard
                  label="Documents Verified"
                  description="Upload and verify professional documents"
                  verified={profile.documents_verified}
                />
                <VerificationCard
                  label="Background Check"
                  description="Complete background verification"
                  verified={profile.background_check_completed}
                />
                <VerificationCard
                  label="Bank Account"
                  description="Link and verify your bank account"
                  verified={profile.bank_account_verified}
                />
                <VerificationCard
                  label="Payment Method"
                  description="Add a verified payment method"
                  verified={profile.payment_method_verified}
                />
              </div>
            </Section>

            {/* Stats */}
            <Section title="Account Statistics">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Profile Views" value={profile.profile_views} />
                <StatCard label="Total Listings" value={profile.total_listings} />
                <StatCard label="Active Listings" value={profile.active_listings} />
                <StatCard label="Deals Closed" value={profile.deals_closed} />
                <StatCard label="Total Sales" value={profile.total_sales} />
                <StatCard label="Total Reviews" value={profile.total_reviews} />
                <StatCard
                  label="Rating"
                  value={profile.rating > 0 ? profile.rating.toFixed(1) : "N/A"}
                />
                <StatCard
                  label="Response Rate"
                  value={`${profile.response_rate_percentage}%`}
                />
              </div>
            </Section>

            {/* Danger Zone */}
            <div className="p-5 bg-destructive/5 rounded-xl border border-destructive/20">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-destructive">
                    Danger Zone
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Irreversible and destructive actions
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                <div>
                  <p className="font-medium text-foreground">Delete Profile</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your profile and all associated data
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete Profile
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        profile and remove all your data from our servers. Your listings,
                        inquiries, and other related data may also be affected.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteProfile}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Yes, delete my profile
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Section Component
function Section({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`p-5 bg-card rounded-xl border border-border ${className}`}>
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      {children}
    </div>
  );
}

// Form Field Component
function FormField({
  label,
  value,
  onChange,
  disabled = false,
  type = "text",
  placeholder = "",
  icon,
  prefix,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  prefix?: string;
}) {
  return (
    <div>
      <Label className="text-sm text-muted-foreground mb-2 block">{label}</Label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        {prefix && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {prefix}
          </div>
        )}
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className={icon || prefix ? "pl-10" : ""}
        />
      </div>
    </div>
  );
}

// Switch Field Component
function SwitchField({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-border">
      <div>
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  );
}

// Verification Card Component
function VerificationCard({
  label,
  description,
  verified,
}: {
  label: string;
  description: string;
  verified: boolean;
}) {
  return (
    <div
      className={`p-4 rounded-xl border ${verified
          ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900"
          : "bg-muted/50 border-border"
        }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 p-1.5 rounded-full ${verified
              ? "bg-green-100 dark:bg-green-900/50"
              : "bg-muted"
            }`}
        >
          {verified ? (
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          ) : (
            <Shield className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <div>
          <p
            className={`font-medium ${verified
                ? "text-green-700 dark:text-green-400"
                : "text-foreground"
              }`}
          >
            {label}
          </p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="p-4 bg-muted/50 rounded-lg text-center">
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
