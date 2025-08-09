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
            className="w-full mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            {/* Modern Clean Navigation Bar */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center justify-between">
                    {/* Left Section - User Info */}
                    <div className="flex items-center space-x-4">
                        {userData ? (
                            <>
                                {/* Avatar with subtle glow */}
                                <div className="relative">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-xl blur-sm opacity-60" />
                                    <img
                                        src={userData.avatar_url || "/placeholder.svg"}
                                        alt="User Avatar"
                                        className="relative w-10 h-10 rounded-xl border border-white/20 shadow-md object-cover"
                                    />
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full" />
                                </div>

                                {/* User Details */}
                                <div>
                                    <h3 className="text-white font-medium text-sm leading-tight">{userData.name || userData.login}</h3>
                                    <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                                        <FiGithub className="w-3 h-3" />
                                        <span>@{userData.login}</span>
                                        <span className="w-1 h-1 bg-slate-500 rounded-full" />
                                        <span>{userData.public_repos} repos</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-700/50 animate-pulse" />
                                <div className="space-y-1.5">
                                    <div className="h-4 bg-slate-700/50 rounded w-32 animate-pulse" />
                                    <div className="h-3 bg-slate-700/50 rounded w-24 animate-pulse" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Section - Status & Actions */}
                    <div className="flex items-center space-x-3">
                        {/* Status Badge */}
                        <AnimatePresence mode="wait">
                            {isSubscribedLifeTime ? (
                                <motion.div
                                    className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/30 rounded-full px-3 py-1.5"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    key="lifetime"
                                >
                                    <FiStar className="w-3.5 h-3.5 text-amber-400" />
                                    <span className="text-xs font-medium text-amber-300">Lifetime</span>
                                </motion.div>
                            ) : credits > 0 ? (
                                <motion.div
                                    className="flex items-center space-x-1.5 bg-blue-500/20 border border-blue-400/30 rounded-full px-3 py-1.5"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    key="credits"
                                >
                                    <FiZap className="w-3.5 h-3.5 text-blue-400" />
                                    <span className="text-xs font-medium text-blue-300">{credits} credits</span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    className="flex items-center space-x-1.5 bg-slate-500/20 border border-slate-400/30 rounded-full px-3 py-1.5"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    key="no-credits"
                                >
                                    <FiZap className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-xs font-medium text-slate-400">0 credits</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Upgrade Button */}
                        {!isSubscribedLifeTime && (
                            <motion.button
                                onClick={() => (window.location.href = "/payment")}
                                className="flex items-center space-x-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <FiStar className="w-3.5 h-3.5" />
                                <span>{credits > 0 ? "Upgrade" : "Get Started"}</span>
                            </motion.button>
                        )}

                        {/* Profile Menu */}
                        {userData && (
                            <div className="relative" ref={dropdownRef}>
                                <motion.button
                                    onClick={handleProfileClick}
                                    className="flex items-center justify-center w-8 h-8 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all duration-200"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FiMoreHorizontal className="w-4 h-4 text-slate-300" />
                                </motion.button>

                                {/* Dropdown Menu */}
                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                            transition={{ duration: 0.15, ease: "easeOut" }}
                                            className="absolute right-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                                        >
                                            {/* User Info Header */}
                                            <div className="p-4 border-b border-white/10">
                                                <div className="flex items-center space-x-3">
                                                    <img
                                                        src={userData.avatar_url || "/placeholder.svg"}
                                                        alt={userData.name || userData.login}
                                                        className="w-12 h-12 rounded-lg object-cover border border-white/20"
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
            </div>
        </motion.div>
    )
}

export default UserProfileBar
