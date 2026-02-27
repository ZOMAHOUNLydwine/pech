import React from 'react';
import { useApp, LANGUAGES } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { Trophy, BookOpen, Gamepad2, Crown, Target, Lock, CheckCircle2, Circle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Progress() {
  const { user } = useApp();
  const targetLang = LANGUAGES.find(l => l.id === user.targetLanguage);

  // Mock Milestones Data
  const milestones = [
    {
      id: 'badge_initie',
      title: 'Badge "Initié"',
      icon: Trophy,
      color: 'bg-benin-yellow',
      textColor: 'text-benin-yellow',
      description: 'Débloquez le badge officiel de niveau 1',
      status: 'in_progress',
      requirements: [
        { label: 'Terminer la leçon "Salutations"', current: 1, total: 1, completed: true },
        { label: 'Terminer la leçon "Se présenter"', current: 0, total: 4, completed: false },
        { label: 'Réussir 3 Quiz sans faute', current: 1, total: 3, completed: false },
      ]
    },
    {
      id: 'promo_sub',
      title: 'Réduction Abonnement -20%',
      icon: Crown,
      color: 'bg-purple-500',
      textColor: 'text-purple-500',
      description: 'Offre exclusive pour les champions',
      status: 'locked',
      requirements: [
        { label: 'Atteindre le Top 10 du classement', current: 42, total: 10, type: 'rank', completed: false },
        { label: 'Jouer à 5 mini-jeux', current: 0, total: 5, completed: false },
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
            <span className="text-3xl mb-2">{targetLang?.flag}</span>
            <span className="text-xs font-bold text-earth-400 uppercase tracking-wider">Langue</span>
            <span className="font-bold text-earth-900">{targetLang?.name}</span>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-earth-50 rounded-2xl border border-earth-100">
            <div className="w-8 h-8 rounded-full bg-benin-green/10 flex items-center justify-center mb-2 text-benin-green">
              <Target className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-earth-400 uppercase tracking-wider">Niveau</span>
            <span className="font-bold text-earth-900">{user.currentLevel || 'Débutant'}</span>
          </div>

          <div className="flex flex-col items-center p-3 bg-earth-50 rounded-2xl border border-earth-100">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-2 text-blue-600">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-earth-400 uppercase tracking-wider">Objectif</span>
            <span className="font-bold text-earth-900 capitalize">{user.learningGoal || 'Voyage'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 space-y-6">
        <h2 className="text-lg font-bold text-earth-900 px-2">Prochains Objectifs</h2>

        {milestones.map((milestone) => (
          <Card key={milestone.id} className="overflow-hidden border-earth-200 shadow-sm">
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
                            style={{ 
                              width: req.type === 'rank' 
                                ? `${Math.min(100, (10 / req.current) * 100)}%` // Inverse logic for rank (lower is better)
                                : `${(req.current / req.total) * 100}%` 
                            }} 
                          />
                        </div>
                        <span className="text-xs font-bold text-earth-400">
                          {req.type === 'rank' ? `#${req.current}` : `${req.current}/${req.total}`}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
