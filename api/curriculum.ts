import client from './client';
import { Program, Level, Unit, Lesson } from '../noukpikplon/src/context/AppContext';

export const curriculumApi = {
    // Programs
    getPrograms: () => client.get('/curriculum/programs'),
    createProgram: (data: Partial<Program>) => client.post('/curriculum/programs', data),

    // Levels
    getLevels: (programId: string) => client.get(`/curriculum/programs/${programId}/levels`),
    createLevel: (programId: string, data: Partial<Level>) => client.post(`/curriculum/programs/${programId}/levels`, data),
    updateLevel: (levelId: string, data: Partial<Level>) => client.put(`/curriculum/levels/${levelId}`, data),

    // Units
    createUnit: (levelId: string, data: Partial<Unit>) => client.post(`/curriculum/levels/${levelId}/units`, data),
    updateUnit: (unitId: string, data: Partial<Unit>) => client.put(`/curriculum/units/${unitId}`, data),

    // Lessons
    createLesson: (unitId: string, data: Partial<Lesson>) => client.post(`/curriculum/units/${unitId}/lessons`, data),
    updateLesson: (lessonId: string, data: Partial<Lesson>) => client.put(`/curriculum/lessons/${lessonId}`, data),
    deleteLesson: (lessonId: string) => client.delete(`/curriculum/lessons/${lessonId}`),
};
