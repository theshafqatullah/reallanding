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
import { LogOutIcon, UserIcon, SettingsIcon, MenuIcon, ChevronDownIcon, HomeIcon, BuildingIcon, DollarSignIcon, UsersIcon, SearchIcon, KeyIcon, MapPinIcon, TrendingUpIcon, StarIcon, ShieldCheckIcon, HeadphonesIcon, FileTextIcon, CameraIcon, CalculatorIcon, BriefcaseIcon, GlobeIcon, ArrowRightIcon, SparklesIcon, HeartIcon } from "lucide-react";

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
                  <Link href="/u/saved" className="flex items-center">
                    <HeartIcon className="mr-2 h-4 w-4" />
                    <span>Saved Properties</span>
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
          className="fixed left-0 right-0 top-16 w-full bg-white border-b shadow-xl z-40 animate-in fade-in slide-in-from-top-2 duration-200 ease-out"
          onMouseEnter={() => handleMenuEnter("properties")}
          onMouseLeave={handleMenuLeave}
        >
          <div className="container mx-auto max-w-7xl px-4 py-8">
            <div className="grid grid-cols-12 gap-8">
              {/* Property Types with Icons */}
              <div className="col-span-3 space-y-4">
                <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">Property Types</h3>
                <div className="space-y-2">
                  <Link href="/properties?type=house" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <HomeIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Houses</div>
                      <div className="text-xs text-gray-500">Single family homes</div>
                    </div>
                  </Link>
                  <Link href="/properties?type=apartment" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <BuildingIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Apartments</div>
                      <div className="text-xs text-gray-500">Urban living spaces</div>
                    </div>
                  </Link>
                  <Link href="/properties?type=condo" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                      <KeyIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Condos</div>
                      <div className="text-xs text-gray-500">Modern condominiums</div>
                    </div>
                  </Link>
                  <Link href="/properties?type=luxury" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                      <SparklesIcon className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Luxury</div>
                      <div className="text-xs text-gray-500">Premium properties</div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Browse & Status */}
              <div className="col-span-2 space-y-4">
                <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">Browse By</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/properties?status=for-sale" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
                      <DollarSignIcon className="h-4 w-4" />
                      <span>For Sale</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/properties?status=for-rent" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
                      <KeyIcon className="h-4 w-4" />
                      <span>For Rent</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/properties?status=new" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
                      <SparklesIcon className="h-4 w-4" />
                      <span>New Listings</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/properties?status=off-plan" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
                      <FileTextIcon className="h-4 w-4" />
                      <span>Off-Plan</span>
                    </Link>
                  </li>
                </ul>

                <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider pt-4">Popular Cities</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/properties?city=new-york" className="text-gray-600 hover:text-primary transition-colors text-sm">New York</Link>
                  </li>
                  <li>
                    <Link href="/properties?city=los-angeles" className="text-gray-600 hover:text-primary transition-colors text-sm">Los Angeles</Link>
                  </li>
                  <li>
                    <Link href="/properties?city=miami" className="text-gray-600 hover:text-primary transition-colors text-sm">Miami</Link>
                  </li>
                  <li>
                    <Link href="/properties?city=chicago" className="text-gray-600 hover:text-primary transition-colors text-sm">Chicago</Link>
                  </li>
                </ul>
              </div>

              {/* Featured Properties */}
              <div className="col-span-4 space-y-4">
                <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">Featured Properties</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/properties/1" className="group">
                    <div className="relative h-24 rounded-xl overflow-hidden">
                      <Image
                        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&h=200&fit=crop"
                        alt="Featured property"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="text-white text-sm font-medium">$750,000</div>
                        <div className="text-white/80 text-xs">Beverly Hills</div>
                      </div>
                    </div>
                  </Link>
                  <Link href="/properties/2" className="group">
                    <div className="relative h-24 rounded-xl overflow-hidden">
                      <Image
                        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=200&fit=crop"
                        alt="Featured property"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="text-white text-sm font-medium">$1,250,000</div>
                        <div className="text-white/80 text-xs">Manhattan</div>
                      </div>
                    </div>
                  </Link>
                </div>
                <Link href="/properties" className="inline-flex items-center gap-1 text-primary font-medium text-sm hover:underline">
                  View all properties
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>

              {/* Tools & CTA */}
              <div className="col-span-3 space-y-4">
                <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">Tools</h3>
                <div className="space-y-2">
                  <Link href="/search" className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-all">
                    <SearchIcon className="h-5 w-5 text-primary" />
                    <span className="font-medium text-gray-900">Advanced Search</span>
                  </Link>
                  <Link href="/mortgage-calculator" className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-all">
                    <CalculatorIcon className="h-5 w-5 text-primary" />
                    <span className="font-medium text-gray-900">Mortgage Calculator</span>
                  </Link>
                  <Link href="/market-trends" className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-all">
                    <TrendingUpIcon className="h-5 w-5 text-primary" />
                    <span className="font-medium text-gray-900">Market Trends</span>
                  </Link>
                </div>
                <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-4 text-white mt-4">
                  <div className="font-semibold mb-1">List Your Property</div>
                  <div className="text-sm text-white/80 mb-3">Reach thousands of potential buyers</div>
                  <Link href="/listing/create" className="inline-flex items-center gap-1 text-sm font-medium bg-white text-primary px-3 py-1.5 rounded-lg hover:bg-white/90 transition-colors">
                    Get Started
                    <ArrowRightIcon className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mega Menu - Agents */}
      {activeMenu === "agents" && (
        <div
          className="fixed left-0 right-0 top-16 w-full bg-white border-b shadow-xl z-40 animate-in fade-in slide-in-from-top-2 duration-200 ease-out"
          onMouseEnter={() => handleMenuEnter("agents")}
          onMouseLeave={handleMenuLeave}
        >
          <div className="container mx-auto max-w-7xl px-4 py-8">
            <div className="grid grid-cols-12 gap-8">
              {/* Find Agents */}
              <div className="col-span-3 space-y-4">
                <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">Find an Agent</h3>
                <div className="space-y-3">
                  <Link href="/agents" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
                    <UsersIcon className="h-4 w-4" />
                    <span>All Agents</span>
                  </Link>
                  <Link href="/agents?specialty=residential" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
                    <HomeIcon className="h-4 w-4" />
                    <span>Residential Specialists</span>
                  </Link>
                  <Link href="/agents?specialty=commercial" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
                    <BuildingIcon className="h-4 w-4" />
                    <span>Commercial Experts</span>
                  </Link>
                  <Link href="/agents?specialty=luxury" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
                    <SparklesIcon className="h-4 w-4" />
                    <span>Luxury Specialists</span>
                  </Link>
                  <Link href="/agents?specialty=investment" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
                    <TrendingUpIcon className="h-4 w-4" />
                    <span>Investment Advisors</span>
                  </Link>
                </div>
              </div>

              {/* Top Agents - Featured */}
              <div className="col-span-6 space-y-4">
                <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">Top Rated Agents</h3>
                <div className="grid grid-cols-3 gap-4">
                  <Link href="/agents/jennifer-martinez" className="group text-center">
                    <div className="relative w-20 h-20 mx-auto mb-2 rounded-full overflow-hidden ring-2 ring-gray-100 group-hover:ring-primary transition-all">
                      <Image
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop"
                        alt="Jennifer Martinez"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="font-medium text-gray-900 text-sm">Jennifer Martinez</div>
                    <div className="text-xs text-gray-500">Luxury Homes</div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <StarIcon className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">4.9</span>
                    </div>
                  </Link>
                  <Link href="/agents/david-thompson" className="group text-center">
                    <div className="relative w-20 h-20 mx-auto mb-2 rounded-full overflow-hidden ring-2 ring-gray-100 group-hover:ring-primary transition-all">
                      <Image
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"
                        alt="David Thompson"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="font-medium text-gray-900 text-sm">David Thompson</div>
                    <div className="text-xs text-gray-500">Commercial</div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <StarIcon className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">4.8</span>
                    </div>
                  </Link>
                  <Link href="/agents/sarah-williams" className="group text-center">
                    <div className="relative w-20 h-20 mx-auto mb-2 rounded-full overflow-hidden ring-2 ring-gray-100 group-hover:ring-primary transition-all">
                      <Image
                        src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop"
                        alt="Sarah Williams"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="font-medium text-gray-900 text-sm">Sarah Williams</div>
                    <div className="text-xs text-gray-500">Family Homes</div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <StarIcon className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">5.0</span>
                    </div>
                  </Link>
                </div>
                <Link href="/agents" className="inline-flex items-center gap-1 text-primary font-medium text-sm hover:underline">
                  View all agents
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>

              {/* Join Us */}
              <div className="col-span-3 space-y-4">
                <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">Join Our Team</h3>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
                    <BriefcaseIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="font-semibold text-gray-900 mb-1">Become an Agent</div>
                  <div className="text-sm text-gray-600 mb-4">Join our network of successful real estate professionals</div>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <ShieldCheckIcon className="h-4 w-4 text-green-500" />
                      <span>Industry-leading commission</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <ShieldCheckIcon className="h-4 w-4 text-green-500" />
                      <span>Advanced tools & training</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <ShieldCheckIcon className="h-4 w-4 text-green-500" />
                      <span>Dedicated support team</span>
                    </li>
                  </ul>
                  <Link href="/agent-application" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                    Apply Now
                    <ArrowRightIcon className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mega Menu - Services */}
      {activeMenu === "services" && (
        <div
          className="fixed left-0 right-0 top-16 w-full bg-white border-b shadow-xl z-40 animate-in fade-in slide-in-from-top-2 duration-200 ease-out"
          onMouseEnter={() => handleMenuEnter("services")}
          onMouseLeave={handleMenuLeave}
        >
          <div className="container mx-auto max-w-7xl px-4 py-8">
            <div className="grid grid-cols-12 gap-6">
              {/* Service Cards - 4 main services */}
              <div className="col-span-8">
                <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider mb-4">Our Services</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/services#buying" className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-all group">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-100 transition-colors">
                      <KeyIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">Buying Services</div>
                      <div className="text-sm text-gray-500">Complete support for finding and purchasing your perfect property</div>
                    </div>
                  </Link>
                  <Link href="/services#selling" className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-all group">
                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-purple-100 transition-colors">
                      <DollarSignIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">Selling Services</div>
                      <div className="text-sm text-gray-500">Maximize your property value with our marketing expertise</div>
                    </div>
                  </Link>
                  <Link href="/services#management" className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-all group">
                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-orange-100 transition-colors">
                      <BuildingIcon className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">Property Management</div>
                      <div className="text-sm text-gray-500">Full-service management for landlords and investors</div>
                    </div>
                  </Link>
                  <Link href="/services#investment" className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-all group">
                    <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-100 transition-colors">
                      <TrendingUpIcon className="h-6 w-6 text-cyan-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">Investment Consulting</div>
                      <div className="text-sm text-gray-500">Expert guidance for real estate investments</div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Additional Services List */}
              <div className="col-span-2 space-y-4">
                <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">More Services</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/services#photography" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors text-sm">
                      <CameraIcon className="h-4 w-4" />
                      <span>Photography</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/services#legal" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors text-sm">
                      <FileTextIcon className="h-4 w-4" />
                      <span>Legal Support</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/services#relocation" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors text-sm">
                      <MapPinIcon className="h-4 w-4" />
                      <span>Relocation</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/services#staging" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors text-sm">
                      <HomeIcon className="h-4 w-4" />
                      <span>Home Staging</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/services#international" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors text-sm">
                      <GlobeIcon className="h-4 w-4" />
                      <span>International</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* CTA */}
              <div className="col-span-2 space-y-4">
                <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">Get Help</h3>
                <div className="bg-primary rounded-xl p-5 text-white">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                    <HeadphonesIcon className="h-5 w-5" />
                  </div>
                  <div className="font-semibold mb-1">Free Consultation</div>
                  <div className="text-sm text-white/80 mb-4">Talk to an expert about your needs</div>
                  <Link href="/contact" className="inline-flex items-center gap-1 text-sm font-medium bg-white text-primary px-3 py-1.5 rounded-lg hover:bg-white/90 transition-colors">
                    Book Now
                    <ArrowRightIcon className="h-3 w-3" />
                  </Link>
                </div>
                <Link href="/services" className="inline-flex items-center gap-1 text-primary font-medium text-sm hover:underline">
                  View all services
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
