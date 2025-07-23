// components/BestPractices.tsx
import { BestPractices } from "../../types/bestPractices";

export default function BestPracticesView({ data }: { data: BestPractices }) {
    return (
        <div className="p-6">
            <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4">Best Practices Analysis</h2>

                <div className="bg-slate-800/50 rounded-xl p-5 mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-white">Overall Score</h3>
                        <span className="text-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-indigo-500 px-3 py-1 rounded-full">
                            {data.score}/100
                        </span>
                    </div>
                    <p className="text-slate-300">{data.summary}</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-5">
                    <h3 className="font-bold text-white mb-3">Improvement Areas</h3>
                    <div className="space-y-4">
                        {data.improvements.map((area, i) => (
                            <div key={i}>
                                <h4 className="font-bold text-cyan-400 mb-1">{area.category}</h4>
                                <ul className="space-y-1">
                                    {area.suggestions.map((suggestion, j) => (
                                        <li key={j} className="flex items-start">
                                            <svg className="w-4 h-4 text-yellow-400 mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-slate-300">{suggestion}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
              
            </div>

            <div className="bg-slate-800/50 rounded-xl p-5">
                <h3 className="font-bold text-white mb-3">Key Recommendations</h3>
                <ol className="space-y-3">
                    {data.improvements.flatMap(area =>
                        area.suggestions.map((suggestion, j) => (
                            <li key={`${area.category}-${j}`} className="flex">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center mr-3">
                                    {j + 1}
                                </span>
                                <span className="text-slate-300">
                                    <span className="font-bold text-cyan-300">[{area.category}]</span> {suggestion}
                                </span>
                            </li>
                        ))
                    )}
                </ol>
            </div>
        </div>
    );
}