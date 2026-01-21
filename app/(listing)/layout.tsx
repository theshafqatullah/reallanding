import { Metadata } from "next";
import ListingLayoutClient from "./layout-client";

export const metadata: Metadata = {
  title: {
    default: "Create Property Listing | Real Landing",
    template: "%s | Real Landing",
  },
  description:
    "List your property for sale or rent on Real Landing. Our easy-to-use listing form helps you create professional property ads that attract buyers and tenants.",
  keywords: [
    "property listing",
    "list property",
    "sell property",
    "rent property",
    "post property ad",
    "real estate listing",
    "property for sale",
    "property for rent",
  ],
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Create Property Listing | Real Landing",
    description:
      "List your property for sale or rent on Real Landing and reach thousands of potential buyers and tenants.",
    url: "https://reallanding.com/listing/create",
    type: "website",
  },
};

export default function ListingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ListingLayoutClient>{children}</ListingLayoutClient>;
}
