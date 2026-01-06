import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize";

export class Action extends Model {
    public action_id!: number;
    public session_id!: number;
    public codeblock_id!: number;
    public action_type!: 'execute' | 'next' | 'undo' | 'reset' | 'delete';
    public action_result!: 'success' | 'failure';
}

Action.init({
    action_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    session_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    codeblock_id: {
        type: DataTypes.INTEGER,
        allowNull: true, 
    },
    action_type: {
        type: DataTypes.ENUM('execute', 'next', 'undo', 'reset', 'delete'),
        allowNull: false,
    },
    action_result: {
        type: DataTypes.ENUM('success', 'failure'),
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'actions',
    underscored: true,
    timestamps: true, 
});

export default Action;