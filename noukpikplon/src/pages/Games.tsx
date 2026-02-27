import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gamepad2, Smile, Car, Apple, Palette, Hash, Type, Shirt, Briefcase, Sun, Shapes, Heart, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
  emoji: string;
}

export default function Games() {
  const navigate = useNavigate();

  const categories: Category[] = [
    { id: 'alphabet', title: 'Alphabet', icon: Type, color: 'bg-purple-500', emoji: '🅰️' },
    { id: 'numbers', title: 'Chiffres', icon: Hash, color: 'bg-green-500', emoji: '1️⃣' },
    { id: 'colors', title: 'Couleurs', icon: Palette, color: 'bg-orange-500', emoji: '🎨' },
    { id: 'animals', title: 'Animaux', icon: Heart, color: 'bg-red-500', emoji: '🦁' },
    { id: 'body', title: 'Corps', icon: Smile, color: 'bg-yellow-500', emoji: '👂' },
    { id: 'food', title: 'Nourriture', icon: Apple, color: 'bg-pink-500', emoji: '🍎' },
    { id: 'clothes', title: 'Vêtements', icon: Shirt, color: 'bg-blue-500', emoji: '👕' },
    { id: 'jobs', title: 'Métiers', icon: Briefcase, color: 'bg-teal-500', emoji: '👨‍⚕️' },
    { id: 'transport', title: 'Transport', icon: Car, color: 'bg-indigo-500', emoji: '🚗' },
    { id: 'emotions', title: 'Émotions', icon: Smile, color: 'bg-rose-500', emoji: '😊' },
    { id: 'seasons', title: 'Saisons', icon: Sun, color: 'bg-amber-500', emoji: '☀️' },
    { id: 'shapes', title: 'Formes', icon: Shapes, color: 'bg-cyan-500', emoji: '🔺' },
  ];

  return (
    <div className="min-h-screen bg-earth-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-4 shadow-sm flex items-center sticky top-0 z-10">
        <button onClick={() => navigate('/')} className="mr-4 text-earth-600 hover:text-earth-900">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold text-earth-900 flex items-center">
          <Gamepad2 className="h-6 w-6 mr-2 text-purple-500" />
          Jeux de Mémoire
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 max-w-md mx-auto w-full space-y-6 pb-24">
        <p className="text-earth-600 text-center mb-2">
          Choisissez une catégorie pour commencer à jouer !
        </p>

        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <CategoryCard 
              key={category.id}
              category={category}
              onClick={() => alert(`Le jeu "${category.title}" sera bientôt disponible !`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const CategoryCard: React.FC<{ category: Category; onClick: () => void }> = ({ category, onClick }) => {
  const Icon = category.icon;
  
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 rounded-3xl bg-white border border-earth-100 shadow-sm hover:shadow-md transition-all active:scale-95 group aspect-square relative overflow-hidden"
    >
      <div className={cn("absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity", category.color)} />
      
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-3 shadow-sm group-hover:scale-110 transition-transform", category.color)}>
        <span className="text-2xl">{category.emoji}</span>
      </div>
      
      <h3 className="font-bold text-earth-900 text-base text-center leading-tight">{category.title}</h3>
    </button>
  );
};