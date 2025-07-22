"use client";
import { useAuth } from '@/app/context/AuthContext';
import LoadingPage from '@/components/LoadingPage';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef, useCallback } from 'react';

// Static data outside component
const FEATURES = [
    {
        icon: "⚡",
        title: "Lightning Fast",
        desc: "Generate comprehensive documentation in seconds, not hours",
        gradient: "from-yellow-400 to-orange-500"
    },
    {
        icon: "🎨",
        title: "Beautiful Design",
        desc: "Stunning, responsive layouts that make your docs shine",
        gradient: "from-pink-400 to-rose-500"
    },
    {
        icon: "🤖",
        title: "AI Powered",
        desc: "Smart content generation that understands your codebase",
        gradient: "from-blue-400 to-indigo-500"
    },
    {
        icon: "🚀",
        title: "Deploy Anywhere",
        desc: "One-click deployment to multiple platforms and CDNs",
        gradient: "from-green-400 to-emerald-500"
    },
];

export default function LoginPage() {
    const { isAuthenticated, login, isLoading } = useAuth();
    const router = useRouter();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [currentFeature, setCurrentFeature] = useState(0);
    const starsRef = useRef<Array<{
        x: number;
        y: number;
        z: number;
        size: number;
        speed: number;
    }>>([]);

    // Authentication redirect effect
    useEffect(() => {
        if (isAuthenticated && !isLoading) {
            router.push('/repos');
        }
    }, [isAuthenticated, isLoading, router]);

    // Starfield initialization
    useEffect(() => {
        starsRef.current = Array.from({ length: 150 }, () => ({
            x: (Math.random() - 0.5) * 2000,
            y: (Math.random() - 0.5) * 2000,
            z: Math.random() * 1000,
            size: Math.random() * 2 + 1,
            speed: Math.random() * 2 + 0.5,
        }));

        const featureInterval = setInterval(() => {
            setCurrentFeature(prev => (prev + 1) % FEATURES.length);
        }, 4000);

        return () => clearInterval(featureInterval);
    }, []);

    // Animation frame handling
    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        starsRef.current.forEach(star => {
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
                ctx.fillStyle = `rgba(139, 92, 246, ${0.6 - star.z / 1000})`;
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }, []);

    // Canvas setup and animation loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        let animationFrameId: number;
        const render = () => {
            animate();
            animationFrameId = requestAnimationFrame(render);
        };
        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [animate]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        setMousePos({
            x: (e.clientX / window.innerWidth) * 2 - 1,
            y: (e.clientY / window.innerHeight) * 2 - 1,
        });
    }, []);

    const handleLogin = useCallback(() => {
        login();
    }, [login]);

    if (isLoading || isAuthenticated) {
        return <LoadingPage />;
    }

    return (
        <div className="min-h-screen bg-slate-900 overflow-x-hidden" onMouseMove={handleMouseMove}>
            <StarfieldBackground canvasRef={canvasRef} />
            <FloatingOrbs mousePos={mousePos} />
            <MainContent
                handleLogin={handleLogin}
                currentFeature={currentFeature}
                mousePos={mousePos}
            />
            <AnimatedStyles />
        </div>
    );
}

// --------------------------------------Extracted Components---------------------------------------------------------//
const StarfieldBackground = ({ canvasRef }: { canvasRef: React.RefObject<HTMLCanvasElement | null> }) => (
    <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0"
        style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 30%, #312e81 60%, #0f172a 100%)'
        }}
    />
);

