"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { databases } from "@/services/appwrite";
import { Query } from "appwrite";
import { type Users, type AgentReviews, AvailabilityStatus, UserType } from "@/types/appwrite";
import { agentReviewsService } from "@/services/agent-reviews";
import { useAuth } from "@/store/auth";
import { usersService } from "@/services/users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
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
  ThumbsUp,
  PenLine,
  StarHalf,
} from "lucide-react";

const DATABASE_ID = "main";
const USERS_COLLECTION_ID = "users";

// Star Rating Component
function StarRating({
  rating,
  onRatingChange,
  readonly = false,
  size = "default",
}: {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "small" | "default" | "large";
}) {
  const [hoverRating, setHoverRating] = useState(0);
  const sizeClasses = {
    small: "h-4 w-4",
    default: "h-5 w-5",
    large: "h-6 w-6",
  };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onRatingChange?.(star)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className={`${readonly ? "cursor-default" : "cursor-pointer"} transition-colors`}
        >
          <Star
            className={`${sizeClasses[size]} ${star <= (hoverRating || rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground/30"
              }`}
          />
        </button>
      ))}
    </div>
  );
}

// Review Card Component
function ReviewCard({
  review,
  onHelpful,
}: {
  review: AgentReviews;
  onHelpful?: (reviewId: string) => void;
}) {
  const reviewerInitials = review.reviewer_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  const formattedDate = new Date(review.$createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="p-5 border border-border rounded-xl bg-card">
      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {reviewerInitials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="font-semibold text-foreground">{review.reviewer_name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <StarRating rating={review.rating} readonly size="small" />
                <span className="text-sm text-muted-foreground">{formattedDate}</span>
              </div>
            </div>
            {review.is_verified && (
              <Badge variant="outline" className="gap-1 text-xs border-green-500 text-green-600">
                <CheckCircle className="h-3 w-3" />
                Verified
              </Badge>
            )}
          </div>

          {review.title && (
            <h5 className="font-medium text-foreground mt-3">{review.title}</h5>
          )}

          <p className="text-muted-foreground mt-2 leading-relaxed">{review.review_text}</p>

          {(review.pros || review.cons) && (
            <div className="mt-4 space-y-2">
              {review.pros && (
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-medium text-sm">Pros:</span>
                  <span className="text-sm text-muted-foreground">{review.pros}</span>
                </div>
              )}
              {review.cons && (
                <div className="flex items-start gap-2">
                  <span className="text-red-600 font-medium text-sm">Cons:</span>
                  <span className="text-sm text-muted-foreground">{review.cons}</span>
                </div>
              )}
            </div>
          )}

          {review.response_text && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg border-l-2 border-primary">
              <p className="text-sm font-medium text-foreground mb-1">Agent&apos;s Response</p>
              <p className="text-sm text-muted-foreground">{review.response_text}</p>
              {review.response_date && (
                <p className="text-xs text-muted-foreground mt-2">{review.response_date}</p>
              )}
            </div>
          )}

          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
            <button
              onClick={() => onHelpful?.(review.$id)}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ThumbsUp className="h-4 w-4" />
              Helpful ({review.helpful_count || 0})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Write Review Dialog Component
function WriteReviewDialog({
  agentId,
  agentName,
  currentUser,
  existingReview,
  onReviewSubmitted,
}: {
  agentId: string;
  agentName: string;
  currentUser: { id: string; email: string; name: string } | null;
  existingReview: AgentReviews | null;
  onReviewSubmitted: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [title, setTitle] = useState(existingReview?.title || "");
  const [reviewText, setReviewText] = useState(existingReview?.review_text || "");
  const [pros, setPros] = useState(existingReview?.pros || "");
  const [cons, setCons] = useState(existingReview?.cons || "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("Please sign in to submit a review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!title.trim() || !reviewText.trim()) {
      toast.error("Please fill in the title and review");
      return;
    }

    setSubmitting(true);
    try {
      if (existingReview) {
        // Update existing review
        await agentReviewsService.update(existingReview.$id, {
          rating,
          title: title.trim(),
          review_text: reviewText.trim(),
          pros: pros.trim() || undefined,
          cons: cons.trim() || undefined,
        });
        toast.success("Review updated successfully!");
      } else {
        // Create new review
        await agentReviewsService.create({
          agent_id: agentId,
          reviewer_id: currentUser.id,
          reviewer_email: currentUser.email,
          reviewer_name: currentUser.name,
          rating,
          title: title.trim(),
          review_text: reviewText.trim(),
          pros: pros.trim() || undefined,
          cons: cons.trim() || undefined,
        });
        toast.success("Review submitted successfully!");
      }
      setOpen(false);
      onReviewSubmitted();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <Button variant="outline" asChild>
        <Link href={`/signin?redirect=/u/${agentName}`}>
          <PenLine className="h-4 w-4 mr-2" />
          Sign in to Review
        </Link>
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={existingReview ? "outline" : "default"}>
          <PenLine className="h-4 w-4 mr-2" />
          {existingReview ? "Edit Your Review" : "Write a Review"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{existingReview ? "Edit Your Review" : "Write a Review"}</DialogTitle>
          <DialogDescription>
            Share your experience with {agentName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div className="space-y-2">
            <Label>Your Rating *</Label>
            <div className="flex items-center gap-3">
              <StarRating rating={rating} onRatingChange={setRating} size="large" />
              <span className="text-sm text-muted-foreground">
                {rating === 0 ? "Select rating" : `${rating} out of 5 stars`}
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Review Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              maxLength={100}
            />
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <Label htmlFor="review">Your Review *</Label>
            <Textarea
              id="review"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share details about your experience..."
              rows={4}
              maxLength={2000}
            />
            <p className="text-xs text-muted-foreground text-right">
              {reviewText.length}/2000 characters
            </p>
          </div>

          {/* Pros */}
          <div className="space-y-2">
            <Label htmlFor="pros">What you liked (optional)</Label>
            <Textarea
              id="pros"
              value={pros}
              onChange={(e) => setPros(e.target.value)}
              placeholder="What did you like about working with this agent?"
              rows={2}
              maxLength={500}
            />
          </div>

          {/* Cons */}
          <div className="space-y-2">
            <Label htmlFor="cons">What could be improved (optional)</Label>
            <Textarea
              id="cons"
              value={cons}
              onChange={(e) => setCons(e.target.value)}
              placeholder="Any areas for improvement?"
              rows={2}
              maxLength={500}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={submitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Spinner className="h-4 w-4 mr-2" />
                  Submitting...
                </>
              ) : existingReview ? (
                "Update Review"
              ) : (
                "Submit Review"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function UserProfileClient() {
  const params = useParams();
  const username = params.username as string;
  const { user: authUser, isLoading: authLoading } = useAuth();

  const [user, setUser] = useState<Users | null>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<Users | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reviews state
  const [reviews, setReviews] = useState<AgentReviews[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewStats, setReviewStats] = useState<{
    totalReviews: number;
    averageRating: number;
    ratingDistribution: Record<number, number>;
  }>({ totalReviews: 0, averageRating: 0, ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });
  const [userExistingReview, setUserExistingReview] = useState<AgentReviews | null>(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Fetch reviews for the agent
  const fetchReviews = useCallback(async (agentId: string) => {
    setReviewsLoading(true);
    try {
      const [reviewsData, stats] = await Promise.all([
        agentReviewsService.getAgentReviews(agentId, { limit: 50 }),
        agentReviewsService.getAgentReviewStats(agentId),
      ]);
      setReviews(reviewsData.reviews);
      setReviewStats(stats);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setReviewsLoading(false);
    }
  }, []);

  // Check if current user has already reviewed
  const checkExistingReview = useCallback(async (agentId: string, reviewerId: string) => {
    try {
      const existingReview = await agentReviewsService.getUserReviewForAgent(agentId, reviewerId);
      setUserExistingReview(existingReview);
    } catch (err) {
      console.error("Error checking existing review:", err);
    }
  }, []);

  // Fetch current user profile
  useEffect(() => {
    async function fetchCurrentUserProfile() {
      if (!authUser?.$id) return;
      try {
        const profile = await usersService.getByUserId(authUser.$id);
        setCurrentUserProfile(profile);
      } catch (err) {
        console.error("Error fetching current user profile:", err);
      }
    }
    fetchCurrentUserProfile();
  }, [authUser?.$id]);

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
          const fetchedUser = response.documents[0] as unknown as Users;
          setUser(fetchedUser);

          // Fetch reviews if user is an agent or agency
          if (fetchedUser.user_type === UserType.AGENT || fetchedUser.user_type === UserType.AGENCY) {
            fetchReviews(fetchedUser.$id);
          }
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
  }, [username, fetchReviews]);

  // Check for existing review when user and auth are loaded
  useEffect(() => {
    if (user?.$id && authUser?.$id && (user.user_type === UserType.AGENT || user.user_type === UserType.AGENCY)) {
      checkExistingReview(user.$id, authUser.$id);
    }
  }, [user?.$id, authUser?.$id, user?.user_type, checkExistingReview]);

  // Handle helpful click
  const handleHelpfulClick = async (reviewId: string) => {
    try {
      await agentReviewsService.markHelpful(reviewId);
      setReviews((prev) =>
        prev.map((r) =>
          r.$id === reviewId ? { ...r, helpful_count: (r.helpful_count || 0) + 1 } : r
        )
      );
      toast.success("Marked as helpful");
    } catch (err) {
      console.error("Error marking helpful:", err);
      toast.error("Failed to mark as helpful");
    }
  };

  // Handle review submitted
  const handleReviewSubmitted = () => {
    if (user?.$id) {
      fetchReviews(user.$id);
      if (authUser?.$id) {
        checkExistingReview(user.$id, authUser.$id);
      }
    }
  };

  // Get current user info for review form
  const currentUserInfo = authUser && currentUserProfile
    ? {
      id: authUser.$id,
      email: authUser.email || "",
      name: currentUserProfile.first_name && currentUserProfile.last_name
        ? `${currentUserProfile.first_name} ${currentUserProfile.last_name}`
        : authUser.name || authUser.email?.split("@")[0] || "User",
    }
    : null;

  // Check if current user can review (not the same user)
  const canReview = authUser && user && authUser.$id !== user.user_id;

  if (loading || authLoading) {
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

      <div className="container mx-auto px-4 max-w-7xl">
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
            value={reviewStats.averageRating > 0 ? reviewStats.averageRating.toFixed(1) : (user.rating > 0 ? user.rating.toFixed(1) : "N/A")}
            label={`${reviewStats.totalReviews || user.total_reviews || 0} Reviews`}
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

        {/* Reviews Section - Only for Agents/Agencies */}
        {(user.user_type === UserType.AGENT || user.user_type === UserType.AGENCY) && (
          <div className="pb-12">
            <Section title="Reviews & Ratings">
              <div className="space-y-6">
                {/* Review Summary */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Overall Rating */}
                  <div className="flex items-center gap-6 p-4 bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-foreground">
                        {reviewStats.averageRating > 0 ? reviewStats.averageRating.toFixed(1) : "N/A"}
                      </p>
                      <StarRating rating={Math.round(reviewStats.averageRating)} readonly size="small" />
                      <p className="text-sm text-muted-foreground mt-1">
                        {reviewStats.totalReviews} {reviewStats.totalReviews === 1 ? "review" : "reviews"}
                      </p>
                    </div>

                    {/* Rating Distribution */}
                    <div className="flex-1 space-y-1.5">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = reviewStats.ratingDistribution[star] || 0;
                        const percentage = reviewStats.totalReviews > 0 ? (count / reviewStats.totalReviews) * 100 : 0;
                        return (
                          <div key={star} className="flex items-center gap-2 text-sm">
                            <span className="w-3">{star}</span>
                            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                            <Progress value={percentage} className="h-2 flex-1" />
                            <span className="w-8 text-muted-foreground text-right">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Write Review CTA */}
                  <div className="flex flex-col justify-center items-center p-6 border border-dashed border-border rounded-lg bg-muted/10">
                    <h4 className="font-semibold text-foreground mb-2">Share Your Experience</h4>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      {canReview
                        ? userExistingReview
                          ? "You've already reviewed this agent. You can edit your review."
                          : "Help others by sharing your experience with this agent."
                        : authUser
                          ? "You cannot review your own profile."
                          : "Sign in to share your experience with this agent."}
                    </p>
                    {canReview && (
                      <WriteReviewDialog
                        agentId={user.$id}
                        agentName={fullName}
                        currentUser={currentUserInfo}
                        existingReview={userExistingReview}
                        onReviewSubmitted={handleReviewSubmitted}
                      />
                    )}
                    {!authUser && (
                      <Button variant="outline" asChild>
                        <Link href={`/signin?redirect=/u/${username}`}>
                          <PenLine className="h-4 w-4 mr-2" />
                          Sign in to Review
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Reviews List */}
                {reviewsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Spinner className="h-6 w-6" />
                  </div>
                ) : reviews.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-foreground">
                        {reviewStats.totalReviews} {reviewStats.totalReviews === 1 ? "Review" : "Reviews"}
                      </h4>
                    </div>

                    {(showAllReviews ? reviews : reviews.slice(0, 3)).map((review) => (
                      <ReviewCard
                        key={review.$id}
                        review={review}
                        onHelpful={handleHelpfulClick}
                      />
                    ))}

                    {reviews.length > 3 && (
                      <div className="text-center pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setShowAllReviews(!showAllReviews)}
                        >
                          {showAllReviews ? "Show Less" : `Show All ${reviews.length} Reviews`}
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Star className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h4 className="font-semibold text-foreground mb-2">No Reviews Yet</h4>
                    <p className="text-sm text-muted-foreground">
                      Be the first to review this {user.user_type === UserType.AGENT ? "agent" : "agency"}!
                    </p>
                  </div>
                )}
              </div>
            </Section>
          </div>
        )}
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
