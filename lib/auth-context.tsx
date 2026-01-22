'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { account } from '@/services/appwrite';
import type { Models } from 'appwrite';

interface AuthContextType {
    user: Models.User<Models.Preferences> | null;
    isLoading: boolean;
    error: string | null;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const checkAuth = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const currentUser = await account.get();
            setUser(currentUser);
        } catch (err) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const logout = useCallback(async () => {
        try {
            await account.deleteSession('current');
            setUser(null);
        } catch (err) {
            console.error('Logout error:', err);
            throw err;
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoading, error, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
