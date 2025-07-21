'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Repository } from '@/types/repo';
import { FiStar, FiGitBranch, FiClock, FiSearch, FiX } from 'react-icons/fi';
import LoadingPage from '@/components/LoadingPage';
import { AnimatePresence, motion } from 'framer-motion';
interface UserData {
    avatar_url: string;
    name?: string; // Optional because of the fallback to login
    login: string;
    public_repos: number;
    // Optional GitHub user properties that might be useful later:
    id?: number;
    html_url?: string;
    followers?: number;
    following?: number;
    bio?: string;
    location?: string;
    blog?: string;
    twitter_username?: string;
    company?: string;
    created_at?: string;
    updated_at?: string;
}
export default function ReposPage() {
    const { token, isAuthenticated, logout, isLoading } = useAuth();
    const router = useRouter();
    const [repos, setRepos] = useState<Repository[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [hoveredRepo, setHoveredRepo] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('all');
    const [userData, setUserData] = useState<UserData>();
    const [currentFeature, setCurrentFeature] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scrollY, setScrollY] = useState(0);
    const [stars, setStars] = useState<Array<{
        x: number;
        y: number;
        z: number;
        size: number;
        speed: number;
    }>>([]);
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
        // Initialize starfield
        const newStars = Array.from({ length: 200 }, () => ({
            x: (Math.random() - 0.5) * 2000,
            y: (Math.random() - 0.5) * 2000,
            z: Math.random() * 1000,
            size: Math.random() * 2 + 1,
            speed: Math.random() * 2 + 0.5,
        }));
        setStars(newStars);



        // Scroll listener
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);


    }, []);

    // Animate starfield
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const animate = () => {
            ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            stars.forEach(star => {
                star.z -= star.speed;
                if (star.z <= 0) {
                    star.z = 1000;
                    star.x = (Math.random() - 0.5) * 2000;
                    star.y = (Math.random() - 0.5) * 2000;
                }

                const x = (star.x / star.z) * canvas.width + canvas.width / 2;
                const y = (star.y / star.z) * canvas.height + canvas.height / 2;
                const size = (1 - star.z / 1000) * star.size;

                if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
                    ctx.beginPath();
                    ctx.fillStyle = `rgba(255, 255, 255, ${0.8 - star.z / 1000})`;
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fill();

                    // Draw star trails
                    const prevX = (star.x / (star.z + star.speed)) * canvas.width + canvas.width / 2;
                    const prevY = (star.y / (star.z + star.speed)) * canvas.height + canvas.height / 2;

                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 - star.z / 1000})`;
                    ctx.lineWidth = size * 0.5;
                    ctx.beginPath();
                    ctx.moveTo(prevX, prevY);
                    ctx.lineTo(x, y);
                    ctx.stroke();
                }
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
    }, [stars]);
    const handleMouseMove = (e: React.MouseEvent) => {
        setMousePos({
            x: (e.clientX / window.innerWidth) * 2 - 1,
            y: (e.clientY / window.innerHeight) * 2 - 1,
        });
    };
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const response = await fetch('https://api.github.com/user', {
                    headers: {
                        Authorization: `token ${token}`,
                    },
                });
                const data = await response.json();
                setUserData(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchRepos = async () => {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
            try {
                const response = await fetch(`${backendUrl}/api/user/repos`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("github_token")}`,
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

        fetchUserData();
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
    }, [router, token]);

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



    const handleGenerateDocs = (repoFullName: string) => {
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
        return <LoadingPage />;
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
        <div className="min-h-screen bg-slate-900 overflow-x-hidden" onMouseMove={handleMouseMove}>
            {/* Animated Background */}
            <canvas
                ref={canvasRef}
                className="fixed inset-0 z-0"
            />

            {/* Dynamic Background Orbs */}
            <div className="fixed inset-0 z-10">
                <div
                    className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl transition-all duration-1000 ease-out"
                    style={{
                        background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)',
                        transform: `translate(${mousePos.x * 100}px, ${mousePos.y * 100}px) scale(${1 + mousePos.x * 0.1})`,
                        left: '10%',
                        top: '10%',
                    }}
                />
                <div
                    className="absolute w-80 h-80 rounded-full opacity-15 blur-3xl transition-all duration-1000 ease-out"
                    style={{
                        background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)',
                        transform: `translate(${mousePos.x * -150}px, ${mousePos.y * -100}px)`,
                        right: '10%',
                        top: '30%',
                    }}
                />
                <div
                    className="absolute w-72 h-72 rounded-full opacity-10 blur-3xl transition-all duration-1000 ease-out"
                    style={{
                        background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)',
                        transform: `translate(${mousePos.x * 80}px, ${mousePos.y * 120}px)`,
                        left: '50%',
                        bottom: '20%',
                    }}
                />
            </div>
            {/* Main Content */}
            <div className="relative z-20 pt-8 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Top Bar - User and Logout */}
                    <div className="flex justify-between items-center mb-8 bg-slate-800/30 backdrop-blur-lg p-4 rounded-xl border border-slate-700/50 shadow-xl">
                        {userData && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-3"
                            >
                                <div className="relative">
                                    <div className="absolute -inset-1 bg-gradient-to-r  rounded-full blur-md opacity-30 animate-pulse"></div>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <img
                                            src={userData.avatar_url}
                                            alt="User Avatar"
                                            className="w-12 h-12 rounded-full border-2 border-slate-800/50 shadow-lg"
                                        />
                                    </motion.div>
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold text-white bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                                        {userData.name || userData.login}
                                    </h1>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-300 text-xs">@{userData.login}</span>
                                        <span className="text-xs px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full">
                                            {userData.public_repos} repos
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div className="flex items-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={logout}
                                className="group flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-white transition-all duration-300 overflow-hidden text-sm bg-gradient-to-r from-rose-600/90 to-rose-700 hover:from-rose-500 hover:to-rose-600 shadow-lg shadow-rose-500/20"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span>Logout</span>
                            </motion.button>
                        </div>
                    </div>

                    {/* Page Header - Enhanced with Animated Gradient */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-10 text-center md:text-left"
                    >




                        <motion.div
                            className="flex justify-center md:justify-start mt-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="flex gap-2">
                                <div className="px-3 py-1 text-xs bg-indigo-500/20 text-indigo-300 rounded-full flex items-center">
                                    <FiStar className="mr-1" /> AI-Powered
                                </div>
                                <div className="px-3 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full flex items-center">
                                    <FiGitBranch className="mr-1" /> Instant Preview
                                </div>
                                <div className="px-3 py-1 text-xs bg-cyan-500/20 text-cyan-300 rounded-full flex items-center">
                                    <FiClock className="mr-1" /> Speed
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                    {/* Page Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-10"
                    >
                        <h1 className="text-3xl md:text-4xl font-bold text-white bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                            Your GitHub Repositories
                        </h1>
                        <p className="text-gray-400 mt-3 max-w-2xl text-sm">
                            Choose a repository to transform into beautiful, AI-powered documentation
                        </p>
                    </motion.div>

                    {/* Search and Filter */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col md:flex-row gap-4 mb-10"
                    >
                        <div className="relative flex-1 max-w-xl">
                            <input
                                type="text"
                                placeholder="Search repositories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 pl-11 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                            />
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                <FiSearch className="w-4 h-4 text-slate-500" />
                            </div>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-slate-700/50"
                                >
                                    <FiX className="w-4 h-4 text-slate-500" />
                                </button>
                            )}
                        </div>

                        <motion.div whileHover={{ scale: 1.02 }}>
                            <select
                                value={selectedLanguage}
                                onChange={(e) => setSelectedLanguage(e.target.value)}
                                className="w-full md:w-auto px-4 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 text-sm"
                            >
                                {uniqueLanguages.map(lang => (
                                    <option key={lang} className="bg-slate-800 text-white">
                                        {lang === 'all' ? 'All Languages' : lang}
                                    </option>
                                ))}
                            </select>
                        </motion.div>
                    </motion.div>

                    {/* Repository Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredRepos.map((repo) => (
                                <motion.div
                                    key={repo.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    className="group relative"
                                    onMouseEnter={() => setHoveredRepo(repo.id)}
                                    onMouseLeave={() => setHoveredRepo(null)}
                                    style={{
                                        transform: hoveredRepo === repo.id
                                            ? `translateY(-6px) rotateX(${mousePos.y * 1}deg) rotateY(${mousePos.x * 1}deg)`
                                            : 'translateY(0)',
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    {/* Card */}
                                    <div className="relative h-full p-6 bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden transition-all duration-300 group-hover:bg-slate-800/60 group-hover:border-purple-500/40 group-hover:shadow-xl group-hover:shadow-purple-500/10">
                                        {/* Glow effect */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                        {/* Content */}
                                        <div className="relative z-10">
                                            {/* Header */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <h2 className="text-lg font-bold text-white mb-1 group-hover:text-purple-300 transition-colors duration-300 truncate">
                                                        {repo.name}
                                                    </h2>
                                                    <p className="text-slate-400 text-xs truncate">@{repo.owner}</p>
                                                </div>

                                                {repo.language && (
                                                    <div className="flex items-center space-x-1.5 bg-slate-700/50 px-2 py-1 rounded-full">
                                                        <div
                                                            className="w-2.5 h-2.5 rounded-full"
                                                            style={{ backgroundColor: getLanguageColor(repo.language) }}
                                                        />
                                                        <span className="text-xs font-medium text-slate-300">
                                                            {repo.language}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Description */}
                                            {repo.description && (
                                                <p className="text-slate-300 mb-5 text-sm leading-relaxed line-clamp-3">
                                                    {repo.description}
                                                </p>
                                            )}

                                            {/* Stats */}
                                            <div className="flex flex-wrap gap-3 mb-5 text-xs text-slate-400">
                                                <div className="flex items-center space-x-1.5 bg-slate-700/30 px-2.5 py-1 rounded-full">
                                                    <FiStar className="w-3.5 h-3.5" />
                                                    <span>{repo.stars.toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center space-x-1.5 bg-slate-700/30 px-2.5 py-1 rounded-full">
                                                    <FiGitBranch className="w-3.5 h-3.5" />
                                                    <span>{repo.forks.toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center space-x-1.5 bg-slate-700/30 px-2.5 py-1 rounded-full">
                                                    <FiClock className="w-3.5 h-3.5" />
                                                    <span>{formatDate(repo.updated_at)}</span>
                                                </div>
                                            </div>

                                            {/* Generate Button */}
                                            <motion.button
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleGenerateDocs(repo.full_name)}
                                                className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white transition-all duration-300 relative overflow-hidden group"
                                            >
                                                <span className="relative z-10">Generate Documentation</span>
                                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl z-0"></div>
                                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Empty State */}
                    {filteredRepos.length === 0 && !loading && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-16"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 mb-6">
                                <FiSearch className="w-8 h-8 text-indigo-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No repositories found</h3>
                            <p className="text-slate-400 max-w-md mx-auto">
                                {searchTerm || selectedLanguage !== 'all'
                                    ? "Try adjusting your search or filter criteria"
                                    : "You don't have any repositories that match the current filters"}
                            </p>
                        </motion.div>
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
                
                /* Smooth scrollbar */
                ::-webkit-scrollbar {
                    width: 8px;
                }
                
                ::-webkit-scrollbar-track {
                    background: rgba(15, 23, 42, 0.4);
                }
                
                ::-webkit-scrollbar-thumb {
                    background: #4f46e5;
                    border-radius: 4px;
                }
            `}</style>
        </div>
    );
}
