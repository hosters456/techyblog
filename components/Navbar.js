'use client';

import Link from 'next/link';
import { Terminal } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-md dark:border-gray-800">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <Terminal className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
                        TechyBlog<span className="text-blue-600">.</span>
                    </span>
                </Link>

                <div className="flex items-center space-x-4">
                    <Link
                        href="/"
                        className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        Home
                    </Link>
                    <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2" />
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    );
}
