import React, { useState } from 'react';
import { Search, MoreVertical, Shield, ShieldOff, Mail, MapPin, Filter } from 'lucide-react';

const Users: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Mock Users Data
    const users = [
        { id: 1, name: 'Jean Dupont', email: 'jean.d@example.com', role: 'Admin', status: 'Actif', joinedDate: '12/01/2024', location: 'Cotonou' },
        { id: 2, name: 'Amina Diallo', email: 'amina.diallo@example.com', role: 'Élève', status: 'Actif', joinedDate: '15/02/2024', location: 'Porto-Novo' },
        { id: 3, name: 'Koffi Mensah', email: 'koffi.m@example.com', role: 'Élève', status: 'Inactif', joinedDate: '03/03/2024', location: 'Parakou' },
        { id: 4, name: 'Fatou Sow', email: 'fatousow@example.com', role: 'Élève', status: 'Actif', joinedDate: '20/03/2024', location: 'Ouidah' },
        { id: 5, name: 'Marc Soglo', email: 'm.soglo@example.com', role: 'Élève', status: 'Actif', joinedDate: '25/03/2024', location: 'Abomey' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Gestion des Utilisateurs</h1>
                    <p className="text-slate-500 mt-1">Supervisez les comptes et les accès à la plateforme.</p>
                </div>
                <button className="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 text-sm shadow-md transition-all">
                    + Inviter un administrateur
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-4 shadow-sm">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher par nom, email ou ville..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm px-4 py-2 text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20">
                        <option>Tous les rôles</option>
                        <option>Élève</option>
                        <option>Admin</option>
                    </select>
                    <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm px-4 py-2 text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20">
                        <option>Tous les statuts</option>
                        <option>Actif</option>
                        <option>Inactif</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Utilisateur</th>
                            <th className="px-6 py-4">Rôle</th>
                            <th className="px-6 py-4">Ville</th>
                            <th className="px-6 py-4">Statut</th>
                            <th className="px-6 py-4">Rejoint le</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{user.name}</p>
                                            <div className="flex items-center text-slate-400 text-xs mt-0.5">
                                                <Mail size={12} className="mr-1" />
                                                {user.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition-all ${user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {user.role === 'Admin' && <Shield size={10} className="mr-1" />}
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="flex items-center text-slate-500">
                                        <MapPin size={12} className="mr-1 text-slate-400" /> {user.location}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${user.status === 'Actif' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500">
                                    {user.joinedDate}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors">
                                        <MoreVertical size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xs text-slate-500 font-medium">Affichage de 1-5 sur 2,845 utilisateurs</p>
                <div className="flex gap-2">
                    <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-400 cursor-not-allowed">Précédent</button>
                    <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-purple-600 hover:bg-purple-50 transition-colors">Suivant</button>
                </div>
            </div>
        </div>
    );
};

export default Users;
