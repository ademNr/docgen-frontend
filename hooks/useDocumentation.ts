// hooks/useDocumentation.ts
import { useState, useEffect } from 'react';
import { Documentation } from '../types/documentation';

export const useDocumentation = (token: string | null, userId: string | null, repoFullName: string | null) => {
    const [documentation, setDocumentation] = useState<Documentation>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [statusMessage, setStatusMessage] = useState('Initializing...');
    const [currentFile, setCurrentFile] = useState<string | null>(null);
    const [creditsError, setCreditsError] = useState(false);
    // In your useDocumentation hook or component

    useEffect(() => {
        if (!token || !repoFullName || !userId) return;

        const fetchDocumentation = async () => {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
            const [owner, repo] = repoFullName.split('/');

            try {
                const eventSource = new EventSource(
                    `${backendUrl}/api/docs/generate-progress?owner=${owner}&repo=${repo}&token=${token}`
                );

                eventSource.onmessage = (event) => {
                    console.log(event.data);
                    const data = JSON.parse(event.data);
                    if (data.progress) setProgress(data.progress);
                    if (data.message) setStatusMessage(data.message);
                    if (data.currentFile) setCurrentFile(data.currentFile);
                };

                eventSource.onerror = () => {
                    eventSource.close();
                    setError('Progress tracking failed');
                };

                const response = await fetch(`${backendUrl}/api/docs/generate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ token, owner, repo, includeTests: false, userId })
                });

                if (!response.ok) {
                    // Check for credit-related error (status 402 is Payment Required)
                    if (response.status === 402) {
                        setCreditsError(true);
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setDocumentation(data.documentation);
            } catch (err) {
                if (!creditsError) {
                    setError(err instanceof Error ? err.message : 'An unknown error occurred');
                }

            } finally {
                setLoading(false);
            }
        };
        fetchDocumentation();
    }, [token, repoFullName, userId]);

    return { documentation, loading, error, creditsError, progress, statusMessage, currentFile };
};