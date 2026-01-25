"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
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
    HelpCircle,
    Search,
    Home,
    Users,
    CreditCard,
    Shield,
    FileText,
    MessageCircle,
    ArrowRight,
    Building2,
    Key,
    Calculator,
    Phone,
    Mail,
    Clock,
} from "lucide-react";

const faqCategories = [
    {
        id: "general",
        name: "General",
        icon: HelpCircle,
        description: "Basic questions about Real Landing",
    },
    {
        id: "buying",
        name: "Buying Property",
        icon: Home,
        description: "Questions about purchasing properties",
    },
    {
        id: "selling",
        name: "Selling Property",
        icon: Key,
        description: "Questions about listing and selling",
    },
    {
        id: "renting",
        name: "Renting",
        icon: Building2,
        description: "Questions about rental properties",
    },
    {
        id: "agents",
        name: "For Agents",
        icon: Users,
        description: "Questions for real estate professionals",
    },
    {
        id: "payments",
        name: "Payments & Fees",
        icon: CreditCard,
        description: "Pricing and payment questions",
    },
    {
        id: "account",
        name: "Account & Security",
        icon: Shield,
        description: "Account management and security",
    },
];

const faqs = {
    general: [
        {
            question: "What is Real Landing?",
            answer:
                "Real Landing is a comprehensive real estate platform that connects property buyers, sellers, renters, and real estate professionals. We provide advanced AI-powered tools, virtual tours, and a seamless experience for all your real estate needs.",
        },
        {
            question: "Is Real Landing available in my area?",
            answer:
                "Real Landing operates in over 200 cities across the country. You can check availability by entering your location in our search bar or contacting our support team for specific coverage areas.",
        },
        {
            question: "How do I create an account?",
            answer:
                "Creating an account is free and easy. Click the 'Sign Up' button in the top right corner, enter your email address, create a password, and verify your email. You can also sign up using your Google or Apple account for faster registration.",
        },
        {
            question: "What makes Real Landing different from other platforms?",
            answer:
                "Real Landing offers AI-powered property matching, immersive virtual reality tours, real-time market analytics, and a verified agent network. Our technology helps you find your perfect property faster and make more informed decisions.",
        },
    ],
    buying: [
        {
            question: "How do I search for properties?",
            answer:
                "Use our advanced search filters to find properties by location, price range, property type, number of bedrooms, and many other criteria. You can also use our AI-powered recommendations to discover properties that match your preferences.",
        },
        {
            question: "Can I schedule property viewings through the platform?",
            answer:
                "Yes! You can schedule both in-person viewings and virtual tours directly through our platform. Simply click the 'Schedule Viewing' button on any property listing and choose your preferred date and time.",
        },
        {
            question: "How do I know if a property is still available?",
            answer:
                "All listings on Real Landing are updated in real-time. Properties marked as 'Available' are currently on the market. You can also set up alerts to be notified when properties matching your criteria become available.",
        },
        {
            question: "What is the mortgage calculator for?",
            answer:
                "Our mortgage calculator helps you estimate monthly payments based on the property price, down payment, interest rate, and loan term. This tool helps you understand your budget and plan your finances before making an offer.",
        },
        {
            question: "How do I make an offer on a property?",
            answer:
                "Once you find a property you're interested in, you can contact the listing agent directly through our platform to discuss making an offer. We recommend connecting with a verified agent who can guide you through the negotiation process.",
        },
    ],
    selling: [
        {
            question: "How do I list my property for sale?",
            answer:
                "Click 'Create Listing' in your dashboard, fill in your property details, upload high-quality photos, and set your asking price. Our team will review your listing within 24-48 hours before it goes live.",
        },
        {
            question: "What are the fees for listing a property?",
            answer:
                "Basic listings are free with limited features. Premium listings with enhanced visibility, featured placement, and analytics start at $29/month. See our Advertise page for detailed pricing options.",
        },
        {
            question: "How can I make my listing stand out?",
            answer:
                "Use professional photos, write a compelling description, highlight unique features, and consider upgrading to a premium listing for better visibility. You can also use our Hot Listing or Super Hot Listing features for maximum exposure.",
        },
        {
            question: "How long does it take for my listing to go live?",
            answer:
                "Most listings are reviewed and approved within 24-48 hours. Premium account holders enjoy priority review with listings going live within a few hours.",
        },
    ],
    renting: [
        {
            question: "How do I find rental properties?",
            answer:
                "Use our search filters and select 'For Rent' under the listing type. You can filter by price range, location, property type, and amenities to find the perfect rental.",
        },
        {
            question: "Can I apply for rentals through Real Landing?",
            answer:
                "Yes, you can submit rental applications directly through our platform. Complete your renter profile once, and use it to apply to multiple properties without filling out the same information repeatedly.",
        },
        {
            question: "How do I contact landlords or property managers?",
            answer:
                "Each rental listing has a 'Contact' button that allows you to message the landlord or property manager directly. You can also schedule viewings through the platform.",
        },
        {
            question: "Are there any fees for renters?",
            answer:
                "Creating an account and searching for rentals is completely free for tenants. Some landlords may charge application fees, which will be clearly disclosed in the listing.",
        },
    ],
    agents: [
        {
            question: "How do I become a verified agent on Real Landing?",
            answer:
                "Click 'Apply as Agent' on our homepage, complete the application form, and submit your real estate license for verification. Our team will review your application within 3-5 business days.",
        },
        {
            question: "What subscription plans are available for agents?",
            answer:
                "We offer several plans: Starter ($149/month), Business ($499/month), Titanium ($999/month), and Titanium Plus ($1,999/month). Each plan includes different numbers of listings, promotional credits, and features.",
        },
        {
            question: "How do I receive leads from the platform?",
            answer:
                "When potential buyers or renters inquire about your listings, you'll receive notifications via email and in-app. Premium plans include priority lead routing and enhanced visibility for your profile.",
        },
        {
            question: "Can I import my existing listings?",
            answer:
                "Yes, agents can bulk import listings using our CSV import tool or through API integration. Contact our support team for assistance with large-scale imports.",
        },
    ],
    payments: [
        {
            question: "What payment methods do you accept?",
            answer:
                "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for subscription payments. All transactions are processed securely.",
        },
        {
            question: "Can I cancel my subscription anytime?",
            answer:
                "Yes, you can cancel your subscription at any time from your account settings. Your plan will remain active until the end of the current billing period.",
        },
        {
            question: "Do you offer refunds?",
            answer:
                "We offer a 30-day money-back guarantee for first-time subscribers. After this period, refunds are handled on a case-by-case basis. Contact support for assistance.",
        },
        {
            question: "Are there any hidden fees?",
            answer:
                "No, all our pricing is transparent. The subscription fee covers all included features. Any additional purchases like promotional credits are clearly priced.",
        },
    ],
    account: [
        {
            question: "How do I reset my password?",
            answer:
                "Click 'Forgot Password' on the sign-in page, enter your email address, and we'll send you a password reset link. For security, the link expires after 24 hours.",
        },
        {
            question: "How do I update my profile information?",
            answer:
                "Go to your dashboard, click on 'Profile', and edit your personal information, contact details, and preferences. Don't forget to save your changes.",
        },
        {
            question: "How do I delete my account?",
            answer:
                "You can delete your account from the Security section in your profile settings. Please note that this action is irreversible and will permanently remove all your data.",
        },
        {
            question: "Is my personal information secure?",
            answer:
                "Yes, we use industry-standard encryption and security measures to protect your data. We never share your personal information with third parties without your consent. See our Privacy Policy for details.",
        },
    ],
};

