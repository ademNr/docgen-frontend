'use client';

import { useAuth } from '../../app/context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingPage from '../LoadingPage';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return (
            <LoadingPage />
        );
    }

    return <>{children}</>;
}