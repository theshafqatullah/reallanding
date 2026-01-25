"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    MapPinIcon,
    PhoneIcon,
    MailIcon,
    ClockIcon,
    SendIcon,
    MessageSquareIcon,
    BuildingIcon,
    HeadphonesIcon,
    CheckCircleIcon,
    ArrowRightIcon,
    GlobeIcon,
    UsersIcon,
    BrainIcon,
    SparklesIcon,
    Zap,
    Video,
    Loader2,
} from "lucide-react";
import { contactService } from "@/services/contact";
import { toast } from "sonner";

const contactMethods = [
    {
        icon: PhoneIcon,
        title: "Call Us",
        description: "Speak directly with our team",
        value: "+1 (800) REAL-LAND",
        action: "Call Now",
        href: "tel:+18007325263",
    },
    {
        icon: MailIcon,
        title: "Email Us",
        description: "Get a response within 24 hours",
        value: "contact@reallanding.com",
        action: "Send Email",
        href: "mailto:contact@reallanding.com",
    },
    {
        icon: BrainIcon,
        title: "AI Assistant",
        description: "Get instant AI-powered help",
        value: "Available 24/7",
        action: "Start Chat",
        href: "#ai-chat",
        featured: true,
    },
];

const aiFeatures = [
    {
        icon: SparklesIcon,
        title: "Instant Answers",
        description: "Get immediate responses to your property questions",
    },
    {
        icon: Zap,
        title: "Smart Recommendations",
        description: "AI suggests properties based on your conversation",
    },
    {
        icon: Video,
        title: "Schedule Tours",
        description: "Book viewings directly through the chat",
    },
];

const officeLocations = [
    {
        city: "New York",
        address: "123 Property Lane, Manhattan, NY 10001",
        phone: "+1 (212) 555-0100",
        email: "ny@reallanding.com",
        hours: "Mon-Fri: 9AM-6PM",
    },
    {
        city: "Los Angeles",
        address: "456 Real Estate Blvd, LA, CA 90001",
        phone: "+1 (310) 555-0200",
        email: "la@reallanding.com",
        hours: "Mon-Fri: 9AM-6PM",
    },
    {
        city: "Miami",
        address: "789 Beach View Dr, Miami, FL 33101",
        phone: "+1 (305) 555-0300",
        email: "miami@reallanding.com",
        hours: "Mon-Fri: 9AM-6PM",
    },
];

const faqs = [
    {
        question: "How do I list my property?",
        answer: "Create an account, click 'List Property', and follow the simple steps to add your listing.",
    },
    {
        question: "Are there any listing fees?",
        answer: "Basic listings are free. Premium features are available with our Pro subscription.",
    },
    {
        question: "How long does it take to get a response?",
        answer: "We typically respond within 24 hours during business days.",
    },
    {
        question: "Can I schedule a property viewing?",
        answer: "Yes! Use the 'Schedule Viewing' button on any property listing page.",
    },
];

