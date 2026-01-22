'use client';

import { useEffect } from 'react';
import { useApplyForm } from '@/lib/apply-context';
import { ApplyStep2 } from '@/components/apply/steps/apply-step2';

export default function Step2Page() {
    const { currentStep, goToStep } = useApplyForm();

    useEffect(() => {
        if (currentStep !== 2) {
            goToStep(2);
        }
    }, [currentStep, goToStep]);

    return (
        <div className="container max-w-4xl mx-auto py-8 px-4">
            <ApplyStep2 />
        </div>
    );
}
