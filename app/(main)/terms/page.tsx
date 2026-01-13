import React from "react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
      
      <div className="prose prose-gray max-w-none space-y-6">
        <p className="text-gray-600">
          Last updated: January 13, 2026
        </p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">1. Acceptance of Terms</h2>
          <p className="text-gray-600">
            By accessing and using this website, you accept and agree to be bound by the terms and conditions of this agreement.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">2. Use of Service</h2>
          <p className="text-gray-600">
            You agree to use our service only for lawful purposes and in accordance with these Terms. You are responsible for maintaining the confidentiality of your account credentials.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">3. Property Listings</h2>
          <p className="text-gray-600">
            All property listings must be accurate and truthful. Users are prohibited from posting fraudulent, misleading, or illegal property information.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">4. User Accounts</h2>
          <p className="text-gray-600">
            You are responsible for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">5. Intellectual Property</h2>
          <p className="text-gray-600">
            All content on this website, including text, graphics, logos, and images, is our property and protected by copyright laws.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">6. Limitation of Liability</h2>
          <p className="text-gray-600">
            We are not liable for any indirect, incidental, or consequential damages arising from your use of this service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">7. Changes to Terms</h2>
          <p className="text-gray-600">
            We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">8. Contact</h2>
          <p className="text-gray-600">
            For questions about these Terms, please contact us at support@example.com.
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
