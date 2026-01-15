"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2Icon, HomeIcon, PlusIcon, EyeIcon } from "lucide-react";

export default function ListingSuccessPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full text-center">
        <CardContent className="pt-8 pb-6 px-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2Icon className="h-10 w-10 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">
            Listing Created Successfully!
          </h1>
          
          <p className="text-muted-foreground mb-8">
            Your property listing has been submitted and is pending review. 
            We&apos;ll notify you once it&apos;s approved.
          </p>

          <div className="space-y-3">
            <Button asChild className="w-full" size="lg">
              <Link href="/properties">
                <EyeIcon className="mr-2 h-4 w-4" />
                View All Properties
              </Link>
            </Button>

            <Button asChild variant="outline" className="w-full" size="lg">
              <Link href="/listing/create">
                <PlusIcon className="mr-2 h-4 w-4" />
                Create Another Listing
              </Link>
            </Button>

            <Button asChild variant="ghost" className="w-full" size="lg">
              <Link href="/">
                <HomeIcon className="mr-2 h-4 w-4" />
                Go to Homepage
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
