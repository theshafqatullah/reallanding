"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CheckIcon, HomeIcon, ListIcon, ImageIcon } from "lucide-react";

interface Step {
  number: number;
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    number: 1,
    title: "Basic Info",
    description: "Property type & location",
    href: "/listing/create",
    icon: <HomeIcon className="h-5 w-5" />,
  },
  {
    number: 2,
    title: "Details",
    description: "Features & amenities",
    href: "/listing/create/details",
    icon: <ListIcon className="h-5 w-5" />,
  },
  {
    number: 3,
    title: "Media & Publish",
    description: "Photos & contact info",
    href: "/listing/create/media",
    icon: <ImageIcon className="h-5 w-5" />,
  },
];

export function ListingStepsHeader() {
  const pathname = usePathname();

  const getCurrentStep = (): number => {
    if (pathname === "/listing/create") return 1;
    if (pathname === "/listing/create/details") return 2;
    if (pathname === "/listing/create/media") return 3;
    return 1;
  };

  const currentStep = getCurrentStep();

  return (
    <div className="w-full bg-white border-b sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto max-w-5xl px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Create New Listing</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Fill in the details to list your property
          </p>
        </div>

        {/* Steps */}
        <nav aria-label="Progress">
          <ol className="flex items-center">
            {steps.map((step, stepIdx) => {
              const isCompleted = step.number < currentStep;
              const isCurrent = step.number === currentStep;
              const isUpcoming = step.number > currentStep;

              return (
                <li
                  key={step.number}
                  className={cn(
                    "relative flex-1",
                    stepIdx !== steps.length - 1 && "pr-8 sm:pr-20"
                  )}
                >
                  {/* Connector Line */}
                  {stepIdx !== steps.length - 1 && (
                    <div
                      className="absolute top-5 left-0 -right-4 sm:-right-10 h-0.5"
                      aria-hidden="true"
                    >
                      <div
                        className={cn(
                          "h-full w-full",
                          isCompleted ? "bg-primary" : "bg-muted"
                        )}
                      />
                    </div>
                  )}

                  <Link
                    href={isUpcoming ? "#" : step.href}
                    className={cn(
                      "group relative flex flex-col items-center",
                      isUpcoming && "pointer-events-none"
                    )}
                  >
                    {/* Step Circle */}
                    <span
                      className={cn(
                        "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                        isCompleted &&
                          "border-primary bg-primary text-primary-foreground",
                        isCurrent &&
                          "border-primary bg-white text-primary",
                        isUpcoming &&
                          "border-muted bg-white text-muted-foreground"
                      )}
                    >
                      {isCompleted ? (
                        <CheckIcon className="h-5 w-5" />
                      ) : (
                        step.icon
                      )}
                    </span>

                    {/* Step Label */}
                    <span className="mt-3 flex flex-col items-center">
                      <span
                        className={cn(
                          "text-sm font-medium",
                          isCurrent && "text-primary",
                          isCompleted && "text-foreground",
                          isUpcoming && "text-muted-foreground"
                        )}
                      >
                        {step.title}
                      </span>
                      <span className="text-xs text-muted-foreground hidden sm:block">
                        {step.description}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}
