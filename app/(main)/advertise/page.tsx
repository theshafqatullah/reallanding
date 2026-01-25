'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import {
    Check,
    ArrowRight,
    Building2,
    User,
    Users,
    Megaphone,
    Target,
    TrendingUp,
    Eye,
    Star,
    Zap,
    Crown,
    Sparkles,
    BarChart3,
    Mail,
    Phone,
    RefreshCw,
    Flame,
    Rocket,
    Clock,
    Shield,
    Headphones,
    ChevronRight,
    Quote,
    CheckCircle2,
    ListChecks,
    Trophy,
    Layers,
    ImageIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Individual Products
const individualProducts = [
    {
        id: 'listing-slot',
        name: 'Listing Slot',
        description: 'Get an ad slot for 30 days to publish your properties on Reallanding',
        price: 29,
        period: 'month',
        icon: ListChecks,
    },
    {
        id: 'hot-listing',
        name: 'Hot Listing',
        description: 'Property ranks above basic listings with 15x exposure',
        price: 79,
        period: 'month',
        icon: Flame,
    },
    {
        id: 'super-hot',
        name: 'Super Hot Listing',
        description: 'Property ranks at the top with 25x exposure',
        price: 199,
        period: 'month',
        icon: Rocket,
    },
    {
        id: 'refresh',
        name: 'Refresh Credits',
        description: 'Refresh the time of your posted listings and bring them to the top again',
        price: 5,
        period: 'credit',
        icon: RefreshCw,
    },
    {
        id: 'story-ads',
        name: 'Story Ads Credits',
        description: 'Boost property with a story for 24 hrs on Reallanding web & app',
        price: 10,
        period: 'credit',
        icon: Sparkles,
    },
];

// Agency Packages
const agencyPackages = [
    {
        id: 'starter',
        name: 'Starter Package',
        price: 149,
        period: 'month',
        billedAnnually: true,
        popular: false,
        features: [
            { label: 'Listings', value: '50', icon: ListChecks },
            { label: 'Super Hot Credits', value: '12', icon: Rocket },
            { label: 'Hot Credits', value: '80', icon: Flame },
            { label: 'Refresh Credits', value: '2000', icon: RefreshCw },
            { label: '24/7 Normal Support', value: '', icon: Headphones },
        ],
    },
    {
        id: 'business',
        name: 'Business Package',
        price: 499,
        period: 'month',
        billedAnnually: true,
        popular: false,
        features: [
            { label: 'Listings', value: '150', icon: ListChecks },
            { label: 'Super Hot Credits', value: '60', icon: Rocket },
            { label: 'Hot Credits', value: '360', icon: Flame },
            { label: 'Refresh Credits', value: '6000', icon: RefreshCw },
            { label: 'Agency Banner', value: '1 Type', icon: ImageIcon },
            { label: '24/7 Normal Support', value: '', icon: Headphones },
        ],
    },
    {
        id: 'titanium',
        name: 'Titanium',
        price: 999,
        period: 'month',
        billedAnnually: true,
        popular: true,
        features: [
            { label: 'Listings', value: '200', icon: ListChecks },
            { label: 'Super Hot Credits', value: '60', icon: Rocket },
            { label: 'Hot Credits', value: '360', icon: Flame },
            { label: 'Refresh Credits', value: '7200', icon: RefreshCw },
            { label: 'Titanium Badge', value: '', icon: Trophy },
            { label: 'Priority Listing Approval', value: '', icon: Zap },
            { label: 'Agency Banners', value: '3 Types', icon: ImageIcon },
            { label: '24/7 Normal Support', value: '', icon: Headphones },
        ],
    },
    {
        id: 'titanium-plus',
        name: 'Titanium Plus',
        price: 1999,
        period: 'month',
        billedAnnually: true,
        popular: false,
        features: [
            { label: 'Listings', value: '300', icon: ListChecks },
            { label: 'Super Hot Credits', value: '84', icon: Rocket },
            { label: 'Hot Credits', value: '600', icon: Flame },
            { label: 'Refresh Credits', value: '10800', icon: RefreshCw },
            { label: 'Titanium Plus Badge', value: '', icon: Crown },
            { label: 'Priority Listing Approval', value: '', icon: Zap },
            { label: 'Agency Banners', value: '5 Types', icon: ImageIcon },
            { label: 'Exclusive Agency Profile', value: '', icon: Star },
            { label: 'Video Interview', value: '', icon: Eye },
            { label: '24/7 Priority Support', value: '', icon: Shield },
            { label: 'Featured Agency', value: '', icon: Trophy },
        ],
    },
];

