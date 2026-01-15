"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { OAuthProvider } from "appwrite";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/store/auth";

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, signInWithGoogle, signInWithOAuth, loading, clearError } = useAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsSubmitting(true);
    
    try {
      await signUp({ email, password, name });
      toast.success("Account created successfully!", {
        description: "Welcome! You are now signed in."
      });
      // Use router.replace to preserve React state
      router.replace("/");
    } catch (err: unknown) {
      setIsSubmitting(false);
      const errorMessage = err instanceof Error ? err.message : "Please try again with different credentials.";
      toast.error("Sign up failed", {
        description: errorMessage
      });
    }
  };

  const handleGoogleLogin = () => {
    toast.info("Redirecting to Google...", {
      description: "Please complete the sign up process."
    });
    signInWithGoogle();
  };

  const handleFacebookLogin = () => {
    toast.info("Redirecting to Facebook...", {
      description: "Please complete the sign up process."
    });
    signInWithOAuth(OAuthProvider.Facebook);
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground">Create Account</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Get started with your free account today.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="h-11 rounded-full px-4"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            className="h-11 rounded-full px-4"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="h-11 rounded-full px-4"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="terms" required />
          <Label htmlFor="terms" className="text-sm font-normal">
            I agree to the{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </Label>
        </div>

        <Button type="submit" size="md" className="w-full rounded-full" disabled={loading || isSubmitting}>
          {loading || isSubmitting ? "Creating account..." : "Sign up"}
        </Button>
      </form>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            size="md"
            className="rounded-full"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115z"
              />
              <path
                fill="#34A853"
                d="M16.04 18.013c-1.09.593-2.325.918-3.626.918-3.15 0-5.87-2.145-6.837-5.053l-4.088 3.161c1.983 3.905 6.014 6.51 10.635 6.51 2.827 0 5.422-.977 7.464-2.618l-3.547-2.918z"
              />
              <path
                fill="#4A90E2"
                d="M23.49 12.275c0-.85-.09-1.397-.282-1.996h-11.21v4.305h6.464c-.288 1.618-1.19 3.003-2.544 3.918l3.547 2.918c2.114-1.928 3.325-4.782 3.325-8.145z"
              />
              <path
                fill="#FBBC05"
                d="M5.577 13.877c-.23-.695-.36-1.432-.36-2.202s.13-1.507.36-2.202l-4.026-3.115C.548 8.18.136 9.75.136 11.4c0 1.65.412 3.22 1.254 4.636l4.187-3.159z"
              />
            </svg>
            Google
          </Button>

          <Button
            type="button"
            variant="outline"
            size="md"
            className="rounded-full"
            onClick={handleFacebookLogin}
            disabled={loading}
          >
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
            Facebook
          </Button>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="font-semibold text-primary hover:opacity-80 transition-opacity"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
