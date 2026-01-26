import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileSearchIcon, ArrowLeftIcon, HomeIcon, BookOpenIcon } from "lucide-react";

export default function BlogPostNotFound() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="container mx-auto max-w-2xl px-4 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted mb-8">
                    <FileSearchIcon className="h-12 w-12 text-muted-foreground" />
                </div>

                <h1 className="text-4xl font-bold text-foreground mb-4">
                    Article Not Found
                </h1>

                <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                    Sorry, the blog post you&apos;re looking for doesn&apos;t exist or may have been moved.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/blogs">
                        <Button size="lg" className="gap-2">
                            <BookOpenIcon className="h-5 w-5" />
                            Browse All Articles
                        </Button>
                    </Link>
                    <Link href="/">
                        <Button variant="outline" size="lg" className="gap-2">
                            <HomeIcon className="h-5 w-5" />
                            Go to Homepage
                        </Button>
                    </Link>
                </div>

                <div className="mt-12 pt-8 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-4">
                        Looking for something specific? Try these popular articles:
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                        <Link href="/blogs/first-time-home-buyer-guide">
                            <Button variant="ghost" size="sm">
                                First-Time Buyer Guide
                            </Button>
                        </Link>
                        <Link href="/blogs/2026-real-estate-market-trends">
                            <Button variant="ghost" size="sm">
                                Market Trends 2026
                            </Button>
                        </Link>
                        <Link href="/blogs/smart-home-features-property-value">
                            <Button variant="ghost" size="sm">
                                Smart Home Features
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
