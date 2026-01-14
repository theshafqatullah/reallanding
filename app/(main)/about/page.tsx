"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  HomeIcon,
  UsersIcon,
  MapPinIcon,
  AwardIcon,
  TargetIcon,
  HeartIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
  StarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  BuildingIcon,
  ClockIcon,
  GlobeIcon,
  SparklesIcon,
  HandshakeIcon,
} from "lucide-react";

const stats = [
  { label: "Properties Sold", value: "50K+", icon: HomeIcon },
  { label: "Happy Clients", value: "25K+", icon: UsersIcon },
  { label: "Cities Covered", value: "200+", icon: MapPinIcon },
  { label: "Years Experience", value: "15+", icon: ClockIcon },
];

const values = [
  {
    icon: ShieldCheckIcon,
    title: "Trust & Transparency",
    description: "We believe in honest communication and transparent dealings in every transaction.",
  },
  {
    icon: HeartIcon,
    title: "Client-First Approach",
    description: "Your dreams and goals are our priority. We go above and beyond to exceed expectations.",
  },
  {
    icon: SparklesIcon,
    title: "Innovation",
    description: "Leveraging cutting-edge technology to make property search seamless and efficient.",
  },
  {
    icon: HandshakeIcon,
    title: "Integrity",
    description: "We uphold the highest ethical standards in all our business practices.",
  },
];

const team = [
  {
    name: "Alexandra Chen",
    role: "CEO & Founder",
    bio: "15+ years in real estate with a vision to transform the industry through technology.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
  },
  {
    name: "Marcus Thompson",
    role: "Chief Operating Officer",
    bio: "Former Fortune 500 executive bringing operational excellence to real estate.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  },
  {
    name: "Sarah Williams",
    role: "Head of Sales",
    bio: "Award-winning sales leader with $500M+ in closed transactions.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
  },
  {
    name: "David Rodriguez",
    role: "Chief Technology Officer",
    bio: "Tech innovator focused on creating the best digital property experience.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  },
];

const milestones = [
  { year: "2010", title: "Company Founded", description: "Started with a small team and big dreams in New York." },
  { year: "2014", title: "National Expansion", description: "Expanded to 50 cities across the United States." },
  { year: "2018", title: "Tech Platform Launch", description: "Launched our innovative digital property platform." },
  { year: "2021", title: "25,000 Happy Clients", description: "Celebrated helping our 25,000th client find their home." },
  { year: "2024", title: "Industry Leader", description: "Recognized as the #1 property listing platform nationwide." },
];

const awards = [
  "Best Real Estate Platform 2024",
  "Customer Service Excellence Award",
  "Top 100 PropTech Companies",
  "Best Place to Work in Real Estate",
  "Innovation in Real Estate Award",
  "Trusted Brand of the Year",
];

export default function AboutPage() {
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
              <BuildingIcon className="h-4 w-4 mr-2" />
              About Real Landing
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Redefining Real Estate <br />
              <span className="text-secondary">Since 2010</span>
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              We&apos;re on a mission to make finding your perfect property as simple, 
              transparent, and enjoyable as it should be.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" className="rounded-full px-8">
                Meet Our Team
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 border-white/30 text-primary-foreground hover:bg-white/10"
              >
                Our Story
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 -mt-24 relative z-20">
            {stats.map((stat) => (
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

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4">
                Our Story
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                From a Small Office to Industry Leader
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Real Landing started in 2010 with a simple belief: everyone deserves 
                access to honest, transparent real estate services. What began as a 
                small team in New York has grown into a nationwide platform trusted 
                by millions.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Today, we&apos;re proud to have helped over 25,000 families find their 
                perfect homes, facilitated billions in property transactions, and 
                built a community of over 1,000 dedicated real estate professionals.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-primary" />
                  <span className="text-foreground">Trusted by Millions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-primary" />
                  <span className="text-foreground">Award-Winning Service</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-primary" />
                  <span className="text-foreground">Industry Innovation</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"
                  alt="Real Landing Office"
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                />
              </div>
              <Card className="absolute -bottom-6 -left-6 p-6 bg-white border border-border shadow-none max-w-[240px]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                    <AwardIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">15+</div>
                    <div className="text-sm text-muted-foreground">Years of Excellence</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 border border-border shadow-none bg-white">
              <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mb-6">
                <TargetIcon className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground text-lg">
                To revolutionize the real estate experience by providing transparent, 
                efficient, and personalized services that help everyone find their 
                perfect property. We believe in making homeownership accessible and 
                the journey enjoyable.
              </p>
            </Card>

            <Card className="p-8 border border-border shadow-none bg-white">
              <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mb-6">
                <GlobeIcon className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Our Vision</h2>
              <p className="text-muted-foreground text-lg">
                To be the most trusted real estate platform globally, empowering 
                millions to make informed property decisions with confidence. We 
                envision a world where finding your dream home is simple, transparent, 
                and stress-free.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              What Drives Us
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <Card
                key={value.title}
                className="p-6 text-center border border-border shadow-none hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline / Milestones */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-white">
              Our Journey
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Key Milestones
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A look at how far we&apos;ve come
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border" />

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.year}
                  className={`flex flex-col md:flex-row items-center gap-4 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <Card className="p-6 border border-border shadow-none bg-white inline-block">
                      <div className="text-primary font-bold text-lg mb-1">
                        {milestone.year}
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {milestone.description}
                      </p>
                    </Card>
                  </div>
                  <div className="w-4 h-4 bg-primary rounded-full z-10 flex-shrink-0" />
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Our Leadership
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Meet the Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The passionate people behind Real Landing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <Card
                key={member.name}
                className="overflow-hidden border border-border shadow-none group"
              >
                <div className="relative h-64">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg text-foreground">
                    {member.name}
                  </h3>
                  <p className="text-primary text-sm font-medium mb-2">
                    {member.role}
                  </p>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button variant="outline" className="rounded-full" asChild>
              <Link href="/agents">
                View All Team Members
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 bg-white">
              <AwardIcon className="h-4 w-4 mr-2" />
              Recognition
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Awards & Achievements
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Industry recognition for our commitment to excellence
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {awards.map((award, index) => (
              <Card
                key={index}
                className="p-4 text-center border border-border shadow-none bg-white"
              >
                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-3">
                  <StarIcon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground">{award}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Quote */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="text-4xl text-primary">&ldquo;</span>
          </div>
          <blockquote className="text-2xl md:text-3xl font-medium text-foreground mb-8 leading-relaxed">
            Our success is measured not by the number of properties we sell, 
            but by the number of families we help find their perfect home.
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <Image
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop"
              alt="Alexandra Chen"
              width={60}
              height={60}
              className="rounded-full"
            />
            <div className="text-left">
              <div className="font-semibold text-foreground">Alexandra Chen</div>
              <div className="text-muted-foreground text-sm">CEO & Founder</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 p-12 rounded-3xl bg-primary text-primary-foreground">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Find Your Dream Home?
              </h2>
              <p className="text-xl text-primary-foreground/80 max-w-xl">
                Join thousands of happy homeowners who found their perfect property with Real Landing.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="secondary" className="rounded-full px-8" asChild>
                <Link href="/properties">
                  Browse Properties
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 border-white/30 text-primary-foreground hover:bg-white/10"
                asChild
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}