import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Settings,
    LogOut,
    Bell,
    Search,
    ChevronLeft,
    ArrowLeft
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

const AdminLayout: React.FC = () => {
    const { logout, user } = useApp();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const AdminNavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
        <NavLink
            to={to}
            end={to === '/admin'}
            className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
            }
        >
            <Icon size={20} />
            <span className="font-medium text-sm">{label}</span>
        </NavLink>
    );

    return (
        <div className="flex h-screen bg-slate-900 text-slate-100 font-sans overflow-hidden">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-full z-20">
                <div className="p-6 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center font-bold text-white">
                        N
                    </div>
                    <span className="text-lg font-bold tracking-tight text-white">Noukpikplon <span className="text-purple-500 text-xs uppercase ml-1">Admin</span></span>
                </div>

                <div className="px-4 mb-6">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 pl-2">Menu Principal</div>
                    <nav className="space-y-1">
                        <AdminNavItem to="/admin" icon={LayoutDashboard} label="Tableau de bord" />
                        <AdminNavItem to="/admin/content" icon={BookOpen} label="Gestion du contenu" />
                        <AdminNavItem to="/admin/users" icon={Users} label="Utilisateurs" />
                        <AdminNavItem to="/admin/settings" icon={Settings} label="Paramètres" />
                    </nav>
                </div>

                <div className="mt-auto p-4 border-t border-slate-800">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center space-x-3 px-4 py-3 w-full text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors mb-2"
                    >
                        <ChevronLeft size={20} />
                        <span className="text-sm font-medium">Retour à l'app</span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 w-full text-slate-400 hover:text-red-400 hover:bg-red-900/10 rounded-xl transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="text-sm font-medium">Déconnexion</span>
                    </button>
                    <div className="mt-4 flex items-center px-4 py-3 bg-slate-900 rounded-xl border border-slate-800">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold ring-2 ring-slate-800">
                            {user?.name?.[0] || 'A'}
                        </div>
                        <div className="ml-3">
                            <p className="text-xs font-bold text-white truncate w-24">{user?.name || 'Admin'}</p>
                            <p className="text-[10px] text-slate-500">Administrateur</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
                {/* Admin Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex justify-between items-center px-8 z-10 sticky top-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 flex items-center justify-center"
                            title="Retour"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div className="flex items-center bg-slate-100 rounded-lg px-3 py-2 w-96 border border-slate-200 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all">
                            <Search size={18} className="text-slate-400 mr-2" />
                            <input
                                type="text"
                                placeholder="Rechercher une quête, un utilisateur..."
                                className="bg-transparent border-none outline-none text-sm text-slate-700 w-full placeholder:text-slate-400"
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors font-bold uppercase text-xs">
                            Version 1.0.0
                        </button>
                        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                    </div>
                </header>

                {/* Content Outlet */}
                <main className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
