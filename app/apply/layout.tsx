'use client';

import React from 'react';
import { AuthProvider } from '@/lib/auth-context';
import { AuthHydrator } from '@/components/auth/auth-hydrator';
import { ApplyProvider } from '@/lib/apply-context';
import { ApplyProgressBar } from '@/components/apply/apply-progress-bar';

export default function ApplyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <AuthHydrator>
                <ApplyProvider>
                    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
                        <ApplyProgressBar />
                        {children}
                    </main>
                </ApplyProvider>
            </AuthHydrator>
        </AuthProvider>
    );
}
