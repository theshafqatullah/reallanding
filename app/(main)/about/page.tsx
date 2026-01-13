import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          About Real Landing
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your trusted partner in real estate for over a decade. We connect buyers, sellers, 
          and renters with their perfect properties through innovative technology and personalized service.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600">
            To revolutionize the real estate experience by providing transparent, 
            efficient, and personalized services that help people find their dream homes 
            and investment opportunities.
          </p>
        </Card>
        
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
          <p className="text-gray-600">
            To be the leading real estate platform that empowers everyone to make 
            informed property decisions with confidence and ease, backed by cutting-edge 
            technology and expert guidance.
          </p>
        </Card>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "John Smith", role: "CEO & Founder", experience: "15+ years experience" },
            { name: "Sarah Johnson", role: "Head of Sales", experience: "12+ years experience" },
            { name: "Mike Davis", role: "Property Specialist", experience: "8+ years experience" }
          ].map((member, index) => (
            <Card key={index} className="p-6 text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-500 text-sm">Photo</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
              <p className="text-primary font-medium mb-2">{member.role}</p>
              <p className="text-gray-600 text-sm">{member.experience}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-primary/5 rounded-lg p-12 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary mb-2">2500+</div>
            <p className="text-gray-600">Properties Sold</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">98%</div>
            <p className="text-gray-600">Customer Satisfaction</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">150+</div>
            <p className="text-gray-600">Expert Agents</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">12+</div>
            <p className="text-gray-600">Years Experience</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to Find Your Dream Property?
        </h2>
        <p className="text-gray-600 mb-6">
          Let our experienced team help you navigate the real estate market.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg">Browse Properties</Button>
          <Button variant="outline" size="lg">Contact Us</Button>
        </div>
      </div>
    </div>
  );
}