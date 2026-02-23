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
    difficulty: 'easy' | 'medium' | 'hard';
    time_limit?: number; 
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

interface LevelCreationAttributes extends Optional<LevelAttributes, 'level_id' | 'created_at' | 'updated_at'> {}
interface LevelProgressCreationAttributes extends Optional<levelProgress, 'last_played_at'> {}
export class Level extends Model<LevelAttributes, LevelCreationAttributes> implements LevelAttributes {
    public level_id!: number;
    public game_id!: number;
    public level_number!: number;
    public title!: string;
    public description!: string;
    public difficulty!: 'easy' | 'medium' | 'hard';
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
        references: {
            model: 'games',
            key: 'game_id',
        },
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

    difficulty: {
        type: DataTypes.ENUM('easy', 'medium', 'hard'),
        defaultValue: 'easy',
    },
    time_limit: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    }, 
    {
    sequelize,
    tableName: 'levels',
    underscored: true,
    timestamps: true,
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

