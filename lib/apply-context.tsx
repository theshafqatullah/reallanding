'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { UserType } from '@/types/appwrite';

const STORAGE_KEY = 'reallanding_apply_form';

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
    saveToStorage: () => void;
    loadFromStorage: () => void;
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
    const [isMounted, setIsMounted] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        setIsMounted(true);
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                setFormData(parsed.formData || defaultFormData);
                setCurrentStep(parsed.currentStep || 1);
            }
        } catch (error) {
            console.error('Failed to load form data from storage:', error);
        }
    }, []);

    const saveToStorage = useCallback(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, currentStep }));
        }
    }, [formData, currentStep]);

    const loadFromStorage = useCallback(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem(STORAGE_KEY);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    setFormData(parsed.formData || defaultFormData);
                    setCurrentStep(parsed.currentStep || 1);
                }
            } catch (error) {
                console.error('Failed to load form data from storage:', error);
            }
        }
    }, []);

    const updateFormData = useCallback((data: Partial<ApplyFormData>) => {
        setFormData(prev => {
            const updated = { ...prev, ...data };
            if (isMounted && typeof window !== 'undefined') {
                localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData: updated, currentStep }));
            }
            return updated;
        });
    }, [isMounted, currentStep]);

    const nextStep = useCallback(() => {
        setCurrentStep(prev => {
            const next = Math.min(prev + 1, 3);
            if (isMounted && typeof window !== 'undefined') {
                localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, currentStep: next }));
            }
            return next;
        });
    }, [isMounted, formData]);

    const previousStep = useCallback(() => {
        setCurrentStep(prev => {
            const next = Math.max(prev - 1, 1);
            if (isMounted && typeof window !== 'undefined') {
                localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, currentStep: next }));
            }
            return next;
        });
    }, [isMounted, formData]);

    const goToStep = useCallback((step: number) => {
        if (step >= 1 && step <= 3) {
            setCurrentStep(step);
            if (isMounted && typeof window !== 'undefined') {
                localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, currentStep: step }));
            }
        }
    }, [isMounted, formData]);

    const resetForm = useCallback(() => {
        setCurrentStep(1);
        setFormData(defaultFormData);
        if (isMounted && typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [isMounted]);

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
                saveToStorage,
                loadFromStorage,
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
