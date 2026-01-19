"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { avatars } from "@/services/appwrite";
import { useAuth } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOutIcon, UserIcon, SettingsIcon, MenuIcon, ChevronDownIcon, HomeIcon, BuildingIcon, DollarSignIcon, UsersIcon, SearchIcon, KeyIcon } from "lucide-react";

type MegaMenuType = "properties" | "agents" | "services" | null;

export function Header() {
  const [activeMenu, setActiveMenu] = useState<MegaMenuType>(null);
  const [mounted, setMounted] = useState(false);

  // Use the new auth hook
  const { user, isAuthenticated, loading, signOut } = useAuth();

  // Check if user is an agent or agency
  const isAgentOrAgency = user?.labels?.some(
    (label) => label === "agent" || label === "agency"
  ) ?? false;

  // Get the appropriate profile route based on user role
  const profileRoute = isAgentOrAgency ? "/profile" : "/u/profile";

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleMenuEnter = (menu: MegaMenuType) => {
    setActiveMenu(menu);
  };

  const handleMenuLeave = () => {
    setActiveMenu(null);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b" onMouseLeave={handleMenuLeave}>
      <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">RL</span>
          </div>
          <span className="font-bold text-xl">Real Landing</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="text-foreground/60 hover:text-foreground transition-colors">
            Home
          </Link>

          {/* Properties */}
          <button
            className="flex items-center space-x-1 text-foreground/60 hover:text-foreground transition-colors cursor-pointer"
            onMouseEnter={() => handleMenuEnter("properties")}
          >
            <span>Properties</span>
            <ChevronDownIcon className={`h-3 w-3 transition-transform duration-200 ${activeMenu === "properties" ? "rotate-180" : ""}`} />
          </button>

          {/* Agents */}
          <button
            className="flex items-center space-x-1 text-foreground/60 hover:text-foreground transition-colors cursor-pointer"
            onMouseEnter={() => handleMenuEnter("agents")}
          >
            <span>Agents</span>
            <ChevronDownIcon className={`h-3 w-3 transition-transform duration-200 ${activeMenu === "agents" ? "rotate-180" : ""}`} />
          </button>

          {/* Services */}
          <button
            className="flex items-center space-x-1 text-foreground/60 hover:text-foreground transition-colors cursor-pointer"
            onMouseEnter={() => handleMenuEnter("services")}
          >
            <span>Services</span>
            <ChevronDownIcon className={`h-3 w-3 transition-transform duration-200 ${activeMenu === "services" ? "rotate-180" : ""}`} />
          </button>

          <Link
            href="/blogs"
            className="text-foreground/60 hover:text-foreground transition-colors"
            onMouseEnter={handleMenuLeave}
          >
            Blog
          </Link>
          <Link
            href="/about"
            className="text-foreground/60 hover:text-foreground transition-colors"
            onMouseEnter={handleMenuLeave}
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-foreground/60 hover:text-foreground transition-colors"
            onMouseEnter={handleMenuLeave}
          >
            Contact
          </Link>
        </nav>

        {/* Auth Section */}
        <div className="flex items-center space-x-4" onMouseEnter={handleMenuLeave}>
          {!mounted || loading ? (
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          ) : isAuthenticated && user ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full cursor-pointer">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={avatars.getInitials(user.name || user.email, 40, 40).toString()}
                      alt={user.name || user.email}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
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
                  <Link href={profileRoute} className="flex items-center">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile/settings" className="flex items-center">
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="flex items-center">
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mounted && (
          <div className="lg:hidden">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MenuIcon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" align="end">
                <DropdownMenuItem asChild>
                  <Link href="/">Home</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/properties">Properties</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/agents">Agents</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/services">Services</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/blogs">Blog</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/about">About</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/contact">Contact</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/terms">Terms</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/privacy">Privacy</Link>
                </DropdownMenuItem>
                {!isAuthenticated && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/signin">Sign In</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/signup">Sign Up</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Mega Menu - Properties */}
      {activeMenu === "properties" && (
        <div
          className="fixed left-0 right-0 top-16 w-full bg-white border-b shadow-lg z-40 animate-in fade-in slide-in-from-top-2 duration-200 ease-out"
          onMouseEnter={() => handleMenuEnter("properties")}
          onMouseLeave={handleMenuLeave}
        >
          <div className="container mx-auto max-w-7xl px-4 py-8">
            <div className="grid grid-cols-4 gap-8">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Property Types</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/properties?type=residential" className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors">
                      <HomeIcon className="h-4 w-4" />
                      <span>Residential</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/properties?type=commercial" className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors">
                      <BuildingIcon className="h-4 w-4" />
                      <span>Commercial</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/properties?type=luxury" className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors">
                      <KeyIcon className="h-4 w-4" />
                      <span>Luxury</span>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Browse</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/properties" className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors">
                      <SearchIcon className="h-4 w-4" />
                      <span>All Properties</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/properties?status=for-sale" className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors">
                      <DollarSignIcon className="h-4 w-4" />
                      <span>For Sale</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/properties?status=for-rent" className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors">
                      <HomeIcon className="h-4 w-4" />
                      <span>For Rent</span>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">By Location</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/properties?location=downtown" className="text-gray-600 hover:text-primary transition-colors">
                      Downtown
                    </Link>
                  </li>
                  <li>
                    <Link href="/properties?location=suburbs" className="text-gray-600 hover:text-primary transition-colors">
                      Suburbs
                    </Link>
                  </li>
                  <li>
                    <Link href="/properties?location=waterfront" className="text-gray-600 hover:text-primary transition-colors">
                      Waterfront
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Tools</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/search" className="text-gray-600 hover:text-primary transition-colors">
                      Advanced Search
                    </Link>
                  </li>
                  <li>
                    <Link href="/mortgage-calculator" className="text-gray-600 hover:text-primary transition-colors">
                      Mortgage Calculator
                    </Link>
                  </li>
                  <li>
                    <Link href="/market-trends" className="text-gray-600 hover:text-primary transition-colors">
                      Market Trends
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mega Menu - Agents */}
      {activeMenu === "agents" && (
        <div
          className="fixed left-0 right-0 top-16 w-full bg-white border-b shadow-lg z-40 animate-in fade-in slide-in-from-top-2 duration-200 ease-out"
          onMouseEnter={() => handleMenuEnter("agents")}
          onMouseLeave={handleMenuLeave}
        >
          <div className="container mx-auto max-w-7xl px-4 py-8">
            <div className="grid grid-cols-3 gap-8">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Find an Agent</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/agents" className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors">
                      <UsersIcon className="h-4 w-4" />
                      <span>All Agents</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/agents?specialty=residential" className="text-gray-600 hover:text-primary transition-colors">
                      Residential Specialists
                    </Link>
                  </li>
                  <li>
                    <Link href="/agents?specialty=commercial" className="text-gray-600 hover:text-primary transition-colors">
                      Commercial Experts
                    </Link>
                  </li>
                  <li>
                    <Link href="/agents?specialty=luxury" className="text-gray-600 hover:text-primary transition-colors">
                      Luxury Specialists
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Services</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/agents?service=buying" className="text-gray-600 hover:text-primary transition-colors">
                      Buyer Representation
                    </Link>
                  </li>
                  <li>
                    <Link href="/agents?service=selling" className="text-gray-600 hover:text-primary transition-colors">
                      Seller Representation
                    </Link>
                  </li>
                  <li>
                    <Link href="/agents?service=investment" className="text-gray-600 hover:text-primary transition-colors">
                      Investment Consulting
                    </Link>
                  </li>
                  <li>
                    <Link href="/agents?service=relocation" className="text-gray-600 hover:text-primary transition-colors">
                      Relocation Services
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Join Our Team</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/careers" className="text-gray-600 hover:text-primary transition-colors">
                      Career Opportunities
                    </Link>
                  </li>
                  <li>
                    <Link href="/agent-application" className="text-gray-600 hover:text-primary transition-colors">
                      Become an Agent
                    </Link>
                  </li>
                  <li>
                    <Link href="/training" className="text-gray-600 hover:text-primary transition-colors">
                      Agent Training
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mega Menu - Services */}
      {activeMenu === "services" && (
        <div
          className="fixed left-0 right-0 top-16 w-full bg-white border-b shadow-lg z-40 animate-in fade-in slide-in-from-top-2 duration-200 ease-out"
          onMouseEnter={() => handleMenuEnter("services")}
          onMouseLeave={handleMenuLeave}
        >
          <div className="container mx-auto max-w-7xl px-4 py-8">
            <div className="grid grid-cols-4 gap-8">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Buying Services</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/services/property-search" className="text-gray-600 hover:text-primary transition-colors">
                      Property Search
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/buyer-representation" className="text-gray-600 hover:text-primary transition-colors">
                      Buyer Representation
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/home-inspection" className="text-gray-600 hover:text-primary transition-colors">
                      Home Inspection
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/financing" className="text-gray-600 hover:text-primary transition-colors">
                      Financing Assistance
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Selling Services</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/services/property-valuation" className="text-gray-600 hover:text-primary transition-colors">
                      Property Valuation
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/home-staging" className="text-gray-600 hover:text-primary transition-colors">
                      Home Staging
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/marketing" className="text-gray-600 hover:text-primary transition-colors">
                      Marketing Services
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/seller-representation" className="text-gray-600 hover:text-primary transition-colors">
                      Seller Representation
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Investment Services</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/services/investment-consulting" className="text-gray-600 hover:text-primary transition-colors">
                      Investment Consulting
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/property-management" className="text-gray-600 hover:text-primary transition-colors">
                      Property Management
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/portfolio-analysis" className="text-gray-600 hover:text-primary transition-colors">
                      Portfolio Analysis
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/market-research" className="text-gray-600 hover:text-primary transition-colors">
                      Market Research
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Additional Services</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/services/legal-support" className="text-gray-600 hover:text-primary transition-colors">
                      Legal Support
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/relocation" className="text-gray-600 hover:text-primary transition-colors">
                      Relocation Services
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/commercial" className="text-gray-600 hover:text-primary transition-colors">
                      Commercial Real Estate
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/consultation" className="text-gray-600 hover:text-primary transition-colors">
                      Free Consultation
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
