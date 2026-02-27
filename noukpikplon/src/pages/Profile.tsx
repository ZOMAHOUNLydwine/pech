import React, { useState } from 'react';
import { useApp, LANGUAGES } from '@/context/AppContext';
import { Check, X, Camera, Bell, Clock, ChevronRight, Globe, MessageCircle, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, updateUser, logout } = useApp();
  const navigate = useNavigate();
  
  // Local state for form fields
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState('utilisateur@example.com');
  const [password, setPassword] = useState('password123');
  const [notifications, setNotifications] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [reminderTime, setReminderTime] = useState('20:00');
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showNativeLanguageModal, setShowNativeLanguageModal] = useState(false);

  const targetLang = LANGUAGES.find(l => l.id === user.targetLanguage);
  const nativeLang = LANGUAGES.find(l => l.id === user.knownLanguages[0]);

  const handleSave = () => {
    updateUser({ name });
    // In a real app, we would save email, password, and settings to the backend here
    alert("Profil mis à jour avec succès !");
    navigate(-1);
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updateUser({ avatar: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-earth-50 pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm border-b border-earth-100">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-earth-400 hover:text-earth-600 rounded-full hover:bg-earth-50">
          <X className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-bold text-earth-900">Mon Compte</h1>
        <button onClick={handleSave} className="p-2 -mr-2 text-benin-green hover:text-green-700 rounded-full hover:bg-green-50">
          <Check className="h-6 w-6" />
        </button>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        
        {/* Profile Photo */}
        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="relative group cursor-pointer" onClick={handleCameraClick}>
            <div className="w-28 h-28 rounded-full bg-earth-200 overflow-hidden border-4 border-white shadow-lg relative">
              {user.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-benin-yellow to-orange-400 text-4xl text-white font-bold">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="h-8 w-8 text-white" />
              </div>
            </div>
            <button className="absolute bottom-0 right-0 p-2.5 bg-benin-green text-white rounded-full shadow-lg hover:bg-green-600 transition-transform hover:scale-110 border-2 border-white">
              <Camera className="h-4 w-4" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <button onClick={handleCameraClick} className="text-benin-green font-bold text-sm hover:underline">
            Changer la photo de profil
          </button>
        </div>

        {/* Apprentissage Section */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-earth-500 uppercase tracking-wider px-2">Apprentissage</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-earth-100 overflow-hidden">
            
            {/* Native Language (Je parle) */}
            <div 
              className="p-4 border-b border-earth-50 flex items-center justify-between cursor-pointer hover:bg-earth-50 transition-colors" 
              onClick={() => setShowNativeLanguageModal(true)}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 text-earth-900 rounded-xl">
                  <MessageCircle className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <span className="block font-medium text-earth-900">Je parle</span>
                  <span className="text-xs text-earth-500">{nativeLang?.name || 'Non définie'}</span>
                </div>
              </div>
              <div className="flex items-center text-earth-400">
                 <span className="text-2xl mr-2">{nativeLang?.flag}</span>
                 <ChevronRight className="h-5 w-5" />
              </div>
            </div>

            {/* Target Language (J'apprends) */}
            <div 
              className="p-4 border-b border-earth-50 flex items-center justify-between cursor-pointer hover:bg-earth-50 transition-colors" 
              onClick={() => setShowLanguageModal(true)}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-benin-yellow/20 text-earth-900 rounded-xl">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <span className="block font-medium text-earth-900">J'apprends</span>
                  <span className="text-xs text-earth-500">{targetLang?.name || 'Non définie'}</span>
                </div>
              </div>
              <div className="flex items-center text-earth-400">
                 <span className="text-2xl mr-2">{targetLang?.flag}</span>
                 <ChevronRight className="h-5 w-5" />
              </div>
            </div>

          </div>
        </div>

        {/* Subscription Section */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-earth-500 uppercase tracking-wider px-2">Abonnement</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-earth-100 overflow-hidden">
            <div 
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-earth-50 transition-colors"
              onClick={() => navigate('/subscription')}
            >
              <div className="flex items-center space-x-3">
                <div className={cn("p-2 rounded-xl", user.isPremium ? "bg-benin-green/20" : "bg-earth-100")}>
                  <Crown className={cn("h-5 w-5", user.isPremium ? "text-benin-green" : "text-earth-500")} />
                </div>
                <div>
                  <span className="block font-medium text-earth-900">
                    {user.isPremium ? "Premium" : "Gratuit"}
                  </span>
                  <span className="text-xs text-earth-500">
                    {user.isPremium && user.subscriptionExpiry 
                      ? `Expire le ${new Date(user.subscriptionExpiry).toLocaleDateString()}` 
                      : "Passer à la version Premium"}
                  </span>
                </div>
              </div>
              <div className="flex items-center text-earth-400">
                 {!user.isPremium && (
                   <span className="text-xs font-bold text-benin-green bg-benin-green/10 px-2 py-1 rounded-full mr-2">
                     2000 F
                   </span>
                 )}
                 <ChevronRight className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-earth-500 uppercase tracking-wider px-2">Informations Personnelles</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-earth-100 overflow-hidden">
            
            {/* Name Input */}
            <div className="p-4 border-b border-earth-50 flex flex-col space-y-1">
              <label className="text-xs font-bold text-earth-400 uppercase">Nom</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full text-earth-900 font-medium bg-transparent focus:outline-none placeholder-earth-300"
                placeholder="Votre nom"
              />
            </div>

            {/* Email Input */}
            <div className="p-4 border-b border-earth-50 flex flex-col space-y-1">
              <label className="text-xs font-bold text-earth-400 uppercase">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-earth-900 font-medium bg-transparent focus:outline-none placeholder-earth-300"
                placeholder="votre@email.com"
              />
            </div>

            {/* Password Input */}
            <div className="p-4 flex flex-col space-y-1">
              <label className="text-xs font-bold text-earth-400 uppercase">Mot de passe</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-earth-900 font-medium bg-transparent focus:outline-none placeholder-earth-300"
                placeholder="••••••••"
              />
            </div>

          </div>
        </div>

        {/* Settings */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-earth-500 uppercase tracking-wider px-2">Paramètres</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-earth-100 overflow-hidden">
            
            {/* Notifications Toggle */}
            <div className="p-4 border-b border-earth-50 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 text-blue-500 rounded-xl">
                  <Bell className="h-5 w-5" />
                </div>
                <span className="font-medium text-earth-900">Notifications</span>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>

            {/* Reminders Toggle */}
            <div className="p-4 border-b border-earth-50 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-50 text-purple-500 rounded-xl">
                  <Clock className="h-5 w-5" />
                </div>
                <span className="font-medium text-earth-900">Rappels</span>
              </div>
              <Switch checked={reminders} onCheckedChange={setReminders} />
            </div>

            {/* Reminder Time Input */}
            {reminders && (
              <div className="p-4 flex items-center justify-between bg-earth-50/50">
                <span className="text-sm text-earth-500 font-medium pl-12">Heure de rappel</span>
                <input 
                  type="time" 
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="bg-white border border-earth-200 text-earth-900 text-sm rounded-lg focus:ring-benin-green focus:border-benin-green block p-2"
                />
              </div>
            )}

          </div>
        </div>

        {/* Danger Zone (Optional but good for "Complete") */}
        <div className="pt-4">
            <button 
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="w-full py-3 text-red-500 font-medium text-sm hover:bg-red-50 rounded-xl transition-colors"
            >
                Se déconnecter
            </button>
        </div>

      </div>

      {/* Target Language Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-earth-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-earth-900">J'apprends</h3>
              <button onClick={() => setShowLanguageModal(false)} className="p-2 hover:bg-earth-100 rounded-full">
                <X className="h-5 w-5 text-earth-500" />
              </button>
            </div>
            <div className="overflow-y-auto p-4 space-y-2">
              {LANGUAGES.filter(l => l.isBeninese).map(lang => (
                <button
                  key={lang.id}
                  onClick={() => {
                    updateUser({ targetLanguage: lang.id });
                    setShowLanguageModal(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-xl border transition-all",
                    user.targetLanguage === lang.id 
                      ? "border-benin-green bg-benin-green/5 ring-1 ring-benin-green" 
                      : "border-earth-100 hover:border-benin-green/50 hover:bg-earth-50"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{lang.flag}</span>
                    <div className="text-left">
                      <span className="block font-bold text-earth-900">{lang.name}</span>
                      {lang.nativeName && <span className="text-xs text-earth-500">{lang.nativeName}</span>}
                    </div>
                  </div>
                  {user.targetLanguage === lang.id && <Check className="h-5 w-5 text-benin-green" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Native Language Modal */}
      {showNativeLanguageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-earth-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-earth-900">Je parle</h3>
              <button onClick={() => setShowNativeLanguageModal(false)} className="p-2 hover:bg-earth-100 rounded-full">
                <X className="h-5 w-5 text-earth-500" />
              </button>
            </div>
            <div className="overflow-y-auto p-4 space-y-2">
              {LANGUAGES.filter(l => !l.isBeninese).map(lang => (
                <button
                  key={lang.id}
                  onClick={() => {
                    updateUser({ knownLanguages: [lang.id] });
                    setShowNativeLanguageModal(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-xl border transition-all",
                    user.knownLanguages[0] === lang.id 
                      ? "border-benin-green bg-benin-green/5 ring-1 ring-benin-green" 
                      : "border-earth-100 hover:border-benin-green/50 hover:bg-earth-50"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{lang.flag}</span>
                    <div className="text-left">
                      <span className="block font-bold text-earth-900">{lang.name}</span>
                      {lang.nativeName && <span className="text-xs text-earth-500">{lang.nativeName}</span>}
                    </div>
                  </div>
                  {user.knownLanguages[0] === lang.id && <Check className="h-5 w-5 text-benin-green" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Switch({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (c: boolean) => void }) {
  return (
    <button 
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "w-12 h-7 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-benin-green",
        checked ? "bg-benin-green" : "bg-earth-200"
      )}
    >
      <div className={cn(
        "absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform",
        checked ? "translate-x-5" : "translate-x-0"
      )} />
    </button>
  );
}
