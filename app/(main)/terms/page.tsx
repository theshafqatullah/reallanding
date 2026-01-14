"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileTextIcon,
  ScrollIcon,
  ShieldCheckIcon,
  UsersIcon,
  HomeIcon,
  AlertCircleIcon,
  ScaleIcon,
  MailIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  BookOpenIcon,
  ArrowLeftIcon,
} from "lucide-react";

const sections = [
  {
    id: "acceptance",
    icon: CheckCircleIcon,
    title: "1. Acceptance of Terms",
    content: [
      "By accessing and using Real Landing's website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.",
      "If you do not agree with any part of these terms, you must not use our services. These terms apply to all visitors, users, and others who access or use our platform.",
      "We reserve the right to update these terms at any time. Your continued use of the service after changes constitutes acceptance of the modified terms.",
    ],
  },
  {
    id: "eligibility",
    icon: UsersIcon,
    title: "2. Eligibility",
    content: [
      "You must be at least 18 years old to use our services. By using Real Landing, you represent and warrant that you are of legal age to form a binding contract.",
      "If you are using our services on behalf of a business or other entity, you represent that you have the authority to bind that entity to these terms.",
      "We reserve the right to refuse service, terminate accounts, or cancel orders at our sole discretion.",
    ],
  },
  {
    id: "accounts",
    icon: ShieldCheckIcon,
    title: "3. User Accounts",
    content: [
      "When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of these terms.",
      "You are responsible for safeguarding the password used to access our services and for any activities or actions under your account.",
      "You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.",
      "You may not use as a username the name of another person or entity that is not lawfully available for use, or a name that is otherwise offensive, vulgar, or obscene.",
    ],
  },
  {
    id: "listings",
    icon: HomeIcon,
    title: "4. Property Listings",
    content: [
      "All property listings must be accurate, truthful, and not misleading. Users are prohibited from posting fraudulent, deceptive, or illegal property information.",
      "Real Landing does not guarantee the accuracy of any listing information and is not responsible for verifying the details provided by property owners or agents.",
      "Property images must accurately represent the property. The use of misleading photos or virtual staging without disclosure is prohibited.",
      "We reserve the right to remove any listing that violates these terms or that we deem inappropriate at our sole discretion.",
    ],
  },
  {
    id: "conduct",
    icon: ScaleIcon,
    title: "5. Prohibited Conduct",
    content: [
      "You agree not to engage in any of the following prohibited activities:",
      "• Using our services for any unlawful purpose or in violation of any applicable laws or regulations",
      "• Posting false, inaccurate, misleading, defamatory, or libelous content",
      "• Impersonating any person or entity, or falsely stating your affiliation with a person or entity",
      "• Interfering with or disrupting our services or servers connected to our services",
      "• Attempting to gain unauthorized access to any portion of our platform or any other systems or networks",
      "• Harvesting or collecting user information without consent",
      "• Using automated means to access our services without our express permission",
    ],
  },
  {
    id: "intellectual",
    icon: BookOpenIcon,
    title: "6. Intellectual Property",
    content: [
      "All content on Real Landing, including text, graphics, logos, icons, images, audio clips, and software, is our property or the property of our licensors and is protected by copyright, trademark, and other intellectual property laws.",
      "You may not reproduce, distribute, modify, create derivative works of, publicly display, or exploit any of our content without express written permission.",
      "By submitting content to our platform, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and display such content in connection with our services.",
    ],
  },
  {
    id: "fees",
    icon: AlertCircleIcon,
    title: "7. Fees and Payments",
    content: [
      "Certain features of our services may require payment of fees. All fees are quoted in US dollars unless otherwise specified.",
      "You agree to pay all applicable fees and charges at the prices in effect at the time the charges are incurred.",
      "We reserve the right to change our fees at any time. Any fee changes will be communicated to you in advance.",
      "All payments are non-refundable unless otherwise stated or required by applicable law.",
    ],
  },
  {
    id: "disclaimers",
    icon: AlertCircleIcon,
    title: "8. Disclaimers",
    content: [
      "Our services are provided \"as is\" and \"as available\" without warranties of any kind, either express or implied.",
      "We do not warrant that our services will be uninterrupted, timely, secure, or error-free.",
      "Real Landing is a platform connecting buyers, sellers, and agents. We are not a party to any transaction between users and do not guarantee the quality, safety, or legality of properties listed.",
      "We are not responsible for the conduct of any user, whether online or offline.",
    ],
  },
  {
    id: "liability",
    icon: ScaleIcon,
    title: "9. Limitation of Liability",
    content: [
      "To the maximum extent permitted by law, Real Landing shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.",
      "Our total liability for any claims arising from or related to these terms or our services shall not exceed the amount you paid to us in the twelve months preceding the claim.",
      "Some jurisdictions do not allow limitations on implied warranties or exclusion of certain damages. In such cases, the above limitations may not apply to you.",
    ],
  },
  {
    id: "indemnification",
    icon: ShieldCheckIcon,
    title: "10. Indemnification",
    content: [
      "You agree to indemnify, defend, and hold harmless Real Landing and our officers, directors, employees, agents, and affiliates from any claims, liabilities, damages, losses, and expenses arising from:",
      "• Your use of our services",
      "• Your violation of these terms",
      "• Your violation of any rights of another party",
      "• Any content you submit to our platform",
    ],
  },
  {
    id: "termination",
    icon: AlertCircleIcon,
    title: "11. Termination",
    content: [
      "We may terminate or suspend your account and access to our services immediately, without prior notice or liability, for any reason, including breach of these terms.",
      "Upon termination, your right to use our services will immediately cease. All provisions of these terms that should survive termination shall survive.",
      "You may terminate your account at any time by contacting us or using the account deletion feature in your settings.",
    ],
  },
  {
    id: "governing",
    icon: ScaleIcon,
    title: "12. Governing Law",
    content: [
      "These terms shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law provisions.",
      "Any disputes arising from these terms or your use of our services shall be resolved exclusively in the state or federal courts located in New York County, New York.",
      "You waive any objection to the exercise of jurisdiction over you by such courts and to venue in such courts.",
    ],
  },
  {
    id: "changes",
    icon: ClockIcon,
    title: "13. Changes to Terms",
    content: [
      "We reserve the right to modify these terms at any time. We will provide notice of significant changes by posting the updated terms on our website and updating the \"Last Updated\" date.",
      "Your continued use of our services after any changes indicates your acceptance of the modified terms.",
      "We encourage you to review these terms periodically to stay informed of any updates.",
    ],
  },
  {
    id: "contact",
    icon: MailIcon,
    title: "14. Contact Information",
    content: [
      "If you have any questions about these Terms of Service, please contact us:",
      "• Email: legal@reallanding.com",
      "• Phone: +1 (555) 123-4567",
      "• Address: 123 Real Estate Avenue, New York, NY 10001",
      "We aim to respond to all inquiries within 2 business days.",
    ],
  },
];

