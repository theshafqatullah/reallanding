"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { MessageCircleIcon, AlertCircleIcon } from "lucide-react";
import { inquiriesService } from "@/services/inquiries";
import { useAuth } from "@/store/auth";
import { toast } from "sonner";

interface PropertyInquiryDialogProps {
    propertyId: string;
    propertyTitle?: string;
    variant?: "default" | "outline" | "secondary" | "ghost";
    size?: "default" | "sm" | "lg" | "icon";
    className?: string;
}

export function PropertyInquiryDialog({
    propertyId,
    propertyTitle,
    variant = "default",
    size = "default",
    className,
}: PropertyInquiryDialogProps) {
    const { user, isAuthenticated } = useAuth();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: "",
        inquiryType: "general",
        preferredContact: "email",
        preferredTime: "anytime",
        message: "",
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.name.trim()) {
            toast.error("Please enter your name");
            return;
        }

        if (!formData.email.trim()) {
            toast.error("Please enter your email");
            return;
        }

        if (!formData.phone.trim()) {
            toast.error("Please enter your phone number");
            return;
        }

        if (!formData.message.trim()) {
            toast.error("Please enter a message");
            return;
        }

        try {
            setLoading(true);

            await inquiriesService.create({
                property_id: propertyId,
                inquirer_id: user?.$id || undefined,
                inquirer_name: formData.name.trim(),
                inquirer_email: formData.email.trim(),
                inquirer_phone: formData.phone.trim(),
                inquiry_type: formData.inquiryType,
                preferred_contact_method: formData.preferredContact,
                preferred_contact_time: formData.preferredTime,
                message: formData.message.trim(),
                subject: `Inquiry about ${propertyTitle || "property"}`,
                source: "website_property_page",
            });

            toast.success("Inquiry sent successfully! The property owner will contact you soon.");
            setOpen(false);

            // Reset form
            setFormData({
                name: user?.name || "",
                email: user?.email || "",
                phone: "",
                inquiryType: "general",
                preferredContact: "email",
                preferredTime: "anytime",
                message: "",
            });
        } catch (error) {
            console.error("Error sending inquiry:", error);
            toast.error("Failed to send inquiry. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!isAuthenticated && newOpen) {
            toast.error("Please sign in to send an inquiry");
            return;
        }
        setOpen(newOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    variant={variant}
                    size={size}
                    className={className}
                >
                    <MessageCircleIcon className="h-4 w-4 mr-2" />
                    Inquire Now
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Inquire About Property</DialogTitle>
                    <DialogDescription>
                        {propertyTitle
                            ? `Ask about ${propertyTitle}`
                            : "Send an inquiry to the property owner"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Your full name"
                            value={formData.name}
                            onChange={handleInputChange}
                            disabled={loading}
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={loading}
                            required
                        />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="+92 300 1234567"
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled={loading}
                            required
                        />
                    </div>

                    {/* Inquiry Type */}
                    <div className="space-y-2">
                        <Label htmlFor="inquiryType">Inquiry Type</Label>
                        <Select
                            value={formData.inquiryType}
                            onValueChange={(value) =>
                                handleSelectChange("inquiryType", value)
                            }
                            disabled={loading}
                        >
                            <SelectTrigger id="inquiryType">
                                <SelectValue placeholder="Select inquiry type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="general">General Inquiry</SelectItem>
                                <SelectItem value="viewing">Schedule Viewing</SelectItem>
                                <SelectItem value="price">Price Negotiation</SelectItem>
                                <SelectItem value="financing">Financing Options</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Preferred Contact Method */}
                    <div className="space-y-2">
                        <Label htmlFor="preferredContact">Preferred Contact Method</Label>
                        <Select
                            value={formData.preferredContact}
                            onValueChange={(value) =>
                                handleSelectChange("preferredContact", value)
                            }
                            disabled={loading}
                        >
                            <SelectTrigger id="preferredContact">
                                <SelectValue placeholder="Select contact method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="phone">Phone</SelectItem>
                                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Preferred Contact Time */}
                    <div className="space-y-2">
                        <Label htmlFor="preferredTime">Preferred Contact Time</Label>
                        <Select
                            value={formData.preferredTime}
                            onValueChange={(value) =>
                                handleSelectChange("preferredTime", value)
                            }
                            disabled={loading}
                        >
                            <SelectTrigger id="preferredTime">
                                <SelectValue placeholder="Select preferred time" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="anytime">Anytime</SelectItem>
                                <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                                <SelectItem value="afternoon">Afternoon (12 PM - 5 PM)</SelectItem>
                                <SelectItem value="evening">Evening (5 PM - 9 PM)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                            id="message"
                            name="message"
                            placeholder="Tell us more about your inquiry..."
                            value={formData.message}
                            onChange={handleInputChange}
                            disabled={loading}
                            rows={4}
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            {formData.message.length}/500 characters
                        </p>
                    </div>

                    {/* Info Message */}
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
                        <AlertCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-800">
                            Your contact information will be shared with the property owner to
                            help them respond to your inquiry.
                        </p>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="flex-1">
                            {loading ? (
                                <>
                                    <Spinner className="h-4 w-4 mr-2" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <MessageCircleIcon className="h-4 w-4 mr-2" />
                                    Send Inquiry
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
