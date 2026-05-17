"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAuth, useLogout } from "@/features/auth/hooks";
import { LogOut, Sparkles, User, Settings, ChevronDown, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const { mutate: logout, isPending: loggingOut } = useLogout();
  const { data, isLoading } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center h-12">
            {/* Logo Section */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow duration-300">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-zinc-300 transition-colors duration-300">
                Humanely
              </h1>
            </motion.div>

            {/* User Section & Dropdown */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 relative"
              ref={dropdownRef}
            >
              {!isLoading && data?.user && (
                <div 
                  className="group flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-zinc-900/50 transition-colors cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 flex items-center justify-center text-zinc-300 font-medium shadow-sm group-hover:border-zinc-600 transition-colors">
                    {data.user.name?.[0]?.toUpperCase() || data.user.username?.[0]?.toUpperCase() || "?"}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                </div>
              )}
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden z-50"
                  >
                    <div className="p-2 space-y-1">
                      <div className="px-3 py-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Account
                      </div>
                      <button 
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setIsProfileOpen(true);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </button>
                      <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors">
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                      
                      <div className="h-px bg-zinc-800 my-2" />
                      
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          logout();
                        }}
                        disabled={loggingOut}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <LogOut className="w-4 h-4" />
                        {loggingOut ? "Logging out..." : "Logout"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Profile Dialog Modal */}
      <AnimatePresence>
        {isProfileOpen && data?.user && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsProfileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">Profile Details</h2>
                  <button 
                    onClick={() => setIsProfileOpen(false)}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-2 border-indigo-500/30 flex items-center justify-center text-4xl font-bold text-indigo-300 shadow-xl shadow-indigo-500/10">
                    {data.user.name?.[0]?.toUpperCase() || data.user.username?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white">{data.user.name || data.user.username}</h3>
                    <p className="text-zinc-400 mt-1">{data.user.email}</p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-zinc-800/50">
                  <div className="bg-zinc-900/50 rounded-xl p-4">
                    <div className="text-sm text-zinc-500 mb-1">Username</div>
                    <div className="text-zinc-200 font-medium">{data.user.username}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
