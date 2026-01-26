import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  HomeIcon,
  SearchIcon,
  DollarSignIcon,
  FileTextIcon,
  TrendingUpIcon,
  ShieldCheckIcon,
  HeadphonesIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  SparklesIcon,
  BuildingIcon,
  KeyIcon,
  UsersIcon,
  MapPinIcon,
  CameraIcon,
  BarChart3Icon,
  ClipboardCheckIcon,
  HandshakeIcon,
  BriefcaseIcon,
  GlobeIcon,
  StarIcon,
  PhoneIcon,
  MessageSquareIcon,
  MailIcon,
  ClockIcon,
  AwardIcon,
  TargetIcon,
  ZapIcon,
  BrainIcon,
  Glasses,
  Box,
  Mic,
  Cpu,
  Video,
  ScanIcon,
} from "lucide-react";

export { metadata } from "./metadata";

// Featured Guide Topics
const featuredTopics = [
  {
    icon: BrainIcon,
    title: "Market Analysis Guide",
    description: "Learn how to analyze real estate markets, understand trends, and identify the best investment opportunities.",
    badge: "Essential",
    gradient: "from-primary to-primary/80",
  },
  {
    icon: Glasses,
    title: "Virtual Tour Tips",
    description: "Master the art of evaluating properties through virtual tours and what to look for in 3D walkthroughs.",
    badge: "Digital",
    gradient: "from-primary/90 to-primary/70",
  },
  {
    icon: Box,
    title: "Home Staging 101",
    description: "Discover proven staging techniques to make any property look its best and sell faster.",
    badge: "Selling",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Mic,
    title: "Negotiation Strategies",
    description: "Expert tips on negotiating the best deal whether you're buying or selling property.",
    badge: "Skills",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: ScanIcon,
    title: "Document Checklist",
    description: "A comprehensive guide to all the paperwork you'll need for a smooth real estate transaction.",
    badge: "Legal",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Cpu,
    title: "Investment Calculator",
    description: "Learn how to calculate ROI, cash flow, and determine if a property is a good investment.",
    badge: "Finance",
    gradient: "from-primary/80 to-primary/60",
  },
];

const mainGuides = [
  {
    icon: SearchIcon,
    title: "Property Search Guide",
    description:
      "Learn how to effectively search for properties, use filters, and find homes that match your criteria and budget.",
    features: [
      "Setting search criteria",
      "Using advanced filters",
      "Understanding listings",
      "Evaluating neighborhoods",
      "Scheduling viewings",
    ],
    color: "bg-primary",
  },
  {
    icon: KeyIcon,
    title: "Home Buying Guide",
    description:
      "A complete walkthrough of the home buying process from start to finish, including tips for first-time buyers.",
    features: [
      "Mortgage pre-approval",
      "Making competitive offers",
      "Home inspection checklist",
      "Understanding contracts",
      "Closing day preparation",
    ],
    color: "bg-primary/90",
  },
  {
    icon: DollarSignIcon,
    title: "Home Selling Guide",
    description:
      "Expert advice on preparing, pricing, and marketing your home to achieve the best possible sale price.",
    features: [
      "Pricing your home right",
      "Preparing for sale",
      "Professional photography tips",
      "Open house strategies",
      "Handling multiple offers",
    ],
    color: "bg-primary/80",
  },
  {
    icon: BuildingIcon,
    title: "Landlord Guide",
    description:
      "Everything you need to know about becoming a successful landlord, from tenant screening to maintenance.",
    features: [
      "Finding quality tenants",
      "Setting the right rent",
      "Lease agreement essentials",
      "Maintenance responsibilities",
      "Legal requirements",
    ],
    color: "bg-orange-500",
  },
  {
    icon: TrendingUpIcon,
    title: "Investment Guide",
    description:
      "Comprehensive guide to real estate investing, including strategies for building wealth through property.",
    features: [
      "Types of investments",
      "Calculating returns",
      "Financing options",
      "Risk management",
      "Portfolio diversification",
    ],
    color: "bg-primary/70",
  },
  {
    icon: ShieldCheckIcon,
    title: "Legal & Contracts Guide",
    description:
      "Understand the legal aspects of real estate transactions, contracts, and documentation requirements.",
    features: [
      "Purchase agreements",
      "Title insurance explained",
      "Disclosure requirements",
      "Common legal pitfalls",
      "Working with attorneys",
    ],
    color: "bg-red-500",
  },
];

