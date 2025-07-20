'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Repository } from '@/types/repo';
import { FiStar, FiGitBranch, FiClock, FiSearch } from 'react-icons/fi';

export default function ReposPage() {
    const { token, isAuthenticated } = useAuth();
    const router = useRouter();
    const [repos, setRepos] = useState<Repository[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [hoveredRepo, setHoveredRepo] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('all');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [particles, setParticles] = useState<Array<{
        x: number;
        y: number;
        vx: number;
        vy: number;
        size: number;
        color: string;
        opacity: number;
    }>>([]);

    useEffect(() => {

        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        const fetchRepos = async () => {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
            console.log(backendUrl);
            try {
                const response = await fetch(`${backendUrl}/api/user/repos`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch repositories');
                }

                const data = await response.json();
                setRepos(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchRepos();

        // Initialize particles
        const newParticles = Array.from({ length: 30 }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 3 + 1,
            color: ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981'][Math.floor(Math.random() * 4)],
            opacity: Math.random() * 0.5 + 0.1,
        }));
        setParticles(newParticles);
    }, [token, isAuthenticated, router]);

    // Animate particles
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle, index) => {
                particle.x += particle.vx;
                particle.y += particle.vy;

                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
                ctx.fill();

                // Connect nearby particles
                particles.forEach((otherParticle, otherIndex) => {
                    if (index !== otherIndex) {
                        const dx = particle.x - otherParticle.x;
                        const dy = particle.y - otherParticle.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < 100) {
                            ctx.beginPath();
                            ctx.moveTo(particle.x, particle.y);
                            ctx.lineTo(otherParticle.x, otherParticle.y);
                            ctx.strokeStyle = `${particle.color}${Math.floor((1 - distance / 100) * 50).toString(16).padStart(2, '0')}`;
                            ctx.lineWidth = 0.5;
                            ctx.stroke();
                        }
                    }
                });
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

    const handleGenerateDocs = (repoFullName: string) => {
        // Navigate directly to preview page with repo parameter
        router.push(`/preview?repo=${encodeURIComponent(repoFullName)}`);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getLanguageColor = (language: string) => {
        const colors: { [key: string]: string } = {
            'TypeScript': '#3178c6',
            'JavaScript': '#f1e05a',
            'Python': '#3572a5',
            'Java': '#b07219',
            'C++': '#f34b7d',
            'Go': '#00add8',
            'Rust': '#dea584',
            'Dart': '#00b4ab',
            'Ruby': '#701516',
            'PHP': '#4f5d95',
        };
        return colors[language] || '#6b7280';
    };

    const filteredRepos = repos.filter(repo => {
        const matchesSearch = repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            repo.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLanguage = selectedLanguage === 'all' || repo.language === selectedLanguage;
        return matchesSearch && matchesLanguage;
    });

    const uniqueLanguages = ['all', ...Array.from(new Set(repos.map(repo => repo.language).filter(Boolean)))];

    if (loading) {
        return (
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
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">⚠️</div>
                    <div className="text-2xl font-bold text-red-400 mb-4">Oops! Something went wrong</div>
                    <p className="text-gray-400">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 relative overflow-hidden" onMouseMove={handleMouseMove}>
            {/* Animated Background */}
            <canvas ref={canvasRef} className="absolute inset-0 z-0" />

            {/* Dynamic Background Orbs */}
            <div className="absolute inset-0 z-10">
                <div
                    className="absolute w-96 h-96 rounded-full opacity-10 blur-3xl transition-all duration-1000"
                    style={{
                        background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)',
                        transform: `translate(${mousePos.x * 50}px, ${mousePos.y * 50}px)`,
                        left: '10%',
                        top: '10%',
                    }}
                />
                <div
                    className="absolute w-80 h-80 rounded-full opacity-10 blur-3xl transition-all duration-1000"
                    style={{
                        background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)',
                        transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -40}px)`,
                        right: '10%',
                        bottom: '10%',
                    }}
                />
            </div>

            {/* Main Content */}
            <div className="relative z-20 py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl font-black mb-6">
                            <span
                                className="text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-400 to-pink-400 animate-pulse"
                            >
                                Your GitHub Repositories
                            </span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                            Choose a repository to transform into beautiful, AI-powered documentation
                        </p>

                        {/* Search and Filter */}
                        <div className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
                            <div className="relative flex-1 max-w-md">
                                <input
                                    type="text"
                                    placeholder="Search repositories..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                                />
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                    <FiSearch className="w-5 h-5 text-gray-400" />
                                </div>
                            </div>

                            <select
                                value={selectedLanguage}
                                onChange={(e) => setSelectedLanguage(e.target.value)}
                                className="px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                            >
                                {uniqueLanguages.map(lang => (
                                    <option key={lang} className="bg-slate-800 text-white">
                                        {lang === 'all' ? 'All Languages' : lang}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Repository Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredRepos.map((repo, index) => (
                            <div
                                key={repo.id}
                                className="group relative"
                                onMouseEnter={() => setHoveredRepo(repo.id)}
                                onMouseLeave={() => setHoveredRepo(null)}
                                style={{
                                    transform: hoveredRepo === repo.id
                                        ? `translateY(-10px) rotateX(${mousePos.y * 2}deg) rotateY(${mousePos.x * 2}deg)`
                                        : 'translateY(0)',
                                    transition: 'all 0.5s ease',
                                }}
                            >
                                {/* Card */}
                                <div className="relative h-full p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden transition-all duration-500 group-hover:bg-white/10 group-hover:border-purple-500/30">
                                    {/* Animated Border */}
                                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Shimmer Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />

                                    {/* Content */}
                                    <div className="relative z-10">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
                                                    {repo.name}
                                                </h2>
                                                <p className="text-gray-400 text-sm">@{repo.owner}</p>
                                            </div>

                                            {repo.language && (
                                                <div className="flex items-center space-x-2">
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: getLanguageColor(repo.language) }}
                                                    />
                                                    <span className="text-xs font-medium text-gray-300">
                                                        {repo.language}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Description */}
                                        {repo.description && (
                                            <p className="text-gray-300 mb-6 leading-relaxed line-clamp-3">
                                                {repo.description}
                                            </p>
                                        )}

                                        {/* Stats */}
                                        <div className="flex items-center space-x-6 mb-6 text-sm text-gray-400">
                                            <div className="flex items-center space-x-1">
                                                <FiStar className="w-4 h-4" />
                                                <span className="font-medium">{repo.stars.toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <FiGitBranch className="w-4 h-4" />
                                                <span className="font-medium">{repo.forks.toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <FiClock className="w-4 h-4" />
                                                <span className="font-medium">{formatDate(repo.updated_at)}</span>
                                            </div>
                                        </div>

                                        {/* Generate Button */}
                                        <button
                                            onClick={() => handleGenerateDocs(repo.full_name)}
                                            className="w-full py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 transform group-hover:scale-105 relative overflow-hidden"
                                            style={{
                                                background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
                                                boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(139, 92, 246, 0.5)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(139, 92, 246, 0.3)';
                                            }}
                                        >
                                            <div className="flex items-center justify-center space-x-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <span>Generate Documentation</span>
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredRepos.length === 0 && (
                        <div className="text-center py-16">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-2xl font-bold text-white mb-4">No repositories found</h3>
                            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Custom Styles */}
            <style jsx>{`
                .line-clamp-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
}