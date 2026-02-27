import React from 'react';
import { useApp, LANGUAGES } from '@/context/AppContext';
import { Flame, Star, Gamepad2, BookOpen, Headphones, MessageSquare, Dumbbell, GraduationCap, ChevronRight, Map, Crown, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import GuideCharacter from '@/components/GuideCharacter';

export default function Dashboard() {
  const { user } = useApp();
  const targetLang = LANGUAGES.find(l => l.id === user.targetLanguage);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-earth-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-earth-200 px-4 py-3 shadow-sm">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{targetLang?.flag}</span>
            <span className="font-bold text-earth-900 hidden sm:inline">{targetLang?.name}</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/subscription')}
              className={cn(
                "flex items-center px-2 py-1 rounded-full font-bold text-xs transition-colors",
                user.isPremium
                  ? "bg-benin-green/10 text-benin-green border border-benin-green/20"
                  : "bg-gradient-to-r from-benin-yellow to-orange-400 text-white shadow-sm hover:shadow-md"
              )}
            >
              <Crown className="h-3.5 w-3.5 mr-1" />
              <span>{user.isPremium ? "Premium" : "Go Premium"}</span>
            </button>

            <div className="flex items-center text-orange-500 font-bold bg-orange-50 px-2 py-1 rounded-full">
              <Flame className="h-4 w-4 mr-1 fill-current" />
              <span>{user.streak}</span>
            </div>
            <div className="flex items-center text-benin-yellow font-bold bg-yellow-50 px-2 py-1 rounded-full">
              <Star className="h-4 w-4 mr-1 fill-current" />
              <span>{user.xp}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6 pb-24">

        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-2xl font-bold text-earth-900">Bienvenue, {user.name} !</h1>
            <p className="text-earth-600">Prêt pour aujourd'hui ?</p>
          </div>
          <GuideCharacter emotion="happy" className="scale-75 origin-right" />
        </div>

        {/* Premium Banner (if not premium) */}
        {!user.isPremium && (
          <div
            onClick={() => navigate('/subscription')}
            className="bg-gradient-to-r from-earth-900 to-earth-800 rounded-2xl p-4 text-white shadow-lg cursor-pointer relative overflow-hidden group"
          >
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg flex items-center">
                  <Crown className="h-5 w-5 text-benin-yellow mr-2" />
                  Devenez Premium
                </h3>
                <p className="text-earth-300 text-xs mt-1">Vies illimitées, hors-ligne et plus !</p>
              </div>
              <div className="bg-white/10 p-2 rounded-full group-hover:bg-white/20 transition-colors">
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
            <div className="absolute -right-4 -bottom-8 w-24 h-24 bg-benin-yellow/20 rounded-full blur-xl" />
          </div>
        )}


        {/* Ingenious Feature: The Village Builder (Meta-Game) */}
        <div className="bg-gradient-to-br from-benin-green to-emerald-700 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg group cursor-pointer transition-transform hover:scale-[1.02]">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold flex items-center">
                <span className="mr-2">🏡</span> Mon Village
              </h2>
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                Niveau 1 : Hameau
              </span>
            </div>
            <p className="text-emerald-50 text-sm mb-6 leading-relaxed">
              Tes progrès ne sont pas que des points. Chaque leçon apprise aide à construire ton village !
            </p>

            <div className="flex items-end justify-between">
              <div className="flex space-x-6">
                <div className="flex flex-col items-center space-y-1">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl border border-white/20 shadow-inner">
                    🛖
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Maison</span>
                </div>
                <div className="flex flex-col items-center space-y-1 opacity-50 grayscale">
                  <div className="w-12 h-12 bg-black/10 rounded-2xl flex items-center justify-center text-2xl border border-white/5 border-dashed">
                    🌾
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">Champs</span>
                </div>
                <div className="flex flex-col items-center space-y-1 opacity-30 grayscale">
                  <div className="w-12 h-12 bg-black/10 rounded-2xl flex items-center justify-center text-2xl border border-white/5 border-dashed">
                    🏪
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">Marché</span>
                </div>
              </div>

              <button className="bg-white text-benin-green p-2 rounded-xl shadow-md hover:bg-emerald-50 transition-colors">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -right-6 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Map className="h-24 w-24" />
          </div>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-2 gap-4">
          <ActivityCard
            icon={BookOpen}
            label="Leçons"
            color="bg-blue-500"
            onClick={() => navigate('/lessons')}
            description="Parcours guidé"
          />
          <ActivityCard
            icon={Dumbbell}
            label="Exercices"
            color="bg-green-500"
            description="Entraînement"
          />
          <ActivityCard
            icon={GraduationCap}
            label="Quiz"
            color="bg-orange-500"
            description="Testez-vous"
          />
          <ActivityCard
            icon={Gamepad2}
            label="Jeux"
            color="bg-purple-500"
            description="Jouer"
            onClick={() => navigate('/games')}
          />
          <ActivityCard
            icon={Headphones}
            label="Audio"
            color="bg-pink-500"
            description="Écouter"
          />
          <ActivityCard
            icon={MessageSquare}
            label="Phrases"
            color="bg-teal-500"
            description="Parler"
          />
        </div>

        {/* Daily Motivation Card */}
        <div className="bg-benin-yellow/10 border border-benin-yellow/30 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-earth-900 mb-2">Le saviez-vous ?</h3>
          <p className="text-earth-700 text-sm italic">
            "En Fon, 'Kú dɔ̀ gbe' signifie 'Bonjour' (littéralement: Merci pour le lever du jour)."
          </p>
        </div>

      </main>
    </div>
  );
}

function ActivityCard({ icon: Icon, label, color, description, onClick }: { icon: any, label: string, color: string, description?: string, onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white border border-earth-100 shadow-sm hover:shadow-md transition-all active:scale-95 group h-40"
    >
      <div className={cn("w-14 h-14 rounded-full flex items-center justify-center text-white mb-3 shadow-sm group-hover:scale-110 transition-transform", color)}>
        <Icon className="h-7 w-7" />
      </div>
      <span className="font-bold text-earth-900 text-lg">{label}</span>
      {description && <span className="text-xs text-earth-500 mt-1">{description}</span>}
    </button>
  );
}
