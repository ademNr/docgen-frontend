'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import LoadingPage from '@/components/LoadingPage';
import { useAuth } from '../context/AuthContext';

// Create a separate component for the content that uses useSearchParams
function CallbackContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const code = searchParams.get('code');
    const { saveToken } = useAuth(); // Get saveToken from context
    useEffect(() => {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
        const exchangeToken = async () => {
            try {
                // Call your EXPRESS BACKEND directly
                const response = await fetch(`${backendUrl}/api/auth/github`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code }),
                });

                if (!response.ok) {
                    throw new Error('Token exchange failed');
                }

                const data = await response.json();
                // Save token to localStorage
                localStorage.setItem('github_token', data.token);
                saveToken(data.token, data.userId);
                router.push('/repos');

            } catch (error) {
                console.error('Authentication error:', error);

            }
        };

        if (code) {
            exchangeToken();
        }
    }, [code, router, saveToken]);

    return (
        <LoadingPage message='Authenticating with Github' subMessage='Wait a few seconds' />
    );
}

// Main component with Suspense boundary
export default function CallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading authentication...</p>
                </div>
            </div>
        }>
            <CallbackContent />
        </Suspense>
    );
}