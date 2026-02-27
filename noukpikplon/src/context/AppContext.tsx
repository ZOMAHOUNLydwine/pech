import React, { useContext, useState, ReactNode } from 'react';

export type Language = {
  id: string;
  name: string;
  nativeName?: string;
  flag?: string; // Emoji or url
  isBeninese: boolean;
};

export type Badge = {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedAt?: Date;
};

export type Skill = {
  name: 'Ecoute' | 'Lecture' | 'Expression' | 'Ecriture';
  level: number; // 0-100
};

export type LessonStatus = 'locked' | 'available' | 'in_progress' | 'completed';
export type LessonType = 'vocab' | 'grammar' | 'phonetic' | 'practice' | 'mission' | 'video' | 'music' | 'writing';

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  status: LessonStatus;
  stars?: number;
  xpReward: number;
  textContent?: string;
  mediaUrl?: string;
  imageUrl?: string;
  audioUrl?: string;
  audioDuration?: string;
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  color: string;
  canDo: string[];
  lessons: Lesson[];
}

export interface Level {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  units: Unit[];
  isLocked?: boolean;
}

export interface Program {
  id: string;
  title: string;
  sourceLang: string;
  targetLang: string;
  levels: Level[];
}

export type Quest = Lesson;

export type UserProfile = {
  name: string;
  avatar?: string;
  knownLanguages: string[];
  targetLanguage: string | null;
  learningGoal: string | null;
  learningType: 'heritage' | 'foreign' | null;
  streak: number;
  xp: number;
  badges: Badge[];
  skills: Skill[];
  completedQuests: string[];
  dailyGoal: number | null;
  isAdmin?: boolean;
};

interface AppContextType {
  user: UserProfile;
  programs: Program[];
  activeProgram: Program | null;
  setActiveProgram: (id: string) => void;
  updateProgram: (program: Program) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  isAuthenticated: boolean;
  login: (role?: 'user' | 'admin') => void;
  signup: (name: string, email: string, password: string) => void;
  logout: () => void;
  subscribe: () => void;
}

const defaultUser: UserProfile = {
  name: 'Utilisateur',
  knownLanguages: ['fr'],
  targetLanguage: 'fon',
  learningGoal: null,
  learningType: null,
  streak: 0,
  xp: 0,
  badges: [],
  skills: [],
  completedQuests: [],
  dailyGoal: null,
  isAdmin: false,
};

const MOCK_PROGRAMS: Program[] = [
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
        color: "bg-emerald-500",
        isLocked: false,
        units: [
          {
            id: "u0_1",
            title: "Premiers Mots",
            description: "Comprendre sans lire. 100% Audio.",
            color: "bg-emerald-100 text-emerald-800",
            canDo: ["Comprendre 10 mots", "Saluer"],
            lessons: [
              { id: 'l0_1_1', title: 'Bonjour !', type: 'vocab', status: 'completed', stars: 3, xpReward: 100, audioUrl: "/audio/salutations.mp3", audioDuration: "3:45" },
              { id: 'l0_1_2', title: 'Oui / Non', type: 'vocab', status: 'completed', stars: 2, xpReward: 100 },
              { id: 'l0_1_3', title: 'Ça va ?', type: 'practice', status: 'available', stars: 0, xpReward: 150 },
            ]
          }
        ]
      }
    ]
  }
];


const AppContext = React.createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : defaultUser;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('user');
  });
  const [programs, setPrograms] = useState<Program[]>(MOCK_PROGRAMS);
  const [activeProgramId, setActiveProgramId] = useState<string>('fon-fr');

  const activeProgram = programs.find(p => p.id === activeProgramId) || programs[0];

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updates };
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    });
  };

  const updateProgram = (updatedProgram: Program) => {
    setPrograms(prev => prev.map(p => p.id === updatedProgram.id ? updatedProgram : p));
  };

  const login = (role?: 'user' | 'admin') => {
    // Mock login logic
    const loggedInUser = {
      ...user,
      name: role === 'admin' ? 'Admin' : (user.name || 'Utilisateur'),
      isAdmin: role === 'admin'
    };
    setUser(loggedInUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
  };

  const signup = (name: string, email: string, password: string) => {
    // Mock signup logic
    const newUser = { ...defaultUser, name, email };
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const subscribe = () => {
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);

    setUser((prev) => {
      const newUser = {
        ...prev,
        isPremium: true,
      };
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(defaultUser);
    localStorage.removeItem('user');
  };

  return (
    <AppContext.Provider value={{
      user,
      programs,
      activeProgram,
      setActiveProgram: setActiveProgramId,
      updateProgram,
      updateUser,
      isAuthenticated,
      login,
      signup,
      logout,
      subscribe
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const LANGUAGES: Language[] = [
  { id: 'fr', name: 'Français', isBeninese: false, flag: '🇫🇷' },
  { id: 'en', name: 'English', isBeninese: false, flag: '🇬🇧' },
  { id: 'es', name: 'Español', isBeninese: false, flag: '🇪🇸' },
  { id: 'fon', name: 'Fon', nativeName: 'Fɔngbè', isBeninese: true, flag: '🇧🇯' },
  { id: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', isBeninese: true, flag: '🇧🇯' }, // Also Nago
  { id: 'goun', name: 'Goun', nativeName: 'Gungbe', isBeninese: true, flag: '🇧🇯' },
  { id: 'bariba', name: 'Bariba', nativeName: 'Baatɔnum', isBeninese: true, flag: '🇧🇯' },
  { id: 'dendi', name: 'Dendi', nativeName: 'Dendi', isBeninese: true, flag: '🇧🇯' },
  { id: 'adja', name: 'Adja', nativeName: 'Ajagbe', isBeninese: true, flag: '🇧🇯' },
  { id: 'ditammari', name: 'Ditammari', nativeName: 'Ditammari', isBeninese: true, flag: '🇧🇯' },
  { id: 'mina', name: 'Mina', nativeName: 'Gen', isBeninese: true, flag: '🇹🇬' }, // Togo/Benin
  { id: 'anii', name: 'Anii', nativeName: 'Anii', isBeninese: true, flag: '🇧🇯' },
  { id: 'fulfulde', name: 'Fulfulde', nativeName: 'Peul', isBeninese: true, flag: '🇧🇯' },
  { id: 'mahi', name: 'Mahi', nativeName: 'Maxí', isBeninese: true, flag: '🇧🇯' },
  { id: 'idaatcha', name: 'Idaatcha', nativeName: 'Idaatcha', isBeninese: true, flag: '🇧🇯' },
  { id: 'ife', name: 'Ifè', nativeName: 'Ifè', isBeninese: true, flag: '🇧🇯' },
  { id: 'waama', name: 'Waama', nativeName: 'Waama', isBeninese: true, flag: '🇧🇯' },
  { id: 'tem', name: 'Tem', nativeName: 'Kotokoli', isBeninese: true, flag: '🇧🇯' }, // Tchamba
];
