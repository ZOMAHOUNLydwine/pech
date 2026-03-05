import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { X, ChevronRight, Volume2, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';


export default function LessonPlayer() {
  const { questId } = useParams();
  const navigate = useNavigate();
  const { updateUser, user, activeProgram } = useApp();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Find lesson in activeProgram
  const lesson = activeProgram?.levels
    .flatMap(l => l.units)
    .flatMap(u => u.lessons)
    .find(l => l.id === questId);

  // Fallback to mock steps if lesson content is empty (for demo)
  const lessonSteps: any[] = [
    { type: 'intro', title: lesson?.title || 'Leçon', content: lesson?.textContent || 'Bienvenue dans cette leçon.', image: '📚' },
    { type: 'success', title: 'Bravo !', xp: lesson?.xpReward || 100 }
  ];

  const step = lessonSteps[currentStepIndex];
  const progress = ((currentStepIndex) / (lessonSteps.length - 1)) * 100;

  const handleCheck = () => {
    if (step.type === 'quiz') {
      const correct = selectedOption === step.correctIndex;
      setIsCorrect(correct);
      setIsChecked(true);
    } else {
      handleNext();
    }
  };

  const handleNext = () => {
    if (currentStepIndex < lessonSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsChecked(false);
      setIsCorrect(false);
    } else {
      // Finish lesson
      updateUser({
        xp: user.xp + (lesson?.xpReward || 0),
        streak: user.streak + 1,
        completedQuests: [...user.completedQuests, lesson?.id || '']
      });
      navigate('/lessons');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-4 py-6 md:px-8 md:py-8 flex items-center space-x-6 max-w-7xl mx-auto w-full">
        <button onClick={() => navigate('/lessons')} className="text-earth-400 hover:text-earth-600 transition-colors p-1 hover:bg-earth-50 rounded-lg">
          <X className="h-7 w-7" />
        </button>
        <div className="flex-1 h-3 bg-earth-100 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-benin-green transition-all duration-700 ease-out shadow-[0_0_8px_rgba(0,135,81,0.3)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full space-y-12"
          >
            {step.type === 'intro' && (
              <div className="text-center space-y-8 max-w-2xl mx-auto">
                <motion.div
                  initial={{ rotate: -10 }}
                  animate={{ rotate: 0 }}
                  className="text-9xl md:text-[10rem] drop-shadow-xl"
                >
                  {step.image}
                </motion.div>
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl font-black text-earth-900 tracking-tight">{step.title}</h1>
                  <p className="text-xl md:text-2xl text-earth-600 leading-relaxed font-medium">{step.content}</p>
                </div>
              </div>
            )}

            {step.type === 'vocab' && (
              <div className="text-center space-y-10 max-w-2xl mx-auto py-8">
                <h2 className="text-sm md:text-base font-black text-earth-400 uppercase tracking-[0.3em] mb-4">Nouveau mot</h2>
                <div className="space-y-8 bg-earth-50 p-10 md:p-16 rounded-[3rem] border-2 border-earth-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-benin-green/5 rounded-full -mr-16 -mt-16 blur-3xl" />

                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-center space-x-6">
                      <h1 className="text-5xl md:text-7xl font-black text-earth-900 tracking-tight">{step.word}</h1>
                      {step.audio && (
                        <button className="p-5 rounded-3xl bg-benin-green text-white hover:bg-green-600 transition-all shadow-lg active:scale-95">
                          <Volume2 className="h-8 w-8" />
                        </button>
                      )}
                    </div>
                    <p className="text-2xl md:text-3xl text-earth-500 italic font-medium">{step.pronunciation}</p>
                  </div>

                  <div className="w-24 h-1.5 bg-earth-200 mx-auto rounded-full" />

                  <p className="text-3xl md:text-5xl text-earth-800 font-bold relative z-10">{step.translation}</p>
                </div>
              </div>
            )}

            {step.type === 'quiz' && (
              <div className="space-y-10 max-w-2xl mx-auto w-full">
                <h2 className="text-3xl md:text-4xl font-black text-earth-900 text-center tracking-tight leading-tight">{step.question}</h2>
                <div className="grid grid-cols-1 gap-4 w-full">
                  {step.options.map((option: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => !isChecked && setSelectedOption(idx)}
                      disabled={isChecked}
                      className={cn(
                        "w-full p-6 md:p-8 rounded-3xl border-2 text-xl md:text-2xl font-bold text-left transition-all duration-200 shadow-sm",
                        selectedOption === idx
                          ? "border-benin-green bg-benin-green/5 text-benin-green"
                          : "border-earth-100 hover:border-earth-300 bg-white",
                        isChecked && idx === step.correctIndex && "border-benin-green bg-benin-green text-white shadow-benin-green/20 scale-[1.02]",
                        isChecked && selectedOption === idx && !isCorrect && "border-red-500 bg-red-50 text-red-600"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        <div className={cn(
                          "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all",
                          selectedOption === idx ? "border-benin-green bg-benin-green text-white" : "border-earth-200"
                        )}>
                          {isChecked && idx === step.correctIndex && <Check className="h-5 w-5" />}
                          {isChecked && selectedOption === idx && !isCorrect && <X className="h-5 w-5" />}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step.type === 'success' && (
              <div className="text-center space-y-10 py-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12 }}
                  className="w-40 h-40 md:w-56 md:h-56 bg-benin-yellow rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-benin-yellow/30"
                >
                  <Check className="h-20 w-20 md:h-32 md:w-32 text-earth-900 stroke-[3]" />
                </motion.div>
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-6xl font-black text-earth-900 tracking-tight">Leçon terminée !</h1>
                  <p className="text-xl md:text-2xl text-earth-600 font-bold">Incroyable travail !</p>
                </div>
                <div className="flex justify-center pt-4">
                  <div className="bg-orange-100 text-orange-600 px-10 py-5 rounded-3xl font-black text-2xl md:text-3xl shadow-sm border-2 border-orange-200/50 flex items-center">
                    <span className="mr-3">⚡</span> +{step.xp} XP
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Actions */}
      <div className={cn(
        "p-6 md:p-10 border-t border-earth-200 safe-area-bottom transition-all duration-300",
        isChecked ? (isCorrect ? "bg-benin-green/5" : "bg-red-50") : "bg-white"
      )}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {isChecked ? (
            <div className="flex items-center space-x-5 w-full md:w-auto">
              <div className={cn("p-4 rounded-3xl shadow-lg", isCorrect ? "bg-benin-green text-white" : "bg-red-500 text-white")}>
                {isCorrect ? <Check className="h-8 w-8" /> : <X className="h-8 w-8" />}
              </div>
              <div className="flex-1">
                <h3 className={cn("font-black text-2xl md:text-3xl tracking-tight mb-1", isCorrect ? "text-benin-green" : "text-red-600")}>
                  {isCorrect ? "Excellent !" : "Pas tout à fait..."}
                </h3>
                {!isCorrect && step.type === 'quiz' && (
                  <p className="text-lg text-red-500 font-bold opacity-80">La bonne réponse était : {step.options[step.correctIndex]}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden md:block flex-1" />
          )}

          <Button
            onClick={isChecked ? handleNext : handleCheck}
            disabled={step.type === 'quiz' && selectedOption === null && !isChecked}
            className={cn(
              "w-full md:w-auto px-12 h-16 md:h-20 text-xl md:text-2xl font-black rounded-3xl shadow-xl transition-all active:scale-95",
              isChecked
                ? (isCorrect ? "bg-benin-green hover:bg-green-600 shadow-benin-green/20" : "bg-red-500 hover:bg-red-600 shadow-red-500/20")
                : "bg-benin-green hover:bg-green-600 shadow-benin-green/10"
            )}
          >
            {isChecked || step.type !== 'quiz' ? 'Continuer' : 'Vérifier'}
          </Button>
        </div>
      </div>
    </div>
  );
}
