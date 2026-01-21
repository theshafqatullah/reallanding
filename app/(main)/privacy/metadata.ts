import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - How We Protect Your Data",
  description:
    "Read Real Landing's Privacy Policy. Learn how we collect, use, and protect your personal information. Your privacy and data security are our top priorities.",
  keywords: [
    "privacy policy",
    "data protection",
    "personal information",
    "cookies policy",
    "data security",
    "user privacy",
    "GDPR",
    "data rights",
  ],
  openGraph: {
    title: "Privacy Policy | Real Landing",
    description:
      "Learn how Real Landing collects, uses, and protects your personal information. Your privacy is our priority.",
    url: "/privacy",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | Real Landing",
    description:
      "Learn how Real Landing collects, uses, and protects your personal information. Your privacy is our priority.",
  },
  alternates: {
    canonical: "/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
};
