import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
    label: string;
    value: string;
    trend: string;
    isPositive: boolean;
    icon: LucideIcon;
    color: string;
}

export default function StatsCard({ label, value, trend, isPositive, icon: Icon, color }: StatsCardProps) {
    return (
        <div className="bg-white p-6 rounded-3xl border border-earth-100 shadow-card hover:shadow-lg transition-all hover:scale-[1.02] group">
            <div className="flex items-start justify-between">
                <div className={cn("p-4 rounded-2xl text-white shadow-card", color)}>
                    <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </div>
                <div className={cn(
                    "flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold",
                    isPositive ? "bg-benin-green/10 text-benin-green" : "bg-benin-red/10 text-benin-red"
                )}>
                    <span>{trend}</span>
                    {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                </div>
            </div>

            <div className="mt-4">
                <p className="text-sm font-semibold text-earth-500 uppercase tracking-wider">{label}</p>
                <h3 className="text-3xl font-bold text-earth-900 mt-1 tracking-tight">{value}</h3>
            </div>
        </div>
    );
}
