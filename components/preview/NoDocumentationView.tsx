import React, { memo } from 'react';

const NoDocumentationView: React.FC = memo(() => (
    <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center px-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">No documentation found</h3>
            <p className="text-sm sm:text-base text-slate-400 max-w-md mx-auto">
                We couldn't generate documentation for this repository. Please try again.
            </p>
            <button
                onClick={() => window.location.reload()}
                className="mt-4 sm:mt-6 px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-medium text-white transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                style={{
                    background: 'linear-gradient(45deg, #0ea5e9, #0284c7)',
                }}
            >
                Try Again
            </button>
        </div>
    </div>
));

export default NoDocumentationView;