"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { avatars } from "@/services/appwrite";
import { useAuth } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    LogOutIcon,
    UserIcon,
    SettingsIcon,
    MenuIcon,
    BellIcon,
    SearchIcon,
    PlusIcon,
    HomeIcon,
    Building2,
    ChevronDownIcon,
} from "lucide-react";

export function DashboardHeader() {
    const pathname = usePathname();
    const { user, signOut } = useAuth();

    const handleSignOut = async () => {
        await signOut();
    };

    // Get current page title based on pathname
    const getPageTitle = () => {
        if (pathname === "/profile") return "Profile";
        if (pathname === "/listings") return "My Listings";
        if (pathname === "/saved") return "Saved Properties";
        if (pathname === "/inquiries") return "Inquiries";
        if (pathname === "/analytics") return "Analytics";
        if (pathname === "/settings") return "Account Settings";
        if (pathname === "/notifications") return "Notifications";
        if (pathname === "/security") return "Security";
        if (pathname === "/billing") return "Billing";
        return "Dashboard";
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b">
            <div className="flex h-16 items-center justify-between px-4 lg:px-6">
                {/* Left Section: Logo + Page Title */}
                <div className="flex items-center gap-6">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/logo.svg"
                            alt="Real Landing"
                            width={394}
                            height={181}
                            className="h-10 w-auto"
                            priority
                        />
                    </Link>

                    {/* Separator */}
                    <div className="hidden md:block h-6 w-px bg-border" />

                    {/* Current Page Title */}
                    <div className="hidden md:flex items-center">
                        <span className="text-sm font-medium">{getPageTitle()}</span>
                    </div>
                </div>

                {/* Center Section: Search (Desktop) */}
                <div className="hidden lg:flex flex-1 max-w-md mx-6">
                    <div className="relative w-full">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search listings, inquiries..."
                            className="pl-10 pr-4 w-full h-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                        />
                    </div>
                </div>

                {/* Right Section: Actions + User */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Quick Actions */}
                    <Button asChild size="sm" className="hidden sm:flex">
                        <Link href="/listing/create">
                            <PlusIcon className="h-4 w-4 mr-2" />
                            New Listing
                        </Link>
                    </Button>

                    <Button asChild size="icon" variant="ghost" className="sm:hidden">
                        <Link href="/listing/create">
                            <PlusIcon className="h-5 w-5" />
                        </Link>
                    </Button>

                    {/* Notifications */}
                    <Button variant="ghost" size="icon" className="relative">
                        <BellIcon className="h-5 w-5" />
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                    </Button>

                    {/* Back to Main Site */}
                    <Button asChild variant="ghost" size="sm" className="hidden md:flex">
                        <Link href="/">
                            <HomeIcon className="h-4 w-4 mr-2" />
                            Main Site
                        </Link>
                    </Button>

                    {/* User Menu */}
                    {user && (
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 w-9 rounded-full cursor-pointer">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage
                                            src={avatars.getInitials(user.name || user.email, 36, 36).toString()}
                                            alt={user.name || user.email}
                                        />
                                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                                            {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <div className="flex flex-col space-y-1 p-2">
                                    <p className="text-sm font-medium leading-none">
                                        {user.name || "User"}
                                    </p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user.email}
                                    </p>
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/profile" className="flex items-center">
                                        <UserIcon className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/listings" className="flex items-center">
                                        <Building2 className="mr-2 h-4 w-4" />
                                        <span>My Listings</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/settings" className="flex items-center">
                                        <SettingsIcon className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/" className="flex items-center">
                                        <HomeIcon className="mr-2 h-4 w-4" />
                                        <span>Back to Site</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleSignOut} className="flex items-center text-destructive">
                                    <LogOutIcon className="mr-2 h-4 w-4" />
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {/* Mobile Menu */}
                    <div className="lg:hidden">
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MenuIcon className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48" align="end">
                                <DropdownMenuItem asChild>
                                    <Link href="/profile">Profile</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/listings">My Listings</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/saved">Saved</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/inquiries">Inquiries</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/analytics">Analytics</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/settings">Settings</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/profile/notifications">Notifications</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/security">Security</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/billing">Billing</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/">Back to Site</Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    );
}
