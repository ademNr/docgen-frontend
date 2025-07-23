// components/DocNavigation.tsx
import { BestPractices } from '@/types/bestPractices';


export default function DocNavigation({
    activeTab,
    setActiveTab,
    bestPractices
}: {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    bestPractices: BestPractices;
}) {
    return (
        <div className="w-64 flex-shrink-0 bg-slate-800/50 backdrop-blur-md border-r border-slate-700/50 h-full overflow-y-auto">
            <div className="p-4 border-b border-slate-700/50">
                <h2 className="text-lg font-bold text-white mb-2">Documentation</h2>
                <nav className="space-y-1">
                    <button
                        onClick={() => setActiveTab('readme')}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${activeTab === 'readme'
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-300 hover:bg-slate-700/50'
                            }`}
                    >
                        README Preview
                    </button>

                    <button
                        onClick={() => setActiveTab('best-practices')}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${activeTab === 'best-practices'
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-300 hover:bg-slate-700/50'
                            }`}
                    >
                        Best Practices
                    </button>
                </nav>
            </div>

            {activeTab === 'best-practices' && (
                <div className="p-4">
                    <div className="mb-6">
                        <h3 className="font-bold text-white mb-2">Overall Score</h3>
                        <div className="relative">
                            <div
                                className="h-3 bg-slate-700 rounded-full overflow-hidden"
                                style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2)' }}
                            >
                                <div
                                    className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"
                                    style={{ width: `${bestPractices.score}%` }}
                                />
                            </div>
                            <div className="absolute top-0 right-0 text-xs font-bold text-white bg-indigo-600 px-2 py-0.5 rounded-full">
                                {bestPractices.score}/100
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                        <div className="bg-slate-800/50 rounded-xl p-8 min-h-[300px]"> {/* Increased padding and min-height */}
                            <h3 className="font-bold text-white text-xl mb-5">Strengths</h3> {/* Larger text */}
                            <ul className="space-y-3"> {/* Increased spacing between items */}
                                {bestPractices.strengths.map((strength, i) => (
                                    <li key={i} className="flex items-start">
                                        <svg className="w-6 h-6 text-green-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-slate-300 text-lg">{strength}</span> {/* Larger text */}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>


                </div>
            )}
        </div>
    );
}