"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  CalendarIcon,
  UserIcon,
  ClockIcon,
  ArrowRightIcon,
  TrendingUpIcon,
  HomeIcon,
  DollarSignIcon,
  SearchIcon,
  BookOpenIcon,
  TagIcon,
  SparklesIcon,
  BuildingIcon,
  KeyIcon,
  MailIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";

const featuredPost = {
  id: 1,
  title: "2026 Real Estate Market Trends: What Buyers and Sellers Need to Know",
  excerpt:
    "Comprehensive analysis of current market conditions, pricing trends, and expert predictions for the upcoming year in real estate. Learn how to navigate the changing landscape and make informed decisions.",
  category: "Market Analysis",
  author: {
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    role: "Senior Market Analyst",
  },
  date: "January 10, 2026",
  readTime: "8 min read",
  image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=500&fit=crop",
};

const blogPosts = [
  {
    id: 2,
    title: "First-Time Homebuyer's Complete Guide for 2026",
    excerpt: "Everything you need to know about buying your first home, from pre-approval to closing day.",
    category: "Buying Tips",
    author: {
      name: "Emily Rodriguez",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
    },
    date: "January 8, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Top 10 Home Staging Tips to Sell Your Property Fast",
    excerpt: "Professional staging techniques that can help your property sell quicker and for better prices.",
    category: "Selling Tips",
    author: {
      name: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    },
    date: "January 5, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
  },
  {
    id: 4,
    title: "Investment Properties: How to Calculate ROI Like a Pro",
    excerpt: "Learn how to properly evaluate investment properties and calculate potential returns on investment.",
    category: "Investment",
    author: {
      name: "David Thompson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
    date: "January 3, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
  },
  {
    id: 5,
    title: "Understanding Mortgage Types and Interest Rates in 2026",
    excerpt: "A comprehensive breakdown of different mortgage options and how to choose the best one.",
    category: "Financing",
    author: {
      name: "Lisa Park",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop",
    },
    date: "December 28, 2025",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop",
  },
  {
    id: 6,
    title: "Luxury Home Features That Actually Add Property Value",
    excerpt: "Premium amenities and features that significantly increase luxury property values in today's market.",
    category: "Luxury",
    author: {
      name: "James Wilson",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    },
    date: "December 25, 2025",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop",
  },
  {
    id: 7,
    title: "Property Management Best Practices for New Landlords",
    excerpt: "Essential tips and strategies for landlords to effectively manage their rental properties.",
    category: "Property Management",
    author: {
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    date: "December 20, 2025",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
  },
  {
    id: 8,
    title: "Smart Home Technology: What Buyers Are Looking For",
    excerpt: "The latest smart home features that modern buyers expect in their new homes.",
    category: "Technology",
    author: {
      name: "Alex Turner",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop",
    },
    date: "December 18, 2025",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&h=400&fit=crop",
  },
  {
    id: 9,
    title: "Neighborhood Guide: How to Research Before You Buy",
    excerpt: "Key factors to consider when evaluating neighborhoods for your next home purchase.",
    category: "Buying Tips",
    author: {
      name: "Maria Santos",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    },
    date: "December 15, 2025",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=600&h=400&fit=crop",
  },
];

const categories = [
  { name: "All Posts", count: 45, icon: BookOpenIcon, slug: "all" },
  { name: "Market Analysis", count: 12, icon: TrendingUpIcon, slug: "market" },
  { name: "Buying Tips", count: 18, icon: KeyIcon, slug: "buying" },
  { name: "Selling Tips", count: 15, icon: DollarSignIcon, slug: "selling" },
  { name: "Investment", count: 9, icon: TrendingUpIcon, slug: "investment" },
  { name: "Financing", count: 7, icon: DollarSignIcon, slug: "financing" },
  { name: "Luxury", count: 5, icon: SparklesIcon, slug: "luxury" },
  { name: "Property Management", count: 8, icon: BuildingIcon, slug: "management" },
];

const popularTags = [
  "Home Buying",
  "Investment",
  "Market Trends",
  "Mortgage",
  "First-Time Buyers",
  "Luxury Homes",
  "Property Value",
  "Real Estate Tips",
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("all");
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

        <div className="container mx-auto max-w-7xl px-4 py-16 md:py-20 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <Badge
              variant="secondary"
              className="mb-6 bg-white/20 text-primary-foreground border-white/30 hover:bg-white/30"
            >
              <BookOpenIcon className="h-4 w-4 mr-2" />
              Real Landing Blog
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Insights & Expert Advice for <span className="text-secondary">Smart Real Estate</span> Decisions
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Stay informed with the latest market trends, buying tips, investment strategies, and expert advice from our team of real estate professionals.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-6 rounded-full bg-white text-foreground border-0 shadow-none"
                />
                <Button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-6">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 bg-white border-b border-border">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category.slug}
                variant={activeCategory === category.slug ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => setActiveCategory(category.slug)}
              >
                <category.icon className="h-4 w-4 mr-2" />
                {category.name}
                <Badge
                  variant="secondary"
                  className={`ml-2 ${activeCategory === category.slug ? "bg-white/20" : ""}`}
                >
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-2 mb-8">
            <SparklesIcon className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Featured Article</h2>
          </div>

          <Card className="overflow-hidden border border-border shadow-none">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 lg:h-auto">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  className="object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-primary">
                  {featuredPost.category}
                </Badge>
              </div>
              <div className="p-8 lg:p-10 flex flex-col justify-center">
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4 leading-tight">
                  {featuredPost.title}
                </h2>
                <p className="text-muted-foreground mb-6 text-lg">{featuredPost.excerpt}</p>

                <div className="flex items-center gap-4 mb-6">
                  <Image
                    src={featuredPost.author.avatar}
                    alt={featuredPost.author.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-medium text-foreground">{featuredPost.author.name}</div>
                    <div className="text-sm text-muted-foreground">{featuredPost.author.role}</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{featuredPost.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ClockIcon className="h-4 w-4" />
                    <span>{featuredPost.readTime}</span>
                  </div>
                </div>

                <Button className="rounded-full self-start px-6">
                  Read Full Article
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Blog Posts Grid */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-foreground">Latest Articles</h2>
                <p className="text-muted-foreground text-sm">Showing {blogPosts.length} articles</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="overflow-hidden border border-border shadow-none hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className="relative h-48">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 left-3 bg-primary/90">{post.category}</Badge>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{post.excerpt}</p>

                      <div className="flex items-center gap-3 mb-4">
                        <Image
                          src={post.author.avatar}
                          alt={post.author.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-foreground">{post.author.name}</div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{post.date}</span>
                            <span>•</span>
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                      </div>

                      <Button variant="outline" size="sm" className="w-full rounded-full">
                        Read More
                        <ArrowRightIcon className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2 mt-10">
                <Button variant="outline" size="icon" className="rounded-full">
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <Button variant="default" size="icon" className="rounded-full">
                  1
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  2
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  3
                </Button>
                <span className="px-2 text-muted-foreground">...</span>
                <Button variant="outline" size="icon" className="rounded-full">
                  8
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Newsletter */}
              <Card className="p-6 border border-border shadow-none bg-primary text-primary-foreground">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <MailIcon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
                <p className="text-primary-foreground/80 text-sm mb-4">
                  Get the latest real estate insights and market updates delivered to your inbox.
                </p>
                <div className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/60 rounded-xl"
                  />
                  <Button variant="secondary" className="w-full rounded-full">
                    Subscribe Now
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </Card>

              {/* Popular Posts */}
              <Card className="p-6 border border-border shadow-none bg-white">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUpIcon className="h-5 w-5 text-primary" />
                  Popular Articles
                </h3>
                <div className="space-y-4">
                  {blogPosts.slice(0, 4).map((post, index) => (
                    <div
                      key={post.id}
                      className="flex gap-3 p-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={post.image} alt={post.title} fill className="object-cover" />
                        <div className="absolute inset-0 bg-primary/60 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">{index + 1}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-foreground line-clamp-2 mb-1">
                          {post.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">{post.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Categories */}
              <Card className="p-6 border border-border shadow-none bg-white">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <HomeIcon className="h-5 w-5 text-primary" />
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.slice(1).map((category) => (
                    <div
                      key={category.slug}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <category.icon className="h-4 w-4 text-primary" />
                        <span className="text-sm text-foreground">{category.name}</span>
                      </div>
                      <Badge variant="secondary">{category.count}</Badge>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Popular Tags */}
              <Card className="p-6 border border-border shadow-none bg-white">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <TagIcon className="h-5 w-5 text-primary" />
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>

              {/* CTA Card */}
              <Card className="p-6 border border-border shadow-none bg-secondary">
                <div className="text-center">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <HomeIcon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Ready to Find Your Dream Home?
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Browse thousands of properties and find your perfect match.
                  </p>
                  <Button className="w-full rounded-full" asChild>
                    <Link href="/properties">
                      Browse Properties
                      <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Authors Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <Badge variant="secondary" className="mb-4">
              <UserIcon className="h-4 w-4 mr-2" />
              Meet Our Writers
            </Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">Expert Contributors</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our blog is powered by industry experts with decades of combined real estate experience.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...new Map(blogPosts.map((post) => [post.author.name, post.author])).values()].map(
              (author) => (
                <Card
                  key={author.name}
                  className="p-4 text-center border border-border shadow-none hover:-translate-y-1 transition-all duration-300"
                >
                  <Image
                    src={author.avatar}
                    alt={author.name}
                    width={64}
                    height={64}
                    className="rounded-full mx-auto mb-3"
                  />
                  <h4 className="font-medium text-foreground text-sm">{author.name}</h4>
                </Card>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 p-10 rounded-3xl bg-primary text-primary-foreground">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Have a Story to Share?
              </h2>
              <p className="text-lg text-primary-foreground/80 max-w-xl">
                We&apos;re always looking for guest contributors. Share your real estate expertise with our readers.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="secondary" className="rounded-full px-8" asChild>
                <Link href="/contact">
                  Become a Contributor
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}