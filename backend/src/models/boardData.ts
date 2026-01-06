import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/sequelize";

interface BoardDataAttributes {
    board_data_id: number;
    level_id: number;
    grid_size: number;
    obstacles: string;      
    start_position: string; 
    goal_position: string;  
    created_at?: Date;
    updated_at?: Date;
}

interface BoardDataCreationAttributes extends Optional<BoardDataAttributes, 'board_data_id'> {}

export class BoardData extends Model<BoardDataAttributes, BoardDataCreationAttributes> implements BoardDataAttributes {
    public board_data_id!: number;
    public level_id!: number;
    public grid_size!: number;
    public obstacles!: string;
    public start_position!: string;
    public goal_position!: string;
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
}, {
    sequelize,
    tableName: 'board_data',
    underscored: true,
    timestamps: true,
});

export default BoardData;