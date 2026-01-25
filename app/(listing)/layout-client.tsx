"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthGuard } from "@/store/auth";
import { AuthHydrator } from "@/components/auth/auth-hydrator";
import { Spinner } from "@/components/ui/spinner";
import { Toaster } from "@/components/ui/sonner";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
    HomeIcon,
    ListIcon,
    ImageIcon,
    CheckIcon,
    ArrowLeft,
    Building2,
    HelpCircle,
    FileText,
    ChevronRight,
    Eye,
} from "lucide-react";

interface Step {
    number: number;
    title: string;
    description: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}

const steps: Step[] = [
    {
        number: 1,
        title: "Basic Info",
        description: "Property type & location",
        href: "/listing/create",
        icon: HomeIcon,
    },
    {
        number: 2,
        title: "Details",
        description: "Features & amenities",
        href: "/listing/create/details",
        icon: ListIcon,
    },
    {
        number: 3,
        title: "Media & Publish",
        description: "Photos & contact info",
        href: "/listing/create/media",
        icon: ImageIcon,
    },
];

const quickLinks = [
    {
        title: "My Listings",
        href: "/listings",
        icon: Building2,
        description: "View all your properties",
    },
    {
        title: "Drafts",
        href: "/listings?status=draft",
        icon: FileText,
        description: "Continue editing",
    },
    {
        title: "Preview",
        href: "#",
        icon: Eye,
        description: "See how it looks",
    },
];

function ListingSidebar() {
    const pathname = usePathname();

    const getCurrentStep = (): number => {
        if (pathname === "/listing/create") return 1;
        if (pathname === "/listing/create/details") return 2;
        if (pathname === "/listing/create/media") return 3;
        return 1;
    };

    const currentStep = getCurrentStep();

    return (
        <aside className="hidden lg:flex flex-col w-72 shrink-0">
            <div className="sticky top-20">
                {/* Back to Dashboard */}
                <Link
                    href="/listings"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Dashboard</span>
                </Link>

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-xl font-bold text-foreground">Create New Listing</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Fill in the details to list your property
                    </p>
                </div>

                {/* Steps Navigation */}
                <nav className="space-y-1 mb-6">
                    <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        Steps
                    </h3>
                    {steps.map((step) => {
                        const isCompleted = step.number < currentStep;
                        const isCurrent = step.number === currentStep;
                        const isUpcoming = step.number > currentStep;

                        return (
                            <Link
                                key={step.href}
                                href={isUpcoming ? "#" : step.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all group",
                                    isCurrent && "bg-primary text-primary-foreground shadow-sm",
                                    isCompleted && "bg-green-50 text-green-700 hover:bg-green-100",
                                    isUpcoming && "text-muted-foreground cursor-not-allowed opacity-60"
                                )}
                            >
                                <span
                                    className={cn(
                                        "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors shrink-0",
                                        isCurrent && "border-primary-foreground/30 bg-primary-foreground/20",
                                        isCompleted && "border-green-500 bg-green-500 text-white",
                                        isUpcoming && "border-muted bg-muted/50"
                                    )}
                                >
                                    {isCompleted ? (
                                        <CheckIcon className="h-4 w-4" />
                                    ) : (
                                        <step.icon className="h-4 w-4" />
                                    )}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <span className="block truncate">{step.title}</span>
                                    <span
                                        className={cn(
                                            "text-xs block truncate",
                                            isCurrent && "text-primary-foreground/70",
                                            isCompleted && "text-green-600",
                                            isUpcoming && "text-muted-foreground"
                                        )}
                                    >
                                        {step.description}
                                    </span>
                                </div>
                                {isCurrent && <ChevronRight className="h-4 w-4 shrink-0" />}
                                {isCompleted && <CheckIcon className="h-4 w-4 shrink-0 text-green-600" />}
                            </Link>
                        );
                    })}
                </nav>

                <Separator />

                {/* Quick Links */}
                <div className="py-4">
                    <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        Quick Links
                    </h3>
                    {quickLinks.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors group"
                        >
                            <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                            <span className="flex-1">{item.title}</span>
                        </Link>
                    ))}
                </div>

                <Separator />

                {/* Help Section */}
                <div className="py-4">
                    <Link
                        href="/contact"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                        <HelpCircle className="h-5 w-5" />
                        <span>Need Help?</span>
                    </Link>
                </div>

                {/* Tips Card */}
                <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <h4 className="font-medium text-primary text-sm mb-2">💡 Pro Tip</h4>
                    <p className="text-xs text-primary/80">
                        Properties with high-quality photos get 3x more views. Make sure to upload clear, well-lit images.
                    </p>
                </div>
            </div>
        </aside>
    );
}

function MobileStepsNav() {
    const pathname = usePathname();

    const getCurrentStep = (): number => {
        if (pathname === "/listing/create") return 1;
        if (pathname === "/listing/create/details") return 2;
        if (pathname === "/listing/create/media") return 3;
        return 1;
    };

    const currentStep = getCurrentStep();

    return (
        <div className="lg:hidden sticky top-16 z-40 bg-white border-b shadow-sm">
            <div className="container mx-auto px-4 py-4">
                {/* Back Link */}
                <Link
                    href="/listings"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Dashboard</span>
                </Link>

                {/* Progress Bar */}
                <div className="flex items-center gap-2">
                    {steps.map((step, idx) => {
                        const isCompleted = step.number < currentStep;
                        const isCurrent = step.number === currentStep;

                        return (
                            <React.Fragment key={step.number}>
                                <Link
                                    href={step.number <= currentStep ? step.href : "#"}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium transition-all",
                                        isCurrent && "bg-primary text-primary-foreground",
                                        isCompleted && "bg-green-100 text-green-700",
                                        !isCurrent && !isCompleted && "bg-muted text-muted-foreground"
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "flex h-5 w-5 items-center justify-center rounded-full text-[10px]",
                                            isCurrent && "bg-primary-foreground/20",
                                            isCompleted && "bg-green-500 text-white"
                                        )}
                                    >
                                        {isCompleted ? <CheckIcon className="h-3 w-3" /> : step.number}
                                    </span>
                                    <span className="hidden sm:inline">{step.title}</span>
                                </Link>
                                {idx < steps.length - 1 && (
                                    <div
                                        className={cn(
                                            "flex-1 h-0.5 max-w-8",
                                            isCompleted ? "bg-green-500" : "bg-muted"
                                        )}
                                    />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function LoadingFallback() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="text-center">
                <Spinner className="w-8 h-8 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
        </div>
    );
}

export default function ListingLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthHydrator>
            <AuthGuard redirectTo="/signin" fallback={<LoadingFallback />}>
                <div className="min-h-screen bg-gray-50">
                    {/* Mobile Steps Navigation */}
                    <MobileStepsNav />

                    <div className="container mx-auto max-w-7xl px-4 py-8">
                        <div className="flex gap-8">
                            {/* Desktop Sidebar */}
                            <ListingSidebar />

                            {/* Main Content */}
                            <main className="flex-1 min-w-0 max-w-4xl">{children}</main>
                        </div>
                    </div>

                    <Toaster richColors position="top-right" />
                </div>
            </AuthGuard>
        </AuthHydrator>
    );
}
