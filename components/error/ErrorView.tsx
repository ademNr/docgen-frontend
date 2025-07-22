import React from 'react';

interface ErrorViewProps {
    error: string;
}

const ErrorView: React.FC<ErrorViewProps> = ({ error }) => (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/60 via-indigo-950/60 to-slate-900/60"></div>

        <div className="relative z-20 text-center max-w-md px-4">
            <div className="bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-3xl p-12 shadow-2xl">
                <div className="text-6xl mb-6 animate-bounce">⚠️</div>
                <h3 className="text-3xl font-bold text-red-400 mb-4">Oops! Something went wrong</h3>
                <p className="text-gray-300 mb-8 leading-relaxed">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="w-full py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
                    style={{
                        background: 'linear-gradient(45deg, #ef4444, #dc2626)',
                        boxShadow: '0 10px 30px rgba(239, 68, 68, 0.3)',
                    }}
                >
                    <span>Try Again</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-200%] hover:translate-x-[200%] transition-transform duration-1000" />
                </button>
            </div>
        </div>
    </div>
);

export default ErrorView;