const FloatingOrbs = ({ mousePos }: { mousePos: { x: number; y: number } }) => (
    <div className="fixed inset-0 z-10">
        <div
            className="absolute w-96 h-96 rounded-full opacity-10 blur-3xl transition-all duration-[2000ms] ease-out"
            style={{
                background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)',
                transform: `translate(${mousePos.x * 50}px, ${mousePos.y * 50}px) scale(${1 + Math.abs(mousePos.x) * 0.1})`,
                left: '20%',
                top: '10%',
                animation: 'float 8s ease-in-out infinite',
            }}
        />
        <div
            className="absolute w-80 h-80 rounded-full opacity-8 blur-3xl transition-all duration-[2500ms] ease-out"
            style={{
                background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)',
                transform: `translate(${mousePos.x * -40}px, ${mousePos.y * -30}px)`,
                right: '15%',
                top: '20%',
                animation: 'float 10s ease-in-out infinite reverse',
            }}
        />
        <div
            className="absolute w-64 h-64 rounded-full opacity-6 blur-3xl transition-all duration-[3000ms] ease-out"
            style={{
                background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)',
                transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 40}px)`,
                left: '60%',
                bottom: '30%',
                animation: 'float 12s ease-in-out infinite',
            }}
        />
    </div>
);

const MainContent = ({
    handleLogin,
    currentFeature,
    mousePos
}: {
    handleLogin: () => void;
    currentFeature: number;
    mousePos: { x: number; y: number };
}) => (
    <div className="relative z-20">
        <HeroSection handleLogin={handleLogin} />
        <FeaturesSection currentFeature={currentFeature} />
        <CTASection handleLogin={handleLogin} />
    </div>
);

const HeroSection = ({ handleLogin }: { handleLogin: () => void }) => (
    <section className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
            <div className="mb-8 animate-fade-in-up animation-delay-200">
                <h1 className="text-7xl md:text-9xl font-black mb-4 leading-none">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-blue-200 drop-shadow-2xl">
                        Git
                    </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 drop-shadow-2xl">
                        Forge
                    </span>
                </h1>
                <div className="h-1 w-32 mx-auto bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-lg shadow-purple-500/50"></div>
            </div>

            <p className="text-2xl md:text-3xl font-light text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed animate-fade-in-up animation-delay-400">
                Transform your GitHub repositories into
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 font-medium"> stunning documentation </span>
                that developers love to read
            </p>

            <p className="text-lg text-gray-400 mb-16 max-w-3xl mx-auto animate-fade-in-up animation-delay-600">
                AI-powered documentation generation • Beautiful template • One-click deployment • Zero configuration
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20 animate-fade-in-up animation-delay-800">
                <LoginButton handleLogin={handleLogin} />
                <DemoButton />
            </div>

            <SocialProof />
        </div>
    </section>
);

const LoginButton = ({ handleLogin }: { handleLogin: () => void }) => (
    <button
        onClick={handleLogin}
        className="group relative px-12 py-5 text-xl font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-2xl shadow-purple-500/25 transition-all duration-500 hover:scale-105 hover:shadow-purple-500/40 active:scale-95 overflow-hidden"
    >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative flex items-center">
            <GitHubIcon />
            Start with GitHub
        </div>
    </button>
);

const GitHubIcon = () => (
    <svg className="w-6 h-6 mr-3 transition-transform duration-300 group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
    </svg>
);

const DemoButton = () => (
    <button className="px-8 py-5 text-lg font-semibold text-gray-300 border border-gray-600 rounded-2xl transition-all duration-300 hover:border-purple-400 hover:text-white hover:bg-purple-500/10 hover:scale-105">
        <div className="flex items-center">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            View Demo
        </div>
    </button>
);

const SocialProof = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto animate-fade-in-up animation-delay-1000 px-4 sm:px-6">
        <SocialCard
            value="2.5K+"
            label="Developers"
            gradient="from-purple-300 via-purple-400 to-purple-500"
            hoverGradient="from-purple-400/60 to-purple-300/80"
        />
        <SocialCard
            value="5.8K+"
            label="Docs Created"
            gradient="from-cyan-300 via-blue-400 to-sky-500"
            hoverGradient="from-cyan-400/60 to-blue-300/80"
        />
        <SocialCard
            value="99.9%"
            label="Uptime"
            gradient="from-emerald-300 via-green-400 to-emerald-500"
            hoverGradient="from-emerald-400/60 to-green-300/80"
        />
    </div>
);

const SocialCard = ({
    value,
    label,
    gradient,
    hoverGradient
}: {
    value: string;
    label: string;
    gradient: string;
    hoverGradient: string;
}) => (
    <div className="text-center group relative">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient.replace('from', 'from').replace('via', 'to').replace('to', 'to')}/10 to-${gradient.split('to-')[1]}/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
        <div className="relative bg-slate-900 rounded-2xl p-4 sm:p-5 transition-all duration-500 group-hover:-translate-y-1 group-hover:border-purple-500/50 group-hover:shadow-xl group-hover:shadow-purple-500/20 border border-slate-800/50">
            <div className={`text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r ${gradient} mb-2 relative`}>
                {value}
                <div className={`absolute inset-0 bg-gradient-to-r ${gradient.split(' ')[0]}/0 to-${gradient.split('to-')[1]}/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full animate-pulse-slow`}></div>
            </div>
            <div className={`text-xs sm:text-sm font-medium bg-gradient-to-r ${hoverGradient} text-transparent bg-clip-text group-hover:from-purple-300 group-hover:to-purple-200 transition-all`}>
                {label}
            </div>
        </div>
    </div>
);

const FeaturesSection = ({ currentFeature }: { currentFeature: number }) => (
    <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
                <h2 className="text-6xl font-black text-white mb-6">
                    Why developers choose
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600"> GitForge</span>
                </h2>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                    Everything you need to create, maintain, and deploy world-class documentation
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {FEATURES.map((feature, index) => (
                    <FeatureCard
                        key={index}
                        feature={feature}
                        isActive={currentFeature === index}
                    />
                ))}
            </div>
        </div>
    </section>
);

const FeatureCard = ({
    feature,
    isActive
}: {
    feature: typeof FEATURES[0];
    isActive: boolean;
}) => (
    <div
        className={`group relative p-8 rounded-3xl backdrop-blur-sm border transition-all duration-700 hover:scale-105 cursor-pointer ${isActive
            ? 'bg-gradient-to-br from-white/10 to-white/5 border-purple-400/50 shadow-2xl shadow-purple-500/20'
            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
            }`}
    >
        <div className="text-6xl mb-6 text-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
            {feature.icon}
        </div>

        <h3 className="text-2xl font-bold text-white mb-4 text-center group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
            {feature.title}
        </h3>

        <p className="text-gray-400 text-center leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
            {feature.desc}
        </p>

        {isActive && (
            <div className="absolute inset-0 rounded-3xl">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-400/20 via-transparent to-pink-400/20 animate-pulse"></div>
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/5 to-transparent animate-ping"></div>
            </div>
        )}

        <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
    </div>
);

const CTASection = ({ handleLogin }: { handleLogin: () => void }) => (
    <section className="py-32 px-6 text-center relative">
        <div className="max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent blur-3xl"></div>

            <div className="relative">
                <h2 className="text-6xl font-black text-white mb-8 leading-tight">
                    Ready to revolutionize your
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600"> documentation?</span>
                </h2>

                <p className="text-xl text-gray-400 mb-16 max-w-2xl mx-auto leading-relaxed">
                    Join thousands of developers who have already transformed their workflow with GitForge
                </p>

                <CTAButton handleLogin={handleLogin} />

                <p className="text-sm text-gray-500 mt-6">
                    Free forever • No credit card required • 2-minute setup
                </p>
            </div>
        </div>
    </section>
);

const CTAButton = ({ handleLogin }: { handleLogin: () => void }) => (
    <button
        onClick={handleLogin}
        className="group relative inline-flex items-center px-16 py-6 text-2xl font-bold text-white bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl border border-gray-600 shadow-2xl transition-all duration-500 hover:scale-110 hover:border-purple-400 hover:shadow-purple-500/25 active:scale-95 overflow-hidden"
    >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
        <div className="relative flex items-center">
            <GitHubIcon />
            Start Building Today
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl"></div>
    </button>
);

const AnimatedStyles = () => (
    <style jsx>{`
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      33% { transform: translateY(-20px) rotate(2deg); }
      66% { transform: translateY(-10px) rotate(-2deg); }
    }

    @keyframes fade-in-up {
      from {
        opacity: 0;
        transform: translateY(40px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes pulse-slow {
      0%, 100% { opacity: 0.2; }
      50% { opacity: 0.5; }
    }

    .animate-fade-in-up {
      animation: fade-in-up 0.8s ease-out forwards;
      opacity: 0;
    }

    .animation-delay-200 {
      animation-delay: 0.2s;
    }

    .animation-delay-400 {
      animation-delay: 0.4s;
    }

    .animation-delay-600 {
      animation-delay: 0.6s;
    }

    .animation-delay-800 {
      animation-delay: 0.8s;
    }

    .animation-delay-1000 {
      animation-delay: 1s;
    }

    .animate-pulse-slow {
      animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
  `}</style>
);