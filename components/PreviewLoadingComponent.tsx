"use client";
import { useEffect, useState, useRef } from 'react';
interface LoadingComponentProps {
    repoFullName: string | null;
    statusMessage: string;
    progress: number;
    currentFile: string | null;
}

const LoadingComponent: React.FC<LoadingComponentProps> = ({
    repoFullName,
    statusMessage,
    progress,
    currentFile
}) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stars, setStars] = useState<Array<{
        x: number;
        y: number;
        z: number;
        size: number;
        speed: number;
    }>>([]);

    const tips = [
        "🔍 Scanning repository structure...",
        "📂 Indexing project files and dependencies...",
        "📝 Generating documentation template...",
        "✨ Auto-generating code examples and usage snippets...",
        "🛠  Analyzing code patterns and relationships...",
        "📚 Organizing content into sections...",
        "🎨 Applying your styling to documentation...",
        "🔗 Cross-linking related components and APIs...",
        "✅ Finalizing interactive documentation pages...",
        "📦 Packaging documentation for export...",
        "🚀 Documentation ready! Applying finishing touches..."
    ];
    const [currentTip, setCurrentTip] = useState(0);

    useEffect(() => {
        // Initialize starfield
        const newStars = Array.from({ length: 150 }, () => ({
            x: (Math.random() - 0.5) * 2000,
            y: (Math.random() - 0.5) * 2000,
            z: Math.random() * 1000,
            size: Math.random() * 2 + 1,
            speed: Math.random() * 2 + 0.5,
        }));
        setStars(newStars);

        // Tip rotation
        const tipInterval = setInterval(() => {
            setCurrentTip(prev => (prev + 1) % tips.length);
        }, 3500);

        return () => {
            clearInterval(tipInterval);
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center relative overflow-hidden" onMouseMove={handleMouseMove}>
            {/* Starfield Canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-0"
                style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}
            />

            {/* Main Content */}
            <div className="relative z-20 w-full max-w-2xl px-4">
                <div className="bg-slate-800/40 backdrop-blur-lg border border-slate-700/50 rounded-xl p-8 shadow-2xl shadow-indigo-500/10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">
                            Generating Documentation
                        </h2>
                        <p className="text-slate-300">
                            Creating doc for <span className="font-mono text-cyan-300">{repoFullName}</span>
                        </p>
                    </div>

                    {/* Progress section */}
                    <div className="mb-8">
                        <div className="flex justify-between mb-3">
                            <span className="text-slate-300 text-sm font-medium">
                                {statusMessage}
                            </span>
                            <span className="text-cyan-300 font-bold">
                                {progress}%
                            </span>
                        </div>

                        {/* Minimal progress bar */}
                        <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                                className="absolute inset-0 rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-cyan-500 to-indigo-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Current file indicator */}
                    {currentFile && (
                        <div className="mb-6">
                            <div className="bg-slate-700/40 border border-slate-600/50 rounded-lg p-4 flex items-center">
                                <div className="flex space-x-1.5 mr-3">
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                                </div>
                                <div className="overflow-hidden">
                                    <div className="text-slate-400 text-xs mb-1">Processing file:</div>
                                    <div className="font-mono text-white text-sm flex items-center">
                                        <span className="truncate max-w-xs md:max-w-md">
                                            {currentFile}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tips while loading */}
                    <div className="text-center">
                        <div className="inline-flex items-center space-x-2 bg-slate-700/30 border border-slate-600/50 rounded-lg px-4 py-3">

                            <span className="text-slate-300 text-sm">
                                {tips[currentTip]}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating indicators */}
            <div className="absolute top-6 right-6 z-20 flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse"></div>
                <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>

            {/* Custom Styles */}
            <style jsx>{`
        @keyframes animate-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        
        .animate-pulse {
          animation: animate-pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
        </div>
    );
};

export default LoadingComponent;