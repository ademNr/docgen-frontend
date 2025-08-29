"use client"
import { useAuth } from '@/app/context/AuthContext';
import LoadingPage from '@/components/LoadingPage';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Code, Zap, Palette, Brain, Github, Play, Star, GitFork, Eye, Users, FileText, TrendingUp, Download, Shield, Cpu, BookOpen, AlertCircle, GitPullRequest, Settings, Bell, Plus, User, UserCheck, UserCog, UserPlus, Crown, Heart } from 'lucide-react';
export default function Home() {
  const { isAuthenticated, login, isLoading } = useAuth();
  const router = useRouter();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [statsVisible, setStatsVisible] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({ developers: 0, docs: 0, uptime: 0 });
  const [currentCodeLine, setCurrentCodeLine] = useState(0);
  const [activeTab, setActiveTab] = useState('code');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [stars, setStars] = useState<Array<{
    x: number;
    y: number;
    z: number;
    size: number;
    speed: number;
  }>>([]);

  const fullText = "A production-ready Next.js 14 application featuring modern authentication, beautiful UI components, and TypeScript support. Built with industry best practices and optimized for performance.";
  const codeLines = [
    "git clone https://github.com/username/nextjs-auth-app.git",
    "cd nextjs-auth-app",
    "npm install",
    "npm run dev"
  ];

  const tabs = [
    { id: 'code', label: 'Code', icon: Code, count: null },
    { id: 'issues', label: 'Issues', icon: AlertCircle, count: 12 },
    { id: 'pulls', label: 'Pull requests', icon: GitPullRequest, count: 3 },
    { id: 'discussions', label: 'Discussions', icon: Users, count: 8 }
  ];

  const features = [
    {
      icon: <Zap className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Lightning Fast",
      desc: "Generate comprehensive documentation in seconds, not hours",
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      icon: <Palette className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Beautiful Design",
      desc: "Stunning, responsive layouts that make your docs shine",
      gradient: "from-pink-400 to-rose-500"
    },
    {
      icon: <Brain className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Smart content generation",
      desc: "AI-powered content that understands your codebase",
      gradient: "from-blue-400 to-indigo-500"
    },
  ];

  // Typing animation effect
  useEffect(() => {
    let index = 0;
    const typeInterval = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typeInterval);
      }
    }, 25);
    return () => clearInterval(typeInterval);
  }, []);

  // Code line animation
  useEffect(() => {
    const codeInterval = setInterval(() => {
      setCurrentCodeLine(prev => (prev + 1) % codeLines.length);
    }, 2500);
    return () => clearInterval(codeInterval);
  }, []);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  // Stats animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !statsVisible) {
          setStatsVisible(true);

          // Animate developers count
          let devCount = 0;
          const devInterval = setInterval(() => {
            devCount += 50;
            if (devCount >= 2500) {
              devCount = 2500;
              clearInterval(devInterval);
            }
            setAnimatedStats(prev => ({ ...prev, developers: devCount }));
          }, 20);

          // Animate docs count
          let docsCount = 0;
          const docsInterval = setInterval(() => {
            docsCount += 100;
            if (docsCount >= 5800) {
              docsCount = 5800;
              clearInterval(docsInterval);
            }
            setAnimatedStats(prev => ({ ...prev, docs: docsCount }));
          }, 25);

          // Animate uptime
          let uptimeCount = 0;
          const uptimeInterval = setInterval(() => {
            uptimeCount += 1;
            if (uptimeCount >= 99.9) {
              uptimeCount = 99.9;
              clearInterval(uptimeInterval);
            }
            setAnimatedStats(prev => ({ ...prev, uptime: uptimeCount }));
          }, 30);
        }
      },
      { threshold: 0.1 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    // Fallback animation trigger after 3 seconds if intersection observer doesn't work
    const fallbackTimer = setTimeout(() => {
      if (!statsVisible) {
        setStatsVisible(true);

        // Animate developers count
        let devCount = 0;
        const devInterval = setInterval(() => {
          devCount += 50;
          if (devCount >= 2500) {
            devCount = 2500;
            clearInterval(devInterval);
          }
          setAnimatedStats(prev => ({ ...prev, developers: devCount }));
        }, 20);

        // Animate docs count
        let docsCount = 0;
        const docsInterval = setInterval(() => {
          docsCount += 100;
          if (docsCount >= 5800) {
            docsCount = 5800;
            clearInterval(docsInterval);
          }
          setAnimatedStats(prev => ({ ...prev, docs: docsCount }));
        }, 25);

        // Animate uptime
        let uptimeCount = 0;
        const uptimeInterval = setInterval(() => {
          uptimeCount += 1;
          if (uptimeCount >= 99.9) {
            uptimeCount = 99.9;
            clearInterval(uptimeInterval);
          }
          setAnimatedStats(prev => ({ ...prev, uptime: uptimeCount }));
        }, 30);
      }
    }, 3000);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [statsVisible]);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/repos');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    // Initialize starfield
    const newStars = Array.from({ length: 200 }, () => ({
      x: (Math.random() - 0.5) * 2000,
      y: (Math.random() - 0.5) * 2000,
      z: Math.random() * 1000,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 1.5 + 0.5,
    }));
    setStars(newStars);

    // Feature rotation
    const featureInterval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % features.length);
    }, 4000);

    // Scroll listener
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(featureInterval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Enhanced starfield animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.05)';
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
          const opacity = 0.3 - star.z / 1000;
          ctx.fillStyle = `rgba(139, 92, 246, ${opacity})`;
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();

          // Add glow effect for brighter stars
          if (opacity > 0.15) {
            ctx.beginPath();
            ctx.fillStyle = `rgba(139, 92, 246, ${opacity * 0.2})`;
            ctx.arc(x, y, size * 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
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

  if (isLoading || isAuthenticated) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-slate-900 overflow-x-hidden" onMouseMove={handleMouseMove}>
      {/* Clean Starfield Canvas Only */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 30%, #312e81 60%, #0f172a 100%)'
        }}
      />

      {/* Subtle Grid Pattern */}
      <div className="fixed inset-0 z-5 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
        backgroundSize: '50px 50px'
      }}></div>

      {/* Main Content */}
      <div className="relative z-20">
        {/* Enhanced Header */}
        <header className="flex items-center justify-between p-4 sm:p-6 lg:p-8 max-w-8xl mx-auto animate-fade-in-down px-4 sm:px-8 lg:px-12">
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

        {/* Restructured Hero Section */}
        <section className="min-h-screen flex items-center px-4 sm:px-8 lg:px-12 py-12 mx-4 sm:mx-8 lg:mx-12">
          <div className="max-w-8xl mx-auto w-full">
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 lg:gap-12 xl:gap-16 items-start">
              {/* Left Content - 2 columns */}
              <div className="xl:col-span-2 space-y-8 lg:space-y-10">
                {/* Enhanced Main Headline */}
                <div className="space-y-4 sm:space-y-6">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight animate-fade-in-up">
                    <span className="text-white animate-text-shimmer block mb-2">Transform your</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 animate-gradient-x">
                      repositories
                    </span>
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 font-light animate-fade-in-up animation-delay-200 leading-relaxed">
                    Easily generate your project documentation in seconds.
                  </p>
                </div>

                {/* Enhanced Features List */}
                <div className="space-y-4 sm:space-y-5 animate-fade-in-up animation-delay-400">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-2xl transition-all duration-700 transform hover:translate-x-2 ${currentFeature === index
                        ? 'text-white scale-105 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20'
                        : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/30'
                        }`}
                    >
                      <div className={`p-2 sm:p-3 rounded-xl transition-all duration-700 ${currentFeature === index
                        ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-400 shadow-lg shadow-purple-500/25 animate-pulse-glow'
                        : 'text-gray-500 hover:bg-gray-700/50'
                        }`}>
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm sm:text-base font-semibold mb-1">{feature.title}</h3>
                        <p className="text-sm text-gray-400">{feature.desc}</p>
                      </div>
                      {currentFeature === index && (
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Enhanced CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 animate-fade-in-up animation-delay-600">
                  <button
                    onClick={handleLogin}
                    className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-white text-black font-semibold rounded-xl transition-all duration-500 hover:bg-gray-100 hover:scale-105 hover:shadow-2xl hover:shadow-white/25 active:scale-95 flex items-center justify-center space-x-3 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                    <Github className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:rotate-12" />
                    <span className="text-sm sm:text-base">Start with GitHub</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </button>

                </div>
              </div>

              {/* Enhanced GitHub Interface - 3 columns */}
              <div className="xl:col-span-3 animate-fade-in-left animation-delay-800 mt-8 xl:mt-0">
                <div className="bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl shadow-purple-500/5 hover:shadow-purple-500/10 transition-all duration-700 hover:scale-[1.01] group overflow-hidden">
                  {/* GitHub Header */}
                  <div className="bg-gray-800/80 border-b border-gray-700/50 p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                          <Github className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <span className="text-blue-400 hover:underline cursor-pointer text-xs sm:text-sm">username</span>
                            <span className="text-gray-400">/</span>
                            <span className="text-white font-semibold text-xs sm:text-sm">nextjs-auth-app</span>
                            <span className="px-1.5 py-0.5 sm:px-2 bg-gray-700 text-gray-300 text-xs rounded-full border border-gray-600">Public</span>
                          </div>
                        </div>
                      </div>
                      <div className="hidden sm:flex items-center space-x-2">
                        <button className="flex items-center space-x-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs sm:text-sm rounded-lg transition-colors">
                          <Bell className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Watch</span>
                          <span className="bg-gray-600 px-1 sm:px-1.5 py-0.5 rounded text-xs">12</span>
                        </button>
                        <button className="flex items-center space-x-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs sm:text-sm rounded-lg transition-colors">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Star</span>
                          <span className="bg-gray-600 px-1 sm:px-1.5 py-0.5 rounded text-xs">2.1k</span>
                        </button>
                        <button className="flex items-center space-x-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs sm:text-sm rounded-lg transition-colors">
                          <GitFork className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Fork</span>
                          <span className="bg-gray-600 px-1 sm:px-1.5 py-0.5 rounded text-xs">456</span>
                        </button>
                      </div>
                    </div>
                    {/* Repository Description */}
                    <div className="mt-2 sm:mt-3 text-gray-300 text-xs sm:text-sm">
                      A production-ready Next.js authentication app with TypeScript and Tailwind CSS
                    </div>
                    {/* Topics */}
                    <div className="flex flex-wrap gap-1 sm:gap-2 mt-2 sm:mt-3">
                      {['nextjs', 'typescript', 'tailwindcss', 'authentication', 'react', 'prisma'].map((topic) => (
                        <span key={topic} className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-900/30 text-blue-300 text-xs rounded-full border border-blue-700/50 hover:bg-blue-800/40 cursor-pointer transition-colors">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Navigation Tabs */}
                  <div className="border-b border-gray-700/50">
                    <div className="flex items-center px-3 sm:px-4 overflow-x-auto">
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-all duration-300 whitespace-nowrap ${activeTab === tab.id
                            ? 'border-orange-500 text-white'
                            : 'border-transparent text-gray-400 hover:text-gray-300'
                            }`}
                        >
                          <tab.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{tab.label}</span>
                          {tab.count && (
                            <span className="bg-gray-700 text-gray-300 px-1 sm:px-1.5 py-0.5 rounded-full text-xs">
                              {tab.count}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Repository Stats Bar */}
                  <div className="bg-gray-800/50 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-700/50">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center space-x-3 sm:space-x-6">
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-gray-300">Latest commit</span>
                          <span className="text-gray-400 hidden sm:inline">2 hours ago</span>
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2 text-gray-400">
                          <GitPullRequest className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">3 commits ahead</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-4 text-gray-400 text-xs">
                        <span>📁 42</span>
                        <span className="hidden sm:inline">📊 Contributors: 12</span>
                      </div>
                    </div>
                  </div>

                  {/* README Content */}
                  <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    {/* README Header */}
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                      <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      <h2 className="text-lg sm:text-xl font-bold text-white">README.md</h2>
                    </div>

                    {/* Project Title and Badges */}
                    <div className="space-y-3 sm:space-y-4">
                      <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white group-hover:text-purple-400 transition-colors duration-500">
                        🚀 Next.js Authentication App
                      </h1>
                      <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6">
                        <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-green-600 text-white text-xs rounded font-medium">Build Passing</span>
                        <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-600 text-white text-xs rounded font-medium">Next.js 14.0.0</span>
                        <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-500 text-white text-xs rounded font-medium">TypeScript</span>
                        <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-cyan-500 text-white text-xs rounded font-medium">Tailwind CSS</span>
                        <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-600 text-white text-xs rounded font-medium">MIT License</span>
                      </div>
                    </div>

                    {/* Animated Description */}
                    <div className="animate-fade-in animation-delay-2000">
                      <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                        {typedText}
                        <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100 text-purple-400`}>|</span>
                      </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 animate-fade-in animation-delay-2500">
                      {[
                        { icon: '🔐', title: 'NextAuth.js', desc: 'Complete authentication solution' },
                        { icon: '🎨', title: 'Tailwind CSS', desc: 'Utility-first CSS framework' },
                        { icon: '📱', title: 'Responsive', desc: 'Mobile-first design approach' },
                        { icon: '⚡', title: 'Fast', desc: 'Optimized for performance' }
                      ].map((feature, index) => (
                        <div key={feature.title} className={`flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors animate-slide-in-right`} style={{ animationDelay: `${2.7 + index * 0.1}s` }}>
                          <span className="text-lg sm:text-2xl">{feature.icon}</span>
                          <div>
                            <h4 className="text-white font-medium text-sm sm:text-base">{feature.title}</h4>
                            <p className="text-gray-400 text-xs sm:text-sm">{feature.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Installation Section */}
                    <div className="animate-fade-in animation-delay-3000">
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3 flex items-center space-x-2">
                        <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                        <span>🚀 Quick Start</span>
                      </h3>
                      <div className="bg-gray-800/80 rounded-xl p-3 sm:p-4 font-mono text-xs sm:text-sm border border-gray-700/50 overflow-x-auto">
                        {codeLines.map((line, index) => (
                          <div
                            key={index}
                            className={`flex items-center space-x-2 sm:space-x-3 py-1 sm:py-2 transition-all duration-500 ${currentCodeLine === index
                              ? 'text-green-400 bg-green-400/10 px-2 sm:px-3 rounded-lg border-l-2 border-green-400'
                              : 'text-gray-400'
                              }`}
                          >
                            <span className="text-gray-600 select-none w-3 sm:w-4">$</span>
                            <span className="flex-1 whitespace-nowrap">{line}</span>
                            {currentCodeLine === index && (
                              <div className="w-1.5 h-3 sm:w-2 sm:h-4 bg-green-400 animate-pulse rounded"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Project Structure */}
                    <div className="animate-fade-in animation-delay-3500">
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">📁 Project Structure</h3>
                      <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 font-mono text-xs sm:text-sm">
                        <div className="space-y-1 text-gray-300">
                          <div>📦 nextjs-auth-app</div>
                          <div className="ml-3 sm:ml-4">├── 📁 app/</div>
                          <div className="ml-6 sm:ml-8">├── 📄 layout.tsx</div>
                          <div className="ml-6 sm:ml-8">├── 📄 page.tsx</div>
                          <div className="ml-6 sm:ml-8">└── 📁 api/</div>
                          <div className="ml-3 sm:ml-4">├── 📁 components/</div>
                          <div className="ml-3 sm:ml-4">├── 📁 lib/</div>
                          <div className="ml-3 sm:ml-4">├── 📄 package.json</div>
                          <div className="ml-3 sm:ml-4">└── 📄 tailwind.config.js</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Stats Section */}
        <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-12" ref={statsRef}>
          <div className="max-w-8xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                Trusted by developers worldwide
              </h2>
              <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
                Join thousands of developers who have already transformed their documentation workflow
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
              {/* Developers Stat */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-6 sm:p-8 transition-all duration-700 hover:scale-105 hover:border-purple-400/50 hover:shadow-2xl hover:shadow-purple-500/10">
                  <div className="flex items-center justify-center mb-4 sm:mb-6">
                    <div className="p-3 sm:p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl">
                      <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 animate-pulse-glow" />
                    </div>
                  </div>
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2 font-mono text-center">
                    {animatedStats.developers.toLocaleString()}+
                  </div>
                  <div className="text-gray-400 font-medium text-center text-base sm:text-lg">Developers</div>
                  <div className="mt-4 sm:mt-6 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
                </div>
              </div>

              {/* Docs Created Stat */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-6 sm:p-8 transition-all duration-700 hover:scale-105 hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-500/10">
                  <div className="flex items-center justify-center mb-4 sm:mb-6">
                    <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl">
                      <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 animate-pulse-glow" />
                    </div>
                  </div>
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2 font-mono text-center">
                    {animatedStats.docs.toLocaleString()}+
                  </div>
                  <div className="text-gray-400 font-medium text-center text-base sm:text-lg">Docs Created</div>
                  <div className="mt-4 sm:mt-6 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
                </div>
              </div>

              {/* Uptime Stat */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-6 sm:p-8 transition-all duration-700 hover:scale-105 hover:border-green-400/50 hover:shadow-2xl hover:shadow-green-500/10">
                  <div className="flex items-center justify-center mb-4 sm:mb-6">
                    <div className="p-3 sm:p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl">
                      <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 animate-pulse-glow" />
                    </div>
                  </div>
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-2 font-mono text-center">
                    {animatedStats.uptime.toFixed(1)}%
                  </div>
                  <div className="text-gray-400 font-medium text-center text-base sm:text-lg">Uptime</div>
                  <div className="mt-4 sm:mt-6 h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Final CTA */}
        <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-12 text-center relative">
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 relative">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white animate-fade-in-up">
              Ready to get started?
            </h2>
            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto animate-fade-in-up animation-delay-200 leading-relaxed">
              Join thousands of developers who have already transformed their workflow with GitForje
            </p>
            <div className="animate-fade-in-up animation-delay-400">
              <button
                onClick={handleLogin}
                className="group relative inline-flex items-center px-8 sm:px-12 py-4 sm:py-5 bg-white text-black font-bold text-base sm:text-lg rounded-2xl transition-all duration-500 hover:bg-gray-100 hover:scale-110 hover:shadow-2xl hover:shadow-white/25 active:scale-95 space-x-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                <Github className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:rotate-12" />
                <span>Start Building Today</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
            </div>
            <p className="text-sm text-gray-500 animate-fade-in-up animation-delay-600">
              No credit card required • 2-minute setup
            </p>
          </div>
        </section>
      </div>

      {/* Enhanced Custom Styles */}
      <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    33% { transform: translateY(-20px) rotate(2deg); }
                    66% { transform: translateY(-10px) rotate(-2deg); }
                }
                
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.6; }
                    50% { opacity: 1; }
                }
                
                @keyframes pulse-glow {
                    0%, 100% {
                        opacity: 0.8;
                        box-shadow: 0 0 5px currentColor;
                    }
                    50% {
                        opacity: 1;
                        box-shadow: 0 0 20px currentColor, 0 0 30px currentColor;
                    }
                }
                
                @keyframes gradient-x {
                    0%, 100% {
                        background-size: 200% 200%;
                        background-position: left center;
                    }
                    50% {
                        background-size: 200% 200%;
                        background-position: right center;
                    }
                }
                
                @keyframes text-shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                
                @keyframes expand-width {
                    from { width: 0; }
                    to { width: 100%; }
                }
                
                @keyframes expand-width-slow {
                    from { width: 0; }
                    to { width: var(--target-width, 100%); }
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
                
                @keyframes fade-in-down {
                    from {
                        opacity: 0;
                        transform: translateY(-40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes fade-in-left {
                    from {
                        opacity: 0;
                        transform: translateX(40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes slide-in-right {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
                .animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }
                .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
                .animate-gradient-x { animation: gradient-x 3s ease infinite; }
                .animate-text-shimmer {
                    background: linear-gradient(90deg, #ffffff 0%, #a855f7 50%, #ffffff 100%);
                    background-size: 200% 100%;
                    -webkit-background-clip: text;
                    background-clip: text;
                    animation: text-shimmer 3s ease-in-out infinite;
                }
                .animate-expand-width { animation: expand-width 1s ease-out; }
                .animate-expand-width-slow { animation: expand-width-slow 2s ease-out; }
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out forwards;
                    opacity: 0;
                }
                .animate-fade-in-down {
                    animation: fade-in-down 0.8s ease-out forwards;
                    opacity: 0;
                }
                .animate-fade-in-left {
                    animation: fade-in-left 0.8s ease-out forwards;
                    opacity: 0;
                }
                .animate-slide-in-right {
                    animation: slide-in-right 0.6s ease-out forwards;
                    opacity: 0;
                }
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out forwards;
                    opacity: 0;
                }
                
                .animation-delay-200 { animation-delay: 0.2s; }
                .animation-delay-300 { animation-delay: 0.3s; }
                .animation-delay-400 { animation-delay: 0.4s; }
                .animation-delay-500 { animation-delay: 0.5s; }
                .animation-delay-600 { animation-delay: 0.6s; }
                .animation-delay-800 { animation-delay: 0.8s; }
                .animation-delay-1000 { animation-delay: 1s; }
                .animation-delay-1200 { animation-delay: 1.2s; }
                .animation-delay-1400 { animation-delay: 1.4s; }
                .animation-delay-1600 { animation-delay: 1.6s; }
                .animation-delay-1800 { animation-delay: 1.8s; }
                .animation-delay-2000 { animation-delay: 2s; }
                .animation-delay-2500 { animation-delay: 2.5s; }
                .animation-delay-3000 { animation-delay: 3s; }
                .animation-delay-3500 { animation-delay: 3.5s; }
                .animation-delay-4000 { animation-delay: 4s; }
                .animation-delay-5000 { animation-delay: 5s; }
                .animation-delay-5200 { animation-delay: 5.2s; }
            `}</style>
    </div>
  );
}