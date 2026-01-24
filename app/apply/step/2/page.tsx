'use client';

import { useEffect } from 'react';
import { useApplyForm } from '@/lib/apply-context';
import { ApplyStep2 } from '@/components/apply/steps/apply-step2';

export const dynamic = 'force-dynamic';

export default function Step2Page() {
    const { goToStep } = useApplyForm();

    // Sync context state with URL on mount
    useEffect(() => {
        goToStep(2);
    }, [goToStep]);

    return (
        <div className="container max-w-4xl mx-auto py-8 px-4">
            <ApplyStep2 />
        </div>
    );
}
