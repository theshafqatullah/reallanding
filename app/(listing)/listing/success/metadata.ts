import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Listing Created Successfully | Real Landing",
  description:
    "Your property listing has been submitted successfully. View your listings or create another one.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Listing Created | Real Landing",
    description: "Your property listing has been submitted for review.",
    url: "https://reallanding.com/listing/success",
  },
  alternates: {
    canonical: "https://reallanding.com/listing/success",
  },
};
