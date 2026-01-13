import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Phone, Mail, MapPin, Award, TrendingUp } from "lucide-react";

export default function AgentsPage() {
  const agents = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Senior Real Estate Agent",
      specialties: ["Luxury Homes", "Investment Properties"],
      rating: 4.9,
      reviews: 127,
      sales: 89,
      experience: "8+ years",
      phone: "+1 (555) 123-4567",
      email: "sarah.johnson@reallanding.com",
      location: "Downtown District",
      description: "Specializes in luxury residential properties and investment opportunities. Known for exceptional client service and market expertise."
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Commercial Real Estate Specialist",
      specialties: ["Commercial", "Industrial"],
      rating: 4.8,
      reviews: 94,
      sales: 156,
      experience: "12+ years",
      phone: "+1 (555) 123-4568",
      email: "michael.chen@reallanding.com",
      location: "Business District",
      description: "Expert in commercial real estate transactions with a focus on office buildings, retail spaces, and industrial properties."
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Residential Property Expert",
      specialties: ["First-time Buyers", "Family Homes"],
      rating: 5.0,
      reviews: 203,
      sales: 134,
      experience: "6+ years",
      phone: "+1 (555) 123-4569",
      email: "emily.rodriguez@reallanding.com",
      location: "Suburban Areas",
      description: "Dedicated to helping first-time buyers and families find their perfect homes. Patient, knowledgeable, and supportive throughout the process."
    },
    {
      id: 4,
      name: "David Thompson",
      role: "Investment Property Advisor",
      specialties: ["Investment", "Rental Properties"],
      rating: 4.7,
      reviews: 78,
      sales: 67,
      experience: "10+ years",
      phone: "+1 (555) 123-4570",
      email: "david.thompson@reallanding.com",
      location: "Metropolitan Area",
      description: "Investment-focused agent helping clients build profitable real estate portfolios with strategic property acquisitions."
    },
    {
      id: 5,
      name: "Lisa Park",
      role: "Luxury Property Specialist",
      specialties: ["Luxury", "Waterfront"],
      rating: 4.9,
      reviews: 156,
      sales: 78,
      experience: "15+ years",
      phone: "+1 (555) 123-4571",
      email: "lisa.park@reallanding.com",
      location: "Coastal Areas",
      description: "Luxury and waterfront property expert with an extensive network and deep understanding of high-end real estate markets."
    },
    {
      id: 6,
      name: "James Wilson",
      role: "New Construction Specialist",
      specialties: ["New Builds", "Condominiums"],
      rating: 4.8,
      reviews: 89,
      sales: 92,
      experience: "7+ years",
      phone: "+1 (555) 123-4572",
      email: "james.wilson@reallanding.com",
      location: "Development Areas",
      description: "Specialist in new construction properties and condominium developments. Expert in pre-construction sales and builder relationships."
    }
  ];

  const teamStats = [
    { label: "Active Agents", value: "50+" },
    { label: "Properties Sold", value: "2,500+" },
    { label: "Client Satisfaction", value: "98%" },
    { label: "Years Combined Experience", value: "200+" }
  ];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Our Expert Agents</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Meet our team of experienced real estate professionals. Each agent brings unique expertise 
          and local market knowledge to help you achieve your property goals.
        </p>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
        {teamStats.map((stat, index) => (
          <Card key={index} className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
            <p className="text-gray-600">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {agents.map((agent) => (
          <Card key={agent.id} className="p-6 h-full flex flex-col">
            {/* Agent Photo & Basic Info */}
            <div className="text-center mb-4">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-gray-500 text-sm">Photo</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
              <p className="text-primary font-medium text-sm">{agent.role}</p>
            </div>

            {/* Rating & Stats */}
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{agent.rating}</span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-600">{agent.reviews} reviews</span>
            </div>

            {/* Specialties */}
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {agent.specialties.map((specialty, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 text-primary">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-semibold">{agent.sales}</span>
                </div>
                <p className="text-xs text-gray-600">Properties Sold</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 text-primary">
                  <Award className="h-4 w-4" />
                  <span className="text-sm font-semibold">{agent.experience}</span>
                </div>
                <p className="text-xs text-gray-600">Experience</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4 flex-grow">{agent.description}</p>

            {/* Contact Info */}
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{agent.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{agent.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <span className="truncate">{agent.email}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button className="w-full" size="sm">
                Contact Agent
              </Button>
              <Button variant="outline" className="w-full" size="sm">
                View Listings
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Join Our Team */}
      <Card className="p-8 bg-primary/5 border-primary/20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Our Team</h2>
        <p className="text-gray-600 mb-6">
          Are you a motivated real estate professional looking to take your career to the next level? 
          We're always looking for talented agents to join our growing team.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg">Apply Now</Button>
          <Button variant="outline" size="lg">Learn More</Button>
        </div>
      </Card>
    </div>
  );
}