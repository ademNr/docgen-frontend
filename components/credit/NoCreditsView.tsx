import React, { memo } from 'react';
import Link from 'next/link';

const NoCreditsView: React.FC = memo(() => (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/60 via-amber-950/60 to-slate-900/60"></div>

        <div className="relative z-20 text-center max-w-md px-4">
            <div className="bg-amber-500/10 backdrop-blur-md border border-amber-500/20 rounded-3xl p-12 shadow-2xl">
                <div className="text-6xl mb-6 animate-pulse">💰</div>
                <h3 className="text-3xl font-bold text-amber-400 mb-4">Out of Credits</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                    You've used all your documentation generation credits. To continue creating documentation, please purchase more credits.
                </p>

                <div className="flex flex-col gap-4">
                    <Link href="/billing">
                        <button
                            className="w-full py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
                            style={{
                                background: 'linear-gradient(45deg, #f59e0b, #eab308)',
                                boxShadow: '0 10px 30px rgba(245, 158, 11, 0.3)',
                            }}
                        >
                            <span>Buy Credits</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-200%] hover:translate-x-[200%] transition-transform duration-1000" />
                        </button>
                    </Link>

                    <Link href="/dashboard">
                        <button
                            className="w-full py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
                            style={{
                                background: 'linear-gradient(45deg, #475569, #334155)',
                            }}
                        >
                            <span>Go to Dashboard</span>
                        </button>
                    </Link>
                </div>
            </div>
        </div>

        <div className="absolute bottom-10 left-0 right-0 text-center text-amber-500/30 text-sm">
            <p>Need more? Our premium plans offer unlimited documentation generation</p>
        </div>
    </div>
));

export default NoCreditsView;