"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    Check,
    X,
    Zap,
    Crown,
    Building2,
    User,
    ArrowRight,
    Star,
    Shield,
    Headphones,
    HelpCircle,
    Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const agentPlans = [
    {
        name: "Free",
        description: "For individuals getting started",
        monthlyPrice: 0,
        yearlyPrice: 0,
        icon: User,
        features: [
            { name: "5 property listings", included: true },
            { name: "Basic analytics", included: true },
            { name: "Profile page", included: true },
            { name: "Messaging", included: true },
            { name: "Email support", included: true },
            { name: "Featured listings", included: false },
            { name: "Priority support", included: false },
            { name: "AI property matching", included: false },
            { name: "Virtual tour hosting", included: false },
            { name: "Lead management", included: false },
        ],
        cta: "Get Started",
        popular: false,
    },
    {
        name: "Professional",
        description: "For active agents",
        monthlyPrice: 49,
        yearlyPrice: 39,
        icon: Zap,
        features: [
            { name: "50 property listings", included: true },
            { name: "Advanced analytics", included: true },
            { name: "Premium profile", included: true },
            { name: "Unlimited messaging", included: true },
            { name: "Priority email support", included: true },
            { name: "5 featured listings/month", included: true },
            { name: "Lead management", included: true },
            { name: "AI property matching", included: false },
            { name: "Virtual tour hosting", included: false },
            { name: "API access", included: false },
        ],
        cta: "Start Free Trial",
        popular: true,
    },
    {
        name: "Business",
        description: "For high-volume agents",
        monthlyPrice: 99,
        yearlyPrice: 79,
        icon: Crown,
        features: [
            { name: "Unlimited listings", included: true },
            { name: "Comprehensive analytics", included: true },
            { name: "Premium profile with badge", included: true },
            { name: "Unlimited messaging", included: true },
            { name: "24/7 priority support", included: true },
            { name: "20 featured listings/month", included: true },
            { name: "Advanced lead management", included: true },
            { name: "AI property matching", included: true },
            { name: "Virtual tour hosting", included: true },
            { name: "API access", included: true },
        ],
        cta: "Start Free Trial",
        popular: false,
    },
];

const agencyPlans = [
    {
        name: "Starter",
        description: "For small agencies",
        monthlyPrice: 149,
        yearlyPrice: 119,
        agents: "Up to 5 agents",
        features: [
            "50 listings total",
            "Basic team analytics",
            "Agency profile page",
            "Shared inbox",
            "Email support",
        ],
        cta: "Start Free Trial",
        popular: false,
    },
    {
        name: "Growth",
        description: "For growing agencies",
        monthlyPrice: 349,
        yearlyPrice: 279,
        agents: "Up to 15 agents",
        features: [
            "200 listings total",
            "Advanced team analytics",
            "Premium agency profile",
            "Team inbox & CRM",
            "Priority support",
            "Lead routing",
            "Custom branding",
        ],
        cta: "Start Free Trial",
        popular: true,
    },
    {
        name: "Enterprise",
        description: "For large brokerages",
        monthlyPrice: 799,
        yearlyPrice: 639,
        agents: "Unlimited agents",
        features: [
            "Unlimited listings",
            "Enterprise analytics",
            "Custom agency portal",
            "Full CRM suite",
            "Dedicated account manager",
            "Advanced lead routing",
            "API access & integrations",
            "White-label options",
        ],
        cta: "Contact Sales",
        popular: false,
    },
];

const faqs = [
    {
        question: "Can I switch plans at any time?",
        answer:
            "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges.",
    },
    {
        question: "What payment methods do you accept?",
        answer:
            "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual plans.",
    },
    {
        question: "Is there a free trial?",
        answer:
            "Yes! All paid plans come with a 14-day free trial. No credit card required to start.",
    },
    {
        question: "What happens if I exceed my listing limit?",
        answer:
            "You'll receive a notification when you're approaching your limit. You can either upgrade your plan or purchase additional listing slots.",
    },
    {
        question: "Can I cancel my subscription?",
        answer:
            "You can cancel your subscription at any time. Your plan will remain active until the end of the current billing period.",
    },
    {
        question: "Do you offer discounts for annual billing?",
        answer:
            "Yes! You save 20% when you choose annual billing instead of monthly billing.",
    },
];

