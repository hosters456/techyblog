'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/components/AdminContext';
import { Lock, ShieldAlert } from 'lucide-react';

export default function AdminLoginPage() {
    const [secret, setSecret] = useState('');
    const [error, setError] = useState('');
    const { login } = useAdmin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!secret) {
            setError('Please enter the admin secret.');
            return;
        }

        try {
            const res = await fetch('/api/admin/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ secret }),
            });

            if (res.ok) {
                login(secret);
            } else {
                setError('Incorrect Admin Secret. Please try again.');
                localStorage.removeItem('admin_secret');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[70vh] px-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                        <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Login</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Enter your secret key to access the dashboard.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="secret" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Admin Secret Key
                        </label>
                        <input
                            type="password"
                            id="secret"
                            value={secret}
                            onChange={(e) => setSecret(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="••••••••••••"
                        />
                    </div>

                    {error && (
                        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/10 p-3 rounded-lg">
                            <ShieldAlert className="w-4 h-4" />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-blue-500/20"
                    >
                        Access Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
}
