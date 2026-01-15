"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/store/auth";

export default function ForgotPasswordPage() {
  const { requestPasswordRecovery, loading, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      const redirectUrl = typeof window !== "undefined" 
        ? `${window.location.origin}/reset-password` 
        : "/reset-password";
      await requestPasswordRecovery({ email, redirectUrl });
      setEmailSent(true);
      toast.success("Reset email sent!", {
        description: `A password reset link has been sent to ${email}.`
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Please check your email address and try again.";
      toast.error("Failed to send reset email", {
        description: errorMessage
      });
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground">
          {emailSent ? "Check your email" : "Forgot Password"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {emailSent 
            ? "We've sent a password reset link to your email address."
            : "Enter your email to receive a reset link."
          }
        </p>
      </div>

      {!emailSent ? (
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <Button type="submit" size="md" className="w-full rounded-full" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      ) : (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">
            Didn't receive the email? Check your spam folder or{" "}
            <button 
              onClick={() => setEmailSent(false)}
              className="text-primary hover:underline font-semibold"
            >
              try again
            </button>
          </p>
        </div>
      )}

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Remember your password?{" "}
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
