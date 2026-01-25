import AdsClient from "./ads-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Ads & Promotions | RealLanding",
    description: "Promote your property listings with featured ads, boost visibility, and reach more potential buyers.",
};

export const dynamic = 'force-dynamic';

export default function AdsPage() {
    return <AdsClient />;
}
