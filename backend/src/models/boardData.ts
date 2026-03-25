import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/sequelize";

interface BoardDataAttributes {
    board_data_id: number;
    level_id: number;
    game_id: number;
    grid_size: number;
    obstacles: string;      
    start_position: string; 
    goal_position: string;  
    level_layout?: LevelLayout;
    block_limit?: number;
    available_codeblocks?: string;
    created_at?: Date;
    updated_at?: Date;
}
interface LevelLayout {
  width: number;
  height: number;
  cat_start: { x: number; y: number };
  facing: 'up' | 'down' | 'left' | 'right';
  goal: { x: number; y: number };
  obstacles: Array<{ x: number; y: number }>;
}
interface BoardDataCreationAttributes extends Optional<BoardDataAttributes, 'board_data_id'> {}

export class BoardData extends Model<BoardDataAttributes, BoardDataCreationAttributes> implements BoardDataAttributes {
    public board_data_id!: number;
    public level_id!: number;
    public game_id!: number;
    public grid_size!: number;
    public obstacles!: string;
    public start_position!: string;
    public goal_position!: string;
    public level_layout?: LevelLayout;
    public block_limit?: number;
    public available_codeblocks?: string;
    public created_at?: Date;
    public updated_at?: Date;   
}

BoardData.init({
    board_data_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    level_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true, 
    },
    game_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    grid_size: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 5, 
    },
    obstacles: {
        type: DataTypes.TEXT, 
        allowNull: false,
        defaultValue: '[]',
    },
    start_position: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    goal_position: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    level_layout: {
        type: DataTypes.JSONB,
        allowNull: true,    
    },
    block_limit: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    available_codeblocks: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: '[]',
    },
}, {
    sequelize,
    tableName: 'board_data',
    underscored: true,
    timestamps: true,
});

export default BoardData;