import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Search, DollarSign, FileText, Users, TrendingUp, Shield, Headphones } from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      icon: <Search className="h-8 w-8 text-primary" />,
      title: "Property Search",
      description: "Advanced search tools to help you find properties that match your exact criteria and budget.",
      features: ["Custom filters", "Saved searches", "Price alerts", "Market insights"]
    },
    {
      icon: <Home className="h-8 w-8 text-primary" />,
      title: "Buying Services",
      description: "Complete support throughout your property purchase journey from viewing to closing.",
      features: ["Property tours", "Negotiation support", "Legal assistance", "Financing help"]
    },
    {
      icon: <DollarSign className="h-8 w-8 text-primary" />,
      title: "Selling Services",
      description: "Maximize your property value with our comprehensive selling support and marketing.",
      features: ["Property valuation", "Professional photography", "Marketing campaigns", "Open houses"]
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Property Management",
      description: "Full-service property management for landlords and investors.",
      features: ["Tenant screening", "Rent collection", "Maintenance coordination", "Financial reporting"]
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: "Investment Consulting",
      description: "Expert guidance for real estate investments and portfolio development.",
      features: ["Market analysis", "ROI calculations", "Investment strategies", "Portfolio reviews"]
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Legal & Documentation",
      description: "Professional legal support and documentation services for all transactions.",
      features: ["Contract review", "Title verification", "Due diligence", "Closing coordination"]
    }
  ];

  const specialties = [
    { title: "Residential Properties", description: "Homes, condos, and townhouses" },
    { title: "Commercial Real Estate", description: "Office buildings, retail spaces, warehouses" },
    { title: "Luxury Properties", description: "High-end homes and exclusive estates" },
    { title: "Investment Properties", description: "Rental properties and income-generating assets" },
    { title: "New Developments", description: "Pre-construction and newly built properties" },
    { title: "International Properties", description: "Properties in international markets" }
  ];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Our Services</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Comprehensive real estate services designed to meet all your property needs. 
          From buying and selling to investment and management, we've got you covered.
        </p>
      </div>

      {/* Main Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {services.map((service, index) => (
          <Card key={index} className="p-6 h-full">
            <div className="flex items-center mb-4">
              <div className="bg-primary/10 p-3 rounded-full mr-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
            </div>
            <p className="text-gray-600 mb-4">{service.description}</p>
            <ul className="space-y-2">
              {service.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      {/* Property Specialties */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Property Specialties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialties.map((specialty, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{specialty.title}</h3>
              <p className="text-gray-600">{specialty.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-gray-50 rounded-lg p-12 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { step: "1", title: "Consultation", description: "Initial meeting to understand your needs" },
            { step: "2", title: "Strategy", description: "Develop a customized plan for your goals" },
            { step: "3", title: "Execution", description: "Put the plan into action with expert guidance" },
            { step: "4", title: "Success", description: "Achieve your real estate objectives" }
          ].map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                {step.step}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Support Section */}
      <Card className="p-8 bg-primary/5 border-primary/20 mb-16">
        <div className="flex items-start space-x-6">
          <div className="bg-primary/20 p-4 rounded-full">
            <Headphones className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">24/7 Support</h3>
            <p className="text-gray-600 mb-4">
              Our dedicated support team is available around the clock to assist you with any questions 
              or concerns about your real estate transactions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-900">Phone Support</p>
                <p className="text-gray-600">24/7 hotline available</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Live Chat</p>
                <p className="text-gray-600">Instant online assistance</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Email Support</p>
                <p className="text-gray-600">Response within 2 hours</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* CTA Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Get Started?</h2>
        <p className="text-xl text-gray-600 mb-8">
          Contact us today to discuss how our services can help you achieve your real estate goals.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg">Schedule Consultation</Button>
          <Button variant="outline" size="lg">View Our Properties</Button>
        </div>
      </div>
    </div>
  );
}