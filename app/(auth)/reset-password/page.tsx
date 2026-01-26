"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/store/auth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { confirmPasswordRecovery, loading, clearError } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  // Extract userId and secret from URL params
  const userId = searchParams.get('userId') || '';
  const secret = searchParams.get('secret') || '';

  useEffect(() => {
    if (!userId || !secret) {
      setValidationError('Invalid reset link. Please request a new password reset.');
      toast.error("Invalid reset link", {
        description: "Please request a new password reset."
      });
    }
  }, [userId, secret]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError("");

    if (password !== confirmPassword) {
      const error = "Passwords do not match";
      setValidationError(error);
      toast.error("Validation Error", { description: error });
      return;
    }

    if (password.length < 8) {
      const error = "Password must be at least 8 characters long";
      setValidationError(error);
      toast.error("Validation Error", { description: error });
      return;
    }

    if (!userId || !secret) {
      const error = "Invalid reset link. Please request a new password reset.";
      setValidationError(error);
      toast.error("Invalid Link", { description: error });
      return;
    }

    try {
      await confirmPasswordRecovery({ userId, secret, password });

      setResetSuccess(true);
      toast.success("Password reset successfully!", {
        description: "You can now sign in with your new password."
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Please try again or request a new reset link.";
      toast.error("Password reset failed", {
        description: errorMessage
      });
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <Link href="/" className="inline-block mb-6">
          <Image
            src="/logo.svg"
            alt="Real Landing"
            width={394}
            height={181}
            className="h-10 w-auto mx-auto"
            priority
          />
        </Link>
        <h2 className="text-3xl font-bold text-foreground">
          {resetSuccess ? "Password Reset Successfully" : "Reset Password"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {resetSuccess
            ? "Your password has been reset successfully."
            : "Enter your new password below."
          }
        </p>
      </div>

      {!resetSuccess ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
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

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <PasswordInput
              id="confirm-password"
              name="confirm-password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 rounded-full px-4"
            />
          </div>

          <Button
            type="submit"
            size="md"
            className="w-full rounded-full"
            disabled={loading || !userId || !secret}
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </Button>
        </form>
      ) : (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <Button
            onClick={() => router.push('/signin')}
            size="md"
            className="rounded-full"
          >
            Continue to Sign In
          </Button>
        </div>
      )}

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Back to{" "}
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
