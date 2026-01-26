import { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogsService } from "@/services/blogs";
import type { Category } from "@/types/appwrite";
import BlogPostClient from "./blog-post-client";

interface BlogPostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await blogsService.getBySlug(slug);

    if (!post) {
        return {
            title: "Blog Post Not Found | Real Landing",
            description: "The requested blog post could not be found.",
        };
    }

    return {
        title: post.meta_title || `${post.title} | Real Landing Blog`,
        description: post.meta_description || post.excerpt,
        openGraph: {
            title: post.meta_title || post.title,
            description: post.meta_description || post.excerpt,
            images: post.featured_image ? [post.featured_image] : [],
            type: "article",
            publishedTime: post.published_at || undefined,
            authors: post.author_name ? [post.author_name] : [],
        },
        twitter: {
            card: "summary_large_image",
            title: post.meta_title || post.title,
            description: post.meta_description || post.excerpt,
            images: post.featured_image ? [post.featured_image] : [],
        },
    };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const post = await blogsService.getBySlug(slug);

    if (!post) {
        notFound();
    }

    // Increment views in the background
    blogsService.incrementViews(post.$id).catch(console.error);

    // Fetch related posts (only if category exists)
    const relatedPosts = post.category
        ? await blogsService.getRelated(post.$id, post.category as Category, 3)
        : [];

    return <BlogPostClient post={post} relatedPosts={relatedPosts} />;
}
