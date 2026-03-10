import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';

export interface Lesson {
  id: string | number;
  title: string;
  type: string;
  status: 'completed' | 'available' | 'locked';
  stars?: number;
  xpReward: number;
  audioUrl?: string;
  audioDuration?: string;
}

export interface Unit {
  id: string | number;
  title: string;
  description: string;
  color: string;
  canDo: string[];
  lessons: Lesson[];
  spiralReview?: string[];
}

export interface Level {
  id: string | number;
  title: string;
  subtitle: string;
  color: string;
  isLocked: boolean;
  units: Unit[];
}

export interface Program {
  id: string | number;
  title: string;
  sourceLang: string;
  targetLang: string;
  levels: Level[];
}

export interface UserProfile {
  name: string;
  avatar?: string;
  knownLanguages: string[];
  targetLanguage: string | null;
  learningGoal: string | null;
  learningType: 'heritage' | 'foreign' | null;
  streak: number;
  xp: number;
  badges: string[];
  skills: string[];
  completedQuests: string[];
  dailyGoal: number | null;
  currentLevel?: string;
  isAdmin: boolean;
  email: string;
  notifications: boolean;
  reminders: boolean;
  reminderTime: string;
  subscriptionExpiry?: string;
}

export interface AppContextType {
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => Promise<void>;
  programs: Program[];
  activeProgram: Program | null;
  setActiveProgram: (id: string | number) => void;
  updateProgram: (program: Program) => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<any>;
  signup: (name: string, email: string, password: string) => Promise<any>;
  verifyOTP: (email: string, code: string) => Promise<any>;
  resendOTP: (email: string) => Promise<any>;
  logout: () => void;
  completeLesson: (lessonId: number, stars: number) => Promise<void>;
  loading: boolean;
}

export const LANGUAGES = [
  { id: 'fon', name: 'Fon', nativeName: 'Fɔ̀ngbe', flag: '🇧🇯' },
  { id: 'yor', name: 'Yoruba', nativeName: 'Yorùbá', flag: '🇳🇬' },
  { id: 'dendi', name: 'Dendi', nativeName: 'Dendi', flag: '🇧🇯' },
  { id: 'mina', name: 'Mina', nativeName: 'Gɛ̀ngbe', flag: '🇹🇬' },
  { id: 'fr', name: 'Français', nativeName: 'Français', flag: '🇫🇷' },
];

