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
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-earth-200 px-4 py-3 md:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{targetLang?.flag}</span>
            <span className="font-bold text-earth-900">{targetLang?.name}</span>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-6">
            <button
              onClick={() => navigate('/subscription')}
              className={cn(
                "flex items-center px-3 py-1.5 rounded-full font-bold text-xs transition-all hover:scale-105 active:scale-95",
                user.isPremium
                  ? "bg-benin-green/10 text-benin-green border border-benin-green/20"
                  : "bg-gradient-to-r from-benin-yellow to-orange-400 text-white shadow-sm hover:shadow-md"
              )}
            >
              <Crown className="h-3.5 w-3.5 mr-1.5" />
              <span>{user.isPremium ? "Premium" : "Passer au Premium"}</span>
            </button>

            <div className="flex items-center space-x-4">
              <div className="flex items-center text-orange-500 font-bold bg-orange-50 px-3 py-1.5 rounded-full">
                <Flame className="h-4 w-4 mr-1.5 fill-current" />
                <span>{user.streak}</span>
              </div>
              <div className="flex items-center text-benin-yellow font-bold bg-yellow-50 px-3 py-1.5 rounded-full">
                <Star className="h-4 w-4 mr-1.5 fill-current" />
                <span>{user.xp}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 pb-24 md:pb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-earth-900 tracking-tight">Bienvenue, {user.name} !</h1>
            <p className="text-earth-600 text-lg">Prêt pour aujourd'hui ?</p>
          </div>
          <GuideCharacter emotion="happy" className="scale-75 md:scale-100 origin-right" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Activities Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
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
          </div>

          <div className="space-y-6">
            {/* Premium Banner (if not premium) */}
            {!user.isPremium && (
              <div
                onClick={() => navigate('/subscription')}
                className="bg-gradient-to-r from-earth-900 to-earth-800 rounded-3xl p-6 text-white shadow-lg cursor-pointer relative overflow-hidden group transition-all hover:shadow-xl active:scale-[0.98]"
              >
                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="font-bold text-xl flex items-center mb-2">
                      <Crown className="h-6 w-6 text-benin-yellow mr-2" />
                      Devenez Premium
                    </h3>
                    <p className="text-earth-300 text-sm">Vies illimitées, accès hors-ligne et plus encore !</p>
                  </div>
                  <div className="mt-8 flex items-center text-benin-yellow font-bold group-hover:translate-x-2 transition-transform">
                    En savoir plus <ChevronRight className="h-5 w-5 ml-1" />
                  </div>
                </div>
                <div className="absolute -right-4 -bottom-8 w-32 h-32 bg-benin-yellow/10 rounded-full blur-2xl" />
              </div>
            )}

            {/* Daily Motivation Card moved here on desktop */}
            <div className="bg-benin-yellow/10 border border-benin-yellow/30 rounded-3xl p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-benin-yellow/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="font-bold text-earth-900 mb-2">Le saviez-vous ?</h3>
              <p className="text-earth-700 text-sm italic leading-relaxed">
                "En Fon, 'Kú dɔ̀ gbe' signifie 'Bonjour' (littéralement: Merci pour le lever du jour)."
              </p>
            </div>
          </div>
        </div>

        {/* Ingenious Feature: The Village Builder (Meta-Game) */}
        <div className="bg-gradient-to-br from-benin-green to-emerald-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg group cursor-pointer transition-all hover:shadow-2xl hover:scale-[1.01]">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold flex items-center">
                  <span className="mr-3 text-3xl">🏡</span> Mon Village
                </h2>
                <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold border border-white/10 md:hidden">
                  Niveau 1 : Hameau
                </span>
              </div>
              <p className="text-emerald-50 text-lg mb-6 leading-relaxed opacity-90">
                Tes progrès ne sont pas que des points. Chaque leçon apprise aide à construire et faire prospérer ton village !
              </p>

              <div className="hidden md:flex items-center space-x-3 mb-2">
                <span className="text-sm font-bold opacity-80 uppercase tracking-widest">Progression vers niveau 2</span>
                <span className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold border border-white/10">
                  75%
                </span>
              </div>
              <div className="hidden md:block w-full h-2 bg-black/20 rounded-full overflow-hidden mb-8">
                <div className="h-full bg-benin-yellow w-3/4 shadow-[0_0_10px_rgba(252,209,22,0.5)]" />
              </div>

              <div className="flex space-x-6 md:space-x-10">
                <div className="flex flex-col items-center space-y-2 group/item">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl border border-white/20 shadow-inner group-hover/item:scale-110 transition-transform">
                    🛖
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider opacity-80">Maison</span>
                </div>
                <div className="flex flex-col items-center space-y-2 opacity-40 grayscale group/item">
                  <div className="w-16 h-16 bg-black/10 rounded-2xl flex items-center justify-center text-3xl border border-white/5 border-dashed group-hover/item:scale-110 transition-transform">
                    🌾
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider opacity-60">Champs</span>
                </div>
                <div className="flex flex-col items-center space-y-2 opacity-20 grayscale group/item">
                  <div className="w-16 h-16 bg-black/10 rounded-2xl flex items-center justify-center text-3xl border border-white/5 border-dashed group-hover/item:scale-110 transition-transform">
                    🏪
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider opacity-60">Marché</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="hidden md:block bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl text-center border border-white/10 mb-4">
                <p className="text-xs font-bold uppercase opacity-60 mb-1">Grade Actuel</p>
                <p className="text-xl font-black">HAMEAU</p>
              </div>
              <button className="bg-white text-benin-green w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-emerald-50 hover:scale-110 transition-all active:scale-95">
                <ChevronRight className="h-8 w-8" />
              </button>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Map className="h-48 w-48" />
          </div>
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
