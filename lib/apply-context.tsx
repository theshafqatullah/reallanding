'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { UserType } from '@/types/appwrite';

export interface ApplyFormData {
    userType: UserType | null;

    // Shared fields
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    timezone: string;
    bio: string;
    serviceAreas: string;
    specializations: string;
    languagesSpoken: string;
    preferredContactMethod: 'email' | 'phone' | 'whatsapp';
    city: string;
    state: string;
    country: string;
    website_url: string;
    socialMediaLinkedin: string;
    socialMediaInstagram: string;
    socialMediaFacebook: string;
    responseTimeHours: number;

    // Agent-specific
    licenseNumber: string;
    designation: string;
    experienceYears: number;
    companyName: string;
    certifications: string;

    // Agency-specific
    companyNameAgency: string;
    registrationNumber: string;
    establishedYear: number;
    teamSize: number;
    brokerName: string;
    brokerLicense: string;
    reraRegistration: string;
    propertyTypesHandled: string;
}

interface ApplyContextType {
    currentStep: number;
    totalSteps: number;
    formData: ApplyFormData;
    updateFormData: (data: Partial<ApplyFormData>) => void;
    nextStep: () => void;
    previousStep: () => void;
    goToStep: (step: number) => void;
    resetForm: () => void;
    isStepValid: (step: number) => boolean;
}

const defaultFormData: ApplyFormData = {
    userType: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    timezone: '',
    bio: '',
    serviceAreas: '',
    specializations: '',
    languagesSpoken: '',
    preferredContactMethod: 'email',
    city: '',
    state: '',
    country: '',
    website_url: '',
    socialMediaLinkedin: '',
    socialMediaInstagram: '',
    socialMediaFacebook: '',
    responseTimeHours: 24,
    licenseNumber: '',
    designation: '',
    experienceYears: 0,
    companyName: '',
    certifications: '',
    companyNameAgency: '',
    registrationNumber: '',
    establishedYear: new Date().getFullYear(),
    teamSize: 1,
    brokerName: '',
    brokerLicense: '',
    reraRegistration: '',
    propertyTypesHandled: '',
};

const ApplyContext = createContext<ApplyContextType | undefined>(undefined);

export function ApplyProvider({ children }: { children: React.ReactNode }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<ApplyFormData>(defaultFormData);

    const updateFormData = useCallback((data: Partial<ApplyFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    }, []);

    const nextStep = useCallback(() => {
        setCurrentStep(prev => Math.min(prev + 1, 3));
    }, []);

    const previousStep = useCallback(() => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    }, []);

    const goToStep = useCallback((step: number) => {
        if (step >= 1 && step <= 3) {
            setCurrentStep(step);
        }
    }, []);

    const resetForm = useCallback(() => {
        setCurrentStep(1);
        setFormData(defaultFormData);
    }, []);

    const isStepValid = useCallback((step: number): boolean => {
        switch (step) {
            case 1:
                return formData.userType !== null;
            case 2:
                const requiredFields = [
                    formData.firstName,
                    formData.lastName,
                    formData.phone,
                    formData.timezone,
                    formData.bio,
                    formData.serviceAreas,
                    formData.specializations,
                    formData.languagesSpoken,
                    formData.city,
                    formData.state,
                    formData.country,
                ];

                if (formData.userType === UserType.AGENT) {
                    requiredFields.push(
                        formData.licenseNumber,
                        formData.designation,
                        String(formData.experienceYears)
                    );
                } else if (formData.userType === UserType.AGENCY) {
                    requiredFields.push(
                        formData.companyNameAgency,
                        formData.registrationNumber,
                        String(formData.teamSize)
                    );
                }

                return requiredFields.every(field => String(field).trim() !== '');
            case 3:
                return true; // Review step is always valid
            default:
                return false;
        }
    }, [formData]);

    return (
        <ApplyContext.Provider
            value={{
                currentStep,
                totalSteps: 3,
                formData,
                updateFormData,
                nextStep,
                previousStep,
                goToStep,
                resetForm,
                isStepValid,
            }}
        >
            {children}
        </ApplyContext.Provider>
    );
}

export function useApplyForm() {
    const context = useContext(ApplyContext);
    if (context === undefined) {
        throw new Error('useApplyForm must be used within an ApplyProvider');
    }
    return context;
}
