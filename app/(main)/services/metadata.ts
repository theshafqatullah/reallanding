import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services - Complete Real Estate Solutions",
  description:
    "Discover Real Landing's comprehensive real estate services. From property search and buying assistance to selling support, property management, and investment consulting. Expert help at every step.",
  keywords: [
    "real estate services",
    "property services",
    "buying services",
    "selling services",
    "property management",
    "investment consulting",
    "legal documentation",
    "property valuation",
    "real estate consulting",
    "home buying help",
    "property selling support",
  ],
  openGraph: {
    title: "Complete Real Estate Services | Real Landing",
    description:
      "From property search to investment consulting, we offer comprehensive real estate solutions. Expert guidance for buying, selling, renting, and managing properties.",
    url: "/services",
    type: "website",
    images: [
      {
        url: "/og-services.jpg",
        width: 1200,
        height: 630,
        alt: "Real Landing Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Complete Real Estate Services | Real Landing",
    description:
      "From property search to investment consulting, we offer comprehensive real estate solutions. Expert guidance at every step.",
  },
  alternates: {
    canonical: "/services",
  },
};
