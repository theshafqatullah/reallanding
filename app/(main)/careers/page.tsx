"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Briefcase,
    MapPin,
    Clock,
    DollarSign,
    Search,
    Users,
    Heart,
    Zap,
    Globe,
    Coffee,
    Laptop,
    GraduationCap,
    Shield,
    Sparkles,
    ArrowRight,
    Building2,
    Code,
    Megaphone,
    HeadphonesIcon,
    BarChart3,
    Palette,
    CheckCircle,
} from "lucide-react";

const benefits = [
    {
        icon: Heart,
        title: "Health & Wellness",
        description: "Comprehensive medical, dental, and vision coverage for you and your family",
    },
    {
        icon: Coffee,
        title: "Work-Life Balance",
        description: "Flexible hours, unlimited PTO, and mental health days",
    },
    {
        icon: Laptop,
        title: "Remote First",
        description: "Work from anywhere with home office stipend and equipment",
    },
    {
        icon: GraduationCap,
        title: "Learning Budget",
        description: "$2,000 annual learning stipend for courses, conferences, and books",
    },
    {
        icon: DollarSign,
        title: "Competitive Pay",
        description: "Top-of-market compensation with equity options",
    },
    {
        icon: Shield,
        title: "401(k) Match",
        description: "4% company match on retirement contributions",
    },
];

const values = [
    {
        icon: Users,
        title: "Customer First",
        description: "We obsess over our customers' success and build products they love",
    },
    {
        icon: Zap,
        title: "Move Fast",
        description: "We ship quickly, iterate often, and learn from our mistakes",
    },
    {
        icon: Globe,
        title: "Think Big",
        description: "We're transforming real estate with AI and cutting-edge technology",
    },
    {
        icon: Heart,
        title: "Be Human",
        description: "We treat everyone with respect, empathy, and kindness",
    },
];

const departments = [
    { id: "all", name: "All Departments" },
    { id: "engineering", name: "Engineering" },
    { id: "product", name: "Product" },
    { id: "design", name: "Design" },
    { id: "marketing", name: "Marketing" },
    { id: "sales", name: "Sales" },
    { id: "support", name: "Customer Support" },
    { id: "operations", name: "Operations" },
];

const locations = [
    { id: "all", name: "All Locations" },
    { id: "remote", name: "Remote" },
    { id: "new-york", name: "New York" },
    { id: "los-angeles", name: "Los Angeles" },
    { id: "miami", name: "Miami" },
];

const jobs = [
    {
        id: 1,
        title: "Senior Full Stack Engineer",
        department: "engineering",
        location: "remote",
        type: "Full-time",
        salary: "$150,000 - $200,000",
        description:
            "Build and scale our core platform using React, Node.js, and cloud technologies.",
        icon: Code,
    },
    {
        id: 2,
        title: "AI/ML Engineer",
        department: "engineering",
        location: "new-york",
        type: "Full-time",
        salary: "$180,000 - $250,000",
        description:
            "Develop AI-powered features for property matching and market predictions.",
        icon: Sparkles,
    },
    {
        id: 3,
        title: "Product Manager",
        department: "product",
        location: "remote",
        type: "Full-time",
        salary: "$130,000 - $170,000",
        description:
            "Drive product strategy and roadmap for our agent and consumer products.",
        icon: Building2,
    },
    {
        id: 4,
        title: "Senior Product Designer",
        department: "design",
        location: "remote",
        type: "Full-time",
        salary: "$140,000 - $180,000",
        description:
            "Design beautiful, intuitive experiences for millions of home seekers.",
        icon: Palette,
    },
    {
        id: 5,
        title: "Growth Marketing Manager",
        department: "marketing",
        location: "los-angeles",
        type: "Full-time",
        salary: "$100,000 - $140,000",
        description:
            "Lead user acquisition and retention strategies across channels.",
        icon: Megaphone,
    },
    {
        id: 6,
        title: "Enterprise Account Executive",
        department: "sales",
        location: "new-york",
        type: "Full-time",
        salary: "$120,000 - $160,000 + Commission",
        description:
            "Sell our platform to large real estate agencies and brokerages.",
        icon: BarChart3,
    },
    {
        id: 7,
        title: "Customer Success Manager",
        department: "support",
        location: "miami",
        type: "Full-time",
        salary: "$70,000 - $90,000",
        description:
            "Help our agent customers succeed and grow their business on our platform.",
        icon: HeadphonesIcon,
    },
    {
        id: 8,
        title: "DevOps Engineer",
        department: "engineering",
        location: "remote",
        type: "Full-time",
        salary: "$140,000 - $180,000",
        description:
            "Build and maintain our cloud infrastructure on AWS and Kubernetes.",
        icon: Code,
    },
];

