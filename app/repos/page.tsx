'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';

import UserProfileBar from '@/components/repos/UserProfileBar';
import SearchFilter from '@/components/repos/SearchFilter';
import RepoCard from '@/components/repos/RepoCard';
import EmptyState from '@/components/repos/EmptyState';
import LoadingPage from '@/components/LoadingPage';
import ErrorView from '@/components/error/ErrorView';
import { useReposData } from '@/hooks/useReposData';

export default function ReposPage() {
    const { isAuthenticated, isLoading: authLoading, logout } = useAuth();
    const router = useRouter();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [hoveredRepo, setHoveredRepo] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('all');

    const { repos, userData, credits, loading, error, isSubscribedLifeTime } = useReposData();

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, authLoading, router]);

    const handleGenerateDocs = (repoFullName: string) => {
        // Check if user has credits or subscription
        if (!isSubscribedLifeTime && credits <= 0) {
            // Redirect to payment page if no credits and not subscribed
            router.push('/payment');
            return;
        }

        router.push(`/preview?repo=${encodeURIComponent(repoFullName)}`);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        setMousePos({
            x: (e.clientX / window.innerWidth) * 2 - 1,
            y: (e.clientY / window.innerHeight) * 2 - 1,
        });
    };

    // Get unique languages for filter dropdown
    const uniqueLanguages = ['all', ...Array.from(
        new Set(repos.map(repo => repo.language).filter(Boolean))
    ) as string[]];

    // Filter repositories based on search and language
    const filteredRepos = repos.filter(repo => {
        const matchesSearch = repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (repo.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
        const matchesLanguage = selectedLanguage === 'all' || repo.language === selectedLanguage;
        return matchesSearch && matchesLanguage;
    });

    if (authLoading || loading) return <LoadingPage />;
    if (error) return <ErrorView error={error} />;
    if (!isAuthenticated) return null;

    return (
        <div
            className="min-h-screen dark:bg-gray-900 overflow-x-hidden"
            onMouseMove={handleMouseMove}
        >


            {/* Dynamic Background Orbs */}
            <div className="fixed inset-0 z-10 pointer-events-none">
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
                    <UserProfileBar
                        userData={userData}
                        credits={credits}
                        onLogout={logout}
                        isSubscribedLifeTime={isSubscribedLifeTime}
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-10"
                    >
                        <h1 className="text-3xl md:text-4xl font-bold text-white bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                            Your GitHub Repositories
                        </h1>
                        <p className="text-gray-400 mt-3 max-w-2xl text-sm">
                            Choose a repository to transform into beautiful, AI-powered documentation
                        </p>
                    </motion.div>

                    <SearchFilter
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        selectedLanguage={selectedLanguage}
                        setSelectedLanguage={setSelectedLanguage}
                        uniqueLanguages={uniqueLanguages}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredRepos.map((repo) => (
                                <RepoCard
                                    key={repo.id}
                                    repo={repo}
                                    onGenerate={handleGenerateDocs}
                                    hoveredRepo={hoveredRepo}
                                    setHoveredRepo={setHoveredRepo}
                                    mousePos={mousePos}
                                />
                            ))}
                        </AnimatePresence>
                    </div>

                    {filteredRepos.length === 0 && !loading && (
                        <EmptyState
                            searchTerm={searchTerm}
                            selectedLanguage={selectedLanguage}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}