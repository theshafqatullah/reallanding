'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Building2,
    Users,
    ArrowRight,
    CheckCircle2,
} from 'lucide-react';

export default function ApplyPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Simple Hero Section */}
            <section className="py-16 bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
                <div className="container max-w-4xl mx-auto px-4">
                    <div className="text-center space-y-4">
                        <Badge className="w-fit mx-auto bg-blue-500/20 text-blue-700 border-blue-300">
                            Join 10,000+ Partners
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
                            Grow Your Real Estate Business
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Partner with Reallanding to access exclusive listings, advanced tools, and a trusted community of agents and agencies.
                        </p>
                        <div className="pt-4">
                            <Link href="/apply/step/1">
                                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 group">
                                    Start Application
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Network Overview Section */}
            <section className="py-16">
                <div className="container max-w-4xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Left: Content */}
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-slate-900">Why Join Reallanding?</h2>
                            <p className="text-slate-600 leading-relaxed">
                                Reallanding is a trusted platform connecting real estate professionals with property opportunities and qualified clients. We provide verified professionals, secure transactions, and modern tools to help you succeed.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-slate-700">Access to 50,000+ properties and qualified leads</span>
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-slate-700">Advanced tools and real-time analytics</span>
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-slate-700">Secure platform with verified professionals</span>
                                </li>
                            </ul>
                        </div>

                        {/* Right: Stats */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mb-3">
                                    <Users className="w-5 h-5 text-white" />
                                </div>
                                <p className="text-2xl font-bold text-slate-900">10K+</p>
                                <p className="text-sm text-slate-600">Active Partners</p>
                            </div>
                            <div className="p-6 bg-cyan-50 rounded-lg border border-cyan-200">
                                <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center mb-3">
                                    <Building2 className="w-5 h-5 text-white" />
                                </div>
                                <p className="text-2xl font-bold text-slate-900">50K+</p>
                                <p className="text-sm text-slate-600">Properties</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-slate-900 text-white">
                <div className="container max-w-2xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                    <p className="text-slate-300 mb-8">
                        Complete a few simple steps to join our growing network of real estate professionals.
                    </p>
                    <Link href="/apply/step/1">
                        <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 group">
                            Begin Application
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
