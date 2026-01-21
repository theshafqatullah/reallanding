import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Our Story, Mission & Team",
  description:
    "Learn about Real Landing's journey since 2010. Discover our mission to transform real estate, meet our expert team, and see why 25,000+ clients trust us with their property needs.",
  keywords: [
    "about real landing",
    "real estate company",
    "property platform",
    "real estate team",
    "our story",
    "company history",
    "real estate mission",
    "trusted real estate",
  ],
  openGraph: {
    title: "About Real Landing - Redefining Real Estate Since 2010",
    description:
      "Discover our mission, meet our team, and learn why over 25,000 clients trust Real Landing for their property needs. 15+ years of excellence in real estate.",
    url: "/about",
    type: "website",
    images: [
      {
        url: "/og-about.jpg",
        width: 1200,
        height: 630,
        alt: "About Real Landing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Real Landing - Redefining Real Estate Since 2010",
    description:
      "Discover our mission, meet our team, and learn why over 25,000 clients trust Real Landing for their property needs.",
  },
  alternates: {
    canonical: "/about",
  },
};
