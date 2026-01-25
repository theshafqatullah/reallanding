import { Metadata } from "next";
import InboxClient from "./inbox-client";

export const metadata: Metadata = {
    title: "Inbox | RealLanding",
    description: "Manage your conversations and property inquiries",
};

export const dynamic = "force-dynamic";

export default function InboxPage() {
    return <InboxClient />;
}
