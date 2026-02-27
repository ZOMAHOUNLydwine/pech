import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Check, X, CreditCard, Star, Shield, Zap, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Subscription() {
  const { user, subscribe } = useApp();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      subscribe();
      setIsLoading(false);
      // Show success message or redirect
      alert("Félicitations ! Vous êtes maintenant abonné Premium.");
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-earth-50 flex flex-col relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-benin-green/10 rounded-b-[3rem]" />
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-benin-yellow/20 rounded-full blur-3xl" />
      
      {/* Header */}
      <div className="relative z-10 px-4 py-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/50 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
          <X className="h-6 w-6 text-earth-900" />
        </button>
        <span className="font-bold text-earth-900 tracking-wider text-sm uppercase">Premium</span>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="relative z-10 flex-1 flex flex-col px-6 pb-8">
        <div className="text-center space-y-4 mt-4 mb-8">
          <div className="inline-flex p-4 bg-white rounded-3xl shadow-lg shadow-benin-green/10 mb-2">
            <Star className="h-12 w-12 text-benin-yellow fill-benin-yellow" />
          </div>
          <h1 className="text-3xl font-bold text-earth-900">NOUKPIKPLON <span className="text-benin-green">Plus</span></h1>
          <p className="text-earth-600">Débloquez tout le potentiel de votre apprentissage.</p>
        </div>

        {/* Benefits Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-earth-100 space-y-6 mb-8">
          <BenefitItem 
            icon={<Shield className="h-5 w-5 text-blue-500" />}
            title="Vies illimitées"
            description="Apprenez sans interruption, faites autant d'erreurs que nécessaire."
          />
          <BenefitItem 
            icon={<Zap className="h-5 w-5 text-benin-yellow" />}
            title="Apprentissage hors-ligne"
            description="Téléchargez vos leçons et apprenez partout, même sans internet."
          />
          <BenefitItem 
            icon={<Star className="h-5 w-5 text-purple-500" />}
            title="Pas de publicités"
            description="Concentrez-vous uniquement sur votre progression."
          />
        </div>

        {/* Pricing Card */}
        <div className="mt-auto space-y-4">
          <div className="bg-benin-green/5 border-2 border-benin-green rounded-2xl p-4 flex items-center justify-between relative overflow-hidden">
             <div className="absolute top-0 right-0 bg-benin-green text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
               POPULAIRE
             </div>
             <div>
               <span className="block text-lg font-bold text-earth-900">Mensuel</span>
               <span className="text-sm text-earth-500">Annulable à tout moment</span>
             </div>
             <div className="text-right">
               <span className="block text-2xl font-bold text-benin-green">2000 F</span>
               <span className="text-xs text-earth-500">/ mois</span>
             </div>
          </div>

          <Button 
            onClick={handleSubscribe} 
            disabled={isLoading || user.isPremium}
            className={cn(
              "w-full h-14 text-lg font-bold rounded-xl shadow-lg transition-all",
              user.isPremium 
                ? "bg-earth-200 text-earth-500 cursor-not-allowed" 
                : "bg-benin-green hover:bg-green-700 text-white shadow-benin-green/30 hover:shadow-benin-green/40 hover:scale-[1.02]"
            )}
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : user.isPremium ? (
              "Déjà Abonné"
            ) : (
              "S'abonner maintenant"
            )}
          </Button>
          
          <p className="text-center text-xs text-earth-400">
            Paiement sécurisé via Mobile Money / Carte Bancaire
          </p>
        </div>
      </div>
    </div>
  );
}

function BenefitItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex items-start space-x-4">
      <div className="p-2 bg-earth-50 rounded-xl shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-earth-900">{title}</h3>
        <p className="text-sm text-earth-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
