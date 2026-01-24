'use client';

import { useEffect } from 'react';
import { useApplyForm } from '@/lib/apply-context';
import { ApplyStep3 } from '@/components/apply/steps/apply-step3';

export const dynamic = 'force-dynamic';

export default function Step3Page() {
    const { goToStep } = useApplyForm();

    // Sync context state with URL on mount
    useEffect(() => {
        goToStep(3);
    }, [goToStep]);

    return (
        <div className="container max-w-4xl mx-auto py-8 px-4">
            <ApplyStep3 />
        </div>
    );
}
