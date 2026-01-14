"use client";

import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { useAuthStore } from "./index";

// ============================================================================
// Auth Context (for components that need reactive auth state)
// ============================================================================

interface AuthContextValue {
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextValue>({ isInitialized: false });

export const useAuthContext = () => useContext(AuthContext);

// ============================================================================
// Auth Provider Component
// ============================================================================

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const initialize = useAuthStore((state) => state.initialize);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <AuthContext.Provider value={{ isInitialized: !loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// ============================================================================
// Auth Guard Component
// ============================================================================

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

export function AuthGuard({
  children,
  fallback = null,
  redirectTo = "/signin",
}: AuthGuardProps) {
  const [isReady, setIsReady] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loading = useAuthStore((state) => state.loading);
  const initialize = useAuthStore((state) => state.initialize);

  // Initialize auth state on mount
  useEffect(() => {
    let mounted = true;
    
    const init = async () => {
      await initialize();
      if (mounted) {
        setIsReady(true);
      }
    };
    
    init();
    
    return () => {
      mounted = false;
    };
  }, [initialize]);

  useEffect(() => {
    if (isReady && !loading && !isAuthenticated && redirectTo) {
      window.location.href = redirectTo;
    }
  }, [isReady, loading, isAuthenticated, redirectTo]);

  if (!isReady || loading) {
    return <>{fallback}</>;
  }

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// ============================================================================
// Guest Guard Component (for auth pages)
// ============================================================================

interface GuestGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

export function GuestGuard({
  children,
  fallback = null,
  redirectTo = "/",
}: GuestGuardProps) {
  const [isReady, setIsReady] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loading = useAuthStore((state) => state.loading);
  const initialize = useAuthStore((state) => state.initialize);

  // Initialize auth state on mount
  useEffect(() => {
    let mounted = true;
    
    const init = async () => {
      await initialize();
      if (mounted) {
        setIsReady(true);
      }
    };
    
    init();
    
    return () => {
      mounted = false;
    };
  }, [initialize]);

  useEffect(() => {
    if (isReady && !loading && isAuthenticated && redirectTo) {
      window.location.href = redirectTo;
    }
  }, [isReady, loading, isAuthenticated, redirectTo]);

  if (!isReady || loading) {
    return <>{fallback}</>;
  }

  if (isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// ============================================================================
// Role Guard Component
// ============================================================================

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
  redirectTo?: string;
}

export function RoleGuard({
  children,
  allowedRoles,
  fallback = null,
  redirectTo,
}: RoleGuardProps) {
  const [isReady, setIsReady] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userType = useAuthStore((state) => state.userType);
  const loading = useAuthStore((state) => state.loading);
  const initialize = useAuthStore((state) => state.initialize);

  // Initialize auth state on mount
  useEffect(() => {
    let mounted = true;
    
    const init = async () => {
      await initialize();
      if (mounted) {
        setIsReady(true);
      }
    };
    
    init();
    
    return () => {
      mounted = false;
    };
  }, [initialize]);

  const hasAccess = isAuthenticated && userType && allowedRoles.includes(userType);

  useEffect(() => {
    if (isReady && !loading && !hasAccess && redirectTo) {
      window.location.href = redirectTo;
    }
  }, [isReady, loading, hasAccess, redirectTo]);

  if (!isReady || loading) {
    return <>{fallback}</>;
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export default AuthProvider;
