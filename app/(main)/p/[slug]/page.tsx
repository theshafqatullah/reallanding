import { Metadata } from "next";
import { databases } from "@/services/appwrite";
import { Query } from "appwrite";
import PropertyDetailClient from "./property-detail-client";

const DATABASE_ID = "main";
const PROPERTIES_COLLECTION_ID = "properties";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProperty(slug: string) {
  try {
    const decodedSlug = decodeURIComponent(slug);
    
    // Query property by slug
    const response = await databases.listDocuments(
      DATABASE_ID,
      PROPERTIES_COLLECTION_ID,
      [Query.equal("slug", decodedSlug), Query.limit(1)]
    );

    if (response.documents.length > 0) {
      return response.documents[0];
    }

    // Try to find by reference_id as fallback
    const refResponse = await databases.listDocuments(
      DATABASE_ID,
      PROPERTIES_COLLECTION_ID,
      [Query.equal("reference_id", decodedSlug), Query.limit(1)]
    );

    if (refResponse.documents.length > 0) {
      return refResponse.documents[0];
    }

    return null;
  } catch (error) {
    console.error("Error fetching property for metadata:", error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getProperty(slug);

  if (!property) {
    return {
      title: "Property Not Found | Real Landing",
      description: "The property you are looking for could not be found.",
    };
  }

  const title = property.title;
  const description = property.short_description || property.description?.substring(0, 160) || 
    `${property.property_type?.name || "Property"} for ${property.listing_type?.name || "Sale"} in ${property.city?.name || ""}`;
  
  const price = property.price ? 
    (property.currency === "PKR" && property.price >= 10000000 
      ? `PKR ${(property.price / 10000000).toFixed(2)} Crore` 
      : property.currency === "PKR" && property.price >= 100000 
        ? `PKR ${(property.price / 100000).toFixed(2)} Lac`
        : `${property.currency} ${property.price.toLocaleString()}`) 
    : "";

  const features = [
    property.bedrooms ? `${property.bedrooms} Beds` : "",
    property.bathrooms ? `${property.bathrooms} Baths` : "",
    property.total_area ? `${property.total_area} ${property.area_unit || "sqft"}` : "",
  ].filter(Boolean).join(" | ");

  const fullDescription = `${description}. ${price ? `Price: ${price}. ` : ""}${features ? `Features: ${features}` : ""}`;

  return {
    title: `${title} | Real Landing`,
    description: fullDescription.substring(0, 160),
    keywords: [
      property.property_type?.name || "property",
      property.listing_type?.name || "sale",
      property.city?.name || "",
      property.location?.name || "",
      "real estate",
      "property for sale",
      "property for rent",
      "real landing",
    ].filter(Boolean),
    openGraph: {
      title: title,
      description: fullDescription.substring(0, 160),
      url: `https://reallanding.com/p/${slug}`,
      type: "article",
      images: [
        {
          url: property.main_image_url || property.cover_image_url || "/og-property.jpg",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: fullDescription.substring(0, 160),
      images: [property.main_image_url || property.cover_image_url || "/og-property.jpg"],
    },
    alternates: {
      canonical: `https://reallanding.com/p/${slug}`,
    },
  };
}

export default function PropertyDetailPage() {
  return <PropertyDetailClient />;
}
