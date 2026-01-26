import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Real Estate Guides - Complete Buying & Selling Resources",
  description:
    "Discover Real Landing's comprehensive real estate guides. From property search and buying assistance to selling support, property management, and investment consulting. Expert guidance at every step.",
  keywords: [
    "real estate guides",
    "property guides",
    "buying guide",
    "selling guide",
    "property management guide",
    "investment guide",
    "legal documentation",
    "property valuation",
    "real estate resources",
    "home buying guide",
    "property selling guide",
  ],
  openGraph: {
    title: "Complete Real Estate Guides | Real Landing",
    description:
      "From property search to investment consulting, explore our comprehensive real estate guides. Expert guidance for buying, selling, renting, and managing properties.",
    url: "/guides",
    type: "website",
    images: [
      {
        url: "/og-guides.jpg",
        width: 1200,
        height: 630,
        alt: "Real Landing Guides",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Complete Real Estate Guides | Real Landing",
    description:
      "From property search to investment consulting, explore our comprehensive real estate guides. Expert guidance at every step.",
  },
  alternates: {
    canonical: "/guides",
  },
};