const specialties = [
  {
    icon: HomeIcon,
    title: "Residential Properties",
    description: "Single-family homes, condos, townhouses, and apartments for families of all sizes.",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
  },
  {
    icon: BuildingIcon,
    title: "Commercial Real Estate",
    description: "Office buildings, retail spaces, warehouses, and industrial properties.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
  },
  {
    icon: SparklesIcon,
    title: "Luxury Properties",
    description: "High-end homes, exclusive estates, penthouses, and waterfront properties.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop",
  },
  {
    icon: TrendingUpIcon,
    title: "Investment Properties",
    description: "Rental properties, multi-family units, and income-generating real estate.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop",
  },
  {
    icon: BriefcaseIcon,
    title: "New Developments",
    description: "Pre-construction projects, newly built homes, and modern developments.",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
  },
  {
    icon: GlobeIcon,
    title: "International Properties",
    description: "Exclusive properties in international markets for global investors.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
  },
];

const learningPath = [
  {
    step: "01",
    title: "Choose Your Path",
    description: "Select guides based on whether you're buying, selling, investing, or renting property.",
    icon: UsersIcon,
  },
  {
    step: "02",
    title: "Learn the Basics",
    description: "Start with our foundational guides to understand key concepts and terminology.",
    icon: TargetIcon,
  },
  {
    step: "03",
    title: "Deep Dive",
    description: "Explore advanced topics and strategies specific to your real estate goals.",
    icon: ZapIcon,
  },
  {
    step: "04",
    title: "Take Action",
    description: "Apply what you've learned with our checklists, templates, and action plans.",
    icon: AwardIcon,
  },
];

const quickGuides = [
  {
    icon: CameraIcon,
    title: "Photography Tips",
    description: "Learn how to take great listing photos that attract more buyers and get better offers.",
  },
  {
    icon: BarChart3Icon,
    title: "Reading Market Reports",
    description: "How to interpret market data and use it to make informed buying or selling decisions.",
  },
  {
    icon: ClipboardCheckIcon,
    title: "Inspection Checklist",
    description: "What to look for during a home inspection and questions to ask the inspector.",
  },
  {
    icon: HandshakeIcon,
    title: "Negotiation Tips",
    description: "Proven negotiation techniques to help you get the best deal on any property.",
  },
  {
    icon: FileTextIcon,
    title: "Mortgage Basics",
    description: "Understanding mortgage types, rates, and how to get the best financing for your purchase.",
  },
  {
    icon: MapPinIcon,
    title: "Relocation Checklist",
    description: "A step-by-step guide for families and professionals moving to a new area.",
  },
];

const stats = [
  { value: "50+", label: "Expert Guides", icon: HomeIcon },
  { value: "100K+", label: "Readers Helped", icon: StarIcon },
  { value: "Free", label: "Always Accessible", icon: ClockIcon },
  { value: "Weekly", label: "New Content", icon: UsersIcon },
];

const testimonials = [
  {
    quote: "The buyer's guide was incredibly helpful. It walked me through every step and I felt confident throughout the entire process.",
    author: "Jennifer Thompson",
    role: "First-Time Home Buyer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    quote: "The investment guide helped me understand ROI calculations and find my first rental property. Now I own three!",
    author: "Robert Chen",
    role: "Real Estate Investor",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
  },
  {
    quote: "As a new landlord, the property management guide saved me from making costly mistakes. Highly recommend!",
    author: "Sarah Williams",
    role: "Landlord",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
  },
];