// Developer Packages
const developerPackages = [
    {
        id: 'starter-pack',
        name: 'Starter Pack',
        price: 799,
        period: 'month',
        billedAnnually: true,
        popular: false,
        features: [
            { label: 'Developer Pages and listing', value: '', icon: Building2 },
            { label: 'Featured Developers', value: '', icon: Star },
            { label: 'Project Pusher', value: '1', icon: Megaphone },
            { label: 'Super Hot Listings', value: '2', icon: Rocket },
            { label: 'Refresh Credits', value: '200', icon: RefreshCw },
        ],
    },
    {
        id: 'value-booster',
        name: 'Value Booster',
        price: 1499,
        period: 'month',
        billedAnnually: true,
        popular: false,
        features: [
            { label: 'Developer Pages and listing', value: '', icon: Building2 },
            { label: 'Featured Developers', value: '', icon: Star },
            { label: 'Project Pusher', value: '2', icon: Megaphone },
            { label: 'Super Hot Listings', value: '3', icon: Rocket },
            { label: 'Refresh Credits', value: '350', icon: RefreshCw },
            { label: 'Premium Listings', value: '4', icon: Crown },
            { label: 'Leaderboard Impressions', value: '10,000', icon: BarChart3 },
        ],
    },
    {
        id: 'brand-maximizer',
        name: 'Brand Maximizer',
        price: 2499,
        period: 'month',
        billedAnnually: true,
        popular: false,
        features: [
            { label: 'Developer Pages and listing', value: '', icon: Building2 },
            { label: 'Featured Developers', value: '', icon: Star },
            { label: 'Project Pusher', value: '2', icon: Megaphone },
            { label: 'Super Hot Listings', value: '3', icon: Rocket },
            { label: 'Refresh Credits', value: '350', icon: RefreshCw },
            { label: 'Premium Listings', value: '4', icon: Crown },
            { label: 'Leaderboard Impressions', value: '15,000', icon: BarChart3 },
            { label: 'Splash Ads', value: '10,000', icon: Layers },
        ],
    },
    {
        id: 'premium-developer',
        name: 'Premium Developer',
        price: 3999,
        period: 'month',
        billedAnnually: true,
        popular: true,
        features: [
            { label: 'Developer Pages and listing', value: '', icon: Building2 },
            { label: 'Featured Developers', value: '', icon: Star },
            { label: 'Project Pusher', value: '3', icon: Megaphone },
            { label: 'Super Hot Listings', value: '5', icon: Rocket },
            { label: 'Refresh Credits', value: '1000', icon: RefreshCw },
            { label: 'Premium Listings', value: '10', icon: Crown },
            { label: 'Leaderboard Impressions', value: '30,000', icon: BarChart3 },
            { label: 'Splash Ads', value: '30,000', icon: Layers },
        ],
    },
];

// Why Advertise
const whyAdvertise = [
    {
        icon: CheckCircle2,
        title: 'Satisfied Clients',
        description: '95% of our customers are happy with us and over 80% recommend us',
    },
    {
        icon: Layers,
        title: 'Several Products & Packages',
        description: 'Access unlimited data insights through our Property Reports and Data Analysis Tools',
    },
    {
        icon: BarChart3,
        title: 'Leverage Data',
        description: 'Variety of Products and Packages to choose from depending upon your needs',
    },
];

// Testimonials
const testimonials = [
    {
        name: 'Michael Chen',
        email: 'michael.chen@email.com',
        content: 'I had been struggling to sell my property for a long time until I came across Reallanding. The platform\'s user-friendly interface and targeted advertising options helped me find the right buyer quickly.',
        initial: 'M',
    },
    {
        name: 'Sarah Johnson',
        email: 'sarah@premierealty.com',
        content: 'Reallanding has been a valuable partner in helping our agency reach more potential clients. Their platform offers a range of advertising packages that have helped us generate leads and increase sales.',
        initial: 'S',
    },
    {
        name: 'David Williams',
        email: 'david@williamsdev.com',
        content: 'Reallanding has been a valuable partner in helping us launch and promote our latest real estate project. Their platform offers targeted advertising options that have helped us reach a wider audience.',
        initial: 'D',
    },
];

