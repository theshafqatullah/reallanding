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

// AI-Powered Services
const aiServices = [
  {
    icon: BrainIcon,
    title: "AI Property Matching",
    description: "Our smart AI analyzes your preferences, lifestyle, and budget to find properties that truly match your needs.",
    badge: "AI Powered",
    gradient: "from-primary to-primary/80",
  },
  {
    icon: Glasses,
    title: "Virtual Reality Tours",
    description: "Experience properties from anywhere with immersive 3D VR tours that feel like you're actually there.",
    badge: "VR Ready",
    gradient: "from-primary/90 to-primary/70",
  },
  {
    icon: Box,
    title: "AR Room Staging",
    description: "Visualize furniture and decor in any space using augmented reality before making decisions.",
    badge: "AR Tech",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Mic,
    title: "AI Voice Assistant",
    description: "Search properties, schedule viewings, and get answers instantly using our intelligent voice assistant.",
    badge: "Voice AI",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: ScanIcon,
    title: "Smart Document Analysis",
    description: "AI-powered document processing for faster, error-free transactions and instant verification.",
    badge: "DocAI",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Cpu,
    title: "Predictive Analytics",
    description: "Machine learning models that predict property values, market trends, and investment potential.",
    badge: "ML Analytics",
    gradient: "from-primary/80 to-primary/60",
  },
];

