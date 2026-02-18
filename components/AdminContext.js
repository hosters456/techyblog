'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAdmin = () => {
            const adminSecret = localStorage.getItem('admin_secret');
            if (adminSecret) {
                setIsAdmin(true);
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
