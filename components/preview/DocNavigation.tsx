"use client"

import type { BestPractices } from "@/types/bestPractices"
import { FileText, Award } from "lucide-react"

export default function DocNavigation({
    activeTab,
    setActiveTab,
    bestPractices,
}: {
    activeTab: string
    setActiveTab: (tab: string) => void
    bestPractices: BestPractices
}) {
    return (
        <div className="w-64 flex-shrink-0  bg-slate-900/80 border-r border-gray-200 dark:border-gray-700 h-full overflow-y-auto">
            {/* Clean navigation */}
            <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Navigation</h2>
                <nav className="space-y-1">
                    <button
                        onClick={() => setActiveTab("readme")}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${activeTab === "readme"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                    >
                        <FileText className="w-4 h-4" />
                        <span>README Preview</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("bestPractices")}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${activeTab === "bestPractices"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                    >
                        <Award className="w-4 h-4" />
                        <span>Best Practices</span>
                    </button>
                </nav>
            </div>

            {/* Best practices summary */}
            {activeTab === "bestPractices" && bestPractices && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-4  dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Overall Score</h3>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">{bestPractices.score}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">/100</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${bestPractices.score}%` }}
                            />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">{bestPractices.summary}</p>
                    </div>
                </div>
            )}
        </div>
    )
}
