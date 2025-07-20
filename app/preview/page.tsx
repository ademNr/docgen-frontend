'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import ReadmePreview from '../../components/ReadmePreview';
import { Documentation } from '../../types/documentation';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'next/navigation';
import saveAs from 'file-saver';

// Create a separate component for the content that uses useSearchParams
function PreviewPageContent() {
    const [copied, setCopied] = useState(false);
    const [documentation, setDocumentation] = useState<Documentation | null>(null);
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

    const LoadingComponent = () => (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center relative overflow-hidden" onMouseMove={handleMouseMove}>
            <canvas ref={canvasRef} className="absolute inset-0 z-0" />

            {/* Dynamic background orbs */}
            <div className="absolute inset-0 z-10">
                <div
                    className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl transition-all duration-1000"
                    style={{
                        background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)',
                        transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)`,
                        left: '20%',
                        top: '20%',
                    }}
                />
                <div
                    className="absolute w-80 h-80 rounded-full opacity-20 blur-3xl transition-all duration-1000"
                    style={{
                        background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)',
                        transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -30}px)`,
                        right: '20%',
                        bottom: '20%',
                    }}
                />
            </div>

            <div className="relative z-20 w-full max-w-2xl px-4">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-12 shadow-2xl">
                    {/* Header with animated icon */}
                    <div className="text-center mb-8">
                        <div className="relative inline-block mb-6">
                            <div className="w-24 h-24 mx-auto relative">
                                {/* Rotating rings */}
                                <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full animate-spin"></div>
                                <div className="absolute inset-2 border-4 border-pink-500/50 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
                                <div className="absolute inset-4 border-4 border-blue-500/70 rounded-full animate-pulse"></div>

                                {/* Central icon */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-400 to-pink-400 mb-4">
                            Generating Documentation
                        </h2>
                        <p className="text-gray-300 text-lg">
                            Creating AI-powered documentation for <span className="font-mono text-purple-300">{repoFullName}</span>
                        </p>
                    </div>

                    {/* Progress section */}
                    <div className="mb-8">
                        <div className="flex justify-between mb-4">
                            <span className="text-white font-medium">
                                {statusMessage}
                            </span>
                            <span className="text-purple-300 font-bold text-lg">
                                {progress}%
                            </span>
                        </div>

                        {/* Enhanced progress bar */}
                        <div className="relative h-4 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 transition-all duration-500 ease-out rounded-full"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-ping"></div>
                            </div>
                        </div>
                    </div>

                    {/* Current file indicator */}
                    {currentFile && (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                                <span className="text-gray-300 text-sm">Analyzing:</span>
                                <span className="font-mono text-white bg-white/10 px-3 py-1 rounded-lg text-sm truncate max-w-md">
                                    {currentFile}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Fun facts or tips while loading */}
                    <div className="text-center">
                        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full px-6 py-3">
                            <svg className="w-5 h-5 text-yellow-400 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                            </svg>
                            <span className="text-white text-sm">
                                AI is analyzing your code structure and generating comprehensive documentation...
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

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
        <div className="min-h-screen bg-slate-900 flex items-center justify-center relative overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0 z-0" />
            <div className="relative z-10 text-center">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-purple-500/30 rounded-full animate-spin mx-auto mb-8">
                        <div className="absolute inset-2 border-4 border-pink-500 rounded-full animate-ping"></div>
                        <div className="absolute inset-4 border-4 border-blue-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-4">Loading Your Repositories</div>
                    <div className="text-gray-400">Fetching your amazing projects...</div>
                </div>
            </div>
        </div>
    );
    if (error) return <ErrorComponent />;

    return (
        <div className="min-h-screen bg-slate-900 relative overflow-hidden" onMouseMove={handleMouseMove}>
            <canvas ref={canvasRef} className="absolute inset-0 z-0" />

            {/* Dynamic background orbs */}
            <div className="absolute inset-0 z-10">
                <div
                    className="absolute w-96 h-96 rounded-full opacity-5 blur-3xl transition-all duration-1000"
                    style={{
                        background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)',
                        transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`,
                        left: '10%',
                        top: '10%',
                    }}
                />
                <div
                    className="absolute w-80 h-80 rounded-full opacity-5 blur-3xl transition-all duration-1000"
                    style={{
                        background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)',
                        transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -25}px)`,
                        right: '10%',
                        bottom: '10%',
                    }}
                />
            </div>

            <div className="relative z-20 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    {documentation ? (
                        <>
                            {/* Enhanced Header */}
                            <div className="mb-8">
                                <div className="   p-8 ">
                                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                                        <div>
                                            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-400 to-pink-400 mb-2">
                                                Documentation Generated! 🎉
                                            </h1>
                                            <p className="text-gray-300 text-lg">
                                                Repository: <span className="font-mono text-purple-300">{repoFullName}</span>
                                            </p>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4">
                                            {/* Copy Button */}
                                            <button
                                                onClick={handleCopy}
                                                className="group relative px-6 py-3 rounded-2xl font-bold text-white transition-all duration-300 transform hover:scale-105 overflow-hidden"
                                                style={{
                                                    background: copySuccess
                                                        ? 'linear-gradient(45deg, #10b981, #059669)'
                                                        : 'linear-gradient(45deg, #06b6d4, #0891b2)',
                                                    boxShadow: '0 10px 30px rgba(6, 182, 212, 0.3)',
                                                }}
                                            >
                                                <div className="flex items-center space-x-2 relative z-10">
                                                    {copySuccess ? (
                                                        <>
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            <span>Copied!</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                            </svg>
                                                            <span>Copy</span>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                                            </button>

                                            {/* Download Button */}
                                            <button
                                                onClick={downloadMarkdown}
                                                disabled={downloadProgress > 0 && downloadProgress < 100}
                                                className="group relative px-6 py-3 rounded-2xl font-bold text-white transition-all duration-300 transform hover:scale-105 overflow-hidden disabled:opacity-50"
                                                style={{
                                                    background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
                                                    boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)',
                                                }}
                                            >
                                                <div className="flex items-center space-x-2 relative z-10">
                                                    {downloadProgress > 0 && downloadProgress < 100 ? (
                                                        <>
                                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                            <span>{downloadProgress}%</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            <span>Download</span>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                                            </button>

                                            {/* Back Button */}
                                            <a
                                                href="/repos"
                                                className="group relative px-6 py-3 rounded-2xl font-bold text-white transition-all duration-300 transform hover:scale-105 overflow-hidden"
                                                style={{
                                                    background: 'linear-gradient(45deg, #64748b, #475569)',
                                                    boxShadow: '0 10px 30px rgba(100, 116, 139, 0.3)',
                                                }}
                                            >
                                                <div className="flex items-center space-x-2 relative z-10">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                                    </svg>
                                                    <span>Back to Repos</span>
                                                </div>
                                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Documentation Content */}
                            <div className="overflow-hidden ">
                                <ReadmePreview documentation={documentation} />
                            </div>
                        </>
                    ) : (
                        <div className="flex justify-center items-center min-h-[60vh]">
                            <div className="text-center">
                                <div className="text-6xl mb-4">📄</div>
                                <h3 className="text-2xl font-bold text-white mb-4">No documentation found</h3>
                                <p className="text-gray-400">Something went wrong during generation</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
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