export default function FAQPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("general");

    const filteredFaqs = searchQuery
        ? Object.entries(faqs).flatMap(([category, questions]) =>
            questions
                .filter(
                    (faq) =>
                        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((faq) => ({ ...faq, category }))
        )
        : faqs[activeCategory as keyof typeof faqs];

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
                            <HelpCircle className="h-4 w-4 mr-2" />
                            Help Center
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                            Find answers to common questions about Real Landing. Can&apos;t find what
                            you&apos;re looking for? Contact our support team.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-xl mx-auto">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search for answers..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 py-6 text-lg bg-white text-foreground rounded-xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            {!searchQuery && (
                <section className="py-8 bg-white border-b">
                    <div className="container mx-auto max-w-7xl px-4">
                        <div className="flex flex-wrap gap-3 justify-center">
                            {faqCategories.map((category) => (
                                <Button
                                    key={category.id}
                                    variant={activeCategory === category.id ? "default" : "outline"}
                                    onClick={() => setActiveCategory(category.id)}
                                    className="flex items-center gap-2"
                                >
                                    <category.icon className="h-4 w-4" />
                                    {category.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* FAQ Content */}
            <section className="py-16 bg-gray-50/50">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Sidebar - Categories (Desktop) */}
                        {!searchQuery && (
                            <div className="hidden lg:block">
                                <div className="sticky top-24 space-y-2">
                                    <h3 className="font-semibold text-foreground mb-4">Categories</h3>
                                    {faqCategories.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => setActiveCategory(category.id)}
                                            className={`w-full text-left p-3 rounded-lg transition-colors ${activeCategory === category.id
                                                    ? "bg-primary text-primary-foreground"
                                                    : "hover:bg-gray-100 text-muted-foreground"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <category.icon className="h-5 w-5" />
                                                <div>
                                                    <div className="font-medium">{category.name}</div>
                                                    <div className="text-xs opacity-80">{category.description}</div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* FAQ List */}
                        <div className={searchQuery ? "lg:col-span-4" : "lg:col-span-3"}>
                            {searchQuery && (
                                <div className="mb-6">
                                    <p className="text-muted-foreground">
                                        Showing {filteredFaqs.length} results for &quot;{searchQuery}&quot;
                                    </p>
                                </div>
                            )}

                            <Card className="border shadow-sm">
                                <CardContent className="p-0">
                                    <Accordion type="single" collapsible className="w-full">
                                        {(Array.isArray(filteredFaqs) ? filteredFaqs : filteredFaqs).map(
                                            (faq, index) => (
                                                <AccordionItem
                                                    key={index}
                                                    value={`item-${index}`}
                                                    className="border-b last:border-0"
                                                >
                                                    <AccordionTrigger className="px-6 py-4 text-left hover:no-underline hover:bg-gray-50">
                                                        <div className="flex items-start gap-3">
                                                            <HelpCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                                            <span className="font-medium text-foreground">
                                                                {faq.question}
                                                            </span>
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="px-6 pb-4">
                                                        <div className="pl-8 text-muted-foreground leading-relaxed">
                                                            {faq.answer}
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            )
                                        )}
                                    </Accordion>
                                </CardContent>
                            </Card>

                            {filteredFaqs.length === 0 && (
                                <div className="text-center py-12">
                                    <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-foreground mb-2">
                                        No results found
                                    </h3>
                                    <p className="text-muted-foreground mb-4">
                                        Try a different search term or browse our categories
                                    </p>
                                    <Button variant="outline" onClick={() => setSearchQuery("")}>
                                        Clear search
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Still Need Help */}
            <section className="py-16 bg-white">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-foreground mb-4">
                            Still Have Questions?
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Our support team is here to help you with any questions or concerns
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                            <CardContent className="pt-0">
                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <MessageCircle className="h-7 w-7 text-primary" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-2">Live Chat</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Chat with our AI assistant or a support agent
                                </p>
                                <Button variant="outline" size="sm">
                                    Start Chat
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                            <CardContent className="pt-0">
                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Mail className="h-7 w-7 text-primary" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-2">Email Support</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Get a response within 24 hours
                                </p>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href="/contact">Send Email</Link>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                            <CardContent className="pt-0">
                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Phone className="h-7 w-7 text-primary" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-2">Phone Support</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Mon-Fri, 9AM-6PM EST
                                </p>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href="tel:+18007325263">Call Us</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Related Links */}
            <section className="py-16 bg-gray-50/50">
                <div className="container mx-auto max-w-7xl px-4">
                    <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                        Helpful Resources
                    </h2>

                    <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        <Link
                            href="/about"
                            className="flex items-center gap-3 p-4 rounded-xl border bg-white hover:shadow-md transition-shadow"
                        >
                            <Building2 className="h-5 w-5 text-primary" />
                            <span className="font-medium text-foreground">About Us</span>
                        </Link>
                        <Link
                            href="/contact"
                            className="flex items-center gap-3 p-4 rounded-xl border bg-white hover:shadow-md transition-shadow"
                        >
                            <MessageCircle className="h-5 w-5 text-primary" />
                            <span className="font-medium text-foreground">Contact</span>
                        </Link>
                        <Link
                            href="/terms"
                            className="flex items-center gap-3 p-4 rounded-xl border bg-white hover:shadow-md transition-shadow"
                        >
                            <FileText className="h-5 w-5 text-primary" />
                            <span className="font-medium text-foreground">Terms of Service</span>
                        </Link>
                        <Link
                            href="/privacy"
                            className="flex items-center gap-3 p-4 rounded-xl border bg-white hover:shadow-md transition-shadow"
                        >
                            <Shield className="h-5 w-5 text-primary" />
                            <span className="font-medium text-foreground">Privacy Policy</span>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
