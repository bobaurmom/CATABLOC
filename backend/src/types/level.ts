
interface LevelAttributes {
    level_id: number;
    name: string;
    difficulty: 'easy' | 'medium' | 'hard';
    min_exp: number;
    max_exp: number;
    badge_url: string;
    created_at?: Date;
    updated_at?: Date;
}
interface levelProgress{
    user_id: number;
    level_id: number;
    best_score: number;
    attempts: number;
    completed: 'completed' | 'in_progress' | 'not_started';
    last_played_at?: Date;
}