export default function ContactPageClient() {
    const [mounted, setMounted] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Prevent hydration mismatch with Radix UI Select
    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await contactService.createInquiry({
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                email: formData.email,
                phone: formData.phone || undefined,
                subject: formData.subject || undefined,
                message: formData.message,
                inquiry_type: "general",
            });

            setIsSubmitted(true);
            toast.success("Message sent successfully!", {
                description: "We'll get back to you within 24 hours.",
            });
        } catch (error) {
            console.error("Error submitting contact form:", error);
            toast.error("Failed to send message", {
                description: error instanceof Error ? error.message : "Please try again later.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary/90 via-primary to-primary/80 text-primary-foreground">
                <div className="absolute inset-0 opacity-10">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                    />
                </div>

                <div className="container mx-auto max-w-7xl px-4 py-16 md:py-24 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <Badge
                            variant="secondary"
                            className="mb-6 bg-white/20 text-primary-foreground border-white/30 hover:bg-white/30"
                        >
                            <HeadphonesIcon className="h-4 w-4 mr-2" />
                            We&apos;re Here to Help
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            Get in Touch With Us
                        </h1>
                        <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
                            Have questions about buying, selling, or renting? Our team of
                            real estate experts is ready to assist you.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Methods */}
            <section className="py-16 bg-white">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-24 relative z-20">
                        {contactMethods.map((method) => (
                            <Card
                                key={method.title}
                                className={`p-6 bg-white border shadow-none hover:-translate-y-1 transition-all duration-300 relative overflow-hidden ${'featured' in method && method.featured
                                    ? 'border-violet-200 ring-2 ring-violet-100'
                                    : 'border-border'
                                    }`}
                            >
                                {'featured' in method && method.featured && (
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-blue-600" />
                                )}
                                <div className="flex flex-col items-center text-center">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${'featured' in method && method.featured
                                        ? 'bg-gradient-to-br from-violet-500 to-blue-600'
                                        : 'bg-secondary'
                                        }`}>
                                        <method.icon className={`h-7 w-7 ${'featured' in method && method.featured ? 'text-white' : 'text-primary'
                                            }`} />
                                    </div>
                                    {'featured' in method && method.featured && (
                                        <Badge className="mb-2 bg-gradient-to-r from-violet-100 to-blue-100 text-violet-700 border-violet-200">
                                            <SparklesIcon className="h-3 w-3 mr-1" />
                                            AI Powered
                                        </Badge>
                                    )}
                                    <h3 className="text-lg font-semibold text-foreground mb-1">
                                        {method.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        {method.description}
                                    </p>
                                    <p className="font-medium text-foreground mb-4">
                                        {method.value}
                                    </p>
                                    <Button
                                        variant={'featured' in method && method.featured ? "default" : "outline"}
                                        className={`rounded-full ${'featured' in method && method.featured
                                            ? 'bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700'
                                            : ''
                                            }`}
                                        asChild
                                    >
                                        <a href={method.href}>
                                            {method.action}
                                            <ArrowRightIcon className="ml-2 h-4 w-4" />
                                        </a>
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Contact Form Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Send Us a Message
                            </h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                Fill out the form below and we&apos;ll get back to you within 24
                                hours.
                            </p>

                            {isSubmitted ? (
                                <Card className="p-8 text-center border border-border shadow-none">
                                    <div className="w-16 h-16 bg-chart-1/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircleIcon className="h-8 w-8 text-chart-1" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-foreground mb-2">
                                        Message Sent!
                                    </h3>
                                    <p className="text-muted-foreground mb-6">
                                        Thank you for reaching out. We&apos;ll get back to you within 24
                                        hours.
                                    </p>
                                    <Button
                                        onClick={() => setIsSubmitted(false)}
                                        className="rounded-full"
                                    >
                                        Send Another Message
                                    </Button>
                                </Card>
                            ) : (
                                <Card className="p-8 border border-border shadow-none">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName">First Name</Label>
                                                <Input
                                                    id="firstName"
                                                    name="firstName"
                                                    placeholder="John"
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    className="rounded-xl"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName">Last Name</Label>
                                                <Input
                                                    id="lastName"
                                                    name="lastName"
                                                    placeholder="Doe"
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                    className="rounded-xl"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="john@example.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="rounded-xl"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                placeholder="+1 (555) 000-0000"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="rounded-xl"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="subject">Subject</Label>
                                            {mounted ? (
                                                <Select
                                                    value={formData.subject}
                                                    onValueChange={(value) =>
                                                        setFormData({ ...formData, subject: value })
                                                    }
                                                >
                                                    <SelectTrigger className="rounded-xl">
                                                        <SelectValue placeholder="Select a subject" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="buying">
                                                            Buying Property
                                                        </SelectItem>
                                                        <SelectItem value="selling">
                                                            Selling Property
                                                        </SelectItem>
                                                        <SelectItem value="renting">
                                                            Renting Property
                                                        </SelectItem>
                                                        <SelectItem value="investment">
                                                            Investment Opportunities
                                                        </SelectItem>
                                                        <SelectItem value="agent">
                                                            Become an Agent
                                                        </SelectItem>
                                                        <SelectItem value="other">Other Inquiry</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <div className="flex h-10 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
                                                    Select a subject
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message">Message</Label>
                                            <Textarea
                                                id="message"
                                                name="message"
                                                placeholder="Tell us about your property needs..."
                                                value={formData.message}
                                                onChange={handleChange}
                                                className="min-h-[140px] rounded-xl resize-none"
                                                required
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full rounded-full"
                                            size="lg"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <SendIcon className="mr-2 h-5 w-5" />
                                                    Send Message
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </Card>
                            )}
                        </div>

                        {/* Contact Info Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Info Card */}
                            <Card className="p-6 border border-border shadow-none bg-secondary">
                                <h3 className="text-xl font-semibold text-foreground mb-6">
                                    Contact Information
                                </h3>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                                            <MapPinIcon className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-foreground mb-1">
                                                Headquarters
                                            </h4>
                                            <p className="text-muted-foreground">
                                                123 Property Lane
                                                <br />
                                                Real Estate City, RE 12345
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                                            <PhoneIcon className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-foreground mb-1">Phone</h4>
                                            <p className="text-muted-foreground">
                                                Main: +1 (800) REAL-LAND
                                                <br />
                                                Support: +1 (800) 555-0199
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                                            <MailIcon className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-foreground mb-1">Email</h4>
                                            <p className="text-muted-foreground">
                                                General: contact@reallanding.com
                                                <br />
                                                Support: help@reallanding.com
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                                            <ClockIcon className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-foreground mb-1">
                                                Business Hours
                                            </h4>
                                            <p className="text-muted-foreground">
                                                Mon - Fri: 9:00 AM - 6:00 PM
                                                <br />
                                                Sat - Sun: 10:00 AM - 4:00 PM
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Social Links */}
                            <Card className="p-6 border border-border shadow-none">
                                <h3 className="text-lg font-semibold text-foreground mb-4">
                                    Follow Us
                                </h3>
                                <div className="flex gap-3">
                                    {["Facebook", "Twitter", "Instagram", "LinkedIn"].map(
                                        (social) => (
                                            <Button
                                                key={social}
                                                variant="outline"
                                                size="sm"
                                                className="rounded-full"
                                            >
                                                {social}
                                            </Button>
                                        )
                                    )}
                                </div>
                            </Card>

                            {/* Quick Stats */}
                            <Card className="p-6 border border-border shadow-none">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 bg-secondary rounded-xl">
                                        <div className="text-3xl font-bold text-primary mb-1">
                                            24h
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Response Time
                                        </div>
                                    </div>
                                    <div className="text-center p-4 bg-secondary rounded-xl">
                                        <div className="text-3xl font-bold text-primary mb-1">
                                            98%
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Satisfaction
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI Chat Assistant Section */}
            <section id="ai-chat" className="py-20 bg-gradient-to-br from-violet-50 via-white to-blue-50 relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
                    <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: "1s" }} />
                </div>

                <div className="container mx-auto max-w-7xl px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-violet-100 to-blue-100 text-violet-700 border-violet-200">
                                <SparklesIcon className="h-3.5 w-3.5 mr-1" />
                                AI-Powered Support
                            </Badge>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Meet Our AI Assistant
                            </h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                Get instant answers to your questions 24/7. Our intelligent AI assistant can help you find properties, answer FAQs, and even schedule viewings.
                            </p>

                            <div className="space-y-4 mb-8">
                                {aiFeatures.map((feature) => (
                                    <div key={feature.title} className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <feature.icon className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground">{feature.title}</h3>
                                            <p className="text-muted-foreground text-sm">{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button size="lg" className="rounded-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700">
                                <BrainIcon className="mr-2 h-5 w-5" />
                                Start AI Chat
                            </Button>
                        </div>

                        {/* AI Chat Preview */}
                        <div className="relative">
                            <Card className="p-6 border border-violet-100 shadow-xl bg-white/80 backdrop-blur-sm">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-blue-600 rounded-full flex items-center justify-center">
                                        <BrainIcon className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">Real Landing AI</h4>
                                        <div className="flex items-center gap-1.5 text-sm text-chart-1">
                                            <span className="w-2 h-2 bg-chart-1 rounded-full animate-pulse" />
                                            Online
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    {/* AI Message */}
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                            <BrainIcon className="h-4 w-4 text-white" />
                                        </div>
                                        <div className="bg-secondary rounded-2xl rounded-tl-none p-4 max-w-[80%]">
                                            <p className="text-foreground text-sm">
                                                Hi! I&apos;m your AI assistant. I can help you find the perfect property, answer questions, or schedule viewings. What are you looking for today?
                                            </p>
                                        </div>
                                    </div>

                                    {/* User Message */}
                                    <div className="flex gap-3 justify-end">
                                        <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-none p-4 max-w-[80%]">
                                            <p className="text-sm">
                                                I&apos;m looking for a 3-bedroom apartment in Manhattan under $5000/month
                                            </p>
                                        </div>
                                    </div>

                                    {/* AI Response */}
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                            <BrainIcon className="h-4 w-4 text-white" />
                                        </div>
                                        <div className="bg-secondary rounded-2xl rounded-tl-none p-4 max-w-[80%]">
                                            <p className="text-foreground text-sm">
                                                Great choice! I found 24 apartments matching your criteria. Would you like me to show you the top recommendations or filter by specific neighborhoods?
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Chat Input */}
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Type your message..."
                                        className="rounded-full bg-secondary border-0"
                                        disabled
                                    />
                                    <Button size="icon" className="rounded-full bg-gradient-to-r from-violet-600 to-blue-600">
                                        <SendIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                            </Card>

                            {/* Floating stats */}
                            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-3 shadow-lg border border-violet-100">
                                <div className="text-lg font-bold text-violet-600">98%</div>
                                <div className="text-xs text-muted-foreground">Accuracy</div>
                            </div>
                            <div className="absolute -top-4 -right-4 bg-white rounded-xl p-3 shadow-lg border border-violet-100">
                                <div className="text-lg font-bold text-blue-600">&lt;2s</div>
                                <div className="text-xs text-muted-foreground">Response</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Office Locations */}
            <section className="py-20 bg-white">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Our Offices
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Visit us at one of our locations across the country
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {officeLocations.map((office) => (
                            <Card
                                key={office.city}
                                className="p-6 border border-border shadow-none bg-white"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                                        <BuildingIcon className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-foreground">
                                            {office.city}
                                        </h3>
                                        <Badge variant="secondary" className="text-xs">
                                            Open Now
                                        </Badge>
                                    </div>
                                </div>

                                <div className="space-y-3 text-sm">
                                    <div className="flex items-start gap-2">
                                        <MapPinIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                                        <span className="text-muted-foreground">
                                            {office.address}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">{office.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MailIcon className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">{office.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ClockIcon className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">{office.hours}</span>
                                    </div>
                                </div>

                                <Button
                                    variant="outline"
                                    className="w-full mt-6 rounded-full"
                                >
                                    Get Directions
                                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                                </Button>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Quick answers to common questions
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {faqs.map((faq, index) => (
                            <Card
                                key={index}
                                className="p-6 border border-border shadow-none"
                            >
                                <h3 className="font-semibold text-foreground mb-2">
                                    {faq.question}
                                </h3>
                                <p className="text-muted-foreground text-sm">{faq.answer}</p>
                            </Card>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <Button variant="outline" className="rounded-full">
                            View All FAQs
                            <ArrowRightIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Find Us on the Map
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Visit our headquarters for an in-person consultation
                        </p>
                    </div>

                    <Card className="overflow-hidden border border-border shadow-none">
                        <div className="bg-muted h-80 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <GlobeIcon className="h-8 w-8 text-primary" />
                                </div>
                                <p className="text-muted-foreground">Interactive Map</p>
                                <p className="text-sm text-muted-foreground/60">
                                    123 Property Lane, Real Estate City, RE 12345
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 p-12 rounded-3xl bg-primary text-primary-foreground">
                        <div className="text-center lg:text-left">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Need Immediate Assistance?
                            </h2>
                            <p className="text-xl text-primary-foreground/80 max-w-xl">
                                Our team of experts is available 24/7 to help you with your
                                property needs.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                size="lg"
                                variant="secondary"
                                className="rounded-full px-8"
                            >
                                <PhoneIcon className="mr-2 h-5 w-5" />
                                Call Us Now
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="rounded-full px-8 border-white/30 text-primary-foreground hover:bg-white/10"
                            >
                                <UsersIcon className="mr-2 h-5 w-5" />
                                Schedule a Meeting
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
