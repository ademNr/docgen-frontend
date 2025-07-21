// components/LoadingPage.tsx
"use client";

import { useEffect, useRef, useState } from 'react';

interface LoadingPageProps {
    message?: string;
    subMessage?: string;
}

export default function LoadingPage({
    message = "Loading Your Repositories",
    subMessage = "Fetching your amazing projects..."
}: LoadingPageProps) {
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
    }, []);

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

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center relative overflow-hidden">
            {/* Particle Background */}
            <canvas ref={canvasRef} className="absolute inset-0 z-0" />

            {/* Dynamic Background Orbs */}
            <div className="absolute inset-0 z-10">
                <div
                    className="absolute w-96 h-96 rounded-full opacity-10 blur-3xl"
                    style={{
                        background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)',
                        left: '10%',
                        top: '10%',
                    }}
                />
                <div
                    className="absolute w-80 h-80 rounded-full opacity-10 blur-3xl"
                    style={{
                        background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)',
                        right: '10%',
                        bottom: '10%',
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-20 text-center">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-purple-500/30 rounded-full animate-spin mx-auto mb-8">
                        <div className="absolute inset-2 border-4 border-pink-500 rounded-full animate-ping"></div>
                        <div className="absolute inset-4 border-4 border-blue-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-4">{message}</div>
                    <div className="text-gray-400">{subMessage}</div>
                </div>
            </div>
        </div>
    );
}