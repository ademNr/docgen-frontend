
"use client"
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

export default function LoginPage() {
    const { isAuthenticated, login } = useAuth();
    const router = useRouter();



    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [scrollY, setScrollY] = useState(0);
    const [currentFeature, setCurrentFeature] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stars, setStars] = useState<Array<{
        x: number;
        y: number;
        z: number;
        size: number;
        speed: number;
    }>>([]);

    const features = [
        { icon: "⚡", title: "Lightning Fast", desc: "Generate docs in seconds" },
        { icon: "🎨", title: "Beautiful Design", desc: "Stunning documentation layouts" },
        { icon: "🚀", title: "AI Powered", desc: "Smart content generation" },
        { icon: "📱", title: "Responsive", desc: "Perfect on all devices" },
    ];

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/repos');
        }
    }, [isAuthenticated, router]);
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

        // Feature rotation
        const featureInterval = setInterval(() => {
            setCurrentFeature(prev => (prev + 1) % features.length);
        }, 3000);

        // Scroll listener
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);

        return () => {
            clearInterval(featureInterval);
            window.removeEventListener('scroll', handleScroll);
        };
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

    const handleLogin = () => {
        login();
    };

    return (
        <div className="min-h-screen bg-slate-900 overflow-x-hidden" onMouseMove={handleMouseMove}>
            {/* Animated Starfield Canvas */}
            <canvas
                ref={canvasRef}
                className="fixed inset-0 z-0"
                style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}
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
            <div className="relative z-20">
                {/* Hero Section */}
                <section className="min-h-screen flex items-center justify-center px-4">
                    <div className="max-w-6xl mx-auto text-center">
                        {/* Logo */}
                        <div className="mb-8">
                            <div
                                className="inline-flex items-center justify-center w-32 h-32 mx-auto rounded-full transition-all duration-1000"
                                style={{
                                    background: 'linear-gradient(45deg, #8b5cf6, #ec4899, #06b6d4, #8b5cf6)',
                                    backgroundSize: '400% 400%',
                                    animation: 'gradientShift 8s ease infinite',
                                    transform: `rotateX(${mousePos.y * 20}deg) rotateY(${mousePos.x * 20}deg) scale(${1 + Math.abs(mousePos.x) * 0.1})`,
                                    boxShadow: '0 0 100px rgba(139, 92, 246, 0.5)',
                                }}
                            >
                                <div className="w-28 h-28 bg-slate-900/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
                            <span
                                className="block text-transparent bg-clip-text transition-all duration-1000"
                                style={{
                                    backgroundImage: 'linear-gradient(45deg, #ffffff, #8b5cf6, #ec4899, #ffffff)',
                                    backgroundSize: '400% 400%',
                                    animation: 'gradientShift 6s ease infinite',
                                    transform: `translateY(${scrollY * -0.1}px)`,
                                }}
                            >
                                DocsGen
                            </span>
                            <span
                                className="block text-2xl md:text-4xl font-medium text-gray-300 mt-4"
                                style={{ transform: `translateY(${scrollY * -0.2}px)` }}
                            >
                                The Future of Documentation
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p
                            className="text-xl md:text-2xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed"
                            style={{ transform: `translateY(${scrollY * -0.15}px)` }}
                        >
                            Transform your GitHub repositories into stunning, AI-powered documentation
                            that your users will <span className="text-purple-400 font-semibold">actually read</span>
                        </p>

                        {/* CTA Button */}
                        <div className="mb-16">
                            <button
                                onClick={handleLogin}
                                className="group relative inline-flex items-center px-12 py-6 text-xl font-bold text-white transition-all duration-500 ease-out transform hover:scale-110 active:scale-95"
                                style={{
                                    background: 'linear-gradient(45deg, #8b5cf6, #ec4899, #06b6d4)',
                                    backgroundSize: '400% 400%',
                                    animation: 'gradientShift 8s ease infinite',
                                    borderRadius: '50px',
                                    boxShadow: '0 20px 60px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0 30px 80px rgba(139, 92, 246, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                                }}
                            >
                                <svg className="w-8 h-8 mr-4 transition-transform duration-300 group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
                                </svg>
                                Connect with GitHub
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            </button>
                        </div>

                        {/* Social Proof */}
                        <div className="flex items-center justify-center space-x-8 text-gray-500">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">100K+</div>
                                <div className="text-sm">Developers</div>
                            </div>
                            <div className="w-px h-12 bg-gray-600"></div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">1M+</div>
                                <div className="text-sm">Docs Generated</div>
                            </div>
                            <div className="w-px h-12 bg-gray-600"></div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">99.9%</div>
                                <div className="text-sm">Uptime</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-32 px-4 relative">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-5xl font-bold text-center text-white mb-20">
                            Why Developers <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Love</span> DocsGen
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className={`relative p-8 rounded-3xl backdrop-blur-sm border transition-all duration-1000 transform hover:scale-105 ${currentFeature === index
                                        ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-400/50 shadow-2xl shadow-purple-500/20'
                                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                                        }`}
                                    style={{
                                        transform: currentFeature === index
                                            ? `scale(1.05) rotateX(${mousePos.y * 5}deg) rotateY(${mousePos.x * 5}deg)`
                                            : 'scale(1)',
                                    }}
                                >
                                    <div className="text-6xl mb-6 text-center">{feature.icon}</div>
                                    <h3 className="text-2xl font-bold text-white mb-4 text-center">{feature.title}</h3>
                                    <p className="text-gray-400 text-center leading-relaxed">{feature.desc}</p>

                                    {currentFeature === index && (
                                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-400/20 via-transparent to-pink-400/20 animate-pulse"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-32 px-4 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-5xl font-bold text-white mb-8">
                            Ready to Transform Your Docs?
                        </h2>
                        <p className="text-xl text-gray-400 mb-12">
                            Join thousands of developers who&apos;ve already revolutionized their documentation workflow
                        </p>

                        <button
                            onClick={handleLogin}
                            className="inline-flex items-center px-16 py-6 text-2xl font-bold text-white transition-all duration-500 hover:scale-110 active:scale-95"
                            style={{
                                background: 'linear-gradient(45deg, #1f2937, #374151, #1f2937)',
                                backgroundSize: '400% 400%',
                                animation: 'gradientShift 4s ease infinite',
                                borderRadius: '50px',
                                border: '2px solid rgba(255, 255, 255, 0.1)',
                                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                            }}
                        >
                            <svg className="w-8 h-8 mr-4" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
                            </svg>
                            Get Started Now - It&apos;s Free!
                        </button>
                    </div>
                </section>
            </div>

            {/* Custom Styles */}
            <style jsx>{`
                @keyframes gradientShift {
                    0%, 100% { background-position: 0% 50%; }
                    25% { background-position: 100% 50%; }
                    50% { background-position: 100% 100%; }
                    75% { background-position: 0% 100%; }
                }
            `}</style>
        </div>
    );
}