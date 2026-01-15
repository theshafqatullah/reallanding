"use client";

import React from "react";
import { Header, Footer } from "@/components/shared";
import { AuthHydrator } from "@/components/auth/auth-hydrator";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthHydrator>
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </AuthHydrator>
  );
}
