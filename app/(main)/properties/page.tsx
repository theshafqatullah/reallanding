import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function PropertiesPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Properties for Sale & Rent
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover your dream home from our extensive collection of premium properties. 
          Browse through thousands of listings to find the perfect match.
        </p>
      </div>

      {/* Search Section */}
      <Card className="p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <Input placeholder="Search by location, property type..." className="flex-1" />
          <Input placeholder="Min Price" type="number" />
          <Input placeholder="Max Price" type="number" />
          <Button>Search Properties</Button>
        </div>
      </Card>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((property) => (
          <Card key={property} className="overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Property Image {property}</span>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">Beautiful Family Home {property}</h3>
              <p className="text-gray-600 mb-2">123 Main Street, City Center</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-primary">$500,000</span>
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-12">
        <Button variant="outline" size="lg">
          Load More Properties
        </Button>
      </div>
    </div>
  );
}