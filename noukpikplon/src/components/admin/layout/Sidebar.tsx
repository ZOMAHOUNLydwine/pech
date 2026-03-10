import React from 'react';
import {
    LayoutDashboard,
    Users,
    BarChart3,
    Settings,
    MessageSquare,
    LogOut,
    X,
    ShieldCheck,
    BookOpen,
    Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    activeSection: string;
}

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { id: 'courses', label: 'Cours', icon: BookOpen, path: '/admin/content' },
    { id: 'levels', label: 'Niveaux', icon: Layers, path: '/admin/levels' },
    { id: 'users', label: 'Utilisateurs', icon: Users, path: '/admin/users' },
    { id: 'stats', label: 'Statistiques', icon: BarChart3, path: '/admin/stats' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/admin/messages' },
    { id: 'settings', label: 'Paramètres', icon: Settings, path: '/admin/settings' },
];

export default function Sidebar({ isOpen, setIsOpen, activeSection }: SidebarProps) {
    const { logout } = useApp();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-earth-900/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed top-0 left-0 bottom-0 w-72 bg-white/80 backdrop-blur-xl border-r border-earth-100 z-50 transition-transform duration-300 lg:translate-x-0 shadow-brand",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full">
                    {/* Logo Section */}
                    <div className="p-8 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-benin-green rounded-2xl flex items-center justify-center text-white shadow-brand">
                                <ShieldCheck className="w-7 h-7" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-earth-900 tracking-tighter leading-none">ADMIN</h1>
                                <p className="text-[10px] font-bold text-benin-green uppercase tracking-widest bg-benin-green/10 px-2 py-0.5 rounded-full inline-block mt-1">SÉCURISÉ</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="lg:hidden p-2 text-earth-500 hover:bg-earth-100 rounded-lg"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path || (item.path === '/admin' && location.pathname === '/admin');
                            // In case of nested routes under /admin/ we might need smarter logic if we had /admin/content/:id
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        navigate(item.path);
                                        if (window.innerWidth < 1024) setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full flex items-center space-x-3 px-4 py-4 rounded-2xl transition-all duration-300 group text-left",
                                        isActive
                                            ? "bg-benin-green text-white shadow-brand"
                                            : "text-earth-500 hover:bg-earth-50 hover:text-earth-900"
                                    )}
                                >
                                    <item.icon className={cn(
                                        "w-5 h-5 transition-transform group-hover:scale-110",
                                        isActive ? "text-white" : "text-earth-400 group-hover:text-benin-green"
                                    )} />
                                    <span className="font-semibold text-sm">{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Bottom Actions */}
                    <div className="p-4 border-t border-earth-100 space-y-2">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-earth-500 hover:bg-earth-50 transition-colors group"
                        >
                            <ShieldCheck className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-semibold text-sm">Quitter Admin</span>
                        </button>
                        <button
                            onClick={logout}
                            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors group"
                        >
                            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-semibold text-sm">Déconnexion</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
