import { useState } from 'react';
import {
    Layers,
    Plus,
    Edit2,
    Trash2,
    ChevronRight,
    Search,
    X,
    Check,
    Book
} from 'lucide-react';
import { cn } from '../lib/utils';

// Types (should be in a shared file in a real project)
interface Level {
    id: string;
    title: string;
    subtitle: string;
}

interface Program {
    id: string;
    title: string;
    levels: Level[];
}

// Mock Data
const MOCK_DATA: Program[] = [
    {
        id: 'fon-fr',
        title: 'Français -> Fon',
        levels: [
            { id: 'lv0', title: "Niveau 0", subtitle: "Immersion Orale" },
            { id: 'lv1', title: "Niveau 1", subtitle: "Bases & Salutations" },
        ]
    },
    {
        id: 'yo-fr',
        title: 'Français -> Yoruba',
        levels: [
            { id: 'yo_lv0', title: "Niveau 0", subtitle: "Démarrage" },
        ]
    }
];

export default function LevelsPage() {
    const [programs, setPrograms] = useState<Program[]>(MOCK_DATA);
    const [activeProgramId, setActiveProgramId] = useState<string>(programs[0].id);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [editingLevelId, setEditingLevelId] = useState<string | null>(null);

    const activeProgram = programs.find(p => p.id === activeProgramId);

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const title = formData.get('title') as string;
        const subtitle = formData.get('subtitle') as string;

        if (modalMode === 'add') {
            const newLevel: Level = {
                id: `lv-${Date.now()}`,
                title,
                subtitle
            };
            setPrograms(programs.map(p =>
                p.id === activeProgramId
                    ? { ...p, levels: [...p.levels, newLevel] }
                    : p
            ));
        } else {
            setPrograms(programs.map(p => ({
                ...p,
                levels: p.levels.map(l => l.id === editingLevelId ? { ...l, title, subtitle } : l)
            })));
        }
        setModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if (!confirm('Supprimer ce niveau ?')) return;
        setPrograms(programs.map(p => ({
            ...p,
            levels: p.levels.filter(l => l.id !== id)
        })));
    };

    const openEdit = (level: Level) => {
        setModalMode('edit');
        setEditingLevelId(level.id);
        setModalOpen(true);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-extrabold text-earth-900 tracking-tight">Gestion des Niveaux</h2>
                    <p className="text-earth-500 mt-1 text-lg">Créez et organisez les étapes de progression par langue.</p>
                </div>
                <button
                    onClick={() => { setModalMode('add'); setModalOpen(true); }}
                    className="flex items-center gap-2 px-8 py-4 bg-benin-green text-white font-black rounded-2xl shadow-brand hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-xs"
                >
                    <Plus className="w-5 h-5" />
                    Nouveau Niveau
                </button>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Program Selection */}
                <div className="lg:col-span-4">
                    <div className="bg-white rounded-[2.5rem] border border-earth-100 shadow-card overflow-hidden">
                        <div className="p-6 border-b border-earth-100 bg-earth-50/50">
                            <h3 className="font-black text-earth-900 uppercase tracking-tighter text-sm">Programmes Linguistiques</h3>
                        </div>
                        <div className="p-4 space-y-2">
                            {programs.map(prog => (
                                <button
                                    key={prog.id}
                                    onClick={() => setActiveProgramId(prog.id)}
                                    className={cn(
                                        "w-full flex items-center justify-between p-5 rounded-2xl transition-all text-left group",
                                        activeProgramId === prog.id
                                            ? "bg-benin-green text-white shadow-brand"
                                            : "hover:bg-earth-50 text-earth-600"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <Book className={cn("w-5 h-5", activeProgramId === prog.id ? "text-white" : "text-earth-300")} />
                                        <span className="font-bold">{prog.title}</span>
                                    </div>
                                    <ChevronRight className={cn("w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity", activeProgramId === prog.id && "opacity-100")} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Levels List */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-[2.5rem] border border-earth-100 shadow-card overflow-hidden min-h-[500px]">
                        <div className="p-8 border-b border-earth-100 bg-white sticky top-0 z-10">
                            <div className="flex items-center gap-2 text-benin-green text-[10px] font-black uppercase tracking-widest mb-1">
                                <span>{activeProgram?.title}</span>
                            </div>
                            <h3 className="text-2xl font-black text-earth-900 tracking-tighter">Niveaux d'apprentissage</h3>
                        </div>

                        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {activeProgram?.levels.map(level => (
                                <div key={level.id} className="group relative bg-white border border-earth-100 rounded-[2.5rem] p-8 hover:border-benin-green/30 hover:shadow-brand transition-all">
                                    <div className="w-16 h-16 bg-earth-50 rounded-3xl flex items-center justify-center text-benin-green mb-6 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                        <Layers className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-xl font-black text-earth-900 tracking-tight mb-1 uppercase">{level.title}</h4>
                                    <p className="text-earth-400 text-xs font-bold uppercase tracking-widest mb-6">{level.subtitle}</p>

                                    <div className="flex items-center gap-2 pt-6 border-t border-earth-50 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEdit(level)} className="flex-1 py-3 bg-earth-50 text-benin-green font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-benin-green hover:text-white transition-all">Modifier</button>
                                        <button onClick={() => handleDelete(level.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={() => { setModalMode('add'); setModalOpen(true); }}
                                className="flex flex-col items-center justify-center p-8 border-4 border-dashed border-earth-50 rounded-[2.5rem] text-earth-300 group hover:border-benin-green/30 hover:bg-benin-green/5 transition-all min-h-[300px]"
                            >
                                <div className="w-16 h-16 bg-earth-50 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white group-hover:shadow-sm transition-all text-earth-200 group-hover:text-benin-green">
                                    <Plus className="w-8 h-8" />
                                </div>
                                <span className="font-black uppercase tracking-widest text-[10px]">Ajouter un niveau</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-earth-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-earth-100">
                        <div className="p-8 border-b border-earth-100 flex items-center justify-between bg-earth-50/30">
                            <h3 className="text-2xl font-black text-earth-900 tracking-tight uppercase">
                                {modalMode === 'add' ? 'Créer un Niveau' : 'Modifier le Niveau'}
                            </h3>
                            <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-white rounded-xl transition-colors text-earth-400 hover:text-earth-900">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-earth-400 uppercase tracking-widest ml-1">Titre (ex: Niveau 1)</label>
                                <input name="title" required defaultValue={modalMode === 'edit' ? activeProgram?.levels.find(l => l.id === editingLevelId)?.title : ''} className="w-full bg-earth-50 border border-earth-100 rounded-2xl px-5 py-4 text-earth-900 font-bold focus:ring-4 focus:ring-benin-green/10 focus:bg-white outline-none transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-earth-400 uppercase tracking-widest ml-1">Thème / Description</label>
                                <input name="subtitle" required defaultValue={modalMode === 'edit' ? activeProgram?.levels.find(l => l.id === editingLevelId)?.subtitle : ''} className="w-full bg-earth-50 border border-earth-100 rounded-2xl px-5 py-4 text-earth-900 font-bold focus:ring-4 focus:ring-benin-green/10 focus:bg-white outline-none transition-all" />
                            </div>

                            <div className="pt-6 flex items-center gap-4">
                                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-4 bg-earth-50 text-earth-600 font-black rounded-2xl hover:bg-earth-100 transition-all uppercase tracking-widest text-xs">
                                    Annuler
                                </button>
                                <button type="submit" className="flex-1 py-4 bg-benin-green text-white font-black rounded-2xl shadow-brand hover:scale-105 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                                    <Check className="w-4 h-4" />
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
