'use client';

import React from 'react';
import { useApplyForm } from '@/lib/apply-context';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UserType } from '@/types/appwrite';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft } from 'lucide-react';

// Shared validation schema for all fields
const detailsSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    phone: z.string().regex(/^[\d\s\-\+\(\)]+$/, 'Valid phone number required'),
    timezone: z.string().min(1, 'Timezone is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    country: z.string().min(2, 'Country is required'),
    bio: z.string().min(50, 'Bio must be at least 50 characters'),
    serviceAreas: z.string().min(10, 'Service areas description is required'),
    specializations: z.string().min(10, 'Specializations are required'),
    languagesSpoken: z.string().min(1, 'At least one language is required'),
    preferredContactMethod: z.enum(['email', 'phone', 'whatsapp']),
    responseTimeHours: z.string().min(1, 'Response time must be at least 1 hour').transform(v => Number(v) || 24).refine(n => n >= 1, 'Response time must be at least 1 hour'),

    // Agent fields
    licenseNumber: z.string().optional(),
    designation: z.string().optional(),
    experienceYears: z.string().optional().transform(v => v ? Number(v) : undefined).refine(n => !n || n > 0, 'Years of experience must be valid'),
    companyName: z.string().optional(),
    certifications: z.string().optional(),

    // Agency fields
    companyNameAgency: z.string().optional(),
    registrationNumber: z.string().optional(),
    establishedYear: z.string().optional().transform(v => v ? Number(v) : undefined).refine(n => !n || n > 1900, 'Established year must be valid'),
    teamSize: z.string().optional().transform(v => v ? Number(v) : undefined).refine(n => !n || n > 0, 'Team size must be valid'),
    brokerName: z.string().optional(),
    brokerLicense: z.string().optional(),
    reraRegistration: z.string().optional(),
    propertyTypesHandled: z.string().optional(),
});

type DetailsFormValues = z.infer<typeof detailsSchema>;

export function ApplyStep2() {
    const { formData, updateFormData, nextStep, previousStep, isStepValid } = useApplyForm();
    const { user } = useAuth();

    const form = useForm<DetailsFormValues>({
        // @ts-ignore - Zod schema transformation type compatibility
        resolver: zodResolver(detailsSchema),
        mode: 'onBlur',
        defaultValues: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            timezone: formData.timezone,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            bio: formData.bio,
            serviceAreas: formData.serviceAreas,
            specializations: formData.specializations,
            languagesSpoken: formData.languagesSpoken,
            preferredContactMethod: formData.preferredContactMethod,
            responseTimeHours: formData.responseTimeHours,
            licenseNumber: formData.licenseNumber,
            designation: formData.designation,
            experienceYears: formData.experienceYears,
            companyName: formData.companyName,
            certifications: formData.certifications,
            companyNameAgency: formData.companyNameAgency,
            registrationNumber: formData.registrationNumber,
            establishedYear: formData.establishedYear,
            teamSize: formData.teamSize,
            brokerName: formData.brokerName,
            brokerLicense: formData.brokerLicense,
            reraRegistration: formData.reraRegistration,
            propertyTypesHandled: formData.propertyTypesHandled,
        },
    });

    const onSubmit = (data: DetailsFormValues) => {
        updateFormData(data);
        nextStep();
    };

    const isAgent = formData.userType === UserType.AGENT;
    const isAgency = formData.userType === UserType.AGENCY;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {isAgent ? 'Agent' : 'Agency'} Information
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Please provide your professional details
                    </p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First Name *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last Name *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="+1 (555) 123-4567" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="timezone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Timezone *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select timezone" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="EST">Eastern Standard Time</SelectItem>
                                                    <SelectItem value="CST">Central Standard Time</SelectItem>
                                                    <SelectItem value="MST">Mountain Standard Time</SelectItem>
                                                    <SelectItem value="PST">Pacific Standard Time</SelectItem>
                                                    <SelectItem value="GMT">GMT</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Agent-Specific Fields */}
                    {isAgent && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Professional Credentials</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="licenseNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>License Number *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="License #" {...field} />
                                                </FormControl>
                                                <FormDescription>Your real estate license number</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="designation"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Designation/Title *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Senior Real Estate Agent" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="experienceYears"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Years of Experience *</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="0" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="companyName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Company/Brokerage Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Your company name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="certifications"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Certifications</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="e.g., CRS, ABR, GRI, etc." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    )}

                    {/* Agency-Specific Fields */}
                    {isAgency && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Agency Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="companyNameAgency"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Company Name *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Agency Name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="registrationNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Registration/License Number *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="License #" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="teamSize"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Team Size *</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="Number of agents" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="establishedYear"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Established Year *</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder={new Date().getFullYear().toString()} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="brokerName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Broker Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Broker name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="brokerLicense"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Broker License</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Broker license #" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="reraRegistration"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>RERA Registration (if applicable)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="RERA registration #" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    )}

                    {/* Shared Professional Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Professional Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="specializations"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Specializations *</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="e.g., Residential homes, Commercial properties, Investment properties"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="serviceAreas"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Service Areas *</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="e.g., Downtown, Suburbs, Waterfront areas" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {isAgency && (
                                <FormField
                                    control={form.control}
                                    name="propertyTypesHandled"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Property Types Handled *</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="e.g., Apartments, Villas, Commercial Spaces, Land"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            <FormField
                                control={form.control}
                                name="languagesSpoken"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Languages Spoken *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., English, Spanish, French" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Professional Bio *</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Tell us about yourself and what makes you unique..."
                                                {...field}
                                                rows={4}
                                            />
                                        </FormControl>
                                        <FormDescription>Minimum 50 characters</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Location Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Location</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>City *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="City" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="state"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>State/Province *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="State" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="country"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Country *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Country" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Preferences */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact & Availability</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="preferredContactMethod"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Preferred Contact Method *</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select method" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="email">Email</SelectItem>
                                                <SelectItem value="phone">Phone</SelectItem>
                                                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="responseTimeHours"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Typical Response Time (hours) *</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="24" {...field} />
                                        </FormControl>
                                        <FormDescription>How quickly you typically respond to inquiries</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={previousStep}
                            className="gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Button>
                        <Button type="submit" className="flex-1">
                            Continue to Review
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
