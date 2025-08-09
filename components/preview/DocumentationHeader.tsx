"use client"

import type React from "react"
import { FileText, Copy, Download, ArrowLeft, Check } from "lucide-react"

interface DocumentationHeaderProps {
    repoFullName: string | null
    copySuccess: boolean
    downloadProgress: number
    onCopy: () => void
    onDownload: () => void
}

const DocumentationHeader: React.FC<DocumentationHeaderProps> = ({
    repoFullName,
    copySuccess,
    downloadProgress,
    onCopy,
    onDownload,
}) => (
    <header className=" top-0 left-0 right-0 z-30 dark:bg-gray-900 backdrop-blur-xl   ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                {/* Modern logo section */}
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900"></div>
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-slate-100 tracking-tight">Documentation Preview</h1>
                        <p className="text-sm text-slate-400 truncate max-w-[200px] sm:max-w-md font-medium">
                            {repoFullName || "Loading repository..."}
                        </p>
                    </div>
                </div>

                {/* Enhanced action buttons */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <button
                        onClick={onCopy}
                        className={`inline-flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 ${copySuccess
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10"
                            : "bg-slate-800/80 text-slate-300 border border-slate-700/50 hover:bg-slate-700/80 hover:text-slate-200 hover:border-slate-600/50"
                            }`}
                    >
                        {copySuccess ? (
                            <>
                                <Check className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Copied!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Copy README</span>
                                <span className="sm:hidden">Copy</span>
                            </>
                        )}
                    </button>

                    <button
                        onClick={onDownload}
                        disabled={downloadProgress > 0 && downloadProgress < 100}
                        className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl relative overflow-hidden"
                    >
                        {downloadProgress > 0 && downloadProgress < 100 ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                <span className="hidden sm:inline">{downloadProgress}%</span>
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Download</span>
                                <span className="sm:hidden">DL</span>
                            </>
                        )}
                        {downloadProgress > 0 && downloadProgress < 100 && (
                            <div
                                className="absolute bottom-0 left-0 h-0.5 bg-white/40 transition-all duration-300"
                                style={{ width: `${downloadProgress}%` }}
                            />
                        )}
                    </button>

                    <a
                        href="/repos"
                        className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-800/80 border border-slate-700/50 rounded-xl hover:bg-slate-700/80 hover:text-slate-200 hover:border-slate-600/50 transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        <span>Back</span>
                    </a>
                </div>
            </div>
        </div>
    </header>
)

export default DocumentationHeader
