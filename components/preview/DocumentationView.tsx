import React, { memo } from 'react';
import { Documentation } from '@/types/documentation';
import ReadmePreview from './ReadmePreview';
import BestPracticesView from './BestPractices';
import DocNavigation from './DocNavigation';

interface DocumentationViewProps {
    documentation: Documentation;
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const DocumentationView: React.FC<DocumentationViewProps> = memo(({
    documentation,
    activeTab,
    setActiveTab
}) => (
    <div className="bg-slate-800/30 backdrop-blur-lg border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-700/50">
            <div className="flex flex-col gap-3 sm:gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
                        {documentation.title || "Project Documentation"}
                    </h1>
                    <p className="text-sm sm:text-base text-slate-300">
                        {documentation.tagline || "AI-generated documentation"}
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {documentation.badges.slice(0, 3).map((badge, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 text-xs font-medium rounded-md bg-slate-700/50"
                        >
                            {badge.label}
                        </span>
                    ))}
                    {documentation.badges.length > 3 && (
                        <span className="px-2 py-1 text-xs font-medium rounded-md bg-slate-700/50">
                            +{documentation.badges.length - 3}
                        </span>
                    )}
                </div>
            </div>
        </div>

        <div className="flex flex-col md:flex-row min-h-[calc(100vh-200px)]">
            <div className="md:hidden p-3 border-b border-slate-700/50">
                <select
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg p-2 text-white"
                >
                    <option value="readme">README</option>
                    <option value="bestPractices">Best Practices</option>
                </select>
            </div>

            <div className="hidden md:block">
                <DocNavigation
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    bestPractices={documentation.bestPractices}
                />
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {activeTab === 'readme' ? (
                    <ReadmePreview documentation={documentation} />
                ) : (
                    documentation.bestPractices ? (
                        <BestPracticesView data={documentation.bestPractices} />
                    ) : (
                        <div className="flex justify-center items-center h-full">
                            <p className="text-slate-400">No best practices analysis available</p>
                        </div>
                    )
                )}
            </div>
        </div>
    </div>
));
DocumentationView.displayName = 'DocumentationView';
export default DocumentationView;