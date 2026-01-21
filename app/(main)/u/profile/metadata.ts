import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile | Real Landing",
  description:
    "Manage your Real Landing profile, view saved properties, track your inquiries, and update your account settings.",
  keywords: [
    "my profile",
    "account settings",
    "saved properties",
    "user dashboard",
    "real landing account",
    "profile management",
  ],
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "My Profile | Real Landing",
    description:
      "Manage your Real Landing profile and account settings.",
    url: "https://reallanding.com/u/profile",
  },
  alternates: {
    canonical: "https://reallanding.com/u/profile",
  },
};