const defaultUser: UserProfile = {
  name: "Utilisateur",
  knownLanguages: ['fr'],
  targetLanguage: null,
  learningGoal: null,
  learningType: null,
  streak: 0,
  xp: 0,
  badges: [],
  skills: [],
  completedQuests: [],
  dailyGoal: null,
  isAdmin: false,
  email: "",
  notifications: true,
  reminders: true,
  reminderTime: "20:00",
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : defaultUser;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [activeProgramId, setActiveProgramId] = useState<string | number | null>(null);

  const mapApiUser = (data: any): UserProfile => {
    return {
      name: data.name,
      avatar: data.avatar ?? undefined,
      knownLanguages: ['fr'],
      targetLanguage: data.target_language ?? null,
      learningGoal: data.learning_goal ?? null,
      learningType: data.learning_type ?? null,
      streak: data.streak ?? 0,
      xp: data.xp ?? 0,
      badges: [],
      skills: [],
      completedQuests: JSON.parse(data.completed_quests || '[]'),
      dailyGoal: data.daily_goal ?? null,
      isAdmin: data.role === 'admin',
      email: data.email,
      notifications: data.notifications ?? true,
      reminders: data.reminders ?? true,
      reminderTime: data.reminder_time ?? "20:00",
      subscriptionExpiry: data.subscription_expiry ?? undefined,
    };
  };

  const fetchPrograms = async () => {
    try {
      const response = await api.get('/content/programs');
      const mapped = response.data.map((cat: any) => ({
        id: cat.id,
        title: cat.title,
        sourceLang: cat.source_lang,
        targetLang: cat.target_lang,
        levels: cat.levels.map((lvl: any) => ({
          id: lvl.id,
          title: lvl.title,
          subtitle: lvl.subtitle,
          color: lvl.color,
          isLocked: lvl.is_locked,
          units: lvl.units.map((u: any) => ({
            id: u.id,
            title: u.title,
            description: u.description,
            color: u.color,
            canDo: [],
            lessons: u.lessons.map((l: any) => ({
              id: l.id,
              title: l.title,
              type: l.lesson_type,
              status: l.status,
              stars: l.stars,
              xpReward: l.xp_reward,
              audioUrl: l.audio_url,
              audioDuration: l.audio_duration
            }))
          }))
        }))
      }));
      setPrograms(mapped);
      if (mapped.length > 0 && !activeProgramId) {
        setActiveProgramId(mapped[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch programs:", error);
    }
  };

  useEffect(() => {
    const initData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/users/me');
          const mapped = mapApiUser(response.data);
          setUser(mapped);
          localStorage.setItem('user', JSON.stringify(mapped));
          setIsAuthenticated(true);
          await fetchPrograms();
        } catch (error) {
          console.error("Failed to fetch user:", error);
          logout();
        }
      } else {
        setLoading(false);
      }
      setLoading(false);
    };
    initData();
  }, [isAuthenticated]);

  const activeProgram = programs.find(p => p.id === activeProgramId) || programs[0] || null;

  const updateUser = async (updates: Partial<UserProfile>) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updates };
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    });

    if (isAuthenticated) {
      try {
        const apiUpdates: any = {};
        if (updates.name) apiUpdates.name = updates.name;
        if (updates.email) apiUpdates.email = updates.email;
        if (updates.avatar) apiUpdates.avatar = updates.avatar;
        if (updates.targetLanguage) apiUpdates.target_language = updates.targetLanguage;
        if (updates.learningGoal) apiUpdates.learning_goal = updates.learningGoal;
        if (updates.learningType) apiUpdates.learning_type = updates.learningType;
        if (updates.dailyGoal) apiUpdates.daily_goal = updates.dailyGoal;
        if (updates.notifications !== undefined) apiUpdates.notifications = updates.notifications;
        if (updates.reminders !== undefined) apiUpdates.reminders = updates.reminders;
        if (updates.reminderTime) apiUpdates.reminder_time = updates.reminderTime;

        if (Object.keys(apiUpdates).length > 0) {
          await api.patch('/users/me', apiUpdates);
        }
      } catch (error) {
        console.error("Failed to sync user profile with API:", error);
      }
    }
  };

  const updateProgram = (updatedProgram: Program) => {
    setPrograms(prev => prev.map(p => p.id === updatedProgram.id ? updatedProgram : p));
  };

  const login = async (email: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const { access_token } = response.data;
    localStorage.setItem('token', access_token);
    setIsAuthenticated(true);

    const userResponse = await api.get('/users/me');
    const mapped = mapApiUser(userResponse.data);
    setUser(mapped);
    localStorage.setItem('user', JSON.stringify(mapped));
    return mapped;
  };

  const signup = async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/signup', { name, email, password });
    return response.data;
  };

  const verifyOTP = async (email: string, otp_code: string) => {
    const response = await api.post('/auth/verify-otp', { email, otp_code });
    return response.data;
  };

  const resendOTP = async (email: string) => {
    const response = await api.post('/auth/resend-otp', { email });
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(defaultUser);
    setIsAuthenticated(false);
    setPrograms([]);
  };

  const completeLesson = async (lessonId: number, stars: number) => {
    if (!isAuthenticated) return;
    try {
      const response = await api.post(`/content/lessons/${lessonId}/complete`, { stars });
      const mappedUser = mapApiUser(response.data);
      setUser(mappedUser);
      localStorage.setItem('user', JSON.stringify(mappedUser));
      await fetchPrograms();
    } catch (error) {
      console.error("Failed to complete lesson:", error);
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      updateUser,
      programs,
      activeProgram,
      setActiveProgram: (id) => setActiveProgramId(id),
      updateProgram,
      isAuthenticated,
      login,
      signup,
      verifyOTP,
      resendOTP,
      logout,
      completeLesson,
      loading
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
