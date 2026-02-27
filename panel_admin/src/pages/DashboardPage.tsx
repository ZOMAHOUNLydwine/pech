import { Users, Eye, TrendingUp, CreditCard } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import UserTable from '../components/dashboard/UserTable';
import StatsChart from '../components/dashboard/StatsChart';

export default function DashboardPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-extrabold text-earth-900 tracking-tight">Bonjour, Admin 👋</h2>
                    <p className="text-earth-500 mt-1 text-lg">Voici ce qui se passe sur votre plateforme aujourd'hui.</p>
                </div>
                <button className="inline-flex items-center justify-center px-6 py-3 bg-benin-green text-white font-bold rounded-2xl shadow-brand hover:scale-[1.02] active:scale-95 transition-all">
                    Télécharger le rapport
                </button>
            </div>

            {/* Hero CTA inspired by psy */}
            <div className="bg-gradient-to-br from-benin-green to-benin-green/80 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-brand group cursor-pointer transition-transform hover:scale-[1.01]">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="max-w-xl">
                        <h2 className="text-3xl font-bold mb-3">Nouvelle mise à jour disponible !</h2>
                        <p className="text-white/80 text-lg leading-relaxed">
                            Le système de répétition espacée (SRS) a été amélioré. Consultez les nouveaux algorithmes de suivi des utilisateurs.
                        </p>
                        <button className="mt-6 bg-white/20 backdrop-blur-md px-6 py-2 rounded-full font-bold border border-white/20 hover:bg-white/30 transition-colors">
                            En savoir plus
                        </button>
                    </div>
                    <div className="text-7xl opacity-20 filter grayscale group-hover:grayscale-0 transition-all duration-500 scale-125 md:scale-150">
                        ⚡
                    </div>
                </div>
                {/* Decorative blob */}
                <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-benin-yellow/20 rounded-full blur-3xl" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    label="Total Utilisateurs"
                    value="2,450"
                    trend="+12%"
                    isPositive={true}
                    icon={Users}
                    color="bg-blue-500"
                />
                <StatsCard
                    label="Visites Totales"
                    value="45.2K"
                    trend="+5.4%"
                    isPositive={true}
                    icon={Eye}
                    color="bg-purple-500"
                />
                <StatsCard
                    label="Revenus"
                    value="12,840€"
                    trend="+18.2%"
                    isPositive={true}
                    icon={CreditCard}
                    color="bg-emerald-500"
                />
                <StatsCard
                    label="Taux de Rétention"
                    value="78%"
                    trend="-2.1%"
                    isPositive={false}
                    icon={TrendingUp}
                    color="bg-amber-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <div className="lg:col-span-2">
                    <StatsChart />
                </div>

                {/* Quick Actions / Goal card inspired by psy subscription card */}
                <div className="bg-white p-8 rounded-[2rem] border border-earth-100 shadow-card flex flex-col justify-between space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="w-16 h-16 bg-benin-yellow/10 rounded-3xl flex items-center justify-center text-3xl shadow-card">
                            🏆
                        </div>
                        <span className="bg-benin-yellow/10 text-amber-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Priorité</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-earth-900 uppercase">Objectif du mois</h3>
                        <p className="text-earth-500 mt-2">Vous avez atteint 85% de votre objectif de croissance.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-full bg-earth-50 h-4 rounded-full overflow-hidden border border-earth-100">
                            <div className="bg-gradient-to-r from-benin-green to-benin-yellow h-full w-[85%] rounded-full shadow-inner relative overflow-hidden">
                                <div className="absolute inset-0 bg-white/20 animate-pulse" />
                            </div>
                        </div>
                        <button className="w-full py-4 bg-benin-green text-white font-bold rounded-2xl hover:bg-primary-dark transition-colors">
                            Voir les détails
                        </button>
                    </div>
                </div>
            </div>

            {/* User Management Table */}
            <UserTable />
        </div>
    );
}
