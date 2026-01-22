'use client';

import { useEffect } from 'react';
import { useApplyForm } from '@/lib/apply-context';
import { ApplyStep3 } from '@/components/apply/steps/apply-step3';

export const dynamic = 'force-dynamic';

export default function Step3Page() {
    const { currentStep, goToStep } = useApplyForm();

    useEffect(() => {
        if (currentStep !== 3) {
            goToStep(3);
        }
    }, [currentStep, goToStep]);

    return (
        <div className="container max-w-4xl mx-auto py-8 px-4">
            <ApplyStep3 />
        </div>
    );
}
