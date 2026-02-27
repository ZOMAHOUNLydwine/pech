import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Lock, Play, CheckCircle, ArrowLeft, Star, Trophy, BookOpen, Headphones, Mic, Repeat, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';

// --- Types are now imported from AppContext ---
import { Level, Unit, Lesson } from '@/context/AppContext';

export default function Lessons() {
  const { activeProgram } = useApp();
  const navigate = useNavigate();
  const [activeLevelId, setActiveLevelId] = useState('lv0');

  const levels = activeProgram?.levels || [];
  const activeLevel = levels.find(l => l.id === activeLevelId) || levels[0];

  return (
    <div className="min-h-screen bg-earth-50 pb-24">
      {/* Sticky Header with Level Selector */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-earth-200 shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="-ml-2">
            <ArrowLeft className="h-6 w-6 text-earth-600" />
          </Button>
          <h1 className="text-lg font-bold text-earth-900">Parcours</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Level Tabs */}
        <div className="flex overflow-x-auto px-4 pb-0 no-scrollbar space-x-6 border-b border-earth-100">
          {levels.map((level) => (
            <button
              key={level.id}
              onClick={() => !level.isLocked && setActiveLevelId(level.id)}
              disabled={level.isLocked}
              className={cn(
                "pb-3 text-sm font-bold whitespace-nowrap transition-all relative px-2 flex flex-col items-center",
                activeLevelId === level.id
                  ? "text-earth-900 scale-105"
                  : level.isLocked ? "text-earth-300 cursor-not-allowed" : "text-earth-400 hover:text-earth-600"
              )}
            >
              <span className="block text-xs uppercase tracking-wider opacity-70">{level.title}</span>
              <div className="flex items-center space-x-1">
                {level.isLocked && <Lock className="h-3 w-3" />}
                <span className="text-base">{level.subtitle}</span>
              </div>
              {activeLevelId === level.id && (
                <motion.div
                  layoutId="activeTab"
                  className={cn("absolute bottom-0 left-0 right-0 h-1 rounded-t-full", level.color)}
                />
              )}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-8">

        {/* Level Intro */}
        <div className={cn("rounded-3xl p-6 text-white shadow-lg mb-8 relative overflow-hidden", activeLevel.color)}>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">{activeLevel.subtitle}</h2>
            <p className="opacity-90 text-sm font-medium max-w-[80%]">
              {activeLevel.id === 0 && "Immersion totale. Écoutez, répétez, comprenez. Pas de texte, juste du son."}
              {activeLevel.id === 1 && "Maîtrisez les sons uniques du Fon et les tons qui changent tout."}
              {activeLevel.id === 2 && "Commencez à lire et à construire vos propres phrases."}
            </p>
          </div>
          <div className="absolute -right-4 -bottom-8 opacity-20 rotate-12">
            {activeLevel.id === 0 && <Headphones className="h-40 w-40" />}
            {activeLevel.id === 1 && <Mic className="h-40 w-40" />}
            {activeLevel.id === 2 && <BookOpen className="h-40 w-40" />}
          </div>
        </div>

        {/* Units List */}
        <div className="space-y-12">
          {activeLevel.units.length > 0 ? (
            activeLevel.units.map((unit, index) => (
              <UnitSection key={unit.id} unit={unit} index={index} />
            ))
          ) : (
            <div className="text-center py-12 opacity-50">
              <Lock className="h-12 w-12 mx-auto mb-4" />
              <p>Ce niveau est en cours de construction.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const UnitSection: React.FC<{ unit: Unit; index: number }> = ({ unit, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative">
      {/* Unit Header Card */}
      <div className={cn("rounded-3xl border-2 overflow-hidden shadow-sm bg-white z-10 relative", unit.color.replace('text-', 'border-').split(' ')[0])}>
        <div className={cn("p-4 flex items-start justify-between", unit.color)}>
          <div>
            <h3 className="font-bold text-lg uppercase tracking-wider opacity-80 mb-1">Unité {index + 1}</h3>
            <h2 className="text-2xl font-bold leading-tight">{unit.title}</h2>
            <p className="text-sm font-medium mt-2 opacity-90">{unit.description}</p>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
          >
            <Info className="h-5 w-5 text-current" />
          </button>
        </div>

        {/* Objectives (Collapsible) */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white px-4 py-4 border-b border-earth-100"
            >
              <h4 className="font-bold text-earth-900 mb-3 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-benin-green" />
                Objectifs "Je peux" :
              </h4>
              <ul className="space-y-2">
                {unit.canDo.map((goal, i) => (
                  <li key={i} className="text-sm text-earth-600 flex items-start">
                    <span className="mr-2">•</span> {goal}
                  </li>
                ))}
              </ul>

              {unit.spiralReview && (
                <div className="mt-4 pt-4 border-t border-earth-100">
                  <h4 className="font-bold text-earth-900 mb-2 flex items-center text-xs uppercase tracking-wider">
                    <Repeat className="h-3 w-3 mr-2 text-orange-500" />
                    Révision Spirale
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {unit.spiralReview.map((topic, i) => (
                      <span key={i} className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-md font-medium border border-orange-100">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lessons Path */}
      <div className="pt-8 pb-4 px-4 relative">
        {/* Connecting Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-earth-200 -ml-0.5 -z-10 rounded-full" />

        <div className="space-y-8">
          {unit.lessons.map((lesson, i) => (
            <LessonNode key={lesson.id} lesson={lesson} index={i} isLast={i === unit.lessons.length - 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

const LessonNode: React.FC<{ lesson: Lesson; index: number; isLast: boolean }> = ({ lesson, index, isLast }) => {
  const navigate = useNavigate();
  const isLocked = lesson.status === 'locked';
  const isCompleted = lesson.status === 'completed';

  // Zig-zag layout
  const align = index % 2 === 0 ? 'left' : 'right';
  const marginClass = align === 'left' ? 'mr-auto ml-4' : 'ml-auto mr-4';

  if (isLast) {
    // Boss Mission Node (Centered)
    return (
      <div className="flex flex-col items-center justify-center relative z-10 mt-8">
        <div className="relative group">
          <div className="absolute -inset-4 bg-benin-yellow/20 rounded-full blur-xl animate-pulse" />
          <button
            onClick={() => !isLocked && navigate(`/lesson/${lesson.id}`)}
            disabled={isLocked}
            className={cn(
              "w-24 h-24 rounded-3xl rotate-45 flex items-center justify-center border-4 shadow-xl transition-all relative z-10",
              isLocked
                ? "bg-earth-200 border-earth-300 text-earth-400"
                : "bg-gradient-to-br from-purple-500 to-indigo-600 border-white text-white hover:scale-105"
            )}
          >
            <div className="-rotate-45">
              {isLocked ? <Lock className="h-8 w-8" /> : <Trophy className="h-10 w-10 fill-yellow-300 text-yellow-300" />}
            </div>
          </button>
        </div>
        <div className="mt-6 bg-white px-4 py-2 rounded-xl shadow-sm border border-earth-100 text-center relative z-10">
          <h3 className="font-bold text-earth-900 text-sm uppercase tracking-wider text-purple-600">Mission Finale</h3>
          <p className="font-bold text-earth-900">{lesson.title}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative flex flex-col items-center w-20", marginClass)}>
      <button
        onClick={() => !isLocked && navigate(`/lesson/${lesson.id}`)}
        disabled={isLocked}
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center border-b-4 shadow-md transition-all active:scale-95 active:border-b-0 active:translate-y-1 relative",
          isLocked
            ? "bg-earth-200 border-earth-300 text-earth-400"
            : isCompleted
              ? "bg-benin-green border-green-700 text-white"
              : "bg-benin-yellow border-yellow-600 text-earth-900"
        )}
      >
        {isLocked ? (
          <Lock className="h-6 w-6 opacity-50" />
        ) : isCompleted ? (
          <CheckCircle className="h-8 w-8" />
        ) : (
          <Play className="h-6 w-6 fill-current ml-1" />
        )}

        {/* Stars */}
        {!isLocked && (
          <div className="absolute -top-2 -right-2 flex">
            {[1, 2, 3].map((star) => (
              <Star
                key={star}
                className={cn(
                  "h-3 w-3",
                  (lesson.stars || 0) >= star ? "fill-yellow-400 text-yellow-400" : "fill-earth-300 text-earth-300"
                )}
              />
            ))}
          </div>
        )}
      </button>

      <span className="mt-2 text-xs font-bold text-earth-600 text-center bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-md shadow-sm border border-earth-100 max-w-[120px] truncate">
        {lesson.title}
      </span>
    </div>
  );
}
