import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const data = [
    { name: 'Lun', users: 400, revenue: 2400 },
    { name: 'Mar', users: 300, revenue: 1398 },
    { name: 'Mer', users: 200, revenue: 9800 },
    { name: 'Jeu', users: 278, revenue: 3908 },
    { name: 'Ven', users: 189, revenue: 4800 },
    { name: 'Sam', users: 239, revenue: 3800 },
    { name: 'Dim', users: 349, revenue: 4300 },
];

export default function StatsChart() {
    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-[400px]">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Analyse de Performance</h2>
                    <p className="text-sm text-slate-500 mt-1">Évolution des utilisateurs et revenus hebdomadaires</p>
                </div>
                <select className="bg-slate-50 border-none rounded-xl px-3 py-2 text-sm font-bold text-slate-600 outline-none cursor-pointer hover:bg-slate-100 transition-colors">
                    <option>7 derniers jours</option>
                    <option>30 derniers jours</option>
                </select>
            </div>

            <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#008751" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#008751" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '16px',
                                border: 'none',
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="users"
                            stroke="#008751"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorUsers)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
