import React, { memo } from 'react';


const NoCreditsView: React.FC = memo(() => {


    const handleDashboardClick = () => {

        // Fallback for client-side navigation
        window.location.href = '/repos';

    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-amber-950/20 to-transparent"></div>
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-amber-400/30 rounded-full animate-ping"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 2}s`
                        }}
                    ></div>
                ))}
            </div>

            <div className="relative z-20 text-center max-w-lg p-8 px-6">
                <div className="bg-slate-800/40 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-orange-500/5 rounded-3xl"></div>

                    {/* Content */}
                    <div className="relative z-10">
                        {/* Icon with enhanced animation */}
                        <div className="relative mb-8">
                            <div className="text-7xl mb-2 animate-bounce">💰</div>
                            <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                        </div>

                        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 bg-clip-text text-transparent mb-4">
                            Credits Exhausted
                        </h1>

                        <p className="text-slate-300 mb-8 leading-relaxed text-lg">
                            You&apos;ve reached your documentation generation limit. Don&apos;t worry—more amazing features await!
                        </p>

                        {/* Payment integration notice */}
                        <div className="bg-slate-700/30 border border-slate-600/30 rounded-2xl p-6 mb-8">
                            <div className="flex items-center justify-center mb-3">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2 animate-pulse"></div>
                                <span className="text-yellow-400 font-semibold text-sm">PAYMENT INTEGRATION COMING SOON</span>
                            </div>
                            <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                                Payment methods are not yet integrated into this platform. We&apos;re working hard to bring you seamless billing soon!
                            </p>

                            {/* Contact section */}
                            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-600/20">
                                <p className="text-slate-300 text-sm mb-3">
                                    <strong className="text-amber-400">Need credits now?</strong> Contact the owner directly:
                                </p>
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="text-green-400 text-xl">📱</div>
                                    <a
                                        href="https://wa.me/+21655514662"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-400 font-mono font-semibold hover:text-green-300 transition-colors duration-200 underline decoration-dotted"
                                    >
                                        +1 (XXX) XXX-XXXX
                                    </a>
                                </div>
                                <p className="text-xs text-slate-500 mt-2">Click to open WhatsApp</p>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col gap-4">
                            <button
                                disabled
                                className="flex-1 py-4 sm:py-5 lg:py-6 px-6 sm:px-8 lg:px-10 rounded-xl sm:rounded-2xl font-bold text-slate-400 transition-all duration-300 relative overflow-hidden cursor-not-allowed group"
                                style={{
                                    background: 'linear-gradient(45deg, #64748b, #475569)',
                                    opacity: 0.7,
                                    border: '1px solid rgba(100, 116, 139, 0.3)'
                                }}
                            >
                                <span className="text-sm sm:text-base lg:text-lg">Buy Credits</span>
                                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-2 sm:px-3 py-1 rounded-full font-black shadow-lg">
                                    SOON
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                            </button>

                            <button
                                onClick={handleDashboardClick}
                                className="w-full py-4 sm:py-5 lg:py-6 px-6 sm:px-8 lg:px-10 rounded-xl sm:rounded-2xl font-bold text-white transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl relative overflow-hidden group border border-slate-600/40"
                                style={{
                                    background: 'linear-gradient(45deg, #1e293b, #334155, #1e293b)',
                                }}
                            >
                                <span className="relative z-10 text-sm sm:text-base lg:text-lg">Return to Dashboard</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-slate-600/20 to-slate-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl sm:rounded-2xl"></div>
                            </button>
                        </div>

                        {/* Additional info */}
                        <div className="mt-8 pt-6 border-t border-slate-700/50">
                            <p className="text-xs text-slate-500">
                                💡 <strong className="text-slate-400">Pro tip:</strong> Premium plans with unlimited generation coming soon
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

NoCreditsView.displayName = 'NoCreditsView';

export default NoCreditsView;