"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    HeadphonesIcon,
    Search,
    MessageCircle,
    Mail,
    Phone,
    FileText,
    HelpCircle,
    BookOpen,
    Video,
    ArrowRight,
    Building2,
    User,
    CreditCard,
    Shield,
    Home,
    Settings,
    AlertCircle,
    CheckCircle,
    Clock,
    Sparkles,
} from "lucide-react";

const supportCategories = [
    {
        id: "getting-started",
        name: "Getting Started",
        icon: BookOpen,
        description: "New to Real Landing? Start here",
        articles: 12,
        color: "bg-primary/20 text-primary",
    },
    {
        id: "account",
        name: "Account & Profile",
        icon: User,
        description: "Manage your account settings",
        articles: 18,
        color: "bg-purple-100 text-purple-600",
    },
    {
        id: "listings",
        name: "Listings & Properties",
        icon: Home,
        description: "Creating and managing listings",
        articles: 24,
        color: "bg-green-100 text-green-600",
    },
    {
        id: "billing",
        name: "Billing & Payments",
        icon: CreditCard,
        description: "Subscriptions and invoices",
        articles: 15,
        color: "bg-amber-100 text-amber-600",
    },
    {
        id: "agents",
        name: "For Agents",
        icon: Building2,
        description: "Agent-specific features",
        articles: 20,
        color: "bg-primary/20 text-primary",
    },
    {
        id: "security",
        name: "Security & Privacy",
        icon: Shield,
        description: "Keeping your account safe",
        articles: 10,
        color: "bg-red-100 text-red-600",
    },
];

const popularArticles = [
    {
        title: "How to create your first listing",
        category: "Listings",
        views: "12.5k",
        href: "/support/articles/create-listing",
    },
    {
        title: "Upgrading your subscription plan",
        category: "Billing",
        views: "8.2k",
        href: "/support/articles/upgrade-plan",
    },
    {
        title: "Getting verified as an agent",
        category: "Agents",
        views: "7.8k",
        href: "/support/articles/agent-verification",
    },
    {
        title: "Using the mortgage calculator",
        category: "Tools",
        views: "6.3k",
        href: "/support/articles/mortgage-calculator",
    },
    {
        title: "Setting up two-factor authentication",
        category: "Security",
        views: "5.9k",
        href: "/support/articles/2fa-setup",
    },
    {
        title: "Understanding analytics dashboard",
        category: "Analytics",
        views: "5.1k",
        href: "/support/articles/analytics",
    },
];

const quickFaqs = [
    {
        question: "How do I reset my password?",
        answer:
            "Click 'Forgot Password' on the sign-in page, enter your email, and follow the instructions in the email we send you. The reset link expires after 24 hours.",
    },
    {
        question: "How do I cancel my subscription?",
        answer:
            "Go to Settings > Billing > Manage Subscription > Cancel. Your plan will remain active until the end of your billing period.",
    },
    {
        question: "How long does listing approval take?",
        answer:
            "Most listings are reviewed within 24-48 hours. Premium members get priority review within a few hours.",
    },
    {
        question: "How do I contact the listing agent?",
        answer:
            "Click the 'Contact Agent' button on any listing page to send a message or request a viewing.",
    },
];

const systemStatus = {
    overall: "operational",
    services: [
        { name: "Website", status: "operational" },
        { name: "API", status: "operational" },
        { name: "Messaging", status: "operational" },
        { name: "Payments", status: "operational" },
    ],
};