const mainServices = [
  {
    icon: SearchIcon,
    title: "Property Search",
    description:
      "Advanced search tools powered by AI to help you find properties that perfectly match your criteria, budget, and lifestyle preferences.",
    features: [
      "AI-powered recommendations",
      "Custom filters & saved searches",
      "Real-time price alerts",
      "Neighborhood insights",
      "Virtual tour previews",
    ],
    color: "bg-primary",
  },
  {
    icon: KeyIcon,
    title: "Buying Services",
    description:
      "Complete end-to-end support throughout your property purchase journey, from the first viewing to getting your keys.",
    features: [
      "Personalized property tours",
      "Expert negotiation support",
      "Legal assistance & guidance",
      "Financing & mortgage help",
      "Closing coordination",
    ],
    color: "bg-primary/90",
  },
  {
    icon: DollarSignIcon,
    title: "Selling Services",
    description:
      "Maximize your property's value with our comprehensive selling support, professional marketing, and expert pricing strategies.",
    features: [
      "Free property valuation",
      "Professional photography & video",
      "Strategic marketing campaigns",
      "Open house management",
      "Buyer qualification",
    ],
    color: "bg-primary/80",
  },
  {
    icon: BuildingIcon,
    title: "Property Management",
    description:
      "Full-service property management solutions for landlords and investors seeking hassle-free rental income.",
    features: [
      "Comprehensive tenant screening",
      "Automated rent collection",
      "24/7 maintenance coordination",
      "Detailed financial reporting",
      "Legal compliance support",
    ],
    color: "bg-orange-500",
  },
  {
    icon: TrendingUpIcon,
    title: "Investment Consulting",
    description:
      "Expert guidance for real estate investments, portfolio development, and wealth building through property.",
    features: [
      "Market analysis & research",
      "ROI & cash flow calculations",
      "Investment strategies",
      "Portfolio optimization",
      "Risk assessment",
    ],
    color: "bg-primary/70",
  },
  {
    icon: ShieldCheckIcon,
    title: "Legal & Documentation",
    description:
      "Professional legal support and comprehensive documentation services for all your real estate transactions.",
    features: [
      "Contract review & drafting",
      "Title verification",
      "Due diligence support",
      "Closing coordination",
      "Dispute resolution",
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

const processSteps = [
  {
    step: "01",
    title: "Initial Consultation",
    description: "We start with a thorough understanding of your goals, preferences, budget, and timeline.",
    icon: UsersIcon,
  },
  {
    step: "02",
    title: "Custom Strategy",
    description: "Our experts develop a personalized plan tailored to your specific real estate objectives.",
    icon: TargetIcon,
  },
  {
    step: "03",
    title: "Expert Execution",
    description: "We put the plan into action with our network, technology, and industry expertise.",
    icon: ZapIcon,
  },
  {
    step: "04",
    title: "Successful Outcome",
    description: "Achieve your real estate goals with our guidance and ongoing support.",
    icon: AwardIcon,
  },
];

const additionalServices = [
  {
    icon: CameraIcon,
    title: "Professional Photography",
    description: "High-quality photos and virtual tours to showcase your property at its best.",
  },
  {
    icon: BarChart3Icon,
    title: "Market Analysis",
    description: "Comprehensive market research and comparative analysis for informed decisions.",
  },
  {
    icon: ClipboardCheckIcon,
    title: "Home Inspection",
    description: "Thorough property inspections to identify issues before you buy or sell.",
  },
  {
    icon: HandshakeIcon,
    title: "Negotiation Services",
    description: "Expert negotiators who work to get you the best possible deal.",
  },
  {
    icon: FileTextIcon,
    title: "Mortgage Assistance",
    description: "Help navigating mortgage options and connecting with trusted lenders.",
  },
  {
    icon: MapPinIcon,
    title: "Relocation Services",
    description: "Comprehensive support for families and professionals relocating to new areas.",
  },
];

const stats = [
  { value: "50K+", label: "Properties Sold", icon: HomeIcon },
  { value: "98%", label: "Client Satisfaction", icon: StarIcon },
  { value: "24/7", label: "Support Available", icon: ClockIcon },
  { value: "200+", label: "Expert Agents", icon: UsersIcon },
];

const testimonials = [
  {
    quote: "The team made buying our first home an absolute breeze. Their expertise and patience were invaluable.",
    author: "Jennifer & Mark Thompson",
    role: "First-Time Homebuyers",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    quote: "Sold our property 20% above asking price in just 2 weeks. The marketing strategy was exceptional.",
    author: "Robert Chen",
    role: "Property Seller",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
  },
  {
    quote: "Their investment consulting helped me build a real estate portfolio that generates consistent passive income.",
    author: "Sarah Williams",
    role: "Real Estate Investor",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
  },
];

const pricingPlans = [
  {
    name: "Basic",
    description: "Perfect for first-time buyers or sellers",
    price: "2.5%",
    priceNote: "of transaction value",
    features: [
      "Property search assistance",
      "Standard marketing package",
      "Basic negotiation support",
      "Transaction coordination",
      "Email support",
    ],
    popular: false,
  },
  {
    name: "Professional",
    description: "Our most popular comprehensive package",
    price: "3.5%",
    priceNote: "of transaction value",
    features: [
      "Everything in Basic",
      "Premium marketing campaign",
      "Professional photography & video",
      "Advanced market analysis",
      "Priority 24/7 support",
      "Home staging consultation",
    ],
    popular: true,
  },
  {
    name: "Premium",
    description: "White-glove service for luxury properties",
    price: "5%",
    priceNote: "of transaction value",
    features: [
      "Everything in Professional",
      "Dedicated agent team",
      "International marketing",
      "Luxury home staging",
      "Concierge services",
      "Post-sale support",
      "Investment portfolio review",
    ],
    popular: false,
  },
];

export default function ServicesPage() {
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
              Comprehensive Real Estate Services
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Expert Services for Every <br />
              <span className="text-secondary">Real Estate Need</span>
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              From buying and selling to investment and management, our comprehensive
              services are designed to guide you through every step of your real estate journey.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" className="rounded-full px-8">
                Explore Services
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

      {/* Main Services */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <SparklesIcon className="h-4 w-4 mr-2" />
              What We Offer
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Core Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive real estate solutions tailored to meet your unique needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainServices.map((service) => (
              <Card
                key={service.title}
                className="p-6 border border-border shadow-none hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-14 h-14 ${service.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                    <service.icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-foreground">
                      <CheckCircleIcon className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full rounded-full">
                  Learn More
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI-Powered Services */}
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
              AI & Technology Innovation
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Next-Gen Real Estate Technology
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the future of property discovery with our cutting-edge AI, VR, and AR solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiServices.map((service) => (
              <Card
                key={service.title}
                className="group p-6 border border-primary/10 shadow-none bg-white/80 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-300 overflow-hidden relative"
              >
                {/* Gradient accent */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${service.gradient}`} />

                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <Badge variant="secondary" className={`mb-2 bg-gradient-to-r ${service.gradient} text-white border-0 text-xs`}>
                      {service.badge}
                    </Badge>
                    <h3 className="text-lg font-semibold text-foreground">
                      {service.title}
                    </h3>
                  </div>
                </div>
                <p className="text-muted-foreground">{service.description}</p>
              </Card>
            ))}
          </div>

          {/* AI Stats */}
          <div className="mt-16 bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-primary/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">98%</div>
                <div className="text-sm text-muted-foreground">AI Match Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">50K+</div>
                <div className="text-sm text-muted-foreground">VR Tours Taken</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">3x</div>
                <div className="text-sm text-muted-foreground">Faster Decisions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">24/7</div>
                <div className="text-sm text-muted-foreground">AI Assistant</div>
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

      {/* Our Process */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <ClipboardCheckIcon className="h-4 w-4 mr-2" />
              How We Work
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Simple 4-Step Process
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A streamlined approach to help you achieve your real estate goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={step.step} className="relative">
                {index < processSteps.length - 1 && (
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

      {/* Additional Services */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <SparklesIcon className="h-4 w-4 mr-2" />
              More Services
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Additional Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Complementary services to enhance your real estate experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalServices.map((service) => (
              <Card
                key={service.title}
                className="p-6 border border-border shadow-none hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-4">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <DollarSignIcon className="h-4 w-4 mr-2" />
              Transparent Pricing
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Service Packages
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the package that best fits your needs and budget
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={`p-8 border shadow-none relative ${plan.popular ? "border-primary border-2" : "border-border"
                  }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                    Most Popular
                  </Badge>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                  <div className="text-4xl font-bold text-primary mb-1">{plan.price}</div>
                  <p className="text-muted-foreground text-sm">{plan.priceNote}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-foreground">
                      <CheckCircleIcon className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full rounded-full ${plan.popular ? "" : ""}`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  Get Started
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <StarIcon className="h-4 w-4 mr-2" />
              Client Stories
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from satisfied clients who achieved their real estate goals with us
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

      {/* 24/7 Support Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <Card className="p-8 md:p-12 border border-border shadow-none bg-primary text-primary-foreground">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <HeadphonesIcon className="h-8 w-8" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  24/7 Dedicated Support
                </h2>
                <p className="text-lg text-primary-foreground/80 mb-6">
                  Our dedicated support team is available around the clock to assist you
                  with any questions or concerns about your real estate transactions.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <PhoneIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">Phone</div>
                      <div className="text-sm text-primary-foreground/70">24/7 Hotline</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <MessageSquareIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">Live Chat</div>
                      <div className="text-sm text-primary-foreground/70">Instant Help</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <MailIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-sm text-primary-foreground/70">2hr Response</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <Button size="lg" variant="secondary" className="rounded-full px-8" asChild>
                  <Link href="/contact">
                    Contact Support
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
                Ready to Get Started?
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl">
                Contact us today for a free consultation and let our experts help you
                achieve your real estate goals.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="rounded-full px-8" asChild>
                <Link href="/contact">
                  Schedule Free Consultation
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