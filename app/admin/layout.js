'use client';

import { AdminProvider } from '@/components/AdminContext';
import AdminLayout from '@/components/AdminLayout';

export default function RootAdminLayout({ children }) {
    return (
        <AdminProvider>
            <AdminLayout>
                {children}
            </AdminLayout>
        </AdminProvider>
    );
}
