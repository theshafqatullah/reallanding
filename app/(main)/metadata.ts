import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Your Dream Home | Real Landing - Real Estate Platform",
  description:
    "Discover your perfect property with Real Landing. Browse thousands of verified listings for homes, apartments, and commercial properties. Real data, real brokers, real properties.",
  keywords: [
    "real estate",
    "property search",
    "buy home",
    "rent apartment",
    "houses for sale",
    "apartments for rent",
    "commercial property",
    "real estate agents",
    "property listings",
    "home buying",
    "real landing",
    "find home",
    "dream home",
    "verified properties",
  ],
  openGraph: {
    title: "Find Your Dream Home | Real Landing",
    description:
      "Discover your perfect property with Real Landing. Browse thousands of verified listings with real data, real brokers, and real properties.",
    url: "https://reallanding.com",
    type: "website",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Real Landing - Find Your Dream Home",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Find Your Dream Home | Real Landing",
    description:
      "Discover your perfect property with Real Landing. Browse thousands of verified listings with real data, real brokers, and real properties.",
    images: ["/og-home.jpg"],
  },
  alternates: {
    canonical: "https://reallanding.com",
  },
};
