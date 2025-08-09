"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FiLogOut, FiStar, FiGithub, FiZap, FiMoreHorizontal } from "react-icons/fi"

interface UserData {
    avatar_url: string
    name: string | null
    login: string
    public_repos: number
}

interface UserProfileBarProps {
    userData: UserData | null
    credits: number
    onLogout: () => void
    isSubscribedLifeTime: boolean
}

const UserProfileBar = ({ userData, credits, onLogout, isSubscribedLifeTime }: UserProfileBarProps) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const handleProfileClick = () => {
        setIsDropdownOpen(!isDropdownOpen)
    }

    const handleLogout = () => {
        setIsDropdownOpen(false)
        onLogout()
    }

    return (
        <motion.div
            className="w-full mb-4 md:mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            {/* Responsive Navigation Bar */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-4 shadow-lg">
                <div className="flex items-center justify-between">
                    {/* Left Section - User Info */}
                    <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-1 min-w-0">
                        {userData ? (
                            <>
                                {/* Avatar with subtle glow */}
                                <div className="relative flex-shrink-0">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-lg md:rounded-xl blur-sm opacity-60" />
                                    <img
                                        src={userData.avatar_url || "/placeholder.svg"}
                                        alt="User Avatar"
                                        className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl border border-white/20 shadow-md object-cover"
                                    />
                                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 md:w-3 md:h-3 bg-emerald-400 border-2 border-slate-900 rounded-full" />
                                </div>

                                {/* User Details - Responsive Text */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-white font-medium text-xs sm:text-sm leading-tight truncate">
                                        {userData.name || userData.login}
                                    </h3>
                                    <div className="flex items-center space-x-1 sm:space-x-2 text-xs text-slate-400 mt-0.5">
                                        <FiGithub className="w-3 h-3 flex-shrink-0" />
                                        <span className="truncate">@{userData.login}</span>
                                        <span className="w-1 h-1 bg-slate-500 rounded-full hidden sm:block" />
                                        <span className="hidden sm:inline whitespace-nowrap">{userData.public_repos} repos</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-1">
                                <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-slate-700/50 animate-pulse flex-shrink-0" />
                                <div className="space-y-1.5 flex-1 min-w-0">
                                    <div className="h-3 sm:h-4 bg-slate-700/50 rounded w-24 sm:w-32 animate-pulse" />
                                    <div className="h-2.5 sm:h-3 bg-slate-700/50 rounded w-16 sm:w-24 animate-pulse" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Section - Status & Actions */}
                    <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3 flex-shrink-0">
                        {/* Status Badge - Responsive */}
                        <AnimatePresence mode="wait">
                            {isSubscribedLifeTime ? (
                                <motion.div
                                    className="flex items-center space-x-1 sm:space-x-1.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/30 rounded-full px-2 sm:px-3 py-1 sm:py-1.5"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    key="lifetime"
                                >
                                    <FiStar className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-400 flex-shrink-0" />
                                    <span className="text-xs font-medium text-amber-300 hidden sm:inline">Lifetime</span>
                                    <span className="text-xs font-medium text-amber-300 sm:hidden">LT</span>
                                </motion.div>
                            ) : credits > 0 ? (
                                <motion.div
                                    className="flex items-center space-x-1 sm:space-x-1.5 bg-blue-500/20 border border-blue-400/30 rounded-full px-2 sm:px-3 py-1 sm:py-1.5"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    key="credits"
                                >
                                    <FiZap className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-blue-400 flex-shrink-0" />
                                    <span className="text-xs font-medium text-blue-300">{credits}</span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    className="flex items-center space-x-1 sm:space-x-1.5 bg-slate-500/20 border border-slate-400/30 rounded-full px-2 sm:px-3 py-1 sm:py-1.5"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    key="no-credits"
                                >
                                    <FiZap className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-slate-400 flex-shrink-0" />
                                    <span className="text-xs font-medium text-slate-400">0</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Upgrade Button - Responsive */}
                        {!isSubscribedLifeTime && (
                            <motion.button
                                onClick={() => (window.location.href = "/payment")}
                                className="flex items-center space-x-1 sm:space-x-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white rounded-full px-2.5 sm:px-4 py-1 sm:py-1.5 text-xs font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <FiStar className="w-3 sm:w-3.5 h-3 sm:h-3.5 flex-shrink-0" />
                                <span className="hidden sm:inline">{credits > 0 ? "Upgrade" : "Get Started"}</span>
                                <span className="sm:hidden">+</span>
                            </motion.button>
                        )}

                        {/* Profile Menu */}
                        {userData && (
                            <div className="relative" ref={dropdownRef}>
                                <motion.button
                                    onClick={handleProfileClick}
                                    className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all duration-200"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FiMoreHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300" />
                                </motion.button>

                                {/* Responsive Dropdown Menu */}
                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                            transition={{ duration: 0.15, ease: "easeOut" }}
                                            className="absolute right-0 mt-2 w-56 sm:w-64 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                                        >
                                            {/* User Info Header */}
                                            <div className="p-3 sm:p-4 border-b border-white/10">
                                                <div className="flex items-center space-x-3">
                                                    <img
                                                        src={userData.avatar_url || "/placeholder.svg"}
                                                        alt={userData.name || userData.login}
                                                        className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg object-cover border border-white/20 flex-shrink-0"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-white truncate">{userData.name || userData.login}</p>
                                                        <p className="text-xs text-slate-400 truncate">@{userData.login}</p>
                                                        <div className="mt-2 flex items-center space-x-2">
                                                            {isSubscribedLifeTime ? (
                                                                <div className="flex items-center space-x-1 text-xs text-amber-400">
                                                                    <FiStar className="w-3 h-3" />
                                                                    <span>Lifetime Access</span>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center space-x-1 text-xs text-blue-400">
                                                                    <FiZap className="w-3 h-3" />
                                                                    <span>{credits} credits</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="p-2">
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors duration-150"
                                                >
                                                    <FiLogOut className="w-4 h-4" />
                                                    <span>Sign Out</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile-only repo count */}
                {userData && (
                    <div className="mt-2 sm:hidden">
                        <div className="flex items-center space-x-1 text-xs text-slate-400">
                            <span>{userData.public_repos} repositories</span>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

export default UserProfileBar