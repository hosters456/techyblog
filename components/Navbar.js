'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import SearchBar from './SearchBar';
import { Menu, X, Code2, User as UserIcon, LogOut, ChevronDown, UserCircle2 } from 'lucide-react';
import { useAuth } from './AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user, logout } = useAuth();

    return (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="p-1.5 bg-blue-600 rounded-lg group-hover:rotate-12 transition-transform">
                            <Code2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">
                            TechyBlog<span className="text-blue-600">.</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        <div className="flex items-center space-x-6">
                            <Link href="/" className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>

                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center space-x-2 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors bg-gray-50 dark:bg-gray-900/50 p-1 rounded-2xl border border-gray-100 dark:border-gray-800"
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white font-black overflow-hidden shadow-sm">
                                        {user ? user.name.charAt(0).toUpperCase() : <UserCircle2 className="w-5 h-5" />}
                                    </div>
                                    {user && <span className="mr-1">{user.name.split(' ')[0]}</span>}
                                    <ChevronDown className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2">
                                        {user ? (
                                            <>
                                                <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-800 mb-1 bg-gray-50/50 dark:bg-gray-800/30">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Signed in as</p>
                                                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{user.email}</p>
                                                </div>
                                                {user.role === 'admin' && (
                                                    <Link
                                                        href="/admin"
                                                        onClick={() => setShowUserMenu(false)}
                                                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-blue-600 transition-colors font-bold"
                                                    >
                                                        <UserIcon className="w-4 h-4" />
                                                        <span>Admin Dashboard</span>
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        logout();
                                                        setShowUserMenu(false);
                                                    }}
                                                    className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors w-full text-left font-bold"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    <span>Sign Out</span>
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-800 mb-1 bg-gray-50/50 dark:bg-gray-800/30">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Account</p>
                                                    <p className="text-xs font-bold text-gray-900 dark:text-white">Welcome, Guest!</p>
                                                </div>
                                                <Link
                                                    href="/login"
                                                    onClick={() => setShowUserMenu(false)}
                                                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-blue-600 transition-colors font-bold"
                                                >
                                                    <LogOut className="w-4 h-4 rotate-180" />
                                                    <span>Sign In</span>
                                                </Link>
                                                <Link
                                                    href="/signup"
                                                    onClick={() => setShowUserMenu(false)}
                                                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-blue-600 transition-colors font-bold"
                                                >
                                                    <UserIcon className="w-4 h-4" />
                                                    <span>Create Account</span>
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="h-6 w-px bg-gray-100 dark:bg-gray-800" />
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
