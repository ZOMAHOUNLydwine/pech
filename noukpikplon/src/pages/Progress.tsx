import React from 'react';
import { useApp, LANGUAGES } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { Trophy, BookOpen, Crown, Target, Lock, CheckCircle2, Circle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Progress() {
  const { user } = useApp();
  const targetLang = LANGUAGES.find(l => l.id === user.targetLanguage);

  // Dynamic Milestones based on real stats (XP)
  const milestones = [
    {
      id: 'badge_initie',
      title: 'Badge "Initié"',
      icon: Trophy,
      color: 'bg-benin-yellow',
      textColor: 'text-benin-yellow',
      description: 'Atteignez 500 XP pour débloquer ce badge',
      status: user.xp >= 500 ? 'completed' : 'in_progress',
      requirements: [
        { label: 'Gagner 500 XP', current: user.xp, total: 500, completed: user.xp >= 500 },
        { label: 'Compléter votre premier niveau', current: user.xp >= 1000 ? 1 : 0, total: 1, completed: user.xp >= 1000 },
      ]
    },
    {
      id: 'champion_streak',
      title: 'Série de Champion',
      icon: Target,
      color: 'bg-benin-green',
      textColor: 'text-benin-green',
      description: 'Maintenez une série de 7 jours',
      status: user.streak >= 7 ? 'completed' : 'in_progress',
      requirements: [
        { label: 'Série de 7 jours', current: user.streak, total: 7, completed: user.streak >= 7 },
      ]
    },
    {
      id: 'promo_sub',
      title: 'Réduction Abonnement -20%',
      icon: Crown,
      color: 'bg-purple-500',
      textColor: 'text-purple-500',
      description: 'Offre exclusive pour les utilisateurs actifs',
      status: user.xp >= 2000 ? 'available' : 'locked',
      requirements: [
        { label: 'Atteindre 2000 XP total', current: user.xp, total: 2000, completed: user.xp >= 2000 },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-earth-50 pb-24">
      {/* Header Summary */}
      <div className="bg-white p-6 rounded-b-3xl shadow-sm border-b border-earth-100 mb-6">
        <h1 className="text-2xl font-bold text-earth-900 mb-6">Ma Progression</h1>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-3 bg-earth-50 rounded-2xl border border-earth-100">
            <span className="text-3xl mb-2">{targetLang?.flag || '🏁'}</span>
            <span className="text-xs font-bold text-earth-400 uppercase tracking-wider">Langue</span>
            <span className="font-bold text-earth-900">{targetLang?.name || '---'}</span>
          </div>

          <div className="flex flex-col items-center p-3 bg-earth-50 rounded-2xl border border-earth-100">
            <div className="w-8 h-8 rounded-full bg-benin-green/10 flex items-center justify-center mb-2 text-benin-green">
              <Target className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-earth-400 uppercase tracking-wider">Niveau</span>
            <span className="font-bold text-earth-900">{user.xp >= 1000 ? 'Intermédiaire' : 'Débutant'}</span>
          </div>

          <div className="flex flex-col items-center p-3 bg-earth-50 rounded-2xl border border-earth-100">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-2 text-blue-600">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-earth-400 uppercase tracking-wider">Objectif</span>
            <span className="font-bold text-earth-900 capitalize">{user.learningGoal || 'Loisir'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 space-y-6">
        <h2 className="text-lg font-bold text-earth-900 px-2">Mes Succès</h2>

        {milestones.map((milestone) => (
          <Card key={milestone.id} className="overflow-hidden border-earth-200 shadow-sm transition-transform hover:scale-[1.01]">
            <div className={cn("h-2 w-full", milestone.color)} />
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={cn("p-3 rounded-xl bg-opacity-10", milestone.color.replace('bg-', 'bg-opacity-10 bg-'), milestone.textColor)}>
                    <milestone.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-earth-900 text-lg">{milestone.title}</h3>
                    <p className="text-xs text-earth-500">{milestone.description}</p>
                  </div>
                </div>
                {milestone.status === 'locked' && <Lock className="h-5 w-5 text-earth-300" />}
                {milestone.status === 'completed' && <CheckCircle2 className="h-5 w-5 text-benin-green" />}
              </div>

              <div className="space-y-4 bg-earth-50 p-4 rounded-2xl border border-earth-100">
                {milestone.requirements.map((req, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <div className="mt-0.5">
                      {req.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-benin-green" />
                      ) : (
                        <Circle className="h-5 w-5 text-earth-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={cn("text-sm font-medium", req.completed ? "text-earth-900 line-through opacity-50" : "text-earth-700")}>
                        {req.label}
                      </p>
                      <div className="mt-1.5 flex items-center space-x-2">
                        <div className="flex-1 h-1.5 bg-earth-200 rounded-full overflow-hidden">
                          <div
                            className={cn("h-full rounded-full transition-all", milestone.color)}
                            style={{ width: `${Math.min(100, (req.current / req.total) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-earth-400">
                          {req.current}/{req.total}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {user.xp < 50 && (
          <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-earth-200">
            <BookOpen className="h-12 w-12 text-earth-200 mx-auto mb-3" />
            <p className="text-earth-400 text-sm italic">Commencez une leçon pour voir vos progrès s'afficher ici !</p>
          </div>
        )}
      </div>
    </div>
  );
}
