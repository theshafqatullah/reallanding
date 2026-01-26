'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useApplyForm } from '@/lib/apply-context';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ApplyProgressBar() {
    const router = useRouter();
    const pathname = usePathname();
    const { totalSteps, goToStep, isStepValid } = useApplyForm();

    // Derive current step from URL
    const currentStep = pathname?.includes('/step/3') ? 3
        : pathname?.includes('/step/2') ? 2
            : pathname?.includes('/step/1') ? 1
                : 0;

    const steps = [
        { number: 1, label: 'Select Role' },
        { number: 2, label: 'Enter Details' },
        { number: 3, label: 'Review & Submit' },
    ];

    const handleStepClick = (stepNumber: number) => {
        goToStep(stepNumber);
        router.push(`/apply/step/${stepNumber}`);
    };

    // Don't show progress bar on main apply page
    if (currentStep === 0) {
        return null;
    }

    return (
        <div className="sticky top-0 z-40 bg-white border-b">
            <div className="container max-w-4xl mx-auto px-4 py-6">
                {/* Logo */}
                <div className="mb-6">
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/logo.svg"
                            alt="Real Landing"
                            width={394}
                            height={181}
                            className="h-8 w-auto"
                            priority
                        />
                    </Link>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Steps */}
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => {
                        const isActive = step.number === currentStep;
                        const isCompleted = step.number < currentStep;
                        const isValid = isStepValid(step.number);

                        return (
                            <div key={step.number} className="flex-1 flex items-center">
                                <button
                                    onClick={() => handleStepClick(step.number)}
                                    disabled={!isValid && step.number > currentStep}
                                    className={cn(
                                        'flex items-center gap-3 transition-all duration-200',
                                        !isValid && step.number > currentStep && 'cursor-not-allowed opacity-50'
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200',
                                            isCompleted && 'bg-primary/10 text-primary',
                                            isActive && 'bg-primary text-white ring-2 ring-primary ring-offset-2',
                                            !isCompleted && !isActive && 'bg-muted text-muted-foreground'
                                        )}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle2 className="w-5 h-5" />
                                        ) : (
                                            <span className="font-semibold">{step.number}</span>
                                        )}
                                    </div>
                                    <div className="hidden sm:flex flex-col items-start">
                                        <span
                                            className={cn(
                                                'text-sm font-semibold',
                                                isActive ? 'text-primary' : isCompleted ? 'text-primary' : 'text-muted-foreground'
                                            )}
                                        >
                                            Step {step.number}
                                        </span>
                                        <span
                                            className={cn(
                                                'text-xs',
                                                isActive ? 'text-primary/80' : isCompleted ? 'text-primary/80' : 'text-muted-foreground/60'
                                            )}
                                        >
                                            {step.label}
                                        </span>
                                    </div>
                                </button>

                                {/* Connector line */}
                                {index < steps.length - 1 && (
                                    <div
                                        className={cn(
                                            'flex-1 h-1 mx-2 rounded-full transition-all duration-200',
                                            isCompleted ? 'bg-primary/20' : 'bg-muted'
                                        )}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Mobile step indicator */}
                <div className="sm:hidden text-center mt-4">
                    <p className="text-sm font-semibold text-primary">
                        Step {currentStep} of {totalSteps}: {steps[currentStep - 1].label}
                    </p>
                </div>
            </div>
        </div>
    );
}
