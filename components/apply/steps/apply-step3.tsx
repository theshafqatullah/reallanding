'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useApplyForm } from '@/lib/apply-context';
import { useAuth } from '@/lib/auth-context';
import { usersService } from '@/services/users';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { UserType } from '@/types/appwrite';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ApplyStep3() {
    const router = useRouter();
    const { formData, previousStep, resetForm } = useApplyForm();
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isAgent = formData.userType === UserType.AGENT;
    const isAgency = formData.userType === UserType.AGENCY;

    const handleBack = () => {
        previousStep();
        router.push('/apply/step/2');
    };

    const handleSubmit = useCallback(async () => {
        if (!user) {
            toast.error('You must be logged in to submit');
            router.push('/signin');
            return;
        }

        setIsSubmitting(true);
        try {
            // Create initial profile with basic info
            const userProfile = await usersService.create({
                user_id: user.$id,
                email: user.email,
                first_name: formData.firstName,
                last_name: formData.lastName,
                phone: formData.phone,
                user_type: formData.userType || UserType.USER,
            });

            // Update with full application data
            const updateData: any = {
                timezone: formData.timezone,
                bio: formData.bio,
                service_areas: formData.serviceAreas,
                specializations: formData.specializations,
                languages_spoken: formData.languagesSpoken,
                preferred_contact_method: formData.preferredContactMethod,
                city: formData.city,
                state: formData.state,
                country: formData.country,
                response_time_hours: formData.responseTimeHours,
                account_status: 'pending',
                profile_completion_percentage: 40,
            };

            if (isAgent) {
                updateData.license_number = formData.licenseNumber;
                updateData.designation = formData.designation;
                updateData.experience_years = formData.experienceYears;
                updateData.company_name = formData.companyName || null;
                updateData.certifications = formData.certifications || null;
            } else if (isAgency) {
                updateData.company_name = formData.companyNameAgency;
                updateData.registration_number = formData.registrationNumber;
                updateData.team_size = formData.teamSize;
                updateData.established_year = formData.establishedYear;
                updateData.broker_name = formData.brokerName || null;
                updateData.broker_license = formData.brokerLicense || null;
                updateData.rera_registration = formData.reraRegistration || null;
                updateData.property_types_handled = formData.propertyTypesHandled || null;
            }

            await usersService.update(userProfile.$id, updateData);

            toast.success('Application submitted successfully!');
            resetForm();
            router.push(`/profile/${userProfile.$id}/complete`);
        } catch (error) {
            console.error('Error submitting application:', error);
            toast.error('Failed to submit application. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }, [user, router, formData, isAgent, isAgency, resetForm]);

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen px-4">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground mb-4">Please sign in to submit your application</p>
                        <Button className="w-full" onClick={() => router.push('/signin')}>
                            Sign In
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Review Your Application</h1>
                    <p className="text-muted-foreground mt-1">Please verify all information before submitting</p>
                </div>
            </div>

            {/* Personal Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">First Name</p>
                            <p className="font-semibold">{formData.firstName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Last Name</p>
                            <p className="font-semibold">{formData.lastName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-semibold">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Phone</p>
                            <p className="font-semibold">{formData.phone}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">City</p>
                            <p className="font-semibold">{formData.city}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">State/Province</p>
                            <p className="font-semibold">{formData.state}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Country</p>
                            <p className="font-semibold">{formData.country}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Timezone</p>
                            <p className="font-semibold">{formData.timezone}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Professional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Account Type</p>
                        <p className="font-semibold capitalize">{formData.userType}</p>
                    </div>

                    {isAgent && (
                        <>
                            <div className="grid md:grid-cols-2 gap-4 pt-2 border-t">
                                <div>
                                    <p className="text-sm text-muted-foreground">License Number</p>
                                    <p className="font-semibold">{formData.licenseNumber}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Designation</p>
                                    <p className="font-semibold">{formData.designation}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Years of Experience</p>
                                    <p className="font-semibold">{formData.experienceYears} years</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Company/Brokerage</p>
                                    <p className="font-semibold">{formData.companyName || 'Not provided'}</p>
                                </div>
                            </div>
                            {formData.certifications && (
                                <div className="pt-2 border-t">
                                    <p className="text-sm text-muted-foreground">Certifications</p>
                                    <p className="font-semibold">{formData.certifications}</p>
                                </div>
                            )}
                        </>
                    )}

                    {isAgency && (
                        <>
                            <div className="grid md:grid-cols-2 gap-4 pt-2 border-t">
                                <div>
                                    <p className="text-sm text-muted-foreground">Company Name</p>
                                    <p className="font-semibold">{formData.companyNameAgency}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Registration Number</p>
                                    <p className="font-semibold">{formData.registrationNumber}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Team Size</p>
                                    <p className="font-semibold">{formData.teamSize} agents</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Established Year</p>
                                    <p className="font-semibold">{formData.establishedYear}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Broker Name</p>
                                    <p className="font-semibold">{formData.brokerName || 'Not provided'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Broker License</p>
                                    <p className="font-semibold">{formData.brokerLicense || 'Not provided'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">RERA Registration</p>
                                    <p className="font-semibold">{formData.reraRegistration || 'Not provided'}</p>
                                </div>
                            </div>
                            {formData.propertyTypesHandled && (
                                <div className="pt-2 border-t">
                                    <p className="text-sm text-muted-foreground">Property Types Handled</p>
                                    <p className="font-semibold">{formData.propertyTypesHandled}</p>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Service Details */}
            <Card>
                <CardHeader>
                    <CardTitle>Service Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Specializations</p>
                        <p className="font-semibold">{formData.specializations}</p>
                    </div>
                    <div className="pt-2 border-t">
                        <p className="text-sm text-muted-foreground">Service Areas</p>
                        <p className="font-semibold">{formData.serviceAreas}</p>
                    </div>
                    <div className="pt-2 border-t">
                        <p className="text-sm text-muted-foreground">Languages Spoken</p>
                        <p className="font-semibold">{formData.languagesSpoken}</p>
                    </div>
                    <div className="pt-2 border-t">
                        <p className="text-sm text-muted-foreground">Professional Bio</p>
                        <p className="font-semibold whitespace-pre-wrap">{formData.bio}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Contact Preferences */}
            <Card>
                <CardHeader>
                    <CardTitle>Contact Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Preferred Contact Method</p>
                            <p className="font-semibold capitalize">{formData.preferredContactMethod}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Response Time</p>
                            <p className="font-semibold">{formData.responseTimeHours} hours</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Info Box */}
            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                    <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-blue-900 mb-2">Before you submit</h3>
                            <ul className="space-y-1 text-sm text-blue-800">
                                <li className="flex gap-2">
                                    <span className="flex-shrink-0">•</span>
                                    <span>Please review all information carefully</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="flex-shrink-0">•</span>
                                    <span>You can go back and edit any section</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="flex-shrink-0">•</span>
                                    <span>After submission, our team will review your application</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="flex-shrink-0">•</span>
                                    <span>You'll receive an email once your profile is verified</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-6">
                <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    size="lg"
                    className="flex-1"
                >
                    {isSubmitting ? (
                        <>
                            <Spinner className="w-4 h-4 mr-2" />
                            Submitting...
                        </>
                    ) : (
                        'Submit Application'
                    )}
                </Button>
            </div>

            {/* Terms */}
            <p className="text-xs text-muted-foreground text-center">
                By submitting this application, you agree to our Terms of Service and Privacy Policy
            </p>
        </div>
    );
}
