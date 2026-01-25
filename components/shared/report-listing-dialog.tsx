"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Flag,
    AlertTriangle,
    FileWarning,
    Copy,
    Home,
    HelpCircle,
    Loader2,
    CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { propertyReportsService } from "@/services/property-reports";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

interface ReportListingDialogProps {
    propertyId: string;
    propertyTitle: string;
    trigger?: React.ReactNode;
    className?: string;
}

const reportTypes = [
    {
        value: "fraudulent",
        label: "Fraudulent Listing",
        description: "Scam, fake property, or misleading information",
        icon: AlertTriangle,
    },
    {
        value: "inappropriate",
        label: "Inappropriate Content",
        description: "Offensive images, text, or discriminatory language",
        icon: FileWarning,
    },
    {
        value: "inaccurate",
        label: "Inaccurate Information",
        description: "Wrong price, location, features, or photos",
        icon: HelpCircle,
    },
    {
        value: "duplicate",
        label: "Duplicate Listing",
        description: "Same property listed multiple times",
        icon: Copy,
    },
    {
        value: "sold_rented",
        label: "Already Sold/Rented",
        description: "Property is no longer available",
        icon: Home,
    },
    {
        value: "other",
        label: "Other Issue",
        description: "Any other concern about this listing",
        icon: Flag,
    },
];

export function ReportListingDialog({
    propertyId,
    propertyTitle,
    trigger,
    className,
}: ReportListingDialogProps) {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        reportType: "",
        description: "",
        email: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.reportType) {
            toast.error("Please select a reason for reporting");
            return;
        }

        if (!formData.description || formData.description.trim().length < 10) {
            toast.error("Please provide a detailed description (at least 10 characters)");
            return;
        }

        setIsSubmitting(true);

        try {
            // Check if user has already reported
            if (user) {
                const hasReported = await propertyReportsService.hasUserReported(
                    propertyId,
                    user.$id
                );
                if (hasReported) {
                    toast.error("You have already reported this listing");
                    setIsSubmitting(false);
                    return;
                }
            }

            await propertyReportsService.create({
                property_id: propertyId,
                reported_by_user_id: user?.$id,
                report_type: formData.reportType as "fraudulent" | "inappropriate" | "inaccurate" | "duplicate" | "sold_rented" | "other",
                description: formData.description.trim(),
                reporter_email: formData.email || user?.email,
            });

            setIsSubmitted(true);
            toast.success("Report submitted successfully", {
                description: "We will review your report and take appropriate action.",
            });

            // Reset after delay
            setTimeout(() => {
                setIsSubmitted(false);
                setFormData({
                    reportType: "",
                    description: "",
                    email: "",
                });
                setOpen(false);
            }, 2000);
        } catch (error) {
            console.error("Error submitting report:", error);
            toast.error("Failed to submit report. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Pre-fill email if logged in
    React.useEffect(() => {
        if (user && open) {
            setFormData((prev) => ({
                ...prev,
                email: user.email || prev.email,
            }));
        }
    }, [user, open]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" className={cn("gap-2", className)}>
                        <Flag className="h-4 w-4" />
                        Report Listing
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                {isSubmitted ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Report Submitted</h3>
                        <p className="text-muted-foreground">
                            Thank you for helping us maintain quality listings.
                        </p>
                    </div>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Flag className="h-5 w-5 text-destructive" />
                                Report This Listing
                            </DialogTitle>
                            <DialogDescription>
                                Help us maintain quality by reporting issues with{" "}
                                <span className="font-medium">{propertyTitle}</span>
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-6 py-4">
                            {/* Report Type Selection */}
                            <div className="space-y-3">
                                <Label>Why are you reporting this listing? *</Label>
                                <RadioGroup
                                    value={formData.reportType}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, reportType: value })
                                    }
                                    className="space-y-2"
                                >
                                    {reportTypes.map((type) => (
                                        <Label
                                            key={type.value}
                                            htmlFor={type.value}
                                            className={cn(
                                                "flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors",
                                                formData.reportType === type.value
                                                    ? "border-primary bg-primary/5"
                                                    : "border-border hover:border-primary/50"
                                            )}
                                        >
                                            <RadioGroupItem
                                                value={type.value}
                                                id={type.value}
                                                className="mt-0.5"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <type.icon className="h-4 w-4 text-muted-foreground" />
                                                    <span className="font-medium">{type.label}</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-0.5">
                                                    {type.description}
                                                </p>
                                            </div>
                                        </Label>
                                    ))}
                                </RadioGroup>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">
                                    Please describe the issue *
                                </Label>
                                <Textarea
                                    id="description"
                                    placeholder="Provide specific details about why you're reporting this listing..."
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    rows={4}
                                    required
                                    minLength={10}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Minimum 10 characters. Be as specific as possible.
                                </p>
                            </div>

                            {/* Email for follow-up (optional if not logged in) */}
                            {!user && (
                                <div className="space-y-2">
                                    <Label htmlFor="email">
                                        Your Email (Optional)
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="For follow-up if needed"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({ ...formData, email: e.target.value })
                                        }
                                    />
                                </div>
                            )}

                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                <p className="text-sm text-amber-800">
                                    <strong>Note:</strong> False reports may result in account restrictions.
                                    Please only report genuine issues.
                                </p>
                            </div>

                            <DialogFooter className="pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="destructive"
                                    disabled={isSubmitting || !formData.reportType}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Flag className="mr-2 h-4 w-4" />
                                            Submit Report
                                        </>
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
