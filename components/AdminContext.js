'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAdmin = async () => {
            const adminSecret = localStorage.getItem('admin_secret');
            if (adminSecret) {
                try {
                    const res = await fetch('/api/admin/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ secret: adminSecret }),
                    });
                    if (res.ok) {
                        setIsAdmin(true);
                    } else {
                        localStorage.removeItem('admin_secret');
                        setIsAdmin(false);
                    }
                } catch (err) {
                    setIsAdmin(false);
                }
            } else {
                setIsAdmin(false);
            }
            setIsLoading(false);
        };

        checkAdmin();
    }, []);

    const login = (secret) => {
        localStorage.setItem('admin_secret', secret);
        setIsAdmin(true);
        router.push('/admin');
    };

    const logout = () => {
        localStorage.removeItem('admin_secret');
        setIsAdmin(false);
        router.push('/admin/login');
    };

    return (
        <AdminContext.Provider value={{ isAdmin, isLoading, login, logout }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => useContext(AdminContext);
