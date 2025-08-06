import { useState, useEffect, useCallback } from 'react';
import { Repository } from '@/types/repo';
import { useAuth } from '../app/context/AuthContext';

export const useReposData = () => {
    const { token, userId } = useAuth();
    const [repos, setRepos] = useState<Repository[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userData, setUserData] = useState<Repository | null>(null);
    const [credits, setCredits] = useState<number>(0);
    const [isSubscribedLifeTime, setIsSubscribedLifeTime] = useState<boolean>(false);

    const fetchUserData = useCallback(async () => {
        try {
            const response = await fetch('https://api.github.com/user', {
                headers: { Authorization: `token ${token}` },
            });
            if (!response.ok) throw new Error('Failed to fetch user data');
            setUserData(await response.json());
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError('Failed to load user data');
        }
    }, [token]);

    const fetchCredits = useCallback(async () => {
        try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
            const response = await fetch(`${backendUrl}/api/user/credits`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId }),
            });


            const data = await response.json();
            setCredits(data.credits);
            setIsSubscribedLifeTime(data.isSubscribed);
        } catch (err) {
            console.error('Error fetching credits:', err);
        }
    }, [token, userId]);

    const fetchRepos = useCallback(async () => {
        try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
            const response = await fetch(`${backendUrl}/api/user/repos`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Failed to fetch repositories');
            setRepos(await response.json());
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token && userId) {
            Promise.all([fetchUserData(), fetchCredits(), fetchRepos()]);
        }
    }, [token, userId, fetchUserData, fetchCredits, fetchRepos]);

    return { repos, userData, credits, loading, error, isSubscribedLifeTime };
};