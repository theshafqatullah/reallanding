'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Building2, Users, CheckCircle2 } from 'lucide-react';

export default function ApplyPage() {
    return (
        <div className="h-screen bg-gradient-to-br from-primary/10 via-white to-secondary/30 flex items-center justify-center">
            <div className="container max-w-4xl mx-auto px-4">
                <div className="text-center space-y-8">
                    {/* Badge */}
                    <Badge className="bg-primary/20 text-primary border-primary/30 px-4 py-1.5">
                        Join 10,000+ Partners
                    </Badge>

                    {/* Main Heading */}
                    <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
                        Grow Your Real Estate Business
                    </h1>

                    {/* Description */}
                    <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
                        Partner with Reallanding to access exclusive listings, advanced tools, and a trusted community of agents and agencies.
                    </p>

                    {/* Stats Row */}
                    <div className="flex items-center justify-center gap-8 py-4">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-left">
                                <p className="text-xl font-bold text-slate-900">10K+</p>
                                <p className="text-xs text-slate-500">Partners</p>
                            </div>
                        </div>
                        <div className="w-px h-10 bg-slate-200" />
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-left">
                                <p className="text-xl font-bold text-slate-900">50K+</p>
                                <p className="text-xs text-slate-500">Properties</p>
                            </div>
                        </div>
                        <div className="w-px h-10 bg-slate-200" />
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-primary/90 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-left">
                                <p className="text-xl font-bold text-slate-900">100%</p>
                                <p className="text-xs text-slate-500">Verified</p>
                            </div>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-4">
                        <Link href="/apply/step/1">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-lg px-8 py-6 group"
                            >
                                Start Application
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>

                    {/* Sub-text */}
                    <p className="text-sm text-slate-500">
                        Takes only 5 minutes to complete • No credit card required
                    </p>
                </div>
            </div>
        </div>
    );
}
