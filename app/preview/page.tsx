'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import ReadmePreview from '../../components/ReadmePreview';
import { Documentation } from '../../types/documentation';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'next/navigation';
import saveAs from 'file-saver';
import PreviewLoadingComponent from '@/components/PreviewLoadingComponent';
import BestPracticesView from '@/components/BestPractices';
import DocNavigation from '@/components/DocNavigation';

// Create a separate component for the content that uses useSearchParams
function PreviewPageContent() {
    const [copied, setCopied] = useState(false);
    const [documentation, setDocumentation] = useState<Documentation>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [statusMessage, setStatusMessage] = useState('Initializing documentation generation...');
    const { token } = useAuth();
    const searchParams = useSearchParams();
    const repoFullName = searchParams.get('repo');
    const [currentFile, setCurrentFile] = useState<string | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [copySuccess, setCopySuccess] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [activeTab, setActiveTab] = useState<string>('readme');
    const [particles, setParticles] = useState<Array<{
        x: number;
        y: number;
        vx: number;
        vy: number;
        size: number;
        color: string;
        opacity: number;
        trail: Array<{ x: number, y: number, opacity: number }>;
    }>>([]);

    // Initialize particles
    useEffect(() => {
        const newParticles = Array.from({ length: 40 }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            size: Math.random() * 4 + 2,
            color: ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'][Math.floor(Math.random() * 5)],
            opacity: Math.random() * 0.6 + 0.2,
            trail: [],
        }));
        setParticles(newParticles);
    }, []);

    // Animate particles with trails
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle) => {
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Bounce off edges
                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

                // Add current position to trail
                particle.trail.push({ x: particle.x, y: particle.y, opacity: particle.opacity });
                if (particle.trail.length > 15) particle.trail.shift();

                // Draw trail
                particle.trail.forEach((point, index) => {
                    const trailOpacity = (index / particle.trail.length) * point.opacity * 0.3;
                    const trailSize = particle.size * (index / particle.trail.length) * 0.5;

                    ctx.beginPath();
                    ctx.arc(point.x, point.y, trailSize, 0, Math.PI * 2);
                    ctx.fillStyle = `${particle.color}${Math.floor(trailOpacity * 255).toString(16).padStart(2, '0')}`;
                    ctx.fill();
                });

                // Draw main particle with glow
                const gradient = ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, particle.size * 2
                );
                gradient.addColorStop(0, particle.color);
                gradient.addColorStop(1, 'transparent');

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
                ctx.fill();
            });

            requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [particles]);

    const handleMouseMove = (e: React.MouseEvent) => {
        setMousePos({
            x: (e.clientX / window.innerWidth) * 2 - 1,
            y: (e.clientY / window.innerHeight) * 2 - 1,
        });
    };

    const generateMarkdown = (): string => {
        if (!documentation) {
            return '# Documentation\n\nNo documentation available.';
        }

        const { title, description, tagline, badges, features, techStack, installation, usage, api, fileStructure, contributing, license, author } = documentation;

        return `
    # ${title}
    
    > ${tagline}
    
    ${badges.map(b => `![${b.label}](https://img.shields.io/badge/${b.label}-${b.status}-${b.color})`).join(' ')}
    
    ## 📝 Description
    ${description}
    
    ## ✨ Features
    ${features.map(f => `- ${f}`).join('\n')}
    
    ## 🛠️ Tech Stack
    ${techStack.map(tech => `- ${tech.name}`).join('\n')}
    
    ## ⚙️ Installation
    ### Requirements
    ${installation.requirements.map(r => `- ${r}`).join('\n')}
    
    ### Steps
    ${installation.steps.join('\n')}
    
    ## 🚀 Usage
    ### Basic
    ${usage.basic}
    
    ### Advanced
    ${usage.advanced}
    
    ## 🌐 API Reference
    ${api.map(endpoint => `
    ### \`${endpoint.method} ${endpoint.endpoint}\`
    ${endpoint.description}
    
    **Parameters:**
    ${endpoint.parameters.map(p => `- \`${p.name}\` (${p.type})${p.required ? ' [required]' : ''}: ${p.description || ''}`).join('\n')}
    
    **Example:**
    \`\`\`bash
    ${endpoint.example}
    \`\`\`
    `).join('\n')}
    
    ## 📂 File Structure
    ${fileStructure.map(f => `- \`${f.path}\`: ${f.description}`).join('\n')}
    
    ## 🤝 Contributing
    ### Setup
    ${contributing.setup}
    
    ### Guidelines
    ${contributing.guidelines}
    
    ### Process
    ${contributing.process}
    
    ## 📜 License
    This project is licensed under the ${license} License.
    
    ## 👤 Author
    ${author}
        `.trim();
    };

    const downloadMarkdown = () => {
        const blob = new Blob([generateMarkdown()], { type: 'text/markdown;charset=utf-8' });
        saveAs(blob, 'README.md');
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(generateMarkdown());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            const textArea = document.createElement('textarea');
            textArea.value = generateMarkdown();
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Update the useEffect hook for fetching documentation
    useEffect(() => {
        const fetchDocumentation = async () => {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';;
            if (!token || !repoFullName) {
                setError('Missing required parameters');
                setLoading(false);
                return;
            }

            const [owner, repo] = repoFullName.split('/');
            let eventSource: EventSource | null = null;

            try {
                eventSource = new EventSource(
                    `${backendUrl}/api/generate-progress?owner=${owner}&repo=${repo}&token=${token}`
                );

                eventSource.onmessage = (event) => {
                    const data = JSON.parse(event.data);

                    if (data.progress !== null && data.progress !== undefined) {
                        setProgress(data.progress);
                    }

                    if (data.message) {
                        setStatusMessage(data.message);
                    }

                    if (data.currentFile) {
                        setCurrentFile(data.currentFile);
                    } else if (data.progress === 100 || data.progress === -1) {
                        setCurrentFile(null);
                    }
                };

                eventSource.onerror = (err) => {
                    console.error('EventSource error:', err);
                    eventSource?.close();
                    if (!error) setError('Progress tracking failed');
                };

                const response = await fetch(`${backendUrl}/api/generate-docs`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        token: token,
                        owner,
                        repo,
                        includeTests: false,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setDocumentation(data.documentation);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        if (token && repoFullName) {
            fetchDocumentation();
        }
    }, [token, repoFullName]);


    const ErrorComponent = () => (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center relative overflow-hidden" onMouseMove={handleMouseMove}>
            <canvas ref={canvasRef} className="absolute inset-0 z-0" />

            <div className="relative z-20 text-center max-w-md px-4">
                <div className="bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-3xl p-12 shadow-2xl">
                    <div className="text-6xl mb-6 animate-bounce">⚠️</div>
                    <h3 className="text-3xl font-bold text-red-400 mb-4">Oops! Something went wrong</h3>
                    <p className="text-gray-300 mb-8 leading-relaxed">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
                        style={{
                            background: 'linear-gradient(45deg, #ef4444, #dc2626)',
                            boxShadow: '0 10px 30px rgba(239, 68, 68, 0.3)',
                        }}
                    >
                        <span>Try Again</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-200%] hover:translate-x-[200%] transition-transform duration-1000" />
                    </button>
                </div>
            </div>
        </div>
    );

    if (loading) return (
        <PreviewLoadingComponent repoFullName={repoFullName} statusMessage={statusMessage} progress={progress} currentFile={currentFile} />
    );
    if (error) return <ErrorComponent />;


    return (

        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden" onMouseMove={handleMouseMove}>
            {/* Enhanced Background */}

            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/60 via-indigo-950/60 to-slate-900/60"></div>


                {/* Floating particles */}
                <div className="absolute inset-0">
                    {[...Array(40)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full animate-float"
                            style={{
                                width: `${Math.random() * 4 + 1}px`,
                                height: `${Math.random() * 4 + 1}px`,
                                background: `rgba(${Math.random() > 0.5 ? 139 : 236}, ${Math.random() > 0.5 ? 92 : 72}, ${Math.random() > 0.5 ? 246 : 153}, ${Math.random() * 0.3 + 0.1})`,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDuration: `${Math.random() * 15 + 10}s`,
                                animationDelay: `${Math.random() * 3}s`
                            }}
                        />
                    ))}
                </div>

                {/* Dynamic light accents */}
                <div className="absolute inset-0 z-10">
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
            </div>

            {/* Enhanced Header */}
            <div className="fixed top-0 left-0 right-0 z-30 backdrop-blur-md border-b border-white/10 bg-slate-900/80 py-4 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white">Documentation Preview</h1>
                            <p className="text-sm text-slate-300 truncate max-w-xs md:max-w-md">
                                {repoFullName}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {/* Copy Button with improved feedback */}
                        <button
                            onClick={handleCopy}
                            className="group relative px-4 py-2 rounded-xl font-medium text-white transition-all duration-300 hover:scale-105 overflow-hidden"
                            style={{
                                background: copySuccess
                                    ? 'linear-gradient(45deg, #10b981, #059669)'
                                    : 'linear-gradient(45deg, #0ea5e9, #0284c7)',
                            }}
                        >
                            <div className="flex items-center space-x-2 relative z-10">
                                {copySuccess ? (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        <span>Copy README</span>
                                    </>
                                )}
                            </div>

                            {/* Animated confirmation overlay */}
                            {copySuccess && (
                                <div className="absolute inset-0 bg-green-500/20 backdrop-blur-sm flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white animate-checkmark" viewBox="0 0 24 24">
                                        <path fill="none" stroke="currentColor" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </button>

                        {/* Download Button with clearer labeling */}
                        <button
                            onClick={downloadMarkdown}
                            disabled={downloadProgress > 0 && downloadProgress < 100}
                            className="group relative px-4 py-2 rounded-xl font-medium text-white transition-all duration-300 hover:scale-105 overflow-hidden disabled:opacity-70"
                            style={{
                                background: 'linear-gradient(45deg, #8b5cf6, #7c3aed)',
                            }}
                        >
                            <div className="flex items-center space-x-2 relative z-10">
                                {downloadProgress > 0 && downloadProgress < 100 ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>{downloadProgress}%</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span>Download README.md</span>
                                    </>
                                )}
                            </div>
                        </button>

                        {/* Back Button */}
                        <a
                            href="/repos"
                            className="group relative px-4 py-2 rounded-xl font-medium text-white transition-all duration-300 hover:scale-105 overflow-hidden"
                            style={{
                                background: 'linear-gradient(45deg, #475569, #334155)',
                            }}
                        >
                            <div className="flex items-center space-x-2 relative z-10">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <span>Back to Repos</span>
                            </div>
                        </a>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="relative z-20 pt-24 pb-8 px-4">
                <div className="max-w-7xl mx-auto">
                    {documentation ? (
                        <div className="bg-slate-800/30 backdrop-blur-lg border border-slate-700/50 rounded-xl overflow-hidden">
                            <div className="p-6 border-b border-slate-700/50">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <h1 className="text-2xl font-bold text-white mb-1">
                                            {documentation.title || "Project Documentation"}
                                        </h1>
                                        <p className="text-slate-300">
                                            {documentation.tagline || "AI-generated documentation"}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        {documentation.badges.slice(0, 3).map((badge, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 text-xs font-medium rounded-md bg-slate-700/50"
                                            >
                                                {badge.label}
                                            </span>
                                        ))}
                                        {documentation.badges.length > 3 && (
                                            <span className="px-2 py-1 text-xs font-medium rounded-md bg-slate-700/50">
                                                +{documentation.badges.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex min-h-screen">
                                <DocNavigation
                                    activeTab={activeTab}
                                    setActiveTab={setActiveTab}
                                    bestPractices={documentation.bestPractices}
                                />

                                <div className="flex-1 overflow-y-auto">
                                    {activeTab === 'readme' ? (
                                        <ReadmePreview documentation={documentation!} />
                                    ) : (
                                        documentation?.bestPractices ? (
                                            <BestPracticesView data={documentation.bestPractices} />
                                        ) : (
                                            <div className="flex justify-center items-center h-full">
                                                <p className="text-slate-400">No best practices analysis available</p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center items-center min-h-[60vh]">
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">No documentation found</h3>
                                <p className="text-slate-400 max-w-md mx-auto">
                                    We couldn&apos;t generate documentation for this repository. Please try again.
                                </p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="mt-6 px-6 py-3 rounded-xl font-medium text-white transition-all duration-300 hover:scale-105"
                                    style={{
                                        background: 'linear-gradient(45deg, #0ea5e9, #0284c7)',
                                    }}
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Success Toast */}
            {copied && (
                <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
                    <div className="bg-green-500/90 backdrop-blur-sm text-white px-6 py-4 rounded-xl shadow-lg flex items-center space-x-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>README copied to clipboard!</span>
                    </div>
                </div>
            )}

            {/* Custom Styles */}
            <style jsx>{`
                @keyframes animate-slide-up {
                    0% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-slide-up {
                    animation: animate-slide-up 0.3s ease-out forwards;
                }
                
                @keyframes animate-checkmark {
                    0% {
                        stroke-dashoffset: 100;
                        opacity: 0;
                    }
                    100% {
                        stroke-dashoffset: 0;
                        opacity: 1;
                    }
                }
                
                .animate-checkmark path {
                    stroke-dasharray: 100;
                    stroke-dashoffset: 100;
                    animation: animate-checkmark 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
}

// Create a wrapper component with Suspense
export default function PreviewPage() {
    return (
        <ProtectedRoute>
            <Suspense fallback={
                <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                    <div className="text-white text-2xl">Loading repository information...</div>
                </div>
            }>
                <PreviewPageContent />
            </Suspense>
        </ProtectedRoute>
    );
}