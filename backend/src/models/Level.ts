import { Optional } from "sequelize";
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize";

//# Level schema & metadata
interface LevelAttributes {
    level_id: number;
    game_id: number;
    level_number: number;
    title: string;
    description: string;
    available_codeblocks: string; // JSON string representing available codeblocks
    difficulty: 'easy' | 'medium' | 'hard';
    level_layout: LevelLayout; // JSON object representing level level_layout
    blocks_limit?: number;
    time_limit?: number; // in seconds
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
interface LevelLayout {
  width: number;
  height: number;
  cat_start: { x: number; y: number };
  facing: 'up' | 'down' | 'left' | 'right';
  goal: { x: number; y: number };
  obstacles: Array<{ x: number; y: number }>;
}
interface LevelCreationAttributes extends Optional<LevelAttributes, 'level_id' | 'created_at' | 'updated_at'> {}
interface LevelProgressCreationAttributes extends Optional<levelProgress, 'last_played_at'> {}
export class Level extends Model<LevelAttributes, LevelCreationAttributes> implements LevelAttributes {

    public level_id!: number;
    public game_id!: number;
    public level_number!: number;
    public title!: string;
    public description!: string;
    public available_codeblocks!: string;
    public difficulty!: 'easy' | 'medium' | 'hard';
    public level_layout!: LevelLayout;
    public blocks_limit?: number;
    public time_limit?: number;
}
export class LevelProgress extends Model<levelProgress, LevelProgressCreationAttributes> implements levelProgress {
    public user_id!: number;
    public level_id!: number;
    
    public best_score!: number;
    public attempts!: number;
    public completed!: 'completed' | 'in_progress' | 'not_started';
    public last_played_at?: Date;
}

Level.init({
    level_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    game_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    level_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    available_codeblocks: {
        type: DataTypes.TEXT, // Stores the JSON string of allowed blocks
    },
    difficulty: {
        type: DataTypes.ENUM('easy', 'medium', 'hard'),
        defaultValue: 'easy',
    },
    blocks_limit: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    time_limit: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    level_layout: {
        type: DataTypes.JSONB,
        allowNull: false,
    }, 
    }, 
    {
    sequelize,
    tableName: 'levels',
    underscored: true,
    });

LevelProgress.init({
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true, // Composite PK
  },
  level_id: {
    type: DataTypes.INTEGER,
    primaryKey: true, // Composite PK
  },
  best_score: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  completed: {
    type: DataTypes.ENUM('completed', 'in_progress', 'not_started'),
    defaultValue: 'not_started',
  },
}, {
  sequelize,
  tableName: 'level_progresses',
  underscored: true,
  timestamps: true, 
});

export default Level;

