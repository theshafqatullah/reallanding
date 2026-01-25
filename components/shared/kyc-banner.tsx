"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { KycOverallStatus } from "@/services/kyc";
import {
    Shield,
    AlertTriangle,
    Clock,
    XCircle,
    CheckCircle2,
    ChevronRight,
    FileWarning,
} from "lucide-react";

interface KycBannerProps {
    status: KycOverallStatus;
    missingCount?: number;
    rejectedCount?: number;
    onDismiss?: () => void;
    compact?: boolean;
}

export function KycBanner({
    status,
    missingCount = 0,
    rejectedCount = 0,
    compact = false
}: KycBannerProps) {
    // Don't show banner if verified
    if (status === "verified") {
        return null;
    }

    const bannerConfig = {
        not_submitted: {
            icon: Shield,
            variant: "default" as const,
            bgColor: "bg-primary/10 border-primary/30",
            iconColor: "text-primary",
            title: "Complete Your KYC Verification",
            description: "Verify your identity to unlock all features and build trust with clients. This helps ensure the safety and security of our platform.",
            action: "Start Verification",
            href: "/kyc",
        },
        pending: {
            icon: Clock,
            variant: "default" as const,
            bgColor: "bg-yellow-50 border-yellow-200",
            iconColor: "text-yellow-600",
            title: "KYC Verification In Progress",
            description: missingCount > 0
                ? `Your documents are being reviewed. You still need to submit ${missingCount} more document(s) to complete verification.`
                : "Your documents are being reviewed. We'll notify you once the verification is complete.",
            action: missingCount > 0 ? "Complete Verification" : "View Status",
            href: "/kyc",
        },
        rejected: {
            icon: XCircle,
            variant: "destructive" as const,
            bgColor: "bg-red-50 border-red-200",
            iconColor: "text-red-600",
            title: "KYC Verification Failed",
            description: `${rejectedCount} document(s) were rejected. Please review the rejection reasons and resubmit the required documents.`,
            action: "Review & Resubmit",
            href: "/kyc",
        },
        suspended: {
            icon: FileWarning,
            variant: "destructive" as const,
            bgColor: "bg-red-50 border-red-200",
            iconColor: "text-red-600",
            title: "Account Suspended",
            description: "Your account has been suspended due to KYC verification issues. Please contact support for assistance.",
            action: "Contact Support",
            href: "/contact",
        },
    };

    const config = bannerConfig[status];
    const Icon = config.icon;

    if (compact) {
        return (
            <div className={`rounded-lg border p-3 ${config.bgColor}`}>
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 ${config.iconColor}`} />
                        <div>
                            <p className="font-medium text-sm">{config.title}</p>
                        </div>
                    </div>
                    <Button size="sm" variant={status === "rejected" || status === "suspended" ? "destructive" : "default"} asChild>
                        <Link href={config.href}>
                            {config.action}
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={`rounded-lg border p-4 ${config.bgColor}`}>
            <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${status === "not_submitted" ? "bg-primary/20" : status === "pending" ? "bg-yellow-100" : "bg-red-100"}`}>
                    <Icon className={`h-5 w-5 ${config.iconColor}`} />
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{config.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{config.description}</p>
                    <div className="mt-3">
                        <Button size="sm" variant={status === "rejected" || status === "suspended" ? "destructive" : "default"} asChild>
                            <Link href={config.href}>
                                {config.action}
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Inline alert version for profile pages
export function KycAlertBanner({ status, missingCount = 0, rejectedCount = 0 }: KycBannerProps) {
    if (status === "verified") {
        return null;
    }

    if (status === "not_submitted") {
        return (
            <Alert className="border-primary/30 bg-primary/10">
                <Shield className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary">Complete Your KYC Verification</AlertTitle>
                <AlertDescription className="text-primary/80">
                    <span>Verify your identity to unlock all features. </span>
                    <Link href="/kyc" className="font-medium underline hover:no-underline">
                        Start verification →
                    </Link>
                </AlertDescription>
            </Alert>
        );
    }

    if (status === "pending") {
        return (
            <Alert className="border-yellow-200 bg-yellow-50">
                <Clock className="h-4 w-4 text-yellow-600" />
                <AlertTitle className="text-yellow-800">Verification In Progress</AlertTitle>
                <AlertDescription className="text-yellow-700">
                    {missingCount > 0 ? (
                        <>
                            <span>You need to submit {missingCount} more document(s). </span>
                            <Link href="/kyc" className="font-medium underline hover:no-underline">
                                Complete verification →
                            </Link>
                        </>
                    ) : (
                        <span>Your documents are being reviewed. We&apos;ll notify you once complete.</span>
                    )}
                </AlertDescription>
            </Alert>
        );
    }

    if (status === "rejected") {
        return (
            <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Verification Failed</AlertTitle>
                <AlertDescription>
                    <span>{rejectedCount} document(s) were rejected. </span>
                    <Link href="/kyc" className="font-medium underline hover:no-underline">
                        Review and resubmit →
                    </Link>
                </AlertDescription>
            </Alert>
        );
    }

    if (status === "suspended") {
        return (
            <Alert variant="destructive">
                <FileWarning className="h-4 w-4" />
                <AlertTitle>Account Suspended</AlertTitle>
                <AlertDescription>
                    <span>Your account is suspended due to verification issues. </span>
                    <Link href="/contact" className="font-medium underline hover:no-underline">
                        Contact support →
                    </Link>
                </AlertDescription>
            </Alert>
        );
    }

    return null;
}
