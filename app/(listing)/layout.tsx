"use client";

import React from "react";
import { ListingStepsHeader } from "@/components/listing/listing-steps-header";
import { AuthGuard } from "@/store/auth";
import { AuthHydrator } from "@/components/auth/auth-hydrator";
import { Spinner } from "@/components/ui/spinner";
import { Toaster } from "@/components/ui/sonner";

function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <Spinner className="w-8 h-8 mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

export default function ListingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthHydrator>
      <AuthGuard redirectTo="/signin" fallback={<LoadingFallback />}>
        <div className="min-h-screen bg-gray-50">
          <ListingStepsHeader />
          <main className="container mx-auto max-w-5xl px-4 py-8">
            {children}
          </main>
          <Toaster richColors position="top-right" />
        </div>
      </AuthGuard>
    </AuthHydrator>
  );
}
