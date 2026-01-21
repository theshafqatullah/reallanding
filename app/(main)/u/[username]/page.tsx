import { Metadata } from "next";
import { databases } from "@/services/appwrite";
import { Query } from "appwrite";
import UserProfileClient from "./user-profile-client";

const DATABASE_ID = "main";
const USERS_COLLECTION_ID = "users";

interface PageProps {
  params: Promise<{ username: string }>;
}

async function getUser(username: string) {
  try {
    const decodedUsername = decodeURIComponent(username);
    
    const response = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal("username", decodedUsername), Query.limit(1)]
    );

    if (response.documents.length > 0) {
      return response.documents[0];
    }

    return null;
  } catch (error) {
    console.error("Error fetching user for metadata:", error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const user = await getUser(username);

  if (!user) {
    return {
      title: "User Not Found | Real Landing",
      description: "The user profile you are looking for could not be found.",
    };
  }

  const displayName = user.full_name || user.display_name || username;
  const title = user.professional_title 
    ? `${displayName} - ${user.professional_title}`
    : displayName;
  
  const description = user.bio || user.about_me || 
    `View ${displayName}'s profile on Real Landing. ${user.user_type === "agent" ? "Real estate agent" : "Property enthusiast"} ${user.city?.name ? `in ${user.city.name}` : ""}`;

  return {
    title: `${title} | Real Landing`,
    description: description.substring(0, 160),
    keywords: [
      displayName,
      user.professional_title || "",
      user.user_type || "user",
      user.city?.name || "",
      "real estate agent",
      "property agent",
      "real landing",
    ].filter(Boolean),
    openGraph: {
      title: title,
      description: description.substring(0, 160),
      url: `https://reallanding.com/u/${username}`,
      type: "profile",
      images: [
        {
          url: user.profile_image_url || user.avatar_url || "/og-profile.jpg",
          width: 400,
          height: 400,
          alt: displayName,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: title,
      description: description.substring(0, 160),
      images: [user.profile_image_url || user.avatar_url || "/og-profile.jpg"],
    },
    alternates: {
      canonical: `https://reallanding.com/u/${username}`,
    },
  };
}

export default function UserProfilePage() {
  return <UserProfileClient />;
}
