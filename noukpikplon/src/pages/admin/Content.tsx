import React, { useState } from 'react';
import {
    Plus, Search, Edit2, Trash2, ChevronRight,
    ChevronDown, Layers, Filter, Eye, Save, X,
    AudioLines, FileText, Layout, ArrowLeft,
    Trophy, BookOpen, Clock, Settings, MoreVertical,
    Music, Video, PenTool, Globe
} from 'lucide-react';
import { useApp, Program, Level, Unit, Lesson, LessonType } from '@/context/AppContext';

const Content: React.FC = () => {
    const { programs, activeProgram, setActiveProgram, updateProgram } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeLevelId, setActiveLevelId] = useState<string>('lv0');
    const [expandedUnits, setExpandedUnits] = useState<string[]>([]);

    // Modals states
    const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
    const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);

    // Forms states
    const [levelForm, setLevelForm] = useState({ title: '', subtitle: '', color: 'bg-emerald-500' });
    const [unitForm, setUnitForm] = useState({ title: '', description: '', color: 'bg-emerald-100 text-emerald-800' });
    const [lessonForm, setLessonForm] = useState({
        title: '',
        type: 'vocab' as LessonType,
        xpReward: 100,
        textContent: '',
        audioDuration: '5 min'
    });

    const [editingId, setEditingId] = useState<string | null>(null);
    const [targetParentId, setTargetParentId] = useState<string | null>(null);

    const levels = activeProgram?.levels || [];
    const activeLevel = levels.find(l => l.id === activeLevelId) || levels[0];

    const toggleUnit = (unitId: string) => {
        setExpandedUnits(prev =>
            prev.includes(unitId) ? prev.filter(id => id !== unitId) : [...prev, unitId]
        );
    };

    const handleSaveLevel = () => {
        if (!activeProgram) return;
        const newLevel: Level = {
            id: editingId || `lv_${Date.now()}`,
            ...levelForm,
            units: editingId ? activeLevel.units : [],
        };

        const newLevels = editingId
            ? levels.map(l => l.id === editingId ? newLevel : l)
            : [...levels, newLevel];

        updateProgram({ ...activeProgram, levels: newLevels });
        setIsLevelModalOpen(false);
        setEditingId(null);
    };

    const handleAddUnit = (levelId: string) => {
        setTargetParentId(levelId);
        setUnitForm({ title: '', description: '', color: 'bg-emerald-100 text-emerald-800' });
        setEditingId(null);
        setIsUnitModalOpen(true);
    };

    const handleSaveUnit = () => {
        if (!activeProgram || !targetParentId) return;
        const newUnit: Unit = {
            id: editingId || `u_${Date.now()}`,
            ...unitForm,
            canDo: [],
            lessons: editingId ? activeLevel.units.find(u => u.id === editingId)?.lessons || [] : [],
        };

        const newLevels = levels.map(l => {
            if (l.id !== targetParentId) return l;
            const newUnits = editingId
                ? l.units.map(u => u.id === editingId ? newUnit : u)
                : [...l.units, newUnit];
            return { ...l, units: newUnits };
        });

        updateProgram({ ...activeProgram, levels: newLevels });
        setIsUnitModalOpen(false);
        setEditingId(null);
    };

    const handleAddLesson = (unitId: string) => {
        setTargetParentId(unitId);
        setLessonForm({ title: '', type: 'vocab', xpReward: 100, textContent: '', audioDuration: '5 min' });
        setEditingId(null);
        setIsLessonModalOpen(true);
    };

    const handleSaveLesson = () => {
        if (!activeProgram || !targetParentId) return;
        const newLesson: Lesson = {
            id: editingId || `l_${Date.now()}`,
            status: 'available',
            ...lessonForm
        };

        const newLevels = levels.map(l => ({
            ...l,
            units: l.units.map(u => {
                if (u.id !== targetParentId) return u;
                const newLessons = editingId
                    ? u.lessons.map(les => les.id === editingId ? newLesson : les)
                    : [...u.lessons, newLesson];
                return { ...u, lessons: newLessons };
            })
        }));

        updateProgram({ ...activeProgram, levels: newLevels });
        setIsLessonModalOpen(false);
        setEditingId(null);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            {/* Header & Program Selector */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center">
                        <Layers className="mr-3 text-purple-600" />
                        Gestion du Curriculum
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-slate-500">Programme :</p>
                        <select
                            value={activeProgram?.id}
                            onChange={(e) => setActiveProgram(e.target.value)}
                            className="bg-slate-100 border-none rounded-lg text-sm font-bold text-purple-600 px-3 py-1 outline-none"
                        >
                            {programs.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                        </select>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-all shadow-sm">
                        <Globe size={18} /> <span>Paires de Langues</span>
                    </button>
                    <button
                        onClick={() => {
                            setEditingId(null);
                            setLevelForm({ title: '', subtitle: '', color: 'bg-emerald-500' });
                            setIsLevelModalOpen(true);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 shadow-md transition-all"
                    >
                        <Plus size={18} /> <span>Nouveau Niveau</span>
                    </button>
                </div>
            </div>

            {/* Level Selector Tabs */}
            <div className="flex space-x-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 w-fit">
                {levels.map(level => (
                    <button
                        key={level.id}
                        onClick={() => setActiveLevelId(level.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeLevelId === level.id
                                ? 'bg-white text-purple-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        {level.title}
                    </button>
                ))}
            </div>

            {/* Level Info Header */}
            {activeLevel && (
                <div className={`p-6 rounded-2xl border border-slate-200 bg-white shadow-sm flex justify-between items-center`}>
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl ${activeLevel.color} flex items-center justify-center text-white shadow-inner`}>
                            <Trophy size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">{activeLevel.subtitle}</h2>
                            <p className="text-sm text-slate-500">{activeLevel.units.length} unités au total</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setEditingId(activeLevel.id);
                            setLevelForm({ title: activeLevel.title, subtitle: activeLevel.subtitle, color: activeLevel.color });
                            setIsLevelModalOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg"
                    >
                        <Edit2 size={18} />
                    </button>
                </div>
            )}

            {/* Units & Lessons Hierarchy */}
            <div className="space-y-4">
                {activeLevel?.units.map((unit, index) => {
                    const isExpanded = expandedUnits.includes(unit.id);

                    return (
                        <div key={unit.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div
                                className="p-5 border-b border-slate-100 flex items-center justify-between cursor-pointer group hover:bg-slate-50/50"
                                onClick={() => toggleUnit(unit.id)}
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${unit.color} text-white`}>
                                        <span className="font-bold">{index + 1}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                            {unit.title}
                                            {isExpanded ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
                                        </h3>
                                        <p className="text-sm text-slate-500 line-clamp-1">{unit.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                                        {unit.lessons.length} Leçons
                                    </span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleAddLesson(unit.id); }}
                                        className="p-2 text-slate-300 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                    >
                                        <Plus size={20} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingId(unit.id);
                                            setTargetParentId(activeLevel.id);
                                            setUnitForm({ title: unit.title, description: unit.description, color: unit.color });
                                            setIsUnitModalOpen(true);
                                        }}
                                        className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={20} />
                                    </button>
                                </div>
                            </div>

                            {isExpanded && (
                                <div className="p-4 bg-slate-50/30 space-y-3">
                                    {unit.lessons.length > 0 ? (
                                        unit.lessons.map((lesson) => (
                                            <div key={lesson.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:border-purple-200 hover:shadow-sm transition-all group">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${lesson.type === 'vocab' ? 'bg-blue-50 text-blue-600' :
                                                            lesson.type === 'grammar' ? 'bg-purple-50 text-purple-600' :
                                                                lesson.type === 'music' ? 'bg-pink-50 text-pink-600' :
                                                                    'bg-emerald-50 text-emerald-600'
                                                        }`}>
                                                        {lesson.type === 'video' ? <Video size={18} /> :
                                                            lesson.type === 'music' ? <Music size={18} /> :
                                                                lesson.type === 'writing' ? <PenTool size={18} /> :
                                                                    <BookOpen size={18} />}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                                            {lesson.title}
                                                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase bg-blue-100 text-blue-700`}>
                                                                {lesson.type}
                                                            </span>
                                                        </h4>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center">
                                                                <Clock size={10} className="mr-1" /> {lesson.audioDuration}
                                                            </span>
                                                            <span className="text-[10px] uppercase font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
                                                                {lesson.xpReward} XP
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => {
                                                            setEditingId(lesson.id);
                                                            setTargetParentId(unit.id);
                                                            setLessonForm({
                                                                title: lesson.title,
                                                                type: lesson.type,
                                                                xpReward: lesson.xpReward,
                                                                textContent: lesson.textContent || '',
                                                                audioDuration: lesson.audioDuration || '5 min'
                                                            });
                                                            setIsLessonModalOpen(true);
                                                        }}
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                                                        <Trash2 size={16} />
                                                    </button>
                                                    <div className="w-px h-6 bg-slate-200 mx-1"></div>
                                                    <button className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg">
                                                        <Eye size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center">
                                            <p className="text-slate-400 text-sm">Aucune leçon dans cette unité.</p>
                                            <button
                                                onClick={() => handleAddLesson(unit.id)}
                                                className="text-purple-600 font-bold text-xs mt-2 hover:underline"
                                            >
                                                Créer la première leçon
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}

                <button
                    onClick={() => handleAddUnit(activeLevel?.id)}
                    className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-purple-300 hover:text-purple-500 hover:bg-purple-50/50 transition-all flex items-center justify-center gap-2 group"
                >
                    <Plus size={20} className="group-hover:scale-110 transition-transform" />
                    Ajouter une nouvelle Unité
                </button>
            </div>

            {/* MODALS */}
            {isLevelModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800">{editingId ? 'Modifier' : 'Nouveau'} Niveau</h3>
                            <button onClick={() => setIsLevelModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Titre (ex: Niveau 1)</label>
                                <input
                                    type="text"
                                    value={levelForm.title}
                                    onChange={e => setLevelForm({ ...levelForm, title: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Sous-titre</label>
                                <input
                                    type="text"
                                    value={levelForm.subtitle}
                                    onChange={e => setLevelForm({ ...levelForm, subtitle: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20"
                                />
                            </div>
                            <button
                                onClick={handleSaveLevel}
                                className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl shadow-lg hover:bg-purple-700"
                            >
                                Enregistrer le Niveau
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isUnitModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800">{editingId ? 'Modifier' : 'Nouvelle'} Unité</h3>
                            <button onClick={() => setIsUnitModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Titre de l'Unité</label>
                                <input
                                    type="text"
                                    value={unitForm.title}
                                    onChange={e => setUnitForm({ ...unitForm, title: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                                <textarea
                                    value={unitForm.description}
                                    onChange={e => setUnitForm({ ...unitForm, description: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl min-h-[100px]"
                                />
                            </div>
                            <button
                                onClick={handleSaveUnit}
                                className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl shadow-lg hover:bg-purple-700"
                            >
                                Enregistrer l'Unité
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isLessonModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800">{editingId ? 'Modifier' : 'Nouvelle'} Leçon</h3>
                            <button onClick={() => setIsLessonModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Titre de la Leçon</label>
                                <input
                                    type="text"
                                    value={lessonForm.title}
                                    onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Type de Contenu</label>
                                    <select
                                        value={lessonForm.type}
                                        onChange={e => setLessonForm({ ...lessonForm, type: e.target.value as LessonType })}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                                    >
                                        <option value="vocab">Vocabulaire</option>
                                        <option value="grammar">Grammaire</option>
                                        <option value="video">Vidéo</option>
                                        <option value="music">Musique</option>
                                        <option value="writing">Écriture</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Récompense XP</label>
                                    <input
                                        type="number"
                                        value={lessonForm.xpReward}
                                        onChange={e => setLessonForm({ ...lessonForm, xpReward: parseInt(e.target.value) })}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Contenu (Texte ou Markdown)</label>
                                <textarea
                                    value={lessonForm.textContent}
                                    onChange={e => setLessonForm({ ...lessonForm, textContent: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl min-h-[120px]"
                                    placeholder="Contenu de la leçon..."
                                />
                            </div>
                            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                                <p className="text-xs font-bold text-purple-700 mb-2 uppercase">Gestion des Médias</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <button className="flex items-center justify-center gap-2 p-2 bg-white border border-purple-200 rounded-lg text-xs font-bold text-purple-600">
                                        <Music size={14} /> Audio
                                    </button>
                                    <button className="flex items-center justify-center gap-2 p-2 bg-white border border-purple-200 rounded-lg text-xs font-bold text-purple-600">
                                        <FileText size={14} /> Image
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={handleSaveLesson}
                                className="w-full py-4 bg-purple-600 text-white font-bold rounded-xl shadow-lg hover:bg-purple-700 transition-all"
                            >
                                Enregistrer la Leçon
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Content;
