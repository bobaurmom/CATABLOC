// TypeScript type definitions for the CATABLOC backend
// TODO: Add your custom types here



export interface UserType {
  id: number;
  role: 'student' | 'teacher' | 'admin';
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LevelSession {
  id: string;
  userId: number;
  levelId: number;
  score: number;
  startTime: Date;
  endTime?: Date;
  completed: boolean;
}