const downloadableResources = [
  {
    name: "Buyer's Toolkit",
    description: "Essential resources for first-time home buyers",
    price: "Free",
    priceNote: "Instant download",
    features: [
      "Pre-approval checklist",
      "Home search worksheet",
      "Offer comparison template",
      "Inspection checklist",
      "Closing cost calculator",
    ],
    popular: false,
  },
  {
    name: "Complete Guide Pack",
    description: "Our most comprehensive resource collection",
    price: "Free",
    priceNote: "Email signup required",
    features: [
      "Everything in Buyer's Toolkit",
      "Seller's preparation guide",
      "Market analysis templates",
      "Negotiation scripts",
      "Contract review checklist",
      "Moving day planner",
    ],
    popular: true,
  },
  {
    name: "Investor's Bundle",
    description: "Advanced resources for real estate investors",
    price: "Free",
    priceNote: "Premium member access",
    features: [
      "Everything in Complete Pack",
      "ROI calculator spreadsheet",
      "Property analysis template",
      "Rental income tracker",
      "Portfolio management guide",
      "Tax deduction checklist",
      "Due diligence checklist",
    ],
    popular: false,
  },
];

export default function GuidesPage() {
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

        <div className="container mx-auto max-w-7xl px-4 py-20 md:py-28 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge
              variant="secondary"
              className="mb-6 bg-white/20 text-primary-foreground border-white/30 hover:bg-white/30"
            >
              <BriefcaseIcon className="h-4 w-4 mr-2" />
              Comprehensive Real Estate Guides
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Expert Guides for Every <br />
              <span className="text-secondary">Real Estate Need</span>
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              From buying and selling to investment and management, our comprehensive
              guides are designed to help you through every step of your real estate journey.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" className="rounded-full px-8">
                Explore Guides
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 border-white/30 text-primary-foreground hover:bg-white/10"
                asChild
              >
                <Link href="/contact">Get a Free Consultation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 -mt-24 relative z-20">
            {stats.map((stat) => (
              <Card
                key={stat.label}
                className="p-6 text-center bg-white border border-border shadow-none"
              >
                <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-7 w-7 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Guides */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <SparklesIcon className="h-4 w-4 mr-2" />
              Learn & Grow
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Comprehensive Real Estate Guides
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about buying, selling, and investing in real estate
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainGuides.map((guide) => (
              <Card
                key={guide.title}
                className="p-6 border border-border shadow-none hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-14 h-14 ${guide.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                    <guide.icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {guide.title}
                    </h3>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">{guide.description}</p>
                <ul className="space-y-2 mb-6">
                  {guide.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-foreground">
                      <CheckCircleIcon className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full rounded-full">
                  Read Guide
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Guide Topics */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-white to-secondary relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        </div>

        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-primary/10 to-secondary text-primary border-primary/20">
              <SparklesIcon className="h-4 w-4 mr-2" />
              Featured Topics
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Popular Guide Topics
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Dive deep into the most important real estate topics with our detailed guides
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTopics.map((topic) => (
              <Card
                key={topic.title}
                className="group p-6 border border-primary/10 shadow-none bg-white/80 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-300 overflow-hidden relative"
              >
                {/* Gradient accent */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${topic.gradient}`} />

                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${topic.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <topic.icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <Badge variant="secondary" className={`mb-2 bg-gradient-to-r ${topic.gradient} text-white border-0 text-xs`}>
                      {topic.badge}
                    </Badge>
                    <h3 className="text-lg font-semibold text-foreground">
                      {topic.title}
                    </h3>
                  </div>
                </div>
                <p className="text-muted-foreground">{topic.description}</p>
              </Card>
            ))}
          </div>

          {/* Guide Stats */}
          <div className="mt-16 bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-primary/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">50+</div>
                <div className="text-sm text-muted-foreground">Expert Guides</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">100K+</div>
                <div className="text-sm text-muted-foreground">Readers Helped</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">Weekly</div>
                <div className="text-sm text-muted-foreground">New Content</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">Free</div>
                <div className="text-sm text-muted-foreground">Access Always</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Specialties */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <HomeIcon className="h-4 w-4 mr-2" />
              Property Types
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Property Specialties
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We have expertise across all property types to serve your diverse needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialties.map((specialty) => (
              <Card
                key={specialty.title}
                className="overflow-hidden border border-border shadow-none group hover:-translate-y-1 transition-all duration-300 p-0 gap-0"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={specialty.image}
                    alt={specialty.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                      <specialty.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{specialty.title}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-muted-foreground">{specialty.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Path */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <ClipboardCheckIcon className="h-4 w-4 mr-2" />
              How to Use Our Guides
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your Learning Path
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Follow these steps to get the most out of our real estate guides
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {learningPath.map((step, index) => (
              <div key={step.step} className="relative">
                {index < learningPath.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-border" />
                )}
                <Card className="p-6 text-center border border-border shadow-none relative z-10 bg-white">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-8 w-8" />
                  </div>
                  <div className="text-sm font-bold text-primary mb-2">STEP {step.step}</div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Guides */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <SparklesIcon className="h-4 w-4 mr-2" />
              Quick Reference
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Quick Guides & Checklists
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Handy quick-reference guides for common real estate tasks
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickGuides.map((guide) => (
              <Card
                key={guide.title}
                className="p-6 border border-border shadow-none hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-4">
                  <guide.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{guide.title}</h3>
                <p className="text-muted-foreground">{guide.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Downloadable Resources */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <DollarSignIcon className="h-4 w-4 mr-2" />
              Free Resources
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Downloadable Resources
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Free templates, checklists, and tools to help you succeed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {downloadableResources.map((resource) => (
              <Card
                key={resource.name}
                className={`p-8 border shadow-none relative ${resource.popular ? "border-primary border-2" : "border-border"
                  }`}
              >
                {resource.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                    Most Popular
                  </Badge>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-foreground mb-2">{resource.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{resource.description}</p>
                  <div className="text-4xl font-bold text-primary mb-1">{resource.price}</div>
                  <p className="text-muted-foreground text-sm">{resource.priceNote}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {resource.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-foreground">
                      <CheckCircleIcon className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full rounded-full ${resource.popular ? "" : ""}`}
                  variant={resource.popular ? "default" : "outline"}
                >
                  Download Now
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Reader Stories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <StarIcon className="h-4 w-4 mr-2" />
              Reader Stories
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Readers Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from people who used our guides to achieve their real estate goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.author}
                className="p-6 border border-border shadow-none"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-foreground mb-6">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Need More Help Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <Card className="p-8 md:p-12 border border-border shadow-none bg-primary text-primary-foreground">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <HeadphonesIcon className="h-8 w-8" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Need Personalized Help?
                </h2>
                <p className="text-lg text-primary-foreground/80 mb-6">
                  Our guides provide comprehensive information, but sometimes you need
                  personalized advice. Connect with our expert team for tailored guidance.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <PhoneIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">Phone</div>
                      <div className="text-sm text-primary-foreground/70">Talk to an Expert</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <MessageSquareIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">Live Chat</div>
                      <div className="text-sm text-primary-foreground/70">Quick Answers</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <MailIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-sm text-primary-foreground/70">Detailed Help</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <Button size="lg" variant="secondary" className="rounded-full px-8" asChild>
                  <Link href="/contact">
                    Get Expert Advice
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 p-12 rounded-3xl bg-secondary">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl">
                Explore our comprehensive guides and resources to make informed
                real estate decisions. Your dream property is just a guide away.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="rounded-full px-8" asChild>
                <Link href="/blogs">
                  Read Our Blog
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
                <Link href="/properties">Browse Properties</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}