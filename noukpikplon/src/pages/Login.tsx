import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, Lock, Loader2 } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email && password) {
        login(email, password);
        // Check if user has completed onboarding (e.g. has a target language)
        // We need to check the *updated* user state, but login() updates state which might not be reflected immediately in 'user' variable here due to closure.
        // However, for this mock, we can assume if they login, we check their data.
        // Since login() in AppContext just sets a mock user, let's assume we redirect to dashboard by default, 
        // but if we were using a real backend, we'd check the response.
        
        // For now, let's redirect to / which handles the routing logic in App.tsx
        navigate('/'); 
      } else {
        setError('Veuillez remplir tous les champs');
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-earth-50 flex flex-col justify-center p-6">
      <div className="max-w-md w-full mx-auto space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-earth-900">Bon retour !</h2>
          <p className="mt-2 text-sm text-earth-600">
            Connectez-vous pour continuer votre apprentissage
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-earth-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-earth-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-earth-400" />
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-benin-green hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-95"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-earth-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-earth-500">
                  Pas encore de compte ?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link to="/signup" className="font-medium text-benin-green hover:text-green-700 hover:underline">
                Créer un compte gratuitement
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
