"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
    CalendarIcon,
    ClockIcon,
    ArrowLeftIcon,
    ShareIcon,
    BookmarkIcon,
    ThumbsUpIcon,
    MessageCircleIcon,
    EyeIcon,
    TagIcon,
    ArrowRightIcon,
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
    LinkIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "lucide-react";
import type { BlogPosts } from "@/types/appwrite";
import ReactMarkdown from "react-markdown";

interface BlogPostClientProps {
    post: BlogPosts;
    relatedPosts: BlogPosts[];
}

// Helper function to format category name
const formatCategoryName = (category: string | undefined) => {
    if (!category) return "Article";
    return category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

// Helper function to format date
const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "Recent";
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
};

// Get author initials
const getAuthorInitials = (name: string | undefined) => {
    if (!name) return "RL";
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

// Parse tags from string
const parseTags = (tags: string | string[] | null | undefined): string[] => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    return String(tags).split(",").map((tag) => tag.trim());
};

export default function BlogPostClient({
    post,
    relatedPosts,
}: BlogPostClientProps) {
    const tags = parseTags(post.tags);

    const handleShare = async (platform: string) => {
        const url = window.location.href;
        const title = post.title;

        switch (platform) {
            case "facebook":
                window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
                    "_blank"
                );
                break;
            case "twitter":
                window.open(
                    `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
                    "_blank"
                );
                break;
            case "linkedin":
                window.open(
                    `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
                    "_blank"
                );
                break;
            case "copy":
                await navigator.clipboard.writeText(url);
                // You could add a toast notification here
                break;
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Breadcrumb & Back Button */}
            <div className="bg-muted/30 border-b border-border">
                <div className="container mx-auto max-w-5xl px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/blogs">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <ArrowLeftIcon className="h-4 w-4" />
                                Back to Blog
                            </Button>
                        </Link>
                        <nav className="hidden md:flex items-center text-sm text-muted-foreground">
                            <Link href="/" className="hover:text-foreground transition-colors">
                                Home
                            </Link>
                            <ChevronRightIcon className="h-4 w-4 mx-2" />
                            <Link href="/blogs" className="hover:text-foreground transition-colors">
                                Blog
                            </Link>
                            <ChevronRightIcon className="h-4 w-4 mx-2" />
                            <span className="text-foreground truncate max-w-[200px]">
                                {post.title}
                            </span>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Article Header */}
            <article className="container mx-auto max-w-5xl px-4 py-12">
                {/* Category Badge */}
                <Badge
                    variant="secondary"
                    className="mb-6 bg-primary/10 text-primary hover:bg-primary/20"
                >
                    {formatCategoryName(post.category)}
                </Badge>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                    {post.title}
                </h1>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-6 mb-8">
                    {/* Author */}
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={post.author_avatar || undefined} alt={post.author_name || "Author"} />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                                {getAuthorInitials(post.author_name)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-foreground">
                                {post.author_name || "Real Landing Team"}
                            </p>
                            <p className="text-sm text-muted-foreground">Author</p>
                        </div>
                    </div>

                    <Separator orientation="vertical" className="h-10 hidden sm:block" />

                    {/* Date */}
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{formatDate(post.published_at)}</span>
                    </div>

                    {/* Reading Time */}
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <ClockIcon className="h-4 w-4" />
                        <span>{post.reading_time || 5} min read</span>
                    </div>

                    {/* Views */}
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <EyeIcon className="h-4 w-4" />
                        <span>{(post.views_count || 0).toLocaleString()} views</span>
                    </div>
                </div>

                {/* Featured Image */}
                {post.featured_image && (
                    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden mb-10">
                        <Image
                            src={post.featured_image}
                            alt={post.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Share Sidebar - Desktop */}
                    <aside className="hidden lg:block lg:col-span-1">
                        <div className="sticky top-24 flex flex-col items-center gap-4">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Share
                            </span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full"
                                onClick={() => handleShare("facebook")}
                            >
                                <FacebookIcon className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full"
                                onClick={() => handleShare("twitter")}
                            >
                                <TwitterIcon className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full"
                                onClick={() => handleShare("linkedin")}
                            >
                                <LinkedinIcon className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full"
                                onClick={() => handleShare("copy")}
                            >
                                <LinkIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        {/* Excerpt */}
                        {post.excerpt && (
                            <p className="text-xl text-muted-foreground mb-8 leading-relaxed font-medium">
                                {post.excerpt}
                            </p>
                        )}

                        {/* Article Body */}
                        <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-li:text-muted-foreground">
                            <ReactMarkdown
                                components={{
                                    h2: ({ children }) => (
                                        <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">
                                            {children}
                                        </h2>
                                    ),
                                    h3: ({ children }) => (
                                        <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">
                                            {children}
                                        </h3>
                                    ),
                                    h4: ({ children }) => (
                                        <h4 className="text-lg font-semibold text-foreground mt-6 mb-2">
                                            {children}
                                        </h4>
                                    ),
                                    p: ({ children }) => (
                                        <p className="text-muted-foreground leading-relaxed mb-4">
                                            {children}
                                        </p>
                                    ),
                                    ul: ({ children }) => (
                                        <ul className="list-disc list-inside space-y-2 mb-6 text-muted-foreground">
                                            {children}
                                        </ul>
                                    ),
                                    ol: ({ children }) => (
                                        <ol className="list-decimal list-inside space-y-2 mb-6 text-muted-foreground">
                                            {children}
                                        </ol>
                                    ),
                                    li: ({ children }) => (
                                        <li className="text-muted-foreground">{children}</li>
                                    ),
                                    blockquote: ({ children }) => (
                                        <blockquote className="border-l-4 border-primary pl-6 my-6 italic text-muted-foreground bg-muted/30 py-4 pr-4 rounded-r-lg">
                                            {children}
                                        </blockquote>
                                    ),
                                    strong: ({ children }) => (
                                        <strong className="font-semibold text-foreground">
                                            {children}
                                        </strong>
                                    ),
                                    a: ({ href, children }) => (
                                        <a
                                            href={href}
                                            className="text-primary hover:underline"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {children}
                                        </a>
                                    ),
                                    code: ({ children }) => (
                                        <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                                            {children}
                                        </code>
                                    ),
                                    pre: ({ children }) => (
                                        <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-6">
                                            {children}
                                        </pre>
                                    ),
                                }}
                            >
                                {post.content || ""}
                            </ReactMarkdown>
                        </div>

                        {/* Tags */}
                        {tags.length > 0 && (
                            <div className="mt-10 pt-8 border-t border-border">
                                <div className="flex flex-wrap items-center gap-3">
                                    <TagIcon className="h-5 w-5 text-muted-foreground" />
                                    {tags.map((tag, index) => (
                                        <Badge
                                            key={index}
                                            variant="outline"
                                            className="cursor-pointer hover:bg-primary/10"
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Mobile Share Buttons */}
                        <div className="lg:hidden mt-8 pt-8 border-t border-border">
                            <p className="text-sm font-medium text-muted-foreground mb-4">
                                Share this article
                            </p>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleShare("facebook")}
                                >
                                    <FacebookIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleShare("twitter")}
                                >
                                    <TwitterIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleShare("linkedin")}
                                >
                                    <LinkedinIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleShare("copy")}
                                >
                                    <LinkIcon className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Engagement Stats */}
                        <div className="mt-8 p-6 bg-muted/30 rounded-2xl">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <ThumbsUpIcon className="h-5 w-5" />
                                        <span>{(post.likes_count || 0).toLocaleString()} likes</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <MessageCircleIcon className="h-5 w-5" />
                                        <span>{(post.comments_count || 0).toLocaleString()} comments</span>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Button variant="outline" className="gap-2">
                                        <ThumbsUpIcon className="h-4 w-4" />
                                        Like
                                    </Button>
                                    <Button variant="outline" className="gap-2">
                                        <BookmarkIcon className="h-4 w-4" />
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Author Bio */}
                        <Card className="mt-10 border border-border shadow-none">
                            <CardContent className="p-6">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={post.author_avatar || undefined} alt={post.author_name || "Author"} />
                                        <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                                            {getAuthorInitials(post.author_name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground mb-1">
                                            Written by
                                        </p>
                                        <h4 className="font-semibold text-lg text-foreground">
                                            {post.author_name || "Real Landing Team"}
                                        </h4>
                                        <p className="text-muted-foreground mt-2">
                                            Real estate expert with years of experience helping buyers and sellers navigate the property market.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Table of Contents - Desktop */}
                    <aside className="hidden lg:block lg:col-span-3">
                        <div className="sticky top-24">
                            <Card className="border border-border shadow-none">
                                <CardContent className="p-6">
                                    <h4 className="font-semibold text-foreground mb-4">
                                        Quick Navigation
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <p className="text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                                            Introduction
                                        </p>
                                        <p className="text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                                            Key Takeaways
                                        </p>
                                        <p className="text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                                            Conclusion
                                        </p>
                                    </div>

                                    <Separator className="my-6" />

                                    <h4 className="font-semibold text-foreground mb-4">
                                        Article Stats
                                    </h4>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Reading time</span>
                                            <span className="font-medium text-foreground">
                                                {post.reading_time || 5} min
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Views</span>
                                            <span className="font-medium text-foreground">
                                                {(post.views_count || 0).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Likes</span>
                                            <span className="font-medium text-foreground">
                                                {(post.likes_count || 0).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </aside>
                </div>
            </article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="bg-muted/30 py-16">
                    <div className="container mx-auto max-w-7xl px-4">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">
                                    Related Articles
                                </h2>
                                <p className="text-muted-foreground mt-1">
                                    More articles you might enjoy
                                </p>
                            </div>
                            <Link href="/blogs">
                                <Button variant="outline" className="gap-2">
                                    View All
                                    <ArrowRightIcon className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedPosts.map((relatedPost) => (
                                <Link key={relatedPost.$id} href={`/blogs/${relatedPost.slug}`}>
                                    <Card className="h-full overflow-hidden border border-border shadow-none hover:shadow-md transition-all duration-300 hover:-translate-y-1 p-0 gap-0">
                                        <div className="relative h-48 overflow-hidden">
                                            <Image
                                                src={
                                                    relatedPost.featured_image ||
                                                    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop"
                                                }
                                                alt={relatedPost.title}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <Badge className="absolute top-3 left-3 bg-primary/90">
                                                {formatCategoryName(relatedPost.category)}
                                            </Badge>
                                        </div>
                                        <CardContent className="p-5">
                                            <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors">
                                                {relatedPost.title}
                                            </h3>
                                            <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                                                {relatedPost.excerpt}
                                            </p>
                                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <CalendarIcon className="h-4 w-4" />
                                                    <span>{formatDate(relatedPost.published_at)}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <ClockIcon className="h-4 w-4" />
                                                    <span>{relatedPost.reading_time || 5} min</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Newsletter CTA */}
            <section className="py-16 bg-gradient-to-r from-primary to-primary/80">
                <div className="container mx-auto max-w-4xl px-4 text-center">
                    <h2 className="text-3xl font-bold text-primary-foreground mb-4">
                        Stay Updated with Real Estate Insights
                    </h2>
                    <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                        Subscribe to our newsletter and get the latest market trends, buying tips, and exclusive content delivered to your inbox.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-3 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-white/50"
                        />
                        <Button
                            variant="secondary"
                            className="rounded-full px-8 py-3"
                        >
                            Subscribe
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
