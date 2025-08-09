"use client";

import { useEffect, useRef, useState } from 'react';
import { Code } from 'lucide-react';

interface LoadingPageProps {
    message?: string;
    subMessage?: string;
}

export default function LoadingPage({
    message = "Loading Your Repositories",
    subMessage = "Fetching your amazing projects..."
}: LoadingPageProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });




    const handleMouseMove = (e: React.MouseEvent) => {
        setMousePos({
            x: (e.clientX / window.innerWidth) * 2 - 1,
            y: (e.clientY / window.innerHeight) * 2 - 1,
        });
    };

    return (
        <div
            className="min-h-screen bg-slate-900 flex items-center justify-center relative overflow-hidden"
            onMouseMove={handleMouseMove}
        >


            {/* Enhanced Header */}
            <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 sm:p-6 lg:p-8 px-4 sm:px-8 lg:px-12 max-w-8xl mx-auto animate-fade-in-down">
                <div className="flex items-center space-x-3 group">
                    <div className="relative">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-500/30">
                            <Code className="w-5 h-5 sm:w-6 sm:h-6 text-white transition-all duration-300 group-hover:text-purple-400 group-hover:rotate-12" />
                        </div>
                        <div className="absolute inset-0 bg-purple-400 opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-300 rounded-xl"></div>
                    </div>
                </div>
                <div className="text-white text-lg sm:text-xl font-bold tracking-wide hover:text-purple-400 transition-colors duration-300 cursor-pointer">
                    GitForje
                </div>
            </header>

            {/* Enhanced Content */}
            <div className="relative z-20 text-center animate-fade-in-up px-4 sm:px-8">
                <div className="relative">
                    {/* Modern Loading Spinner */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-8">
                        {/* Outer ring */}
                        <div className="absolute inset-0 rounded-full border-2 border-purple-500/20"></div>
                        {/* Spinning gradient ring */}
                        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-400 border-r-pink-400 animate-spin"></div>
                        {/* Inner pulsing dot */}
                        <div className="absolute inset-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse opacity-60"></div>
                        {/* Center dot */}
                        <div className="absolute inset-6 rounded-full bg-white animate-pulse"></div>
                    </div>

                    {/* Clean Typography */}
                    <div className="space-y-3">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white">
                            {message}
                        </h1>
                        <p className="text-sm sm:text-base text-gray-400 max-w-md mx-auto">
                            {subMessage}
                        </p>
                    </div>

                    {/* Minimal Loading Dots */}
                    <div className="flex justify-center space-x-1 mt-6">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce animation-delay-200"></div>
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce animation-delay-400"></div>
                    </div>
                </div>
            </div>

            {/* Enhanced Custom Styles */}
            <style jsx>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fade-in-down {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out forwards;
                    opacity: 0;
                }
                .animate-fade-in-down {
                    animation: fade-in-down 0.6s ease-out forwards;
                    opacity: 0;
                }

                .animation-delay-200 { animation-delay: 0.2s; }
                .animation-delay-400 { animation-delay: 0.4s; }
            `}</style>
        </div>
    );
}
