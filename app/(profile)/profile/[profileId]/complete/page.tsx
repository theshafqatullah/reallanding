'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/lib/auth-context';
import { usersService } from '@/services/users';
import { Users } from '@/types/appwrite';
import { toast } from 'sonner';
import { CheckCircle2, Upload, FileCheck } from 'lucide-react';
import Link from 'next/link';

export default function ProfileCompletionPage() {
    const router = useRouter();
    const params = useParams();
    const { user: authUser, isLoading: authLoading } = useAuth();

    const [profile, setProfile] = useState<Users | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [completionSteps] = useState([
        {
            id: 'profile',
            title: 'Profile Information',
            description: 'Basic information has been submitted',
            completed: true,
            icon: CheckCircle2,
        },
        {
            id: 'documents',
            title: 'Document Verification',
            description: 'Upload your license, ID, and other documents',
            completed: false,
            icon: Upload,
        },
        {
            id: 'background',
            title: 'Background Check',
            description: 'We will conduct a background check (24-48 hours)',
            completed: false,
            icon: FileCheck,
        },
        {
            id: 'approval',
            title: 'Final Approval',
            description: 'Your profile will be reviewed by our team',
            completed: false,
            icon: CheckCircle2,
        },
    ]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                const profileId = Array.isArray(params.profileId) ? params.profileId[0] : params.profileId;
                if (!profileId) {
                    throw new Error('Profile ID not found');
                }

                const fetchedProfile = await usersService.getById(profileId);
                if (!fetchedProfile) {
                    throw new Error('Profile not found');
                }

                setProfile(fetchedProfile);
            } catch (error) {
                console.error('Error fetching profile:', error);
                toast.error('Failed to load profile');
                router.push('/apply');
            } finally {
                setIsLoading(false);
            }
        };

        if (!authLoading) {
            fetchProfile();
        }
    }, [authLoading, params.profileId, router]);

    const handleContinue = useCallback(() => {
        if (profile) {
            router.push(`/profile/${profile.$id}/upload-documents`);
        }
    }, [profile, router]);

    const handleBackToDashboard = useCallback(() => {
        router.push('/');
    }, [router]);

    if (authLoading || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex items-center justify-center min-h-screen px-4">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">Profile not found</p>
                        <Button className="w-full mt-4" onClick={handleBackToDashboard}>
                            Go to Home
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container max-w-4xl mx-auto py-8 px-4">
            {/* Success Message */}
            <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-green-900">Application Submitted Successfully!</h3>
                        <p className="text-sm text-green-800 mt-1">
                            Thank you for applying. Your application has been received and is being processed.
                        </p>
                    </div>
                </div>
            </div>

            {/* Profile Summary */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Application Summary</CardTitle>
                    <CardDescription>Here's what we received</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="font-semibold">{profile.first_name} {profile.last_name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-semibold">{profile.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Role</p>
                            <p className="font-semibold capitalize">{profile.user_type}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Phone</p>
                            <p className="font-semibold">{profile.phone || 'Not provided'}</p>
                        </div>
                        {profile.user_type === 'agent' && (
                            <>
                                <div>
                                    <p className="text-sm text-muted-foreground">License Number</p>
                                    <p className="font-semibold">{profile.license_number || 'Not provided'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Experience</p>
                                    <p className="font-semibold">{profile.experience_years || 0} years</p>
                                </div>
                            </>
                        )}
                        {profile.user_type === 'agency' && (
                            <>
                                <div>
                                    <p className="text-sm text-muted-foreground">Company Name</p>
                                    <p className="font-semibold">{profile.company_name || 'Not provided'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Team Size</p>
                                    <p className="font-semibold">{profile.team_size || 0} agents</p>
                                </div>
                            </>
                        )}
                        <div>
                            <p className="text-sm text-muted-foreground">Location</p>
                            <p className="font-semibold">{profile.city}, {profile.state}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <p className="font-semibold capitalize text-primary">{profile.account_status}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Completion Steps */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Profile Completion Steps</CardTitle>
                    <CardDescription>Follow these steps to complete your profile</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {completionSteps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <div
                                    key={step.id}
                                    className="flex gap-4 pb-4 last:pb-0 last:border-0 border-b"
                                >
                                    <div className="flex-shrink-0">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step.completed ? 'bg-green-100' : 'bg-gray-100'
                                            }`}>
                                            <Icon className={`w-6 h-6 ${step.completed ? 'text-green-600' : 'text-gray-400'
                                                }`} />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`font-semibold ${step.completed ? 'text-green-700' : 'text-gray-700'
                                            }`}>
                                            {step.title}
                                        </h4>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {step.description}
                                        </p>
                                    </div>
                                    {index === 1 && (
                                        <div className="flex-shrink-0">
                                            <span className="inline-block bg-primary/20 text-primary text-xs px-3 py-1 rounded-full font-medium">
                                                Next
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Information Box */}
            <Card className="mb-8 bg-primary/10 border-primary/30">
                <CardContent className="pt-6">
                    <h3 className="font-semibold text-primary mb-2">What happens next?</h3>
                    <ul className="space-y-2 text-sm text-primary/80">
                        <li className="flex gap-2">
                            <span className="flex-shrink-0">•</span>
                            <span>You will need to upload verification documents (ID, license, etc.)</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="flex-shrink-0">•</span>
                            <span>Our team will conduct a background check (24-48 hours)</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="flex-shrink-0">•</span>
                            <span>Once approved, you can start listing properties and connecting with clients</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="flex-shrink-0">•</span>
                            <span>We'll send you an email confirmation once your profile is approved</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
                <Button
                    variant="outline"
                    size="lg"
                    onClick={handleBackToDashboard}
                >
                    Go to Home
                </Button>
                <Button
                    size="lg"
                    onClick={handleContinue}
                >
                    Upload Documents
                </Button>
            </div>

            {/* Help Link */}
            <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                    Have questions?{' '}
                    <Link href="/contact" className="text-primary hover:underline">
                        Contact our support team
                    </Link>
                </p>
            </div>
        </div>
    );
}
