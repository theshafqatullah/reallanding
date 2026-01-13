"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  const { user, isAuthenticated, loading, signOut, userType } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {user.name || 'User'}!
            </h1>
            <p className="text-lg text-gray-600">
              You're successfully signed in to your account
            </p>
          </div>

          {/* User Details Card */}
          <Card className="p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Account Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <p className="text-gray-900 text-base">
                  {user.name || 'Not provided'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <p className="text-gray-900 text-base">
                  {user.email}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User ID
                </label>
                <p className="text-gray-900 text-base font-mono text-sm">
                  {user.$id}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Date
                </label>
                <p className="text-gray-900 text-base">
                  {formatDate(user.$createdAt)}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type
                </label>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  userType === 'agency' 
                    ? 'bg-purple-100 text-purple-800'
                    : userType === 'agent'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {userType === 'agency' ? 'Agency' : userType === 'agent' ? 'Agent' : 'User'}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Verification
                </label>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  user.emailVerification 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.emailVerification ? 'Verified' : 'Not Verified'}
                </span>
              </div>
            </div>

            {/* Labels/Roles */}
            {user.labels && user.labels.length > 0 && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Roles & Labels
                </label>
                <div className="flex flex-wrap gap-2">
                  {user.labels.map((label, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Preferences */}
            {user.prefs && Object.keys(user.prefs).length > 0 && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferences
                </label>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                    {JSON.stringify(user.prefs, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleSignOut} variant="outline" size="md" className="rounded-full">
              Sign Out
            </Button>
            <Button asChild size="md" className="rounded-full">
              <Link href="/profile">
                Edit Profile
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  // Not authenticated - show landing page
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Welcome to Real Landing
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Get started by signing in to your account or creating a new one.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <Button asChild className="rounded-full">
            <Link href="/signin">
              Sign In
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/signup">
              Sign Up
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
