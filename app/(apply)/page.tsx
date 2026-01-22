'use client';

import { useApplyForm } from '@/lib/apply-context';
import { ApplyStep1 } from '@/components/apply/steps/apply-step1';
import { ApplyStep2 } from '@/components/apply/steps/apply-step2';
import { ApplyStep3 } from '@/components/apply/steps/apply-step3';

export default function ApplyPage() {
    const { currentStep } = useApplyForm();

    return (
        <div className="container max-w-4xl mx-auto py-8 px-4">
            {currentStep === 1 && <ApplyStep1 />}
            {currentStep === 2 && <ApplyStep2 />}
            {currentStep === 3 && <ApplyStep3 />}
        </div>
    );
}
