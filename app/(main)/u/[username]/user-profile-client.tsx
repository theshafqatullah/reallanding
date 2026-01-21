"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { databases } from "@/services/appwrite";
import { Query } from "appwrite";
import { type Users, AvailabilityStatus, UserType } from "@/types/appwrite";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import Link from "next/link";
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
  Share2,
  Linkedin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Award,
  Users as UsersIcon,
  Home,
  TrendingUp,
  Eye,
} from "lucide-react";

const DATABASE_ID = "main";
const USERS_COLLECTION_ID = "users";

export default function UserProfileClient() {
  const params = useParams();
  const username = params.username as string;

  const [user, setUser] = useState<Users | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        setError(null);

        const decodedUsername = decodeURIComponent(username);

        // Query user by username
        const response = await databases.listDocuments(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          [Query.equal("username", decodedUsername), Query.limit(1)]
        );

        if (response.documents.length > 0) {
          setUser(response.documents[0] as unknown as Users);
        } else {
          setError("User not found");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    }

    if (username) {
      fetchUser();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
          <UsersIcon className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">User Not Found</h1>
        <p className="text-muted-foreground">
          The user profile you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button asChild variant="outline">
          <Link href="/agents">Browse Agents</Link>
        </Button>
      </div>
    );
  }

  const fullName =
    `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Unknown User";
  const initials =
    `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase() ||
    "U";

  const hasSocialLinks =
    user.social_media_linkedin ||
    user.social_media_facebook ||
    user.social_media_instagram ||
    user.social_media_twitter ||
    user.social_media_youtube ||
    user.website_url;

  return (
    <div className="min-h-screen bg-background">
      {/* Banner Section */}
      <div className="relative w-full h-48 md:h-64 lg:h-80 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20">
        {user.banner_image_url ? (
          <Image
            src={user.banner_image_url}
            alt={`${fullName}'s banner`}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/30" />
        )}
        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Profile Header */}
        <div className="relative -mt-20 md:-mt-24 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            {/* Profile Image */}
            <div className="relative">
              <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background ring-2 ring-border">
                {user.profile_image_url ? (
                  <AvatarImage
                    src={user.profile_image_url}
                    alt={fullName}
                    className="object-cover"
                  />
                ) : null}
                <AvatarFallback className="text-3xl md:text-4xl font-bold bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {/* Online Status Indicator */}
              {user.availability_status === AvailabilityStatus.AVAILABLE && (
                <div className="absolute bottom-2 right-2 h-5 w-5 rounded-full bg-green-500 border-2 border-background" />
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left pb-2">
              <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  {fullName}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {user.is_verified && (
                    <Badge className="gap-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                      <CheckCircle className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                  {user.is_premium && (
                    <Badge variant="secondary" className="gap-1">
                      <Star className="h-3 w-3" />
                      Premium
                    </Badge>
                  )}
                  {user.is_featured && (
                    <Badge variant="outline" className="gap-1 border-accent text-accent-foreground">
                      <TrendingUp className="h-3 w-3" />
                      Featured
                    </Badge>
                  )}
                </div>
              </div>

              {user.designation && (
                <p className="text-lg text-muted-foreground mb-1">
                  {user.designation}
                </p>
              )}

              {user.company_name && (
                <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span>{user.company_name}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pb-2">
              {/* View Properties button for agents/agencies */}
              {(user.user_type === UserType.AGENT || user.user_type === UserType.AGENCY) && (
                <Button asChild variant="secondary">
                  <Link href={`/properties?agent=${user.$id}`}>
                    <Home className="h-4 w-4 mr-2" />
                    View Properties
                  </Link>
                </Button>
              )}
              {user.phone && (
                <Button asChild>
                  <a href={`tel:${user.phone}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </a>
                </Button>
              )}
              {user.whatsapp_number && (
                <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50" asChild>
                  <a
                    href={`https://wa.me/${user.whatsapp_number.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </a>
                </Button>
              )}
              <Button variant="ghost" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tagline */}
          {user.tagline && (
            <p className="mt-4 text-muted-foreground italic text-center md:text-left max-w-2xl">
              &quot;{user.tagline}&quot;
            </p>
          )}
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 p-4 bg-muted/50 rounded-xl border border-border">
          <StatItem
            icon={<Star className="h-5 w-5 text-yellow-500" />}
            value={user.rating > 0 ? user.rating.toFixed(1) : "N/A"}
            label={`${user.total_reviews} Reviews`}
          />
          <StatItem
            icon={<Briefcase className="h-5 w-5 text-primary" />}
            value={user.experience_years}
            label="Years Exp."
          />
          <StatItem
            icon={<Home className="h-5 w-5 text-primary" />}
            value={user.active_listings}
            label="Active Listings"
          />
          <StatItem
            icon={<CheckCircle className="h-5 w-5 text-green-500" />}
            value={user.deals_closed}
            label="Deals Closed"
          />
          <StatItem
            icon={<Eye className="h-5 w-5 text-muted-foreground" />}
            value={user.profile_views}
            label="Profile Views"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Section title="Contact Information">
              <div className="space-y-4">
                {user.email && (
                  <ContactRow
                    icon={<Mail className="h-4 w-4" />}
                    label="Email"
                    value={user.email}
                    href={`mailto:${user.email}`}
                  />
                )}
                {user.phone && (
                  <ContactRow
                    icon={<Phone className="h-4 w-4" />}
                    label="Phone"
                    value={user.phone}
                    href={`tel:${user.phone}`}
                  />
                )}
                {user.alternative_phone && (
                  <ContactRow
                    icon={<Phone className="h-4 w-4" />}
                    label="Alt. Phone"
                    value={user.alternative_phone}
                    href={`tel:${user.alternative_phone}`}
                  />
                )}
                {(user.address || user.city || user.country) && (
                  <ContactRow
                    icon={<MapPin className="h-4 w-4" />}
                    label="Location"
                    value={[user.address, user.city, user.state, user.country]
                      .filter(Boolean)
                      .join(", ")}
                  />
                )}
                {user.website_url && (
                  <ContactRow
                    icon={<Globe className="h-4 w-4" />}
                    label="Website"
                    value="Visit Website"
                    href={user.website_url}
                    external
                  />
                )}
              </div>
            </Section>

            {/* Availability */}
            <Section title="Availability">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-3 w-3 rounded-full ${user.availability_status === AvailabilityStatus.AVAILABLE
                      ? "bg-green-500"
                      : user.availability_status === AvailabilityStatus.BUSY
                        ? "bg-yellow-500"
                        : user.availability_status === AvailabilityStatus.AWAY
                          ? "bg-orange-500"
                          : "bg-muted-foreground"
                      }`}
                  />
                  <span className="font-medium capitalize">
                    {user.availability_status?.toLowerCase().replace("_", " ") ||
                      "Unknown"}
                  </span>
                </div>
                {user.office_hours && (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Clock className="h-4 w-4" />
                    <span>{user.office_hours}</span>
                  </div>
                )}
                {user.response_time_hours > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Typically responds within{" "}
                    <span className="font-medium text-foreground">
                      {user.response_time_hours} hours
                    </span>
                  </p>
                )}
                {user.response_rate_percentage > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Response rate:{" "}
                    <span className="font-medium text-foreground">
                      {user.response_rate_percentage}%
                    </span>
                  </p>
                )}
              </div>
            </Section>

            {/* Social Links */}
            {hasSocialLinks && (
              <Section title="Connect">
                <div className="flex flex-wrap gap-2">
                  {user.social_media_linkedin && (
                    <SocialButton
                      href={user.social_media_linkedin}
                      icon={<Linkedin className="h-4 w-4" />}
                      label="LinkedIn"
                    />
                  )}
                  {user.social_media_facebook && (
                    <SocialButton
                      href={user.social_media_facebook}
                      icon={<Facebook className="h-4 w-4" />}
                      label="Facebook"
                    />
                  )}
                  {user.social_media_instagram && (
                    <SocialButton
                      href={user.social_media_instagram}
                      icon={<Instagram className="h-4 w-4" />}
                      label="Instagram"
                    />
                  )}
                  {user.social_media_twitter && (
                    <SocialButton
                      href={user.social_media_twitter}
                      icon={<Twitter className="h-4 w-4" />}
                      label="Twitter"
                    />
                  )}
                  {user.social_media_youtube && (
                    <SocialButton
                      href={user.social_media_youtube}
                      icon={<Youtube className="h-4 w-4" />}
                      label="YouTube"
                    />
                  )}
                </div>
              </Section>
            )}

            {/* Professional Details */}
            <Section title="Professional Details">
              <div className="space-y-3">
                {user.license_number && (
                  <DetailRow label="License Number" value={user.license_number} />
                )}
                {user.rera_registration && (
                  <DetailRow label="RERA Registration" value={user.rera_registration} />
                )}
                {user.registration_number && (
                  <DetailRow label="Registration No." value={user.registration_number} />
                )}
                {user.broker_name && (
                  <DetailRow label="Broker" value={user.broker_name} />
                )}
                {user.established_year && (
                  <DetailRow label="Established" value={user.established_year.toString()} />
                )}
                {user.team_size > 0 && (
                  <DetailRow label="Team Size" value={`${user.team_size} members`} />
                )}
              </div>
            </Section>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            {(user.bio || user.description) && (
              <Section title="About">
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {user.bio || user.description}
                </p>
              </Section>
            )}

            {/* Specializations */}
            {user.specializations && (
              <Section title="Specializations">
                <div className="flex flex-wrap gap-2">
                  {user.specializations.split(",").map((spec, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-1 text-sm"
                    >
                      {spec.trim()}
                    </Badge>
                  ))}
                </div>
              </Section>
            )}

            {/* Property Types Handled */}
            {user.property_types_handled && (
              <Section title="Property Types">
                <div className="flex flex-wrap gap-2">
                  {user.property_types_handled.split(",").map((type, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="px-3 py-1 text-sm"
                    >
                      <Home className="h-3 w-3 mr-1" />
                      {type.trim()}
                    </Badge>
                  ))}
                </div>
              </Section>
            )}

            {/* Service Areas */}
            {user.service_areas && (
              <Section title="Service Areas">
                <div className="flex flex-wrap gap-2">
                  {user.service_areas.split(",").map((area, index) => (
                    <Badge
                      key={index}
                      className="px-3 py-1 text-sm bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                    >
                      <MapPin className="h-3 w-3 mr-1" />
                      {area.trim()}
                    </Badge>
                  ))}
                </div>
              </Section>
            )}

            {/* Languages */}
            {user.languages_spoken && (
              <Section title="Languages">
                <div className="flex flex-wrap gap-2">
                  {user.languages_spoken.split(",").map((lang, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="px-3 py-1 text-sm"
                    >
                      {lang.trim()}
                    </Badge>
                  ))}
                </div>
              </Section>
            )}

            {/* Certifications & Awards */}
            {(user.certifications || user.awards) && (
              <Section title="Certifications & Awards">
                <div className="space-y-4">
                  {user.certifications && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="h-4 w-4 text-primary" />
                        <h4 className="font-medium">Certifications</h4>
                      </div>
                      <p className="text-muted-foreground pl-6">
                        {user.certifications}
                      </p>
                    </div>
                  )}
                  {user.awards && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <h4 className="font-medium">Awards</h4>
                      </div>
                      <p className="text-muted-foreground pl-6">{user.awards}</p>
                    </div>
                  )}
                </div>
              </Section>
            )}

            {/* Price Range */}
            {(user.min_property_price || user.max_property_price) && (
              <Section title="Property Price Range">
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Minimum</p>
                    <p className="text-lg font-semibold text-foreground">
                      {user.min_property_price
                        ? new Intl.NumberFormat("en-PK", {
                          style: "currency",
                          currency: user.currency_preference || "PKR",
                          maximumFractionDigits: 0,
                        }).format(user.min_property_price)
                        : "N/A"}
                    </p>
                  </div>
                  <Separator orientation="vertical" className="h-10" />
                  <div>
                    <p className="text-sm text-muted-foreground">Maximum</p>
                    <p className="text-lg font-semibold text-foreground">
                      {user.max_property_price
                        ? new Intl.NumberFormat("en-PK", {
                          style: "currency",
                          currency: user.currency_preference || "PKR",
                          maximumFractionDigits: 0,
                        }).format(user.max_property_price)
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </Section>
            )}

            {/* Verification Status */}
            <Section title="Verification Status">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <VerificationBadge
                  label="Identity"
                  verified={user.identity_verified}
                />
                <VerificationBadge
                  label="Documents"
                  verified={user.documents_verified}
                />
                <VerificationBadge
                  label="Background Check"
                  verified={user.background_check_completed}
                />
                <VerificationBadge
                  label="Bank Account"
                  verified={user.bank_account_verified}
                />
                <VerificationBadge
                  label="Payment Method"
                  verified={user.payment_method_verified}
                />
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-5 bg-card rounded-xl border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      {children}
    </div>
  );
}

function StatItem({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-1">{icon}</div>
      <p className="text-xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
  external,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const content = (
    <div className="flex items-start gap-3 group">
      <div className="mt-0.5 text-muted-foreground group-hover:text-primary transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground group-hover:text-primary transition-colors">
          {value}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="block"
      >
        {content}
      </a>
    );
  }

  return content;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function SocialButton({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      asChild
    >
      <a href={href} target="_blank" rel="noopener noreferrer">
        {icon}
        {label}
      </a>
    </Button>
  );
}

function VerificationBadge({
  label,
  verified,
}: {
  label: string;
  verified: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 p-3 rounded-lg border ${verified
        ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900"
        : "bg-muted/50 border-border"
        }`}
    >
      <CheckCircle
        className={`h-4 w-4 ${verified ? "text-green-600" : "text-muted-foreground"
          }`}
      />
      <span
        className={`text-sm ${verified ? "text-green-700 dark:text-green-400" : "text-muted-foreground"
          }`}
      >
        {label}
      </span>
    </div>
  );
}
