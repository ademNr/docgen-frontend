"use client"

import { CodeBracketIcon } from "@heroicons/react/24/outline"
import type { Documentation } from "../../types/documentation"

export default function ReadmePreview({ documentation }: { documentation: Documentation }) {
    return (
        <div className="max-w-5xl mx-auto  dark:border-slate-800 ">
            {/* GitHub-style header with enhanced dark mode */}
            <div className="  dark:bg-slate-900 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <CodeBracketIcon className="h-5 w-5 text-gray-600 dark:text-slate-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-slate-300">username</span>
                            <span className="text-gray-400 dark:text-slate-500">/</span>
                            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                {documentation.title.toLowerCase().replace(/\s+/g, "-")}
                            </span>
                        </div>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-slate-700/50 text-gray-800 dark:text-slate-200">
                            Public
                        </span>
                    </div>
                </div>
            </div>

            {/* File navigation bar with enhanced dark mode */}
            <div className="border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 px-6 py-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm">
                        <span className="text-gray-600 dark:text-slate-400">📁 files</span>
                        <span className="text-gray-400 dark:text-slate-500">•</span>
                        <span className="text-gray-600 dark:text-slate-400">README.md</span>
                    </div>
                </div>
            </div>

            {/* README content with enhanced dark styling */}
            <div
                className="px-8 py-6  dark:bg-slate-900"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif' }}
            >
                {/* Title */}
                <h1 className="text-3xl font-bold  dark:text-slate-100 mb-4  pb-2">
                    {documentation.title}
                </h1>

                {/* Tagline */}
                <blockquote className="border-l-4 border-gray-300 dark:border-slate-600 pl-4 mb-6  dark:text-slate-400 italic text-lg">
                    {documentation.tagline}
                </blockquote>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {documentation.badges.map((badge, index) => (
                        <img
                            key={index}
                            src={`https://img.shields.io/badge/${encodeURIComponent(badge.label)}-${encodeURIComponent(badge.status)}-${badge.color}`}
                            alt={`${badge.label}: ${badge.status}`}
                            className="h-5"
                        />
                    ))}
                </div>

                {/* Description */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4  dark:text-slate-100 border-b border-gray-200 dark:border-slate-800 pb-2">
                        📝 Description
                    </h2>
                    <p className="text-gray-700 dark:text-slate-300 leading-relaxed text-base">{documentation.description}</p>
                </div>

                {/* Features */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4  dark:text-slate-100 border-b border-gray-200 dark:border-slate-800 pb-2">
                        ✨ Features
                    </h2>
                    <ul className="list-disc pl-6 space-y-2">
                        {documentation.features.map((feature, index) => (
                            <li key={index} className="text-gray-700 dark:text-slate-300 leading-relaxed">
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Tech Stack */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4  dark:text-slate-100 border-b border-gray-200 dark:border-slate-800 pb-2">
                        🛠️ Tech Stack
                    </h2>
                    <ul className="list-disc pl-6 space-y-2">
                        {documentation.techStack.map((tech, index) => (
                            <li key={index} className="text-gray-700 dark:text-slate-300 leading-relaxed">
                                {tech.name}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Installation */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4  dark:text-slate-100 border-b border-gray-200 dark:border-slate-800 pb-2">
                        ⚙️ Installation
                    </h2>
                    <h3 className="text-lg font-medium mb-3  dark:text-slate-200">Requirements</h3>
                    <ul className="list-disc pl-6 space-y-1 mb-6">
                        {documentation.installation.requirements.map((req, i) => (
                            <li key={i} className="text-gray-700 dark:text-slate-300">
                                {req}
                            </li>
                        ))}
                    </ul>
                    <h3 className="text-lg font-medium mb-3  dark:text-slate-200">Steps</h3>
                    <ol className="space-y-4">
                        {documentation.installation.steps.map((step, i) => (
                            <li key={i} className="text-gray-700 dark:text-slate-300">
                                <div className="flex">
                                    <span className="font-semibold mr-2  dark:text-slate-100">{i + 1}.</span>
                                    <div className="flex-1">
                                        {step.includes(":") ? (
                                            <>
                                                <span>{step.split(":")[0]}:</span>
                                                <div className="mt-2  dark:bg-slate-800/80 border border-gray-300 dark:border-slate-700 rounded-md p-3">
                                                    <code className="text-sm  dark:text-slate-200 font-mono">
                                                        {step.split(":").slice(1).join(":").trim()}
                                                    </code>
                                                </div>
                                            </>
                                        ) : (
                                            <div className=" dark:bg-slate-800/80 border border-gray-300 dark:border-slate-700 rounded-md p-3">
                                                <code className="text-sm  dark:text-slate-200 font-mono">{step}</code>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>

                {/* Usage */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-slate-100 border-b border-gray-200 dark:border-slate-800 pb-2">
                        🚀 Usage
                    </h2>
                    <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-slate-200">Basic</h3>
                    <div className="bg-gray-100 dark:bg-slate-800/80 border border-gray-300 dark:border-slate-700 rounded-md p-4 mb-6">
                        <pre className="text-sm text-gray-900 dark:text-slate-200 font-mono overflow-x-auto">
                            <code>{documentation.usage.basic}</code>
                        </pre>
                    </div>
                    <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-slate-200">Advanced</h3>
                    <div className="space-y-4">
                        {documentation.usage.advanced.split("\n\n").map((block, i) => (
                            <div key={i}>
                                {block.includes(":") ? (
                                    <>
                                        <p className="text-gray-700 dark:text-slate-300 mb-2">{block.split(":")[0]}:</p>
                                        <div className="bg-gray-100 dark:bg-slate-800/80 border border-gray-300 dark:border-slate-700 rounded-md p-4">
                                            <pre className="text-sm text-gray-900 dark:text-slate-200 font-mono overflow-x-auto">
                                                <code>{block.split(":").slice(1).join(":").trim()}</code>
                                            </pre>
                                        </div>
                                    </>
                                ) : (
                                    <div className="bg-gray-100 dark:bg-slate-800/80 border border-gray-300 dark:border-slate-700 rounded-md p-4">
                                        <pre className="text-sm text-gray-900 dark:text-slate-200 font-mono overflow-x-auto">
                                            <code>{block}</code>
                                        </pre>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* API Reference */}
                {documentation.api && documentation.api.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-slate-100 border-b border-gray-200 dark:border-slate-800 pb-2">
                            🌐 API Reference
                        </h2>
                        <div className="space-y-8">
                            {documentation.api.map((endpoint, index) => (
                                <div key={index} className="border-l-4 border-blue-500 dark:border-blue-400 pl-4">
                                    <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-slate-100">
                                        <code className="bg-gray-100 dark:bg-slate-800/80 px-2 py-1 rounded text-sm">
                                            {endpoint.method} {endpoint.endpoint}
                                        </code>
                                    </h3>
                                    <p className="text-gray-700 dark:text-slate-300 mb-4 leading-relaxed">{endpoint.description}</p>
                                    {endpoint.parameters && endpoint.parameters.length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="font-medium mb-2 text-gray-900 dark:text-slate-100">Parameters:</h4>
                                            <ul className="list-disc pl-6 space-y-1">
                                                {endpoint.parameters.map((param, i) => (
                                                    <li key={i} className="text-gray-700 dark:text-slate-300">
                                                        <code className="bg-gray-100 dark:bg-slate-800/80 px-1.5 py-0.5 rounded text-sm">
                                                            {param.name}
                                                        </code>
                                                        <span className="text-gray-500 dark:text-slate-400 text-sm ml-1">({param.type})</span>
                                                        {param.required && (
                                                            <span className="text-red-600 dark:text-red-400 ml-1 text-sm font-medium">
                                                                [required]
                                                            </span>
                                                        )}
                                                        {param.description && <span className="ml-1">: {param.description}</span>}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {endpoint.example && (
                                        <div>
                                            <h4 className="font-medium mb-2 text-gray-900 dark:text-slate-100">Example:</h4>
                                            <div className="bg-gray-100 dark:bg-slate-800/80 border border-gray-300 dark:border-slate-700 rounded-md p-4">
                                                <pre className="text-sm text-gray-900 dark:text-slate-200 font-mono overflow-x-auto">
                                                    <code>{endpoint.example}</code>
                                                </pre>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* File Structure */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-slate-100 border-b border-gray-200 dark:border-slate-800 pb-2">
                        📂 File Structure
                    </h2>
                    <div className="space-y-3">
                        {documentation.fileStructure.map((file, index) => (
                            <div key={index} className="flex items-start text-blue-800 dark:text-blue-400">
                                <span className="text-gray-400 dark:text-slate-500 mr-3 mt-1">•</span>
                                <div>
                                    <code className="bg-gray-100 dark:bg-slate-800/80 px-2 py-1 rounded text-sm font-mono">
                                        {file.path}
                                    </code>
                                    <span className="text-gray-600 dark:text-slate-400 ml-2">: {file.description}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contributing */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-slate-100 border-b border-gray-200 dark:border-slate-800 pb-2">
                        🤝 Contributing
                    </h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-slate-200">Setup</h3>
                            <p className="text-gray-700 dark:text-slate-300 leading-relaxed">{documentation.contributing.setup}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-slate-200">Guidelines</h3>
                            <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                                {documentation.contributing.guidelines}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-slate-200">Process</h3>
                            <p className="text-gray-700 dark:text-slate-300 leading-relaxed">{documentation.contributing.process}</p>
                        </div>
                    </div>
                </div>

                {/* License & Author */}
                <div className="pt-6 border-t border-gray-200 dark:border-slate-800">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mr-4">📜 License</h2>
                                <span className="text-gray-700 dark:text-slate-300">
                                    This project is licensed under the {documentation.license} License.
                                </span>
                            </div>
                            <div className="flex items-center">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mr-4">👤 Author</h2>
                                <span className="text-gray-700 dark:text-slate-300">{documentation.author}</span>
                            </div>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <p className="text-xs text-gray-500 dark:text-slate-500">Generated with ❤️ by Gitforje</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
