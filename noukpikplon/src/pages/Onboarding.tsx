import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useApp, LANGUAGES } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, Globe, Heart, Briefcase, Plane, BookOpen, Users, ArrowRight, Search, X, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import VoiceButton from '@/components/VoiceButton';
import GuideCharacter from '@/components/GuideCharacter';

const steps = [
  'auth',
  'profile',
  'languages',
  'daily-goal',
  'learning-type',
  'summary'
] as const;

export default function Onboarding() {
  const { updateUser, user, login, isAuthenticated } = useApp();
  const navigate = useNavigate();

  // If authenticated, start at profile step (index 1), otherwise start at auth (index 0)
  const [currentStepIndex, setCurrentStepIndex] = useState(isAuthenticated ? 1 : 0);

  // Effect to redirect to dashboard if onboarding is already complete (optional, but good safety)
  useEffect(() => {
    if (isAuthenticated && user.targetLanguage && user.learningGoal && user.learningType && user.dailyGoal) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // If not authenticated, we can't really "complete" without login/signup
      // But if we are here, we might be in guest mode or just finishing up
      if (!isAuthenticated) {
        login(user.isAdmin ? 'admin' : 'user'); // Admin or guest/user login
      }
      navigate('/dashboard');
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const currentStep = steps[currentStepIndex];

  return (
    <div className="min-h-screen bg-earth-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress Indicator */}
        <div className="mb-8 flex items-center space-x-4">
          {currentStepIndex > 0 && (
            <button
              onClick={prevStep}
              className="p-2 hover:bg-earth-100 rounded-full transition-colors text-earth-400"
              title="Précédent"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="flex-1 flex justify-center space-x-2">
            {steps.map((step, index) => (
              <div
                key={step}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  index <= currentStepIndex ? "w-8 bg-benin-green" : "w-2 bg-earth-200"
                )}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 'auth' && <AuthStep onNext={nextStep} />}
            {currentStep === 'profile' && <ProfileStep onNext={nextStep} />}
            {currentStep === 'languages' && <LanguageSelectionStep onNext={nextStep} />}
            {currentStep === 'daily-goal' && <DailyGoalStep onNext={nextStep} />}
            {currentStep === 'learning-type' && <LearningTypeStep onNext={nextStep} />}
            {currentStep === 'summary' && <SummaryStep onNext={nextStep} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- Step Components ---

function AuthStep({ onNext }: { onNext: () => void }) {
  const { updateUser, login } = useApp();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 text-center">
      <div className="mb-8 flex flex-col items-center">
        <GuideCharacter emotion="happy" position="center" className="mb-6" />
        <h1 className="text-4xl font-bold text-benin-green mb-2 tracking-tight">NOUKPIKPLON</h1>
        <p className="text-earth-600 text-lg">Préservez l'héritage. Apprenez la culture.</p>
      </div>

      <div className="space-y-4">
        <Button onClick={() => navigate('/signup')} className="w-full text-lg h-14" variant="default">
          Créer un compte
        </Button>
        <Button onClick={() => navigate('/login')} className="w-full text-lg h-14" variant="outlineEarth">
          Se connecter
        </Button>
        <Button
          onClick={() => {
            login('admin');
            navigate('/admin');
          }}
          variant="ghost"
          className="text-earth-500 font-bold"
        >
          Accéder à l'administration
        </Button>
      </div>
    </div>
  );
}

function ProfileStep({ onNext }: { onNext: () => void }) {
  const { updateUser } = useApp();

  const handleSelect = (goal: any) => {
    updateUser({ learningGoal: goal });
    onNext();
  };

  const goals = [
    { id: 'family', label: 'Famille & Amis', icon: Heart, desc: "Parler avec mes proches" },
    { id: 'work', label: 'Travail & Business', icon: Briefcase, desc: "Opportunités professionnelles" },
    { id: 'travel', label: 'Voyage & Tourisme', icon: Plane, desc: "Explorer le pays" },
    { id: 'culture', label: 'Culture & Tradition', icon: Users, desc: "Comprendre l'héritage" },
    { id: 'studies', label: 'Études & Recherche', icon: BookOpen, desc: "Approfondir mes connaissances" },
  ];

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex items-center justify-between flex-none">
        <h2 className="text-2xl font-bold text-earth-900">Ton objectif ?</h2>
        <VoiceButton text="Pourquoi voulez-vous apprendre une langue béninoise ?" />
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 min-h-0">
        {goals.map((goal) => (
          <Button
            key={goal.id}
            variant="outlineEarth"
            className="w-full justify-start h-auto py-4 px-4 rounded-2xl hover:bg-earth-100 hover:border-benin-green hover:text-benin-green transition-all shadow-sm group"
            onClick={() => handleSelect(goal.id)}
          >
            <div className="bg-earth-100 p-3 rounded-full mr-4 group-hover:bg-white transition-colors">
              <goal.icon className="h-6 w-6 opacity-70 group-hover:text-benin-green group-hover:opacity-100" />
            </div>
            <div className="text-left">
              <div className="font-bold text-lg">{goal.label}</div>
              <div className="text-sm text-earth-500 font-normal group-hover:text-earth-600">{goal.desc}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}

function LanguageSelectionStep({ onNext }: { onNext: () => void }) {
  const { updateUser, user } = useApp();
  const [nativeLang, setNativeLang] = useState<string | null>(
    user.knownLanguages?.[0] || null
  );
  const [targetLang, setTargetLang] = useState<string | null>(
    user.targetLanguage || null
  );
  const [activeTab, setActiveTab] = useState<"native" | "target">("native");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelect = (langId: string) => {
    if (activeTab === "native") {
      setNativeLang(langId);
      setActiveTab("target");
    } else {
      setTargetLang(langId);
    }
  };

  const handleContinue = () => {
    if (!nativeLang || !targetLang) return;

    updateUser({
      knownLanguages: [nativeLang],
      targetLanguage: targetLang,
    });

    onNext();
  };

  const filteredLanguages = LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.nativeName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">

      {/* HEADER */}
      <div className="flex-none space-y-5 mb-6">

        <div>
          <h2 className="text-3xl font-bold text-earth-900">
            Choisis tes langues
          </h2>
          <p className="text-earth-600">
            Configure ton profil linguistique
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-earth-100 p-2 rounded-full flex">
          <button
            onClick={() => setActiveTab("native")}
            className={cn(
              "flex-1 py-3 rounded-full transition-all text-sm font-bold",
              activeTab === "native"
                ? "bg-white shadow text-earth-900"
                : "text-earth-500"
            )}
          >
            Je parle
          </button>

          <button
            onClick={() => setActiveTab("target")}
            className={cn(
              "flex-1 py-3 rounded-full transition-all text-sm font-bold",
              activeTab === "target"
                ? "bg-white shadow text-earth-900"
                : "text-earth-500"
            )}
          >
            J’apprends
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Rechercher une langue..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-earth-200 focus:outline-none focus:ring-2 focus:ring-benin-green"
        />
      </div>

      {/* SCROLL AREA */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">

        <div className="grid grid-cols-2 gap-4 pb-4">
          {filteredLanguages.map((lang) => {
            const isSelected =
              (activeTab === "native" && nativeLang === lang.id) ||
              (activeTab === "target" && targetLang === lang.id);

            const isConflict =
              (activeTab === "native" && targetLang === lang.id) ||
              (activeTab === "target" && nativeLang === lang.id);

            if (isConflict) return null;

            return (
              <div
                key={lang.id}
                onClick={() => handleSelect(lang.id)}
                className={cn(
                  "p-5 rounded-2xl border text-center cursor-pointer transition",
                  isSelected
                    ? "border-benin-green bg-benin-green/5"
                    : "bg-white hover:border-earth-300"
                )}
              >
                <div className="text-4xl">{lang.flag}</div>
                <div className="mt-2 font-bold">{lang.name}</div>
                {isSelected && (
                  <Check className="mx-auto mt-2 text-benin-green" />
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* STICKY BUTTON (PROPRE) */}
      <div className="sticky bottom-0 pt-4 pb-2 bg-earth-50">
        <Button
          onClick={handleContinue}
          disabled={!nativeLang || !targetLang}
          className="w-full h-14 text-lg rounded-full"
        >
          Continuer
        </Button>
      </div>
    </div>
  );
}

function DailyGoalStep({ onNext }: { onNext: () => void }) {
  const { updateUser } = useApp();

  const handleSelect = (minutes: number) => {
    updateUser({ dailyGoal: minutes });
    onNext();
  };

  const goals = [
    { minutes: 5, label: '5 minutes', desc: 'Ultra facile à intégrer. Parfait pour commencer.', icon: '🌱', color: 'bg-green-100 text-green-700' },
    { minutes: 10, label: '10 minutes', desc: 'Bon équilibre entre rapidité et régularité.', icon: '⚡', color: 'bg-yellow-100 text-yellow-700' },
    { minutes: 20, label: '20 minutes', desc: 'Idéal pour progresser efficacement.', icon: '🧠', color: 'bg-blue-100 text-blue-700' },
    { minutes: 30, label: '30 minutes +', desc: 'Pour une progression rapide et approfondie.', icon: '🚀', color: 'bg-purple-100 text-purple-700' },
  ];

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-earth-900">Micro-apprentissage quotidien</h2>
        <p className="text-earth-600">Combien de temps peux-tu consacrer par jour ?</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4 min-h-0">
        <div className="bg-white/50 p-4 rounded-2xl text-sm text-earth-600 italic border border-earth-100">
          "Le micro-apprentissage fonctionne mieux quand il est court, régulier et récompensant."
        </div>

        {goals.map((goal) => (
          <Button
            key={goal.minutes}
            variant="outlineEarth"
            className="w-full justify-start h-auto py-4 px-4 rounded-2xl hover:bg-earth-100 hover:border-benin-green transition-all shadow-sm group"
            onClick={() => handleSelect(goal.minutes)}
          >
            <div className={cn("p-3 rounded-full mr-4 text-xl", goal.color)}>
              {goal.icon}
            </div>
            <div className="text-left flex-1">
              <div className="font-bold text-lg text-earth-900">{goal.label}</div>
              <div className="text-sm text-earth-500 font-normal leading-tight mt-1">{goal.desc}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}


function LearningTypeStep({ onNext }: { onNext: () => void }) {
  const { updateUser, user } = useApp();
  const targetLang = LANGUAGES.find(l => l.id === user.targetLanguage);

  const handleSelect = (type: 'heritage' | 'foreign') => {
    updateUser({ learningType: type });
    onNext();
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-earth-900">Votre lien avec le {targetLang?.name}</h2>
        <p className="text-earth-600">Cette question adapte notre pédagogie.</p>
      </div>

      <div className="grid gap-4">
        <Card
          className="cursor-pointer hover:border-benin-green transition-all group"
          onClick={() => handleSelect('heritage')}
        >
          <CardContent className="p-6 flex items-start space-x-4">
            <div className="bg-benin-yellow/20 p-3 rounded-full text-earth-800 group-hover:bg-benin-yellow/30 transition-colors">
              <Heart className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-earth-900">C'est ma langue d'origine</h3>
              <p className="text-earth-600 text-sm mt-1">
                Je veux me reconnecter à ma culture, parler avec mes aînés. Approche plus intuitive et culturelle.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:border-benin-green transition-all group"
          onClick={() => handleSelect('foreign')}
        >
          <CardContent className="p-6 flex items-start space-x-4">
            <div className="bg-blue-100 p-3 rounded-full text-blue-700 group-hover:bg-blue-200 transition-colors">
              <Globe className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-earth-900">C'est une langue étrangère</h3>
              <p className="text-earth-600 text-sm mt-1">
                Je pars de zéro. J'ai besoin d'explications grammaticales structurées et de comparaisons.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SummaryStep({ onNext }: { onNext: () => void }) {
  const { user } = useApp();
  const targetLang = LANGUAGES.find(l => l.id === user.targetLanguage);

  return (
    <div className="space-y-8 text-center">
      <div className="space-y-2 flex flex-col items-center">
        <GuideCharacter emotion="excited" position="center" className="mb-4" />
        <h2 className="text-3xl font-bold text-earth-900">Tout est prêt !</h2>
        <p className="text-earth-600 text-lg">Votre parcours personnalisé a été généré.</p>
      </div>

      <Card className="bg-white/50 border-earth-200">
        <CardContent className="p-6 space-y-4 text-left">
          <div className="flex justify-between items-center border-b border-earth-100 pb-3">
            <span className="text-earth-500">Langue cible</span>
            <span className="font-bold text-xl text-earth-900">{targetLang?.name} {targetLang?.flag}</span>
          </div>
          <div className="flex justify-between items-center border-b border-earth-100 pb-3">
            <span className="text-earth-500">Objectif</span>
            <span className="font-medium text-earth-900 capitalize">{user.learningGoal}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-earth-500">Approche</span>
            <span className="font-medium text-earth-900">
              {user.learningType === 'heritage' ? 'Culturelle & Intuitive' : 'Structurée & Explicative'}
            </span>
          </div>
          <div className="flex justify-between items-center border-t border-earth-100 pt-3 mt-3">
            <span className="text-earth-500">Objectif quotidien</span>
            <span className="font-medium text-earth-900">{user.dailyGoal} min</span>
          </div>
        </CardContent>
      </Card>

      <Button onClick={onNext} className="w-full h-14 text-lg shadow-lg shadow-benin-green/20 animate-pulse">
        Commencer l'apprentissage <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}
