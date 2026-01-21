import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Properties for Sale & Rent - Browse All Listings",
  description:
    "Explore thousands of properties for sale and rent. Filter by location, price, type, and amenities. Find homes, apartments, commercial spaces, and investment properties with Real Landing.",
  keywords: [
    "properties for sale",
    "properties for rent",
    "homes for sale",
    "apartments",
    "houses",
    "commercial property",
    "real estate listings",
    "property search",
    "buy property",
    "rent property",
    "investment properties",
    "luxury homes",
  ],
  openGraph: {
    title: "Browse Properties for Sale & Rent | Real Landing",
    description:
      "Explore thousands of verified properties. Find your perfect home, apartment, or commercial space. Advanced filters and AI-powered recommendations.",
    url: "/properties",
    type: "website",
    images: [
      {
        url: "/og-properties.jpg",
        width: 1200,
        height: 630,
        alt: "Real Landing Properties",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse Properties for Sale & Rent | Real Landing",
    description:
      "Explore thousands of verified properties. Find your perfect home, apartment, or commercial space.",
  },
  alternates: {
    canonical: "/properties",
  },
};
