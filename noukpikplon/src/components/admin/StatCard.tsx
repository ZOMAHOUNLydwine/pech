import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: string;
    trend?: string;
    trendUp?: boolean;
    icon: LucideIcon;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, trend, trendUp, icon: Icon, color }) => {
    // Color mapping
    const colorClasses: Record<string, string> = {
        purple: 'bg-purple-100/50 text-purple-600',
        blue: 'bg-blue-100/50 text-blue-600',
        emerald: 'bg-emerald-100/50 text-emerald-600',
        amber: 'bg-amber-100/50 text-amber-600',
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color] || colorClasses.blue}`}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {trend}
                    </span>
                )}
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">{label}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
            </div>
        </div>
    );
};

export default StatCard;
