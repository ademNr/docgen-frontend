'use client';

import { useRouter } from 'next/navigation';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    token: string | null;
    login: () => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean; // Add loading state
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Track initialization
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem('github_token');
        if (storedToken) {
            setToken(storedToken);
        }
        setIsLoading(false);
    }, []);

    const login = () => {
        const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
        const redirectUri = encodeURIComponent(`${window.location.origin}/callback`);
        const scope = 'repo';
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
        window.location.href = githubAuthUrl;
    };

    const logout = () => {
        localStorage.removeItem('github_token');
        setToken(null);
        router.push('/login');
    };

    const saveToken = (newToken: string) => {
        localStorage.setItem('github_token', newToken);
        setToken(newToken);
        router.push('/repos');
    };

    return (
        <AuthContext.Provider value={{
            token,
            login,
            logout,
            isAuthenticated: !!token,
            isLoading
        }}>
            {children}
            <TokenSaver saveToken={saveToken} />
        </AuthContext.Provider>
    );
};

const TokenSaver = ({ saveToken }: { saveToken: (token: string) => void }) => {
    const router = useRouter();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            saveToken(token);
            // Clear token from URL
            router.replace('/repos');
        }
    }, [saveToken, router]);

    return null;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};