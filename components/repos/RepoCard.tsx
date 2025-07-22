import { motion } from 'framer-motion';
import { FiStar, FiGitBranch, FiClock } from 'react-icons/fi';
import { Repository } from '@/types/repo';

interface RepoCardProps {
    repo: Repository;
    onGenerate: (repoFullName: string) => void;
    hoveredRepo: number | null;
    setHoveredRepo: (id: number | null) => void;
    mousePos: { x: number; y: number };
}

const RepoCard = ({
    repo,
    onGenerate,
    hoveredRepo,
    setHoveredRepo,
    mousePos
}: RepoCardProps) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getLanguageColor = (language: string) => {
        const colors: { [key: string]: string } = {
            'TypeScript': '#3178c6',
            'JavaScript': '#f1e05a',
            'Python': '#3572a5',
            'Java': '#b07219',
            'C++': '#f34b7d',
            'Go': '#00add8',
            'Rust': '#dea584',
            'Dart': '#00b4ab',
            'Ruby': '#701516',
            'PHP': '#4f5d95',
        };
        return colors[language] || '#6b7280';
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="group relative"
            onMouseEnter={() => setHoveredRepo(repo.id)}
            onMouseLeave={() => setHoveredRepo(null)}
            style={{
                transform: hoveredRepo === repo.id
                    ? `translateY(-6px) rotateX(${mousePos.y * 1}deg) rotateY(${mousePos.x * 1}deg)`
                    : 'translateY(0)',
                transition: 'all 0.3s ease',
            }}
        >
            <div className="relative h-full p-6 bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden transition-all duration-300 group-hover:bg-slate-800/60 group-hover:border-purple-500/40 group-hover:shadow-xl group-hover:shadow-purple-500/10">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h2 className="text-lg font-bold text-white mb-1 group-hover:text-purple-300 transition-colors duration-300 truncate">
                                {repo.name}
                            </h2>
                            <p className="text-slate-400 text-xs truncate">@{repo.owner}</p>
                        </div>

                        {repo.language && (
                            <div className="flex items-center space-x-1.5 bg-slate-700/50 px-2 py-1 rounded-full">
                                <div
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: getLanguageColor(repo.language) }}
                                />
                                <span className="text-xs font-medium text-slate-300">
                                    {repo.language}
                                </span>
                            </div>
                        )}
                    </div>

                    {repo.description && (
                        <p className="text-slate-300 mb-5 text-sm leading-relaxed line-clamp-3">
                            {repo.description}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-3 mb-5 text-xs text-slate-400">
                        <div className="flex items-center space-x-1.5 bg-slate-700/30 px-2.5 py-1 rounded-full">
                            <FiStar className="w-3.5 h-3.5" />
                            <span>{repo.stars.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 bg-slate-700/30 px-2.5 py-1 rounded-full">
                            <FiGitBranch className="w-3.5 h-3.5" />
                            <span>{repo.forks.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 bg-slate-700/30 px-2.5 py-1 rounded-full">
                            <FiClock className="w-3.5 h-3.5" />
                            <span>{formatDate(repo.updated_at)}</span>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onGenerate(repo.full_name)}
                        className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white transition-all duration-300 relative overflow-hidden group"
                    >
                        <span className="relative z-10">Generate Documentation</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl z-0"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default RepoCard;