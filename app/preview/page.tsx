'use client';

import { useState, Suspense, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'next/navigation';
import ProtectedRoute from '../../components/preview/ProtectedRoute';
import PreviewLoadingComponent from '@/components/preview/PreviewLoadingComponent';
import { useDocumentation } from '@/hooks/useDocumentation';
import { useParticleAnimation } from '@/hooks/useParticleAnimation';
import { generateMarkdown } from '@/utils/markdownUtils';
import saveAs from 'file-saver';
import ParticleBackground from '@/components/preview/ParticleBackground';
import DocumentationHeader from '@/components/preview/DocumentationHeader';
import ErrorView from '@/components/error/ErrorView';
import DocumentationView from '@/components/preview/DocumentationView';
import CopyToast from '@/components/toast/CopyToast';
import NoDocumentationView from '@/components/preview/NoDocumentationView';
import { ParticlesArray } from '@/types/particle';
import NoCreditsView from '@/components/credit/NoCreditsView';

function PreviewPageContent() {
    const [copied, setCopied] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [activeTab, setActiveTab] = useState<string>('readme');
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 }); // For background effect
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const { token, userId } = useAuth();
    const searchParams = useSearchParams();
    const repoFullName = searchParams.get('repo');

    const {
        documentation,
        loading,
        error,
        progress,
        statusMessage,
        currentFile,
        creditsError
    } = useDocumentation(token, userId, repoFullName);

    const { canvasRef, particles } = useParticleAnimation();

    // For the background gradient effect
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        setMousePos({
            x: (e.clientX / window.innerWidth) * 2 - 1,
            y: (e.clientY / window.innerHeight) * 2 - 1,
        });
    }, []);

    const handleCopy = useCallback(async () => {
        if (!documentation) return;

        try {
            await navigator.clipboard.writeText(generateMarkdown(documentation));
            setCopied(true);
            setCopySuccess(true);
            setTimeout(() => {
                setCopied(false);
                setCopySuccess(false);
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            const textArea = document.createElement('textarea');
            textArea.value = generateMarkdown(documentation);
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setCopySuccess(true);
            setTimeout(() => {
                setCopied(false);
                setCopySuccess(false);
            }, 2000);
        }
    }, [documentation]);


    // Cleanup interval on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    // Updated download function
    const downloadMarkdown = useCallback(() => {
        if (!documentation) return;

        // Clear any existing intervals
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // Start progress simulation
        setDownloadProgress(0);
        let progress = 0;

        intervalRef.current = setInterval(() => {
            progress += 5;
            if (progress >= 100) {
                setDownloadProgress(100);
                clearInterval(intervalRef.current!);

                // Perform actual download
                const blob = new Blob([generateMarkdown(documentation)], {
                    type: 'text/markdown;charset=utf-8'
                });
                saveAs(blob, 'README.md');

                // Reset progress after delay
                setTimeout(() => setDownloadProgress(0), 300);
            } else {
                setDownloadProgress(progress);
            }
        }, 30);
    }, [documentation]);

    if (loading) return (
        <PreviewLoadingComponent
            repoFullName={repoFullName}
            statusMessage={statusMessage}
            progress={progress}
            currentFile={currentFile}
        />
    );
    if (creditsError) return <NoCreditsView />;
    if (error) return <ErrorView error={error} />;

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden"
            onMouseMove={handleMouseMove}
        >
            <ParticleBackground canvasRef={canvasRef} particles={particles as ParticlesArray} />

            <DocumentationHeader
                repoFullName={repoFullName}
                copySuccess={copySuccess}
                downloadProgress={downloadProgress}
                onCopy={handleCopy}
                onDownload={downloadMarkdown}
            />

            <div className="relative z-20 pt-20 sm:pt-24 pb-8 px-4">
                <div className="max-w-7xl mx-auto">
                    {documentation ? (
                        <DocumentationView
                            documentation={documentation}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                    ) : (
                        <NoDocumentationView />
                    )}
                </div>
            </div>

            {/* Dynamic light accents that follow mouse */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <div
                    className="absolute w-[300px] h-[300px] rounded-full opacity-10 blur-3xl transition-all duration-1000"
                    style={{
                        background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)',
                        transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`,
                        left: '10%',
                        top: '10%',
                    }}
                />
                <div
                    className="absolute w-[250px] h-[250px] rounded-full opacity-10 blur-3xl transition-all duration-1000"
                    style={{
                        background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)',
                        transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -25}px)`,
                        right: '10%',
                        bottom: '10%',
                    }}
                />
            </div>

            {copied && <CopyToast />}
        </div>
    );
}

const PreviewPage = () => {
    return (
        <ProtectedRoute>
            <Suspense fallback={
                <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                    <div className="text-white text-lg sm:text-2xl">Loading repository information...</div>
                </div>
            }>
                <PreviewPageContent />
            </Suspense>
        </ProtectedRoute>
    );
};

export default PreviewPage;