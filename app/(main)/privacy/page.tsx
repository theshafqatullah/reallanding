import React from "react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      
      <div className="prose prose-gray max-w-none space-y-6">
        <p className="text-gray-600">
          Last updated: January 13, 2026
        </p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">1. Information We Collect</h2>
          <p className="text-gray-600">
            We collect information you provide directly, including name, email, phone number, and property preferences when you create an account or submit inquiries.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">2. How We Use Your Information</h2>
          <p className="text-gray-600">
            We use your information to provide and improve our services, process transactions, send notifications, and personalize your experience on our platform.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">3. Information Sharing</h2>
          <p className="text-gray-600">
            We do not sell your personal information. We may share information with property agents when you express interest in a listing, and with service providers who assist our operations.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">4. Data Security</h2>
          <p className="text-gray-600">
            We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, or destruction.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">5. Cookies</h2>
          <p className="text-gray-600">
            We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can manage cookie preferences in your browser settings.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">6. Your Rights</h2>
          <p className="text-gray-600">
            You have the right to access, correct, or delete your personal data. You may also opt out of marketing communications at any time.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">7. Data Retention</h2>
          <p className="text-gray-600">
            We retain your information as long as your account is active or as needed to provide services. You may request deletion of your account at any time.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">8. Contact</h2>
          <p className="text-gray-600">
            For privacy-related questions, please contact us at privacy@example.com.
          </p>
        </section>
      </div>

      <div className="mt-12">
        <Link
          href="/signup"
          className="text-primary font-semibold hover:opacity-80 transition-opacity"
        >
          ← Back to Sign Up
        </Link>
      </div>
    </div>
  );
}
