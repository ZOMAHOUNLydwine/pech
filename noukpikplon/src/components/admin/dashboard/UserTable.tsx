import React, { useState, useEffect } from 'react';
import { Search, Filter, Edit2, Trash2, Eye, Loader2 } from 'lucide-react';
import { getUsersList, deleteUser, AdminUserListItem } from '@/lib/api/admin';

export default function UserTable() {
    const [users, setUsers] = useState<AdminUserListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await getUsersList();
            setUsers(data);
        } catch (err) {
            console.error("Failed to fetch users:", err);
            setError("Impossible de charger les utilisateurs");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId: number) => {
        if (!confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;
        try {
            await deleteUser(userId);
            setUsers(users.filter(u => u.id !== userId));
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la suppression");
        }
    };

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
                    <button onClick={loadUsers} className="p-2 bg-earth-50 text-earth-700 rounded-xl hover:bg-earth-100 transition-colors">
                        ↻
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto min-h-[300px]">
                {loading ? (
                    <div className="flex items-center justify-center h-64 text-benin-green">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-64 text-red-500 font-medium">
                        {error}
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-earth-50/50 text-earth-500 text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">Utilisateur</th>
                                <th className="px-6 py-4">Rôle</th>
                                <th className="px-6 py-4">XP</th>
                                <th className="px-6 py-4">Création</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-earth-50">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-earth-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-xl bg-benin-green/10 text-benin-green flex items-center justify-center font-bold uppercase">
                                                {user.name.substring(0, 2)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-earth-900">{user.name}</p>
                                                <p className="text-xs text-earth-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-earth-100 text-earth-600'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-earth-700 font-bold">{user.xp} XP</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(user.id)} className="p-2 text-red-400 hover:text-white hover:bg-red-500 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="p-4 border-t border-earth-50 bg-earth-50/30 text-center">
                <button className="text-sm font-bold text-benin-green hover:underline">Voir tous les utilisateurs</button>
            </div>
        </div>
    );
}

