import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await login(email, password);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.detail || err.message || 'Authentification échouée');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-earth-50 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-benin-green/5 via-transparent to-benin-yellow/5">
            <div className="max-w-md w-full">
                {/* Logo and Header */}
                <div className="text-center mb-10 group">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-benin-green rounded-[2.5rem] text-white shadow-2xl shadow-benin-green/30 mb-6 transform transition-transform group-hover:scale-110 duration-500">
                        <ShieldCheck className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl font-black text-earth-900 tracking-tighter mb-2 italic">PECH <span className="text-benin-green not-italic">ADMIN</span></h1>
                    <p className="text-earth-500 font-medium">Portail de gestion sécurisé</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/70 backdrop-blur-2xl p-10 rounded-[3rem] shadow-brand border border-white/50 relative overflow-hidden">
                    {/* Subtle decorative elements */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-benin-green/5 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-benin-yellow/5 rounded-full blur-3xl"></div>

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-earth-400 uppercase tracking-widest ml-4">Email Administrateur</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-earth-300 group-focus-within:text-benin-green transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@pech.bj"
                                    required
                                    className="block w-full pl-14 pr-6 py-5 bg-earth-50/50 border border-earth-100 rounded-2xl text-earth-900 placeholder:text-earth-300 focus:outline-none focus:ring-2 focus:ring-benin-green/20 focus:border-benin-green transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-earth-400 uppercase tracking-widest ml-4">Mot de passe</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-earth-300 group-focus-within:text-benin-green transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="block w-full pl-14 pr-6 py-5 bg-earth-50/50 border border-earth-100 rounded-2xl text-earth-900 placeholder:text-earth-300 focus:outline-none focus:ring-2 focus:ring-benin-green/20 focus:border-benin-green transition-all"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center space-x-2 text-red-500 text-sm bg-red-50/50 border border-red-100 p-4 rounded-xl animate-shake">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="font-medium">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full relative group"
                        >
                            <div className="absolute inset-0 bg-benin-green rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            <div className="relative flex items-center justify-center bg-benin-green text-white font-bold py-5 rounded-2xl shadow-lg shadow-benin-green/20 transition-all active:scale-[0.98] hover:shadow-benin-green/30">
                                {isLoading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    "SE CONNECTER"
                                )}
                            </div>
                        </button>
                    </form>
                </div>

                <p className="text-center mt-8 text-earth-400 text-xs font-medium uppercase tracking-[0.2em]">
                    &copy; 2024 Pech. Tous droits réservés.
                </p>
            </div>
        </div>
    );
}
