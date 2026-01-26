"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    showText?: boolean;
    size?: "sm" | "md" | "lg";
    href?: string;
}

export function Logo({ className, showText = true, size = "md", href = "/" }: LogoProps) {
    const sizeClasses = {
        sm: "h-6",
        md: "h-8",
        lg: "h-10",
    };

    const textSizeClasses = {
        sm: "text-lg",
        md: "text-xl",
        lg: "text-2xl",
    };

    const content = (
        <div className={cn("flex items-center space-x-2", className)}>
            <Image
                src="/logo.svg"
                alt="Real Landing"
                width={394}
                height={181}
                className={cn(sizeClasses[size], "w-auto")}
                priority
            />
        </div>
    );

    if (href) {
        return (
            <Link href={href} className="flex items-center">
                {content}
            </Link>
        );
    }

    return content;
}

// Icon-only version for compact spaces
export function LogoIcon({ className, size = "md" }: Omit<LogoProps, "showText" | "href">) {
    const sizeClasses = {
        sm: "h-6 w-6",
        md: "h-8 w-8",
        lg: "h-10 w-10",
    };

    return (
        <div className={cn("flex items-center justify-center rounded-lg bg-primary text-primary-foreground", sizeClasses[size], className)}>
            <Image
                src="/logo.svg"
                alt="Real Landing"
                width={394}
                height={181}
                className="h-full w-auto p-0.5"
                priority
            />
        </div>
    );
}
