import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    HandshakeIcon,
    BuildingIcon,
    TrendingUpIcon,
    UsersIcon,
    StarIcon,
    ArrowRightIcon,
    CheckCircleIcon,
    GlobeIcon,
    TargetIcon,
    SparklesIcon,
    ShieldCheckIcon,
    HeartIcon,
} from "lucide-react";

export const metadata = {
    title: "Our Partners | Real Landing",
    description: "Discover the trusted partners powering Real Landing's real estate platform.",
};

const partnerCategories = [
    {
        category: "Technology Partners",
        count: "15+",
        description: "Leading tech companies enhancing our platform",
        icon: SparklesIcon,
        color: "bg-blue-100",
    },
    {
        category: "Financial Partners",
        count: "8+",
        description: "Trusted lending and financing institutions",
        icon: TrendingUpIcon,
        color: "bg-green-100",
    },
    {
        category: "Service Providers",
        count: "20+",
        description: "Professional services supporting our ecosystem",
        icon: BuildingIcon,
        color: "bg-purple-100",
    },
    {
        category: "Strategic Alliances",
        count: "12+",
        description: "Industry leaders collaborating with us",
        icon: HandshakeIcon,
        color: "bg-orange-100",
    },
];

const partners = [
    {
        name: "TechFlow Solutions",
        category: "Technology Partners",
        description: "Cloud infrastructure and AI-powered analytics for property insights.",
        logo: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=150&fit=crop",
        partnership: "2022",
    },
    {
        name: "Zenith Financial",
        category: "Financial Partners",
        description: "Flexible mortgage solutions and financing options for buyers.",
        logo: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&h=150&fit=crop",
        partnership: "2021",
    },
    {
        name: "BuildGuard Insurance",
        category: "Service Providers",
        description: "Comprehensive property insurance and protection plans.",
        logo: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=150&fit=crop",
        partnership: "2023",
    },
    {
        name: "Urban Logistics Pro",
        category: "Service Providers",
        description: "Moving and relocation services for seamless transitions.",
        logo: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=150&fit=crop",
        partnership: "2022",
    },
    {
        name: "DataVault Analytics",
        category: "Technology Partners",
        description: "Advanced market analytics and data visualization tools.",
        logo: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&h=150&fit=crop",
        partnership: "2023",
    },
    {
        name: "Crown Capital Partners",
        category: "Financial Partners",
        description: "Investment opportunities and portfolio management services.",
        logo: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=150&fit=crop",
        partnership: "2021",
    },
    {
        name: "PropertyGuard Solutions",
        category: "Service Providers",
        description: "Home inspection and property valuation services.",
        logo: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&h=150&fit=crop",
        partnership: "2022",
    },
    {
        name: "GlobalReach Network",
        category: "Strategic Alliances",
        description: "International expansion and market access partnerships.",
        logo: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=150&fit=crop",
        partnership: "2023",
    },
    {
        name: "InnovateTech Labs",
        category: "Technology Partners",
        description: "Virtual tour technology and AR property visualization.",
        logo: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&h=150&fit=crop",
        partnership: "2023",
    },
];

const partnerBenefits = [
    {
        icon: StarIcon,
        title: "Increased Visibility",
        description: "Access to millions of users on the Real Landing platform",
    },
    {
        icon: UsersIcon,
        title: "Expanded Network",
        description: "Connect with thousands of real estate professionals and clients",
    },
    {
        icon: TrendingUpIcon,
        title: "Growth Opportunities",
        description: "Scale your business with our integrated platform ecosystem",
    },
    {
        icon: ShieldCheckIcon,
        title: "Trust & Credibility",
        description: "Build brand authority through association with Real Landing",
    },
];

