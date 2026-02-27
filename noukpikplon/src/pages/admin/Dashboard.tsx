import React from 'react';
import StatCard from '@/components/admin/StatCard';
import { Users, BookOpen, Trophy, TrendingUp, Clock, CheckCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Vue d'ensemble</h1>
                    <p className="text-slate-500 mt-1">Gérez et suivez les activités de Noukpikplon.</p>
                </div>
                <div className="flex space-x-3">
                    <button className="px-4 py-2 bg-white text-slate-700 font-medium rounded-lg border border-slate-200 hover:bg-slate-50 text-sm transition-colors">
                        Exporter les données
                    </button>
                    <button className="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 text-sm shadow-lg shadow-purple-200 transition-all">
                        Configurer l'application
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Utilisateurs"
                    value="2,845"
                    trend="+18%"
                    trendUp={true}
                    icon={Users}
                    color="purple"
                />
                <StatCard
                    label="Quêtes complétées"
                    value="15,203"
                    trend="+12%"
                    trendUp={true}
                    icon={CheckCircle}
                    color="emerald"
                />
                <StatCard
                    label="XP Total octroyé"
                    value="854k"
                    trend="+5%"
                    trendUp={true}
                    icon={Trophy}
                    color="amber"
                />
                <StatCard
                    label="Temps moyen / jour"
                    value="12m 45s"
                    trend="-2%"
                    trendUp={false}
                    icon={Clock}
                    color="blue"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activities */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                        <h3 className="font-bold text-lg text-slate-800">Activités Récentes</h3>
                        <button className="text-purple-600 text-sm font-bold hover:underline">Voir tout</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                                <tr>
                                    <th className="px-6 py-4">Apprenant</th>
                                    <th className="px-6 py-4">Action</th>
                                    <th className="px-6 py-4">Score</th>
                                    <th className="px-6 py-4">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs">
                                                    U{i}
                                                </div>
                                                <span className="font-medium text-slate-900">Utilisateur {i}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">Quête "Saluer un aîné"</td>
                                        <td className="px-6 py-4">
                                            <span className="text-emerald-600 font-bold">+150 XP</span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400">Il y a {i * 12} min</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions / Categories usage */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="font-bold text-lg text-slate-800 mb-6">Popularité des catégories</h3>
                    <div className="space-y-6">
                        {[
                            { name: 'Bases & Salutations', value: 85, color: 'bg-purple-500' },
                            { name: 'Vie Quotidienne', value: 62, color: 'bg-blue-500' },
                            { name: 'Culture & Tradition', value: 45, color: 'bg-amber-500' },
                            { name: 'Affaires', value: 12, color: 'bg-slate-400' },
                        ].map((cat, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium text-slate-600">{cat.name}</span>
                                    <span className="font-bold text-slate-900">{cat.value}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${cat.color} rounded-full transition-all duration-1000`}
                                        style={{ width: `${cat.value}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 p-4 bg-purple-50 rounded-xl border border-purple-100">
                        <h4 className="text-purple-900 font-bold text-sm mb-1">Astuce d'admin</h4>
                        <p className="text-purple-700 text-xs leading-relaxed">
                            Les quêtes avec du contenu audio ont un taux de complétion 40% plus élevé. Pensez à ajouter des fichiers audio à vos nouvelles quêtes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
