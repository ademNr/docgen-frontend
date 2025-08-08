"use client"

import { FiSearch, FiX } from 'react-icons/fi'
import { motion } from 'framer-motion'

interface SearchFilterProps {
    searchTerm: string
    setSearchTerm: (term: string) => void
    selectedLanguage: string
    setSelectedLanguage: (lang: string) => void
    uniqueLanguages: string[]
}

const SearchFilter = ({
    searchTerm,
    setSearchTerm,
    selectedLanguage,
    setSelectedLanguage,
    uniqueLanguages
}: SearchFilterProps) => (
    <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="relative flex-1 max-w-xl">
            <input
                type="text"
                placeholder="Search repositories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 pl-11 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <FiSearch className="w-4 h-4 text-slate-500" />
            </div>
            {searchTerm && (
                <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-slate-700/50"
                >
                    <FiX className="w-4 h-4 text-slate-500" />
                </button>
            )}
        </div>
        <motion.div whileHover={{ scale: 1.02 }}>
            <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full md:w-auto px-4 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 text-sm"
            >
                {uniqueLanguages.map(lang => (
                    <option key={lang} value={lang} className="bg-slate-800 text-white">
                        {lang === 'all' ? 'All Languages' : lang}
                    </option>
                ))}
            </select>
        </motion.div>
    </div>
)

export default SearchFilter
