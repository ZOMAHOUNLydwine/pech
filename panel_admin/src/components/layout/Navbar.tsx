import { Bell, Search, User, ShieldCheck } from 'lucide-react';

interface NavbarProps {
    title: string;
}

export default function Navbar({ title }: NavbarProps) {
    return (
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-earth-100 px-4 py-5 shadow-psy/2">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center space-x-4">
                    <div className="lg:hidden w-10 h-10 bg-psy-emerald rounded-xl flex items-center justify-center text-white shadow-psy">
                        <ShieldCheck size={20} />
                    </div>
                    <h1 className="text-2xl font-black text-earth-900 hidden md:block capitalize tracking-tighter">{title}</h1>
                </div>

                {/* Action Center */}
                <div className="flex items-center space-x-2 md:space-x-4">
                    {/* Search Bar */}
                    <div className="hidden sm:flex items-center relative group">
                        <Search className="absolute left-4 w-4 h-4 text-earth-400 group-focus-within:text-psy-emerald transition-colors" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="bg-earth-50 border border-earth-100 rounded-2xl pl-12 pr-4 py-3 text-sm w-48 lg:w-80 focus:ring-4 focus:ring-psy-emerald/10 focus:bg-white focus:border-psy-emerald/30 transition-all outline-none text-earth-900 font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                        />
                    </div>

                    <button className="p-3 text-earth-500 hover:bg-earth-50 rounded-2xl relative transition-all group">
                        <Bell className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                        <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-psy-sos rounded-full border-2 border-white"></span>
                    </button>

                    <div className="h-10 w-px bg-earth-100 mx-2 hidden sm:block"></div>

                    <button className="flex items-center space-x-3 p-1.5 hover:bg-earth-50 rounded-2xl transition-all">
                        <div className="w-10 h-10 bg-psy-gold rounded-xl flex items-center justify-center text-white font-bold overflow-hidden shadow-psy">
                            <User className="w-6 h-6" />
                        </div>
                        <div className="hidden lg:block text-left">
                            <p className="text-xs font-black text-earth-900 leading-none uppercase">ADMIN USER</p>
                            <p className="text-[10px] font-bold text-earth-400 mt-1 uppercase tracking-widest">Super Admin</p>
                        </div>
                    </button>
                </div>
            </div>
        </header>
    );
}
