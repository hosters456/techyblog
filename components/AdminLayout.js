'use client';

import React, { useEffect } from 'react';
import { useAdmin } from './AdminContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, PlusCircle, LogOut, ChevronLeft, Loader2 } from 'lucide-react';

export default function AdminLayout({ children }) {
    const { isAdmin, isLoading, logout } = useAdmin();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && !isAdmin && pathname !== '/admin/login') {
            router.push('/admin/login');
        }
    }, [isAdmin, isLoading, pathname, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (!isAdmin && pathname !== '/admin/login') {
        return null;
    }

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center mb-8 space-x-2">
                    <div className="p-1.5 bg-blue-600 rounded-lg">
                        <LayoutDashboard className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg dark:text-white">Admin Panel</span>
                </div>

                <nav className="space-y-2 mb-12">
                    <Link
                        href="/admin"
                        className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${pathname === '/admin'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                    </Link>
                    <Link
                        href="/admin/new"
                        className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${pathname === '/admin/new'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        <PlusCircle className="w-4 h-4" />
                        <span>New Post</span>
                    </Link>
                    <Link
                        href="/"
                        className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span>View Site</span>
                    </Link>
                </nav>

                <button
                    onClick={logout}
                    className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors w-full text-left"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                </button>
            </aside>

            {/* Content Area */}
            <main className="flex-1 bg-white dark:bg-gray-950 p-6 md:p-10">
                <div className="max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
