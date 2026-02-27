import { LayoutDashboard, Users, BarChart3, Settings, MessageSquare } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MobileBottomNavProps {
    activeSection: string;
    setActiveSection: (section: string) => void;
}

const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'stats', label: 'Stats', icon: BarChart3 },
    { id: 'messages', label: 'Inbox', icon: MessageSquare },
    { id: 'settings', label: 'Profile', icon: Settings },
];

export default function MobileBottomNav({ activeSection, setActiveSection }: MobileBottomNavProps) {
    return (
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl border-t border-earth-100 flex items-center justify-around px-2 z-40 lg:hidden shadow-[0_-10px_25px_rgba(0,0,0,0.05)]">
            {navItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                        "flex flex-col items-center justify-center space-y-1 py-1 px-3 rounded-2xl transition-all relative overflow-hidden",
                        activeSection === item.id
                            ? "text-psy-emerald"
                            : "text-earth-400 hover:text-earth-600"
                    )}
                >
                    <item.icon className={cn("w-6 h-6 transition-transform", activeSection === item.id && "scale-110")} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                    {activeSection === item.id && (
                        <div className="absolute top-0 w-8 h-1 bg-psy-emerald rounded-full" />
                    )}
                </button>
            ))}
        </nav>
    );
}
