import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Award, BookOpen, BarChart2, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: 'Accueil', path: '/dashboard' },
    { icon: Award, label: 'Classement', path: '/leaderboard' },
    { icon: BookOpen, label: 'Leçons', path: '/lessons' },
    { icon: BarChart2, label: 'Progrès', path: '/progress' },
    { icon: User, label: 'Profil', path: '/profile' },
  ];

  return (
    <div className="min-h-screen bg-earth-50">
      <Sidebar />

      <main className="md:pl-64 min-h-screen">
        <div className="pb-20 md:pb-0">
          <Outlet />
        </div>
      </main>

      {/* Bottom Nav - Mobile Only */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-earth-200 py-2 px-4 z-50 md:hidden">
        <div className="flex justify-between items-center max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center p-2 transition-all duration-300",
                  isActive ? "text-benin-green -translate-y-1" : "text-earth-400 hover:text-earth-600"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-xl transition-all",
                  isActive ? "bg-benin-green/10" : "bg-transparent"
                )}>
                  <item.icon className={cn("h-6 w-6", isActive && "fill-current")} />
                </div>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