export default function PricingPage() {
    const [isYearly, setIsYearly] = useState(true);
    const [selectedTab, setSelectedTab] = useState<"agents" | "agencies">("agents");

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
                            <Sparkles className="h-4 w-4 mr-2" />
                            Simple, Transparent Pricing
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            Choose the Perfect Plan for Your Business
                        </h1>
                        <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
                            Start free and scale as you grow. No hidden fees, no surprises.
                        </p>
                    </div>
                </div>
            </section>

            {/* Tab Selector & Billing Toggle */}
            <section className="py-8 bg-white border-b sticky top-16 z-30">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Tab Selector */}
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setSelectedTab("agents")}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                                    selectedTab === "agents"
                                        ? "bg-white text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <User className="h-4 w-4" />
                                For Agents
                            </button>
                            <button
                                onClick={() => setSelectedTab("agencies")}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                                    selectedTab === "agencies"
                                        ? "bg-white text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Building2 className="h-4 w-4" />
                                For Agencies
                            </button>
                        </div>

                        {/* Billing Toggle */}
                        <div className="flex items-center gap-3">
                            <Label
                                htmlFor="billing-toggle"
                                className={cn(
                                    "text-sm cursor-pointer",
                                    !isYearly ? "text-foreground font-medium" : "text-muted-foreground"
                                )}
                            >
                                Monthly
                            </Label>
                            <Switch
                                id="billing-toggle"
                                checked={isYearly}
                                onCheckedChange={setIsYearly}
                            />
                            <Label
                                htmlFor="billing-toggle"
                                className={cn(
                                    "text-sm cursor-pointer",
                                    isYearly ? "text-foreground font-medium" : "text-muted-foreground"
                                )}
                            >
                                Yearly
                            </Label>
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                                Save 20%
                            </Badge>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-16 bg-gray-50/50">
                <div className="container mx-auto max-w-7xl px-4">
                    {selectedTab === "agents" ? (
                        <div className="grid md:grid-cols-3 gap-8">
                            {agentPlans.map((plan) => (
                                <Card
                                    key={plan.name}
                                    className={cn(
                                        "relative border-2 transition-all hover:shadow-xl",
                                        plan.popular
                                            ? "border-primary shadow-lg scale-105 z-10"
                                            : "border-border hover:border-primary/30"
                                    )}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                            <Badge className="bg-primary text-primary-foreground shadow-md">
                                                <Star className="h-3 w-3 mr-1 fill-current" />
                                                Most Popular
                                            </Badge>
                                        </div>
                                    )}
                                    <CardHeader className="text-center pb-2">
                                        <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                                            <plan.icon className="h-7 w-7 text-primary" />
                                        </div>
                                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-center mb-6">
                                            <div className="flex items-baseline justify-center gap-1">
                                                <span className="text-4xl font-bold text-foreground">
                                                    ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                                                </span>
                                                <span className="text-muted-foreground">/month</span>
                                            </div>
                                            {isYearly && plan.monthlyPrice > 0 && (
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Billed ${plan.yearlyPrice * 12}/year
                                                </p>
                                            )}
                                        </div>

                                        <ul className="space-y-3 mb-6">
                                            {plan.features.map((feature) => (
                                                <li
                                                    key={feature.name}
                                                    className={cn(
                                                        "flex items-center gap-2 text-sm",
                                                        feature.included
                                                            ? "text-foreground"
                                                            : "text-muted-foreground"
                                                    )}
                                                >
                                                    {feature.included ? (
                                                        <Check className="h-4 w-4 text-green-500 shrink-0" />
                                                    ) : (
                                                        <X className="h-4 w-4 text-gray-300 shrink-0" />
                                                    )}
                                                    {feature.name}
                                                </li>
                                            ))}
                                        </ul>

                                        <Button
                                            className="w-full"
                                            variant={plan.popular ? "default" : "outline"}
                                            asChild
                                        >
                                            <Link href={plan.monthlyPrice === 0 ? "/signup" : "/signup?plan=" + plan.name.toLowerCase()}>
                                                {plan.cta}
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-8">
                            {agencyPlans.map((plan) => (
                                <Card
                                    key={plan.name}
                                    className={cn(
                                        "relative border-2 transition-all hover:shadow-xl",
                                        plan.popular
                                            ? "border-primary shadow-lg scale-105 z-10"
                                            : "border-border hover:border-primary/30"
                                    )}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                            <Badge className="bg-primary text-primary-foreground shadow-md">
                                                <Star className="h-3 w-3 mr-1 fill-current" />
                                                Most Popular
                                            </Badge>
                                        </div>
                                    )}
                                    <CardHeader className="text-center pb-2">
                                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                                        <Badge variant="secondary" className="mt-2">
                                            {plan.agents}
                                        </Badge>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-center mb-6">
                                            <div className="flex items-baseline justify-center gap-1">
                                                <span className="text-4xl font-bold text-foreground">
                                                    ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                                                </span>
                                                <span className="text-muted-foreground">/month</span>
                                            </div>
                                            {isYearly && (
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Billed ${plan.yearlyPrice * 12}/year
                                                </p>
                                            )}
                                        </div>

                                        <ul className="space-y-3 mb-6">
                                            {plan.features.map((feature) => (
                                                <li
                                                    key={feature}
                                                    className="flex items-center gap-2 text-sm text-foreground"
                                                >
                                                    <Check className="h-4 w-4 text-green-500 shrink-0" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>

                                        <Button
                                            className="w-full"
                                            variant={plan.popular ? "default" : "outline"}
                                            asChild
                                        >
                                            <Link
                                                href={
                                                    plan.name === "Enterprise"
                                                        ? "/contact"
                                                        : "/signup?plan=" + plan.name.toLowerCase()
                                                }
                                            >
                                                {plan.cta}
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Enterprise CTA */}
            <section className="py-16 bg-white">
                <div className="container mx-auto max-w-7xl px-4">
                    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                        <CardContent className="p-8 md:p-12">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="max-w-xl">
                                    <Badge variant="secondary" className="mb-4">
                                        Enterprise
                                    </Badge>
                                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                                        Need a Custom Solution?
                                    </h2>
                                    <p className="text-muted-foreground mb-6">
                                        For large brokerages and developers with specific requirements, we
                                        offer custom enterprise solutions with dedicated support, custom
                                        integrations, and white-label options.
                                    </p>
                                    <ul className="grid grid-cols-2 gap-3 mb-6">
                                        <li className="flex items-center gap-2 text-sm">
                                            <Check className="h-4 w-4 text-green-500" />
                                            Custom integrations
                                        </li>
                                        <li className="flex items-center gap-2 text-sm">
                                            <Check className="h-4 w-4 text-green-500" />
                                            Dedicated support
                                        </li>
                                        <li className="flex items-center gap-2 text-sm">
                                            <Check className="h-4 w-4 text-green-500" />
                                            White-label options
                                        </li>
                                        <li className="flex items-center gap-2 text-sm">
                                            <Check className="h-4 w-4 text-green-500" />
                                            SLA guarantee
                                        </li>
                                    </ul>
                                </div>
                                <div className="shrink-0">
                                    <Button size="lg" asChild>
                                        <Link href="/contact">
                                            Contact Sales
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Trust Section */}
            <section className="py-16 bg-gray-50/50">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Shield className="h-7 w-7 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-foreground mb-2">Secure Payments</h3>
                            <p className="text-sm text-muted-foreground">
                                256-bit SSL encryption and PCI-compliant payment processing
                            </p>
                        </div>
                        <div>
                            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Headphones className="h-7 w-7 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-foreground mb-2">24/7 Support</h3>
                            <p className="text-sm text-muted-foreground">
                                Our team is here to help you succeed around the clock
                            </p>
                        </div>
                        <div>
                            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Star className="h-7 w-7 text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-foreground mb-2">Money-Back Guarantee</h3>
                            <p className="text-sm text-muted-foreground">
                                30-day money-back guarantee, no questions asked
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="text-center mb-12">
                        <Badge variant="secondary" className="mb-4">
                            <HelpCircle className="h-4 w-4 mr-2" />
                            FAQ
                        </Badge>
                        <h2 className="text-3xl font-bold text-foreground mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Have questions? We&apos;ve got answers.
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <div className="grid gap-4">
                            {faqs.map((faq, index) => (
                                <Card key={index} className="border">
                                    <CardContent className="p-6">
                                        <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                                        <p className="text-sm text-muted-foreground">{faq.answer}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="text-center mt-8">
                            <p className="text-muted-foreground mb-4">
                                Still have questions?
                            </p>
                            <Button variant="outline" asChild>
                                <Link href="/faq">View All FAQs</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
