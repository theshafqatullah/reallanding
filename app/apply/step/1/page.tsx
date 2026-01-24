'use client';

import { useEffect } from 'react';
import { useApplyForm } from '@/lib/apply-context';
import { ApplyStep1 } from '@/components/apply/steps/apply-step1';

export const dynamic = 'force-dynamic';

export default function Step1Page() {
    const { goToStep } = useApplyForm();

    // Sync context state with URL on mount
    useEffect(() => {
        goToStep(1);
    }, [goToStep]);

    return (
        <div className="container max-w-4xl mx-auto py-8 px-4">
            <ApplyStep1 />
        </div>
    );
}
