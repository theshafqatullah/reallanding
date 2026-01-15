"use client";

import React from "react";
import { GuestGuard } from "@/store/auth";
import { Spinner } from "@/components/ui/spinner";
import { Toaster } from "@/components/ui/sonner";
import { AuthHydrator } from "@/components/auth/auth-hydrator";

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

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthHydrator>
      <GuestGuard redirectTo="/" fallback={<LoadingFallback />}>
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            {children}
          </div>
        </div>
        <Toaster richColors position="top-right" />
      </GuestGuard>
    </AuthHydrator>
  );
}
