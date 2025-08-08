import { useState, useEffect } from 'react';
import { Documentation } from '../types/documentation';

export const useDocumentation = (token: string | null, userId: string | null, repoFullName: string | null) => {
    const [documentation, setDocumentation] = useState<Documentation>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [statusMessage, setStatusMessage] = useState('Initializing...');

    const [creditsError, setCreditsError] = useState(false);

    // Simulated progress steps
    const progressSteps = [
        { progress: 5, message: 'Starting documentation generation...' },
        { progress: 15, message: 'Fetching repository metadata...' },
        { progress: 25, message: 'Discovering repository structure...' },
        { progress: 35, message: 'Analyzing project files...' },
        { progress: 45, message: 'Processing source code...' },
        { progress: 55, message: 'Extracting API documentation...' },
        { progress: 65, message: 'Analyzing dependencies...' },
        { progress: 75, message: 'Generating documentation with AI...' },
        { progress: 85, message: 'Formatting documentation...' },
        { progress: 95, message: 'Finalizing documentation...' },
    ];

    useEffect(() => {
        if (!token || !repoFullName || !userId) return;

        const fetchDocumentation = async () => {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
            const [owner, repo] = repoFullName.split('/');

            // Start progress simulation
            let currentStep = 0;
            const progressInterval = setInterval(() => {
                if (currentStep < progressSteps.length) {
                    const step = progressSteps[currentStep];
                    setProgress(step.progress);
                    setStatusMessage(step.message);

                    currentStep++;
                } else {
                    clearInterval(progressInterval);
                }
            }, 2000); // Update every 2 seconds

            try {
                const response = await fetch(`${backendUrl}/api/docs/generate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ token, owner, repo, includeTests: false, userId })
                });

                if (!response.ok) {
                    if (response.status === 402) {
                        setCreditsError(true);
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                // Complete the progress
                clearInterval(progressInterval);
                setProgress(100);
                setStatusMessage('Documentation generated successfully!');


                // Small delay to show completion
                setTimeout(() => {
                    setDocumentation(data.documentation);
                    setLoading(false);
                }, 1000);

            } catch (err) {
                clearInterval(progressInterval);
                if (!creditsError) {
                    setError(err instanceof Error ? err.message : 'An unknown error occurred');
                }
                setLoading(false);
            }
        };

        fetchDocumentation();
    }, [token, repoFullName, userId]);

    return { documentation, loading, error, creditsError, progress, statusMessage };
};
