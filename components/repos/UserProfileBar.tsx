import { motion } from 'framer-motion';
import { FiCreditCard } from 'react-icons/fi';
import { Repository } from '@/types/repo';

interface UserProfileBarProps {
    userData: Repository | null;
    credits: number;
    onLogout: () => void;
}

const UserProfileBar = ({ userData, credits, onLogout }: UserProfileBarProps) => (
    <div className="flex justify-between items-center mb-8 bg-slate-800/30 backdrop-blur-lg p-4 rounded-xl border border-slate-700/50 shadow-xl">
        {userData && (
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
            >
                <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r rounded-full blur-md opacity-30 animate-pulse"></div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <img
                            src={userData.avatar_url}
                            alt="User Avatar"
                            className="w-12 h-12 rounded-full border-2 border-slate-800/50 shadow-lg"
                        />
                    </motion.div>
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full flex items-center">
                        <FiCreditCard className="mr-1" />
                        {credits} credits
                    </span>
                </div>
                <div>
                    <h1 className="text-lg font-bold text-white bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                        {userData.name || userData.login}
                    </h1>
                    <div className="flex items-center gap-2">
                        <span className="text-slate-300 text-xs">@{userData.login}</span>
                        <span className="text-xs px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full">
                            {userData.public_repos} repos
                        </span>
                    </div>
                </div>
            </motion.div>
        )}

        <div className="flex items-center gap-4">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLogout}
                className="group flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-white transition-all duration-300 overflow-hidden text-sm bg-gradient-to-r from-rose-600/90 to-rose-700 hover:from-rose-500 hover:to-rose-600 shadow-lg shadow-rose-500/20"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
            </motion.button>
        </div>
    </div>
);

export default UserProfileBar;