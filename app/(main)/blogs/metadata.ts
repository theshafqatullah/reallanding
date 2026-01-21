import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Real Estate Blog - Tips, Guides & Market Insights",
  description:
    "Stay informed with Real Landing's real estate blog. Get expert tips on buying, selling, investing, and market trends. Learn from industry professionals and make smarter property decisions.",
  keywords: [
    "real estate blog",
    "property tips",
    "buying guide",
    "selling tips",
    "market trends",
    "real estate news",
    "investment advice",
    "home buying tips",
    "property market analysis",
    "real estate insights",
    "mortgage tips",
  ],
  openGraph: {
    title: "Real Estate Blog - Expert Tips & Market Insights | Real Landing",
    description:
      "Expert real estate tips, market analysis, buying guides, and investment advice. Stay informed and make smarter property decisions.",
    url: "/blogs",
    type: "website",
    images: [
      {
        url: "/og-blog.jpg",
        width: 1200,
        height: 630,
        alt: "Real Landing Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Real Estate Blog - Expert Tips & Market Insights | Real Landing",
    description:
      "Expert real estate tips, market analysis, buying guides, and investment advice. Stay informed and make smarter property decisions.",
  },
  alternates: {
    canonical: "/blogs",
  },
};