export default function SupportPage() {
    const [searchQuery, setSearchQuery] = useState("");

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
                            Help Center
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            How Can We Help You?
                        </h1>
                        <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                            Search our help center or browse categories to find what you need
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-xl mx-auto">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search for help articles..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 py-6 text-lg bg-white text-foreground rounded-xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Contact Options */}
            <section className="py-8 bg-white border-b">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border-2 hover:border-primary/30 transition-colors cursor-pointer">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center shrink-0">
                                    <Sparkles className="h-6 w-6 text-violet-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">AI Assistant</h3>
                                    <p className="text-sm text-muted-foreground">Get instant answers 24/7</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-2 hover:border-primary/30 transition-colors cursor-pointer">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                                    <MessageCircle className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">Live Chat</h3>
                                    <p className="text-sm text-muted-foreground">Chat with our team</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Link href="/contact">
                            <Card className="border-2 hover:border-primary/30 transition-colors cursor-pointer">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                                        <Mail className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">Email Support</h3>
                                        <p className="text-sm text-muted-foreground">Response within 24h</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Help Categories */}
            <section className="py-16 bg-gray-50/50">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-foreground mb-4">Browse by Category</h2>
                        <p className="text-muted-foreground">
                            Find articles and guides organized by topic
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {supportCategories.map((category) => (
                            <Card
                                key={category.id}
                                className="hover:shadow-lg transition-all border hover:border-primary/30 cursor-pointer group"
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${category.color}`}
                                        >
                                            <category.icon className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                                                {category.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {category.description}
                                            </p>
                                            <Badge variant="secondary" className="text-xs">
                                                {category.articles} articles
                                            </Badge>
                                        </div>
                                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Articles */}
            <section className="py-16 bg-white">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Popular Articles */}
                        <div>
                            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                                <FileText className="h-6 w-6 text-primary" />
                                Popular Articles
                            </h2>
                            <div className="space-y-3">
                                {popularArticles.map((article, index) => (
                                    <Link
                                        key={index}
                                        href={article.href}
                                        className="flex items-center justify-between p-4 rounded-xl border hover:border-primary/30 hover:bg-gray-50 transition-all group"
                                    >
                                        <div>
                                            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                                                {article.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">{article.category}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs text-muted-foreground">
                                                {article.views} views
                                            </span>
                                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Quick FAQs */}
                        <div>
                            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                                <HelpCircle className="h-6 w-6 text-primary" />
                                Quick Answers
                            </h2>
                            <Accordion type="single" collapsible className="space-y-2">
                                {quickFaqs.map((faq, index) => (
                                    <AccordionItem
                                        key={index}
                                        value={`item-${index}`}
                                        className="border rounded-xl px-4"
                                    >
                                        <AccordionTrigger className="text-left hover:no-underline">
                                            <span className="font-medium text-foreground">{faq.question}</span>
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                            <Button variant="outline" className="mt-4 w-full" asChild>
                                <Link href="/faq">
                                    View All FAQs
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* System Status */}
            <section className="py-16 bg-gray-50/50">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="max-w-2xl mx-auto">
                        <Card className="border-2">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Settings className="h-5 w-5 text-primary" />
                                        System Status
                                    </CardTitle>
                                    <Badge
                                        variant="secondary"
                                        className="bg-green-100 text-green-700"
                                    >
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        All Systems Operational
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {systemStatus.services.map((service) => (
                                        <div
                                            key={service.name}
                                            className="flex items-center justify-between py-2 border-b last:border-0"
                                        >
                                            <span className="text-foreground">{service.name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                <span className="text-sm text-muted-foreground capitalize">
                                                    {service.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        Last updated: Just now
                                    </span>
                                    <Link
                                        href="/status"
                                        className="text-sm text-primary hover:underline"
                                    >
                                        View status page
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-foreground mb-4">
                            Still Need Help?
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Our support team is available to assist you with any questions
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                            <CardContent className="pt-0">
                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Phone className="h-7 w-7 text-primary" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-2">Phone Support</h3>
                                <p className="text-sm text-muted-foreground mb-2">Mon-Fri, 9AM-6PM EST</p>
                                <p className="font-medium text-primary">+1 (800) 732-5263</p>
                            </CardContent>
                        </Card>

                        <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                            <CardContent className="pt-0">
                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Mail className="h-7 w-7 text-primary" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-2">Email Support</h3>
                                <p className="text-sm text-muted-foreground mb-2">Response within 24h</p>
                                <p className="font-medium text-primary">support@reallanding.com</p>
                            </CardContent>
                        </Card>

                        <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                            <CardContent className="pt-0">
                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Video className="h-7 w-7 text-primary" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-2">Video Tutorials</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Learn with step-by-step guides
                                </p>
                                <Button variant="outline" size="sm">
                                    Watch Videos
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-primary text-primary-foreground">
                <div className="container mx-auto max-w-7xl px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Can&apos;t Find What You Need?</h2>
                    <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                        Submit a support request and our team will get back to you as soon as
                        possible.
                    </p>
                    <Button
                        size="lg"
                        className="bg-white text-primary hover:bg-white/90"
                        asChild
                    >
                        <Link href="/contact">
                            Contact Support
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}