export default function CareersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("all");
    const [selectedLocation, setSelectedLocation] = useState("all");

    const filteredJobs = jobs.filter((job) => {
        const matchesSearch =
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDepartment =
            selectedDepartment === "all" || job.department === selectedDepartment;
        const matchesLocation =
            selectedLocation === "all" || job.location === selectedLocation;
        return matchesSearch && matchesDepartment && matchesLocation;
    });

    const getLocationName = (locationId: string) => {
        const location = locations.find((l) => l.id === locationId);
        return location ? location.name : locationId;
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary/90 via-primary to-primary/80 text-primary-foreground overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                    />
                </div>

                <div className="container mx-auto max-w-7xl px-4 py-20 md:py-28 relative z-10">
                    <div className="max-w-3xl">
                        <Badge
                            variant="secondary"
                            className="mb-6 bg-white/20 text-primary-foreground border-white/30 hover:bg-white/30"
                        >
                            <Briefcase className="h-4 w-4 mr-2" />
                            We&apos;re Hiring
                        </Badge>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            Build the Future of Real Estate
                        </h1>
                        <p className="text-xl text-primary-foreground/80 mb-8">
                            Join our mission to transform how people find their perfect home using AI,
                            VR, and cutting-edge technology. We&apos;re looking for passionate
                            individuals who want to make a real impact.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                size="lg"
                                className="bg-white text-primary hover:bg-white/90"
                                asChild
                            >
                                <a href="#open-positions">
                                    View Open Positions
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </a>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white/30 text-primary-foreground hover:bg-white/10"
                            >
                                Learn About Us
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-8 bg-white border-b">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-primary">120+</div>
                            <div className="text-muted-foreground">Team Members</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-primary">15+</div>
                            <div className="text-muted-foreground">Countries</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-primary">$50M</div>
                            <div className="text-muted-foreground">Funding Raised</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-primary">4.8★</div>
                            <div className="text-muted-foreground">Glassdoor Rating</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Company Values */}
            <section className="py-16 bg-gray-50/50">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="text-center mb-12">
                        <Badge variant="secondary" className="mb-4">
                            Our Culture
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            What We Stand For
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Our values guide everything we do, from how we build products to how we
                            treat each other
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value) => (
                            <Card key={value.title} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                                <CardContent className="p-6 text-center">
                                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                                        <value.icon className="h-7 w-7 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                                    <p className="text-sm text-muted-foreground">{value.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-16 bg-white">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="text-center mb-12">
                        <Badge variant="secondary" className="mb-4">
                            Benefits & Perks
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            We Take Care of Our Team
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Competitive compensation and benefits to support you and your family
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {benefits.map((benefit) => (
                            <div
                                key={benefit.title}
                                className="flex items-start gap-4 p-6 rounded-xl border bg-gray-50/50 hover:bg-gray-50 transition-colors"
                            >
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                    <benefit.icon className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Open Positions */}
            <section id="open-positions" className="py-16 bg-gray-50/50 scroll-mt-20">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="text-center mb-12">
                        <Badge variant="secondary" className="mb-4">
                            Open Positions
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Find Your Next Role
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            We&apos;re always looking for talented individuals to join our team
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search jobs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Department" />
                            </SelectTrigger>
                            <SelectContent>
                                {departments.map((dept) => (
                                    <SelectItem key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Location" />
                            </SelectTrigger>
                            <SelectContent>
                                {locations.map((loc) => (
                                    <SelectItem key={loc.id} value={loc.id}>
                                        {loc.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Job Listings */}
                    <div className="space-y-4">
                        {filteredJobs.map((job) => (
                            <Card
                                key={job.id}
                                className="hover:shadow-lg transition-all border hover:border-primary/30"
                            >
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                            <job.icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg text-foreground mb-1">
                                                {job.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground mb-3">
                                                {job.description}
                                            </p>
                                            <div className="flex flex-wrap gap-3">
                                                <Badge variant="secondary" className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {getLocationName(job.location)}
                                                </Badge>
                                                <Badge variant="secondary" className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {job.type}
                                                </Badge>
                                                <Badge variant="secondary" className="flex items-center gap-1">
                                                    <DollarSign className="h-3 w-3" />
                                                    {job.salary}
                                                </Badge>
                                            </div>
                                        </div>
                                        <Button className="shrink-0">
                                            Apply Now
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {filteredJobs.length === 0 && (
                            <div className="text-center py-12">
                                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-foreground mb-2">
                                    No positions found
                                </h3>
                                <p className="text-muted-foreground">
                                    Try adjusting your search or filters
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-primary text-primary-foreground">
                <div className="container mx-auto max-w-7xl px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Don&apos;t See the Right Role?
                    </h2>
                    <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                        We&apos;re always interested in hearing from talented people. Send us your
                        resume and we&apos;ll reach out when there&apos;s a good fit.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="bg-white text-primary hover:bg-white/90"
                            asChild
                        >
                            <Link href="/contact">
                                Get in Touch
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-white/30 text-primary-foreground hover:bg-white/10"
                        >
                            Join Talent Pool
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
