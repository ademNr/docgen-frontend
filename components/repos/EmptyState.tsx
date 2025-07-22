import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';

interface EmptyStateProps {
    searchTerm: string;
    selectedLanguage: string;
}

const EmptyState = ({ searchTerm, selectedLanguage }: EmptyStateProps) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16"
    >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 mb-6">
            <FiSearch className="w-8 h-8 text-indigo-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No repositories found</h3>
        <p className="text-slate-400 max-w-md mx-auto">
            {searchTerm || selectedLanguage !== 'all'
                ? "Try adjusting your search or filter criteria"
                : "You don't have any repositories that match the current filters"}
        </p>
    </motion.div>
);

export default EmptyState;