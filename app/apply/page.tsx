'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Building2,
    Users,
    TrendingUp,
    Shield,
    Zap,
    Globe,
    CheckCircle2,
    Star,
    Award,
    Handshake,
    BarChart3,
    Clock,
    ArrowRight,
} from 'lucide-react';

export default function ApplyPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section - 110vh */}
            <section className="relative h-[110vh] flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse animation-delay-2000" />
                    <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse animation-delay-4000" />
                </div>

                {/* Content */}
                <div className="relative z-10 container max-w-6xl mx-auto px-4 py-20">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Left: Text Content */}
                        <div className="space-y-8 text-white">
                            <div className="space-y-4">
                                <Badge className="w-fit bg-blue-500/30 text-blue-100 border-blue-400/50">
                                    Join 10,000+ Professionals
                                </Badge>
                                <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                                    Partner with <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Reallanding</span>
                                </h1>
                                <p className="text-xl text-slate-300 leading-relaxed">
                                    Grow your real estate business with access to exclusive property listings, advanced tools, and a trusted community of agents and agencies.
                                </p>
                            </div>

                            {/* Trust Badges */}
                            <div className="space-y-3">
                                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Trusted By Industry Leaders</p>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                                        <span className="text-sm">Verified Professionals</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                                        <span className="text-sm">Secure Transactions</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                                        <span className="text-sm">24/7 Support</span>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link href="/apply/step/1">
                                    <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 group">
                                        Start Your Application
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-400 text-white hover:bg-slate-800">
                                    Learn More
                                </Button>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-700">
                                <div>
                                    <p className="text-2xl font-bold text-cyan-400">10K+</p>
                                    <p className="text-xs text-slate-400">Active Partners</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-cyan-400">50K+</p>
                                    <p className="text-xs text-slate-400">Properties Listed</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-cyan-400">$2B+</p>
                                    <p className="text-xs text-slate-400">Transaction Value</p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Visual Cards */}
                        <div className="hidden md:grid gap-4 grid-cols-2">
                            {/* Agent Card */}
                            <div className="group relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-300" />
                                <Card className="relative bg-slate-800 border-slate-700 hover:border-cyan-500/50 transition-colors">
                                    <CardHeader>
                                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                                            <Users className="w-6 h-6 text-white" />
                                        </div>
                                        <CardTitle className="text-white">For Agents</CardTitle>
                                        <CardDescription className="text-slate-400">Grow your network</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2 text-sm text-slate-300">
                                            <li className="flex gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                                <span>Access exclusive listings</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                                <span>Lead generation tools</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                                <span>Mobile-first platform</span>
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Agency Card */}
                            <div className="group relative mt-8">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-300" />
                                <Card className="relative bg-slate-800 border-slate-700 hover:border-purple-500/50 transition-colors">
                                    <CardHeader>
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                                            <Building2 className="w-6 h-6 text-white" />
                                        </div>
                                        <CardTitle className="text-white">For Agencies</CardTitle>
                                        <CardDescription className="text-slate-400">Scale your business</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2 text-sm text-slate-300">
                                            <li className="flex gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                                <span>Team management tools</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                                <span>Analytics dashboard</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                                <span>White-label options</span>
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="animate-bounce">
                        <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </div>
            </section>

            {/* Why Choose Reallanding Section */}
            <section className="py-20 bg-white">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Why Choose Reallanding?</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            We're not just a platform—we're your partner in real estate success
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Trust & Security */}
                        <Card className="border-slate-200 hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                    <Shield className="w-6 h-6 text-blue-600" />
                                </div>
                                <CardTitle>Trust & Security</CardTitle>
                                <CardDescription>Bank-level encryption and verified professionals</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-slate-600">
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                                        <span>Identity verification</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                                        <span>Encrypted communication</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                                        <span>Fraud protection</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Advanced Tools */}
                        <Card className="border-slate-200 hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                    <Zap className="w-6 h-6 text-purple-600" />
                                </div>
                                <CardTitle>Advanced Tools</CardTitle>
                                <CardDescription>Cutting-edge technology for modern agents</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-slate-600">
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                                        <span>AI-powered matching</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                                        <span>Real-time analytics</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                                        <span>Automated workflows</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Global Reach */}
                        <Card className="border-slate-200 hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                    <Globe className="w-6 h-6 text-green-600" />
                                </div>
                                <CardTitle>Global Community</CardTitle>
                                <CardDescription>Connect with professionals worldwide</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-slate-600">
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                                        <span>International reach</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                                        <span>Multi-language support</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                                        <span>24/7 assistance</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Benefits for Property Listings */}
            <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Maximize Your Property Listings</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Get your properties in front of thousands of qualified buyers and renters
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <TrendingUp className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Increased Visibility</h3>
                                    <p className="text-slate-600">Your listings reach a qualified audience across our network of agents and agencies</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                                    <BarChart3 className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Better Analytics</h3>
                                    <p className="text-slate-600">Track views, inquiries, and performance metrics for every property in real-time</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                                    <Handshake className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Collaboration Tools</h3>
                                    <p className="text-slate-600">Seamlessly work with other agents on joint listings and transactions</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-lg bg-cyan-100 flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-6 h-6 text-cyan-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Faster Transactions</h3>
                                    <p className="text-slate-600">Streamlined processes mean less time on paperwork, more time closing deals</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                                    <Award className="w-6 h-6 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Premium Features</h3>
                                    <p className="text-slate-600">Virtual tours, professional photography showcase, and featured listings</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                                    <Star className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Expert Support</h3>
                                    <p className="text-slate-600">Dedicated support team to help optimize your listings for maximum impact</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-white">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Trusted by Professionals</h2>
                        <p className="text-lg text-slate-600">Join thousands of successful agents and agencies</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Sarah Johnson",
                                role: "Senior Real Estate Agent",
                                text: "Reallanding has transformed how I manage my listings. The platform is intuitive and the support team is fantastic.",
                                rating: 5,
                            },
                            {
                                name: "Michael Chen",
                                role: "Agency Director",
                                text: "We've increased our team's productivity by 40% since joining. The tools are professional-grade and the community is supportive.",
                                rating: 5,
                            },
                            {
                                name: "Elena Rodriguez",
                                role: "Independent Agent",
                                text: "As a solo agent, I needed a platform that could scale with my business. Reallanding delivered exactly that.",
                                rating: 5,
                            },
                        ].map((testimonial, idx) => (
                            <Card key={idx} className="border-slate-200">
                                <CardContent className="pt-6">
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="text-slate-700 mb-4 italic">{testimonial.text}</p>
                                    <Separator className="my-4" />
                                    <div>
                                        <p className="font-semibold text-slate-900">{testimonial.name}</p>
                                        <p className="text-sm text-slate-500">{testimonial.role}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600">
                <div className="container max-w-4xl mx-auto px-4 text-center text-white">
                    <h2 className="text-4xl font-bold mb-6">Ready to Grow Your Real Estate Business?</h2>
                    <p className="text-xl mb-8 opacity-90">
                        Join thousands of agents and agencies already succeeding on Reallanding
                    </p>
                    <Link href="/apply/step/1">
                        <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-50 border-0 group">
                            Start Your Application Today
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
