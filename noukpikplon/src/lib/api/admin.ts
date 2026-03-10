import api from '../api';

// Interfaces
export interface ChartDataPoint {
    name: string;
    utilisateurs: number;
    sessions: number;
    [key: string]: any;
}

export interface AdminStatsResponse {
    total_users: number;
    new_users_30d: number;
    total_visits: number;
    monthly_revenue: number;
    retention_rate: number;
    chart_data: ChartDataPoint[];
}

export interface AdminUserListItem {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
    xp: number;
    created_at: string;
}

// API Methods
export const getDashboardStats = async (): Promise<AdminStatsResponse> => {
    const response = await api.get('/admin/stats');
    return response.data;
};

export const getUsersList = async (skip: number = 0, limit: number = 50): Promise<AdminUserListItem[]> => {
    const response = await api.get('/admin/users', {
        params: { skip, limit }
    });
    return response.data;
};

export const deleteUser = async (userId: number): Promise<{ message: string }> => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
};

// Content Management Interfaces
export interface LessonData {
    id: number;
    title: string;
    lesson_type: string;
    xp_reward: number;
    audio_url?: string;
    audio_duration?: string;
    order: number;
}

export interface UnitData {
    id: number;
    title: string;
    description?: string;
    color?: string;
    order: number;
    lessons: LessonData[];
}

export interface LevelData {
    id: number;
    title: string;
    subtitle?: string;
    color?: string;
    order: number;
    is_locked: boolean;
    units: UnitData[];
}

export interface ProgramData {
    id: number;
    title: string;
    source_lang: string;
    target_lang: string;
    levels: LevelData[];
}

// Content API Methods
export const getPrograms = async (): Promise<ProgramData[]> => {
    const response = await api.get('/admin/programs');
    return response.data;
};

// Programs
export const createProgram = async (data: any): Promise<ProgramData> => {
    const response = await api.post('/admin/programs', data);
    return response.data;
};
export const updateProgram = async (id: number, data: any): Promise<ProgramData> => {
    const response = await api.put(`/admin/programs/${id}`, data);
    return response.data;
};
export const deleteProgram = async (id: number): Promise<void> => {
    await api.delete(`/admin/programs/${id}`);
};

// Levels
export const createLevel = async (programId: number, data: any): Promise<LevelData> => {
    const response = await api.post(`/admin/programs/${programId}/levels`, data);
    return response.data;
};
export const updateLevel = async (levelId: number, data: any): Promise<LevelData> => {
    const response = await api.put(`/admin/levels/${levelId}`, data);
    return response.data;
};
export const deleteLevel = async (levelId: number): Promise<void> => {
    await api.delete(`/admin/levels/${levelId}`);
};

// Units
export const createUnit = async (levelId: number, data: any): Promise<UnitData> => {
    const response = await api.post(`/admin/levels/${levelId}/units`, data);
    return response.data;
};
export const updateUnit = async (unitId: number, data: any): Promise<UnitData> => {
    const response = await api.put(`/admin/units/${unitId}`, data);
    return response.data;
};
export const deleteUnit = async (unitId: number): Promise<void> => {
    await api.delete(`/admin/units/${unitId}`);
};

// Lessons
export const createLesson = async (unitId: number, data: any): Promise<LessonData> => {
    const response = await api.post(`/admin/units/${unitId}/lessons`, data);
    return response.data;
};
export const updateLesson = async (lessonId: number, data: any): Promise<LessonData> => {
    const response = await api.put(`/admin/lessons/${lessonId}`, data);
    return response.data;
};
export const deleteLesson = async (lessonId: number): Promise<void> => {
    await api.delete(`/admin/lessons/${lessonId}`);
};
