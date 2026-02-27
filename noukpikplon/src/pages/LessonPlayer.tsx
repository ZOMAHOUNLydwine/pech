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
      <div className="px-4 py-6 flex items-center space-x-4">
        <button onClick={() => navigate('/lessons')} className="text-earth-400 hover:text-earth-600">
          <X className="h-6 w-6" />
        </button>
        <div className="flex-1 h-3 bg-earth-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-benin-green transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full space-y-8"
          >
            {step.type === 'intro' && (
              <div className="text-center space-y-6">
                <div className="text-8xl">{step.image}</div>
                <h1 className="text-3xl font-bold text-earth-900">{step.title}</h1>
                <p className="text-xl text-earth-600 leading-relaxed">{step.content}</p>
              </div>
            )}

            {step.type === 'vocab' && (
              <div className="text-center space-y-8">
                <h2 className="text-2xl font-bold text-earth-400 uppercase tracking-widest">Nouveau mot</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-3">
                    <h1 className="text-4xl font-bold text-earth-900">{step.word}</h1>
                    {step.audio && (
                      <button className="p-3 rounded-full bg-benin-green/10 text-benin-green hover:bg-benin-green/20">
                        <Volume2 className="h-6 w-6" />
                      </button>
                    )}
                  </div>
                  <p className="text-xl text-earth-500 italic">{step.pronunciation}</p>
                  <div className="w-16 h-1 bg-earth-200 mx-auto rounded-full" />
                  <p className="text-2xl text-earth-700">{step.translation}</p>
                </div>
              </div>
            )}

            {step.type === 'quiz' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-earth-900 text-center">{step.question}</h2>
                <div className="space-y-3">
                  {step.options.map((option: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => !isChecked && setSelectedOption(idx)}
                      disabled={isChecked}
                      className={cn(
                        "w-full p-4 rounded-xl border-2 text-lg font-medium text-left transition-all",
                        selectedOption === idx
                          ? "border-benin-green bg-benin-green/5 text-benin-green"
                          : "border-earth-200 hover:bg-earth-50",
                        isChecked && idx === step.correctIndex && "border-benin-green bg-benin-green text-white",
                        isChecked && selectedOption === idx && !isCorrect && "border-red-500 bg-red-50 text-red-600"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step.type === 'success' && (
              <div className="text-center space-y-6">
                <div className="w-32 h-32 bg-benin-yellow rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <Check className="h-16 w-16 text-earth-900" />
                </div>
                <h1 className="text-3xl font-bold text-earth-900">Leçon terminée !</h1>
                <div className="flex justify-center space-x-4">
                  <div className="bg-orange-100 text-orange-600 px-6 py-3 rounded-xl font-bold flex items-center">
                    <span className="mr-2">⚡</span> +{step.xp} XP
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Actions */}
      <div className={cn(
        "p-4 border-t border-earth-200 safe-area-bottom transition-colors",
        isChecked ? (isCorrect ? "bg-benin-green/10 border-benin-green" : "bg-red-50 border-red-200") : "bg-white"
      )}>
        <div className="max-w-md mx-auto flex items-center justify-between">
          {isChecked && (
            <div className="flex items-center space-x-3">
              <div className={cn("p-2 rounded-full", isCorrect ? "bg-benin-green text-white" : "bg-red-500 text-white")}>
                {isCorrect ? <Check className="h-6 w-6" /> : <X className="h-6 w-6" />}
              </div>
              <div>
                <h3 className={cn("font-bold text-lg", isCorrect ? "text-benin-green" : "text-red-600")}>
                  {isCorrect ? "Excellent !" : "Pas tout à fait..."}
                </h3>
                {!isCorrect && step.type === 'quiz' && (
                  <p className="text-sm text-red-500">La bonne réponse était : {step.options[step.correctIndex]}</p>
                )}
              </div>
            </div>
          )}

          <Button
            onClick={isChecked ? handleNext : handleCheck}
            disabled={step.type === 'quiz' && selectedOption === null && !isChecked}
            className={cn(
              "ml-auto px-8 h-12 text-lg font-bold shadow-lg transition-all",
              isChecked
                ? (isCorrect ? "bg-benin-green hover:bg-green-600" : "bg-red-500 hover:bg-red-600")
                : "bg-benin-green hover:bg-green-600"
            )}
          >
            {isChecked || step.type !== 'quiz' ? 'Continuer' : 'Vérifier'}
          </Button>
        </div>
      </div>
    </div>
  );
}
