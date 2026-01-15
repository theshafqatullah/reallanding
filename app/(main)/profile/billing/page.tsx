"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  CreditCard,
  Check,
  Crown,
  Zap,
  Star,
  Building2,
  Download,
  ExternalLink,
} from "lucide-react";

// Mock billing data
const MOCK_CURRENT_PLAN = {
  name: "Free",
  price: 0,
  listingsLimit: 3,
  listingsUsed: 2,
  featuredLimit: 0,
  featuredUsed: 0,
  features: [
    "Up to 3 listings",
    "Basic analytics",
    "Email support",
  ],
};

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    description: "Perfect for getting started",
    features: [
      "Up to 3 listings",
      "Basic analytics",
      "Email support",
      "Standard listing visibility",
    ],
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 2999,
    description: "For individual agents",
    features: [
      "Up to 25 listings",
      "Advanced analytics",
      "Priority support",
      "2 featured listings/month",
      "Verified badge",
      "Social media integration",
    ],
    popular: true,
  },
  {
    id: "agency",
    name: "Agency",
    price: 9999,
    description: "For real estate agencies",
    features: [
      "Unlimited listings",
      "Team management",
      "Dedicated account manager",
      "10 featured listings/month",
      "API access",
      "White-label options",
      "Custom branding",
    ],
    popular: false,
  },
];

const MOCK_INVOICES = [
  {
    id: "INV-001",
    date: "2026-01-01",
    amount: 2999,
    status: "paid",
  },
  {
    id: "INV-002",
    date: "2025-12-01",
    amount: 2999,
    status: "paid",
  },
  {
    id: "INV-003",
    date: "2025-11-01",
    amount: 2999,
    status: "paid",
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
  }).format(price);
}

export default function BillingPage() {
  const [currentPlan] = useState(MOCK_CURRENT_PLAN);

  const usagePercentage =
    (currentPlan.listingsUsed / currentPlan.listingsLimit) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>

      {/* Current Plan */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Crown className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Current Plan</h2>
              <p className="text-sm text-muted-foreground">
                You are on the {currentPlan.name} plan
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="w-fit">
            {currentPlan.name}
          </Badge>
        </div>

        {/* Usage */}
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Listings Used</span>
              <span className="text-sm text-muted-foreground">
                {currentPlan.listingsUsed} / {currentPlan.listingsLimit}
              </span>
            </div>
            <Progress value={usagePercentage} className="h-2" />
          </div>

          {usagePercentage >= 80 && (
            <p className="text-sm text-yellow-600 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              You&apos;re running low on listings. Consider upgrading your plan.
            </p>
          )}
        </div>
      </Card>

      {/* Plans */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Available Plans</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={`p-6 relative ${
                plan.popular ? "border-primary shadow-lg" : ""
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-2 right-4 bg-primary">
                  Most Popular
                </Badge>
              )}

              <div className="mb-4">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <span className="text-3xl font-bold">
                  {plan.price === 0 ? "Free" : formatPrice(plan.price)}
                </span>
                {plan.price > 0 && (
                  <span className="text-muted-foreground">/month</span>
                )}
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={
                  currentPlan.name === plan.name
                    ? "secondary"
                    : plan.popular
                      ? "default"
                      : "outline"
                }
                disabled={currentPlan.name === plan.name}
              >
                {currentPlan.name === plan.name
                  ? "Current Plan"
                  : plan.price === 0
                    ? "Downgrade"
                    : "Upgrade"}
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <CreditCard className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">Payment Method</h2>
            <p className="text-sm text-muted-foreground">
              Manage your payment information
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="h-10 w-16 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">VISA</span>
            </div>
            <div>
              <p className="font-medium">•••• •••• •••• 4242</p>
              <p className="text-sm text-muted-foreground">Expires 12/2027</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Update
          </Button>
        </div>
      </Card>

      {/* Billing History */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">Billing History</h2>
            <p className="text-sm text-muted-foreground">
              Download your past invoices
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-muted-foreground border-b">
                <th className="pb-3 font-medium">Invoice</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {MOCK_INVOICES.map((invoice) => (
                <tr key={invoice.id} className="border-b last:border-0">
                  <td className="py-4 font-medium">{invoice.id}</td>
                  <td className="py-4 text-muted-foreground">
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td className="py-4">{formatPrice(invoice.amount)}</td>
                  <td className="py-4">
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700"
                    >
                      Paid
                    </Badge>
                  </td>
                  <td className="py-4">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Need Help */}
      <Card className="p-6 bg-muted/50">
        <div className="flex items-center gap-4">
          <Star className="h-8 w-8 text-primary" />
          <div className="flex-1">
            <h3 className="font-semibold">Need a custom plan?</h3>
            <p className="text-sm text-muted-foreground">
              Contact our sales team for enterprise pricing and custom solutions.
            </p>
          </div>
          <Button variant="outline">
            Contact Sales
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
