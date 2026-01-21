import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Get in Touch with Our Team",
  description:
    "Have questions about buying, selling, or renting property? Contact Real Landing today. Reach our support team via phone, email, or live chat. We're here to help 24/7.",
  keywords: [
    "contact real landing",
    "real estate help",
    "property support",
    "customer service",
    "get in touch",
    "real estate inquiries",
    "property questions",
    "office locations",
    "support team",
  ],
  openGraph: {
    title: "Contact Real Landing - We're Here to Help",
    description:
      "Get in touch with our expert team. Whether you're buying, selling, or renting, we're here to help 24/7. Call, email, or chat with us today.",
    url: "/contact",
    type: "website",
    images: [
      {
        url: "/og-contact.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Real Landing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Real Landing - We're Here to Help",
    description:
      "Get in touch with our expert team. Whether you're buying, selling, or renting, we're here to help 24/7.",
  },
  alternates: {
    canonical: "/contact",
  },
};
