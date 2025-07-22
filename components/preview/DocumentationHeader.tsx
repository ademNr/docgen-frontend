import React from 'react';

interface DocumentationHeaderProps {
    repoFullName: string | null;
    copySuccess: boolean;
    downloadProgress: number;
    onCopy: () => void;
    onDownload: () => void;
}

const DocumentationHeader: React.FC<DocumentationHeaderProps> = ({
    repoFullName,
    copySuccess,
    downloadProgress,
    onCopy,
    onDownload
}) => (
    <div className="fixed top-0 left-0 right-0 z-30 backdrop-blur-md border-b border-white/10 bg-slate-900/80 py-3 sm:py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <div>
                    <h1 className="text-base sm:text-lg font-bold text-white">Documentation Preview</h1>
                    <p className="text-xs sm:text-sm text-slate-300 truncate max-w-[180px] sm:max-w-md">
                        {repoFullName}
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto justify-end">
                <button
                    onClick={onCopy}
                    className="group relative px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl font-medium text-white transition-all duration-300 hover:scale-105 overflow-hidden text-sm"
                    style={{
                        background: copySuccess
                            ? 'linear-gradient(45deg, #10b981, #059669)'
                            : 'linear-gradient(45deg, #0ea5e9, #0284c7)',
                    }}
                >
                    <div className="flex items-center space-x-1 sm:space-x-2 relative z-10">
                        {copySuccess ? (
                            <>
                                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Copied!</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <span className="hidden sm:inline">Copy README</span>
                                <span className="sm:hidden">Copy</span>
                            </>
                        )}
                    </div>

                </button>

                <button
                    onClick={onDownload}
                    disabled={downloadProgress > 0 && downloadProgress < 100}
                    className="group relative px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl font-medium text-white transition-all duration-300 hover:scale-105 overflow-hidden text-sm disabled:opacity-70"
                    style={{
                        background: 'linear-gradient(45deg, #8b5cf6, #7c3aed)',
                    }}
                >
                    <div className="flex items-center space-x-1 sm:space-x-2 relative z-10">
                        {downloadProgress > 0 && downloadProgress < 100 ? (
                            <>
                                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>{downloadProgress}%</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="hidden sm:inline">Download</span>
                                <span className="sm:hidden">DL</span>
                            </>
                        )}
                    </div>
                </button>

                <a
                    href="/repos"
                    className="group relative px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl font-medium text-white transition-all duration-300 hover:scale-105 overflow-hidden text-sm"
                    style={{
                        background: 'linear-gradient(45deg, #475569, #334155)',
                    }}
                >
                    <div className="flex items-center space-x-1 sm:space-x-2 relative z-10">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Back</span>
                    </div>
                </a>
            </div>
        </div>
    </div>
);

export default DocumentationHeader;