// FAQs
const faqs = [
    {
        question: 'How can I advertise my property on Reallanding?',
        answer: 'You can advertise your property by creating an account, selecting a suitable package, and publishing your listing. Our team will guide you through the process.',
    },
    {
        question: 'What types of properties can I advertise on Reallanding?',
        answer: 'You can advertise residential properties (houses, apartments, condos), commercial properties (offices, shops, warehouses), plots, and new development projects.',
    },
    {
        question: 'What are the benefits of advertising on Reallanding?',
        answer: 'Benefits include access to millions of property seekers, advanced analytics, featured listing options, priority support, and various marketing tools to boost your visibility.',
    },
    {
        question: 'How much does it cost to advertise on Reallanding?',
        answer: 'We offer flexible pricing starting from $29/month for individuals to comprehensive packages for agencies and developers. Check our pricing section for detailed information.',
    },
    {
        question: 'What is the benefit of Banner Advertisement on Reallanding?',
        answer: 'Banner ads provide excellent brand awareness and recall. Your ad appears on high-traffic pages including the homepage, search results, and individual property pages.',
    },
];

export default function AdvertisePage() {
    const [selectedTab, setSelectedTab] = useState<'individual' | 'agency' | 'developer'>('individual');

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/20">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="text-center space-y-6">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                            Let <span className="text-primary">Reallanding</span><br />
                            Build Your Business
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                            Excel in the challenging real estate market with our dependable platform,
                            expert services, and access to a broad audience of prospective property seekers.
                        </p>

                        {/* Tab Buttons */}
                        <div className="flex flex-wrap justify-center gap-3 pt-6">
                            <Button
                                size="lg"
                                variant={selectedTab === 'individual' ? 'default' : 'outline'}
                                onClick={() => setSelectedTab('individual')}
                                className={cn(
                                    'min-w-[140px]',
                                    selectedTab === 'individual' && 'bg-primary text-primary-foreground'
                                )}
                            >
                                <User className="w-4 h-4 mr-2" />
                                For Individual
                            </Button>
                            <Button
                                size="lg"
                                variant={selectedTab === 'agency' ? 'default' : 'outline'}
                                onClick={() => setSelectedTab('agency')}
                                className={cn(
                                    'min-w-[140px]',
                                    selectedTab === 'agency' && 'bg-primary text-primary-foreground'
                                )}
                            >
                                <Users className="w-4 h-4 mr-2" />
                                For Agency
                            </Button>
                            <Button
                                size="lg"
                                variant={selectedTab === 'developer' ? 'default' : 'outline'}
                                onClick={() => setSelectedTab('developer')}
                                className={cn(
                                    'min-w-[140px]',
                                    selectedTab === 'developer' && 'bg-primary text-primary-foreground'
                                )}
                            >
                                <Building2 className="w-4 h-4 mr-2" />
                                For Developer
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Individual Products Section */}
            {selectedTab === 'individual' && (
                <section className="py-16 bg-background">
                    <div className="container max-w-7xl mx-auto px-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
                            For Individuals
                        </h2>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                            {individualProducts.map((product) => (
                                <Card key={product.id} className="hover:shadow-lg transition-shadow border-border bg-card">
                                    <CardContent className="pt-6">
                                        <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                                            <product.icon className="w-7 h-7 text-primary" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2">
                                            {product.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-4 min-h-[60px]">
                                            {product.description}
                                        </p>
                                        <div className="mb-4">
                                            <span className="text-2xl font-bold text-primary">${product.price}</span>
                                            <span className="text-muted-foreground">/{product.period}</span>
                                        </div>
                                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                                            Buy Now
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Agency Packages Section */}
            {selectedTab === 'agency' && (
                <section className="py-16 bg-background">
                    <div className="container max-w-7xl mx-auto px-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
                            Advertise for Agencies
                        </h2>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {agencyPackages.map((pkg) => (
                                <Card
                                    key={pkg.id}
                                    className={cn(
                                        'relative hover:shadow-xl transition-all border-border bg-card',
                                        pkg.popular && 'border-2 border-primary shadow-lg'
                                    )}
                                >
                                    {pkg.popular && (
                                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4">
                                            Most Popular
                                        </Badge>
                                    )}
                                    <CardHeader className="text-center pb-2">
                                        <CardTitle className="text-xl">{pkg.name}</CardTitle>
                                        <div className="pt-2">
                                            <span className="text-sm text-muted-foreground">Starting From</span>
                                            <div>
                                                <span className="text-3xl font-bold text-primary">${pkg.price}</span>
                                            </div>
                                            <span className="text-sm text-muted-foreground">
                                                Per Month (Billed Annually)
                                            </span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="text-sm font-medium text-foreground">What's included</p>
                                        <div className="space-y-3">
                                            {pkg.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <feature.icon className="w-4 h-4 text-primary" />
                                                    </div>
                                                    <span className="text-sm text-foreground">
                                                        {feature.value && <span className="font-semibold">{feature.value} </span>}
                                                        {feature.label}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="pt-4 space-y-2">
                                            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                                                Inquire Now
                                            </Button>
                                            <Button variant="ghost" className="w-full text-primary">
                                                View More Details
                                                <ChevronRight className="w-4 h-4 ml-1" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Developer Packages Section */}
            {selectedTab === 'developer' && (
                <section className="py-16 bg-background">
                    <div className="container max-w-7xl mx-auto px-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
                            Advertise for Developers
                        </h2>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {developerPackages.map((pkg) => (
                                <Card
                                    key={pkg.id}
                                    className={cn(
                                        'relative hover:shadow-xl transition-all border-border bg-card',
                                        pkg.popular && 'border-2 border-primary shadow-lg'
                                    )}
                                >
                                    {pkg.popular && (
                                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4">
                                            Most Popular
                                        </Badge>
                                    )}
                                    <CardHeader className="text-center pb-2">
                                        <CardTitle className="text-xl">{pkg.name}</CardTitle>
                                        <div className="pt-2">
                                            <span className="text-sm text-muted-foreground">Starting From</span>
                                            <div>
                                                <span className="text-3xl font-bold text-primary">${pkg.price}</span>
                                            </div>
                                            <span className="text-sm text-muted-foreground">
                                                Per Month (Billed Annually)
                                            </span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="text-sm font-medium text-foreground">What's included</p>
                                        <div className="space-y-3">
                                            {pkg.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <feature.icon className="w-4 h-4 text-primary" />
                                                    </div>
                                                    <span className="text-sm text-foreground">
                                                        {feature.value && <span className="font-semibold">{feature.value} </span>}
                                                        {feature.label}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="pt-4 space-y-2">
                                            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                                                Inquire Now
                                            </Button>
                                            <Button variant="ghost" className="w-full text-primary">
                                                View More Details
                                                <ChevronRight className="w-4 h-4 ml-1" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Why Advertise Section */}
            <section className="py-16 bg-secondary/30">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                                Why Advertise With Reallanding?
                            </h2>
                            <p className="text-muted-foreground mb-6">
                                Reallanding is the premier online real estate portal connecting buyers with sellers
                                and owners with renters. We provide real estate professionals with the best,
                                most comprehensive advertising and marketing solutions, offering unparalleled
                                exposure on multiple platforms.
                            </p>
                            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                Get In Touch
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>

                        <div className="grid gap-6">
                            {whyAdvertise.map((item, index) => (
                                <div key={index} className="flex gap-4 p-4 bg-card rounded-xl border border-border">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <item.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16 bg-background">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                            What our clients have to say about <span className="text-primary">Reallanding</span>
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Reallanding is the premier online real estate portal connecting buyers with sellers and owners with renters.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <Card key={index} className="border-border bg-card">
                                <CardContent className="pt-6">
                                    <Quote className="w-8 h-8 text-primary/30 mb-4" />
                                    <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                                        {testimonial.content}
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                                            {testimonial.initial}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                                            <p className="text-xs text-muted-foreground">{testimonial.email}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQs Section */}
            <section className="py-16 bg-secondary/30">
                <div className="container max-w-7xl mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
                        Frequently Asked Questions (FAQs)
                    </h2>

                    <Accordion type="single" collapsible className="space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="bg-card border border-border rounded-lg px-6"
                            >
                                <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>

            {/* Become a Member Section */}
            <section className="py-16 bg-background">
                <div className="container max-w-7xl mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
                        Become a member of Reallanding today
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                            <CardContent className="p-8 text-center">
                                <Building2 className="w-12 h-12 text-primary mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-foreground mb-2">Are you a Developer?</h3>
                                <p className="text-muted-foreground mb-6">
                                    If you're a developer, Reallanding offers you the best packages to get started on your journey.
                                </p>
                                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                    Inquire Now
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-secondary/50 to-accent/30 border-secondary">
                            <CardContent className="p-8 text-center">
                                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-foreground mb-2">Are you an Agent?</h3>
                                <p className="text-muted-foreground mb-6">
                                    If you're an agent, Reallanding offers you the best packages to get started on your journey.
                                </p>
                                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                    Inquire Now
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="py-16 bg-primary text-primary-foreground">
                <div className="container max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Need Help Choosing a Package?</h2>
                    <p className="text-primary-foreground/80 mb-8">
                        Our team is here to help you find the perfect advertising solution for your needs.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-background text-foreground hover:bg-background/90">
                            <Phone className="w-5 h-5 mr-2" />
                            Call Us Now
                        </Button>
                        <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                            <Mail className="w-5 h-5 mr-2" />
                            Email Us
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
