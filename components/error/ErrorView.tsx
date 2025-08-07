import React, { useState, useEffect } from 'react';

interface ErrorViewProps {
    error: string;
}

const ErrorView: React.FC<ErrorViewProps> = ({ error }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [particles, setParticles] = useState<Array<{ id: number, x: number, y: number, delay: number }>>([]);

    useEffect(() => {
        setIsVisible(true);

        // Generate floating particles
        const newParticles = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            delay: Math.random() * 5
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 z-0">
                {/* Primary gradient overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent"></div>

                {/* Floating particles */}
                {particles.map(particle => (
                    <div
                        key={particle.id}
                        className="absolute w-1 h-1 bg-red-400/30 rounded-full animate-pulse"
                        style={{
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                            animationDelay: `${particle.delay}s`,
                            animationDuration: `${3 + Math.random() * 2}s`
                        }}
                    />
                ))}

                {/* Animated grid pattern */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '60px 60px',
                        animation: 'gridMove 20s linear infinite'
                    }}
                />
            </div>

            {/* Main Error Container */}
            <div
                className={`relative z-20 text-center max-w-lg px-6 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}
            >
                <div className="relative group">
                    {/* Glowing background effect */}
                    <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full scale-150 group-hover:scale-175 transition-transform duration-500"></div>

                    {/* Main content card */}
                    <div className="relative bg-slate-800/60 backdrop-blur-xl border border-red-500/30 rounded-3xl p-12 shadow-2xl hover:shadow-red-500/10 transition-all duration-500 group-hover:border-red-500/50">
                        {/* Animated border glow */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-red-500/20 via-transparent to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>

                        {/* Error Icon with enhanced animation */}
                        <div className="relative mb-8">
                            <div className="text-8xl mb-2 filter drop-shadow-lg">
                                <span className="inline-block animate-bounce" style={{ animationDuration: '2s' }}>
                                    ⚠️
                                </span>
                            </div>
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-red-500/20 rounded-full blur-xl animate-ping"></div>
                        </div>

                        {/* Error Message */}
                        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 mb-3 animate-pulse">
                            Oops! Something went wrong
                        </h1>

                        <div className="h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent mb-6"></div>

                        {/* Error details */}
                        <div className="mb-8 space-y-4">
                            <p className="text-gray-300 leading-relaxed text-lg">
                                Our servers are experiencing high traffic right now. Please try again in a few moments.
                            </p>

                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full group relative py-4 px-8 rounded-2xl font-bold text-white transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden"
                                style={{
                                    background: 'linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)',
                                    boxShadow: '0 10px 30px rgba(239, 68, 68, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                                }}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <span>🔄</span>
                                    <span>Try Again</span>
                                </span>

                                {/* Button shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />

                                {/* Button glow */}
                                <div className="absolute inset-0 rounded-2xl bg-red-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                            </button>


                        </div>

                        {/* Help text */}
                        <div className="mt-8 pt-6 border-t border-slate-700/50">
                            <p className="text-sm text-gray-400">
                                If this problem persists, please contact support
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes gridMove {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(60px, 60px); }
                }
            `}</style>
        </div>
    );
};

export default ErrorView;