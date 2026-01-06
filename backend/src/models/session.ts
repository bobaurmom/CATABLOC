
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/sequelize";
import { Level } from "./Level";

interface SessionAttributes {
    session_id: number;
    level_id: number;
    user_id: number;
    started_at: Date;
    ended_at?: Date;
    is_completed: boolean;
}

interface SessionCreationAttributes extends Optional<SessionAttributes, 'session_id' | 'started_at' | 'is_completed'> {}

export class Session extends Model<SessionAttributes, SessionCreationAttributes> implements SessionAttributes {
    public session_id!: number;
    public level_id!: number;
    public user_id!: number;
    public started_at!: Date;
    public ended_at?: Date;
    public is_completed!: boolean;
    public Level?: Level;
}

Session.init({
    session_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    level_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    started_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    ended_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    is_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_completed',
    },
}, {
    sequelize,
    tableName: 'sessions',
    underscored: true,
    timestamps: false, 
});

export default Session;