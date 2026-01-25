import MessagesClient from "./messages-client";

export const metadata = {
    title: "Messages | RealLanding",
    description: "View and manage your conversations with real estate agents and agencies",
};

export const dynamic = 'force-dynamic';

export default function MessagesPage() {
    return <MessagesClient />;
}
