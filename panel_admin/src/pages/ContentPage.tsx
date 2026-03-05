import { useState } from 'react';
import {
    Book,
    Layers,
    Layout,
    FileText,
    Plus,
    ChevronRight,
    Edit2,
    Trash2,
    ExternalLink,
    Search,
    Filter,
    Gamepad2,
    X,
    Check,
    AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';

// Types
interface Lesson {
    id: string;
    title: string;
    type: string;
    status: string;
    xpReward: number;
}

interface Unit {
    id: string;
    title: string;
    description: string;
    lessons: Lesson[];
}

interface Level {
    id: string;
    title: string;
    subtitle: string;
    units: Unit[];
}

interface Program {
    id: string;
    title: string;
    sourceLang: string;
    targetLang: string;
    levels: Level[];
}

interface Category {
    id: string;
    title: string;
    emoji: string;
    color: string;
}

// Mock Data
const MOCK_DATA: Program[] = [
    {
        id: 'fon-fr',
        title: 'Français -> Fon',
        sourceLang: 'fr',
        targetLang: 'fon',
        levels: [
            {
                id: 'lv0',
                title: "Niveau 0",
                subtitle: "Immersion Orale",
                units: [
                    {
                        id: "u0_1",
                        title: "Premiers Mots",
                        description: "Comprendre sans lire. 100% Audio.",
                        lessons: [
                            { id: 'l0_1_1', title: 'Bonjour !', type: 'vocab', status: 'completed', xpReward: 100 },
                            { id: 'l0_1_2', title: 'Oui / Non', type: 'vocab', status: 'completed', xpReward: 100 },
                        ]
                    }
                ]
            }
        ]
    }
];

const MOCK_CATEGORIES: Category[] = [
    { id: 'alphabet', title: 'Alphabet', color: 'bg-purple-500', emoji: '🅰️' },
    { id: 'numbers', title: 'Chiffres', color: 'bg-green-500', emoji: '1️⃣' },
    { id: 'colors', title: 'Couleurs', color: 'bg-orange-500', emoji: '🎨' },
    { id: 'animals', title: 'Animaux', color: 'bg-red-500', emoji: '🦁' },
];

type ModalType = 'program' | 'level' | 'unit' | 'lesson' | 'category' | null;

export default function ContentPage() {
    // State
    const [programs, setPrograms] = useState<Program[]>(MOCK_DATA);
    const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
    const [activeTab, setActiveTab] = useState<'courses' | 'games'>('courses');
    const [activeProgramId, setActiveProgramId] = useState<string | null>(programs[0].id);
    const [activeLevelId, setActiveLevelId] = useState<string | null>(programs[0].levels[0]?.id || null);

    // Modal State
    const [modalConfig, setModalConfig] = useState<{
        type: ModalType,
        mode: 'add' | 'edit',
        targetId?: string,
        parentId?: string // For level/unit/lesson
    }>({ type: null, mode: 'add' });

    // Computed Active Objects
    const activeProgram = programs.find(p => p.id === activeProgramId) || null;
    const activeLevel = activeProgram?.levels.find(l => l.id === activeLevelId) || null;

    // --- CRUD Handlers ---

    const handleDelete = (type: ModalType, id: string, parentId?: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;

        if (type === 'program') {
            setPrograms(programs.filter(p => p.id !== id));
            if (activeProgramId === id) setActiveProgramId(null);
        } else if (type === 'level') {
            setPrograms(programs.map(p => ({
                ...p,
                levels: p.levels.filter(l => l.id !== id)
            })));
            if (activeLevelId === id) setActiveLevelId(null);
        } else if (type === 'unit') {
            setPrograms(programs.map(p => ({
                ...p,
                levels: p.levels.map(l => ({
                    ...l,
                    units: l.units.filter(u => u.id !== id)
                }))
            })));
        } else if (type === 'lesson') {
            setPrograms(programs.map(p => ({
                ...p,
                levels: p.levels.map(l => ({
                    ...l,
                    units: l.units.map(u => ({
                        ...u,
                        lessons: u.lessons.filter(less => less.id !== id)
                    }))
                }))
            })));
        } else if (type === 'category') {
            setCategories(categories.filter(c => c.id !== id));
        }
    };

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        const { type, mode, targetId, parentId } = modalConfig;

        if (type === 'program') {
            if (mode === 'add') {
                const newProg: Program = {
                    id: `prog-${Date.now()}`,
                    title: data.title as string,
                    sourceLang: 'fr',
                    targetLang: 'fon',
                    levels: []
                };
                setPrograms([...programs, newProg]);
            } else {
                setPrograms(programs.map(p => p.id === targetId ? { ...p, title: data.title as string } : p));
            }
        } else if (type === 'level') {
            if (mode === 'add') {
                const newLevel: Level = {
                    id: `lv-${Date.now()}`,
                    title: data.title as string,
                    subtitle: data.subtitle as string,
                    units: []
                };
                setPrograms(programs.map(p => p.id === activeProgramId ? { ...p, levels: [...p.levels, newLevel] } : p));
            } else {
                setPrograms(programs.map(p => ({
                    ...p,
                    levels: p.levels.map(l => l.id === targetId ? { ...l, title: data.title as string, subtitle: data.subtitle as string } : l)
                })));
            }
        } else if (type === 'unit') {
            if (mode === 'add') {
                const newUnit: Unit = {
                    id: `u-${Date.now()}`,
                    title: data.title as string,
                    description: data.description as string,
                    lessons: []
                };
                setPrograms(programs.map(p => ({
                    ...p,
                    levels: p.levels.map(l => l.id === activeLevelId ? { ...l, units: [...l.units, newUnit] } : l)
                })));
            } else {
                setPrograms(programs.map(p => ({
                    ...p,
                    levels: p.levels.map(l => ({
                        ...l,
                        units: l.units.map(u => u.id === targetId ? { ...u, title: data.title as string, description: data.description as string } : u)
                    }))
                })));
            }
        } else if (type === 'lesson') {
            if (mode === 'add') {
                const newLesson: Lesson = {
                    id: `l-${Date.now()}`,
                    title: data.title as string,
                    type: data.type as string,
                    status: 'available',
                    xpReward: parseInt(data.xpReward as string) || 100
                };
                setPrograms(programs.map(p => ({
                    ...p,
                    levels: p.levels.map(l => ({
                        ...l,
                        units: l.units.map(u => u.id === parentId ? { ...u, lessons: [...u.lessons, newLesson] } : u)
                    }))
                })));
            } else {
                setPrograms(programs.map(p => ({
                    ...p,
                    levels: p.levels.map(l => ({
                        ...l,
                        units: l.units.map(u => ({
                            ...u,
                            lessons: u.lessons.map(less => less.id === targetId ? {
                                ...less,
                                title: data.title as string,
                                type: data.type as string,
                                xpReward: parseInt(data.xpReward as string) || 100
                            } : less)
                        }))
                    }))
                })));
            }
        } else if (type === 'category') {
            if (mode === 'add') {
                const colors = ['bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-red-500', 'bg-blue-500', 'bg-rose-500'];
                const newCat: Category = {
                    id: `cat-${Date.now()}`,
                    title: data.title as string,
                    emoji: data.emoji as string || '🎮',
                    color: colors[Math.floor(Math.random() * colors.length)]
                };
                setCategories([...categories, newCat]);
            } else {
                setCategories(categories.map(c => c.id === targetId ? { ...c, title: data.title as string, emoji: data.emoji as string } : c));
            }
        }

        closeModal();
    };

    const openModal = (type: ModalType, mode: 'add' | 'edit', targetId?: string, parentId?: string) => {
        setModalConfig({ type, mode, targetId, parentId });
    };

    const closeModal = () => {
        setModalConfig({ type: null, mode: 'add' });
    };

    // --- Renderers ---

    const renderModal = () => {
        if (!modalConfig.type) return null;

        const { type, mode, targetId } = modalConfig;
        let title = '';
        let initialData: any = {};

        if (type === 'program') {
            title = mode === 'add' ? 'Nouveau Programme' : 'Modifier le Programme';
            if (mode === 'edit') initialData = programs.find(p => p.id === targetId);
        } else if (type === 'level') {
            title = mode === 'add' ? 'Nouveau Niveau' : 'Modifier le Niveau';
            if (mode === 'edit') initialData = activeProgram?.levels.find(l => l.id === targetId);
        } else if (type === 'unit') {
            title = mode === 'add' ? 'Nouvelle Unité' : 'Modifier l\'Unité';
            if (mode === 'edit') initialData = activeLevel?.units.find(u => u.id === targetId);
        } else if (type === 'lesson') {
            title = mode === 'add' ? 'Nouvelle Leçon' : 'Modifier la Leçon';
            if (mode === 'edit') {
                activeLevel?.units.forEach(u => {
                    const found = u.lessons.find(less => less.id === targetId);
                    if (found) initialData = found;
                });
            }
        } else if (type === 'category') {
            title = mode === 'add' ? 'Nouvelle Thématique' : 'Modifier la Thématique';
            if (mode === 'edit') initialData = categories.find(c => c.id === targetId);
        }

        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-earth-900/60 backdrop-blur-md animate-in fade-in duration-300">
                <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-earth-100">
                    <div className="p-8 border-b border-earth-100 flex items-center justify-between bg-earth-50/30">
                        <h3 className="text-2xl font-black text-earth-900 tracking-tight uppercase">{title}</h3>
                        <button onClick={closeModal} className="p-2 hover:bg-white rounded-xl transition-colors text-earth-400 hover:text-earth-900 border border-transparent hover:border-earth-100 shadow-sm">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSave} className="p-8 space-y-6">
                        {type === 'category' ? (
                            <div className="grid grid-cols-4 gap-4">
                                <div className="col-span-1 space-y-2">
                                    <label className="text-xs font-black text-earth-400 uppercase tracking-widest ml-1">Icône</label>
                                    <input name="emoji" required defaultValue={initialData.emoji || '🎮'} className="w-full bg-earth-50 border border-earth-100 rounded-2xl px-5 py-4 text-earth-900 font-bold text-center focus:ring-4 focus:ring-benin-green/10 focus:bg-white outline-none transition-all" />
                                </div>
                                <div className="col-span-3 space-y-2">
                                    <label className="text-xs font-black text-earth-400 uppercase tracking-widest ml-1">Nom du Thème</label>
                                    <input name="title" required defaultValue={initialData.title} className="w-full bg-earth-50 border border-earth-100 rounded-2xl px-5 py-4 text-earth-900 font-bold focus:ring-4 focus:ring-benin-green/10 focus:bg-white outline-none transition-all" placeholder="Ex: Animaux, Fruits..." />
                                </div>
                            </div>
                        ) : (
                            <>
                                {type === 'program' && (
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-earth-400 uppercase tracking-widest ml-1">Titre du Programme</label>
                                        <input name="title" required defaultValue={initialData.title} className="w-full bg-earth-50 border border-earth-100 rounded-2xl px-5 py-4 text-earth-900 font-bold focus:ring-4 focus:ring-benin-green/10 focus:bg-white outline-none transition-all" placeholder="Ex: Français -> Yoruba" />
                                    </div>
                                )}

                                {type === 'level' && (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-earth-400 uppercase tracking-widest ml-1">Titre (ex: Niveau 1)</label>
                                            <input name="title" required defaultValue={initialData.title} className="w-full bg-earth-50 border border-earth-100 rounded-2xl px-5 py-4 text-earth-900 font-bold focus:ring-4 focus:ring-benin-green/10 focus:bg-white outline-none transition-all" placeholder="Niveau X" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-earth-400 uppercase tracking-widest ml-1">Sous-titre / Thème</label>
                                            <input name="subtitle" required defaultValue={initialData.subtitle} className="w-full bg-earth-50 border border-earth-100 rounded-2xl px-5 py-4 text-earth-900 font-bold focus:ring-4 focus:ring-benin-green/10 focus:bg-white outline-none transition-all" placeholder="Introduction à..." />
                                        </div>
                                    </>
                                )}

                                {type === 'unit' && (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-earth-400 uppercase tracking-widest ml-1">Titre de l'Unité</label>
                                            <input name="title" required defaultValue={initialData.title} className="w-full bg-earth-50 border border-earth-100 rounded-2xl px-5 py-4 text-earth-900 font-bold focus:ring-4 focus:ring-benin-green/10 focus:bg-white outline-none transition-all" placeholder="Salutations, Famille..." />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-earth-400 uppercase tracking-widest ml-1">Description courte</label>
                                            <textarea name="description" required defaultValue={initialData.description} className="w-full bg-earth-50 border border-earth-100 rounded-2xl px-5 py-4 text-earth-900 font-bold focus:ring-4 focus:ring-benin-green/10 focus:bg-white outline-none transition-all min-h-[100px]" placeholder="Ce que l'apprenant va apprendre..." />
                                        </div>
                                    </>
                                )}

                                {type === 'lesson' && (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-earth-400 uppercase tracking-widest ml-1">Titre de la Leçon</label>
                                            <input name="title" required defaultValue={initialData.title} className="w-full bg-earth-50 border border-earth-100 rounded-2xl px-5 py-4 text-earth-900 font-bold focus:ring-4 focus:ring-benin-green/10 focus:bg-white outline-none transition-all" placeholder="Bonjour / Bonsoir" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-earth-400 uppercase tracking-widest ml-1">Type</label>
                                                <select name="type" defaultValue={initialData.type || 'vocab'} className="w-full bg-earth-50 border border-earth-100 rounded-2xl px-5 py-4 text-earth-900 font-bold focus:ring-4 focus:ring-benin-green/10 focus:bg-white outline-none transition-all">
                                                    <option value="vocab">Vocabulaire</option>
                                                    <option value="grammar">Grammaire</option>
                                                    <option value="practice">Pratique</option>
                                                    <option value="quiz">Quiz</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-earth-400 uppercase tracking-widest ml-1">Reward (XP)</label>
                                                <input name="xpReward" type="number" defaultValue={initialData.xpReward || 100} className="w-full bg-earth-50 border border-earth-100 rounded-2xl px-5 py-4 text-earth-900 font-bold focus:ring-4 focus:ring-benin-green/10 focus:bg-white outline-none transition-all" />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                        <div className="pt-6 flex items-center gap-4">
                            <button type="button" onClick={closeModal} className="flex-1 py-4 bg-earth-50 text-earth-600 font-black rounded-2xl hover:bg-earth-100 transition-all uppercase tracking-widest text-xs">
                                Annuler
                            </button>
                            <button type="submit" className="flex-1 py-4 bg-benin-green text-white font-black rounded-2xl shadow-brand hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                                <Check className="w-4 h-4" />
                                Enregistrer
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {renderModal()}

            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-extrabold text-earth-900 tracking-tight">Gestion du Contenu</h2>
                    <p className="text-earth-500 mt-1 text-lg">Gérez les programmes d'apprentissage et les jeux éducatifs.</p>
                </div>
                <div className="flex bg-earth-50 p-1.5 rounded-2xl border border-earth-100 shadow-sm">
                    <button
                        onClick={() => setActiveTab('courses')}
                        className={cn(
                            "px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2",
                            activeTab === 'courses' ? "bg-white text-benin-green shadow-md" : "text-earth-400 hover:text-earth-600"
                        )}
                    >
                        <Book className="w-4 h-4" />
                        Cours
                    </button>
                    <button
                        onClick={() => setActiveTab('games')}
                        className={cn(
                            "px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2",
                            activeTab === 'games' ? "bg-white text-benin-green shadow-md" : "text-earth-400 hover:text-earth-600"
                        )}
                    >
                        <Gamepad2 className="w-4 h-4" />
                        Jeux
                    </button>
                </div>
            </div>

            {activeTab === 'courses' ? (
                /* Courses Hierarchy View */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Hierarchy Nav (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Programs List */}
                        <div className="bg-white rounded-[2.5rem] border border-earth-100 shadow-card overflow-hidden">
                            <div className="p-6 border-b border-earth-100 bg-earth-50/50 flex items-center justify-between">
                                <h3 className="font-black text-earth-900 uppercase tracking-tighter text-sm">Programmes</h3>
                                <button
                                    onClick={() => openModal('program', 'add')}
                                    className="p-1.5 bg-benin-green/10 text-benin-green rounded-lg hover:bg-benin-green/20 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="p-4 space-y-2">
                                {programs.map(prog => (
                                    <div key={prog.id} className="group relative">
                                        <button
                                            onClick={() => {
                                                setActiveProgramId(prog.id);
                                                setActiveLevelId(prog.levels[0]?.id || null);
                                            }}
                                            className={cn(
                                                "w-full flex items-center justify-between p-4 rounded-2xl transition-all text-left",
                                                activeProgramId === prog.id
                                                    ? "bg-benin-green text-white shadow-brand"
                                                    : "hover:bg-earth-50 text-earth-600"
                                            )}
                                        >
                                            <span className="font-bold">{prog.title}</span>
                                            <ChevronRight className={cn("w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity", activeProgramId === prog.id && "opacity-100")} />
                                        </button>
                                        <div className={cn(
                                            "absolute right-10 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
                                            activeProgramId === prog.id && "hidden"
                                        )}>
                                            <button onClick={() => openModal('program', 'edit', prog.id)} className="p-1.5 hover:bg-white rounded-lg text-earth-400 hover:text-benin-green transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                                            <button onClick={() => handleDelete('program', prog.id)} className="p-1.5 hover:bg-white rounded-lg text-earth-400 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Levels List */}
                        {activeProgram && (
                            <div className="bg-white rounded-[2.5rem] border border-earth-100 shadow-card overflow-hidden">
                                <div className="p-6 border-b border-earth-100 bg-earth-50/50 flex items-center justify-between">
                                    <h3 className="font-black text-earth-900 uppercase tracking-tighter text-sm">Niveaux</h3>
                                    <button
                                        onClick={() => openModal('level', 'add')}
                                        className="p-1.5 bg-benin-green/10 text-benin-green rounded-lg hover:bg-benin-green/20 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="p-4 space-y-2">
                                    {activeProgram.levels.map(level => (
                                        <div key={level.id} className="group relative">
                                            <button
                                                onClick={() => setActiveLevelId(level.id)}
                                                className={cn(
                                                    "w-full flex items-center justify-between p-4 rounded-2xl transition-all text-left",
                                                    activeLevelId === level.id
                                                        ? "bg-earth-900 text-white"
                                                        : "hover:bg-earth-50 text-earth-600"
                                                )}
                                            >
                                                <div>
                                                    <p className="font-bold text-sm tracking-tight">{level.title}</p>
                                                    <p className={cn("text-[10px] font-bold uppercase", activeLevelId === level.id ? "text-white/60" : "text-earth-400")}>{level.subtitle}</p>
                                                </div>
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                            <div className={cn(
                                                "absolute right-10 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
                                                activeLevelId === level.id && "hidden"
                                            )}>
                                                <button onClick={() => openModal('level', 'edit', level.id)} className="p-1.5 hover:bg-white rounded-lg text-earth-400 hover:text-benin-green transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                                                <button onClick={() => handleDelete('level', level.id)} className="p-1.5 hover:bg-white rounded-lg text-earth-400 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Units & Lessons List (8 cols) */}
                    <div className="lg:col-span-8 space-y-6">
                        {activeLevel ? (
                            <div className="bg-white rounded-[2.5rem] border border-earth-100 shadow-card overflow-hidden min-h-[600px]">
                                <div className="p-8 border-b border-earth-100 flex items-center justify-between bg-white sticky top-0 z-10 shadow-sm">
                                    <div>
                                        <div className="flex items-center gap-2 text-earth-400 text-[10px] font-black uppercase tracking-widest mb-1">
                                            <span>{activeProgram?.title}</span>
                                            <ChevronRight className="w-3 h-3" />
                                            <span className="text-benin-green">{activeLevel.title}</span>
                                        </div>
                                        <h3 className="text-2xl font-black text-earth-900 tracking-tighter">Unités d'apprentissage</h3>
                                    </div>
                                    <button
                                        onClick={() => openModal('unit', 'add')}
                                        className="flex items-center gap-2 px-6 py-3 bg-benin-green text-white font-bold rounded-2xl shadow-brand hover:scale-105 transition-all text-sm uppercase tracking-widest"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Nouvelle Unité
                                    </button>
                                </div>

                                <div className="p-8 space-y-8">
                                    {activeLevel.units.length > 0 ? (
                                        activeLevel.units.map(unit => (
                                            <div key={unit.id} className="border border-earth-100 rounded-[2rem] overflow-hidden hover:border-benin-green/30 transition-all shadow-sm hover:shadow-md bg-white group/unit">
                                                <div className="p-6 bg-earth-50/50 flex items-center justify-between border-b border-earth-100">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-14 h-14 bg-white rounded-2xl border border-earth-100 flex items-center justify-center text-2xl shadow-sm group-hover/unit:rotate-3 transition-transform">
                                                            📦
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-earth-900 text-lg tracking-tight">{unit.title}</h4>
                                                            <p className="text-earth-500 text-sm">{unit.description}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => openModal('unit', 'edit', unit.id)} className="p-3 text-earth-400 hover:text-benin-green hover:bg-white rounded-xl transition-all border border-transparent hover:border-earth-100 shadow-sm">
                                                            <Edit2 className="w-5 h-5" />
                                                        </button>
                                                        <button onClick={() => handleDelete('unit', unit.id)} className="p-3 text-earth-400 hover:text-red-500 hover:bg-white rounded-xl transition-all border border-transparent hover:border-earth-100 shadow-sm">
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white">
                                                    {unit.lessons.map(lesson => (
                                                        <div key={lesson.id} className="flex items-center justify-between p-5 bg-earth-50/50 rounded-2xl group/lesson border border-transparent hover:border-benin-green/20 hover:bg-white transition-all shadow-sm relative">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-benin-green shadow-sm group-hover/lesson:scale-110 transition-transform">
                                                                    <FileText className="w-6 h-6" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-earth-900 text-sm tracking-tight">{lesson.title}</p>
                                                                    <p className="text-[10px] text-earth-400 font-black uppercase tracking-widest leading-none mt-1">{lesson.type} • {lesson.xpReward} XP</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-1 opacity-0 group-hover/lesson:opacity-100 transition-all uppercase tracking-tighter">
                                                                <button onClick={() => openModal('lesson', 'edit', lesson.id)} className="p-2 text-earth-400 hover:text-benin-green transition-colors"><Edit2 className="w-4 h-4" /></button>
                                                                <button onClick={() => handleDelete('lesson', lesson.id)} className="p-2 text-earth-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <button
                                                        onClick={() => openModal('lesson', 'add', undefined, unit.id)}
                                                        className="flex items-center justify-center gap-3 p-5 border-2 border-dashed border-earth-100 rounded-2xl text-earth-400 font-black text-[10px] uppercase tracking-widest hover:border-benin-green/50 hover:text-benin-green hover:bg-benin-green/5 transition-all"
                                                    >
                                                        <Plus className="w-5 h-5" />
                                                        Nouvelle leçon
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-20 bg-earth-50/30 rounded-[2rem] border border-dashed border-earth-100">
                                            <div className="w-24 h-24 bg-white rounded-[2rem] shadow-sm flex items-center justify-center mx-auto mb-6 text-4xl">
                                                📭
                                            </div>
                                            <h4 className="text-xl font-black text-earth-900 mb-2 uppercase tracking-tighter">C'est le vide intersidéral !</h4>
                                            <p className="text-earth-500 max-w-xs mx-auto mb-8 font-medium">Commencez par ajouter une unité d'apprentissage pour ce niveau.</p>
                                            <button
                                                onClick={() => openModal('unit', 'add')}
                                                className="px-8 py-4 bg-benin-green text-white font-black rounded-2xl shadow-brand hover:scale-105 transition-all text-xs uppercase tracking-widest"
                                            >
                                                Créer une unité
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full bg-white rounded-[2.5rem] border border-earth-100 shadow-card flex flex-col items-center justify-center p-20 text-center min-h-[600px]">
                                <div className="w-28 h-28 bg-earth-50 rounded-[2.5rem] flex items-center justify-center mb-8 text-5xl shadow-inner animate-pulse">
                                    👈
                                </div>
                                <h3 className="text-3xl font-black text-earth-900 tracking-tighter mb-4 uppercase">Sélectionnez un niveau</h3>
                                <p className="text-earth-500 max-w-sm mx-auto text-lg leading-relaxed font-medium">
                                    Choisissez un programme et un niveau dans le menu latéral pour commencer à gérer le contenu pédagogique et animer vos cours !
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* Games Categories List */
                <div className="animate-in fade-in zoom-in-95 duration-500">
                    <div className="bg-white rounded-[3rem] border border-earth-100 shadow-brand overflow-hidden">
                        <div className="p-10 border-b border-earth-100 flex items-center justify-between bg-white relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-3xl font-black text-earth-900 tracking-tighter uppercase">Ateliers de Jeux</h3>
                                <p className="text-earth-500 mt-2 font-medium text-lg">Gérez les thématiques et le contenu interactif des ateliers.</p>
                            </div>
                            <button
                                onClick={() => openModal('category', 'add')}
                                className="relative z-10 flex items-center gap-3 px-8 py-4 bg-benin-green text-white font-black rounded-2xl shadow-brand hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-[10px]"
                            >
                                <Plus className="w-6 h-6" />
                                Nouveau Thème
                            </button>
                            <div className="absolute right-0 top-0 w-80 h-80 bg-benin-yellow/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                        </div>

                        <div className="p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {categories.map(cat => (
                                <div key={cat.id} className="group relative bg-white border border-earth-100 rounded-[2.5rem] p-8 hover:border-benin-green/30 hover:shadow-brand transition-all cursor-pointer">
                                    <div className={cn(
                                        "w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform",
                                        cat.color
                                    )}>
                                        {cat.emoji}
                                    </div>
                                    <h4 className="text-2xl font-black text-earth-900 tracking-tight mb-2 uppercase">{cat.title}</h4>
                                    <p className="text-earth-500 text-sm leading-relaxed mb-8">
                                        Modifiez les paires et le contenu interactif pour cet atelier ludique.
                                    </p>

                                    <div className="flex items-center gap-3 pt-6 border-t border-earth-50">
                                        <button onClick={() => openModal('category', 'edit', cat.id)} className="flex-1 py-3 bg-earth-50 text-earth-900 font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-earth-900 hover:text-white transition-all">Gérer le Thème</button>
                                        <button onClick={() => handleDelete('category', cat.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100">
                                            <Trash2 className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Empty/Add Slot */}
                            <button
                                onClick={() => openModal('category', 'add')}
                                className="flex flex-col items-center justify-center p-8 border-4 border-dashed border-earth-50 rounded-[2.5rem] text-earth-300 group hover:border-benin-green/30 hover:bg-benin-green/5 transition-all min-h-[350px]"
                            >
                                <div className="w-20 h-20 bg-earth-50 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white group-hover:shadow-sm transition-all text-earth-200 group-hover:text-benin-green shadow-inner">
                                    <Plus className="w-10 h-10" />
                                </div>
                                <span className="font-black uppercase tracking-widest text-[10px]">Ajouter un thème</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
