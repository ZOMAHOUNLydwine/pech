import React from 'react';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

export default function Leaderboard() {
  const { isAuthenticated } = useApp();
  const [entries, setEntries] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get('/leaderboard');
        setEntries(response.data);
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) fetchLeaderboard();
    else setLoading(false);
  }, [isAuthenticated]);

  if (loading) return <div className="p-8 text-center text-earth-500 font-bold">Chargement du classement...</div>;

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <div className="text-center space-y-2 mb-6">
        <h1 className="text-2xl font-bold text-earth-900">Classement</h1>
        <p className="text-earth-600">Top apprenants cette semaine</p>
      </div>

      <div className="space-y-3">
        {entries.length > 0 ? (
          entries.map((entry, index) => (
            <div
              key={entry.id}
              className={cn(
                "flex items-center p-4 rounded-2xl transition-all",
                entry.is_user
                  ? "bg-benin-green text-white shadow-lg scale-105 border-2 border-white"
                  : "bg-white border border-earth-200"
              )}
            >
              <div className={cn(
                "w-8 font-bold text-lg",
                index < 3 ? (entry.is_user ? "text-white" : "text-benin-yellow") : (entry.is_user ? "text-white" : "text-earth-400")
              )}>
                #{index + 1}
              </div>

              <div className="w-10 h-10 rounded-full bg-earth-100 flex items-center justify-center text-xl mr-4 border-2 border-white/20">
                {entry.avatar || "👤"}
              </div>

              <div className="flex-1 font-bold">
                {entry.name}
              </div>

              <div className="font-mono font-bold opacity-90">
                {entry.xp} XP
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-earth-400">
            Connectez-vous pour voir le classement.
          </div>
        )}
      </div>
    </div>
  );
}
