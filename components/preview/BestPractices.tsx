import type { BestPractices } from "../../types/bestPractices"
import { TrendingUp, CheckCircle, AlertTriangle, Target } from "lucide-react";

export default function BestPracticesView({ data }: { data: BestPractices }) {


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                    {/* Strengths Card */}
                    <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
                            <h3 className="text-xl font-semibold text-white flex items-center space-x-3">
                                <CheckCircle className="w-6 h-6" />
                                <span>Strengths</span>
                            </h3>
                            <p className="text-green-100 mt-2 text-sm">
                                What you're doing well
                            </p>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {data.strengths.map((strength, i) => (
                                    <div key={i} className="flex items-start space-x-4 group">
                                        <div className="w-8 h-8 bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-900/50 transition-colors">
                                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                        </div>
                                        <p className="text-gray-300 leading-relaxed">{strength}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Improvements Card */}
                    <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6">
                            <h3 className="text-xl font-semibold text-white flex items-center space-x-3">
                                <AlertTriangle className="w-6 h-6" />
                                <span>Areas for Improvement</span>
                            </h3>
                            <p className="text-amber-100 mt-2 text-sm">
                                Opportunities to enhance your project
                            </p>
                        </div>
                        <div className="p-6">
                            <div className="space-y-6">
                                {data.improvements.map((area, i) => (
                                    <div key={i} className="space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-6 h-6 bg-amber-900/30 rounded-lg flex items-center justify-center">
                                                <span className="text-xs font-medium text-amber-300">
                                                    {i + 1}
                                                </span>
                                            </div>
                                            <h4 className="font-semibold text-amber-300">{area.category}</h4>
                                        </div>
                                        <div className="space-y-2 ml-8">
                                            {area.suggestions.map((suggestion, j) => (
                                                <div key={j} className="flex items-start space-x-3">
                                                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2.5 flex-shrink-0"></div>
                                                    <p className="text-gray-400 text-sm leading-relaxed">{suggestion}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Priority Recommendations */}
                <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                        <h3 className="text-xl font-semibold text-white flex items-center space-x-3">
                            <Target className="w-6 h-6" />
                            <span>Priority Recommendations</span>
                        </h3>
                        <p className="text-blue-100 mt-2 text-sm">
                            Actionable steps ranked by impact
                        </p>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data.improvements.flatMap((area, areaIndex) =>
                                area.suggestions.map((suggestion, suggestionIndex) => {
                                    const itemNumber = areaIndex * area.suggestions.length + suggestionIndex + 1;
                                    return (
                                        <div
                                            key={`${area.category}-${suggestionIndex}`}
                                            className="group p-4 bg-gray-700/50 rounded-xl border border-gray-600/30 hover:bg-blue-900/20 hover:border-blue-700 transition-all duration-200"
                                        >
                                            <div className="flex items-start space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-medium shadow-sm">
                                                    {itemNumber}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="inline-flex items-center px-2 py-1 bg-blue-900/30 rounded-md mb-2">
                                                        <span className="font-medium text-blue-300 text-xs">
                                                            {area.category}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-300 text-sm leading-relaxed">
                                                        {suggestion}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}