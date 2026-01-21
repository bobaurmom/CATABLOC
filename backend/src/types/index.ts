// TypeScript type definitions for the CATABLOC backend
// TODO: Add your custom types here



export interface UserType {
  id: number;
  role: 'student' | 'teacher' | 'admin';
  username: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

export interface LevelSession {
  id: string;
  user_id: number;
  level_id: number;
  score: number;
  start_time: Date;
  end_time?: Date;
  completed: boolean;
}