export default function PartnersPage() {
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

                <div className="container mx-auto max-w-7xl px-4 py-20 md:py-28 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <Badge
                            variant="secondary"
                            className="mb-6 bg-white/20 text-primary-foreground border-white/30 hover:bg-white/30"
                        >
                            <HandshakeIcon className="h-4 w-4 mr-2" />
                            Our Partners
                        </Badge>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            Trusted Partners <br />
                            <span className="text-secondary">Powering Real Estate</span>
                        </h1>
                        <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                            We collaborate with industry-leading companies to deliver the best
                            real estate experience. Together, we&apos;re building the future of
                            property transactions.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button size="lg" variant="secondary" className="rounded-full px-8">
                                Become a Partner
                                <ArrowRightIcon className="ml-2 h-5 w-5" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="rounded-full px-8 border-white/30 text-primary-foreground hover:bg-white/10"
                            >
                                Contact Sales
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Partner Categories Stats */}
            <section className="py-16 bg-white">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 -mt-24 relative z-20">
                        {partnerCategories.map((category) => (
                            <Card
                                key={category.category}
                                className="p-6 text-center bg-white border border-border shadow-none hover:shadow-md transition-all duration-300"
                            >
                                <div className={`w-14 h-14 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                                    <category.icon className="h-7 w-7 text-primary" />
                                </div>
                                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                                    {category.count}
                                </div>
                                <div className="text-muted-foreground text-sm font-medium mb-2">
                                    {category.category}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {category.description}
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partnership Benefits Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="text-center mb-16">
                        <Badge variant="secondary" className="mb-4">
                            Why Partner With Us
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Partnership Benefits
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Unlock new opportunities and drive growth together
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {partnerBenefits.map((benefit) => (
                            <Card
                                key={benefit.title}
                                className="p-6 text-center border border-border shadow-none hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <benefit.icon className="h-7 w-7 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">
                                    {benefit.title}
                                </h3>
                                <p className="text-muted-foreground text-sm">{benefit.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Partners Showcase */}
            <section className="py-20 bg-white">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="text-center mb-16">
                        <Badge variant="secondary" className="mb-4">
                            Our Partners
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Meet Our Partners
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Exceptional companies collaborating to transform real estate
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {partners.map((partner) => (
                            <Card
                                key={partner.name}
                                className="overflow-hidden border border-border shadow-none hover:shadow-md transition-all duration-300 group"
                            >
                                <div className="relative h-40 overflow-hidden bg-muted">
                                    <Image
                                        src={partner.logo}
                                        alt={partner.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <Badge variant="outline" className="text-xs mb-2">
                                                {partner.category}
                                            </Badge>
                                            <h3 className="font-semibold text-lg text-foreground">
                                                {partner.name}
                                            </h3>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground text-sm mb-4">
                                        {partner.description}
                                    </p>
                                    <div className="flex items-center justify-between pt-4 border-t border-border">
                                        <span className="text-xs text-muted-foreground">
                                            Partner since {partner.partnership}
                                        </span>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <ArrowRightIcon className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Button size="lg" variant="outline" className="rounded-full px-8">
                            View All Partners
                            <ArrowRightIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Become a Partner CTA Section */}
            <section className="py-20 bg-gradient-to-r from-primary/5 to-secondary/5">
                <div className="container mx-auto max-w-4xl px-4">
                    <Card className="p-8 md:p-12 border border-primary/20 shadow-lg bg-white">
                        <div className="text-center">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Ready to Partner With Us?
                            </h2>
                            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                                Join our growing network of partners and unlock new opportunities
                                for growth. Let&apos;s build the future of real estate together.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-3">
                                        <CheckCircleIcon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-foreground mb-1">Easy Integration</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Seamlessly integrate with our platform
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-3">
                                        <CheckCircleIcon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-foreground mb-1">Dedicated Support</h3>
                                    <p className="text-sm text-muted-foreground">
                                        24/7 support from our partnership team
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-3">
                                        <CheckCircleIcon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-foreground mb-1">Growth Potential</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Scale together with our platform
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button size="lg" className="rounded-full px-8">
                                    Start Partnership Inquiry
                                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                                </Button>
                                <Button size="lg" variant="outline" className="rounded-full px-8">
                                    View Partner Program
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            {/* Partnership Process Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="text-center mb-16">
                        <Badge variant="secondary" className="mb-4">
                            Our Process
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            How to Partner With Us
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            A simple, transparent process to get started
                        </p>
                    </div>

                    <div className="relative">
                        {/* Desktop Timeline Line */}
                        <div className="hidden md:block absolute top-1/4 left-0 right-0 h-0.5 bg-border" />

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {[
                                {
                                    step: "1",
                                    title: "Get in Touch",
                                    description: "Contact our partnerships team to discuss opportunities",
                                },
                                {
                                    step: "2",
                                    title: "Evaluate Fit",
                                    description: "We assess mutual benefits and alignment",
                                },
                                {
                                    step: "3",
                                    title: "Negotiate Terms",
                                    description: "Work out partnership details and terms",
                                },
                                {
                                    step: "4",
                                    title: "Launch Partnership",
                                    description: "Go live and start growing together",
                                },
                            ].map((item, index) => (
                                <div key={index} className="relative">
                                    <Card className="p-6 text-center border border-border shadow-none bg-white relative z-10">
                                        <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                                            {item.step}
                                        </div>
                                        <h3 className="font-semibold text-lg text-foreground mb-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm">{item.description}</p>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto max-w-4xl px-4">
                    <div className="text-center mb-16">
                        <Badge variant="secondary" className="mb-4">
                            FAQ
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Common Questions
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Find answers to frequently asked questions about partnerships
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                question: "What types of partnerships do you offer?",
                                answer:
                                    "We offer technology integrations, financial partnerships, service provider collaborations, and strategic alliances. Each partnership is tailored to mutual business objectives.",
                            },
                            {
                                question: "How long does the partnership onboarding process take?",
                                answer:
                                    "The typical partnership process takes 2-4 weeks from initial contact to launch, depending on complexity and integration requirements.",
                            },
                            {
                                question: "What support do partners receive?",
                                answer:
                                    "All partners receive dedicated account management, technical support, marketing collaboration, and access to partnership resources and training.",
                            },
                            {
                                question: "Are there costs associated with partnerships?",
                                answer:
                                    "Partnership costs vary based on the type and scope. We discuss pricing during the evaluation phase to ensure mutual value.",
                            },
                        ].map((faq, index) => (
                            <Card
                                key={index}
                                className="p-6 border border-border shadow-none hover:border-primary/30 transition-all duration-300"
                            >
                                <h3 className="font-semibold text-lg text-foreground mb-2">
                                    {faq.question}
                                </h3>
                                <p className="text-muted-foreground">{faq.answer}</p>
                            </Card>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <p className="text-muted-foreground mb-4">
                            Have more questions? Get in touch with our partnerships team.
                        </p>
                        <Button variant="outline" className="rounded-full" asChild>
                            <Link href="/contact">
                                Contact Us
                                <ArrowRightIcon className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
