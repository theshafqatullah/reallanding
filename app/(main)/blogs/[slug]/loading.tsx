import { Skeleton } from "@/components/ui/skeleton";

export default function BlogPostLoading() {
    return (
        <div className="min-h-screen bg-background">
            {/* Breadcrumb */}
            <div className="bg-muted/30 border-b border-border">
                <div className="container mx-auto max-w-5xl px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-9 w-32" />
                        <Skeleton className="h-5 w-48 hidden md:block" />
                    </div>
                </div>
            </div>

            {/* Article Header */}
            <article className="container mx-auto max-w-5xl px-4 py-12">
                {/* Category Badge */}
                <Skeleton className="h-6 w-32 mb-6 rounded-full" />

                {/* Title */}
                <Skeleton className="h-12 w-full mb-4" />
                <Skeleton className="h-12 w-3/4 mb-6" />

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-6 mb-8">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div>
                            <Skeleton className="h-5 w-32 mb-1" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    </div>
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-28" />
                </div>

                {/* Featured Image */}
                <Skeleton className="w-full h-[400px] lg:h-[500px] rounded-2xl mb-10" />

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Share Sidebar */}
                    <aside className="hidden lg:block lg:col-span-1">
                        <div className="flex flex-col items-center gap-4">
                            <Skeleton className="h-4 w-10" />
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-10 w-10 rounded-full" />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        {/* Excerpt */}
                        <Skeleton className="h-7 w-full mb-2" />
                        <Skeleton className="h-7 w-5/6 mb-8" />

                        {/* Article Body */}
                        <div className="space-y-4">
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-4/5" />
                            <div className="h-6" />
                            <Skeleton className="h-8 w-1/2 mb-4" />
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-3/4" />
                            <div className="h-6" />
                            <Skeleton className="h-8 w-1/3 mb-4" />
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-5/6" />
                            <div className="h-6" />
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-2/3" />
                        </div>

                        {/* Tags */}
                        <div className="mt-10 pt-8 border-t border-border">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-5 w-5" />
                                <Skeleton className="h-6 w-20 rounded-full" />
                                <Skeleton className="h-6 w-24 rounded-full" />
                                <Skeleton className="h-6 w-16 rounded-full" />
                            </div>
                        </div>

                        {/* Author Bio */}
                        <div className="mt-10 p-6 border border-border rounded-xl">
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-16 w-16 rounded-full" />
                                <div className="flex-1">
                                    <Skeleton className="h-4 w-20 mb-2" />
                                    <Skeleton className="h-6 w-40 mb-2" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-4/5" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="hidden lg:block lg:col-span-3">
                        <div className="border border-border rounded-xl p-6">
                            <Skeleton className="h-5 w-32 mb-4" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                            <div className="h-6 border-t border-border my-6" />
                            <Skeleton className="h-5 w-28 mb-4" />
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-12" />
                                </div>
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-4 w-10" />
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </article>

            {/* Related Posts */}
            <section className="bg-muted/30 py-16">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <Skeleton className="h-8 w-48 mb-2" />
                            <Skeleton className="h-5 w-64" />
                        </div>
                        <Skeleton className="h-10 w-28" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="border border-border rounded-xl overflow-hidden">
                                <Skeleton className="h-48 w-full" />
                                <div className="p-5">
                                    <Skeleton className="h-6 w-full mb-2" />
                                    <Skeleton className="h-6 w-4/5 mb-4" />
                                    <Skeleton className="h-4 w-full mb-2" />
                                    <Skeleton className="h-4 w-3/4 mb-4" />
                                    <div className="flex gap-4">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
