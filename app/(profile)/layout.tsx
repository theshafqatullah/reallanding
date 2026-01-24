"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth, AuthGuard } from "@/store/auth";
import { useAuth as useAppAuth, AuthProvider } from "@/lib/auth-context";
import { AuthHydrator } from "@/components/auth/auth-hydrator";
import { DashboardHeader } from "@/components/shared/dashboard-header";
import { KycBanner } from "@/components/shared/kyc-banner";
import { kycService, type KycStatusSummary } from "@/services/kyc";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import {
  User,
  Settings,
  Heart,
  Bell,
  Shield,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight,
  Building2,
  MessageSquare,
  BarChart3,
  LogIn,
  PlusIcon,
  Inbox,
  FileCheck,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

const navItems: NavItem[] = [
  {
    title: "Profile",
    href: "/profile",
    icon: User,
    description: "Your personal information",
  },
  {
    title: "My Listings",
    href: "/listings",
    icon: Building2,
    description: "Manage your properties",
  },
  {
    title: "Saved Properties",
    href: "/saved",
    icon: Heart,
    description: "Properties you've saved",
  },
  {
    title: "Inbox",
    href: "/inbox",
    icon: Inbox,
    description: "Your messages",
  },
  {
    title: "Inquiries",
    href: "/inquiries",
    icon: MessageSquare,
    description: "Messages and inquiries",
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    description: "Views and performance",
  },
  {
    title: "KYC Verification",
    href: "/kyc",
    icon: FileCheck,
    description: "Identity verification",
  },
];

const settingsItems: NavItem[] = [
  {
    title: "Account Settings",
    href: "/settings",
    icon: Settings,
    description: "Manage your account",
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
    description: "Notification preferences",
  },
  {
    title: "Security",
    href: "/security",
    icon: Shield,
    description: "Password and security",
  },
  {
    title: "Billing",
    href: "/billing",
    icon: CreditCard,
    description: "Subscription and payments",
  },
];

function ProfileSidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white border-r sticky top-16 h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex flex-col h-full overflow-y-auto scrollbar-hidden">
        {/* New Listing CTA */}
        <div className="p-4 border-b">
          <Button asChild className="w-full">
            <Link href="/listing/create">
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Listing
            </Link>
          </Button>
        </div>

        <nav className="flex-1 py-4">
          {/* Main Navigation */}
          <div className="px-3 pb-4">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Dashboard
            </h3>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "" : "text-muted-foreground group-hover:text-foreground")} />
                  <span className="flex-1">{item.title}</span>
                  {isActive && <ChevronRight className="h-4 w-4" />}
                </Link>
              );
            })}
          </div>

          <Separator className="mx-3" />

          {/* Settings Navigation */}
          <div className="px-3 py-4">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Settings
            </h3>
            {settingsItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "" : "text-muted-foreground group-hover:text-foreground")} />
                  <span className="flex-1">{item.title}</span>
                  {isActive && <ChevronRight className="h-4 w-4" />}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto border-t p-4 space-y-1">
          <Link
            href="/contact"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <HelpCircle className="h-5 w-5" />
            <span>Help & Support</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

function MobileNav() {
  const pathname = usePathname();

  const allItems = [...navItems, ...settingsItems];

  return (
    <div className="lg:hidden sticky top-0 z-40 bg-white border-b">
      <div className="overflow-x-auto">
        <nav className="flex gap-1 p-2 min-w-max">
          {allItems.slice(0, 6).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

function SignInPrompt() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <div className="w-48 h-48 mx-auto bg-muted rounded-full flex items-center justify-center">
            <div className="relative">
              <User className="w-24 h-24 text-muted-foreground/50" />
              <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-3">
          Sign in to access your profile
        </h1>
        <p className="text-muted-foreground mb-8">
          Access your personal dashboard, manage your listings, and connect
          with potential buyers and sellers.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link href="/signin">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/signup">Create Account</Link>
          </Button>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <Spinner className="h-8 w-8 mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

// Role-based access guard component
function RoleGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAppAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkUserRole = () => {
      if (authLoading) return;

      if (!user) {
        setIsChecking(false);
        return;
      }

      // Get user label (role) from Appwrite user preferences
      const userLabel = user.labels?.[0]; // Labels come from auth
      const allowedRoles = ["agent", "agency"];
      const hasAccess = allowedRoles.includes(userLabel);

      if (!hasAccess) {
        // Redirect regular users to their public profile
        router.replace("/u/profile");
        return;
      }

      setIsAuthorized(true);
      setIsChecking(false);
    };

    checkUserRole();
  }, [user, authLoading, router]);

  if (isChecking || authLoading) {
    return <LoadingFallback />;
  }

  if (!isAuthorized) {
    return <LoadingFallback />;
  }

  return <>{children}</>;
}

// KYC Banner wrapper component
function KycBannerWrapper() {
  const pathname = usePathname();
  const { user } = useAppAuth();
  const [kycStatus, setKycStatus] = useState<KycStatusSummary | null>(null);

  useEffect(() => {
    const loadKycStatus = async () => {
      if (!user?.$id) return;

      try {
        const status = await kycService.getVerificationStatus(user.$id);
        setKycStatus(status);
      } catch (error) {
        console.error("Failed to load KYC status:", error);
      }
    };

    loadKycStatus();
  }, [user?.$id]);

  // Don't show banner on KYC pages themselves
  if (pathname?.startsWith("/kyc")) {
    return null;
  }

  // Don't show if status not loaded or verified
  if (!kycStatus || kycStatus.overallStatus === "verified") {
    return null;
  }

  return (
    <div className="mb-6">
      <KycBanner
        status={kycStatus.overallStatus}
        missingCount={kycStatus.missingDocuments.length}
        rejectedCount={kycStatus.rejected}
      />
    </div>
  );
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AuthHydrator>
        <AuthGuard redirectTo="/signin" fallback={<LoadingFallback />}>
          <RoleGuard>
            <div className="h-screen flex flex-col">
              {/* Dashboard Header */}
              <DashboardHeader />

              <div className="flex flex-1 overflow-hidden">
                {/* Desktop Sidebar */}
                <ProfileSidebar />

                {/* Main Content */}
                <main className="flex-1 min-w-0 overflow-y-auto">
                  {/* Mobile Navigation */}
                  <MobileNav />

                  <div className="p-6 lg:p-8">
                    {/* KYC Status Banner */}
                    <KycBannerWrapper />

                    {children}
                  </div>
                </main>
              </div>
            </div>
          </RoleGuard>
        </AuthGuard>
      </AuthHydrator>
    </AuthProvider>
  );
}
