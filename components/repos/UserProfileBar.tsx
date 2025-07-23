import { motion } from 'framer-motion';
import { FiCreditCard, FiLogOut } from 'react-icons/fi';
import { Repository } from '@/types/repo';

interface UserProfileBarProps {
    userData: Repository | null;
    credits: number;
    onLogout: () => void;
}

const UserProfileBar = ({ userData, credits, onLogout }: UserProfileBarProps) => (
    <div className="flex flex-col md:flex-row justify-between items-stretch gap-4 mb-8 bg-slate-800/30 backdrop-blur-lg p-4 rounded-xl border border-slate-700/50 shadow-xl">
        {userData ? (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-1 flex-wrap items-center gap-4 min-w-0"
            >
                {/* Avatar with animated glow */}
                <div className="relative flex-shrink-0">
                    <motion.div
                        className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full blur opacity-30 animate-pulse"
                        animate={{
                            opacity: [0.2, 0.4, 0.2],
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
                    </motion.div>
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-[200px]">
                    <div className="flex flex-wrap items-baseline gap-2 mb-1">
                        <h1 className="text-lg md:text-xl font-bold text-white bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent truncate">
                            {userData.name || userData.login}
                        </h1>
                        <span className="text-slate-300 text-sm truncate">@{userData.login}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {/* Credits */}
                        <div className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 rounded-full px-3 py-1 text-xs">
                            <FiCreditCard className="flex-shrink-0" />
                            <span className="font-medium">{credits} credits</span>
                        </div>

                        {/* Repositories */}
                        <div className="bg-indigo-500/20 text-indigo-300 rounded-full px-3 py-1 text-xs">
                            {userData.public_repos} repositories
                        </div>
                    </div>
                </div>
            </motion.div>
        ) : (
            <div className="flex-1">
                <div className="h-5 bg-slate-700/50 rounded-full w-3/4 animate-pulse" />
                <div className="flex gap-2 mt-2">
                    <div className="h-6 w-20 bg-slate-700/50 rounded-full animate-pulse" />
                    <div className="h-6 w-24 bg-slate-700/50 rounded-full animate-pulse" />
                </div>
            </div>
        )}

        {/* Logout Button */}
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-end md:justify-center"
        >
            <motion.button
                whileHover={{
                    scale: 1.05,
                    background: "linear-gradient(to right, #e11d48, #be123c)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={onLogout}
                className="group flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-white transition-all duration-300 overflow-hidden text-sm bg-gradient-to-r from-rose-600/90 to-rose-700 shadow-lg shadow-rose-500/20 w-full md:w-auto"
            >
                <FiLogOut className="w-4 h-4 flex-shrink-0" />
                <span>Logout</span>
            </motion.button>
        </motion.div>
    </div>
);

export default UserProfileBar;