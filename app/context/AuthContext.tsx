'use client';

import { useRouter } from 'next/navigation';
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface AuthContextType {
    token: string | null;
    userId: string | null;
    login: () => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
    saveToken: (token: string, userId: string) => void; // Add this line
}
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Initialize from localStorage
    useEffect(() => {
        setToken(localStorage.getItem('github_token'));
        setUserId(localStorage.getItem('userId'));
        setIsLoading(false);
    }, []);

    const login = useCallback(() => {
        const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
        const redirectUri = encodeURIComponent(window.location.origin + '/callback');
        const scope = 'repo';
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('github_token');
        localStorage.removeItem('userId');
        setToken(null);
        setUserId(null);
        router.push('/');
    }, [router]);

    const saveToken = useCallback((newToken: string, newUserId: string) => {
        localStorage.setItem('github_token', newToken);
        localStorage.setItem('userId', newUserId);
        setToken(newToken);
        setUserId(newUserId);
        router.push('/repos');
    }, [router]);

    return (
        <AuthContext.Provider
            value={{
                token,
                userId,
                login,
                logout,
                saveToken,
                isAuthenticated: !!token,
                isLoading,

            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};