import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Award, BookOpen, BarChart2, User, Crown, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useApp();

    const navItems = [
        { icon: Home, label: 'Accueil', path: '/dashboard' },
        { icon: BookOpen, label: 'Leçons', path: '/lessons' },
        { icon: BarChart2, label: 'Progrès', path: '/progress' },
        { icon: Award, label: 'Classement', path: '/leaderboard' },
        { icon: User, label: 'Profil', path: '/profile' },
    ];

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-earth-200 hidden md:flex flex-col z-50">
            <div className="p-6">
                <div className="flex items-center space-x-2 mb-8">
                    <div className="w-10 h-10 bg-benin-green rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-benin-green/20">
                        N
                    </div>
                    <span className="text-xl font-bold text-earth-900 tracking-tight">Noukpikplon</span>
                </div>

                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={cn(
                                    "w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-benin-green/10 text-benin-green"
                                        : "text-earth-500 hover:bg-earth-50 hover:text-earth-700"
                                )}
                            >
                                <item.icon className={cn("h-5 w-5", isActive && "fill-current")} />
                                <span>{item.label}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-benin-green" />
                                )}
                            </button>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto p-6 space-y-4">
                {!user.isPremium && (
                    <button
                        onClick={() => navigate('/subscription')}
                        className="w-full bg-gradient-to-r from-benin-yellow to-orange-400 text-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all group overflow-hidden relative"
                    >
                        <div className="relative z-10 flex flex-col items-start text-left">
                            <div className="flex items-center mb-1">
                                <Crown className="h-4 w-4 mr-2" />
                                <span className="font-bold text-sm">Passer au Premium</span>
                            </div>
                            <span className="text-[10px] opacity-90">Débloquez tout le contenu</span>
                        </div>
                        <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
                    </button>
                )}

                <div className="pt-4 border-t border-earth-100">
                    <div className="flex items-center space-x-3 mb-4 px-2">
                        <div className="w-10 h-10 rounded-full bg-earth-200 flex items-center justify-center text-earth-600 font-bold border-2 border-white shadow-sm overflow-hidden">
                            {user.avatar ? <img src={user.avatar} alt={user.name} /> : user.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-earth-900 truncate">{user.name}</p>
                            <p className="text-xs text-earth-500 truncate">{user.xp} XP</p>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors font-medium text-sm"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
