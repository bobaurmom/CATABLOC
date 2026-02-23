import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/sequelize";

interface game {
    game_id: number;
    title: string;
    description: string;
    game_type: 'puzzle' | 'kibble' | 'quiz';
    created_at?: Date;
    updated_at?: Date;
}
interface gameCreationAttributes extends Optional<game, 'game_id' | 'created_at' | 'updated_at'> {}
export class Game extends Model<game, gameCreationAttributes> implements game {
    public game_id!: number;
    public title!: string;
    public description!: string;
    public game_type!: 'puzzle' | 'kibble' | 'quiz';
}

Game.init({
    game_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    game_type: {
        type: DataTypes.ENUM('puzzle', 'kibble'),
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'games',
    underscored: true,
    timestamps: false,
});
export default Game;