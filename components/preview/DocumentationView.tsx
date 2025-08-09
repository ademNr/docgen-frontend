"use client"

import type React from "react"
import { memo } from "react"
import type { Documentation } from "@/types/documentation"
import ReadmePreview from "./ReadmePreview"
import BestPracticesView from "./BestPractices"
import DocNavigation from "./DocNavigation"

interface DocumentationViewProps {
    documentation: Documentation
    activeTab: string
    setActiveTab: (tab: string) => void
}

const DocumentationView: React.FC<DocumentationViewProps> = memo(({ documentation, activeTab, setActiveTab }) => (
    <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800/50 overflow-hidden">
        {/* Enhanced header with darker colors */}
        <div className="p-6 border-b border-slate-800/50 bg-slate-900/80">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100 mb-2">{documentation.title || "Project Documentation"}</h1>
                    <p className="text-slate-400">{documentation.tagline || "AI-generated documentation"}</p>
                </div>

                {/* Enhanced badges with darker theme */}
                <div className="flex flex-wrap gap-2">
                    {documentation.badges.slice(0, 3).map((badge, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        >
                            {badge.label}
                        </span>
                    ))}
                    {documentation.badges.length > 3 && (
                        <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full bg-slate-700/50 text-slate-300 border border-slate-600/50">
                            +{documentation.badges.length - 3}
                        </span>
                    )}
                </div>
            </div>
        </div>

        {/* Content area with darker theme */}
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-200px)]">
            {/* Mobile tab selector */}
            <div className="lg:hidden p-4 border-b border-slate-800/50 bg-slate-900/30">
                <select
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700/50 rounded-xl p-3 text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                    <option value="readme">README Preview</option>
                    <option value="bestPractices">Best Practices</option>
                </select>
            </div>

            {/* Desktop navigation */}
            <div className="hidden lg:block">
                <DocNavigation activeTab={activeTab} setActiveTab={setActiveTab} bestPractices={documentation.bestPractices} />
            </div>

            {/* Main content */}
            <div className="flex-1 overflow-y-auto">
                {activeTab === "readme" ? (
                    <ReadmePreview documentation={documentation} />
                ) : documentation.bestPractices ? (
                    <BestPracticesView data={documentation.bestPractices} />
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4 p-8">
                        <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center">
                            <span className="text-2xl">📊</span>
                        </div>
                        <p className="text-slate-300 text-lg font-medium">No best practices analysis available</p>
                        <p className="text-slate-500 text-sm text-center max-w-md">
                            Best practices analysis will be available once the documentation is fully processed.
                        </p>
                    </div>
                )}
            </div>
        </div>
    </div>
))

DocumentationView.displayName = "DocumentationView"

export default DocumentationView
