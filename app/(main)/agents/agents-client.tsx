"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    StarIcon,
    PhoneIcon,
    MailIcon,
    MapPinIcon,
    AwardIcon,
    TrendingUpIcon,
    SearchIcon,
    UsersIcon,
    ArrowRightIcon,
    CheckCircleIcon,
    HomeIcon,
    BuildingIcon,
    SparklesIcon,
    BriefcaseIcon,
    HeartIcon,
    MessageSquareIcon,
    CalendarIcon,
    ClockIcon,
    LinkedinIcon,
    TwitterIcon,
    FacebookIcon,
    FilterIcon,
    ChevronDownIcon,
} from "lucide-react";

const agents = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "Senior Real Estate Agent",
        specialties: ["Luxury Homes", "Investment"],
        rating: 4.9,
        reviews: 127,
        sales: 89,
        volume: "$45M+",
        experience: "8+ years",
        phone: "+1 (555) 123-4567",
        email: "sarah.johnson@reallanding.com",
        location: "Manhattan, NY",
        languages: ["English", "Spanish"],
        bio: "Specializes in luxury residential properties and investment opportunities. Known for exceptional client service and market expertise.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
        featured: true,
        availability: "Available",
    },
    {
        id: 2,
        name: "Michael Chen",
        role: "Commercial Specialist",
        specialties: ["Commercial", "Industrial"],
        rating: 4.8,
        reviews: 94,
        sales: 156,
        volume: "$120M+",
        experience: "12+ years",
        phone: "+1 (555) 123-4568",
        email: "michael.chen@reallanding.com",
        location: "San Francisco, CA",
        languages: ["English", "Mandarin"],
        bio: "Expert in commercial real estate transactions with a focus on office buildings, retail spaces, and industrial properties.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
        featured: true,
        availability: "Available",
    },
    {
        id: 3,
        name: "Emily Rodriguez",
        role: "Residential Expert",
        specialties: ["First-time Buyers", "Family Homes"],
        rating: 5.0,
        reviews: 203,
        sales: 134,
        volume: "$62M+",
        experience: "6+ years",
        phone: "+1 (555) 123-4569",
        email: "emily.rodriguez@reallanding.com",
        location: "Miami, FL",
        languages: ["English", "Spanish", "Portuguese"],
        bio: "Dedicated to helping first-time buyers and families find their perfect homes. Patient, knowledgeable, and supportive.",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
        featured: true,
        availability: "Available",
    },
    {
        id: 4,
        name: "David Thompson",
        role: "Investment Advisor",
        specialties: ["Investment", "Rentals"],
        rating: 4.7,
        reviews: 78,
        sales: 67,
        volume: "$38M+",
        experience: "10+ years",
        phone: "+1 (555) 123-4570",
        email: "david.thompson@reallanding.com",
        location: "Chicago, IL",
        languages: ["English"],
        bio: "Investment-focused agent helping clients build profitable real estate portfolios with strategic property acquisitions.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        featured: false,
        availability: "Busy",
    },
    {
        id: 5,
        name: "Lisa Park",
        role: "Luxury Specialist",
        specialties: ["Luxury", "Waterfront"],
        rating: 4.9,
        reviews: 156,
        sales: 78,
        volume: "$95M+",
        experience: "15+ years",
        phone: "+1 (555) 123-4571",
        email: "lisa.park@reallanding.com",
        location: "Los Angeles, CA",
        languages: ["English", "Korean"],
        bio: "Luxury and waterfront property expert with an extensive network and deep understanding of high-end real estate markets.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
        featured: true,
        availability: "Available",
    },
    {
        id: 6,
        name: "James Wilson",
        role: "New Construction Specialist",
        specialties: ["New Builds", "Condos"],
        rating: 4.8,
        reviews: 89,
        sales: 92,
        volume: "$55M+",
        experience: "7+ years",
        phone: "+1 (555) 123-4572",
        email: "james.wilson@reallanding.com",
        location: "Austin, TX",
        languages: ["English"],
        bio: "Specialist in new construction properties and condominium developments. Expert in pre-construction sales.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
        featured: false,
        availability: "Available",
    },
    {
        id: 7,
        name: "Maria Santos",
        role: "Relocation Specialist",
        specialties: ["Relocation", "Residential"],
        rating: 4.9,
        reviews: 112,
        sales: 98,
        volume: "$42M+",
        experience: "9+ years",
        phone: "+1 (555) 123-4573",
        email: "maria.santos@reallanding.com",
        location: "Boston, MA",
        languages: ["English", "Spanish", "Italian"],
        bio: "Helping families and professionals relocate seamlessly with comprehensive moving support and local expertise.",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
        featured: false,
        availability: "Available",
    },
    {
        id: 8,
        name: "Alex Turner",
        role: "Property Manager",
        specialties: ["Property Management", "Rentals"],
        rating: 4.6,
        reviews: 67,
        sales: 45,
        volume: "$28M+",
        experience: "5+ years",
        phone: "+1 (555) 123-4574",
        email: "alex.turner@reallanding.com",
        location: "Seattle, WA",
        languages: ["English"],
        bio: "Expert property manager helping landlords maximize returns while providing excellent tenant experiences.",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
        featured: false,
        availability: "Busy",
    },
];

