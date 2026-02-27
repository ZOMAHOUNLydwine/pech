import React from 'react';
import { Search, Filter, MoreHorizontal, Edit2, Trash2, Eye } from 'lucide-react';

const users = [
    { id: 1, name: 'Jean Dupont', email: 'jean@example.com', role: 'Admin', status: 'Actif', lastActive: '2 min ago', avatar: 'JD' },
    { id: 2, name: 'Marie Kouassi', email: 'marie@example.com', role: 'Utilisateur', status: 'Actif', lastActive: '1 jour ago', avatar: 'MK' },
    { id: 3, name: 'Kofi Mensah', email: 'kofi@example.com', role: 'Utilisateur', status: 'Inactif', lastActive: '3 jours ago', avatar: 'KM' },
    { id: 4, name: 'Sarah Bernard', email: 'sarah@example.com', role: 'Éditeur', status: 'Actif', lastActive: '5 min ago', avatar: 'SB' },
    { id: 5, name: 'Paul Atayi', email: 'paul@example.com', role: 'Utilisateur', status: 'En attente', lastActive: 'Jamais', avatar: 'PA' },
];

export default function UserTable() {
    return (
        <div className="bg-white rounded-3xl border border-earth-100 shadow-card overflow-hidden">
            <div className="p-6 border-b border-earth-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-earth-900">Gestion des Utilisateurs</h2>
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
                        <input
                            type="text"
                            placeholder="Chercher..."
                            className="pl-10 pr-4 py-2 bg-earth-50 border-none rounded-xl text-sm w-full md:w-64 focus:ring-2 focus:ring-benin-green/20 outline-none"
                        />
                    </div>
                    <button className="p-2 bg-earth-50 text-earth-700 rounded-xl hover:bg-earth-100 transition-colors">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-earth-50/50 text-earth-500 text-xs font-bold uppercase tracking-wider">
                            <th className="px-6 py-4">Utilisateur</th>
                            <th className="px-6 py-4">Rôle</th>
                            <th className="px-6 py-4">Statut</th>
                            <th className="px-6 py-4">Dernier accès</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-earth-50">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-earth-50/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-xl bg-benin-green/10 text-benin-green flex items-center justify-center font-bold">
                                            {user.avatar}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-earth-900">{user.name}</p>
                                            <p className="text-xs text-earth-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-earth-700 font-medium">{user.role}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.status === 'Actif' ? 'bg-benin-green/10 text-benin-green' :
                                        user.status === 'Inactif' ? 'bg-earth-100 text-earth-500' :
                                            'bg-amber-50 text-amber-600'
                                        }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500">
                                    {user.lastActive}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-slate-400 hover:text-benin-green hover:bg-benin-green/5 rounded-lg transition-colors">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-4 border-t border-earth-50 bg-earth-50/30 text-center">
                <button className="text-sm font-bold text-benin-green hover:underline">Voir tous les utilisateurs</button>
            </div>
        </div>
    );
}
