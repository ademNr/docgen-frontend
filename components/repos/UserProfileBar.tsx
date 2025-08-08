import { motion, AnimatePresence } from 'framer-motion';
import { FiCreditCard, FiLogOut, FiStar, FiGithub, FiInfo, FiZap } from 'react-icons/fi';
interface UserData {
    avatar_url: string;
    name: string | null;
    login: string;
    public_repos: number;
}
interface UserProfileBarProps {
    userData: UserData | null;
    credits: number;
    onLogout: () => void;
    isSubscribedLifeTime: boolean;
}

const UserProfileBar = ({ userData, credits, onLogout, isSubscribedLifeTime }: UserProfileBarProps) => {
    return (
        <motion.div
            className="flex flex-col md:flex-row justify-between items-stretch gap-4 mb-8 bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-xl p-4 rounded-xl border border-slate-700/50 shadow-xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {userData ? (
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-1 flex-wrap items-center gap-4 min-w-0"
                >
                    {/* Avatar with enhanced glow */}
                    <div className="relative flex-shrink-0">
                        <motion.div
                            className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full blur opacity-20"
                            animate={{
                                opacity: [0.15, 0.25, 0.15],
                            }}
                            transition={{ repeat: Infinity, duration: 3 }}
                        />
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative"
                        >
                            <img
                                src={userData.avatar_url}
                                alt="User Avatar"
                                className="w-14 h-14 rounded-full border-2 border-slate-800/50 shadow-lg"
                            />
                            <div className="absolute -bottom-1 -right-1 bg-slate-800 rounded-full p-1 border border-slate-700">
                                <FiGithub className="text-emerald-400" size={12} />
                            </div>
                        </motion.div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-[160px]">
                        <div className="flex flex-wrap items-baseline gap-2 mb-1">
                            <motion.h1
                                className="text-lg md:text-xl font-bold text-white bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent truncate max-w-[180px] md:max-w-xs"
                                whileHover={{ scale: 1.01 }}
                            >
                                {userData.name || userData.login}
                            </motion.h1>
                            <span className="text-slate-300 text-sm flex items-center gap-1 bg-slate-800/50 px-2 py-0.5 rounded-full">
                                <span>@{userData.login}</span>
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {/* Subscription Status */}
                            <AnimatePresence mode="wait">
                                {isSubscribedLifeTime ? (
                                    <motion.div
                                        className="flex items-center gap-1 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 rounded-full px-3 py-1 text-xs border border-amber-500/30"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        whileHover={{ scale: 1.05 }}
                                        key="lifetime"
                                    >
                                        <FiStar className="text-amber-300" />
                                        <span className="font-medium">Lifetime Access</span>
                                    </motion.div>
                                ) : credits > 0 ? (
                                    <motion.div
                                        className="flex items-center gap-2"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        key="credits"
                                    >
                                        <motion.div
                                            className="flex items-center gap-1 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-300 rounded-full px-3 py-1 text-xs border border-blue-500/30"
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            <FiZap className="text-blue-300" />
                                            <span className="font-medium">
                                                {credits} {credits === 1 ? 'try' : ''}
                                            </span>
                                        </motion.div>
                                        <motion.button
                                            onClick={() => window.location.href = '/payment'}
                                            className="flex items-center gap-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-indigo-50 rounded-full px-3 py-1 text-xs border border-indigo-500/30 hover:shadow-indigo-500/10 hover:shadow transition-all group"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            title="Subscribe for unlimited access"
                                        >
                                            <FiStar className="transition-transform group-hover:rotate-12" size={12} />
                                            <span className="font-medium">Upgrade</span>
                                        </motion.button>
                                    </motion.div>
                                ) : (
                                    <motion.button
                                        onClick={() => window.location.href = '/payment'}
                                        className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-full px-3 py-1 text-xs border border-indigo-500/30 transition-all group"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        whileHover={{
                                            scale: 1.05,
                                            background: ["linear-gradient(to right, #7c3aed, #8b5cf6)", "linear-gradient(to right, #6366f1, #8b5cf6)", "linear-gradient(to right, #7c3aed, #8b5cf6)"]
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        key="subscribe"
                                    >
                                        <FiStar className="transition-transform group-hover:rotate-12" size={12} />
                                        <span>Subscribe to generate docs</span>
                                    </motion.button>
                                )}
                            </AnimatePresence>

                            {/* Repositories */}
                            <motion.div
                                className="flex items-center gap-1 bg-gradient-to-r from-slate-700/50 to-slate-800/50 text-slate-300 rounded-full px-3 py-1 text-xs border border-slate-700"
                                whileHover={{ scale: 1.03 }}
                            >
                                <FiGithub className="text-slate-400" size={12} />
                                <span>{userData.public_repos} public repos</span>
                            </motion.div>

                            {/* Credit info tooltip */}
                            <motion.div
                                className="relative group flex items-center"
                                whileHover={{ scale: 1.1 }}
                            >
                                <FiInfo className="text-slate-500 hover:text-slate-300 cursor-help" size={14} />
                                <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-slate-800/90 backdrop-blur-md text-slate-200 text-xs p-3 rounded-lg border border-slate-700 shadow-xl z-10">
                                    <div className="font-bold text-indigo-300 mb-1">Credits Information</div>
                                    <p>Each documentation generation uses 1 credit. Subscribe for unlimited access and additional features.</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <div className="flex-1 flex items-center gap-4">
                    <div className="relative">
                        <div className="w-14 h-14 rounded-full bg-slate-700/50 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-5 bg-slate-700/50 rounded-full w-40 animate-pulse" />
                        <div className="flex gap-2">
                            <div className="h-6 w-24 bg-slate-700/50 rounded-full animate-pulse" />
                            <div className="h-6 w-20 bg-slate-700/50 rounded-full animate-pulse" />
                        </div>
                    </div>
                </div>
            )}

            {/* Logout Button */}
            <motion.div
                className="flex items-center justify-end md:justify-center"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
            >
                <motion.button
                    whileHover={{
                        scale: 1.05,
                        background: "linear-gradient(to right, #e11d48, #be123c)",
                        boxShadow: "0 5px 15px -3px rgba(190, 18, 60, 0.2)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onLogout}
                    className="group flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium text-white transition-all duration-300 overflow-hidden text-sm bg-gradient-to-r from-rose-600/90 to-rose-700 shadow-md shadow-rose-500/10 w-full sm:w-auto"
                >
                    <FiLogOut className="w-4 h-4 flex-shrink-0 transition-transform group-hover:-translate-x-0.5" />
                    <span>Logout</span>
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default UserProfileBar;