"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShieldIcon,
  ScrollIcon,
  EyeIcon,
  DatabaseIcon,
  ShareIcon,
  LockIcon,
  CookieIcon,
  UserCheckIcon,
  ClockIcon,
  GlobeIcon,
  BabyIcon,
  RefreshCwIcon,
  MailIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
} from "lucide-react";

const sections = [
  {
    id: "overview",
    icon: EyeIcon,
    title: "1. Overview",
    content: [
      "Real Landing (\"we,\" \"our,\" or \"us\") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.",
      "By using Real Landing, you consent to the data practices described in this policy. If you do not agree with any part of this Privacy Policy, please do not use our services.",
      "We encourage you to read this policy carefully to understand our practices regarding your personal data.",
    ],
  },
  {
    id: "collection",
    icon: DatabaseIcon,
    title: "2. Information We Collect",
    content: [
      "We collect information you provide directly to us, including:",
      "• Personal Information: Name, email address, phone number, mailing address when you create an account or contact us",
      "• Property Preferences: Search criteria, saved properties, property alerts, and viewing history",
      "• Financial Information: Payment details when you make transactions (processed securely through our payment partners)",
      "• Communication Data: Messages, inquiries, and correspondence with agents or our support team",
      "We also automatically collect certain information when you use our services:",
      "• Device Information: IP address, browser type, operating system, device identifiers",
      "• Usage Data: Pages viewed, links clicked, search queries, time spent on pages",
      "• Location Data: General location based on IP address (precise location only with your consent)",
      "• Cookies and Tracking: Information collected through cookies and similar technologies",
    ],
  },
  {
    id: "usage",
    icon: UserCheckIcon,
    title: "3. How We Use Your Information",
    content: [
      "We use the information we collect for various purposes, including:",
      "• Providing Services: To operate, maintain, and improve our platform and services",
      "• Personalization: To personalize your experience and provide tailored property recommendations",
      "• Communications: To send you updates, newsletters, marketing materials, and respond to inquiries",
      "• Transactions: To process payments, complete transactions, and send related information",
      "• Agent Connections: To connect you with real estate agents when you express interest in properties",
      "• Analytics: To analyze usage patterns and improve our website and services",
      "• Security: To detect, prevent, and address technical issues, fraud, and security threats",
      "• Legal Compliance: To comply with legal obligations and protect our legal rights",
    ],
  },
  {
    id: "sharing",
    icon: ShareIcon,
    title: "4. Information Sharing",
    content: [
      "We do not sell your personal information to third parties. We may share your information in the following circumstances:",
      "• With Real Estate Agents: When you inquire about a property or request agent contact",
      "• With Service Providers: Third-party vendors who perform services on our behalf (hosting, analytics, payment processing)",
      "• With Business Partners: Mortgage lenders, insurance providers, and other partners when you request their services",
      "• For Legal Reasons: When required by law, court order, or to protect our rights and safety",
      "• Business Transfers: In connection with a merger, acquisition, or sale of assets",
      "• With Your Consent: When you have given us explicit permission to share your information",
      "All third parties are required to maintain the confidentiality of your information and use it only for the purposes specified.",
    ],
  },
  {
    id: "cookies",
    icon: CookieIcon,
    title: "5. Cookies and Tracking Technologies",
    content: [
      "We use cookies and similar tracking technologies to collect and store information about your interactions with our platform.",
      "Types of cookies we use:",
      "• Essential Cookies: Required for the website to function properly (authentication, security)",
      "• Analytics Cookies: Help us understand how visitors interact with our website",
      "• Preference Cookies: Remember your settings and preferences",
      "• Marketing Cookies: Track your activity for targeted advertising purposes",
      "You can control cookies through your browser settings. However, disabling certain cookies may limit your ability to use some features of our website.",
      "We also use web beacons, pixel tags, and similar technologies to track email opens and website activity.",
    ],
  },
  {
    id: "security",
    icon: LockIcon,
    title: "6. Data Security",
    content: [
      "We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction.",
      "Security measures include:",
      "• SSL/TLS encryption for data transmission",
      "• Encrypted storage of sensitive information",
      "• Regular security audits and vulnerability assessments",
      "• Access controls limiting employee access to personal data",
      "• Secure data centers with physical and logical security",
      "While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security of your data.",
    ],
  },
  {
    id: "rights",
    icon: UserCheckIcon,
    title: "7. Your Rights",
    content: [
      "Depending on your location, you may have the following rights regarding your personal data:",
      "• Access: Request a copy of the personal information we hold about you",
      "• Correction: Request correction of inaccurate or incomplete information",
      "• Deletion: Request deletion of your personal data (subject to certain exceptions)",
      "• Portability: Receive your data in a structured, commonly used format",
      "• Opt-Out: Unsubscribe from marketing communications at any time",
      "• Restriction: Request limitation of processing in certain circumstances",
      "• Objection: Object to processing based on legitimate interests",
      "To exercise these rights, please contact us using the information provided below. We will respond to your request within 30 days.",
    ],
  },
  {
    id: "retention",
    icon: ClockIcon,
    title: "8. Data Retention",
    content: [
      "We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.",
      "Retention periods:",
      "• Account Information: As long as your account is active, plus 3 years after deletion",
      "• Transaction Records: 7 years for tax and legal compliance purposes",
      "• Communication Records: 2 years from the date of communication",
      "• Analytics Data: 26 months in aggregated, anonymized form",
      "You may request deletion of your account at any time. Some information may be retained as required by law or for legitimate business purposes.",
    ],
  },
  {
    id: "international",
    icon: GlobeIcon,
    title: "9. International Data Transfers",
    content: [
      "Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws.",
      "When we transfer data internationally, we ensure appropriate safeguards are in place, including:",
      "• Standard Contractual Clauses approved by relevant authorities",
      "• Certification under recognized privacy frameworks",
      "• Binding Corporate Rules where applicable",
      "By using our services, you consent to the transfer of your information to countries outside your country of residence.",
    ],
  },
  {
    id: "children",
    icon: BabyIcon,
    title: "10. Children's Privacy",
    content: [
      "Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children.",
      "If we become aware that we have collected personal information from a child under 18, we will take steps to delete that information promptly.",
      "If you believe we have collected information from a child, please contact us immediately.",
    ],
  },
  {
    id: "thirdparty",
    icon: ShareIcon,
    title: "11. Third-Party Links",
    content: [
      "Our website may contain links to third-party websites, services, or applications that are not operated by us.",
      "We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.",
      "We encourage you to review the privacy policy of every site you visit.",
    ],
  },
  {
    id: "changes",
    icon: RefreshCwIcon,
    title: "12. Changes to This Policy",
    content: [
      "We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons.",
      "We will notify you of any material changes by:",
      "• Posting the updated policy on our website",
      "• Updating the \"Last Updated\" date at the top of this page",
      "• Sending an email notification for significant changes",
      "We encourage you to review this Privacy Policy periodically. Your continued use of our services after changes indicates acceptance of the updated policy.",
    ],
  },
  {
    id: "contact",
    icon: MailIcon,
    title: "13. Contact Us",
    content: [
      "If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:",
      "• Privacy Officer Email: privacy@reallanding.com",
      "• General Inquiries: support@reallanding.com",
      "• Phone: +1 (555) 123-4567",
      "• Mailing Address: 123 Real Estate Avenue, New York, NY 10001",
      "We aim to respond to all privacy-related inquiries within 30 days.",
    ],
  },
];

const tableOfContents = sections.map((section) => ({
  id: section.id,
  title: section.title,
}));

const keyPoints = [
  "We collect information you provide and data about how you use our services",
  "We never sell your personal information to third parties",
  "You have rights to access, correct, and delete your data",
  "We use industry-standard security measures to protect your information",
];

export default function PrivacyPage() {
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
              <ShieldIcon className="h-4 w-4 mr-2" />
              Your Privacy Matters
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Privacy Policy
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-4">
              We are committed to protecting your privacy and ensuring the security of your 
              personal information. This policy explains how we handle your data.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-primary-foreground/70">
              <ClockIcon className="h-4 w-4" />
              <span>Last updated: January 14, 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key Points Summary */}
      <section className="py-12 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <Card className="p-6 md:p-8 border border-border shadow-none bg-secondary">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5 text-primary" />
              Key Points
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {keyPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{point}</span>
                </div>
              ))}
            </div>
          </Card>
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
                  <h3 className="font-semibold text-foreground mb-2">Privacy Questions?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Our privacy team is here to help with any concerns.
                  </p>
                  <Button size="sm" className="w-full rounded-full" asChild>
                    <Link href="/contact">
                      Contact Privacy Team
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
                      href="/terms"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      Terms of Service
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
