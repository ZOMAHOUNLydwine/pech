import React, { useState, useEffect } from 'react';
import { Users, Eye, TrendingUp, CreditCard, Loader2 } from 'lucide-react';
import StatsCard from '@/components/admin/dashboard/StatsCard';
import UserTable from '@/components/admin/dashboard/UserTable';
import StatsChart from '@/components/admin/dashboard/StatsChart';
import { useApp } from '@/context/AppContext';
import { getDashboardStats, AdminStatsResponse } from '@/lib/api/admin';

export default function AdminDashboard() {
    const { user } = useApp();
    const [stats, setStats] = useState<AdminStatsResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await getDashboardStats();
                setStats(data);
            } catch (err) {
                console.error("Failed to load dashboard stats", err);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-extrabold text-earth-900 tracking-tight">Bonjour, {user?.name || 'Admin'} 👋</h2>
                    <p className="text-earth-500 mt-1 text-lg">Voici ce qui se passe sur votre plateforme aujourd'hui.</p>
                </div>
                <button className="inline-flex items-center justify-center px-6 py-3 bg-benin-green text-white font-bold rounded-2xl shadow-brand hover:scale-[1.02] active:scale-95 transition-all">
                    Télécharger le rapport
                </button>
            </div>

            {/* Stats Grid */}
            {loading ? (
                <div className="h-40 flex items-center justify-center bg-white rounded-3xl border border-earth-100 shadow-card">
                    <Loader2 className="w-10 h-10 text-benin-green animate-spin" />
                </div>
            ) : stats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        label="Total Utilisateurs"
                        value={stats.total_users.toString()}
                        trend={`+${stats.new_users_30d} (30j)`}
                        isPositive={true}
                        icon={Users}
                        color="bg-blue-500"
                    />
                    <StatsCard
                        label="Visites (Est.)"
                        value={stats.total_visits.toString()}
                        trend="+5.4%"
                        isPositive={true}
                        icon={Eye}
                        color="bg-purple-500"
                    />
                    <StatsCard
                        label="Revenus Mensuels"
                        value={`${stats.monthly_revenue}€`}
                        trend="+18.2%"
                        isPositive={true}
                        icon={CreditCard}
                        color="bg-emerald-500"
                    />
                    <StatsCard
                        label="Taux de Rétention"
                        value={`${stats.retention_rate}%`}
                        trend="-2.1%"
                        isPositive={false}
                        icon={TrendingUp}
                        color="bg-amber-500"
                    />
                </div>
            ) : null}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <div className="lg:col-span-2">
                    {/* We pass the data down to the chart component if requested, but for now we leave it as is or pass generic props if supported */}
                    <StatsChart />
                </div>

                {/* Quick Actions / Goal card */}
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
                        <button className="w-full py-4 bg-benin-green text-white font-bold rounded-2xl hover:bg-green-600 transition-colors">
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