const tableOfContents = sections.map((section) => ({
  id: section.id,
  title: section.title,
}));

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/90 via-primary to-primary/80 text-primary-foreground">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="container mx-auto max-w-7xl px-4 py-16 md:py-20 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <Badge
              variant="secondary"
              className="mb-6 bg-white/20 text-primary-foreground border-white/30 hover:bg-white/30"
            >
              <FileTextIcon className="h-4 w-4 mr-2" />
              Legal
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Terms of Service
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-4">
              Please read these terms carefully before using our services. By using Real Landing, 
              you agree to be bound by these terms and conditions.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-primary-foreground/70">
              <ClockIcon className="h-4 w-4" />
              <span>Last updated: January 14, 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {/* Sidebar - Table of Contents */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="p-6 border border-border shadow-none">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <ScrollIcon className="h-5 w-5 text-primary" />
                    Table of Contents
                  </h3>
                  <nav className="space-y-2">
                    {tableOfContents.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                      >
                        {item.title}
                      </a>
                    ))}
                  </nav>
                </Card>

                <Card className="p-6 border border-border shadow-none mt-6 bg-secondary">
                  <h3 className="font-semibold text-foreground mb-2">Need Help?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Have questions about our terms? Contact our legal team.
                  </p>
                  <Button size="sm" className="w-full rounded-full" asChild>
                    <Link href="/contact">
                      Contact Us
                      <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </Card>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <div className="space-y-12">
                {sections.map((section) => (
                  <div key={section.id} id={section.id} className="scroll-mt-24">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                        <section.icon className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold text-foreground">
                        {section.title}
                      </h2>
                    </div>
                    <div className="pl-14 space-y-4">
                      {section.content.map((paragraph, index) => (
                        <p
                          key={index}
                          className={`text-muted-foreground leading-relaxed ${
                            paragraph.startsWith("•") ? "pl-4" : ""
                          }`}
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Back Link */}
              <div className="mt-16 pt-8 border-t border-border">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <Link
                    href="/"
                    className="text-primary font-medium hover:underline flex items-center gap-2"
                  >
                    <ArrowLeftIcon className="h-4 w-4" />
                    Back to Home
                  </Link>
                  <div className="flex items-center gap-4">
                    <Link
                      href="/privacy"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      Privacy Policy
                    </Link>
                    <span className="text-muted-foreground">•</span>
                    <Link
                      href="/contact"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      Contact Us
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