const teamStats = [
    { label: "Expert Agents", value: "200+", icon: UsersIcon },
    { label: "Properties Sold", value: "50K+", icon: HomeIcon },
    { label: "Client Satisfaction", value: "98%", icon: HeartIcon },
    { label: "Years Combined Experience", value: "500+", icon: AwardIcon },
];

const specialties = [
    { name: "All Agents", count: 200 },
    { name: "Luxury", count: 35 },
    { name: "Commercial", count: 28 },
    { name: "Residential", count: 85 },
    { name: "Investment", count: 32 },
    { name: "New Construction", count: 20 },
];

const whyChooseUs = [
    {
        icon: AwardIcon,
        title: "Top-Rated Professionals",
        description: "Our agents average 4.8+ stars from thousands of verified client reviews.",
    },
    {
        icon: TrendingUpIcon,
        title: "Proven Track Record",
        description: "Over $5 billion in successful transactions and 50,000+ properties sold.",
    },
    {
        icon: ClockIcon,
        title: "24/7 Availability",
        description: "Our team is available around the clock to assist with your real estate needs.",
    },
    {
        icon: CheckCircleIcon,
        title: "Local Market Experts",
        description: "Deep knowledge of local markets, neighborhoods, and property values.",
    },
];

const testimonials = [
    {
        quote: "Sarah helped us find our dream home in just 3 weeks. Her knowledge of the Manhattan market is unmatched!",
        author: "Jennifer & Mark Thompson",
        agent: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    },
    {
        quote: "Michael's expertise in commercial real estate saved us thousands. Highly recommend for any business property needs.",
        author: "Robert Chen",
        agent: "Michael Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
    {
        quote: "As first-time buyers, Emily made the process stress-free. She was patient and answered all our questions.",
        author: "The Garcia Family",
        agent: "Emily Rodriguez",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    },
];

export default function AgentsPageClient() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSpecialty, setSelectedSpecialty] = useState("All Agents");

    const featuredAgents = agents.filter((agent) => agent.featured);

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
                            <UsersIcon className="h-4 w-4 mr-2" />
                            200+ Expert Agents
                        </Badge>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            Meet Our <span className="text-secondary">Expert</span> Real Estate Agents
                        </h1>
                        <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                            Our team of experienced professionals is dedicated to helping you find
                            the perfect property. Connect with an agent who understands your needs.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Search agents by name or specialty..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-6 rounded-full bg-white text-foreground border-0 shadow-none"
                                    />
                                </div>
                                <Button size="lg" variant="secondary" className="rounded-full px-8">
                                    Find Agent
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 -mt-24 relative z-20">
                        {teamStats.map((stat) => (
                            <Card
                                key={stat.label}
                                className="p-6 text-center bg-white border border-border shadow-none"
                            >
                                <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <stat.icon className="h-7 w-7 text-primary" />
                                </div>
                                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-muted-foreground text-sm">{stat.label}</div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Agents */}
            <section className="py-20 bg-white">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="text-center mb-12">
                        <Badge variant="secondary" className="mb-4">
                            <SparklesIcon className="h-4 w-4 mr-2" />
                            Top Performers
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Featured Agents
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Our highest-rated agents with exceptional track records
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredAgents.map((agent) => (
                            <Card
                                key={agent.id}
                                className="overflow-hidden border border-border shadow-none group hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="relative">
                                    <div className="h-48 relative">
                                        <Image
                                            src={agent.image}
                                            alt={agent.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <Badge className="absolute top-3 right-3 bg-primary">
                                        <StarIcon className="h-3 w-3 mr-1 fill-white" />
                                        {agent.rating}
                                    </Badge>
                                    <Badge
                                        className={`absolute top-3 left-3 ${agent.availability === "Available" ? "bg-green-500" : "bg-orange-500"
                                            }`}
                                    >
                                        {agent.availability}
                                    </Badge>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                                        {agent.name}
                                    </h3>
                                    <p className="text-primary text-sm font-medium mb-3">{agent.role}</p>

                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {agent.specialties.map((specialty) => (
                                            <Badge key={specialty} variant="secondary" className="text-xs">
                                                {specialty}
                                            </Badge>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 text-center mb-4">
                                        <div className="bg-secondary rounded-lg p-2">
                                            <div className="font-semibold text-foreground">{agent.sales}</div>
                                            <div className="text-xs text-muted-foreground">Sales</div>
                                        </div>
                                        <div className="bg-secondary rounded-lg p-2">
                                            <div className="font-semibold text-foreground">{agent.volume}</div>
                                            <div className="text-xs text-muted-foreground">Volume</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                        <MapPinIcon className="h-4 w-4" />
                                        <span>{agent.location}</span>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button size="sm" className="flex-1 rounded-full">
                                            <PhoneIcon className="h-4 w-4 mr-1" />
                                            Call
                                        </Button>
                                        <Button size="sm" variant="outline" className="flex-1 rounded-full">
                                            <MailIcon className="h-4 w-4 mr-1" />
                                            Email
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Filter & All Agents */}
            <section className="py-20 bg-white">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="text-center mb-12">
                        <Badge variant="secondary" className="mb-4">
                            <UsersIcon className="h-4 w-4 mr-2" />
                            Our Team
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            All Agents
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Find the perfect agent for your specific needs
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap justify-center gap-3 mb-10">
                        <div className="flex items-center gap-2 bg-secondary rounded-full px-4 py-2">
                            <FilterIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">Filters:</span>
                        </div>
                        {specialties.map((specialty) => (
                            <Button
                                key={specialty.name}
                                variant={selectedSpecialty === specialty.name ? "default" : "outline"}
                                size="sm"
                                className="rounded-full"
                                onClick={() => setSelectedSpecialty(specialty.name)}
                            >
                                {specialty.name}
                                <Badge
                                    variant="secondary"
                                    className={`ml-2 ${selectedSpecialty === specialty.name ? "bg-white/20" : ""}`}
                                >
                                    {specialty.count}
                                </Badge>
                            </Button>
                        ))}
                    </div>

                    {/* Agents Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {agents.map((agent) => (
                            <Card
                                key={agent.id}
                                className="p-5 border border-border shadow-none hover:-translate-y-1 transition-all duration-300 group"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="relative">
                                        <Image
                                            src={agent.image}
                                            alt={agent.name}
                                            width={64}
                                            height={64}
                                            className="rounded-full object-cover"
                                        />
                                        <div
                                            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${agent.availability === "Available" ? "bg-green-500" : "bg-orange-500"
                                                }`}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                            {agent.name}
                                        </h3>
                                        <p className="text-sm text-primary truncate">{agent.role}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <StarIcon className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                            <span className="text-xs font-medium text-foreground">{agent.rating}</span>
                                            <span className="text-xs text-muted-foreground">({agent.reviews})</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{agent.bio}</p>

                                <div className="flex flex-wrap gap-1 mb-4">
                                    {agent.specialties.map((specialty) => (
                                        <Badge key={specialty} variant="secondary" className="text-xs">
                                            {specialty}
                                        </Badge>
                                    ))}
                                </div>

                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                                    <MapPinIcon className="h-3 w-3" />
                                    <span>{agent.location}</span>
                                    <span>•</span>
                                    <span>{agent.experience}</span>
                                </div>

                                <Button variant="outline" size="sm" className="w-full rounded-full">
                                    View Profile
                                    <ArrowRightIcon className="h-4 w-4 ml-1" />
                                </Button>
                            </Card>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <Button variant="outline" size="lg" className="rounded-full px-8">
                            Load More Agents
                            <ChevronDownIcon className="h-4 w-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Why Choose Our Agents */}
            <section className="py-20 bg-white">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="text-center mb-12">
                        <Badge variant="secondary" className="mb-4">
                            <CheckCircleIcon className="h-4 w-4 mr-2" />
                            Why Us
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Why Choose Our Agents
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            What sets our team apart from the rest
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {whyChooseUs.map((item) => (
                            <Card
                                key={item.title}
                                className="p-6 text-center border border-border shadow-none hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <item.icon className="h-7 w-7 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                                <p className="text-muted-foreground text-sm">{item.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Agent Testimonials */}
            <section className="py-20 bg-white">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="text-center mb-12">
                        <Badge variant="secondary" className="mb-4">
                            <StarIcon className="h-4 w-4 mr-2" />
                            Client Stories
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            What Clients Say About Our Agents
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Real experiences from satisfied clients
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial) => (
                            <Card
                                key={testimonial.author}
                                className="p-6 border border-border shadow-none"
                            >
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <StarIcon key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <blockquote className="text-foreground mb-6">
                                    &ldquo;{testimonial.quote}&rdquo;
                                </blockquote>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={testimonial.avatar}
                                            alt={testimonial.author}
                                            width={48}
                                            height={48}
                                            className="rounded-full"
                                        />
                                        <div>
                                            <div className="font-semibold text-foreground">{testimonial.author}</div>
                                            <div className="text-sm text-muted-foreground">
                                                Worked with {testimonial.agent}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-white">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="text-center mb-12">
                        <Badge variant="secondary" className="mb-4">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            Easy Process
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Connect With an Agent in 3 Steps
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Getting started is quick and easy
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: "01",
                                title: "Browse Agents",
                                description: "Search our directory to find agents that match your specific needs and location.",
                                icon: SearchIcon,
                            },
                            {
                                step: "02",
                                title: "Schedule a Call",
                                description: "Book a free consultation to discuss your real estate goals and requirements.",
                                icon: PhoneIcon,
                            },
                            {
                                step: "03",
                                title: "Start Your Journey",
                                description: "Work with your chosen agent to buy, sell, or invest in property.",
                                icon: HomeIcon,
                            },
                        ].map((item) => (
                            <div key={item.step} className="text-center">
                                <div className="w-20 h-20 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <item.icon className="h-10 w-10" />
                                </div>
                                <div className="text-sm font-bold text-primary mb-2">STEP {item.step}</div>
                                <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                                <p className="text-muted-foreground">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Join Our Team */}
            <section className="py-20 bg-white">
                <div className="container mx-auto max-w-7xl px-4">
                    <Card className="p-8 md:p-12 border border-border shadow-none bg-primary text-primary-foreground">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <div>
                                <Badge variant="secondary" className="mb-4">
                                    <BriefcaseIcon className="h-4 w-4 mr-2" />
                                    Careers
                                </Badge>
                                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                    Join Our Growing Team
                                </h2>
                                <p className="text-lg text-primary-foreground/80 mb-6">
                                    Are you a motivated real estate professional looking to take your career to
                                    the next level? We offer competitive commissions, comprehensive training,
                                    and a supportive team environment.
                                </p>
                                <ul className="space-y-3 mb-6">
                                    {[
                                        "Industry-leading commission structure",
                                        "Comprehensive training & mentorship",
                                        "Advanced marketing & technology tools",
                                        "Collaborative team culture",
                                    ].map((benefit) => (
                                        <li key={benefit} className="flex items-center gap-2">
                                            <CheckCircleIcon className="h-5 w-5 text-secondary" />
                                            <span>{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end">
                                <Button size="lg" variant="secondary" className="rounded-full px-8" asChild>
                                    <Link href="/contact">
                                        Apply Now
                                        <ArrowRightIcon className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="rounded-full px-8 border-white/30 text-primary-foreground hover:bg-white/10"
                                >
                                    Learn More
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 p-12 rounded-3xl bg-secondary">
                        <div className="text-center lg:text-left">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Ready to Find Your Perfect Agent?
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-xl">
                                Let us match you with an expert who understands your unique needs and goals.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button size="lg" className="rounded-full px-8" asChild>
                                <Link href="/contact">
                                    Get Matched Now
                                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
                                <Link href="/properties">Browse Properties</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
