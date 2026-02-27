import React from 'react';
import { useApp, LANGUAGES } from '@/context/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MessageCircle, Globe, ArrowRight } from 'lucide-react';

export default function Community() {
  const { user } = useApp();
  const targetLang = LANGUAGES.find(l => l.id === user.targetLanguage);
  
  // Mock source language (assuming French for now based on onboarding)
  const sourceLang = LANGUAGES.find(l => l.id === 'fr'); 

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-earth-900">Communauté</h1>
        <p className="text-earth-600">Échangez, pratiquez et progressez ensemble.</p>
      </div>

      {/* My Communities */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-earth-500 uppercase tracking-wider">Vos Groupes</h2>
        
        {/* Target Language Group */}
        <Card className="border-l-4 border-l-benin-green hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div className="bg-benin-green/10 p-2 rounded-lg">
                  <span className="text-2xl">{targetLang?.flag}</span>
                </div>
                <div>
                  <h3 className="font-bold text-earth-900">Apprenants {targetLang?.name}</h3>
                  <p className="text-xs text-earth-500">1.2k membres • 34 en ligne</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <ArrowRight className="h-4 w-4 text-earth-400" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Source -> Target Group */}
        <Card className="border-l-4 border-l-benin-yellow hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div className="bg-benin-yellow/10 p-2 rounded-lg">
                  <div className="flex -space-x-1">
                    <span className="text-lg">{sourceLang?.flag}</span>
                    <span className="text-lg">{targetLang?.flag}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-earth-900">{sourceLang?.name} vers {targetLang?.name}</h3>
                  <p className="text-xs text-earth-500">Entraide francophone</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <ArrowRight className="h-4 w-4 text-earth-400" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Challenge */}
      <div className="bg-earth-800 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-2 text-benin-yellow">
            <TrophyIcon className="h-5 w-5" />
            <span className="font-bold text-sm uppercase">Défi Hebdo</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Saluer 5 personnes</h3>
          <p className="text-white/80 text-sm mb-4">Enregistrez-vous en train de saluer dans votre langue cible.</p>
          <Button size="sm" className="bg-white text-earth-900 hover:bg-earth-100 w-full">
            Participer
          </Button>
        </div>
      </div>

      {/* Discussion Topics */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-earth-500 uppercase tracking-wider">Discussions Récentes</h2>
        {[
          { title: "Comment prononcer 'Gb' ?", author: "Marie K.", replies: 12, tag: "Prononciation" },
          { title: "Proverbe du jour", author: "Koffi A.", replies: 5, tag: "Culture" },
          { title: "Marché Dantokpa", author: "Jean P.", replies: 8, tag: "Voyage" },
        ].map((topic, i) => (
          <div key={i} className="flex items-start space-x-3 p-3 rounded-xl hover:bg-white transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-earth-200 flex-shrink-0 flex items-center justify-center font-bold text-earth-600">
              {topic.author[0]}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-earth-900 text-sm truncate">{topic.title}</h4>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-earth-500">{topic.author}</span>
                <span className="text-xs text-earth-300">•</span>
                <span className="text-xs bg-earth-100 text-earth-600 px-1.5 py-0.5 rounded">{topic.tag}</span>
              </div>
            </div>
            <div className="flex items-center text-earth-400 text-xs">
              <MessageCircle className="h-3 w-3 mr-1" />
              {topic.replies}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrophyIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}
