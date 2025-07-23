import React, { memo } from 'react';

const CopyToast: React.FC = memo(() => (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 animate-slide-up">
        <div className="bg-green-500/90 backdrop-blur-sm text-white px-4 py-3 sm:px-6 sm:py-4 rounded-lg sm:rounded-xl shadow-lg flex items-center space-x-2 sm:space-x-3 text-sm sm:text-base">
            <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Copied to clipboard!</span>
        </div>
    </div>
));
CopyToast.displayName = 'CopyToast';
export default CopyToast;