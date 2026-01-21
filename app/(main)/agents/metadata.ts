import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Real Estate Agents - Expert Property Professionals",
  description:
    "Connect with top-rated real estate agents near you. Browse verified professionals specializing in residential, commercial, luxury, and investment properties. Get expert guidance for buying or selling.",
  keywords: [
    "real estate agents",
    "property agents",
    "realtors",
    "find agents",
    "local agents",
    "top rated agents",
    "real estate professionals",
    "buying agent",
    "selling agent",
    "luxury real estate agent",
    "commercial real estate agent",
  ],
  openGraph: {
    title: "Find Expert Real Estate Agents | Real Landing",
    description:
      "Connect with top-rated, verified real estate agents. Find specialists in residential, commercial, luxury, and investment properties near you.",
    url: "/agents",
    type: "website",
    images: [
      {
        url: "/og-agents.jpg",
        width: 1200,
        height: 630,
        alt: "Real Landing Real Estate Agents",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Find Expert Real Estate Agents | Real Landing",
    description:
      "Connect with top-rated, verified real estate agents. Find specialists in residential, commercial, luxury, and investment properties.",
  },
  alternates: {
    canonical: "/agents",
  },
};
