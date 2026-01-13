import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
        <p className="text-xl text-gray-600">
          Get in touch with our real estate experts. We're here to help you find your perfect property.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="Enter your first name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Enter your last name" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="Enter your email" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="Enter your phone number" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select>
                <option value="">Select a subject</option>
                <option value="buying">Buying Property</option>
                <option value="selling">Selling Property</option>
                <option value="renting">Renting Property</option>
                <option value="investment">Investment Opportunities</option>
                <option value="other">Other Inquiry</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                className="min-h-[120px] w-full rounded-full border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                placeholder="Tell us about your property needs..."
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              Send Message
            </Button>
          </form>
        </Card>

        {/* Contact Information */}
        <div className="space-y-8">
          <Card className="p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Office Address</h3>
                <p className="text-gray-600">
                  123 Real Estate Street<br />
                  Downtown District<br />
                  New York, NY 10001
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
                <p className="text-gray-600">
                  Main: +1 (555) 123-4567<br />
                  Sales: +1 (555) 123-4568<br />
                  Support: +1 (555) 123-4569
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">
                  General: info@reallanding.com<br />
                  Sales: sales@reallanding.com<br />
                  Support: support@reallanding.com
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Business Hours</h3>
                <div className="text-gray-600 space-y-1">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: 12:00 PM - 4:00 PM</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Map Section */}
      <Card className="mt-12 p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Visit Our Office</h2>
        <p className="text-gray-600 mb-6">
          Come visit our office to discuss your property needs in person with our expert team.
        </p>
        <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Interactive Map Coming Soon</p>
        </div>
      </Card>

      {/* Emergency Contact */}
      <Card className="mt-8 p-6 bg-primary/5 border-primary/20">
        <div className="text-center">
          <h3 className="font-semibold text-gray-900 mb-2">Emergency Contact</h3>
          <p className="text-gray-600 mb-4">
            For urgent property matters outside business hours
          </p>
          <Button variant="outline">
            Call Emergency Line: +1 (555) 999-0000
          </Button>
        </div>
      </Card>
    </div>
  );
}