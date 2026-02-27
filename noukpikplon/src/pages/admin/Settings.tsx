import React from 'react';
import { Settings as SettingsIcon, Bell, Shield, Database, Globe, Zap } from 'lucide-react';

const Settings: React.FC = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center">
                    <SettingsIcon className="mr-3 text-purple-600" />
                    Paramètres de la plateforme
                </h1>
                <p className="text-slate-500 mt-1">Configurez les options globales de Noukpikplon.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* General Settings */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center border-b border-slate-50 pb-4">
                        <Globe size={18} className="mr-2 text-blue-500" /> Général
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Nom de la plateforme</label>
                            <input type="text" defaultValue="Noukpikplon" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Langue par défaut du système</label>
                            <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20">
                                <option>Français</option>
                                <option>English</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Notifications Settings */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center border-b border-slate-50 pb-4">
                        <Bell size={18} className="mr-2 text-amber-500" /> Notifications
                    </h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-slate-700">Emails de rappels journaliers</p>
                                <p className="text-xs text-slate-400">Envoyer automatiquement des rappels aux élèves inactifs.</p>
                            </div>
                            <div className="w-12 h-6 bg-purple-600 rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-slate-700">Alertes de nouveaux badges</p>
                                <p className="text-xs text-slate-400">Notifier les élèves lorsqu'ils débloquent un badge.</p>
                            </div>
                            <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center border-b border-slate-50 pb-4">
                        <Shield size={18} className="mr-2 text-emerald-500" /> Sécurité & Accès
                    </h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-slate-700">Authentification à deux facteurs</p>
                                <p className="text-xs text-slate-400">Forcer le 2FA pour tous les comptes administrateurs.</p>
                            </div>
                            <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                        </div>
                        <button className="text-sm text-purple-600 font-bold hover:underline">Gérer les permissions des rôles</button>
                    </div>
                </div>

                {/* Performance / System */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center border-b border-slate-50 pb-4">
                        <Database size={18} className="mr-2 text-purple-500" /> Système
                    </h3>

                    <div className="flex flex-col gap-3">
                        <button className="w-full py-2 bg-slate-50 text-slate-700 text-sm font-bold rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors flex items-center justify-center">
                            <Zap size={14} className="mr-2" /> Vider le cache de l'application
                        </button>
                        <button className="w-full py-2 bg-red-50 text-red-600 text-sm font-bold rounded-lg border border-red-100 hover:bg-red-100 transition-colors">
                            Mode Maintenance
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button className="px-8 py-3 bg-purple-600 text-white font-bold rounded-xl shadow-lg shadow-purple-200 hover:bg-purple-700 transition-all">
                    Enregistrer les modifications
                </button>
            </div>
        </div>
    );
};

export default Settings;
