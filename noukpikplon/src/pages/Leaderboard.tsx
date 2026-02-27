import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function Leaderboard() {
  const { user } = useApp();

  const mockLeaderboard = [
    { id: 1, name: "Koffi A.", xp: 2450, avatar: "👨🏿" },
    { id: 2, name: "Sarah M.", xp: 2100, avatar: "👩🏼" },
    { id: 3, name: "You (Guest)", xp: user.xp, avatar: "👤", isUser: true },
    { id: 4, name: "David L.", xp: 1800, avatar: "👨🏻" },
    { id: 5, name: "Aminata D.", xp: 1650, avatar: "👩🏿" },
  ];

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <div className="text-center space-y-2 mb-6">
        <h1 className="text-2xl font-bold text-earth-900">Classement</h1>
        <p className="text-earth-600">Top apprenants cette semaine</p>
      </div>

      <div className="space-y-3">
        {mockLeaderboard.map((entry, index) => (
          <div 
            key={entry.id}
            className={cn(
              "flex items-center p-4 rounded-2xl transition-all",
              entry.isUser 
                ? "bg-benin-green text-white shadow-lg scale-105 border-2 border-white" 
                : "bg-white border border-earth-200"
            )}
          >
            <div className={cn(
              "w-8 font-bold text-lg",
              index < 3 ? "text-benin-yellow" : "text-earth-400",
              entry.isUser && "text-white"
            )}>
              #{index + 1}
            </div>
            
            <div className="w-10 h-10 rounded-full bg-earth-100 flex items-center justify-center text-xl mr-4 border-2 border-white/20">
              {entry.avatar}
            </div>
            
            <div className="flex-1 font-bold">
              {entry.name}
            </div>
            
            <div className="font-mono font-bold opacity-90">
              {entry.xp} XP
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
