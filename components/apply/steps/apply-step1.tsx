'use client';

import React from 'react';
import { useApplyForm } from '@/lib/apply-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserType } from '@/types/appwrite';
import { Building2, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ApplyStep1() {
    const { formData, updateFormData, nextStep, isStepValid } = useApplyForm();

    const handleSelectRole = (role: UserType) => {
        updateFormData({ userType: role });
    };

    const handleContinue = () => {
        if (isStepValid(1)) {
            nextStep();
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Join Our Network</h1>
                <p className="text-lg text-muted-foreground">
                    Choose how you'd like to join as a real estate professional
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Individual Agent Card */}
                <Card
                    className={cn(
                        'cursor-pointer transition-all duration-200 hover:shadow-lg',
                        formData.userType === UserType.AGENT && 'ring-2 ring-primary shadow-lg'
                    )}
                    onClick={() => handleSelectRole(UserType.AGENT)}
                >
                    <CardHeader>
                        <div
                            className={cn(
                                'w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors duration-200',
                                formData.userType === UserType.AGENT ? 'bg-primary text-white' : 'bg-primary/10'
                            )}
                        >
                            <User className="w-6 h-6" />
                        </div>
                        <CardTitle>Individual Agent</CardTitle>
                        <CardDescription>Apply as a real estate agent</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-6">
                            Perfect for independent professionals looking to list and manage properties on your own.
                        </p>
                        <div className="space-y-2 text-sm">
                            <div className="flex gap-2">
                                <span className="text-primary">✓</span>
                                <span>Professional license required</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-primary">✓</span>
                                <span>Experience tracked</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-primary">✓</span>
                                <span>List and manage properties</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Agency Card */}
                <Card
                    className={cn(
                        'cursor-pointer transition-all duration-200 hover:shadow-lg',
                        formData.userType === UserType.AGENCY && 'ring-2 ring-primary shadow-lg'
                    )}
                    onClick={() => handleSelectRole(UserType.AGENCY)}
                >
                    <CardHeader>
                        <div
                            className={cn(
                                'w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors duration-200',
                                formData.userType === UserType.AGENCY ? 'bg-primary text-white' : 'bg-primary/10'
                            )}
                        >
                            <Building2 className="w-6 h-6" />
                        </div>
                        <CardTitle>Agency</CardTitle>
                        <CardDescription>Apply as a real estate agency</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-6">
                            For established agencies managing multiple agents and properties professionally.
                        </p>
                        <div className="space-y-2 text-sm">
                            <div className="flex gap-2">
                                <span className="text-primary">✓</span>
                                <span>Manage team of agents</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-primary">✓</span>
                                <span>Regulatory compliance</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-primary">✓</span>
                                <span>Advanced analytics & tools</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Continue Button */}
            <div className="flex justify-center pt-6">
                <Button
                    size="lg"
                    onClick={handleContinue}
                    disabled={!isStepValid(1)}
                    className="min-w-xs"
                >
                    Continue to Details
                </Button>
            </div>

            {/* Info Box */}
            <Card className="bg-blue-50 border-blue-200 mt-8">
                <CardContent className="pt-6">
                    <h3 className="font-semibold text-blue-900 mb-2">About the Application Process</h3>
                    <ul className="space-y-2 text-sm text-blue-800">
                        <li className="flex gap-2">
                            <span className="flex-shrink-0">•</span>
                            <span>The process takes about 5-10 minutes to complete</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="flex-shrink-0">•</span>
                            <span>You'll need your professional credentials ready</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="flex-shrink-0">•</span>
                            <span>After submission, our team will review your application</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
