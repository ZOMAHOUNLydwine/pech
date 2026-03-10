import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './layout/Sidebar';
import Navbar from './layout/Navbar';
import MobileBottomNav from './layout/MobileBottomNav';

const AdminLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    // Map path to title
    const getTitle = (path: string) => {
        if (path === '/admin') return 'Dashboard';
        if (path.includes('/admin/content')) return 'Gestion du contenu';
        if (path.includes('/admin/levels')) return 'Gestion des Niveaux';
        if (path.includes('/admin/users')) return 'Utilisateurs';
        if (path.includes('/admin/stats')) return 'Statistiques';
        if (path.includes('/admin/messages')) return 'Messages';
        if (path.includes('/admin/settings')) return 'Paramètres';
        return 'Administration';
    };

    return (
        <div className="min-h-screen bg-earth-50 font-sans">
            <Sidebar
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                activeSection={location.pathname}
            />

            <div className="lg:ml-72 flex flex-col min-h-screen pb-20 lg:pb-0">
                <Navbar title={getTitle(location.pathname)} />

                <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
                    <Outlet />
                </main>
            </div>

            <MobileBottomNav />
        </div>
    );
};

export default AdminLayout;
